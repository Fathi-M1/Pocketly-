import React, { useState, useEffect } from 'react';
import { Task, CompanionStats, NavigationTab, MascotMood } from './types';
import { INITIAL_TASKS, INITIAL_COMPANION } from './data/initialData';
import { TopHeader } from './components/TopHeader';
import { TodayScreen } from './components/TodayScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { CompanionScreen } from './components/CompanionScreen';
import { TaskDetailsModal } from './components/TaskDetailsModal';
import { QuickCaptureModal } from './components/QuickCaptureModal';
import { ShakeCompleteModal } from './components/ShakeCompleteModal';
import { BottomNavBar } from './components/BottomNavBar';
import { Heart, Flame, RefreshCw, Smartphone } from 'lucide-react';

const STORAGE_VERSION = 'v2';

export default function App() {
  // Application Data State
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const version = localStorage.getItem('pocketly_version');
      if (version !== STORAGE_VERSION) {
        localStorage.setItem('pocketly_version', STORAGE_VERSION);
        return INITIAL_TASKS;
      }
      const saved = localStorage.getItem('pocketly_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [companion, setCompanion] = useState<CompanionStats>(() => {
    try {
      const version = localStorage.getItem('pocketly_version');
      if (version !== STORAGE_VERSION) return INITIAL_COMPANION;
      const saved = localStorage.getItem('pocketly_companion');
      return saved ? JSON.parse(saved) : INITIAL_COMPANION;
    } catch {
      return INITIAL_COMPANION;
    }
  });

  // Navigation and Modal States
  const [activeTab, setActiveTab] = useState<NavigationTab>('today');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddDate, setQuickAddDate] = useState<string | undefined>(undefined);
  const [isShakeOpen, setIsShakeOpen] = useState(false);
  const [taskForShake, setTaskForShake] = useState<Task | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('pocketly_tasks', JSON.stringify(tasks));
    } catch (e) {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('pocketly_companion', JSON.stringify(companion));
    } catch (e) {}
  }, [companion]);

  // Handle task complete toggle
  const handleToggleComplete = (taskId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (!task.completed) {
      // Incomplete task → launch shake-to-complete flow
      handleLaunchShake(task);
    } else {
      // Already completed → uncheck directly
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, completed: false, completedAt: undefined } : t
        )
      );
    }
  };

  // Trigger reward feedback when task completed
  const triggerReward = (taskTitle?: string) => {
    setCompanion((prev) => {
      const newHealth = Math.min(100, prev.health + 5);
      const newXp = prev.xp + 45;
      const leveledUp = newXp >= prev.nextLevelXp;

      return {
        ...prev,
        health: newHealth,
        totalCompleted: prev.totalCompleted + 1,
        completedThisWeek: prev.completedThisWeek + 1,
        xp: leveledUp ? newXp - prev.nextLevelXp : newXp,
        level: leveledUp ? prev.level + 1 : prev.level,
        mood: 'celebrating',
        message: taskTitle ? `Boom! "${taskTitle.slice(0, 24)}..." completed! +5 ❤️` : 'Great job! +5 ❤️ health restored!',
      };
    });

    // Revert mood from celebrating to happy after a while
    setTimeout(() => {
      setCompanion((prev) => ({
        ...prev,
        mood: prev.health < 40 ? 'concerned' : 'happy',
      }));
    }, 4500);
  };

  // Launch Shake modal for a specific task
  const handleLaunchShake = (task: Task) => {
    setTaskForShake(task);
    setIsShakeOpen(true);
  };

  // When shake completes
  const handleShakeCompleteSuccess = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: true,
              completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : t
      )
    );
    triggerReward(tasks.find((t) => t.id === taskId)?.title);
  };

  // Add new task
  const handleAddTask = (newTask: Omit<Task, 'id' | 'completed'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setTasks((prev) => [task, ...prev]);

    setCompanion((prev) => ({
      ...prev,
      message: `New task locked in: "${task.title.slice(0, 20)}..."! Let's crush it!`,
    }));
  };

  // Update existing task
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setSelectedTask(updatedTask);
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  // Pet Pocky interaction
  const handlePetMascot = () => {
    setCompanion((prev) => {
      const boostedHealth = Math.min(100, prev.health + 1);
      return {
        ...prev,
        health: boostedHealth,
        mood: prev.mood === 'tired' ? 'happy' : prev.mood,
        message: 'Purrrr! Pocky loves that! +1 ❤️',
      };
    });
  };

  // Change mood explicitly
  const handleChangeMood = (mood: MascotMood) => {
    setCompanion((prev) => ({ ...prev, mood }));
  };

  // Reset demo
  const handleResetData = () => {
    setTasks(INITIAL_TASKS);
    setCompanion(INITIAL_COMPANION);
    setSelectedTask(null);
    setIsShakeOpen(false);
    setIsQuickAddOpen(false);
  };

  // Start next up task
  const handleStartNextUpTask = (task: Task) => {
    handleLaunchShake(task);
  };

  const simulateShake = () => {
    const pending = tasks.find((t) => !t.completed) || tasks[0];
    if (pending) handleLaunchShake(pending);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE]">
      {/* Desktop demo controls bar — hidden on real phones */}
      <div className="hidden md:flex items-center justify-between px-6 py-2.5 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-[#7047EB] text-white flex items-center justify-center text-xs font-bold shrink-0">
            P
          </div>
          <span className="font-extrabold text-sm text-slate-800 tracking-tight">Pocketly</span>
          <span className="text-xs text-slate-400 font-medium hidden lg:block">— desktop preview</span>
          <div className="h-4 w-px bg-slate-200" />
          <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full text-xs font-semibold">
            <Heart className="w-3 h-3 fill-rose-500" /> {companion.health}%
          </span>
          <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-xs font-semibold">
            <Flame className="w-3 h-3 fill-amber-500" /> {companion.streak}d streak
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={simulateShake}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-[#6138E8] text-xs font-bold transition active:scale-95 cursor-pointer shadow-sm"
          >
            <Smartphone className="w-3.5 h-3.5" />
            Simulate Shake
          </button>
          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Demo
          </button>
        </div>
      </div>

      {/* App content — full width on mobile, centered on desktop */}
      <div className="w-full max-w-[520px] mx-auto flex flex-col min-h-screen md:min-h-0">
        {/* 1. If Task Details Modal is Open */}
        {selectedTask ? (
          <TaskDetailsModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onLaunchShake={(t) => {
              setSelectedTask(null);
              handleLaunchShake(t);
            }}
            onToggleComplete={(id) => handleToggleComplete(id)}
            onDeleteTask={handleDeleteTask}
            onUpdateTask={handleUpdateTask}
          />
        ) : (
          /* 2. Main Tab Views */
          <div className="flex flex-col flex-1">
            <TopHeader
              title={
                activeTab === 'today'
                  ? 'Today'
                  : activeTab === 'calendar'
                  ? 'Calendar'
                  : 'Companion'
              }
            />

            {activeTab === 'today' && (
              <TodayScreen
                tasks={tasks}
                companion={companion}
                onToggleComplete={handleToggleComplete}
                onOpenTaskDetails={(t) => setSelectedTask(t)}
                onStartNextUpTask={handleStartNextUpTask}
                onOpenQuickAdd={() => {
                  setQuickAddDate(undefined);
                  setIsQuickAddOpen(true);
                }}
                onNavigateToCompanion={() => setActiveTab('companion')}
                onPetMascot={handlePetMascot}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarScreen
                tasks={tasks}
                onOpenTaskDetails={(t) => setSelectedTask(t)}
                onOpenQuickAdd={(date) => {
                  setQuickAddDate(date);
                  setIsQuickAddOpen(true);
                }}
              />
            )}

            {activeTab === 'companion' && (
              <CompanionScreen
                companion={companion}
                onPetMascot={handlePetMascot}
                onChangeMood={handleChangeMood}
              />
            )}

            <BottomNavBar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setSelectedTask(null);
                setActiveTab(tab);
              }}
              onOpenQuickAdd={() => {
                setQuickAddDate(undefined);
                setIsQuickAddOpen(true);
              }}
            />
          </div>
        )}
      </div>

      {/* Modals — rendered outside the scroll container so fixed positioning works */}
      <QuickCaptureModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTask={handleAddTask}
        initialDate={quickAddDate}
      />

      <ShakeCompleteModal
        task={taskForShake}
        isOpen={isShakeOpen}
        onClose={() => {
          setIsShakeOpen(false);
          setTaskForShake(null);
        }}
        onCompleteSuccess={handleShakeCompleteSuccess}
      />
    </div>
  );
}
