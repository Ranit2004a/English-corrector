from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.feedback import CorrectionItem


class EnglishLevel(str, Enum):
    A1 = "A1"
    A2 = "A2"
    B1 = "B1"
    B2 = "B2"
    C1 = "C1"
    C2 = "C2"


class ChatMessage(BaseModel):
    role: str = Field(description="'user' or 'assistant'")
    text: str = Field(description="The spoken text message")


class ConversationRequest(BaseModel):
    session_id: Optional[str] = Field(default="default_session", description="Unique session identifier")
    level: str = Field(default="B1", description="User's CEFR level: A1, A2, B1, B2, C1, or C2")
    topic: str = Field(default="Everyday Conversation", description="Current conversation topic or theme")
    message: str = Field(..., min_length=1, max_length=2000, description="The user's spoken or typed input")
    history: Optional[List[ChatMessage]] = Field(default_factory=list, description="Recent conversation turns for context")


class ConversationResponse(BaseModel):
    """The structured AI reply returned directly to the mobile app."""
    reply: str = Field(description="1-3 natural conversational sentences responding to the user with a follow-up question")
    corrections: List[CorrectionItem] = Field(default_factory=list, description="0-3 concise, genuine corrections")
    top_fix: Optional[str] = Field(default=None, description="The primary correction rule or null if clean")
    encouragement: str = Field(default="Great job keeping the conversation going!", description="Friendly positive reinforcement")


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000, description="Text to analyze for grammar and phrasing")
    level: str = Field(default="B1", description="User target CEFR level")


class SessionSummaryRequest(BaseModel):
    session_id: str
    topic: str
    level: str
    duration_seconds: int
    messages: List[ChatMessage]
    corrections_count: int


class SessionEvaluationAI(BaseModel):
    grammar_score: int = Field(description="0-100 score evaluating grammatical accuracy")
    vocabulary_score: int = Field(description="0-100 score evaluating lexical variety and appropriateness")
    fluency_score: int = Field(description="0-100 score evaluating conversational flow and sentence continuity")
    overall_score: int = Field(description="0-100 combined overall score")
    top_improvement: str = Field(description="1 actionable key lesson or grammar rule to practice")
    new_words: List[str] = Field(default_factory=list, description="3-4 useful CEFR-level vocabulary words discovered")
    encouragement: str = Field(description="1-sentence warm personalized encouragement")


class SessionSummaryResponse(BaseModel):
    session_id: str
    duration_minutes: int
    messages_count: int
    corrections_count: int
    grammar_score: int = Field(description="0-100 score")
    vocabulary_score: int = Field(description="0-100 score")
    fluency_score: int = Field(description="0-100 score")
    overall_score: int = Field(description="0-100 score")
    top_improvement: str = Field(description="Key lesson or pattern to focus on")
    new_words: List[str] = Field(default_factory=list, description="High-value vocabulary words discovered during the session")
    encouragement: str = Field(description="Personalized warm closing encouragement")


class TopicItem(BaseModel):
    id: str
    title: str
    subtitle: str
    category: str
    icon: str
    starter_prompt: str


class TopicsGroupResponse(BaseModel):
    category: str
    topics: List[TopicItem]
