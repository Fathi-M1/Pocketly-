import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Priority, TaskCategory, Task } from '../types';
import { Calendar, Clock, Flag, Plus, X, Check, Tag } from 'lucide-react';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (newTask: Omit<Task, 'id' | 'completed'>) => void;
  initialDate?: string;
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  initialDate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateOption, setDateOption] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const [customDate, setCustomDate] = useState(initialDate || '2026-08-14');
  const [timeOption, setTimeOption] = useState<string>('No Time');
  const [customTime, setCustomTime] = useState('17:00');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<TaskCategory>('design');
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showTimeMenu, setShowTimeMenu] = useState(false);
  const [showDateMenu, setShowDateMenu] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    } else {
      setTitle('');
      setDescription('');
      setDateOption('today');
      setTimeOption('No Time');
      setPriority('medium');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let targetDate = '2026-08-14';
    if (dateOption === 'tomorrow') targetDate = '2026-08-15';
    else if (dateOption === 'custom') targetDate = customDate;

    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      date: targetDate,
      time: timeOption !== 'No Time' ? timeOption : undefined,
      priority,
      category,
      isNextUp: false,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        />

        {/* Bottom Sheet Drawer */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative w-full max-w-lg bg-white rounded-t-[32px] p-6 shadow-2xl z-50 flex flex-col gap-5 border-t border-purple-100"
        >
          {/* Top Sheet Drag Handle */}
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto -mt-1 cursor-grab" onClick={onClose} />

          {/* Quick Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600">
              Quick Capture
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Large Clean Text Input */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full text-xl font-bold font-heading text-slate-800 placeholder-slate-400 bg-transparent border-none outline-hidden px-1 py-2 focus:ring-0"
              />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add optional notes, links or context..."
                className="w-full text-sm text-slate-600 placeholder-slate-400 bg-transparent border-none outline-hidden px-1 py-1 focus:ring-0"
              />
            </div>

            {/* Selector Pills Row */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              {/* 1. Date Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowDateMenu(!showDateMenu);
                    setShowTimeMenu(false);
                    setShowPriorityMenu(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    dateOption !== 'today'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  <span>
                    {dateOption === 'today' ? 'Today' : dateOption === 'tomorrow' ? 'Tomorrow' : customDate}
                  </span>
                </button>

                {showDateMenu && (
                  <div className="absolute left-0 bottom-full mb-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 flex flex-col gap-1 min-w-[140px]">
                    <button
                      type="button"
                      onClick={() => {
                        setDateOption('today');
                        setShowDateMenu(false);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-left hover:bg-purple-50 text-slate-700"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDateOption('tomorrow');
                        setShowDateMenu(false);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-left hover:bg-purple-50 text-slate-700"
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDateOption('custom');
                        setShowDateMenu(false);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-left hover:bg-purple-50 text-slate-700"
                    >
                      Pick Date...
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Time Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowTimeMenu(!showTimeMenu);
                    setShowDateMenu(false);
                    setShowPriorityMenu(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    timeOption !== 'No Time'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  <span>{timeOption}</span>
                </button>

                {showTimeMenu && (
                  <div className="absolute left-0 bottom-full mb-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 flex flex-col gap-1 min-w-[150px]">
                    {['No Time', '9:00 AM', '2:00 PM', '5:00 PM', '8:00 PM'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setTimeOption(t);
                          setShowTimeMenu(false);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-left hover:bg-purple-50 text-slate-700"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Priority Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowPriorityMenu(!showPriorityMenu);
                    setShowDateMenu(false);
                    setShowTimeMenu(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    priority === 'high'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : priority === 'medium'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  <Flag
                    className={`w-3.5 h-3.5 ${
                      priority === 'high' ? 'text-rose-600' : priority === 'medium' ? 'text-amber-600' : 'text-slate-500'
                    }`}
                  />
                  <span className="capitalize">{priority} Priority</span>
                  <span className="text-[10px] text-slate-400">⌄</span>
                </button>

                {showPriorityMenu && (
                  <div className="absolute left-0 bottom-full mb-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 flex flex-col gap-1 min-w-[140px]">
                    <button
                      type="button"
                      onClick={() => {
                        setPriority('high');
                        setShowPriorityMenu(false);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-left hover:bg-rose-50 text-rose-700 flex items-center justify-between"
                    >
                      <span>High Priority</span>
                      {priority === 'high' && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPriority('medium');
                        setShowPriorityMenu(false);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-left hover:bg-amber-50 text-amber-700 flex items-center justify-between"
                    >
                      <span>Medium Priority</span>
                      {priority === 'medium' && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPriority('low');
                        setShowPriorityMenu(false);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-left hover:bg-slate-100 text-slate-700 flex items-center justify-between"
                    >
                      <span>Low Priority</span>
                      {priority === 'low' && <Check className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
                {(['design', 'dev', 'marketing', 'personal'] as TaskCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition ${
                      category === cat
                        ? 'bg-[#7047EB] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Big Purple "Add Task" Button */}
            <button
              type="submit"
              disabled={!title.trim()}
              className={`w-full py-4 rounded-2xl font-bold font-heading text-base shadow-lg transition flex items-center justify-center gap-2 active:scale-[0.98] ${
                title.trim()
                  ? 'bg-[#7047EB] text-white hover:bg-[#6035E0] shadow-purple-500/25 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              <span>Add Task</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
