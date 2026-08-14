import React from 'react';
import { motion } from 'motion/react';
import { Task } from '../types';
import { Check, Users, Clock, AlertCircle } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string, e: React.MouseEvent) => void;
  onClick: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onClick,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      onClick={() => onClick(task)}
      className={`group relative flex items-center justify-between p-4 rounded-2xl bg-white transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md border ${
        task.overdue && !task.completed
          ? 'border-rose-200/90 bg-rose-50/20'
          : task.completed
          ? 'border-slate-100 opacity-60 bg-slate-50/50'
          : 'border-slate-100/90 hover:border-purple-200'
      }`}
    >
      {/* Left section: Circular Checkbox + Task Title & Meta tags */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-3">
        {/* Custom Circular Checkbox */}
        <button
          type="button"
          onClick={(e) => onToggleComplete(task.id, e)}
          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            task.completed
              ? 'bg-[#7047EB] border-[#7047EB] text-white shadow-xs'
              : task.overdue
              ? 'border-rose-300 hover:border-rose-500 bg-white'
              : 'border-slate-300 hover:border-purple-500 bg-white'
          }`}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </motion.div>
          )}
        </button>

        {/* Title and Badges */}
        <div className="min-w-0 flex-1">
          <p
            className={`font-semibold text-[15px] leading-snug tracking-tight truncate ${
              task.completed ? 'line-through text-slate-400' : 'text-slate-800'
            }`}
          >
            {task.title}
          </p>

          {/* Sub-line metadata & badges */}
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {/* Overdue Tag */}
            {task.overdue && !task.completed && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700">
                <AlertCircle className="w-2.5 h-2.5" />
                OVERDUE
              </span>
            )}

            {/* Soon Tag */}
            {task.isSoon && !task.completed && !task.overdue && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-700">
                <Clock className="w-2.5 h-2.5" />
                SOON
              </span>
            )}

            {/* Time label */}
            {task.time && (
              <span
                className={`text-xs ${
                  task.overdue && !task.completed ? 'text-rose-600 font-medium' : 'text-slate-500'
                }`}
              >
                {task.overdue && !task.completed ? 'Yesterday, ' : ''}
                {task.time}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right section: Attendees or category indicator */}
      {task.attendees && task.attendees.length > 0 && (
        <div className="flex items-center -space-x-1.5 shrink-0 pl-2">
          {task.attendees.map((attendee, idx) => (
            <div
              key={idx}
              className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-2xs"
            >
              {attendee === 'SJ' || attendee === 'MR' || attendee === 'AL' ? (
                <Users className="w-3 h-3 text-purple-600" />
              ) : (
                attendee
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
