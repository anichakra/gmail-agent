"""
Authentication routes for Composio integration.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.auth import AuthConfig, SignInRequest, SignInResponse, UserConnectionStatus
from core.connection import ComposioConnectionService


router = APIRouter(prefix="/auth", tags=["authentication"])


def get_connection_service() -> ComposioConnectionService:
    """Dependency to get connection service."""
    return ComposioConnectionService()


@router.get("/configs", response_model=List[AuthConfig])
async def list_auth_configs(
    service: ComposioConnectionService = Depends(get_connection_service)
):
    """List available authentication configurations."""
    try:
        return service.list_auth_configs()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/gmail-config", response_model=AuthConfig)
async def get_gmail_auth_config(
    service: ComposioConnectionService = Depends(get_connection_service)
):
    """Get Gmail authentication configuration."""
    try:
        config = service.get_gmail_auth_config()
        if not config:
            raise HTTPException(status_code=404, detail="Gmail auth configuration not found")
        return config
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/config")
async def get_auth_config():
    """Get frontend authentication configuration."""
    from app.config.settings import get_settings
    settings = get_settings()
    return {
        "auth_config_id": settings.auth_config_id,
        "has_auth_config": bool(settings.auth_config_id)
    }


@router.post("/signin", response_model=SignInResponse)
async def create_signin_link(
    request: SignInRequest,
    service: ComposioConnectionService = Depends(get_connection_service)
):
    """Create a sign-in link for user authentication."""
    try:
        return service.create_sign_in_link(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/status/{email}", response_model=UserConnectionStatus)
async def get_user_connection_status(
    email: str,
    service: ComposioConnectionService = Depends(get_connection_service)
):
    """Get user connection status."""
    try:
        return service.get_user_connection_status(email)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))