export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LearningGoal =
  | 'Everyday conversation'
  | 'Job interviews'
  | 'Professional English'
  | 'Travel English'
  | 'Academic English'
  | 'General fluency';

export type CorrectionCategory = 'grammar' | 'vocabulary' | 'pronunciation' | 'naturalness';
export type CorrectionSeverity = 'minor' | 'moderate' | 'important';

export type PracticeState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'AI_SPEAKING' | 'ERROR';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  level: CEFRLevel;
  goal: LearningGoal;
  daily_goal_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  topic: string;
  level: CEFRLevel;
  started_at: string;
  ended_at?: string;
  duration: number; // in seconds
  messages_count: number;
  mistakes_count: number;
}

export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  text: string;
  audio_uri?: string;
  created_at: string;
}

export interface Correction {
  id: string;
  message_id?: string;
  session_id?: string;
  original: string;
  corrected: string;
  explanation: string;
  category: CorrectionCategory;
  severity: CorrectionSeverity;
  audio_uri?: string;
  created_at: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  meaning: string;
  example: string;
  source?: string;
  learned: boolean;
  created_at: string;
}

export interface DailyProgress {
  id: string;
  date: string; // YYYY-MM-DD
  speaking_minutes: number;
  sessions_completed: number;
  mistakes_count: number;
  words_learned: number;
  grammar_score: number;
  vocabulary_score: number;
  pronunciation_score: number;
  fluency_score: number;
}

export interface AppSettings {
  speech_rate: number; // 0.8 - 1.2
  voice_auto_play: boolean;
  haptic_feedback: boolean;
  backend_url: string;
  dark_mode: boolean;
}

export interface Topic {
  id: string;
  title: string;
  subtitle: string;
  category: 'Everyday' | 'Professional' | 'Advanced' | 'Free Conversation';
  icon: string;
  starter_prompt: string;
}

export interface AIResponsePayload {
  reply: string;
  corrections: {
    original: string;
    corrected: string;
    explanation: string;
    category: CorrectionCategory;
    severity: CorrectionSeverity;
  }[];
  top_fix: string | null;
  encouragement: string;
}

export interface SessionSummaryPayload {
  session_id: string;
  duration_minutes: number;
  messages_count: number;
  corrections_count: number;
  grammar_score: number;
  vocabulary_score: number;
  fluency_score: number;
  overall_score: number;
  top_improvement: string;
  new_words: string[];
  encouragement: string;
}
