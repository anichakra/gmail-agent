"""
Authentication-related models.
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List


class AuthConfig(BaseModel):
    """Model for auth configuration."""
    id: str
    toolkit: str
    auth_type: str
    status: str


class SignInRequest(BaseModel):
    """Model for user sign-in request."""
    email: EmailStr
    callback_url: Optional[str] = None


class SignInResponse(BaseModel):
    """Model for sign-in response."""
    connection_url: str
    connection_id: str
    user_id: str


class UserConnectionStatus(BaseModel):
    """Model for user connection status."""
    user_id: str
    email: str
    is_connected: bool
    connection_id: Optional[str] = None