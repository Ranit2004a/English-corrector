import { create } from 'zustand';
import { PracticeState, Message, Correction, Session, CEFRLevel, SessionSummaryPayload } from '../types';
import { SessionRepository } from '../db/repositories/sessionRepository';
import { MessageRepository } from '../db/repositories/messageRepository';
import { CorrectionRepository } from '../db/repositories/correctionRepository';
import { VocabularyRepository } from '../db/repositories/vocabularyRepository';
import { ProgressRepository } from '../db/repositories/progressRepository';
import { ApiService } from '../services/api';
import { TTSService } from '../services/tts';

interface PracticeStateStore {
  currentSession: Session | null;
  practiceState: PracticeState;
  messages: Message[];
  corrections: Correction[];
  latestTopFix: string | null;
  latestEncouragement: string | null;
  timerSeconds: number;
  isMuted: boolean;
  isFeedbackExpanded: boolean;
  errorMessage: string | null;
  lastSummary: SessionSummaryPayload | null;

  startSession: (topic: string, level: CEFRLevel, starterPrompt?: string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  endSession: () => Promise<SessionSummaryPayload | null>;
  setPracticeState: (state: PracticeState) => void;
  toggleMute: () => void;
  toggleFeedback: () => void;
  setTimerSeconds: (seconds: number) => void;
  incrementTimer: () => void;
  speakText: (text: string) => void;
  resetSession: () => void;
}

export const usePracticeStore = create<PracticeStateStore>((set, get) => ({
  currentSession: null,
  practiceState: 'IDLE',
  messages: [],
  corrections: [],
  latestTopFix: null,
  latestEncouragement: null,
  timerSeconds: 0,
  isMuted: false,
  isFeedbackExpanded: false,
  errorMessage: null,
  lastSummary: null,

  startSession: async (topic: string, level: CEFRLevel, starterPrompt?: string) => {
    try {
      const session = await SessionRepository.createSession(topic, level);
      const initialMessages: Message[] = [];

      // If there's an opening prompt, add as initial assistant message
      if (starterPrompt) {
        const msg = await MessageRepository.addMessage(session.id, 'assistant', starterPrompt);
        initialMessages.push(msg);
      }

      set({
        currentSession: session,
        practiceState: 'IDLE',
        messages: initialMessages,
        corrections: [],
        latestTopFix: null,
        latestEncouragement: null,
        timerSeconds: 0,
        errorMessage: null,
        lastSummary: null,
      });

      // Play starter prompt if voice auto-enabled
      if (starterPrompt && !get().isMuted) {
        TTSService.speak(starterPrompt);
      }
    } catch (e) {
      console.warn('Failed to start session:', e);
    }
  },

  sendMessage: async (text: string) => {
    const { currentSession, messages, isMuted } = get();
    if (!currentSession || !text.trim()) return;

    // 1. Save & display user message
    set({ practiceState: 'PROCESSING' });
    const userMsg = await MessageRepository.addMessage(currentSession.id, 'user', text.trim());
    const updatedMessages = [...messages, userMsg];
    set({ messages: updatedMessages });

    try {
      // 2. Format history for backend
      const history = updatedMessages.slice(-6).map(m => ({
        role: m.role,
        text: m.text,
      }));

      // 3. Call backend API
      const result = await ApiService.sendMessage(
        text.trim(),
        currentSession.level,
        currentSession.topic,
        currentSession.id,
        history
      );

      // 4. Save AI message to SQLite
      const aiMsg = await MessageRepository.addMessage(currentSession.id, 'assistant', result.reply);

      // 5. Save any corrections to SQLite
      const savedCorrections: Correction[] = [];
      for (const item of result.corrections || []) {
        const corr = await CorrectionRepository.addCorrection(
          item.original,
          item.corrected,
          item.explanation,
          item.category,
          item.severity,
          currentSession.id,
          userMsg.id
        );
        savedCorrections.push(corr);
      }

      const allCorrections = [...get().corrections, ...savedCorrections];

      set({
        messages: [...updatedMessages, aiMsg],
        corrections: allCorrections,
        latestTopFix: result.top_fix,
        latestEncouragement: result.encouragement,
        practiceState: isMuted ? 'IDLE' : 'AI_SPEAKING',
      });

      // 6. Speak response via TTS if unmuted
      if (!isMuted) {
        TTSService.speak(result.reply, {
          onDone: () => {
            set({ practiceState: 'IDLE' });
          },
          onError: () => {
            set({ practiceState: 'IDLE' });
          },
        });
      } else {
        set({ practiceState: 'IDLE' });
      }

    } catch (err: any) {
      console.warn('Send message failed:', err);
      set({
        practiceState: 'ERROR',
        errorMessage: "I couldn't process that right now. Please try again.",
      });
      setTimeout(() => {
        set({ practiceState: 'IDLE', errorMessage: null });
      }, 3000);
    }
  },

  endSession: async () => {
    const { currentSession, timerSeconds, messages, corrections } = get();
    if (!currentSession) return null;

    TTSService.stop();

    try {
      // Generate summary from backend or local calculator
      const summary = await ApiService.summarizeSession(
        currentSession.id,
        currentSession.topic,
        currentSession.level,
        timerSeconds,
        messages.map(m => ({ role: m.role, text: m.text })),
        corrections.length
      );

      // Update session in SQLite
      await SessionRepository.updateSessionEnd(
        currentSession.id,
        timerSeconds,
        messages.length,
        corrections.length
      );

      // Save newly discovered words to SQLite
      for (const word of summary.new_words || []) {
        await VocabularyRepository.addVocabulary(
          word,
          `High-value conversational vocabulary discovered during '${currentSession.topic}'`,
          `Practice using "${word}" in your next conversation.`,
          currentSession.topic
        );
      }

      // Record progress
      await ProgressRepository.recordSessionCompletion(
        timerSeconds,
        corrections.length,
        summary.grammar_score,
        summary.vocabulary_score,
        summary.fluency_score
      );

      set({
        lastSummary: summary,
        practiceState: 'IDLE',
      });

      return summary;
    } catch (e) {
      console.warn('Error concluding session:', e);
      return null;
    }
  },

  setPracticeState: (practiceState: PracticeState) => set({ practiceState }),
  toggleMute: () => {
    const isMuted = !get().isMuted;
    if (isMuted) TTSService.stop();
    set({ isMuted });
  },
  toggleFeedback: () => set(state => ({ isFeedbackExpanded: !state.isFeedbackExpanded })),
  setTimerSeconds: (timerSeconds: number) => set({ timerSeconds }),
  incrementTimer: () => set(state => ({ timerSeconds: state.timerSeconds + 1 })),
  speakText: (text: string) => {
    if (!get().isMuted) {
      TTSService.speak(text);
    }
  },
  resetSession: () => {
    TTSService.stop();
    set({
      currentSession: null,
      practiceState: 'IDLE',
      messages: [],
      corrections: [],
      latestTopFix: null,
      latestEncouragement: null,
      timerSeconds: 0,
      errorMessage: null,
      lastSummary: null,
    });
  }
}));
