"""
Application configuration settings.
"""
import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # OpenAI Configuration
    openai_api_key: Optional[str] = None
    
    # Model Configuration
    model_provider: str = ""
    model_name: str = ""
    
    # Provider Keys
    anthropic_api_key: Optional[str] = None
    google_api_key: Optional[str] = None
    
    # Composio Configuration
    composio_api_key: Optional[str] = None
    auth_config_id: Optional[str] = None
    
    # FastAPI Configuration
    app_name: str = "Open Email Agent Backend"
    debug: bool = False
    environment: str = "development"
    
    # CORS Configuration
    allowed_origins: list[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), ".env")
        extra = "ignore"


def get_settings() -> Settings:
    """Get application settings."""
    return Settings()