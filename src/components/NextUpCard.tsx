import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Task } from '../types';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface NextUpCardProps {
  task: Task | null;
  onStartTask: (task: Task) => void;
  onOpenDetails: (task: Task) => void;
}

export const NextUpCard: React.FC<NextUpCardProps> = ({
  task,
  onStartTask,
  onOpenDetails,
}) => {
  // Real-time ticking countdown
  const [secondsRemaining, setSecondsRemaining] = useState(2 * 3600 + 45 * 60 + 7);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!task) {
    return (
      <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-200/60 rounded-3xl p-5 text-center flex flex-col items-center justify-center gap-2 text-slate-600">
        <CheckCircle2 className="w-8 h-8 text-purple-600 animate-bounce" />
        <p className="font-semibold text-slate-800">All caught up!</p>
        <p className="text-xs text-slate-500">No urgent tasks next up. Relax or quick add a new goal.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#724CF9] via-[#6339EB] to-[#5024DB] text-white p-6 shadow-xl shadow-purple-500/20"
    >
      {/* Decorative ambient background rings */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-36 h-36 bg-purple-300/20 rounded-full blur-xl pointer-events-none" />

      {/* Top row: Priority Badge + Category Icon */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-extrabold tracking-wider text-purple-200 uppercase">
            {task.priority === 'high' ? 'HIGH PRIORITY' : `${task.priority.toUpperCase()} PRIORITY`}
          </span>
        </div>

        {/* Category Icon Badge */}
        <div
          onClick={() => onOpenDetails(task)}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center cursor-pointer transition active:scale-95"
          title="View Details"
        >
          <Sparkles className="w-4 h-4 text-purple-100" />
        </div>
      </div>

      {/* Main Task Title */}
      <h3
        onClick={() => onOpenDetails(task)}
        className="text-[22px] leading-tight font-bold font-heading text-white mb-4 cursor-pointer hover:text-purple-100 transition line-clamp-2"
      >
        {task.title}
      </h3>

      {/* Countdown Timer */}
      <div className="flex items-center gap-2 text-purple-100 text-sm font-medium mb-5">
        <svg
          className="w-4 h-4 text-purple-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="font-mono-numbers tracking-wide">
          {formatCountdown(secondsRemaining)} remaining
        </span>
      </div>

      {/* "Start Task" White Pill Button */}
      <button
        onClick={() => onStartTask(task)}
        className="w-full bg-white text-[#6138E8] hover:bg-purple-50 font-bold py-3.5 px-6 rounded-2xl shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2 group cursor-pointer text-base"
      >
        <span>Start Task</span>
        <ArrowRight className="w-4 h-4 text-[#6138E8] group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};
