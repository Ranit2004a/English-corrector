import { getDatabase } from '../database';
import { DailyProgress } from '../../types';

const getLocalDateKey = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseLocalDateKey = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1, 0, 0, 0, 0);
};

export const ProgressRepository = {
  async getTodayProgress(): Promise<DailyProgress> {
    const today = getLocalDateKey(new Date());
    const db = await getDatabase();
    const row = await db.getFirstAsync<any>(`SELECT * FROM progress WHERE date = ?;`, [today]);
    
    if (row) {
      return {
        id: row.id,
        date: row.date,
        speaking_minutes: row.speaking_minutes,
        sessions_completed: row.sessions_completed,
        mistakes_count: row.mistakes_count,
        words_learned: row.words_learned,
        grammar_score: row.grammar_score,
        vocabulary_score: row.vocabulary_score,
        pronunciation_score: row.pronunciation_score,
        fluency_score: row.fluency_score,
      };
    }

    const newProgress: DailyProgress = {
      id: `prog_${today}`,
      date: today,
      speaking_minutes: 0,
      sessions_completed: 0,
      mistakes_count: 0,
      words_learned: 0,
      grammar_score: 80,
      vocabulary_score: 80,
      pronunciation_score: 80,
      fluency_score: 80,
    };

    await db.runAsync(
      `INSERT INTO progress (id, date, speaking_minutes, sessions_completed, mistakes_count, words_learned, grammar_score, vocabulary_score, pronunciation_score, fluency_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        newProgress.id,
        newProgress.date,
        newProgress.speaking_minutes,
        newProgress.sessions_completed,
        newProgress.mistakes_count,
        newProgress.words_learned,
        newProgress.grammar_score,
        newProgress.vocabulary_score,
        newProgress.pronunciation_score,
        newProgress.fluency_score,
      ]
    );

    return newProgress;
  },

  async recordSessionCompletion(
    durationSeconds: number,
    mistakesCount: number,
    grammarScore: number,
    vocabScore: number,
    fluencyScore: number
  ): Promise<void> {
    const todayProgress = await this.getTodayProgress();
    const db = await getDatabase();
    
    const additionalMinutes = Math.max(1, Math.round(durationSeconds / 60));
    const newMinutes = todayProgress.speaking_minutes + additionalMinutes;
    const newSessions = todayProgress.sessions_completed + 1;
    const newMistakes = todayProgress.mistakes_count + mistakesCount;

    // Moving average of scores
    const avgGrammar = Math.round((todayProgress.grammar_score + grammarScore) / 2);
    const avgVocab = Math.round((todayProgress.vocabulary_score + vocabScore) / 2);
    const avgFluency = Math.round((todayProgress.fluency_score + fluencyScore) / 2);

    await db.runAsync(
      `UPDATE progress SET speaking_minutes = ?, sessions_completed = ?, mistakes_count = ?, grammar_score = ?, vocabulary_score = ?, fluency_score = ? WHERE id = ?;`,
      [newMinutes, newSessions, newMistakes, avgGrammar, avgVocab, avgFluency, todayProgress.id]
    );
  },

  async getRecentProgress(days: number = 7): Promise<DailyProgress[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<any>(`SELECT * FROM progress ORDER BY date DESC LIMIT ?;`, [days]);
    return rows.map((r: any) => ({
      id: r.id,
      date: r.date,
      speaking_minutes: r.speaking_minutes,
      sessions_completed: r.sessions_completed,
      mistakes_count: r.mistakes_count,
      words_learned: r.words_learned,
      grammar_score: r.grammar_score,
      vocabulary_score: r.vocabulary_score,
      pronunciation_score: r.pronunciation_score,
      fluency_score: r.fluency_score,
    }));
  },

  async getStreak(): Promise<number> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<any>(`SELECT date, speaking_minutes FROM progress WHERE speaking_minutes > 0 ORDER BY date DESC;`);
    if (!rows || rows.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < rows.length; i++) {
      const d = parseLocalDateKey(rows[i].date);
      const diffDays = Math.round((today.getTime() - d.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === streak || (streak === 0 && diffDays === 1)) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }
    return Math.max(1, streak);
  }
};
