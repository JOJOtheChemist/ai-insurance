from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Any
from core.database import get_db
from models.client import Client
from models.family_member import FamilyMember
from models.follow_up import FollowUp
from models.chat_session import ChatSession
from models.session_client_link import SessionClientLink
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/clients", tags=["客户管理"])

# --- Schema 定义 ---

class FamilyMemberSchema(BaseModel):
    relation: str
    name: Optional[str] = None
    age: Optional[int] = None
    status: Optional[str] = None

class IntelligenceUpdateSchema(BaseModel):
    # 下面两个二选一，用于定位目标客户
    clientId: Optional[int] = None
    targetClient: Optional[str] = None # 新增：客户姓名或标识
    
    sessionId: str # 必填
    salespersonId: int
    
    # 画像更新
    profileUpdates: Optional[dict] = None
    # 家庭成员
    familyMembers: Optional[List[FamilyMemberSchema]] = None
    # 跟进摘要
    followUpSummary: Optional[str] = None

# --- API 实现 ---

@router.post("/update-intelligence")
async def update_intelligence(data: IntelligenceUpdateSchema, db: Session = Depends(get_db)):
    """
    AI 驱动的超级更新接口 (多主体支持版)：
    1. 根据 clientId 或 targetClient 定位/创建客户。
    2. 确保 Session 存在，并建立 Session-Client 关联 (如果尚未关联)。
    3. 进行画像、家庭成员、跟进记录的增量更新。
    """
    client_id = data.clientId
    
    # 1. 确保 Session 存在
    session = db.query(ChatSession).filter(ChatSession.id == data.sessionId).first()
    if not session:
        session = ChatSession(id=data.sessionId, salesperson_id=data.salespersonId)
        db.add(session)
        db.commit()
    
    # 2. 定位或创建客户
    if not client_id:
        if data.targetClient:
            # 尝试按姓名+销售ID查找
            # 注意：实际生产中可能需要更复杂的排重逻辑 (手机号等)
            exist_client = db.query(Client).filter(
                Client.name == data.targetClient,
                Client.salesperson_id == data.salespersonId
            ).first()
            
            if exist_client:
                client_id = exist_client.id
            else:
                # 创建新客户
                new_client = Client(
                    name=data.targetClient,
                    salesperson_id=data.salespersonId,
                    create_time=datetime.utcnow()
                )
                db.add(new_client)
                db.commit()
                db.refresh(new_client)
                client_id = new_client.id
        else:
            # 既没有ID也没有姓名，如果是首次且AI没给名字，我们可能需要一个"未知客户"或报错
            # 这里为了健壮性，若 profileUpdates 里有 name 也行
            name_in_profile = (data.profileUpdates or {}).get("name")
            if name_in_profile:
                 new_client = Client(
                    name=name_in_profile,
                    salesperson_id=data.salespersonId,
                    create_time=datetime.utcnow()
                )
                 db.add(new_client)
                 db.commit()
                 db.refresh(new_client)
                 client_id = new_client.id
            else:
                # 实在无法确定客户，仅记录 Session 摘要 (暂不处理此类边缘情况，返回错误)
                raise HTTPException(status_code=400, detail="Missing clientId or targetClient to identify the customer.")

    # 3. 建立 Session-Client 关联 (多对多)
    link = db.query(SessionClientLink).filter(
        SessionClientLink.session_id == data.sessionId,
        SessionClientLink.client_id == client_id
    ).first()
    
    if not link:
        new_link = SessionClientLink(session_id=data.sessionId, client_id=client_id)
        db.add(new_link)
        db.commit()

    # 4. 获取客户实体进行更新
    client = db.query(Client).filter(Client.id == client_id).first()

    # 5. 差异化更新画像 (profileUpdates)
    if data.profileUpdates:
        # 简单增量合并逻辑
        for key, value in data.profileUpdates.items():
            if hasattr(client, key):
                old_val = getattr(client, key)
                if key == "risk_factors" or key == "needs" or key == "resistances" or key == "contacts":
                     #对于列表字段，执行合并去重
                     if isinstance(old_val, list) and isinstance(value, list):
                         new_list = list(set(old_val + value))
                         setattr(client, key, new_list)
                     elif value is not None:
                         # 如果旧值为空，直接赋值
                         setattr(client, key, value)
                else:
                    # 标量字段直接覆盖 (如 age, budget)
                    if value is not None:
                        setattr(client, key, value)
        client.update_time = datetime.utcnow()

    # 6. 家庭成员处理
    if data.familyMembers:
        for fm_data in data.familyMembers:
            fm = db.query(FamilyMember).filter(
                FamilyMember.client_id == client_id, 
                FamilyMember.relation == fm_data.relation
            ).first()
            if fm:
                fm.name = fm_data.name or fm.name
                fm.age = fm_data.age or fm.age
                fm.status = fm_data.status or fm.status
            else:
                new_fm = FamilyMember(
                    client_id=client_id,
                    relation=fm_data.relation,
                    name=fm_data.name,
                    age=fm_data.age,
                    status=fm_data.status
                )
                db.add(new_fm)

    # 7. 记录跟进摘要 (带 session_id)
    if data.followUpSummary:
        new_follow_up = FollowUp(
            client_id=client_id,
            session_id=data.sessionId,
            type="AI",
            content=data.followUpSummary,
            create_time=datetime.utcnow()
        )
        db.add(new_follow_up)

    db.commit()
    return {"status": "success", "client_id": client_id, "linked_session": data.sessionId}

@router.get("/{client_id}")
async def get_client_detail(client_id: int, db: Session = Depends(get_db)):
    """获取全景档案详情"""
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    return {
        "id": client.id,
        "name": client.name,
        "role": client.role,
        "age": client.age,
        "annual_budget": client.annual_budget,
        "annual_income": client.annual_income,
        "location": client.location,
        "marital_status": client.marital_status,
        "risk_factors": client.risk_factors,
        "needs": client.needs,
        "resistances": client.resistances,
        "family_structure": [
            {"relation": m.relation, "name": m.name, "age": m.age, "status": m.status} 
            for m in client.family_members
        ],
        "follow_ups": [
            {"type": f.type, "content": f.content, "time": f.create_time.strftime("%Y-%m-%d %H:%M"), "session_id": f.session_id} 
            for f in sorted(client.follow_ups, key=lambda x: x.create_time, reverse=True)
        ],
        "contacts": client.contacts
    }
