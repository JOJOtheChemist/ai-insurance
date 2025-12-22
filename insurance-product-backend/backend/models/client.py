from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, BigInteger, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from core.database import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(BigInteger, primary_key=True, index=True)
    salesperson_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # 基础信息
    name = Column(String(50), nullable=False)
    role = Column(String(100))
    age = Column(Integer)
    annual_budget = Column(String(50))
    marital_status = Column(String(50))
    annual_income = Column(String(50))
    location = Column(String(100))
    
    # 画像与元数据 (JSONB)
    risk_factors = Column(JSON, default=list)  # 风险点数组
    needs = Column(JSON, default=list)        # 需求点数组
    resistances = Column(JSON, default=list)  # 抗拒点数组
    contacts = Column(JSON, default=list)     # 常用联系人数组
    proposed_plans = Column(JSON, default=list) # 推荐保险方案数组
    
    create_time = Column(DateTime, default=datetime.utcnow)
    update_time = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关联
    family_members = relationship("FamilyMember", back_populates="client", cascade="all, delete-orphan")
    follow_ups = relationship("FollowUp", back_populates="client", cascade="all, delete-orphan")
    # chat_sessions relationship is now handled via SessionClientLink
