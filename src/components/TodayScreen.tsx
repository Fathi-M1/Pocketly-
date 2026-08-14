import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, CompanionStats } from '../types';
import { PockyMascot } from './PockyMascot';
import { NextUpCard } from './NextUpCard';
import { TaskItem } from './TaskItem';
import { Plus, CheckCircle, Flame, Heart, Sparkles, Filter } from 'lucide-react';

interface TodayScreenProps {
  tasks: Task[];
  companion: CompanionStats;
  onToggleComplete: (taskId: string, e: React.MouseEvent) => void;
  onOpenTaskDetails: (task: Task) => void;
  onStartNextUpTask: (task: Task) => void;
  onOpenQuickAdd: () => void;
  onNavigateToCompanion: () => void;
  onPetMascot: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  tasks,
  companion,
  onToggleComplete,
  onOpenTaskDetails,
  onStartNextUpTask,
  onOpenQuickAdd,
  onNavigateToCompanion,
  onPetMascot,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Find next up task (or highest priority pending task)
  const nextUpTask = tasks.find((t) => t.isNextUp && !t.completed) || tasks.find((t) => !t.completed) || null;

  // Filter today tasks
  const todayTasks = tasks.filter((t) => {
    // Show tasks in today list (excluding next-up task from the main list if displayed prominently, or keep all)
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="flex flex-col gap-6 pb-24 px-5 pt-2">
      {/* 1. Greeting & Date Header */}
      <div>
        <h2 className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
          Good morning, Alex
        </h2>
        <p className="text-sm font-medium text-slate-500 mt-0.5">
          Tuesday, October 24
        </p>
      </div>

      {/* 2. Companion Summary Card */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onNavigateToCompanion}
        className="relative overflow-hidden bg-gradient-to-br from-purple-50/90 via-indigo-50/50 to-white border border-purple-100/80 rounded-3xl p-4.5 shadow-sm cursor-pointer transition-all hover:shadow-md"
      >
        {/* Top Stats Badges Row */}
        <div className="flex items-center gap-2.5 mb-3.5">
          {/* Health Badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full shadow-2xs border border-rose-100">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span className="text-xs font-bold text-slate-800">
              {companion.health}% Health
            </span>
          </div>

          {/* Streak Badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full shadow-2xs border border-amber-100">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-slate-800">
              {companion.streak} Day Streak
            </span>
          </div>
        </div>

        {/* Mascot & Speech Bubble Row */}
        <div className="flex items-center gap-3.5">
          {/* Mascot Mini View */}
          <div
            className="w-16 h-16 rounded-2xl bg-white/80 border border-purple-100 shadow-2xs flex items-center justify-center p-1 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onPetMascot();
            }}
          >
            <PockyMascot mood={companion.mood} size="sm" showBadge={false} />
          </div>

          {/* Speech Bubble */}
          <div className="relative flex-1 bg-white/95 border border-purple-100/90 rounded-2xl p-3 shadow-2xs text-xs font-medium text-slate-700 leading-relaxed">
            <p>{companion.message}</p>
            {/* Bubble Tail */}
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-l border-b border-purple-100/90 rotate-45" />
          </div>
        </div>
      </motion.div>

      {/* 3. Next Up Section */}
      {nextUpTask && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-heading text-slate-900 tracking-tight">
              Next Up
            </h3>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              Priority Focus
            </span>
          </div>

          <NextUpCard
            task={nextUpTask}
            onStartTask={onStartNextUpTask}
            onOpenDetails={onOpenTaskDetails}
          />
        </section>
      )}

      {/* 4. Today Task List Section */}
      <section className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold font-heading text-slate-900 tracking-tight">
              Today
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {pendingCount} remaining
            </span>
          </div>

          {/* Filter Pills / View All */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filter === 'all' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filter === 'pending' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filter === 'completed' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Done ({completedCount})
            </button>
          </div>
        </div>

        {/* Task List Items */}
        <div className="flex flex-col gap-2.5">
          <AnimatePresence mode="popLayout">
            {todayTasks.length > 0 ? (
              todayTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onClick={onOpenTaskDetails}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-slate-100 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3"
              >
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
                <div className="max-w-xs">
                  <h4 className="font-bold text-slate-800 text-base">No tasks to display</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {filter === 'completed'
                      ? 'No tasks completed yet. Finish a task to charge Pocky!'
                      : 'You have cleared all your tasks for today! Great job!'}
                  </p>
                </div>
                <button
                  onClick={onOpenQuickAdd}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 active:scale-95 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add New Task
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};
