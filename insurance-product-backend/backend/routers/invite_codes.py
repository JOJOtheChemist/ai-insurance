from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from core.invite_logic import generate_random_invite_code, get_unused_codes
from models.invite_code import InviteCode

router = APIRouter(prefix="/invite-codes", tags=["邀请码管理"])

@router.post("/generate")
async def generate_codes(count: int = 1, db: Session = Depends(get_db)):
    if count < 1 or count > 50:
        raise HTTPException(status_code=400, detail="数量必须在1-50之间")
    
    new_codes = []
    for _ in range(count):
        code_str = generate_random_invite_code()
        invite = InviteCode(code=code_str)
        db.add(invite)
        new_codes.append(code_str)
    
    db.commit()
    return {"generated_codes": new_codes}

@router.get("/unused")
async def list_unused_codes(limit: int = 10, db: Session = Depends(get_db)):
    codes = get_unused_codes(db, limit=limit)
    return {"unused_codes": [c.code for c in codes]}
