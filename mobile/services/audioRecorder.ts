import { Platform } from 'react-native';

export interface AudioPlaybackStatusListener {
  onStart?: () => void;
  onFinish?: () => void;
  onError?: (err: any) => void;
}

function getExpoAudio(): any {
  try {
    const ExpoAV = require('expo-av');
    return ExpoAV?.Audio || null;
  } catch (e) {
    return null;
  }
}

function getFileSystem(): any {
  try {
    return require('expo-file-system');
  } catch (e) {
    return null;
  }
}

export class AudioRecorderService {
  private static recording: any = null;
  private static activeSound: any = null;
  private static isRecording = false;
  private static sessionAudioUris: Set<string> = new Set();

  // Web MediaRecorder references
  private static webMediaRecorder: any = null;
  private static webAudioChunks: any[] = [];
  private static webActiveAudio: any = null;

  static async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop stream tracks after permission probe
          stream.getTracks().forEach((track) => track.stop());
          return true;
        }
        return true;
      }

      const Audio = getExpoAudio();
      if (Audio?.requestPermissionsAsync) {
        const response = await Audio.requestPermissionsAsync();
        return response.granted;
      }
      return true;
    } catch (e) {
      console.warn('Audio permission request failed:', e);
      return false;
    }
  }

  static async startRecording(): Promise<boolean> {
    try {
      if (this.isRecording) {
        await this.stopRecording();
      }

      // Web recording support via MediaRecorder API
      if (Platform.OS === 'web' && typeof window !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          this.webAudioChunks = [];
          const mediaRecorder = new (window as any).MediaRecorder(stream);
          
          mediaRecorder.ondataavailable = (event: any) => {
            if (event.data && event.data.size > 0) {
              this.webAudioChunks.push(event.data);
            }
          };

          mediaRecorder.start();
          this.webMediaRecorder = mediaRecorder;
          this.isRecording = true;
          return true;
        } catch (webErr) {
          console.warn('Web MediaRecorder failed:', webErr);
        }
      }

      const Audio = getExpoAudio();
      if (!Audio) {
        console.warn('Native Audio module not available in this environment');
        return false;
      }

      // Native iOS & Android recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      this.isRecording = true;
      return true;
    } catch (e) {
      console.warn('Failed to start audio recording:', e);
      this.isRecording = false;
      this.recording = null;
      return false;
    }
  }

  static async stopRecording(): Promise<string | null> {
    if (!this.isRecording) {
      return null;
    }

    try {
      this.isRecording = false;

      // Web recording finish
      if (Platform.OS === 'web' && this.webMediaRecorder) {
        return new Promise<string | null>((resolve) => {
          this.webMediaRecorder.onstop = () => {
            try {
              const audioBlob = new Blob(this.webAudioChunks, { type: 'audio/webm' });
              const audioUrl = URL.createObjectURL(audioBlob);
              // Stop all audio tracks
              if (this.webMediaRecorder.stream) {
                this.webMediaRecorder.stream.getTracks().forEach((track: any) => track.stop());
              }
              this.webMediaRecorder = null;
              resolve(audioUrl);
            } catch (err) {
              console.warn('Error finalizing web recording blob:', err);
              resolve(null);
            }
          };
          this.webMediaRecorder.stop();
        });
      }

      // Native recording finish
      if (this.recording) {
        await this.recording.stopAndUnloadAsync();
        const uri = this.recording.getURI();
        this.recording = null;

        const Audio = getExpoAudio();
        if (Audio) {
          // Reset audio mode for playback
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
          });
        }

        if (uri) {
          this.sessionAudioUris.add(uri);
        }
        return uri;
      }
    } catch (e) {
      console.warn('Failed to stop recording cleanly:', e);
      this.recording = null;
    }

    return null;
  }

  static async playAudio(
    uri: string,
    listeners?: AudioPlaybackStatusListener
  ): Promise<void> {
    try {
      // Stop any existing playback first
      await this.stopAudio();

      listeners?.onStart?.();

      // Web audio playback
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const audio = new window.Audio(uri);
        this.webActiveAudio = audio;

        audio.onended = () => {
          this.webActiveAudio = null;
          listeners?.onFinish?.();
        };

        audio.onerror = (err: any) => {
          this.webActiveAudio = null;
          listeners?.onError?.(err);
        };

        await audio.play();
        return;
      }

      const Audio = getExpoAudio();
      if (!Audio) {
        console.warn('Native Audio module not available for playback');
        listeners?.onFinish?.();
        return;
      }

      // Native audio playback with expo-av
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        (status: any) => {
          if (status.isLoaded) {
            if (status.didJustFinish) {
              sound.unloadAsync();
              this.activeSound = null;
              listeners?.onFinish?.();
            }
          } else if (status.error) {
            sound.unloadAsync();
            this.activeSound = null;
            listeners?.onError?.(status.error);
          }
        }
      );

      this.activeSound = sound;
    } catch (e) {
      console.warn('Audio playback failed:', e);
      listeners?.onError?.(e);
      await this.stopAudio();
    }
  }

  static async stopAudio(): Promise<void> {
    try {
      if (Platform.OS === 'web' && this.webActiveAudio) {
        this.webActiveAudio.pause();
        this.webActiveAudio.currentTime = 0;
        this.webActiveAudio = null;
      }

      if (this.activeSound) {
        await this.activeSound.stopAsync();
        await this.activeSound.unloadAsync();
        this.activeSound = null;
      }
    } catch (e) {
      // Ignore unload errors
    }
  }

  /**
   * Deletes a specific audio file from local disk / memory.
   */
  static async deleteAudioFile(uri: string): Promise<void> {
    if (!uri) return;

    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && uri.startsWith('blob:')) {
          URL.revokeObjectURL(uri);
        }
        this.sessionAudioUris.delete(uri);
        return;
      }

      // Native file deletion
      const FileSystem = getFileSystem();
      if (FileSystem && uri.startsWith('file://')) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      }
      this.sessionAudioUris.delete(uri);
    } catch (e) {
      console.warn('Could not delete audio file:', uri, e);
    }
  }

  /**
   * Cleans up all audio files recorded during the session to free up device storage.
   */
  static async cleanupSessionAudio(): Promise<void> {
    await this.stopAudio();

    const urisToDelete = Array.from(this.sessionAudioUris);
    for (const uri of urisToDelete) {
      await this.deleteAudioFile(uri);
    }
    this.sessionAudioUris.clear();
  }

  static getIsRecording(): boolean {
    return this.isRecording;
  }
}
