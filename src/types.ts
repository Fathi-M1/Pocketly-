export type Priority = 'low' | 'medium' | 'high';

export type TaskCategory = 'design' | 'dev' | 'marketing' | 'personal' | 'general';

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM or format like "5:00 PM"
  endTime?: string; // e.g. "6:00 PM"
  priority: Priority;
  category?: TaskCategory;
  completed: boolean;
  completedAt?: string;
  isNextUp?: boolean;
  overdue?: boolean;
  isSoon?: boolean;
  attendees?: string[]; // Initials or avatar keys
  estimatedMinutes?: number;
  subtasks?: { id: string; title: string; completed: boolean }[];
}

export type MascotMood = 'happy' | 'thinking' | 'concerned' | 'tired' | 'celebrating';

export interface CompanionStats {
  name: string;
  health: number; // 0 - 100
  streak: number; // days
  level: number;
  xp: number;
  nextLevelXp: number;
  mood: MascotMood;
  message: string;
  mentalClarityScore: number;
  completedThisWeek: number;
  totalCompleted: number;
  missedTasks: number;
}

export type NavigationTab = 'today' | 'calendar' | 'companion';

export interface ToastMessage {
  id: string;
  title: string;
  subtitle?: string;
  type: 'success' | 'health' | 'streak' | 'info';
}
