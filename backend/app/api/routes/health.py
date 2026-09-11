from fastapi import APIRouter
from app.config import settings
from app.services.gemini_service import gemini_service

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check():
    """Returns server status and Gemini configuration state."""
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "ai_ready": gemini_service.is_configured(),
        "model": settings.GEMINI_MODEL
    }
