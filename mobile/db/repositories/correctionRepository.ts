import { getDatabase } from '../database';
import { Correction, CorrectionCategory, CorrectionSeverity } from '../../types';

export const CorrectionRepository = {
  async addCorrection(
    original: string,
    corrected: string,
    explanation: string,
    category: CorrectionCategory,
    severity: CorrectionSeverity,
    session_id?: string,
    message_id?: string,
    audio_uri?: string
  ): Promise<Correction> {
    const db = await getDatabase();
    const id = `corr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const created_at = new Date().toISOString();

    const item: Correction = {
      id,
      session_id,
      message_id,
      original,
      corrected,
      explanation,
      category,
      severity,
      audio_uri,
      created_at,
    };

    await db.runAsync(
      `INSERT INTO corrections (id, session_id, message_id, original, corrected, explanation, category, severity, audio_uri, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [item.id, item.session_id || null, item.message_id || null, item.original, item.corrected, item.explanation, item.category, item.severity, item.audio_uri || null, item.created_at]
    );

    return item;
  },

  async getCorrectionsBySession(session_id: string): Promise<Correction[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<any>(
      `SELECT * FROM corrections WHERE session_id = ? ORDER BY created_at DESC;`,
      [session_id]
    );
    return rows.map((r: any) => ({
      id: r.id,
      session_id: r.session_id,
      message_id: r.message_id,
      original: r.original,
      corrected: r.corrected,
      explanation: r.explanation,
      category: r.category as CorrectionCategory,
      severity: r.severity as CorrectionSeverity,
      audio_uri: r.audio_uri || undefined,
      created_at: r.created_at,
    }));
  },

  async getAllCorrections(filterCategory?: CorrectionCategory): Promise<Correction[]> {
    const db = await getDatabase();
    let rows: any[];
    if (filterCategory) {
      rows = await db.getAllAsync<any>(
        `SELECT * FROM corrections WHERE category = ? ORDER BY created_at DESC;`,
        [filterCategory]
      );
    } else {
      rows = await db.getAllAsync<any>(
        `SELECT * FROM corrections ORDER BY created_at DESC;`
      );
    }
    return rows.map((r: any) => ({
      id: r.id,
      session_id: r.session_id,
      message_id: r.message_id,
      original: r.original,
      corrected: r.corrected,
      explanation: r.explanation,
      category: r.category as CorrectionCategory,
      severity: r.severity as CorrectionSeverity,
      audio_uri: r.audio_uri || undefined,
      created_at: r.created_at,
    }));
  },

  async getCategoryCounts(): Promise<Record<CorrectionCategory, number>> {
    const all = await this.getAllCorrections();
    const counts: Record<CorrectionCategory, number> = {
      grammar: 0,
      vocabulary: 0,
      pronunciation: 0,
      naturalness: 0,
    };
    all.forEach((c: Correction) => {
      if (counts[c.category] !== undefined) {
        counts[c.category]++;
      }
    });
    return counts;
  },

  async clearSessionAudio(session_id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE corrections SET audio_uri = NULL WHERE session_id = ?;`,
      [session_id]
    );
  },
};
