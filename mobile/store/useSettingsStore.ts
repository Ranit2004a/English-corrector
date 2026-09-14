import { create } from 'zustand';
import { AppSettings } from '../types';
import { SettingsRepository } from '../db/repositories/settingsRepository';
import { setCustomBackendUrl } from '../services/api';

interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;
  loadSettings: () => Promise<void>;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
  clearAllData: () => Promise<void>;
  exportData: () => Promise<string>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {
    speech_rate: 1.0,
    voice_auto_play: true,
    haptic_feedback: true,
    backend_url: '',
    dark_mode: false,
  },
  isLoading: true,

  loadSettings: async () => {
    try {
      const settings = await SettingsRepository.getSettings();
      const effectiveUrl = settings.backend_url ? settings.backend_url.trim() : '';
      setCustomBackendUrl(effectiveUrl);
      set({ settings: { ...settings, backend_url: effectiveUrl }, isLoading: false });
    } catch (e) {
      console.warn('Error loading settings:', e);
      set({ isLoading: false });
    }
  },

  updateSetting: async (key, value) => {
    await SettingsRepository.setSetting(key, value);
    const updated = { ...get().settings, [key]: value };
    if (key === 'backend_url') {
      setCustomBackendUrl(value as string);
    }
    set({ settings: updated });
  },

  clearAllData: async () => {
    await SettingsRepository.clearAllLocalData();
  },

  exportData: async () => {
    return await SettingsRepository.exportAllData();
  }
}));
