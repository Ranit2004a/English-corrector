from fastapi import APIRouter
from app.api.routes.health import router as health_router
from app.api.routes.conversation import router as conversation_router
from app.api.routes.topics import router as topics_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(conversation_router)
api_router.include_router(topics_router)
