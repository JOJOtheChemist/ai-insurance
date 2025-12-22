from sqlalchemy import Column, Integer, String, ForeignKey
from core.database import Base

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    # ID 使用字符串，因为 SDK 生成的 ID 是 "session-17..." 这种格式
    id = Column(String(100), primary_key=True, index=True)
    salesperson_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # 移除直接的 client_id，改为多对多链接或通过 FollowUp/Mapping 记录。
    # 这里我们保留会话自身的元数据
    title = Column(String(255))
    summary = Column(String(500))
    status = Column(String(50), default="active") # active, closed, archived
