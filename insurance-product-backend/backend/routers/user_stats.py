from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from core.database import get_db
from models.user import User
from models.client import Client
from services.credit_service import CreditService

router = APIRouter(prefix="/users", tags=["用户信息"])


from core.deps import get_current_user

@router.get("/stats")
async def get_user_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取用户统计数据
    Returns:
        - balance: 积分余额
        - clients_count: 累计客户数
        - plans_count: 生成方案数
        - tokens_consumed_today: 今日消耗tokens (预留字段)
    """
    # 获取用户ID
    user_id = current_user.id
    
    # 获取积分余额
    balance = CreditService.get_balance(db, user_id)
    
    # 获取累计客户数（每个用户只看自己的客户）
    clients_count = db.query(func.count(Client.id)).filter(
        Client.salesperson_id == user_id
    ).scalar() or 0
    
    # 获取总方案数(统计该用户所有客户的 proposed_plans 数量)
    clients_with_plans = db.query(Client).filter(
        Client.salesperson_id == user_id
    ).all()
    
    plans_count = sum(
        len(client.proposed_plans) if client.proposed_plans else 0 
        for client in clients_with_plans
    )
    
    # 今日消耗tokens (暂时返回 0，未来可接入实际统计)
    tokens_consumed_today = 0
    
    return {
        "user_id": user_id,
        "balance": balance,
        "clients_count": clients_count,
        "plans_count": plans_count,
        "tokens_consumed_today": tokens_consumed_today
    }
