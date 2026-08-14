import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MascotMood } from '../types';

interface PockyMascotProps {
  mood?: MascotMood;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'showcase';
  interactive?: boolean;
  onPet?: () => void;
  showBadge?: boolean;
  className?: string;
  showSpeechBubble?: boolean;
  speechText?: string;
}

export const PockyMascot: React.FC<PockyMascotProps> = ({
  mood = 'happy',
  size = 'md',
  interactive = true,
  onPet,
  showBadge = true,
  className = '',
  showSpeechBubble = false,
  speechText,
}) => {
  const [isBouncing, setIsBouncing] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const sizeDimensions = {
    xs: { width: 44, height: 48 },
    sm: { width: 68, height: 72 },
    md: { width: 100, height: 108 },
    lg: { width: 140, height: 152 },
    xl: { width: 190, height: 206 },
    showcase: { width: 240, height: 260 },
  }[size];

  const handleMascotClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart = { id: Date.now() + Math.random(), x, y };
    setHearts((prev) => [...prev.slice(-4), newHeart]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);

    if (onPet) {
      onPet();
    }
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${interactive ? 'cursor-pointer' : ''} ${className}`}
      onClick={handleMascotClick}
      title={interactive ? 'Tap to pet Pocky!' : undefined}
    >
      {/* Dynamic Speech Bubble */}
      {showSpeechBubble && speechText && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute -top-12 z-20 bg-white px-3.5 py-1.5 rounded-2xl shadow-md border border-slate-100 text-xs font-semibold text-slate-800 whitespace-nowrap flex items-center gap-1.5"
        >
          <span>{speechText}</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45" />
        </motion.div>
      )}

      {/* Floating Hearts Particle Container */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">
        <AnimatePresence>
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 1, scale: 0.6, x: heart.x - 12, y: heart.y - 12 }}
              animate={{ opacity: 0, scale: 1.4, y: heart.y - 60, x: heart.x - 12 + (Math.random() * 30 - 15) }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute text-rose-500 font-bold text-lg"
            >
              ❤️
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Mascot Animated Body */}
      <motion.div
        animate={
          isBouncing
            ? { scale: [1, 1.15, 0.92, 1.05, 1], y: [0, -10, 2, -3, 0] }
            : mood === 'celebrating'
            ? { y: [0, -8, 0], rotate: [-2, 2, -2] }
            : mood === 'tired'
            ? { y: [0, 2, 0] }
            : { y: [0, -4, 0] }
        }
        transition={
          isBouncing
            ? { duration: 0.6 }
            : { repeat: Infinity, duration: mood === 'celebrating' ? 1.8 : 3.2, ease: 'easeInOut' }
        }
        style={{ width: sizeDimensions.width, height: sizeDimensions.height }}
        className="relative"
      >
        <svg
          viewBox="0 0 200 216"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            {/* Soft Mascot Outer Glow & Gradients */}
            <linearGradient id="bodyGrad" x1="100" y1="20" x2="100" y2="190" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F1F4F9" />
              <stop offset="100%" stopColor="#E2E7F0" />
            </linearGradient>

            <linearGradient id="visorGrad" x1="100" y1="45" x2="100" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2E1F5E" />
              <stop offset="100%" stopColor="#3C2A75" />
            </linearGradient>

            <linearGradient id="purpleAccent" x1="60" y1="120" x2="140" y2="170" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8161FF" />
              <stop offset="100%" stopColor="#6C47FF" />
            </linearGradient>

            <linearGradient id="bandGrad" x1="50" y1="125" x2="150" y2="145" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C9D2E3" />
              <stop offset="100%" stopColor="#BAC6D8" />
            </linearGradient>

            <filter id="stickerShadow" x="0" y="0" width="200" height="216" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#4B32A6" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Sticker White Border Silhouette */}
          <ellipse cx="100" cy="110" rx="66" ry="74" fill="#FFFFFF" />
          
          {/* Left Arm */}
          {mood === 'happy' || mood === 'celebrating' ? (
            // Raised Arm Left
            <g className="transition-transform duration-300">
              <rect x="24" y="55" width="24" height="54" rx="12" fill="#E2E7F0" transform="rotate(-35 24 55)" />
              <rect x="18" y="44" width="24" height="24" rx="12" fill="#8161FF" transform="rotate(-35 18 44)" />
            </g>
          ) : (
            // Normal Arm Left
            <g>
              <rect x="36" y="90" width="22" height="52" rx="11" fill="#E2E7F0" transform="rotate(15 36 90)" />
              <rect x="38" y="124" width="22" height="22" rx="11" fill="#8161FF" />
            </g>
          )}

          {/* Right Arm */}
          {mood === 'happy' || mood === 'celebrating' ? (
            // Raised Arm Right
            <g className="transition-transform duration-300">
              <rect x="156" y="68" width="24" height="54" rx="12" fill="#E2E7F0" transform="rotate(35 156 68)" />
              <rect x="168" y="46" width="24" height="24" rx="12" fill="#8161FF" transform="rotate(35 168 46)" />
            </g>
          ) : (
            // Normal Arm Right
            <g>
              <rect x="142" y="94" width="22" height="52" rx="11" fill="#E2E7F0" transform="rotate(-15 142 94)" />
              <rect x="140" y="124" width="22" height="22" rx="11" fill="#8161FF" />
            </g>
          )}

          {/* Feet / Lower Body */}
          <rect x="66" y="160" width="28" height="32" rx="14" fill="#E2E7F0" />
          <rect x="106" y="160" width="28" height="32" rx="14" fill="#E2E7F0" />
          <ellipse cx="80" cy="184" rx="14" ry="8" fill="#8161FF" />
          <ellipse cx="120" cy="184" rx="14" ry="8" fill="#8161FF" />

          {/* Main Oval Egg-Shaped Body */}
          <ellipse cx="100" cy="108" rx="60" ry="68" fill="url(#bodyGrad)" stroke="#FFFFFF" strokeWidth="3" />

          {/* Center Mid-tone Stripe Band */}
          <path
            d="M44 116 C58 126, 142 126, 156 116 L154 138 C140 148, 60 148, 46 138 Z"
            fill="url(#bandGrad)"
          />

          {/* Lower Purple Accent Band */}
          <path
            d="M50 144 C66 156, 134 156, 150 144 L146 160 C130 172, 70 172, 54 160 Z"
            fill="url(#purpleAccent)"
          />

          {/* Visor Faceplate Screen */}
          <rect
            x="52"
            y="52"
            width="96"
            height="56"
            rx="28"
            fill="url(#visorGrad)"
            stroke="#43307D"
            strokeWidth="1.5"
          />

          {/* Visor Subtle Light Reflection */}
          <ellipse cx="78" cy="62" rx="16" ry="4" fill="#FFFFFF" fillOpacity="0.15" transform="rotate(-12 78 62)" />

          {/* === MASCOT EYES & EMOTIONS === */}
          {mood === 'happy' && (
            <g>
              {/* Starry Diamond Left Eye */}
              <path
                d="M74 72 Q78 80 84 80 Q78 80 74 88 Q74 80 68 80 Q74 80 74 72 Z"
                fill="#C4B5FD"
                className="drop-shadow-sm"
              />
              <circle cx="76" cy="78" r="1.5" fill="#FFFFFF" />

              {/* Starry Diamond Right Eye */}
              <path
                d="M126 72 Q130 80 136 80 Q130 80 126 88 Q126 80 120 80 Q126 80 126 72 Z"
                fill="#C4B5FD"
                className="drop-shadow-sm"
              />
              <circle cx="128" cy="78" r="1.5" fill="#FFFFFF" />

              {/* Cute Smiling Mouth */}
              <path d="M93 84 Q100 90 107 84" stroke="#C4B5FD" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Rosy Cheeks */}
              <ellipse cx="66" cy="85" rx="4" ry="2" fill="#E879F9" fillOpacity="0.4" />
              <ellipse cx="134" cy="85" rx="4" ry="2" fill="#E879F9" fillOpacity="0.4" />
            </g>
          )}

          {mood === 'thinking' && (
            <g>
              {/* Relaxed Curious Eyes Looking Up */}
              <ellipse cx="78" cy="76" rx="5" ry="6" fill="#C4B5FD" />
              <circle cx="80" cy="74" r="1.8" fill="#FFFFFF" />

              <ellipse cx="124" cy="76" rx="5" ry="6" fill="#C4B5FD" />
              <circle cx="126" cy="74" r="1.8" fill="#FFFFFF" />

              {/* Neutral / Curious Mouth */}
              <line x1="95" y1="84" x2="105" y2="84" stroke="#C4B5FD" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {mood === 'concerned' && (
            <g>
              {/* Worried / Tilted Eyes */}
              <path d="M72 75 Q78 82 84 80" stroke="#C4B5FD" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <circle cx="78" cy="81" r="2.5" fill="#C4B5FD" />

              <path d="M128 75 Q122 82 116 80" stroke="#C4B5FD" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <circle cx="122" cy="81" r="2.5" fill="#C4B5FD" />

              {/* Sad / Concerned Mouth */}
              <path d="M94 88 Q100 83 106 88" stroke="#C4B5FD" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          )}

          {mood === 'tired' && (
            <g>
              {/* Droopy Eyelids */}
              <path d="M70 78 Q78 72 86 78" stroke="#A78BFA" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <ellipse cx="78" cy="82" rx="5" ry="3" fill="#8B5CF6" />

              <path d="M114 78 Q122 72 130 78" stroke="#A78BFA" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <ellipse cx="122" cy="82" rx="5" ry="3" fill="#8B5CF6" />

              {/* Weary Mouth */}
              <path d="M95 89 Q100 85 105 89" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              {/* Under-eye circles */}
              <path d="M71 86 Q78 90 85 86" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
              <path d="M115 86 Q122 90 129 86" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
            </g>
          )}

          {mood === 'celebrating' && (
            <g>
              {/* Happy Arc Eyes */}
              <path d="M70 80 Q77 71 84 80" stroke="#DDD6FE" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M116 80 Q123 71 130 80" stroke="#DDD6FE" strokeWidth="4" strokeLinecap="round" fill="none" />

              {/* Big Joyful Open Smile */}
              <path
                d="M91 82 Q100 95 109 82 Z"
                fill="#C4B5FD"
                stroke="#DDD6FE"
                strokeWidth="1.5"
              />
              <path d="M94 88 Q100 93 106 88" fill="#F43F5E" opacity="0.8" />
            </g>
          )}

          {/* === MOOD FLOATING ACCESSORIES / STICKER ELEMENTS === */}
          {showBadge && (
            <>
              {/* Thinking Gears Bubble */}
              {mood === 'thinking' && (
                <g className="animate-float-gentle">
                  <ellipse cx="160" cy="38" rx="22" ry="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                  <ellipse cx="146" cy="50" rx="4" ry="3" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
                  <text x="145" y="36" fontSize="10" fontWeight="700" fill="#64748B">hmmm</text>
                  <circle cx="165" cy="42" r="4" fill="#8B5CF6" />
                  <circle cx="173" cy="40" r="3" fill="#A78BFA" />
                </g>
              )}

              {/* Concerned Alarm Clock */}
              {mood === 'concerned' && (
                <g className="animate-soft-pulse">
                  <circle cx="160" cy="44" r="14" fill="#FFFFFF" stroke="#F43F5E" strokeWidth="2.5" />
                  <circle cx="160" cy="44" r="11" fill="#FFF1F2" />
                  {/* Clock Hands */}
                  <line x1="160" y1="44" x2="160" y2="38" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
                  <line x1="160" y1="44" x2="165" y2="44" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
                  {/* Clock Bells */}
                  <path d="M150 34 L153 36" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
                  <path d="M170 34 L167 36" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
                </g>
              )}

              {/* Tired Battery */}
              {mood === 'tired' && (
                <g>
                  <rect x="138" y="32" width="28" height="15" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
                  <rect x="166" y="36" width="3" height="7" rx="1.5" fill="#94A3B8" />
                  {/* 1 Red Battery Bar */}
                  <rect x="142" y="35" width="7" height="9" rx="2" fill="#EF4444" />
                </g>
              )}

              {/* Celebrating DONE! Banner & Confetti */}
              {mood === 'celebrating' && (
                <g>
                  {/* Ribbon Banner */}
                  <g className="drop-shadow-sm">
                    <rect x="52" y="16" width="96" height="24" rx="6" fill="#7C3AED" />
                    <text x="100" y="33" fontSize="13" fontWeight="900" fill="#FFFFFF" textAnchor="middle" letterSpacing="1.5">
                      DONE!
                    </text>
                  </g>
                  {/* Confetti Sprinkles */}
                  <circle cx="34" cy="24" r="3.5" fill="#F59E0B" />
                  <rect x="42" y="38" width="4" height="8" rx="2" fill="#10B981" transform="rotate(25 42 38)" />
                  <rect x="156" y="28" width="4" height="8" rx="2" fill="#EC4899" transform="rotate(-30 156 28)" />
                  <circle cx="168" cy="46" r="3.5" fill="#3B82F6" />
                  <rect x="30" y="52" width="6" height="3" rx="1.5" fill="#8B5CF6" transform="rotate(45 30 52)" />
                </g>
              )}
            </>
          )}
        </svg>
      </motion.div>
    </div>
  );
};
