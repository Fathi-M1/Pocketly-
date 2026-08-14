import React, { useState } from 'react';
import { Smartphone, Monitor, RefreshCw, Heart, Flame } from 'lucide-react';
import { CompanionStats } from '../types';

interface DeviceFrameProps {
  children: React.ReactNode;
  companion: CompanionStats;
  onSimulateShake: () => void;
  onResetData: () => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  companion,
  onSimulateShake,
  onResetData,
}) => {
  const [viewMode, setViewMode] = useState<'mobile' | 'responsive'>('mobile');

  return (
    <div className="min-h-screen bg-[#F0F2F9] flex flex-col items-center justify-start antialiased">
      {/* Desktop Top Control Bar (Only visible on medium and larger screens) */}
      <aside aria-label="Simulator Controls" className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-2.5 hidden md:flex items-center justify-between z-50 sticky top-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#7047EB] text-white flex items-center justify-center text-xs font-bold">
              P
            </div>
            <span className="font-extrabold font-heading text-sm text-slate-800 tracking-tight">
              Pocketly Simulator
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Quick status preview */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              <Heart className="w-3 h-3 fill-rose-500" /> {companion.health}%
            </span>
            <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              <Flame className="w-3 h-3 fill-amber-500" /> {companion.streak}d
            </span>
          </div>
        </div>

        {/* RevenueCat Sponsor Badge */}
        <a
          href="https://www.revenuecat.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F5563A]/10 hover:bg-[#F5563A]/20 border border-[#F5563A]/20 text-[#F5563A] text-xs font-bold transition cursor-pointer"
          title="Powered by RevenueCat"
        >
          <span className="text-base leading-none">🐱</span>
          <span>Powered by RevenueCat</span>
        </a>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Shake Trigger Test Button */}
          <button
            onClick={onSimulateShake}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-[#6138E8] text-xs font-bold transition active:scale-95 cursor-pointer shadow-2xs"
            title="Simulate Shake to Complete"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Simulate Shake</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer"
            title="Reset Tasks and Companion Stats"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>

          <div className="h-4 w-px bg-slate-200" />

          {/* Viewport switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => setViewMode('mobile')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                viewMode === 'mobile'
                  ? 'bg-white text-purple-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile View</span>
            </button>
            <button
              onClick={() => setViewMode('responsive')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                viewMode === 'responsive'
                  ? 'bg-white text-purple-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Fluid View</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div
        className={`w-full flex-1 flex justify-center transition-all ${
          viewMode === 'mobile' ? 'py-0 md:py-8' : 'p-0 md:p-6'
        }`}
      >
        <div
          className={`w-full bg-[#F8F9FE] flex flex-col relative transition-all duration-300 ${
            viewMode === 'mobile'
              ? 'max-w-[425px] min-h-screen md:min-h-[844px] md:max-h-[890px] md:rounded-[44px] md:shadow-2xl md:shadow-purple-950/15 md:border-[10px] md:border-slate-900 overflow-y-auto no-scrollbar relative'
              : 'max-w-4xl min-h-screen md:min-h-[800px] md:rounded-3xl md:shadow-xl md:border border-slate-200 overflow-y-auto'
          }`}
        >
          {/* iOS-style Dynamic Island / Speaker notch on Mobile Chassis (only on desktop preview) */}
          {viewMode === 'mobile' && (
            <div className="hidden md:flex items-center justify-center pt-3 pb-1 shrink-0 z-40 bg-[#F8F9FE]">
              <div className="w-28 h-4.5 bg-slate-900 rounded-full flex items-center justify-end px-2 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800/90 border border-slate-700" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#7047EB]/60" />
              </div>
            </div>
          )}

          {/* Render Actual App Views */}
          <div className="flex-1 flex flex-col min-h-0 relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
