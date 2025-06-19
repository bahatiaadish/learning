import openai
from typing import Optional
from app.models import ContentLevel, AIQuery, AIResponse
from app.database import db

openai.api_key = "your-openai-api-key"

class AIService:
    def __init__(self):
        self.client = openai.OpenAI(api_key="demo-key")
    
    async def get_ai_response(self, user_id: int, query: AIQuery) -> AIResponse:
        user = db.users.get(user_id)
        if not user:
            raise ValueError("User not found")
        
        if user.ai_queries_used >= user.ai_queries_limit:
            raise ValueError("AI query limit exceeded")
        
        context = self._build_context(query.context_topic_id, query.context_level)
        
        try:
            response = await self._get_mock_response(query.query, context)
            
            user.ai_queries_used += 1
            db.users[user_id] = user
            
            return AIResponse(
                response=response,
                queries_remaining=user.ai_queries_limit - user.ai_queries_used
            )
        except Exception as e:
            return AIResponse(
                response=f"I'm currently in demo mode. Your question '{query.query}' would normally be processed by ChatGPT. {context}",
                queries_remaining=user.ai_queries_limit - user.ai_queries_used
            )
    
    def _build_context(self, topic_id: Optional[int], level: Optional[ContentLevel]) -> str:
        if not topic_id:
            return "General AI assistant for the training portal."
        
        topic = db.topics.get(topic_id)
        if not topic:
            return "General AI assistant for the training portal."
        
        context = f"You are an AI assistant helping with {topic.title} content"
        if level:
            context += f" at the {level.value} level"
        
        context += f". The topic covers: {topic.description}"
        return context
    
    async def _get_mock_response(self, query: str, context: str) -> str:
        responses = {
            "what": f"Great question! Based on the {context.lower()}, here's what you need to know...",
            "how": f"Here's a step-by-step approach to help you understand this concept...",
            "why": f"The reasoning behind this is important to understand...",
            "explain": f"Let me break this down for you in simple terms...",
            "example": f"Here's a practical example that illustrates this concept...",
        }
        
        query_lower = query.lower()
        for key, response in responses.items():
            if key in query_lower:
                return f"{response} This is a demo response. In production, this would be powered by ChatGPT with full context about your current learning topic."
        
        return f"Thank you for your question about '{query}'. In the full version, I would provide a detailed, context-aware response based on your current learning topic and level. This is currently a demo response."

ai_service = AIService()
