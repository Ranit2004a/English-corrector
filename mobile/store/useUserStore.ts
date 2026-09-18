import { create } from 'zustand';
import { UserProfile, CEFRLevel, LearningGoal } from '../types';
import { UserRepository } from '../db/repositories/userRepository';
import { ProgressRepository } from '../db/repositories/progressRepository';

interface UserState {
  user: UserProfile | null;
  streak: number;
  todayMinutes: number;
  todayFluency: number;
  dailyGoal: number;
  isLoading: boolean;
  
  loadUser: () => Promise<void>;
  saveUser: (name: string, level: CEFRLevel, goal: LearningGoal, dailyGoalMinutes?: number) => Promise<void>;
  setLevel: (level: CEFRLevel) => Promise<void>;
  refreshProgress: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  streak: 7, // Initial default / loaded from DB
  todayMinutes: 0,
  todayFluency: 80,
  dailyGoal: 15,
  isLoading: true,

  loadUser: async () => {
    set({ isLoading: true });
    try {
      let user = await UserRepository.getUser();
      if (!user) {
        // Initialize default user
        user = await UserRepository.saveUser({
          name: 'Learner',
          level: 'B1',
          goal: 'Everyday conversation',
          daily_goal_minutes: 15,
        });
      }
      const progress = await ProgressRepository.getTodayProgress();
      const streak = await ProgressRepository.getStreak();

      set({
        user,
        dailyGoal: user.daily_goal_minutes || 15,
        todayMinutes: progress.speaking_minutes,
        todayFluency: progress.fluency_score ?? 80,
        streak: Math.max(1, streak),
        isLoading: false,
      });
    } catch (e) {
      console.warn('Error loading user:', e);
      set({ isLoading: false });
      throw e;
    }
  },

  saveUser: async (name: string, level: CEFRLevel, goal: LearningGoal, dailyGoalMinutes: number = 15) => {
    const updated = await UserRepository.saveUser({
      name,
      level,
      goal,
      daily_goal_minutes: dailyGoalMinutes,
    });
    set({ user: updated, dailyGoal: dailyGoalMinutes });
  },

  setLevel: async (level: CEFRLevel) => {
    await UserRepository.updateLevel(level);
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, level } });
    }
  },

  refreshProgress: async () => {
    const progress = await ProgressRepository.getTodayProgress();
    const streak = await ProgressRepository.getStreak();
    set({
      todayMinutes: progress.speaking_minutes,
      todayFluency: progress.fluency_score ?? 80,
      streak: Math.max(1, streak),
    });
  }
}));
