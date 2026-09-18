import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '../store/useSettingsStore';

export class HapticService {
  private static isEnabled(): boolean {
    if (Platform.OS === 'web') return false;
    try {
      return useSettingsStore.getState().settings.haptic_feedback ?? true;
    } catch {
      return true;
    }
  }

  static async impactLight(): Promise<void> {
    if (!this.isEnabled()) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Ignore
    }
  }

  static async impactMedium(): Promise<void> {
    if (!this.isEnabled()) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      // Ignore
    }
  }

  static async impactHeavy(): Promise<void> {
    if (!this.isEnabled()) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (e) {
      // Ignore
    }
  }

  static async selection(): Promise<void> {
    if (!this.isEnabled()) return;
    try {
      await Haptics.selectionAsync();
    } catch (e) {
      // Ignore
    }
  }

  static async notificationSuccess(): Promise<void> {
    if (!this.isEnabled()) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      // Ignore
    }
  }

  static async notificationError(): Promise<void> {
    if (!this.isEnabled()) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (e) {
      // Ignore
    }
  }
}
