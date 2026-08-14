import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Task } from '../types';
import { ChevronLeft, ChevronRight, ChevronDown, SlidersHorizontal, AlertCircle, Users, FileText, Plus, Check } from 'lucide-react';

interface CalendarScreenProps {
  tasks: Task[];
  onOpenTaskDetails: (task: Task) => void;
  onOpenQuickAdd: (preselectedDate?: string) => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  tasks,
  onOpenTaskDetails,
  onOpenQuickAdd,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(10);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(9); // October (0-indexed = 9)
  const [currentYear, setCurrentYear] = useState<number>(2023);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar dates matrix for October 2023 matching screenshot
  // Starts with Sunday Sep 24..30, then Oct 1..21
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const calendarDays = [
    // Previous month filler
    { day: 24, isCurrentMonth: false, month: 8 },
    { day: 25, isCurrentMonth: false, month: 8 },
    { day: 26, isCurrentMonth: false, month: 8 },
    { day: 27, isCurrentMonth: false, month: 8 },
    { day: 28, isCurrentMonth: false, month: 8 },
    { day: 29, isCurrentMonth: false, month: 8 },
    { day: 30, isCurrentMonth: false, month: 8 },
    // Current month (October)
    { day: 1, isCurrentMonth: true, month: 9, dots: ['purple'] },
    { day: 2, isCurrentMonth: true, month: 9 },
    { day: 3, isCurrentMonth: true, month: 9, dots: ['purple', 'amber'] },
    { day: 4, isCurrentMonth: true, month: 9 },
    { day: 5, isCurrentMonth: true, month: 9, dots: ['purple'] },
    { day: 6, isCurrentMonth: true, month: 9 },
    { day: 7, isCurrentMonth: true, month: 9 },
    { day: 8, isCurrentMonth: true, month: 9 },
    { day: 9, isCurrentMonth: true, month: 9 },
    { day: 10, isCurrentMonth: true, month: 9, dots: ['white', 'white', 'white'], hasEvents: 3 },
    { day: 11, isCurrentMonth: true, month: 9, dots: ['purple'] },
    { day: 12, isCurrentMonth: true, month: 9 },
    { day: 13, isCurrentMonth: true, month: 9, dots: ['purple'] },
    { day: 14, isCurrentMonth: true, month: 9 },
    { day: 15, isCurrentMonth: true, month: 9 },
    { day: 16, isCurrentMonth: true, month: 9, dots: ['purple'] },
    { day: 17, isCurrentMonth: true, month: 9 },
    { day: 18, isCurrentMonth: true, month: 9 },
    { day: 19, isCurrentMonth: true, month: 9, dots: ['purple', 'purple'] },
    { day: 20, isCurrentMonth: true, month: 9 },
    { day: 21, isCurrentMonth: true, month: 9 },
  ];

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-24 px-5 pt-1">
      {/* Month Selector Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer group">
          <h2 className="text-2xl font-extrabold font-heading text-slate-900 tracking-tight">
            {monthNames[currentMonthIndex]} {currentYear}
          </h2>
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-purple-100 group-hover:text-purple-700 transition">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Prev / Next Chevrons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevMonth}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 transition"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 transition"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Matrix Card */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100/90">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center mb-2">
          {daysOfWeek.map((day) => (
            <span key={day} className="text-[11px] font-bold tracking-wider text-slate-400">
              {day}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-2 text-center">
          {calendarDays.map((item, idx) => {
            const isSelected = item.isCurrentMonth && item.day === selectedDay;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (item.isCurrentMonth) {
                    setSelectedDay(item.day);
                  }
                }}
                className={`group relative flex flex-col items-center justify-center py-1.5 cursor-pointer rounded-2xl transition-all ${
                  isSelected
                    ? 'bg-[#7047EB] text-white shadow-md shadow-purple-500/25'
                    : item.isCurrentMonth
                    ? 'text-slate-800 hover:bg-purple-50'
                    : 'text-slate-300'
                }`}
              >
                <span className={`text-sm font-semibold ${isSelected ? 'font-bold' : ''}`}>
                  {item.day}
                </span>

                {/* Task Indicators */}
                <div className="h-2 flex items-center justify-center gap-0.5 mt-0.5">
                  {isSelected ? (
                    <div className="flex items-center gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-white opacity-90" />
                      <span className="w-1 h-1 rounded-full bg-white opacity-90" />
                      <span className="w-1 h-1 rounded-full bg-white opacity-90" />
                    </div>
                  ) : item.dots ? (
                    item.dots.map((dotColor, dotIdx) => (
                      <span
                        key={dotIdx}
                        className={`w-1 h-1 rounded-full ${
                          dotColor === 'amber'
                            ? 'bg-amber-400'
                            : dotColor === 'red'
                            ? 'bg-rose-400'
                            : 'bg-purple-500'
                        }`}
                      />
                    ))
                  ) : (
                    <span className="w-1 h-1" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative divider pill */}
      <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto" />

      {/* Selected Day Schedule Section */}
      <div className="flex flex-col gap-4">
        {/* Selected Day Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-heading text-slate-900 tracking-tight">
              Tuesday, Oct {selectedDay}
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              3 events scheduled
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenQuickAdd(`2023-10-${selectedDay}`)}
              className="w-9 h-9 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center transition"
              title="Add event on this day"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              className="w-9 h-9 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center transition"
              title="Filter schedule"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timeline Events List */}
        <div className="relative pl-14 flex flex-col gap-4">
          {/* Vertical Timeline Axis Line */}
          <div className="absolute left-6 top-3 bottom-6 w-[2px] bg-slate-200/80" />

          {/* 1. OVERDUE Event: 09:00 */}
          <div className="relative">
            {/* Time Marker */}
            <div className="absolute -left-14 top-2 text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <span>09:00</span>
              <div className="w-2 h-2 rounded-full bg-amber-400 ring-4 ring-[#F8F9FE]" />
            </div>

            {/* Overdue Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() =>
                onOpenTaskDetails(
                  tasks.find((t) => t.id === 'task-5') || tasks[1]
                )
              }
              className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-rose-950 text-[15px] leading-tight">
                    Review Q3 Marketing Spend Analytics
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700">
                      OVERDUE
                    </span>
                    <span className="text-xs font-medium text-rose-600">
                      9:00 - 10:00 AM
                    </span>
                  </div>
                </div>
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              </div>
            </motion.div>
          </div>

          {/* NOW Horizontal Indicator */}
          <div className="relative my-0.5">
            <div className="absolute -left-14 top-1/2 -translate-y-1/2 text-[11px] font-bold text-purple-600 flex items-center gap-1">
              <span>Now</span>
              <div className="w-2.5 h-2.5 rounded-full bg-[#7047EB] ring-4 ring-purple-100" />
            </div>
            <div className="w-full h-[1.5px] bg-purple-300" />
          </div>

          {/* 2. Group Sync Event: 11:00 */}
          <div className="relative">
            {/* Time Marker */}
            <div className="absolute -left-14 top-2 text-[11px] font-bold text-purple-700 flex items-center gap-1.5">
              <span>11:00</span>
              <div className="w-2.5 h-2.5 rounded-full border-2 border-[#7047EB] bg-white ring-4 ring-[#F8F9FE]" />
            </div>

            {/* Design Sync Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() =>
                onOpenTaskDetails(
                  tasks.find((t) => t.id === 'task-6') || tasks[0]
                )
              }
              className="bg-[#EEF2FF] border-l-4 border-[#7047EB] border-y border-r border-indigo-100/60 rounded-2xl p-4 shadow-2xs hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-200/60 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-purple-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-[15px] leading-tight">
                    Design System Sync
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    Finalize elevation token...
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Attendee Avatars */}
                    <div className="flex items-center -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 text-[9px] font-bold border-2 border-white flex items-center justify-center">
                        EC
                      </div>
                      <div className="w-6 h-6 rounded-full bg-indigo-200 text-indigo-900 text-[9px] font-bold border-2 border-white flex items-center justify-center">
                        DV
                      </div>
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-[9px] font-bold border-2 border-white flex items-center justify-center">
                        +2
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-slate-600">
                      11:00 - 12:30 PM
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 3. Client Proposal Event: 14:00 */}
          <div className="relative">
            {/* Time Marker */}
            <div className="absolute -left-14 top-2 text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <span>14:00</span>
              <div className="w-2 h-2 rounded-full bg-slate-300 ring-4 ring-[#F8F9FE]" />
            </div>

            {/* Client Proposal Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() =>
                onOpenTaskDetails(
                  tasks.find((t) => t.id === 'task-7') || tasks[2]
                )
              }
              className="bg-[#F1F5F9]/80 border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition cursor-pointer"
            >
              <h4 className="font-bold text-slate-800 text-[15px] leading-tight">
                Client Proposal Draft
              </h4>
              <div className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-500">
                <FileText className="w-3.5 h-3.5" />
                <span>2:00 - 4:00 PM</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
