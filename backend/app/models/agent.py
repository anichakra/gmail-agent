"""
Agent-related models.
"""
from pydantic import BaseModel
from typing import List, Optional


class ChatMessage(BaseModel):
    """Model for chat messages."""
    role: str
    content: str


class ChatRequest(BaseModel):
    """Model for chat requests."""
    message: str
    user_id: str
    conversation_history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    """Model for chat responses."""
    response: str
    conversation_id: Optional[str] = None