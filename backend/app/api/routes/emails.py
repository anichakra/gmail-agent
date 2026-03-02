"""
Email management routes.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from core.tools import EmailToolsService


router = APIRouter(prefix="/emails", tags=["emails"])


def get_email_service() -> EmailToolsService:
    """Dependency to get email service."""
    return EmailToolsService()


@router.get("/tools", response_model=List[Dict[str, Any]])
async def get_gmail_tools(
    service: EmailToolsService = Depends(get_email_service)
):
    """Get available Gmail tools."""
    try:
        return service.get_gmail_tools()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{user_id}", response_model=List[Dict[str, Any]])
async def get_user_emails(
    user_id: str,
    max_results: int = 10,
    query: Optional[str] = None,
    service: EmailToolsService = Depends(get_email_service)
):
    """Get emails for a specific user."""
    try:
        return service.fetch_user_emails(user_id, max_results, query)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{user_id}/email/{message_id}", response_model=Dict[str, Any])
async def get_email_by_id(
    user_id: str,
    message_id: str,
    service: EmailToolsService = Depends(get_email_service)
):
    """Get a specific email by message ID."""
    try:
        return service.get_email_by_id(user_id, message_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{user_id}/threads", response_model=List[Dict[str, Any]])
async def get_user_threads(
    user_id: str,
    max_results: int = 10,
    query: Optional[str] = None,
    service: EmailToolsService = Depends(get_email_service)
):
    """Get email threads for a specific user."""
    try:
        return service.list_threads(user_id, max_results, query)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{user_id}/send", response_model=Dict[str, Any])
async def send_email(
    user_id: str,
    to: str,
    subject: str,
    body: str,
    service: EmailToolsService = Depends(get_email_service)
):
    """Send an email for a specific user."""
    try:
        return service.send_email(user_id, to, subject, body)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))