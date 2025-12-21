from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from core.database import get_db
from core.security import verify_password, get_password_hash, create_access_token
from core.invite_logic import validate_invite_code, use_invite_code
from models.user import User
from models.user_profile import UserProfile
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/users/auth", tags=["用户认证"])

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    invite_code: str

class UserLogin(BaseModel):
    username: str
    password: str

@router.post("/register")
async def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # 验证邀请码
    if not validate_invite_code(db, user_in.invite_code):
        raise HTTPException(status_code=400, detail="无效或已使用的邀请码")
    
    # 检查用户是否存在
    if db.query(User).filter(User.username == user_in.username).first():
        raise HTTPException(status_code=400, detail="用户名已存在")
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="邮箱已注册")
    
    # 创建用户
    hashed_password = get_password_hash(user_in.password)
    new_user = User(
        username=user_in.username,
        email=user_in.email,
        password_hash=hashed_password,
        invite_code=user_in.invite_code
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # 创建用户资料
    profile = UserProfile(user_id=new_user.id)
    db.add(profile)
    
    # 消费邀请码
    use_invite_code(db, user_in.invite_code, new_user.id)
    
    db.commit()
    return {"message": "注册成功", "user_id": new_user.id}

@router.post("/login")
async def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_in.username).first()
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="用户名或密码错误")
    
    access_token = create_access_token(data={"sub": user.username, "id": user.id})
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "username": user.username}}
