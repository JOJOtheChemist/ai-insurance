from sqlalchemy import Column, BigInteger, String, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base

class InviteCode(Base):
    """邀请码模型"""
    __tablename__ = "invite_code"
    
    id = Column(BigInteger, primary_key=True, index=True)
    code = Column(String(64), unique=True, nullable=False, index=True)
    is_used = Column(Boolean, default=False)
    used_by = Column(BigInteger, ForeignKey("users.id"), nullable=True) # 修改为 users.id
    used_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关联关系
    user = relationship("User", foreign_keys=[used_by])
    
    def __repr__(self):
        return f"<InviteCode(id={self.id}, code='{self.code}', used_by={self.used_by})>"
