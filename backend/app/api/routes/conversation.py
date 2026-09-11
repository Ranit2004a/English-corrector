from fastapi import APIRouter, HTTPException, status
from app.schemas.conversation import (
    ConversationRequest,
    ConversationResponse,
    AnalyzeRequest,
    SessionSummaryRequest,
    SessionSummaryResponse,
)
from app.schemas.feedback import FeedbackResponse
from app.services.conversation_service import conversation_service
from app.utils.logger import logger

router = APIRouter(prefix="/api/conversation", tags=["Conversation"])


@router.post("/message", response_model=ConversationResponse)
def handle_conversation_message(payload: ConversationRequest):
    """Primary speaking exchange endpoint: takes user speech transcript, level, and history,

    returns AI reply, concise corrections, top fix, and encouragement.
    """
    try:
        if not payload.message or not payload.message.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message text cannot be empty."
            )

        response = conversation_service.process_message(payload)
        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error handling conversation message: {e}")
        # Return graceful fallback so user app never crashes
        return ConversationResponse(
            reply="That's a great thought! Could you explain a little more about what you mean?",
            corrections=[],
            top_fix=None,
            encouragement="Nice speaking! Keep practicing."
        )


@router.post("/analyze", response_model=ConversationResponse)
def analyze_speech_snippet(payload: AnalyzeRequest):
    """Analyzes a specific sentence for mistakes and natural improvements."""
    try:
        return conversation_service.analyze_snippet(payload)
    except Exception as e:
        logger.error(f"Error analyzing text: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze text snippet."
        )


@router.post("/session", response_model=SessionSummaryResponse)
def end_session_and_summarize(payload: SessionSummaryRequest):
    """Generates session score breakdown, fluency metrics, top improvement, and discovered vocabulary."""
    try:
        return conversation_service.summarize_session(payload)
    except Exception as e:
        logger.error(f"Error generating session summary: {e}")
        return SessionSummaryResponse(
            session_id=payload.session_id,
            duration_minutes=max(1, payload.duration_seconds // 60),
            messages_count=len(payload.messages),
            corrections_count=payload.corrections_count,
            grammar_score=80,
            vocabulary_score=80,
            fluency_score=80,
            overall_score=80,
            top_improvement="Keep practicing regular conversational flows.",
            new_words=["opportunity", "perspective"],
            encouragement="Great practice today! Keep speaking regularly."
        )


@router.post("/feedback", response_model=FeedbackResponse)
def analyze_standalone_feedback(payload: AnalyzeRequest):
    """Provides pure correction breakdown for a sentence."""
    conv_response = conversation_service.analyze_snippet(payload)
    return FeedbackResponse(
        corrections=conv_response.corrections,
        top_fix=conv_response.top_fix,
        encouragement=conv_response.encouragement
    )
