from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, BigInteger, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from core.database import Base

class FollowUp(Base):
    __tablename__ = "follow_ups"

    id = Column(BigInteger, primary_key=True, index=True)
    client_id = Column(BigInteger, ForeignKey("clients.id"), nullable=False)
    
    type = Column(String(20)) # AI总结, 电话, 微信, 面谈
    content = Column(Text)
    session_id = Column(String(100), nullable=True) # 来源会话ID
    create_time = Column(DateTime, default=datetime.utcnow)

    # 关联
    client = relationship("Client", back_populates="follow_ups")
