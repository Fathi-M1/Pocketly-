import React from 'react';
import { PocketlyLogo } from './PocketlyLogo';

interface TopHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title = 'Today',
  showBack = false,
  onBack,
  rightAction,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F8F9FE]/90 backdrop-blur-md px-5 py-3.5 flex items-center justify-between transition-all">
      {/* Left: Back button or Pocketly Logo + Title */}
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            onClick={onBack}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-200/60 active:scale-90 transition"
            aria-label="Go back"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-white shadow-xs border border-purple-100 flex items-center justify-center p-1">
            <PocketlyLogo size="sm" iconOnly />
          </div>
        )}
        <h1 className="text-xl font-bold font-heading text-[#0F172A] tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right: Custom Action or Profile Avatar */}
      <div>
        {rightAction ? (
          rightAction
        ) : (
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-purple-100 shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Alex"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Online / Active streak indicator dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
        )}
      </div>
    </header>
  );
};
