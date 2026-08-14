import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CompanionStats, MascotMood } from '../types';
import { PockyMascot } from './PockyMascot';
import { Heart, Flame, Brain, Trophy } from 'lucide-react';

const PET_REACTIONS = [
  { msg: "Purrrr~ don't stop! 🐾", emoji: "😻" },
  { msg: "Okay okay I like this 😤", emoji: "🥰" },
  { msg: "MORE. I demand more pets.", emoji: "👑" },
  { msg: "You're my favourite human 🫶", emoji: "💜" },
  { msg: "*pretends not to enjoy it*", emoji: "😼" },
  { msg: "That tickles!! hehe 🤭", emoji: "😹" },
  { msg: "I will allow this... for now.", emoji: "🧐" },
  { msg: "Pet count: INFINITE needed", emoji: "♾️" },
  { msg: "Power level increasing 📈", emoji: "⚡" },
  { msg: "bro i'm literally glowing rn", emoji: "✨" },
];

interface CompanionScreenProps {
  companion: CompanionStats;
  onPetMascot: () => void;
  onChangeMood: (mood: MascotMood) => void;
}

export const CompanionScreen: React.FC<CompanionScreenProps> = ({
  companion,
  onPetMascot,
  onChangeMood,
}) => {
  const [activeTab, setActiveTab] = useState<'mood' | 'progress'>('mood');
  const [petCount, setPetCount] = useState(0);
  const [reaction, setReaction] = useState<{ msg: string; emoji: string } | null>(null);
  const [isBooping, setIsBooping] = useState(false);
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePet = () => {
    onPetMascot();
    const next = petCount + 1;
    setPetCount(next);
    setIsBooping(true);
    setTimeout(() => setIsBooping(false), 400);
    const r = PET_REACTIONS[(next - 1) % PET_REACTIONS.length];
    setReaction(r);
    if (reactionTimer.current) clearTimeout(reactionTimer.current);
    reactionTimer.current = setTimeout(() => setReaction(null), 2200);
  };

  // Mood descriptions map
  const moodTitles: Record<MascotMood, { title: string; subtitle: string }> = {
    happy: {
      title: 'Pocky is thriving!',
      subtitle: `Pocky is feeling great today because of your ${companion.streak}-day streak! Keep it up!`,
    },
    thinking: {
      title: 'Pocky is strategizing...',
      subtitle: 'Analyzing your workflow to optimize your focus blocks and reduce cognitive strain.',
    },
    concerned: {
      title: 'Pocky needs your focus!',
      subtitle: 'You have urgent or overdue deadlines approaching. Complete a task to recharge Pocky!',
    },
    tired: {
      title: 'Pocky is low on battery',
      subtitle: 'Pocky needs a productivity boost! Clear a quick task or take a mindful break.',
    },
    celebrating: {
      title: 'Pocky is celebrating!',
      subtitle: 'Huge milestone reached! All high-priority goals are crushed for today!',
    },
  };

  const moodList: { id: MascotMood; label: string; icon: string }[] = [
    { id: 'happy', label: 'Happy', icon: '✨' },
    { id: 'thinking', label: 'Thinking', icon: '⚙️' },
    { id: 'concerned', label: 'Concerned', icon: '⏰' },
    { id: 'tired', label: 'Tired', icon: '🪫' },
    { id: 'celebrating', label: 'Done!', icon: '🎉' },
  ];

  const currentMoodInfo = moodTitles[companion.mood] || moodTitles.happy;

  return (
    <div className="flex flex-col gap-6 pb-28 px-5 pt-2">
      {/* 1. Large Mascot Showcase Card */}
      <div className="relative bg-white border border-purple-100/90 rounded-[32px] p-6 shadow-sm flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Soft background ambient gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/60 via-transparent to-transparent pointer-events-none" />

        {/* Mascot Sticker Stage */}
        <div className="relative my-2" onClick={handlePet}>
          <motion.div
            animate={isBooping ? { scale: [1, 1.18, 0.92, 1.05, 1], rotate: [0, -8, 8, -4, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <PockyMascot mood={companion.mood} size="showcase" interactive onPet={handlePet} showBadge />
          </motion.div>

          {/* Floating reaction bubble */}
          <AnimatePresence>
            {reaction && (
              <motion.div
                key={reaction.msg}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -8, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#7047EB] text-white text-xs font-bold px-3 py-1.5 rounded-2xl shadow-lg whitespace-nowrap z-10"
              >
                {reaction.emoji} {reaction.msg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mascot Mood Selector Pills (to explore all companion states) */}
        <div className="flex items-center gap-1.5 mt-3 p-1 bg-slate-100/80 rounded-2xl">
          {moodList.map((m) => (
            <button
              key={m.id}
              onClick={() => onChangeMood(m.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                companion.mood === m.id
                  ? 'bg-white text-purple-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{m.icon}</span> <span className="hidden sm:inline">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Companion Headline & Subtitle */}
      <div className="text-center px-2">
        <h2 className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
          {currentMoodInfo.title}
        </h2>
        <p className="text-sm font-medium text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
          {currentMoodInfo.subtitle}
        </p>
      </div>

      {/* 3. Stat Cards: Health & Streak */}
      <div className="grid grid-cols-2 gap-4">
        {/* Health Card */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span className="text-2xl font-extrabold font-heading text-slate-900">
              {companion.health}%
            </span>
          </div>

          <div className="mt-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              HEALTH
            </span>
            {/* Red Progress Bar */}
            <div className="w-full h-2 bg-rose-100 rounded-full mt-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${companion.health}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-rose-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="text-2xl font-extrabold font-heading text-slate-900">
              {companion.streak}
            </span>
          </div>

          <div className="mt-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              DAY STREAK
            </span>
            {/* Amber Progress Bar */}
            <div className="w-full h-2 bg-amber-100 rounded-full mt-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (companion.streak / 20) * 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-amber-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tab Container: MOOD vs PROGRESS */}
      <div className="bg-[#EEF2FF]/70 border border-indigo-100/80 rounded-3xl p-4 flex flex-col gap-4">
        {/* Segmented Switch */}
        <div className="grid grid-cols-2 bg-white/90 p-1 rounded-2xl shadow-2xs border border-indigo-100">
          <button
            onClick={() => setActiveTab('mood')}
            className={`py-2 text-xs font-extrabold uppercase tracking-wider rounded-xl transition ${
              activeTab === 'mood'
                ? 'bg-[#7047EB] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            MOOD
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`py-2 text-xs font-extrabold uppercase tracking-wider rounded-xl transition ${
              activeTab === 'progress'
                ? 'bg-[#7047EB] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            PROGRESS
          </button>
        </div>

        {/* Tab 1: MOOD Content */}
        {activeTab === 'mood' ? (
          <div className="flex flex-col gap-3">
            {/* Mental Clarity Insight Card */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-indigo-100/60 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Mental Clarity</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  You've completed 8 high-priority tasks this week, reducing overall cognitive load.
                </p>
              </div>
            </div>

            {/* Companion Level Progress */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-indigo-100/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Companion Level {companion.level}</h5>
                  <p className="text-[11px] text-slate-400">{companion.xp} / {companion.nextLevelXp} XP</p>
                </div>
              </div>

              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full"
                  style={{ width: `${(companion.xp / companion.nextLevelXp) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Tab 2: PROGRESS Content */
          <div className="flex flex-col gap-3">
            {/* Weekly Activity Bar Chart */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-indigo-100/60">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  Weekly Completion
                </h4>
                <span className="text-xs font-extrabold text-emerald-600">88% Rate</span>
              </div>

              {/* Weekly Mini Bars */}
              <div className="flex items-end justify-between gap-2 h-20 pt-2">
                {[
                  { day: 'M', count: 4, max: 6 },
                  { day: 'T', count: 5, max: 6 },
                  { day: 'W', count: 6, max: 6 },
                  { day: 'T', count: 3, max: 6 },
                  { day: 'F', count: 5, max: 6 },
                  { day: 'S', count: 2, max: 6 },
                  { day: 'S', count: 4, max: 6 },
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full bg-purple-100 rounded-t-md relative h-full flex items-end">
                      <div
                        className="w-full bg-[#7047EB] rounded-t-md"
                        style={{ height: `${(item.count / item.max) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Stats Row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-2xl p-3 border border-indigo-100/60 text-center">
                <span className="text-lg font-extrabold text-slate-900">{companion.totalCompleted}</span>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Tasks Done</p>
              </div>
              <div className="bg-white rounded-2xl p-3 border border-indigo-100/60 text-center">
                <span className="text-lg font-extrabold text-rose-600">{companion.missedTasks}</span>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Missed</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Bottom Pet Pocky Action Button */}
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={handlePet}
        className="w-full bg-[#7047EB] hover:bg-[#5E35D9] text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-purple-500/25 transition flex items-center justify-center gap-2 text-base cursor-pointer relative overflow-hidden"
      >
        <span className="text-lg">🐾</span>
        <span>Pet Pocky</span>
        {petCount > 0 && (
          <span className="absolute right-4 bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            ×{petCount}
          </span>
        )}
      </motion.button>
    </div>
  );
};
