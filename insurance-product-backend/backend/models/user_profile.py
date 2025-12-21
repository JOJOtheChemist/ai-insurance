from sqlalchemy import Column, BigInteger, String, DateTime, SmallInteger
from sqlalchemy.sql import func
from core.database import Base

class UserProfile(Base):
    """用户资料与设置模型"""
    __tablename__ = "user_profile"

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, unique=True, nullable=False, index=True)
    
    # 隐私设置
    profile_visibility = Column(String(20), default='public')    # 'public', 'friends', 'private'
    allow_follow = Column(SmallInteger, default=1)               # 是否允许被关注
    show_study_stats = Column(SmallInteger, default=1)           # 是否显示学习统计
    
    # 通知设置
    email_notification = Column(SmallInteger, default=1)         # 邮件通知
    push_notification = Column(SmallInteger, default=1)          # 推送通知
    
    # 其他设置
    theme = Column(String(20), default='light')                  # 主题：'light', 'dark'
    language = Column(String(10), default='zh-CN')               # 语言
    timezone = Column(String(50), default='Asia/Shanghai')       # 时区
    
    create_time = Column(DateTime(timezone=True), server_default=func.now())
    update_time = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<UserProfile(user_id={self.user_id})>"
