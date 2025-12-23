from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from schemas.client import SessionBindSchema
from services.client_service import ClientService

router = APIRouter(prefix="/sessions", tags=["会话管理"])

@router.post("/bind")
async def bind_session(data: SessionBindSchema, db: Session = Depends(get_db)):
    """手动绑定会话与客户"""
    return ClientService.bind_session(data.session_id, data.client_id, db)
