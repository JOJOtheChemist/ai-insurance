from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Any
from core.database import get_db
from core.sse_manager import sse_manager
from core.sse_notifier import notify_client_updated, sse_notify
from models.client import Client
from models.session_client_link import SessionClientLink
from models.chat_session import ChatSession

# Import Schema and Service
from schemas.client import (
    IntelligenceUpdateSchema, 
    PlanSubmissionSchema, 
    PlanSchema,
    FamilyMemberSchema,
    SessionBindSchema
)
from services.client_service import ClientService
from core.deps import get_current_user
from models.user import User

router = APIRouter(prefix="/clients", tags=["客户管理"])

# --- API 实现 ---

@router.post("/update-intelligence")
@sse_notify(event_type="client_updated")
async def update_client_intelligence(data: IntelligenceUpdateSchema, db: Session = Depends(get_db)):
    """
    AI 驱动的超级更新接口 (多主体支持版) - Refactored
    """
    return ClientService.update_intelligence(data, db)

@router.post("/submit-plan")
@sse_notify(event_type="client_updated")
async def submit_insurance_plan(data: PlanSubmissionSchema, db: Session = Depends(get_db)):
    """提交并保存保险方案 - Refactored"""
    return ClientService.submit_plan(data, db)

@router.get("/sessions/history")
async def get_grouped_chat_history(
    salesperson_id: int = 1, # Deprecated: value ignored
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取分组的历史会话列表 - Refactored
    """
    return ClientService.get_grouped_history(current_user.id, db)

@router.get("/list")
async def get_clients_list(
    salesperson_id: Optional[int] = None,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取客户列表
    (Logic kept simple enough to remain in controller for now, or move if it grows)
    """
    query = db.query(Client)
    
    # 强制仅显示当前登录销售的客户
    query = query.filter(Client.salesperson_id == current_user.id)
    
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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    搜索客户 (按姓名模糊匹配)
    """
    if not keyword:
         return {"results": []}

    query = db.query(Client).filter(Client.name.ilike(f"%{keyword}%"))
    
    # 强制过滤当前用户
    query = query.filter(Client.salesperson_id == current_user.id)
        
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
async def get_client_detail(client_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """获取全景档案详情"""
    # 增加权限校验
    client = db.query(Client).filter(Client.id == client_id, Client.salesperson_id == current_user.id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found or access denied")
    
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



