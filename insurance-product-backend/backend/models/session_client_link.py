from sqlalchemy import Column, Integer, String, ForeignKey, BigInteger
from core.database import Base

class SessionClientLink(Base):
    __tablename__ = "session_client_links"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), ForeignKey("chat_sessions.id"), nullable=False, index=True)
    client_id = Column(BigInteger, ForeignKey("clients.id"), nullable=False, index=True)
