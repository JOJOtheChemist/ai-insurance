from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Any
from core.database import get_db
from core.sse_manager import sse_manager
from core.sse_notifier import notify_client_updated, sse_notify
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

class PlanProductSchema(BaseModel):
    name: str
    coverage: str
    reason: Optional[str] = None
    type: str = "main"

class PlanSchema(BaseModel):
    title: str
    tag: Optional[str] = None
    budget: Optional[str] = None
    description: Optional[str] = None
    products: List[PlanProductSchema]
    reasoning: Optional[str] = None

class PlanSubmissionSchema(BaseModel):
    sessionId: str
    targetClient: str
    plan: PlanSchema
    reasoning: Optional[str] = None

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
@sse_notify(event_type="client_updated")
async def update_client_intelligence(data: IntelligenceUpdateSchema, db: Session = Depends(get_db)):
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
                if key in ["risk_factors", "needs", "resistances"]:
                    # 对于字符串列表，执行合并去重
                    if isinstance(old_val, list) and isinstance(value, list):
                        new_list = list(set(old_val + value))
                        setattr(client, key, new_list)
                    elif value is not None:
                        setattr(client, key, value)
                elif key == "contacts":
                    # 对于联系人（对象列表），执行基于姓名的合并
                    if isinstance(old_val, list) and isinstance(value, list) and len(value) > 0:
                        contact_dict = {c.get("name"): c for c in (old_val or []) if c.get("name")}
                        for new_c in value:
                            if new_c.get("name"):
                                contact_dict[new_c.get("name")] = new_c
                        setattr(client, key, list(contact_dict.values()))
                    elif value is not None:
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
    
    # SSE通知由装饰器处理
    
    return {"status": "success", "client_id": client_id, "linked_session": data.sessionId}

@router.post("/submit-plan")
@sse_notify(event_type="client_updated")
async def submit_insurance_plan(data: PlanSubmissionSchema, db: Session = Depends(get_db)):
    """提交并保存保险方案"""
    # 1. 查找客户 (按姓名和 Session 关联)
    # 先看 Session 已经关联了谁
    link = db.query(SessionClientLink).filter(
        SessionClientLink.session_id == data.sessionId
    ).order_by(SessionClientLink.id.desc()).first()
    
    client_id = None
    if link:
        client_id = link.client_id
    else:
        # 如果没关联，尝试按姓名查找
        session = db.query(ChatSession).filter(ChatSession.id == data.sessionId).first()
        salesperson_id = 1 if not session else session.salesperson_id
        
        client = db.query(Client).filter(
            Client.name == data.targetClient,
            Client.salesperson_id == salesperson_id
        ).first()
        
        if not client:
            # 创建新客户
            client = Client(
                name=data.targetClient,
                salesperson_id=salesperson_id,
                create_time=datetime.utcnow()
            )
            db.add(client)
            db.commit()
            db.refresh(client)
        
        client_id = client.id
        # 建立关联
        new_link = SessionClientLink(session_id=data.sessionId, client_id=client_id)
        db.add(new_link)
        db.commit()

    # 2. 获取客户并追加方案
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    # 构造方案对象
    new_plan = data.plan.dict()
    new_plan["created_at"] = datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    if data.reasoning:
        new_plan["reasoning"] = data.reasoning

    # 追加到 proposed_plans (JSON 列表)
    current_plans = list(client.proposed_plans or [])
    # 简单的排重逻辑：如果已经有同名方案，则覆盖，否则追加到最前面
    existing_idx = -1
    for i, p in enumerate(current_plans):
        if p.get("title") == new_plan["title"]:
            existing_idx = i
            break
    
    if existing_idx >= 0:
        current_plans[existing_idx] = new_plan
    else:
        current_plans.insert(0, new_plan)
        
    client.proposed_plans = current_plans
    client.update_time = datetime.utcnow()
    
    db.commit()
    
    return {"status": "success", "client_id": client_id, "plan_id": len(current_plans)}

@router.get("/list")
async def get_clients_list(
    salesperson_id: Optional[int] = None,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    获取客户列表
    
    Args:
        salesperson_id: 销售人员ID（可选，用于筛选）
        limit: 返回数量限制
        offset: 分页偏移量
    
    Returns:
        客户列表，包含基本信息
    """
    query = db.query(Client)
    
    # 如果提供了销售人员ID，则筛选
    if salesperson_id:
        query = query.filter(Client.salesperson_id == salesperson_id)
    
    # 按更新时间倒序排列
    query = query.order_by(Client.update_time.desc())
    
    # 分页
    total = query.count()
    clients = query.offset(offset).limit(limit).all()
    
    return {
        "total": total,
        "clients": [
            {
                "id": c.id,
                "name": c.name,
                "role": c.role,
                "age": c.age,
                "annual_budget": c.annual_budget,
                "annual_income": c.annual_income,
                "location": c.location,
                "marital_status": c.marital_status,
                "update_time": c.update_time.strftime("%Y-%m-%d %H:%M") if c.update_time else None,
                # 统计信息
                "plans_count": len(c.proposed_plans) if c.proposed_plans else 0,
                "family_members_count": len(c.family_members),
            }
            for c in clients
        ]
    }

@router.get("/search")
async def search_clients(
    keyword: str,
    salesperson_id: Optional[int] = None,
    limit: int = 5,
    db: Session = Depends(get_db)
):
    """
    搜索客户 (按姓名模糊匹配)
    """
    if not keyword:
         return {"results": []}

    query = db.query(Client).filter(Client.name.ilike(f"%{keyword}%"))
    
    if salesperson_id:
        query = query.filter(Client.salesperson_id == salesperson_id)
        
    results = query.limit(limit).all()
    
    # 返回完整结构以供 AI 使用
    return {
        "results": [
            {
                "id": c.id,
                "name": c.name,
                "role": c.role,
                "age": c.age,
                "annual_budget": c.annual_budget,
                "annual_income": c.annual_income,
                "location": c.location,
                "marital_status": c.marital_status,
                "risk_factors": c.risk_factors,
                "needs": c.needs,
                "family_structure": [
                    {"relation": m.relation, "name": m.name, "age": m.age} 
                    for m in c.family_members
                ],
                "plans_count": len(c.proposed_plans) if c.proposed_plans else 0
            }
            for c in results
        ]
    }

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
        "contacts": client.contacts,
        "proposed_plans": client.proposed_plans
    }

@router.get("/session/{session_id}")
async def get_client_by_session(session_id: str, db: Session = Depends(get_db)):
    """
    根据会话ID获取客户信息
    用于前端SSE更新后重新加载数据
    """
    # 查找session关联的client，按 ID 倒序获取最近关联的记录
    link = db.query(SessionClientLink).filter(
        SessionClientLink.session_id == session_id
    ).order_by(SessionClientLink.id.desc()).first()
    
    if not link:
        # 会话还没有关联客户，返回空
        return {"client": None}
    
    client = db.query(Client).filter(Client.id == link.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    return {
        "client": {
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
            "proposed_plans": client.proposed_plans,
            "family_structure": [
                {"relation": m.relation, "name": m.name, "age": m.age, "status": m.status} 
                for m in client.family_members
            ],
            "follow_ups": [
                {"type": f.type, "content": f.content, "time": f.create_time.strftime("%Y-%m-%d %H:%M"), "session_id": f.session_id} 
                for f in sorted(client.follow_ups, key=lambda x: x.create_time, reverse=True)
            ],
            "contacts": client.contacts,
        }
    }

@router.get("/sse/{session_id}")
async def client_sse_endpoint(session_id: str, user_id: Optional[str] = None):
    """
    建立SSE连接，监听客户信息更新
    
    Args:
        session_id: 会话ID
        user_id: 可选的用户ID
    """
    return await sse_manager.subscribe(session_id=session_id, user_id=user_id)
