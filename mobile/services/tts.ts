import { Platform } from 'react-native';

export const TTSService = {
  isSpeaking: false,

  async speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onDone?: () => void;
      onError?: (e: any) => void;
    }
  ): Promise<void> {
    const rate = options?.rate || 1.0;

    // Web Speech API
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // Stop any prior speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = options?.pitch || 1.0;
        utterance.lang = 'en-US';

        utterance.onstart = () => {
          this.isSpeaking = true;
          options?.onStart?.();
        };
        utterance.onend = () => {
          this.isSpeaking = false;
          options?.onDone?.();
        };
        utterance.onerror = (e) => {
          this.isSpeaking = false;
          options?.onError?.(e);
        };

        window.speechSynthesis.speak(utterance);
        return;
      } catch (err) {
        console.warn('Web speech synthesis failed:', err);
      }
    }

    // Native Expo Speech
    try {
      const Speech = require('expo-speech');
      this.isSpeaking = true;
      options?.onStart?.();

      await Speech.speak(text, {
        language: 'en-US',
        rate: rate,
        pitch: options?.pitch || 1.0,
        onDone: () => {
          this.isSpeaking = false;
          options?.onDone?.();
        },
        onError: (err: any) => {
          this.isSpeaking = false;
          options?.onError?.(err);
        },
      });
    } catch (e) {
      console.warn('Native expo-speech not available or failed:', e);
      this.isSpeaking = false;
      options?.onDone?.();
    }
  },

  async stop(): Promise<void> {
    this.isSpeaking = false;
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      return;
    }

    try {
      const Speech = require('expo-speech');
      await Speech.stop();
    } catch (e) {
      // Ignored
    }
  }
};
