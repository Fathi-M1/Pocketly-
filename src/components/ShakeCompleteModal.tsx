import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Task } from '../types';
import { PockyMascot } from './PockyMascot';
import { Smartphone, Heart, Flame, ArrowRight, X, Sparkles } from 'lucide-react';

interface ShakeCompleteModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteSuccess: (taskId: string) => void;
}

export const ShakeCompleteModal: React.FC<ShakeCompleteModalProps> = ({
  task,
  isOpen,
  onClose,
  onCompleteSuccess,
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Reset state whenever the modal opens for a new task
  useEffect(() => {
    if (isOpen) {
      setIsShaking(false);
      setIsCompleted(false);
    }
  }, [isOpen]);

  // Device motion shake detection listener
  useEffect(() => {
    if (!isOpen || isCompleted) return;

    let lastX = 0, lastY = 0, lastZ = 0;
    let lastTime = 0;
    const SHAKE_THRESHOLD = 15;

    const handleMotion = (event: DeviceMotionEvent) => {
      const current = event.accelerationIncludingGravity;
      if (!current || current.x === null || current.y === null || current.z === null) return;

      const currentTime = Date.now();
      if (currentTime - lastTime > 100) {
        const diffTime = currentTime - lastTime;
        lastTime = currentTime;

        const deltaX = Math.abs(current.x - lastX);
        const deltaY = Math.abs(current.y - lastY);
        const deltaZ = Math.abs(current.z - lastZ);

        const speed = ((deltaX + deltaY + deltaZ) / diffTime) * 10000;

        if (speed > SHAKE_THRESHOLD) {
          triggerCompletion();
        }

        lastX = current.x;
        lastY = current.y;
        lastZ = current.z;
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isOpen, isCompleted]);

  const triggerCompletion = () => {
    if (isCompleted || isShaking) return;
    setIsShaking(true);

    // Haptic vibration feedback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 100, 50, 200]);
      } catch (e) {
        // Ignore unsupported error
      }
    }

    // After violent shake animation, pop confetti and show celebration
    setTimeout(() => {
      setIsShaking(false);
      setIsCompleted(true);

      // Trigger multi-angle confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#FFFFFF'],
        });
      } catch (e) {}

      if (task) {
        onCompleteSuccess(task.id);
      }
    }, 900);
  };

  if (!isOpen || !task) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-[#6D3FF5] via-[#5F30E6] to-[#5022D9] text-white p-6 justify-between select-none"
      >
        {/* Top bar with Close */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-purple-100">
            <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            <span className="truncate max-w-[200px]">{task.title}</span>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Content */}
        {!isCompleted ? (
          <div className="flex flex-col items-center justify-center my-auto text-center px-4">
            {/* Pulsing & Vibrating Phone Icon Container */}
            <motion.div
              animate={
                isShaking
                  ? {
                      x: [-15, 15, -12, 12, -8, 8, 0],
                      rotate: [-15, 15, -10, 10, -5, 5, 0],
                      scale: [1, 1.2, 0.9, 1.15, 1],
                    }
                  : { scale: [1, 1.05, 1] }
              }
              transition={
                isShaking
                  ? { duration: 0.8, ease: 'easeInOut' }
                  : { repeat: Infinity, duration: 2.2, ease: 'easeInOut' }
              }
              onClick={triggerCompletion}
              className="relative w-36 h-36 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl shadow-purple-950/40 mb-8 cursor-pointer group active:scale-95"
            >
              {/* Outer soft glowing rings */}
              <div className="absolute inset-0 rounded-full bg-white/10 animate-ping opacity-30 pointer-events-none" />

              <Smartphone className="w-16 h-16 text-white stroke-[1.8] group-hover:scale-110 transition-transform animate-shake-wiggle" />
            </motion.div>

            {/* Main Shake Instructions */}
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight uppercase leading-tight">
              SHAKE TO COMPLETE
            </h2>

            <p className="text-purple-100 text-sm sm:text-base max-w-xs mt-3 leading-relaxed font-medium">
              Finish strong! Give your phone a quick shake to mark this task as done.
            </p>

            {/* Tap Simulator Button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={triggerCompletion}
              className="mt-8 px-6 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-purple-100 text-xs font-bold tracking-wider uppercase border border-white/25 transition cursor-pointer backdrop-blur-sm shadow-xs"
            >
              (OR TAP TO SIMULATE)
            </motion.button>
          </div>
        ) : (
          /* CELEBRATION REWARD SCREEN */
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="flex flex-col items-center justify-center my-auto text-center px-4"
          >
            {/* Mascot in Celebrating Mode with DONE! Ribbon */}
            <div className="mb-4">
              <PockyMascot mood="celebrating" size="xl" showBadge />
            </div>

            {/* Reward Title */}
            <h2 className="text-3xl font-extrabold font-heading text-white tracking-tight">
              Task Complete!
            </h2>

            {/* Health & Streak Boost Pills */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-lg text-rose-600 font-bold text-sm"
              >
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>+5 ❤️ Health Restored</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-lg text-amber-600 font-bold text-sm"
              >
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>🔥 Streak Maintained!</span>
              </motion.div>
            </div>

            <p className="text-purple-100 text-xs sm:text-sm mt-4 max-w-xs font-medium">
              Pocky is energized and proud of your focus today.
            </p>
          </motion.div>
        )}

        {/* Bottom Finish Button */}
        <div className="pb-4">
          {isCompleted ? (
            <button
              onClick={onClose}
              className="w-full bg-white text-[#5E30E6] hover:bg-purple-50 font-bold py-4 rounded-2xl shadow-xl active:scale-[0.98] transition flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <span>Back to Today</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={triggerCompletion}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3.5 rounded-2xl border border-white/20 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span>Simulate Complete Shake</span>
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
