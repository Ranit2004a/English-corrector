import json
import re
import time
import hashlib
import warnings
from typing import Optional, Dict, Any, List, Tuple
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


class ResponseCache:
    """In-memory TTL cache for Gemini responses to save tokens on identical requests."""

    def __init__(self, max_size: int = 256, ttl_seconds: int = 3600):
        self._cache: Dict[str, Tuple[float, Any]] = {}
        self.max_size = max_size
        self.ttl_seconds = ttl_seconds

    def _make_key(self, prefix: str, data: str) -> str:
        return f"{prefix}:{hashlib.sha256(data.encode('utf-8')).hexdigest()}"

    def get(self, prefix: str, data: str) -> Optional[Any]:
        if not settings.ENABLE_RESPONSE_CACHE:
            return None
        key = self._make_key(prefix, data)
        if key in self._cache:
            ts, val = self._cache[key]
            if time.time() - ts < self.ttl_seconds:
                return val
            else:
                del self._cache[key]
        return None

    def set(self, prefix: str, data: str, val: Any) -> None:
        if not settings.ENABLE_RESPONSE_CACHE:
            return
        if len(self._cache) >= self.max_size:
            # Evict oldest 20%
            keys_to_remove = list(self._cache.keys())[: max(1, self.max_size // 5)]
            for k in keys_to_remove:
                self._cache.pop(k, None)
        key = self._make_key(prefix, data)
        self._cache[key] = (time.time(), val)


class GeminiService:
    """Handles communication with Google Gemini API with token optimization, monitoring, and caching."""

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL or "gemini-2.5-flash"
        self._client = None
        self._cache = ResponseCache()
        self._init_client()

    def _init_client(self):
        if not self.api_key:
            logger.warning("GEMINI_API_KEY is not set. Gemini calls will fall back to smart offline simulation.")
            return

        try:
            if GENAI_NEW_SDK_AVAILABLE:
                self._client = genai.Client(api_key=self.api_key)
                logger.info("Initialized Google GenAI client (modern SDK with token monitoring).")
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

    def _log_token_usage(self, response: Any, operation: str):
        """Logs prompt and output token consumption from Gemini response metadata."""
        try:
            usage = getattr(response, "usage_metadata", None)
            if usage:
                prompt_tokens = getattr(usage, "prompt_token_count", 0)
                candidates_tokens = getattr(usage, "candidates_token_count", 0)
                total_tokens = getattr(usage, "total_token_count", prompt_tokens + candidates_tokens)
                logger.info(
                    f"[Token Usage | {operation}] Prompt: {prompt_tokens} | Output: {candidates_tokens} | Total: {total_tokens}"
                )
        except Exception as e:
            logger.debug(f"Could not parse token usage: {e}")

    def count_tokens(self, contents: str) -> int:
        """Estimates token count for given text."""
        if GENAI_NEW_SDK_AVAILABLE and self._client:
            try:
                res = self._client.models.count_tokens(model=self.model_name, contents=contents)
                return res.total_tokens
            except Exception:
                pass
        return len(contents) // 4  # Approximation

    def generate_chat_response(
        self,
        user_content: str,
        system_instruction: Optional[str] = None
    ) -> ConversationResponse:
        """Generates conversational reply and real-time corrections with token optimizations."""
        # Check cache first
        cache_key = f"{system_instruction}:{user_content}"
        cached = self._cache.get("chat", cache_key)
        if cached:
            logger.info("Serving conversation response from local token cache.")
            return cached

        if not self.is_configured():
            logger.warning("Gemini API not configured, returning standard smart fallback.")
            return self._create_smart_fallback(user_content)

        try:
            raw_text = ""
            if GENAI_NEW_SDK_AVAILABLE and self._client:
                config = genai_types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=settings.GEMINI_TEMPERATURE,
                    max_output_tokens=settings.GEMINI_MAX_OUTPUT_TOKENS,
                )
                if system_instruction:
                    config.system_instruction = system_instruction

                response = self._client.models.generate_content(
                    model=self.model_name,
                    contents=user_content,
                    config=config,
                )
                self._log_token_usage(response, "generate_chat_response")
                raw_text = response.text
            elif GENAI_LEGACY_AVAILABLE:
                full_prompt = f"{system_instruction}\n\n{user_content}" if system_instruction else user_content
                model = legacy_genai.GenerativeModel(
                    self.model_name,
                    generation_config={
                        "response_mime_type": "application/json",
                        "temperature": settings.GEMINI_TEMPERATURE,
                        "max_output_tokens": settings.GEMINI_MAX_OUTPUT_TOKENS,
                    }
                )
                response = model.generate_content(full_prompt)
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

            result = ConversationResponse(
                reply=data.get("reply", "That's interesting! Could you tell me more about that?"),
                corrections=corrections,
                top_fix=data.get("top_fix"),
                encouragement=data.get("encouragement", "Great job expressing your thoughts!")
            )
            self._cache.set("chat", cache_key, result)
            return result

        except json.JSONDecodeError as jde:
            logger.error(f"JSON parsing error from Gemini output: {jde}. Raw: {raw_text[:200]}")
            return self._create_smart_fallback(user_content, partial_text=raw_text)
        except Exception as e:
            logger.error(f"Gemini API request failed: {e}")
            return self._create_smart_fallback(user_content)

    def generate_session_summary(
        self,
        session_id: str,
        duration_seconds: int,
        messages_count: int,
        corrections_count: int,
        user_content: str,
        system_instruction: Optional[str] = None
    ) -> SessionSummaryResponse:
        """Evaluates overall session transcript with token-capped summary generation."""
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
                config = genai_types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.3,
                    max_output_tokens=settings.GEMINI_MAX_OUTPUT_TOKENS,
                )
                if system_instruction:
                    config.system_instruction = system_instruction

                response = self._client.models.generate_content(
                    model=self.model_name,
                    contents=user_content,
                    config=config,
                )
                self._log_token_usage(response, "generate_session_summary")
                raw_text = response.text
            elif GENAI_LEGACY_AVAILABLE:
                full_prompt = f"{system_instruction}\n\n{user_content}" if system_instruction else user_content
                model = legacy_genai.GenerativeModel(
                    self.model_name,
                    generation_config={
                        "response_mime_type": "application/json",
                        "temperature": 0.3,
                        "max_output_tokens": settings.GEMINI_MAX_OUTPUT_TOKENS,
                    }
                )
                response = model.generate_content(full_prompt)
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
