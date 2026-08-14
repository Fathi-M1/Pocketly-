# State

## Types

```typescript
type Priority = 'low' | 'medium' | 'high';
type TaskStatus = 'pending' | 'completed';
type MascotMood = 'happy' | 'neutral' | 'concerned' | 'tired' | 'celebrating';

interface Task {
  id: string;
  title: string;
  dueAt: string; // ISO
  priority: Priority;
  status: TaskStatus;
  completedAt?: string;
}

interface Companion {
  health: number; // 0-100
  streak: number;
  lastCompletedDate?: string; // YYYY-MM-DD
}

interface PocketlyState {
  tasks: Task[];
  companion: Companion;
  userName: string;
  justCompleted: boolean;
  captureMessage: string | null;
  captureOpen: boolean;
  editingTaskId: string | null;
}
```

## Actions

- `addTask(task: Omit<Task, 'id' | 'status'>)`
- `updateTask(id, partial)`
- `deleteTask(id)`
- `completeTask(id)` — sets status completed, +5 health, updates streak if first today
- `setCaptureOpen(open, editingTaskId?)`
- `clearJustCompleted()`
- `setCaptureMessage(msg | null)`

## Selectors / derived

- `getNextUp()` — earliest pending task by dueAt
- `getTodayTasks()` — pending + completed due today
- `getTasksForDate(date)` — all tasks on calendar day
- `getOverdueTasks()` — pending where dueAt < now
- `getMood()` — per 02-MASCOT rules
- `getSpeechMessage()` — mood-based string
- `getCompletionStats()` — completed, missed, rate
- `getWeeklyActivity()` — last 7 days counts

## Seed data (~8 tasks)

Cover: next-up (soonest pending), overdue (yesterday), due-soon (within 2h), later today, tomorrow, completed today, completed past, low priority future.

Default companion: `{ health: 72, streak: 5 }`

## Complete flow side effects

When `completeTask(id)`:
1. Task status → completed, completedAt = now
2. companion.health = min(100, health + 5)
3. If lastCompletedDate !== today: streak += 1, lastCompletedDate = today
4. justCompleted = true
5. Navigate to shake screen triggers animation; on finish navigate home

When Home mounts after complete, clear justCompleted after 3s.
