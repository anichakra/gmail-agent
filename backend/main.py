"""
FastAPI Open Email Agent Backend with Composio Integration.
"""
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import get_settings
from app.api.routes import auth, agent, emails
from composio import Composio


def create_app() -> FastAPI:
    """Create FastAPI application."""
    settings = get_settings()
    
    app = FastAPI(
        title=settings.app_name,
        description="Open Email Agent Backend with Composio Integration",
        version="0.1.0",
        debug=settings.debug
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(auth.router, prefix="/api")
    app.include_router(agent.router, prefix="/api")
    app.include_router(emails.router, prefix="/api")
    
    @app.get("/")
    async def root():
        """Root endpoint."""
        return {
            "message": "Open Email Agent Backend",
            "version": "0.1.0",
            "status": "running"
        }
    
    @app.get("/health")
    async def health():
        """Health check endpoint."""
        return {"status": "healthy"}
    
    return app


app = create_app()


def main():
    """Run the application."""
    settings = get_settings()
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )


if __name__ == "__main__":
    main()
