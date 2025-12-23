
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from core.database import get_db
from models.remark import Remark

router = APIRouter(
    tags=["remarks"],
    responses={404: {"description": "Not found"}},
)

class RemarkCreate(BaseModel):
    target_id: str
    content: str

class RemarkResponse(BaseModel):
    id: int
    target_id: str
    content: str
    created_at: str

@router.post("/remarks", response_model=dict)
def create_remark(remark: RemarkCreate, db: Session = Depends(get_db)):
    """
    创建一个备注
    """
    db_remark = Remark(
        target_id=remark.target_id,
        content=remark.content
    )
    db.add(db_remark)
    db.commit()
    db.refresh(db_remark)
    return {
        "status": "success", 
        "id": db_remark.id, 
        "target_id": db_remark.target_id,
        "content": db_remark.content
    }

@router.get("/remarks/{target_id}", response_model=List[dict])
def get_remarks(target_id: str, db: Session = Depends(get_db)):
    """
    获取指定 ID 的所有备注
    """
    remarks = db.query(Remark).filter(Remark.target_id == target_id).all()
    return [{
        "id": r.id, 
        "target_id": r.target_id,
        "content": r.content, 
        "created_at": r.created_at.isoformat() if r.created_at else None
    } for r in remarks]
