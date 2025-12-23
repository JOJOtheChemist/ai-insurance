from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from core.database import get_db
from models.user import User
from services.credit_service import CreditService

router = APIRouter(prefix="/credits", tags=["积分管理"])


@router.get("/balance")
async def get_balance(
    user_id: int = Query(..., description="用户ID"),
    db: Session = Depends(get_db)
):
    """
    获取用户积分余额
    """
    balance = CreditService.get_balance(db, user_id)
    return {"balance": balance, "user_id": user_id}


@router.post("/deduct")
async def deduct_credits(
    user_id: int = Query(..., description="用户ID"),
    amount: int = Query(..., description="扣除积分数量"),
    session_id: Optional[str] = Query(None, description="关联的会话ID"),
    token_count: Optional[int] = Query(None, description="Token消耗数"),
    description: Optional[str] = Query("AI对话消费", description="描述"),
    db: Session = Depends(get_db)
):
    """
    扣除用户积分
    
    - 积分不足时返回 402 错误
    - 成功时返回扣除后的余额
    """
    return CreditService.deduct_credits(
        db, user_id, amount, session_id, token_count, description
    )


@router.post("/topup")
async def topup_credits(
    user_id: int = Query(..., description="用户ID"),
    amount: int = Query(..., description="充值积分数量"),
    description: Optional[str] = Query("积分充值", description="描述"),
    db: Session = Depends(get_db)
):
    """
    充值用户积分
    """
    return CreditService.topup_credits(db, user_id, amount, description)


@router.get("/transactions")
async def get_transactions(
    user_id: int = Query(..., description="用户ID"),
    limit: int = Query(20, description="返回数量限制"),
    offset: int = Query(0, description="分页偏移"),
    db: Session = Depends(get_db)
):
    """
    获取积分交易记录
    """
    transactions = CreditService.get_transactions(db, user_id, limit, offset)
    return {"transactions": transactions, "user_id": user_id}
