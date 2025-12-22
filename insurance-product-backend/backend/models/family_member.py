from sqlalchemy import Column, Integer, String, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from core.database import Base

class FamilyMember(Base):
    __tablename__ = "client_family"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(BigInteger, ForeignKey("clients.id"), nullable=False)
    
    relation = Column(String(50))  # 本人, 配偶, 子女, 父母
    name = Column(String(50))
    age = Column(Integer)
    status = Column(String(50))    # 已投保, 缺口, 正在配置
    
    # 关联
    client = relationship("Client", back_populates="family_members")
