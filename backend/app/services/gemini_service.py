import json
import re
import warnings
from typing import Optional, Dict, Any, List
from app.config import settings
from app.utils.logger import logger
from app.schemas.conversation import ConversationResponse, SessionSummaryResponse
from app.schemas.feedback import CorrectionItem, CorrectionCategory, CorrectionSeverity

# Suppress deprecation warnings from legacy genai SDK if imported
warnings.filterwarnings("ignore", category=FutureWarning)

try:
    from google import genai
    from google.genai import types as genai_types
    GENAI_NEW_SDK_AVAILABLE = True
except ImportError:
    GENAI_NEW_SDK_AVAILABLE = False

try:
    import google.generativeai as legacy_genai
    GENAI_LEGACY_AVAILABLE = True
except ImportError:
    GENAI_LEGACY_AVAILABLE = False


class GeminiService:
    """Handles communication with Google Gemini API with JSON enforcement and robust fallbacks."""

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL or "gemini-2.5-flash"
        self._client = None
        self._init_client()

    def _init_client(self):
        if not self.api_key:
            logger.warning("GEMINI_API_KEY is not set. Gemini calls will fall back to smart offline simulation.")
            return

        try:
            if GENAI_NEW_SDK_AVAILABLE:
                self._client = genai.Client(api_key=self.api_key)
                logger.info("Initialized Google GenAI client (modern SDK).")
            elif GENAI_LEGACY_AVAILABLE:
                legacy_genai.configure(api_key=self.api_key)
                logger.info("Initialized Google GenerativeAI (legacy SDK).")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini client: {e}")

    def is_configured(self) -> bool:
        return bool(self.api_key and (self._client or GENAI_LEGACY_AVAILABLE))

    def _clean_json_text(self, text: str) -> str:
        """Extracts pure JSON from potential markdown formatting."""
        cleaned = text.strip()
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
            cleaned = re.sub(r"\s*```$", "", cleaned)
        return cleaned.strip()

    def generate_chat_response(self, prompt: str) -> ConversationResponse:
        """Generates conversational reply and real-time corrections."""
        if not self.is_configured():
            logger.warning("Gemini API not configured, returning standard smart fallback.")
            return self._create_smart_fallback(prompt)

        try:
            raw_text = ""
            if GENAI_NEW_SDK_AVAILABLE and self._client:
                response = self._client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config=genai_types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.7,
                    ),
                )
                raw_text = response.text
            elif GENAI_LEGACY_AVAILABLE:
                model = legacy_genai.GenerativeModel(
                    self.model_name,
                    generation_config={"response_mime_type": "application/json", "temperature": 0.7}
                )
                response = model.generate_content(prompt)
                raw_text = response.text
            
            cleaned = self._clean_json_text(raw_text)
            data = json.loads(cleaned)
            
            corrections = []
            for item in data.get("corrections", []):
                corrections.append(
                    CorrectionItem(
                        original=item.get("original", ""),
                        corrected=item.get("corrected", ""),
                        explanation=item.get("explanation", ""),
                        category=item.get("category", CorrectionCategory.GRAMMAR),
                        severity=item.get("severity", CorrectionSeverity.MODERATE)
                    )
                )

            return ConversationResponse(
                reply=data.get("reply", "That's interesting! Could you tell me more about that?"),
                corrections=corrections,
                top_fix=data.get("top_fix"),
                encouragement=data.get("encouragement", "Great job expressing your thoughts!")
            )

        except json.JSONDecodeError as jde:
            logger.error(f"JSON parsing error from Gemini output: {jde}. Raw: {raw_text[:200]}")
            return self._create_smart_fallback(prompt, partial_text=raw_text)
        except Exception as e:
            logger.error(f"Gemini API request failed: {e}")
            return self._create_smart_fallback(prompt)

    def generate_session_summary(
        self,
        session_id: str,
        topic: str,
        level: str,
        duration_seconds: int,
        messages_count: int,
        corrections_count: int,
        prompt: str
    ) -> SessionSummaryResponse:
        """Evaluates overall session transcript."""
        duration_minutes = max(1, duration_seconds // 60)
        
        if not self.is_configured():
            return SessionSummaryResponse(
                session_id=session_id,
                duration_minutes=duration_minutes,
                messages_count=messages_count,
                corrections_count=corrections_count,
                grammar_score=85,
                vocabulary_score=80,
                fluency_score=82,
                overall_score=82,
                top_improvement="Use precise past tense forms when recounting completed stories.",
                new_words=["opportunity", "perspective", "confident", "flexibility"],
                encouragement="Excellent practice session! You spoke naturally and kept a steady conversation rhythm."
            )

        try:
            raw_text = ""
            if GENAI_NEW_SDK_AVAILABLE and self._client:
                response = self._client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config=genai_types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.5,
                    ),
                )
                raw_text = response.text
            elif GENAI_LEGACY_AVAILABLE:
                model = legacy_genai.GenerativeModel(
                    self.model_name,
                    generation_config={"response_mime_type": "application/json", "temperature": 0.5}
                )
                response = model.generate_content(prompt)
                raw_text = response.text

            cleaned = self._clean_json_text(raw_text)
            data = json.loads(cleaned)

            return SessionSummaryResponse(
                session_id=session_id,
                duration_minutes=duration_minutes,
                messages_count=messages_count,
                corrections_count=corrections_count,
                grammar_score=int(data.get("grammar_score", 80)),
                vocabulary_score=int(data.get("vocabulary_score", 80)),
                fluency_score=int(data.get("fluency_score", 80)),
                overall_score=int(data.get("overall_score", 80)),
                top_improvement=data.get("top_improvement", "Continue practicing natural sentence transitions."),
                new_words=data.get("new_words", ["articulate", "context", "expression"]),
                encouragement=data.get("encouragement", "Great progress today! Keep building your speaking confidence.")
            )
        except Exception as e:
            logger.error(f"Gemini session summary failed: {e}")
            return SessionSummaryResponse(
                session_id=session_id,
                duration_minutes=duration_minutes,
                messages_count=messages_count,
                corrections_count=corrections_count,
                grammar_score=80,
                vocabulary_score=78,
                fluency_score=82,
                overall_score=80,
                top_improvement="Focus on verb tenses and natural phrasings.",
                new_words=["communicate", "fluency", "engage"],
                encouragement="Well done! Consistent daily speaking creates real fluency."
            )

    def _create_smart_fallback(self, prompt: str, partial_text: str = "") -> ConversationResponse:
        """Provides a safe, conversational fallback so the user experience is never broken."""
        return ConversationResponse(
            reply="That sounds really interesting! What was the most memorable part of that for you?",
            corrections=[],
            top_fix=None,
            encouragement="Nice speaking! Let's continue exploring this topic."
        )


gemini_service = GeminiService()
