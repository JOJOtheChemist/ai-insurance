import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # JWT 配置
    SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "aB3dF9gH2jK5mN8pQ1rS4tU7vW0xY6zA9bC2dE5fG8hJ")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7天
    
    # 数据库配置已经在 core/database.py 中处理，这里保留引用
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
