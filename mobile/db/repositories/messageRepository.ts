import { getDatabase } from '../database';
import { Message } from '../../types';

export const MessageRepository = {
  async addMessage(session_id: string, role: 'user' | 'assistant', text: string): Promise<Message> {
    const db = await getDatabase();
    const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const created_at = new Date().toISOString();

    const msg: Message = {
      id,
      session_id,
      role,
      text,
      created_at,
    };

    await db.runAsync(
      `INSERT INTO messages (id, session_id, role, text, created_at) VALUES (?, ?, ?, ?, ?);`,
      [msg.id, msg.session_id, msg.role, msg.text, msg.created_at]
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
      created_at: r.created_at,
    }));
  },
};
