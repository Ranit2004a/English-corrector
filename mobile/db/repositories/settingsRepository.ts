import { getDatabase } from '../database';
import { AppSettings } from '../../types';

const DEFAULT_SETTINGS: AppSettings = {
  speech_rate: 1.0,
  voice_auto_play: true,
  haptic_feedback: true,
  backend_url: 'http://localhost:8000',
  dark_mode: false,
};

export const SettingsRepository = {
  async getSettings(): Promise<AppSettings> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<any>(`SELECT * FROM settings;`);
    const settings = { ...DEFAULT_SETTINGS };
    
    rows.forEach((r: any) => {
      try {
        (settings as any)[r.key] = JSON.parse(r.value);
      } catch {
        (settings as any)[r.key] = r.value;
      }
    });
    
    return settings;
  },

  async setSetting(key: keyof AppSettings, value: any): Promise<void> {
    const db = await getDatabase();
    const valStr = JSON.stringify(value);
    const existing = await db.getFirstAsync<any>(`SELECT * FROM settings WHERE key = ?;`, [key]);
    
    if (existing) {
      await db.runAsync(`UPDATE settings SET value = ? WHERE key = ?;`, [valStr, key]);
    } else {
      const id = `set_${key}`;
      await db.runAsync(`INSERT INTO settings (id, key, value) VALUES (?, ?, ?);`, [id, key, valStr]);
    }
  },

  async clearAllLocalData(): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(`DELETE FROM messages;`);
    await db.runAsync(`DELETE FROM corrections;`);
    await db.runAsync(`DELETE FROM sessions;`);
    await db.runAsync(`DELETE FROM vocabulary;`);
    await db.runAsync(`DELETE FROM progress;`);
    await db.runAsync(`DELETE FROM settings;`);
    await db.runAsync(`DELETE FROM users;`);
  },

  async exportAllData(): Promise<string> {
    const db = await getDatabase();
    const users = await db.getAllAsync(`SELECT * FROM users;`);
    const sessions = await db.getAllAsync(`SELECT * FROM sessions;`);
    const messages = await db.getAllAsync(`SELECT * FROM messages;`);
    const corrections = await db.getAllAsync(`SELECT * FROM corrections;`);
    const vocabulary = await db.getAllAsync(`SELECT * FROM vocabulary;`);
    const progress = await db.getAllAsync(`SELECT * FROM progress;`);
    
    return JSON.stringify({
      version: '1.0',
      exported_at: new Date().toISOString(),
      users,
      sessions,
      messages,
      corrections,
      vocabulary,
      progress,
    }, null, 2);
  }
};
