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

  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return true;
    }
    // On native, permissions are managed via OS dialog
    return true;
  }

  static startListening(handlers: SpeechRecognitionHandlers) {
    if (this.isListening) return;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = false;
          this.recognition.interimResults = false;
          this.recognition.lang = 'en-US';

          this.recognition.onstart = () => {
            this.isListening = true;
            handlers.onStart?.();
          };

          this.recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            handlers.onResult?.(transcript);
          };

          this.recognition.onerror = (event: any) => {
            console.warn('Speech recognition error:', event.error);
            this.isListening = false;
            handlers.onError?.(event.error);
          };

          this.recognition.onend = () => {
            this.isListening = false;
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

  static stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignored
      }
    }
  }

  static isCurrentlyListening(): boolean {
    return this.isListening;
  }
}
