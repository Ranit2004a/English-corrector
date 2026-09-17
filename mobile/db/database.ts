import { Platform } from 'react-native';
import { INITIAL_SCHEMA_SQL } from './migrations';

export interface IDatabase {
  execAsync(sql: string): Promise<void>;
  runAsync(sql: string, params?: any[]): Promise<any>;
  getAllAsync<T = any>(sql: string, params?: any[]): Promise<T[]>;
  getFirstAsync<T = any>(sql: string, params?: any[]): Promise<T | null>;
}

let dbInstance: IDatabase | null = null;

// Lightweight in-memory storage fallback for Web browser execution
class WebStorageDatabase implements IDatabase {
  private tables: Record<string, any[]> = {
    users: [],
    sessions: [],
    messages: [],
    corrections: [],
    vocabulary: [],
    progress: [],
    settings: [],
  };

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem('echo_sqlite_db');
        if (saved) {
          this.tables = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Could not load web database:', e);
      }
    }
  }

  private saveToLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('echo_sqlite_db', JSON.stringify(this.tables));
      } catch (e) {
        console.warn('Could not save web database:', e);
      }
    }
  }

  async execAsync(sql: string): Promise<void> {
    return Promise.resolve();
  }

  async runAsync(sql: string, params: any[] = []): Promise<any> {
    const trimmed = sql.trim().toLowerCase();
    
    if (trimmed.startsWith('insert into')) {
      const match = sql.match(/insert\s+into\s+(\w+)\s*\(([^)]+)\)\s*values\s*\(([^)]+)\)/i);
      if (match) {
        const table = match[1].toLowerCase();
        const columns = match[2].split(',').map(c => c.trim());
        const row: any = {};
        columns.forEach((col, idx) => {
          row[col] = params[idx];
        });
        if (!this.tables[table]) this.tables[table] = [];
        const existingIdx = this.tables[table].findIndex(r => r.id === row.id || (col_key(row) && col_key(row) === col_key(r)));
        if (existingIdx >= 0) {
          this.tables[table][existingIdx] = { ...this.tables[table][existingIdx], ...row };
        } else {
          this.tables[table].push(row);
        }
        this.saveToLocalStorage();
      }
    } else if (trimmed.startsWith('update')) {
      const match = sql.match(/update\s+(\w+)\s+set\s+(.+?)\s+where\s+id\s*=\s*\?/i);
      if (match) {
        const table = match[1].toLowerCase();
        const setParts = match[2].split(',').map(s => s.trim().split('=')[0].trim());
        const id = params[params.length - 1];
        if (this.tables[table]) {
          const row = this.tables[table].find(r => r.id === id);
          if (row) {
            setParts.forEach((col, idx) => {
              row[col] = params[idx];
            });
            this.saveToLocalStorage();
          }
        }
      }
    } else if (trimmed.startsWith('delete from')) {
      const match = sql.match(/delete\s+from\s+(\w+)(?:\s+where\s+(.+))?/i);
      if (match) {
        const table = match[1].toLowerCase();
        if (params.length > 0) {
          this.tables[table] = (this.tables[table] || []).filter(r => r.id !== params[0] && r.session_id !== params[0]);
        } else {
          this.tables[table] = [];
        }
        this.saveToLocalStorage();
      }
    }
    return Promise.resolve({ changes: 1, lastInsertRowId: 1 });
  }

  async getAllAsync<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const trimmed = sql.trim().toLowerCase();
    const match = sql.match(/from\s+(\w+)/i);
    if (!match) return [];
    const table = match[1].toLowerCase();
    const list = this.tables[table] || [];
    
    if (trimmed.includes('where')) {
      if (trimmed.includes('session_id = ?')) {
        return list.filter(r => r.session_id === params[0]) as T[];
      }
      if (trimmed.includes('category = ?')) {
        return list.filter(r => r.category === params[0]) as T[];
      }
      if (trimmed.includes('learned = ?')) {
        return list.filter(r => Number(r.learned) === Number(params[0])) as T[];
      }
      if (trimmed.includes('key = ?')) {
        return list.filter(r => r.key === params[0]) as T[];
      }
      if (trimmed.includes('id = ?')) {
        return list.filter(r => r.id === params[0]) as T[];
      }
      if (trimmed.includes('date = ?')) {
        return list.filter(r => r.date === params[0]) as T[];
      }
    }
    return [...list] as T[];
  }

  async getFirstAsync<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const all = await this.getAllAsync<T>(sql, params);
    return all.length > 0 ? all[0] : null;
  }
}

function col_key(row: any) {
  return row.key || row.date || row.word || null;
}

export async function getDatabase(): Promise<IDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  if (Platform.OS === 'web') {
    dbInstance = new WebStorageDatabase();
    return dbInstance;
  }

  try {
    const SQLite = require('expo-sqlite');
    dbInstance = await SQLite.openDatabaseAsync('english_corrector.db');
    if (dbInstance) {
      await dbInstance.execAsync(INITIAL_SCHEMA_SQL);
      // Ensure columns exist in case of upgrading existing DB
      try {
        await dbInstance.execAsync('ALTER TABLE messages ADD COLUMN audio_uri TEXT;');
      } catch (e) {
        // Column already exists
      }
      try {
        await dbInstance.execAsync('ALTER TABLE corrections ADD COLUMN audio_uri TEXT;');
      } catch (e) {
        // Column already exists
      }
    }
    return dbInstance as IDatabase;
  } catch (error) {
    console.warn('Failed to open native SQLite database, using WebStorage fallback:', error);
    dbInstance = new WebStorageDatabase();
    return dbInstance;
  }
}

export async function initDatabase(): Promise<void> {
  const db = await getDatabase();
  if (Platform.OS !== 'web' && db.execAsync) {
    await db.execAsync(INITIAL_SCHEMA_SQL);
    try {
      await db.execAsync('ALTER TABLE messages ADD COLUMN audio_uri TEXT;');
    } catch (e) {}
    try {
      await db.execAsync('ALTER TABLE corrections ADD COLUMN audio_uri TEXT;');
    } catch (e) {}
  }
}
