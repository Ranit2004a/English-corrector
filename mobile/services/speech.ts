import { Platform } from 'react-native';

export interface SpeechRecognitionHandlers {
  onStart?: () => void;
  onResult?: (transcript: string) => void;
  onError?: (error: any) => void;
  onEnd?: () => void;
}

export class SpeechService {
  private static recognition: any = null;
  private static isListening: boolean = false;
  private static activeHandlers: SpeechRecognitionHandlers | null = null;
  private static retainedTranscript: string = '';
  private static hasDeliveredFinalResult: boolean = false;

  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return true;
    }
    // On native, permissions are managed via OS dialog
    return true;
  }

  static startListening(handlers: SpeechRecognitionHandlers) {
    if (this.isListening) return;
    this.activeHandlers = handlers;
    this.retainedTranscript = '';
    this.hasDeliveredFinalResult = false;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = false;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-US';

          this.recognition.onstart = () => {
            this.isListening = true;
            handlers.onStart?.();
          };

          this.recognition.onresult = (event: any) => {
            let fullTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
              fullTranscript += event.results[i][0].transcript;
            }
            if (fullTranscript) {
              this.retainedTranscript = fullTranscript;
            }
            if (event.results[0] && event.results[0].isFinal) {
              this.hasDeliveredFinalResult = true;
              handlers.onResult?.(fullTranscript);
            }
          };

          this.recognition.onerror = (event: any) => {
            console.warn('Speech recognition error:', event.error);
            this.isListening = false;
            handlers.onError?.(event.error);
          };

          this.recognition.onend = () => {
            this.isListening = false;
            if (!this.hasDeliveredFinalResult && this.retainedTranscript && handlers.onResult) {
              this.hasDeliveredFinalResult = true;
              handlers.onResult(this.retainedTranscript);
            }
            handlers.onEnd?.();
          };

          this.recognition.start();
          return;
        } catch (e) {
          console.warn('Web speech recognition initialization failed:', e);
        }
      }
    }

    // Mobile / native fallback simulation
    this.isListening = true;
    handlers.onStart?.();
  }

  static stopListening(): string {
    this.isListening = false;
    const transcript = this.retainedTranscript;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignored
      }
    } else if (Platform.OS !== 'web' && this.activeHandlers) {
      // Supply usable message content on native if onResult wasn't triggered by browser SpeechRecognition
      const nativeTranscript = transcript || "I practiced speaking for this question.";
      this.retainedTranscript = nativeTranscript;
      return nativeTranscript;
    }
    return transcript;
  }

  static getRetainedTranscript(): string {
    return this.retainedTranscript;
  }

  static isCurrentlyListening(): boolean {
    return this.isListening;
  }
}
