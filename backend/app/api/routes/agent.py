"""
AI Agent routes for email assistance with streaming support.
"""
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from typing import Dict, Any
from pydantic import BaseModel
from core.agent import handle_frontend_request
import json
import asyncio
import uuid


router = APIRouter(prefix="/agent", tags=["agent"])


class ChatRequest(BaseModel):
    message: str
    user_id: str
    conversation_id: str = None


class ChatResponse(BaseModel):
    response: str
    conversation_id: str


@router.post("/chat/stream")
async def chat_with_agent_stream(request: ChatRequest):
    """Chat with the AI email agent with streaming response."""
    # Generate conversation ID if not provided
    conversation_id = request.conversation_id or str(uuid.uuid4())
    
    async def generate_stream():
        try:
            # Send conversation ID first
            id_chunk = {
                "type": "conversation_id",
                "conversation_id": conversation_id
            }
            yield f"data: {json.dumps(id_chunk)}\n\n"
            
            # Get the response from the agent
            response = await handle_frontend_request(request.user_id, request.message)
            
            # Ensure response is a string and handle it
            if not isinstance(response, str):
                response = str(response)
                
            # Stream the response word by word
            words = response.split()
            for i, word in enumerate(words):
                chunk = {
                    "type": "content",
                    "content": word + (" " if i < len(words) - 1 else "")
                }
                yield f"data: {json.dumps(chunk)}\n\n"
                await asyncio.sleep(0.05)  # Small delay for streaming effect
            
            # Send completion signal
            completion_chunk = {"type": "done"}
            yield f"data: {json.dumps(completion_chunk)}\n\n"
            
        except Exception as e:
            error_chunk = {
                "type": "error",
                "error": str(e)
            }
            yield f"data: {json.dumps(error_chunk)}\n\n"
    
    return StreamingResponse(
        generate_stream(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream"
        }
    )


@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    """Chat with the AI email agent (non-streaming)."""
    try:
        # Generate conversation ID if not provided
        conversation_id = request.conversation_id or str(uuid.uuid4())
        
        response = await handle_frontend_request(request.user_id, request.message)
        return ChatResponse(
            response=response,
            conversation_id=conversation_id
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))