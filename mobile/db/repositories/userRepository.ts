import { getDatabase } from '../database';
import { UserProfile, CEFRLevel, LearningGoal } from '../../types';

export const UserRepository = {
  async getUser(): Promise<UserProfile | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<any>('SELECT * FROM users LIMIT 1;');
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      level: row.level as CEFRLevel,
      goal: row.goal as LearningGoal,
      daily_goal_minutes: row.daily_goal_minutes,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  },

  async saveUser(user: Partial<UserProfile> & { name: string; level: CEFRLevel }): Promise<UserProfile> {
    const db = await getDatabase();
    const existing = await this.getUser();
    const now = new Date().toISOString();

    if (existing) {
      const updated: UserProfile = {
        ...existing,
        ...user,
        updated_at: now,
      };
      await db.runAsync(
        `UPDATE users SET name = ?, email = ?, level = ?, goal = ?, daily_goal_minutes = ?, updated_at = ? WHERE id = ?;`,
        [
          updated.name,
          updated.email || null,
          updated.level,
          updated.goal,
          updated.daily_goal_minutes,
          updated.updated_at,
          updated.id,
        ]
      );
      return updated;
    } else {
      const newUser: UserProfile = {
        id: user.id || `user_${Date.now()}`,
        name: user.name,
        email: user.email,
        level: user.level || 'B1',
        goal: user.goal || 'Everyday conversation',
        daily_goal_minutes: user.daily_goal_minutes || 15,
        created_at: now,
        updated_at: now,
      };
      await db.runAsync(
        `INSERT INTO users (id, name, email, level, goal, daily_goal_minutes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          newUser.id,
          newUser.name,
          newUser.email || null,
          newUser.level,
          newUser.goal,
          newUser.daily_goal_minutes,
          newUser.created_at,
          newUser.updated_at,
        ]
      );
      return newUser;
    }
  },

  async updateLevel(level: CEFRLevel): Promise<void> {
    const user = await this.getUser();
    if (user) {
      await this.saveUser({ ...user, level });
    }
  },
};
