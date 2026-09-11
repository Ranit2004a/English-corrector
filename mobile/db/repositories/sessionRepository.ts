import { getDatabase } from '../database';
import { Session, CEFRLevel } from '../../types';

export const SessionRepository = {
  async createSession(topic: string, level: CEFRLevel): Promise<Session> {
    const db = await getDatabase();
    const id = `session_${Date.now()}`;
    const started_at = new Date().toISOString();

    const session: Session = {
      id,
      topic,
      level,
      started_at,
      duration: 0,
      messages_count: 0,
      mistakes_count: 0,
    };

    await db.runAsync(
      `INSERT INTO sessions (id, topic, level, started_at, duration, messages_count, mistakes_count) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [session.id, session.topic, session.level, session.started_at, session.duration, session.messages_count, session.mistakes_count]
    );

    return session;
  },

  async updateSessionEnd(id: string, duration: number, messages_count: number, mistakes_count: number): Promise<void> {
    const db = await getDatabase();
    const ended_at = new Date().toISOString();
    await db.runAsync(
      `UPDATE sessions SET ended_at = ?, duration = ?, messages_count = ?, mistakes_count = ? WHERE id = ?;`,
      [ended_at, duration, messages_count, mistakes_count, id]
    );
  },

  async getSession(id: string): Promise<Session | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<any>(`SELECT * FROM sessions WHERE id = ?;`, [id]);
    if (!row) return null;
    return {
      id: row.id,
      topic: row.topic,
      level: row.level as CEFRLevel,
      started_at: row.started_at,
      ended_at: row.ended_at,
      duration: row.duration,
      messages_count: row.messages_count,
      mistakes_count: row.mistakes_count,
    };
  },

  async getAllSessions(): Promise<Session[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<any>(`SELECT * FROM sessions ORDER BY started_at DESC;`);
    return rows.map((r: any) => ({
      id: r.id,
      topic: r.topic,
      level: r.level as CEFRLevel,
      started_at: r.started_at,
      ended_at: r.ended_at,
      duration: r.duration,
      messages_count: r.messages_count,
      mistakes_count: r.mistakes_count,
    }));
  },

  async getTotalPracticeSeconds(): Promise<number> {
    const sessions = await this.getAllSessions();
    return sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  }
};
