"""
Composio connection management service.
"""
from typing import Dict, Any, List, Optional
from composio import Composio
from app.config.settings import get_settings
from app.models.auth import AuthConfig, SignInRequest, SignInResponse, UserConnectionStatus
from core.constants import DEFAULT_CALLBACK_URL


class ComposioConnectionService:
    """Service for managing Composio connections."""
    
    def __init__(self):
        """Initialize the connection service."""
        self.settings = get_settings()
        self.composio = Composio(api_key=self.settings.composio_api_key)
    
    def list_auth_configs(self) -> List[AuthConfig]:
        """List available auth configurations."""
        try:
            response = self.composio.auth_configs.list()
            return [
                AuthConfig(
                    id=config.id,
                    toolkit=config.toolkit.slug,
                    auth_type=config.auth_scheme,
                    status="active"
                )
                for config in response.items
            ]
        except Exception as e:
            raise Exception(f"Failed to list auth configs: {str(e)}")
    
    def get_gmail_auth_config(self) -> Optional[AuthConfig]:
        """Get Gmail auth configuration."""
        try:
            # Use the configured AUTH_CONFIG_ID if available
            if self.settings.auth_config_id:
                try:
                    config = self.composio.auth_configs.get(self.settings.auth_config_id)
                    return AuthConfig(
                        id=config.id,
                        toolkit=config.toolkit.slug,
                        auth_type=config.auth_scheme,
                        status="active"
                    )
                except Exception as e:
                    print(f"Warning: Specific auth config {self.settings.auth_config_id} not found: {e}")
                    # Fall back to listing if specific config not found
                    pass
            
            # Fallback: Use toolkit_slug parameter to filter directly
            response = self.composio.auth_configs.list(toolkit_slug='gmail')
            if response.items:
                config = response.items[0]  # Get the first Gmail auth config
                return AuthConfig(
                    id=config.id,
                    toolkit=config.toolkit.slug,
                    auth_type=config.auth_scheme,
                    status="active"
                )
            
            # If no existing config, we'll return None and handle it in create_sign_in_link
            return None
        except Exception as e:
            print(f"Error in get_gmail_auth_config: {e}")
            raise Exception(f"Failed to get Gmail auth config: {str(e)}")
    
    def check_user_connection(self, user_id: str) -> bool:
        """Check if user already has a connected account for Gmail."""
        try:
            # Correctly use user_ids parameter as a list of strings
            response = self.composio.connected_accounts.list(user_ids=[user_id])
            # Filter for Gmail connections
            return any(item.toolkit.slug == 'gmail' for item in response.items)
        except Exception as e:
            # If user doesn't exist or no connections, return False
            return False
    
    def create_sign_in_link(self, request: SignInRequest) -> SignInResponse:
        """Create a sign-in link for user email authentication."""
        try:
            # Use email as user_id
            user_id = request.email
            
            # Check if user already has a connection
            if self.check_user_connection(user_id):
                # If already connected, we can still return a dummy sign-in response 
                # or the existing connection info, but the frontend now handles this 
                # by checking status first. To be safe, let's keep it informative.
                print(f"User {request.email} already has a connected Gmail account.")
            
            # Get Gmail auth config
            auth_config = self.get_gmail_auth_config()
            
            auth_config_id = auth_config.id if auth_config else self.settings.auth_config_id
            
            if not auth_config_id:
                 raise Exception("No Gmail authentication configuration found. Please go to Composio Dashboard -> Integrations -> Gmail -> Enable 'Auth Link' and copy the ID to your .env as AUTH_CONFIG_ID.")

            callback_url = request.callback_url or DEFAULT_CALLBACK_URL
            
            # Create connection link
            # The SDK link method: (user_id: 'str', auth_config_id: 'str', *, callback_url: 't.Optional[str]' = None)
            print(f"Initiating connection using auth_config_id {auth_config_id} for user {user_id}")
            connection_request = self.composio.connected_accounts.link(
                user_id=user_id,
                auth_config_id=auth_config_id,
                callback_url=callback_url
            )
            
            return SignInResponse(
                connection_url=connection_request.redirect_url,
                connection_id=connection_request.id,
                user_id=user_id
            )
        except Exception as e:
            print(f"Error in create_sign_in_link: {e}")
            # If it's our own exception, don't wrap it too much
            raise Exception(str(e))
    
    def get_user_connection_status(self, email: str) -> UserConnectionStatus:
        """Get user connection status."""
        try:
            user_id = email
            # Correctly use user_ids parameter as a list of strings
            response = self.composio.connected_accounts.list(user_ids=[user_id])
            # Find the first Gmail connection
            gmail_connections = [item for item in response.items if item.toolkit.slug == 'gmail']
            is_connected = len(gmail_connections) > 0
            
            connection_id = None
            if is_connected:
                connection_id = gmail_connections[0].id
            
            return UserConnectionStatus(
                user_id=user_id,
                email=email,
                is_connected=is_connected,
                connection_id=connection_id
            )
        except Exception as e:
            print(f"Error in get_user_connection_status: {e}")
            raise Exception(f"Failed to get user connection status: {str(e)}")