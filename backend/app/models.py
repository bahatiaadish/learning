from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class ContentLevel(str, Enum):
    NOVICE = "novice"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    PRO = "pro"

class SubscriptionTier(str, Enum):
    BASIC = "basic"
    PREMIUM = "premium"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: int
    email: str
    full_name: str
    subscription_tier: SubscriptionTier
    ai_queries_used: int
    ai_queries_limit: int
    subscription_expires: Optional[datetime]
    created_at: datetime
    is_active: bool

class Token(BaseModel):
    access_token: str
    token_type: str

class ContentTopic(BaseModel):
    id: int
    title: str
    description: str
    category: str
    levels: List[ContentLevel]

class ContentSection(BaseModel):
    id: int
    topic_id: int
    level: ContentLevel
    title: str
    content: str
    order: int

class AIQuery(BaseModel):
    query: str
    context_topic_id: Optional[int] = None
    context_level: Optional[ContentLevel] = None

class AIResponse(BaseModel):
    response: str
    queries_remaining: int

class SubscriptionCreate(BaseModel):
    tier: SubscriptionTier
    payment_method_id: str

class UserProgress(BaseModel):
    user_id: int
    topic_id: int
    level: ContentLevel
    completed_sections: List[int]
    last_accessed: datetime
