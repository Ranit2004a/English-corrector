from app.schemas.conversation import (
    ConversationRequest,
    ConversationResponse,
    AnalyzeRequest,
    SessionSummaryRequest,
    SessionSummaryResponse,
)
from app.services.prompt_service import PromptService
from app.services.gemini_service import gemini_service
from app.utils.logger import logger


class ConversationService:
    """Orchestrates conversation flows, prompt generation, and AI evaluation."""

    @staticmethod
    def process_message(request: ConversationRequest) -> ConversationResponse:
        logger.info(f"Processing message for session={request.session_id}, level={request.level}, topic={request.topic}")
        
        prompt = PromptService.build_conversation_prompt(
            level=request.level,
            topic=request.topic,
            user_message=request.message,
            history=request.history or []
        )
        
        response = gemini_service.generate_chat_response(prompt)
        return response

    @staticmethod
    def analyze_snippet(request: AnalyzeRequest) -> ConversationResponse:
        logger.info(f"Analyzing snippet for level={request.level}")
        
        prompt = PromptService.build_conversation_prompt(
            level=request.level,
            topic="Language Check",
            user_message=request.text,
            history=[]
        )
        
        return gemini_service.generate_chat_response(prompt)

    @staticmethod
    def summarize_session(request: SessionSummaryRequest) -> SessionSummaryResponse:
        logger.info(f"Summarizing session {request.session_id}, duration={request.duration_seconds}s")
        
        prompt = PromptService.build_summary_prompt(
            topic=request.topic,
            level=request.level,
            messages=request.messages,
            duration_seconds=request.duration_seconds
        )
        
        return gemini_service.generate_session_summary(
            session_id=request.session_id,
            topic=request.topic,
            level=request.level,
            duration_seconds=request.duration_seconds,
            messages_count=len(request.messages),
            corrections_count=request.corrections_count,
            prompt=prompt
        )


conversation_service = ConversationService()
