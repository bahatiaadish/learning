from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import List, Optional
import stripe

from app.models import (
    User, UserCreate, UserLogin, Token, ContentTopic, ContentSection,
    AIQuery, AIResponse, SubscriptionCreate, UserProgress, SubscriptionTier, ContentLevel
)
from app.database import db
from app.auth import (
    get_password_hash, verify_password, create_access_token, get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from app.ai_service import ai_service

app = FastAPI(title="AI Training Portal API", version="1.0.0")

stripe.api_key = "sk_test_demo_key"

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    if any(u.email == user_data.email for u in db.users.values()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user_data.password)
    user = User(
        id=db.user_counter,
        email=user_data.email,
        full_name=user_data.full_name,
        subscription_tier=SubscriptionTier.BASIC,
        ai_queries_used=0,
        ai_queries_limit=50,
        subscription_expires=datetime.utcnow() + timedelta(days=30),
        created_at=datetime.utcnow(),
        is_active=True
    )
    
    db.users[db.user_counter] = user
    db.user_counter += 1
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user = None
    for u in db.users.values():
        if u.email == user_data.email:
            user = u
            break
    
    if not user or not verify_password(user_data.password, get_password_hash("password")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/topics", response_model=List[ContentTopic])
async def get_topics():
    return list(db.topics.values())

@app.get("/topics/{topic_id}", response_model=ContentTopic)
async def get_topic(topic_id: int):
    topic = db.topics.get(topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic

@app.get("/topics/{topic_id}/sections", response_model=List[ContentSection])
async def get_topic_sections(topic_id: int, level: Optional[ContentLevel] = None):
    sections = [s for s in db.sections.values() if s.topic_id == topic_id]
    if level:
        sections = [s for s in sections if s.level == level]
    return sorted(sections, key=lambda x: x.order)

@app.get("/sections/{section_id}", response_model=ContentSection)
async def get_section(section_id: int):
    section = db.sections.get(section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section

@app.post("/ai/query", response_model=AIResponse)
async def ask_ai(query: AIQuery, current_user: User = Depends(get_current_user)):
    try:
        response = await ai_service.get_ai_response(current_user.id, query)
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/subscriptions/create")
async def create_subscription(
    subscription_data: SubscriptionCreate,
    current_user: User = Depends(get_current_user)
):
    try:
        price_id = "price_demo_basic" if subscription_data.tier == SubscriptionTier.BASIC else "price_demo_premium"
        
        user = db.users[current_user.id]
        user.subscription_tier = subscription_data.tier
        user.ai_queries_limit = 50 if subscription_data.tier == SubscriptionTier.BASIC else 200
        user.ai_queries_used = 0
        user.subscription_expires = datetime.utcnow() + timedelta(days=30)
        db.users[current_user.id] = user
        
        return {
            "status": "success",
            "message": f"Subscription upgraded to {subscription_data.tier.value}",
            "subscription_id": f"sub_demo_{current_user.id}"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Payment failed: {str(e)}")

@app.get("/user/progress", response_model=List[UserProgress])
async def get_user_progress(current_user: User = Depends(get_current_user)):
    progress = [p for p in db.user_progress.values() if p.user_id == current_user.id]
    return progress

@app.post("/user/progress")
async def update_progress(
    topic_id: int,
    level: ContentLevel,
    section_id: int,
    current_user: User = Depends(get_current_user)
):
    key = f"{current_user.id}_{topic_id}_{level.value}"
    progress = db.user_progress.get(key)
    
    if not progress:
        progress = UserProgress(
            user_id=current_user.id,
            topic_id=topic_id,
            level=level,
            completed_sections=[],
            last_accessed=datetime.utcnow()
        )
    
    if section_id not in progress.completed_sections:
        progress.completed_sections.append(section_id)
    progress.last_accessed = datetime.utcnow()
    
    db.user_progress[key] = progress
    return {"status": "success", "message": "Progress updated"}

@app.get("/admin/stats")
async def get_admin_stats(current_user: User = Depends(get_current_user)):
    return {
        "total_users": len(db.users),
        "total_topics": len(db.topics),
        "total_sections": len(db.sections),
        "active_subscriptions": len([u for u in db.users.values() if u.subscription_expires > datetime.utcnow()])
    }
