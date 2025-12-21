import secrets
import string
from sqlalchemy.orm import Session
from models.invite_code import InviteCode

def generate_random_invite_code(prefix: str = "INV", length: int = 12) -> str:
    """生成随机邀请码"""
    alphabet = string.ascii_uppercase + string.digits
    random_part = ''.join(secrets.choice(alphabet) for _ in range(length))
    return f"{prefix}-{random_part}"

def get_unused_codes(db: Session, limit: int = 10):
    """获取未使用的邀请码"""
    return db.query(InviteCode).filter(InviteCode.is_used == False).limit(limit).all()

def validate_invite_code(db: Session, code: str) -> bool:
    """验证并消费邀请码"""
    invite = db.query(InviteCode).filter(InviteCode.code == code, InviteCode.is_used == False).first()
    if invite:
        return True
    return False

def use_invite_code(db: Session, code: str, user_id: int):
    """标记邀请码为已使用"""
    invite = db.query(InviteCode).filter(InviteCode.code == code).first()
    if invite:
        invite.is_used = True
        invite.used_by = user_id
        from datetime import datetime
        invite.used_at = datetime.utcnow()
        db.commit()
        return True
    return False
