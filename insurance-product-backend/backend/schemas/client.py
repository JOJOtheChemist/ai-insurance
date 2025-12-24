from pydantic import BaseModel
from typing import List, Optional, Any

class FamilyMemberSchema(BaseModel):
    relation: str
    name: Optional[str] = None
    age: Optional[int] = None
    status: Optional[str] = None

class PlanProductSchema(BaseModel):
    name: str
    coverage: str
    reason: Optional[str] = None
    type: str = "main"
    id: Optional[Any] = None
    product_id: Optional[Any] = None

class PlanSchema(BaseModel):
    title: str
    tag: Optional[str] = None
    budget: Optional[str] = None
    description: Optional[str] = None
    products: List[PlanProductSchema]
    reasoning: Optional[str] = None

class PlanSubmissionSchema(BaseModel):
    sessionId: str
    targetClient: str
    plan: PlanSchema
    reasoning: Optional[str] = None

class IntelligenceUpdateSchema(BaseModel):
    # 下面两个二选一，用于定位目标客户
    clientId: Optional[int] = None
    targetClient: Optional[str] = None # 新增：客户姓名或标识
    
    sessionId: str # 必填
    salespersonId: int
    
    # 画像更新
    profileUpdates: Optional[dict] = None
    # 家庭成员
    familyMembers: Optional[List[FamilyMemberSchema]] = None
    # 跟进摘要
    followUpSummary: Optional[str] = None

class SessionBindSchema(BaseModel):
    session_id: str
    client_id: int
