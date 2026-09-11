from typing import List
from app.schemas.conversation import ChatMessage


class PromptService:
    """Generates optimized system prompts and conversation contexts for Gemini."""

    @staticmethod
    def get_level_instructions(level: str) -> str:
        """Returns specific vocabulary and complexity guidelines for each CEFR level."""
        lvl = level.upper()
        if lvl in ["A1", "A2"]:
            return (
                "The learner is a BEGINNER (A1/A2).\n"
                "- Use simple, high-frequency everyday vocabulary.\n"
                "- Keep sentences short, crisp, and easy to parse.\n"
                "- Ask clear, single-part questions.\n"
                "- Only correct basic, glaring grammar and word errors (e.g. wrong tense, missing subject, incorrect plurals). Do not overwhelm them with more than 1-2 corrections."
            )
        elif lvl in ["C1", "C2"]:
            return (
                "The learner is ADVANCED (C1/C2).\n"
                "- Use nuanced, natural, and idiomatic conversational English.\n"
                "- Discuss complex, abstract, and professional concepts freely.\n"
                "- Focus feedback on subtle unnatural collocations, preposition nuances, and stylistic polish without being pedantic."
            )
        else:  # B1, B2 (Default)
            return (
                "The learner is INTERMEDIATE (B1/B2).\n"
                "- Use natural, conversational English with moderate vocabulary and occasional idioms.\n"
                "- Balance friendly small talk with engaging questions.\n"
                "- Correct genuine grammatical errors, prepositions, awkward phrasings, and tense inconsistencies (1-3 corrections maximum)."
            )

    @staticmethod
    def build_conversation_prompt(
        level: str,
        topic: str,
        user_message: str,
        history: List[ChatMessage] = None
    ) -> str:
        level_guide = PromptService.get_level_instructions(level)
        
        history_text = ""
        if history:
            formatted_turns = []
            for h in history[-6:]:  # Keep recent turns
                role = "User" if h.role == "user" else "Tutor (You)"
                formatted_turns.append(f"{role}: {h.text}")
            history_text = "\nRecent Conversation History:\n" + "\n".join(formatted_turns) + "\n"

        return f"""You are 'Echo', a friendly, encouraging, and natural AI English speaking coach.
Your primary role is to have a continuous, engaging spoken conversation with the learner while silently analyzing their English and providing concise, constructive feedback.

Learner Level: {level.upper()}
Topic: {topic}

{level_guide}

CRITICAL CONVERSATIONAL RULES:
1. 'reply': Keep your response to 1–3 short, natural spoken sentences.
2. Always acknowledge what the user said, maintain a warm casual tone, and naturally advance the conversation with a follow-up question.
3. NEVER deliver grammar lectures inside your 'reply'. Your reply must feel like a real friend or speaking partner.
4. 'corrections': Only identify GENUINE English mistakes in what the user just said:
   - Do NOT penalize acceptable informal spoken English, regional variations, or minor stylistic preferences.
   - For each mistake, specify: 'original', 'corrected', 'explanation' (1 short sentence), 'category' (one of: 'grammar', 'vocabulary', 'pronunciation', 'naturalness'), and 'severity' ('minor', 'moderate', 'important').
   - If the user's sentence is grammatically correct and natural, return an empty array: "corrections": [].
5. 'top_fix': If there is at least one mistake, provide a 1-sentence actionable rule for the most critical mistake. If there are no mistakes, return null.
6. 'encouragement': A short, uplifting 1-sentence remark praising their effort or progress.

{history_text}
User's Latest Spoken Sentence:
"{user_message}"

You MUST respond ONLY with a single valid JSON object strictly matching this schema with no markdown code fences around it:
{{
  "reply": "Your 1-3 sentence natural conversational response and follow-up question",
  "corrections": [
    {{
      "original": "exact erroneous phrase",
      "corrected": "natural corrected phrase",
      "explanation": "concise explanation why",
      "category": "grammar",
      "severity": "moderate"
    }}
  ],
  "top_fix": "Key actionable takeaway rule or null",
  "encouragement": "Encouraging remark"
}}"""

    @staticmethod
    def build_summary_prompt(
        topic: str,
        level: str,
        messages: List[ChatMessage],
        duration_seconds: int
    ) -> str:
        transcript = "\n".join([f"{m.role.capitalize()}: {m.text}" for m in messages])
        
        return f"""You are an expert English Language Assessor evaluating a completed practice session.
Topic: {topic}
Target Level: {level}
Duration: {duration_seconds} seconds (~{max(1, duration_seconds // 60)} minutes)

Full Session Transcript:
{transcript}

Analyze the user's spoken contributions throughout the entire session. Provide an objective, balanced evaluation.
Scoring guide (0-100%):
- grammar_score: accuracy of verb tenses, word order, articles, prepositions.
- vocabulary_score: lexical diversity, appropriate word choice for level.
- fluency_score: sentence structure smoothness, communicative effectiveness.
- overall_score: weighted average of the above.
- top_improvement: the single most valuable grammar/vocabulary pattern the user should work on next.
- new_words: 3-5 useful vocabulary words or phrases introduced during the session that the user can learn.
- encouragement: an empowering 1-2 sentence concluding remark.

Return ONLY a single valid JSON object strictly matching this format:
{{
  "grammar_score": 82,
  "vocabulary_score": 78,
  "fluency_score": 85,
  "overall_score": 82,
  "top_improvement": "Mastering past tense vs present perfect in storytelling",
  "new_words": ["opportunity", "flexible", "accomplish", "perspective"],
  "encouragement": "Fantastic session! You expressed your thoughts smoothly and kept the conversation flowing."
}}"""
