from app.schemas.conversation import (
    ConversationRequest,
    ConversationResponse,
    AnalyzeRequest,
    SessionSummaryRequest,
    SessionSummaryResponse,
)
from app.services.prompt_service import PromptService
from app.services.gemini_service import gemini_service
from app.config import settings
from app.utils.logger import logger


class ConversationService:
    """Orchestrates token-optimized conversation flows and AI evaluation."""

    @staticmethod
    def process_message(request: ConversationRequest) -> ConversationResponse:
        logger.info(f"Processing message for session={request.session_id}, level={request.level}, topic={request.topic}")
        
        system_instruction = PromptService.get_conversation_system_instruction(
            level=request.level,
            topic=request.topic
        )
        user_content = PromptService.get_conversation_user_content(
            user_message=request.message,
            history=request.history or [],
            max_turns=settings.MAX_HISTORY_TURNS
        )
        
        response = gemini_service.generate_chat_response(
            user_content=user_content,
            system_instruction=system_instruction
        )
        return response

    @staticmethod
    def analyze_snippet(request: AnalyzeRequest) -> ConversationResponse:
        logger.info(f"Analyzing snippet for level={request.level}")
        
        system_instruction = PromptService.get_conversation_system_instruction(
            level=request.level,
            topic="Language Check"
        )
        user_content = PromptService.get_conversation_user_content(
            user_message=request.text,
            history=[],
            max_turns=0
        )
        
        return gemini_service.generate_chat_response(
            user_content=user_content,
            system_instruction=system_instruction
        )

    @staticmethod
    def summarize_session(request: SessionSummaryRequest) -> SessionSummaryResponse:
        logger.info(f"Summarizing session {request.session_id}, duration={request.duration_seconds}s")
        
        system_instruction = PromptService.get_summary_system_instruction(
            level=request.level,
            topic=request.topic
        )
        user_content = PromptService.get_summary_user_content(
            messages=request.messages,
            duration_seconds=request.duration_seconds
        )
        
        return gemini_service.generate_session_summary(
            session_id=request.session_id,
            duration_seconds=request.duration_seconds,
            messages_count=len(request.messages),
            corrections_count=request.corrections_count,
            user_content=user_content,
            system_instruction=system_instruction
        )


conversation_service = ConversationService()
