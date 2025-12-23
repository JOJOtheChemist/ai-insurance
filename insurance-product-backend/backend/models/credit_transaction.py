from sqlalchemy import Column, BigInteger, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from core.database import Base

class CreditTransaction(Base):
    """积分交易流水"""
    __tablename__ = "credit_transactions"

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    
    # 交易类型: topup(充值), consume(消费), bonus(赠送), refund(退款)
    transaction_type = Column(String(20), nullable=False)
    
    # 金额 (正数为增加，负数为扣除)
    amount = Column(Integer, nullable=False)
    
    # 交易后余额
    balance_after = Column(Integer, nullable=False)
    
    # 描述/备注
    description = Column(String(255))
    
    # 关联的会话ID (消费时记录)
    session_id = Column(String(100), nullable=True)
    
    # Token 消耗详情 (消费时记录)
    token_count = Column(Integer, nullable=True)
    
    create_time = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<CreditTransaction(id={self.id}, user_id={self.user_id}, type='{self.transaction_type}', amount={self.amount})>"
