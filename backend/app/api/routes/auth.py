"""
Authentication routes for Composio integration.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.auth import AuthConfig, SignInRequest, SignInResponse, UserConnectionStatus, UserProfile
from core.connection import ComposioConnectionService
from core.tools import EmailToolsService


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


@router.get("/profile/{email}", response_model=UserProfile)
async def get_user_profile(
    email: str,
    service: EmailToolsService = Depends(lambda: EmailToolsService())
):
    """Get user profile information."""
    try:
        profile = service.get_user_profile(email)
        print(f"Profile response for {email}: {profile}")
        # Handle different response formats from GMAIL_GET_PROFILE
        display_name = profile.get("display_name") or profile.get("displayName")
        
        # If display_name is still not found, try to extract from email or leave as None
        if not display_name and "email_address" in profile:
             # Just return email as fallback or let it be handled in frontend
             pass
        
        # Check if the result is nested in 'data' or 'response_data'
        if not display_name:
            data = profile.get("data") or profile.get("response_data")
            if isinstance(data, dict):
                display_name = data.get("display_name") or data.get("displayName")
                
        # Some tools return a list of messages or objects, check if it's there
        if not display_name and isinstance(profile.get("profile"), dict):
            display_name = profile["profile"].get("display_name") or profile["profile"].get("displayName")

        # Try to find any key that might be the name if still not found
        if not display_name:
            # Look for common name keys in the whole dict
            for key in ["fullName", "name", "display_name", "displayName"]:
                if key in profile and profile[key]:
                    display_name = profile[key]
                    break
        
        # New: If still not found, try to look into contacts_data
        if not display_name and "contacts_data" in profile:
            contacts_data = profile["contacts_data"]
            # The structure of GMAIL_GET_CONTACTS is usually a list of contacts in 'contacts' or similar
            contacts = []
            if isinstance(contacts_data, dict):
                contacts = contacts_data.get("contacts") or contacts_data.get("connections") or []
                if not contacts:
                    # Check nested data
                    data = contacts_data.get("data") or contacts_data.get("response_data")
                    if isinstance(data, dict):
                        contacts = data.get("contacts") or data.get("connections") or []
            
            if isinstance(contacts, list):
                for contact in contacts:
                    # Look for the contact that matches the user's email
                    email_addresses = contact.get("emailAddresses") or contact.get("email_addresses") or []
                    match = False
                    for email_obj in email_addresses:
                        addr = email_obj.get("value") or email_obj.get("email")
                        if addr and addr.lower() == email.lower():
                            match = True
                            break
                    
                    if match:
                        # Found the user's contact! Now extract the name.
                        names = contact.get("names") or contact.get("name") or []
                        if isinstance(names, list) and names:
                            display_name = names[0].get("displayName") or names[0].get("fullName") or names[0].get("givenName")
                        elif isinstance(names, dict):
                            display_name = names.get("displayName") or names.get("fullName") or names.get("givenName")
                        
                        if display_name:
                            break
             
        return UserProfile(
            email=profile.get("email_address", email),
            display_name=display_name
        )
    except Exception as e:
        print(f"Error fetching profile: {e}")
        return UserProfile(email=email)