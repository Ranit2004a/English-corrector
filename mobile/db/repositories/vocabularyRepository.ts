import { getDatabase } from '../database';
import { VocabularyItem } from '../../types';

export const VocabularyRepository = {
  async addVocabulary(word: string, meaning: string, example: string, source?: string): Promise<VocabularyItem> {
    const db = await getDatabase();
    const id = `vocab_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const created_at = new Date().toISOString();

    const item: VocabularyItem = {
      id,
      word: word.trim(),
      meaning: meaning.trim(),
      example: example.trim(),
      source,
      learned: false,
      created_at,
    };

    try {
      await db.runAsync(
        `INSERT INTO vocabulary (id, word, meaning, example, source, learned, created_at) VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [item.id, item.word, item.meaning, item.example, item.source || null, 0, item.created_at]
      );
    } catch (e) {
      console.log('Vocabulary word already exists or insert failed:', e);
    }

    return item;
  },

  async getAllVocabulary(filterLearned?: boolean): Promise<VocabularyItem[]> {
    const db = await getDatabase();
    let rows: any[];
    if (filterLearned !== undefined) {
      rows = await db.getAllAsync<any>(
        `SELECT * FROM vocabulary WHERE learned = ? ORDER BY created_at DESC;`,
        [filterLearned ? 1 : 0]
      );
    } else {
      rows = await db.getAllAsync<any>(
        `SELECT * FROM vocabulary ORDER BY created_at DESC;`
      );
    }
    return rows.map((r: any) => ({
      id: r.id,
      word: r.word,
      meaning: r.meaning,
      example: r.example,
      source: r.source,
      learned: Boolean(r.learned),
      created_at: r.created_at,
    }));
  },

  async toggleLearned(id: string, learned: boolean): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(`UPDATE vocabulary SET learned = ? WHERE id = ?;`, [learned ? 1 : 0, id]);
  },

  async deleteVocabulary(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(`DELETE FROM vocabulary WHERE id = ?;`, [id]);
  }
};
