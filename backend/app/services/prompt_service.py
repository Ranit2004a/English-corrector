from typing import List, Optional
from app.schemas.conversation import ChatMessage
from app.config import settings


class PromptService:
    """Generates token-optimized system prompts and contexts for Gemini."""

    @staticmethod
    def get_level_instructions(level: str) -> str:
        """Concise vocabulary and complexity guidelines for each CEFR level."""
        lvl = level.upper()
        if lvl in ["A1", "A2"]:
            return "Beginner (A1/A2): Simple words, short sentences, single-part questions. Correct only 1-2 glaring errors."
        elif lvl in ["C1", "C2"]:
            return "Advanced (C1/C2): Natural idiomatic English. Focus feedback on subtle collocations and stylistic polish."
        return "Intermediate (B1/B2): Natural conversational English. Balance small talk with questions; max 2-3 key corrections."

    @staticmethod
    def get_conversation_system_instruction(level: str, topic: str) -> str:
        """Token-optimized static system instruction for conversation."""
        level_guide = PromptService.get_level_instructions(level)
        return (
            f"You are 'Echo', a warm English speaking coach.\n"
            f"Learner Level: {level.upper()} | Topic: {topic}\n"
            f"{level_guide}\n\n"
            "Rules:\n"
            "1. 'reply': 1-3 spoken conversational sentences advancing dialogue naturally.\n"
            "2. 'corrections': Array of actual mistakes with fields [original, corrected, explanation, category ('grammar'|'vocabulary'|'pronunciation'|'naturalness'), severity ('minor'|'moderate'|'important')]. If none, return [].\n"
            "3. 'top_fix': 1-sentence actionable rule for top error, or null.\n"
            "4. 'encouragement': Brief 1-sentence positive remark.\n"
            "Return valid JSON matching schema only."
        )

    @staticmethod
    def get_conversation_user_content(
        user_message: str,
        history: Optional[List[ChatMessage]] = None,
        max_turns: int = 4
    ) -> str:
        """Constructs concise conversation payload with sliding window history."""
        turns = []
        if history:
            # Take only the last N turns to minimize input token growth
            recent = history[-max_turns:]
            for h in recent:
                speaker = "User" if h.role == "user" else "Echo"
                turns.append(f"{speaker}: {h.text.strip()}")

        if turns:
            history_block = "History:\n" + "\n".join(turns) + "\n\n"
        else:
            history_block = ""

        return f"{history_block}User: {user_message.strip()}"

    @staticmethod
    def build_conversation_prompt(
        level: str,
        topic: str,
        user_message: str,
        history: Optional[List[ChatMessage]] = None,
        max_turns: int = 4
    ) -> str:
        """Combined prompt for legacy callers."""
        system = PromptService.get_conversation_system_instruction(level, topic)
        user_content = PromptService.get_conversation_user_content(user_message, history, max_turns)
        return f"{system}\n\n{user_content}"

    @staticmethod
    def get_summary_system_instruction(level: str, topic: str) -> str:
        """Token-optimized system instruction for session summary."""
        return (
            f"You are an English Language Assessor evaluating a completed practice session.\n"
            f"Target Level: {level.upper()} | Topic: {topic}\n"
            "Evaluate scores (0-100) for grammar, vocabulary, fluency, and overall.\n"
            "Identify top_improvement (1 key pattern), new_words (3-4 relevant words), and encouragement (1 sentence).\n"
            "Return valid JSON matching schema only."
        )

    @staticmethod
    def get_summary_user_content(
        messages: List[ChatMessage],
        duration_seconds: int
    ) -> str:
        """Builds compact transcript for evaluation."""
        transcript = "\n".join([f"{m.role}: {m.text.strip()}" for m in messages])
        return f"Duration: {duration_seconds}s\nTranscript:\n{transcript}"

    @staticmethod
    def build_summary_prompt(
        topic: str,
        level: str,
        messages: List[ChatMessage],
        duration_seconds: int
    ) -> str:
        """Combined prompt for legacy callers."""
        system = PromptService.get_summary_system_instruction(level, topic)
        content = PromptService.get_summary_user_content(messages, duration_seconds)
        return f"{system}\n\n{content}"
