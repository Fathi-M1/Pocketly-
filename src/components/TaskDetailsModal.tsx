import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Task } from '../types';
import { PockyMascot } from './PockyMascot';
import { TopHeader } from './TopHeader';
import { Calendar, AlertCircle, Edit2, Trash2, Smartphone, CheckSquare, Square, Plus, Check } from 'lucide-react';

interface TaskDetailsModalProps {
  task: Task | null;
  onClose: () => void;
  onLaunchShake: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (task: Task) => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  onClose,
  onLaunchShake,
  onToggleComplete,
  onDeleteTask,
  onUpdateTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  if (!task) return null;

  const handleSaveEdit = () => {
    onUpdateTask({
      ...task,
      title,
      description,
    });
    setIsEditing(false);
  };

  const handleToggleSubtask = (subId: string) => {
    const updatedSubtasks = (task.subtasks || []).map((s) =>
      s.id === subId ? { ...s, completed: !s.completed } : s
    );
    onUpdateTask({ ...task, subtasks: updatedSubtasks });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSub = {
      id: `sub-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    onUpdateTask({ ...task, subtasks: [...(task.subtasks || []), newSub] });
    setNewSubtaskTitle('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col min-h-screen bg-[#F8F9FE] pb-24"
    >
      {/* Top Bar with Back Arrow */}
      <TopHeader title="Task Details" showBack onBack={onClose} />

      <div className="flex flex-col gap-6 px-6 pt-4 flex-1">
        {/* Title & Mascot Header Section */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-bold font-heading text-slate-900 bg-white border border-purple-200 rounded-xl px-3 py-2 outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 leading-tight">
                {task.title}
              </h2>
            )}

            {isEditing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Description..."
                className="w-full text-sm text-slate-600 bg-white border border-purple-200 rounded-xl px-3 py-2 mt-2 outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              task.description && (
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  {task.description}
                </p>
              )
            )}
          </div>

          {/* Mini Companion Avatar Reaction */}
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 p-1 shadow-2xs">
            <PockyMascot mood={task.completed ? 'celebrating' : 'happy'} size="xs" showBadge={false} />
          </div>
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Due date badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 text-slate-700 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Tomorrow, 5:00 PM</span>
          </div>

          {/* Priority badge */}
          <div
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
              task.priority === 'high'
                ? 'bg-rose-100 text-rose-700'
                : task.priority === 'medium'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            <AlertCircle className="w-3 h-3" />
            <span className="capitalize">{task.priority}</span>
          </div>

          {task.completed && (
            <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
              <Check className="w-3 h-3 text-purple-700" />
              <span>Completed</span>
            </div>
          )}
        </div>

        {/* TIME REMAINING Card */}
        <div className="bg-[#EEF2FF]/80 border border-indigo-100/90 rounded-3xl p-6 text-center shadow-xs">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#7047EB]">
            TIME REMAINING
          </span>
          <div className="text-4xl font-extrabold font-heading text-[#542BE0] tracking-tight mt-1.5">
            23 <span className="text-2xl font-bold text-[#7047EB]/70">h</span> 45 <span className="text-2xl font-bold text-[#7047EB]/70">m</span>
          </div>
        </div>

        {/* Checklist / Subtasks section */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Subtasks & Milestones
            </h4>
            <span className="text-xs font-bold text-purple-600">
              {(task.subtasks || []).filter((s) => s.completed).length}/{(task.subtasks || []).length || 0}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {(task.subtasks || []).map((sub) => (
              <div
                key={sub.id}
                onClick={() => handleToggleSubtask(sub.id)}
                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition"
              >
                {sub.completed ? (
                  <CheckSquare className="w-4 h-4 text-purple-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-300 shrink-0" />
                )}
                <span
                  className={`text-xs font-medium ${
                    sub.completed ? 'line-through text-slate-400' : 'text-slate-700'
                  }`}
                >
                  {sub.title}
                </span>
              </div>
            ))}
          </div>

          {/* Add Subtask Form */}
          <form onSubmit={handleAddSubtask} className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Add a step..."
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={!newSubtaskTitle.trim()}
              className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center disabled:opacity-40 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Action Buttons Section */}
        <div className="flex flex-col gap-3 mt-auto pt-4">
          {/* Shake to Complete Main Pill Button */}
          <button
            onClick={() => onLaunchShake(task)}
            className="w-full bg-[#7047EB] hover:bg-[#5E35D9] text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-purple-500/25 active:scale-[0.98] transition flex items-center justify-center gap-2.5 text-base cursor-pointer"
          >
            <Smartphone className="w-5 h-5 animate-shake-wiggle" />
            <span>Shake to Complete</span>
          </button>

          {/* Secondary Actions Row */}
          <div className="grid grid-cols-2 gap-3">
            {isEditing ? (
              <button
                onClick={handleSaveEdit}
                className="w-full bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-[#EEF2FF] hover:bg-indigo-100/80 text-slate-800 font-bold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Edit2 className="w-4 h-4 text-slate-600" />
                <span>Edit</span>
              </button>
            )}

            <button
              onClick={() => {
                onDeleteTask(task.id);
                onClose();
              }}
              className="w-full bg-[#EEF2FF] hover:bg-rose-50 text-rose-600 font-bold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
