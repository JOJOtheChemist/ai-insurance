from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Integer
from sqlalchemy.sql import func
from core.database import Base

class User(Base):
    """用户核心模型"""
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    invite_code = Column(String(50), nullable=True) # 注册时使用的邀请码
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    balance = Column(Integer, default=300)  # 积分余额，新用户默认300积分
    
    create_time = Column(DateTime(timezone=True), server_default=func.now())
    update_time = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"
