import { getDatabase } from '../database';
import { Message } from '../../types';

export const MessageRepository = {
  async addMessage(session_id: string, role: 'user' | 'assistant', text: string, audio_uri?: string): Promise<Message> {
    const db = await getDatabase();
    const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const created_at = new Date().toISOString();

    const msg: Message = {
      id,
      session_id,
      role,
      text,
      audio_uri,
      created_at,
    };

    await db.runAsync(
      `INSERT INTO messages (id, session_id, role, text, audio_uri, created_at) VALUES (?, ?, ?, ?, ?, ?);`,
      [msg.id, msg.session_id, msg.role, msg.text, msg.audio_uri || null, msg.created_at]
    );

    return msg;
  },

  async getMessagesBySession(session_id: string): Promise<Message[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<any>(
      `SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC;`,
      [session_id]
    );
    return rows.map((r: any) => ({
      id: r.id,
      session_id: r.session_id,
      role: r.role as 'user' | 'assistant',
      text: r.text,
      audio_uri: r.audio_uri || undefined,
      created_at: r.created_at,
    }));
  },

  async clearSessionAudio(session_id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE messages SET audio_uri = NULL WHERE session_id = ?;`,
      [session_id]
    );
  },
};
