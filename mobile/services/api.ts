import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { AIResponsePayload, SessionSummaryPayload, CEFRLevel } from '../types';

// Automatically detect host computer IP when running via Expo on physical device/emulator
const getAutoDetectedHost = (): string => {
  try {
    // Expo hostUri is e.g. "10.239.88.183:8081", "192.168.1.5:8081", or "[fd00::10]:8081"
    const hostUri: string | undefined =
      Constants.expoConfig?.hostUri ||
      (Constants as any).manifest?.debuggerHost ||
      (Constants as any).manifest2?.extra?.expoClient?.hostUri;

    if (hostUri) {
      let host = '';

      if (hostUri.startsWith('[')) {
        // Bracketed IPv6 address: e.g., "[fd00::10]:8081" or "[::1]:8081"
        const closingBracketIndex = hostUri.indexOf(']');
        if (closingBracketIndex !== -1) {
          host = hostUri.substring(0, closingBracketIndex + 1);
        }
      } else {
        // Standard IPv4 or hostname: e.g., "192.168.1.5:8081"
        host = hostUri.split(':')[0];
      }

      const isLoopback =
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '::1' ||
        host === '[::1]';

      if (host && !isLoopback) {
        return `http://${host}:8000`;
      }
    }
  } catch (e) {
    // Fall back below
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }
  return 'http://localhost:8000';
};

let customBackendUrl: string | null = null;

export const setCustomBackendUrl = (url: string) => {
  customBackendUrl = url && url.trim() ? url.trim() : null;
};

export const ApiService = {
  getUrl(): string {
    // If a custom URL was explicitly saved and is not plain localhost on native device, use it
    if (customBackendUrl) {
      if (
        Platform.OS !== 'web' &&
        (customBackendUrl.includes('localhost') ||
          customBackendUrl.includes('127.0.0.1') ||
          customBackendUrl.includes('[::1]'))
      ) {
        return getAutoDetectedHost();
      }
      return customBackendUrl;
    }
    return getAutoDetectedHost();
  },

  async checkHealth(): Promise<{ status: string; ai_ready: boolean }> {
    try {
      const res = await fetch(`${this.getUrl()}/health`, { method: 'GET' });
      if (!res.ok) throw new Error(`Health check returned ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Backend health check error:', e);
      return { status: 'offline', ai_ready: false };
    }
  },

  async sendMessage(
    message: string,
    level: CEFRLevel = 'B1',
    topic: string = 'Daily Conversation',
    sessionId: string = 'session_default',
    history: { role: string; text: string }[] = []
  ): Promise<AIResponsePayload> {
    try {
      const targetUrl = `${this.getUrl()}/api/conversation/message`;
      console.log(`[API] Sending message to: ${targetUrl}`);

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          level,
          topic,
          message,
          history,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: AIResponsePayload = await response.json();
      return data;
    } catch (error) {
      console.warn('API error sending message, using offline friendly fallback:', error);
      return {
        reply: "That's very interesting! Could you tell me a little bit more about that?",
        corrections: [],
        top_fix: null,
        encouragement: "Great job keeping the conversation active!",
      };
    }
  },

  async summarizeSession(
    sessionId: string,
    topic: string,
    level: CEFRLevel,
    durationSeconds: number,
    messages: { role: string; text: string }[],
    correctionsCount: number
  ): Promise<SessionSummaryPayload> {
    try {
      const targetUrl = `${this.getUrl()}/api/conversation/session`;
      console.log(`[API] Requesting summary from: ${targetUrl}`);

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          topic,
          level,
          duration_seconds: durationSeconds,
          messages,
          corrections_count: correctionsCount,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('API error summarizing session, calculating local summary:', error);
      const minutes = Math.max(1, Math.round(durationSeconds / 60));
      return {
        session_id: sessionId,
        duration_minutes: minutes,
        messages_count: messages.length,
        corrections_count: correctionsCount,
        grammar_score: Math.max(65, 95 - correctionsCount * 5),
        vocabulary_score: 82,
        fluency_score: 85,
        overall_score: Math.round((82 + 85 + Math.max(65, 95 - correctionsCount * 5)) / 3),
        top_improvement:
          correctionsCount > 0
            ? 'Review the past tense and preposition suggestions.'
            : 'Continue practicing diverse vocabulary.',
        new_words: ['opportunity', 'perspective', 'confident', 'flexibility'],
        encouragement: 'Fantastic session! You spoke naturally and kept a steady conversation flow.',
      };
    }
  },
};
