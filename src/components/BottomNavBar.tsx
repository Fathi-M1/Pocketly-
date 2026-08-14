import React from 'react';
import { NavigationTab } from '../types';
import { CheckSquare, Calendar, Plus, Sparkles } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenQuickAdd: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenQuickAdd,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-100/80 px-6 py-2 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        {/* Tab 1: TODAY */}
        <button
          onClick={() => onSelectTab('today')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors active:scale-95 cursor-pointer ${
            activeTab === 'today' ? 'text-[#7047EB]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <CheckSquare className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-extrabold tracking-wider uppercase">
            TODAY
          </span>
        </button>

        {/* Tab 2: CALENDAR */}
        <button
          onClick={() => onSelectTab('calendar')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors active:scale-95 cursor-pointer ${
            activeTab === 'calendar' ? 'text-[#7047EB]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Calendar className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-extrabold tracking-wider uppercase">
            CALENDAR
          </span>
        </button>

        {/* Center Floating Plus Button */}
        <div className="relative -top-3">
          <button
            onClick={onOpenQuickAdd}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#6339EB] to-[#7A54F8] text-white flex items-center justify-center shadow-lg shadow-purple-600/35 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-[#F8F9FE]"
            aria-label="Quick Add Task"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Spacer for symmetry if needed, or direct 4 items */}
        {/* Tab 3: COMPANION / AI */}
        <button
          onClick={() => onSelectTab('companion')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors active:scale-95 cursor-pointer ${
            activeTab === 'companion' ? 'text-[#7047EB]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Sparkles className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-extrabold tracking-wider uppercase">
            AI
          </span>
        </button>
      </div>
    </div>
  );
};
