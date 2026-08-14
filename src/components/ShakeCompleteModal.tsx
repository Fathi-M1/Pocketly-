import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Task } from '../types';
import { PockyMascot } from './PockyMascot';
import { Mouse, Heart, Flame, ArrowRight, X, Sparkles, Smartphone } from 'lucide-react';

interface ShakeCompleteModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteSuccess: (taskId: string) => void;
}

// True on any device that has a real touch screen (phones/tablets)
const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  (navigator.maxTouchPoints > 0 || 'ontouchstart' in window);

export const ShakeCompleteModal: React.FC<ShakeCompleteModalProps> = ({
  task,
  isOpen,
  onClose,
  onCompleteSuccess,
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [mouseProgress, setMouseProgress] = useState(0); // 0-100 for desktop shake meter
  const hasTriggered = useRef(false);
  const isTouch = useRef(isTouchDevice());

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setIsShaking(false);
      setIsCompleted(false);
      setPermissionDenied(false);
      setMouseProgress(0);
      hasTriggered.current = false;
      isTouch.current = isTouchDevice();
    }
  }, [isOpen]);

  // --- MOBILE: DeviceMotion shake detection (only on real touch devices) ---
  useEffect(() => {
    if (!isOpen || !isTouch.current) return;

    let lastX = 0, lastY = 0, lastZ = 0, lastTime = 0;
    const SHAKE_THRESHOLD = 12;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const now = Date.now();
      if (now - lastTime > 80) {
        const dt = now - lastTime;
        lastTime = now;
        const speed =
          ((Math.abs(acc.x - lastX) + Math.abs(acc.y - lastY) + Math.abs(acc.z - lastZ)) / dt) *
          10000;
        if (speed > SHAKE_THRESHOLD) triggerCompletion();
        lastX = acc.x; lastY = acc.y; lastZ = acc.z;
      }
    };

    const DeviceMotionEventTyped = DeviceMotionEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    if (typeof DeviceMotionEventTyped.requestPermission === 'function') {
      DeviceMotionEventTyped.requestPermission()
        .then((s) => s === 'granted'
          ? window.addEventListener('devicemotion', handleMotion)
          : setPermissionDenied(true))
        .catch(() => setPermissionDenied(true));
    } else {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [isOpen]);

  // --- DESKTOP: Mouse rapid-movement "shake" detection ---
  useEffect(() => {
    if (!isOpen || isTouch.current) return;

    let lastMouseX = 0, lastMouseY = 0, lastMouseTime = 0;
    let totalDistance = 0;
    const TARGET_DISTANCE = 600; // px of rapid movement needed
    const DECAY_INTERVAL = 80; // ms between samples; progress decays if mouse is still

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lastMouseTime;

      if (lastMouseTime > 0 && dt < 120) {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = dist / dt; // px/ms

        if (speed > 1.2) {
          // Fast movement — accumulate progress
          totalDistance = Math.min(TARGET_DISTANCE, totalDistance + dist * 1.5);
        } else {
          // Slow / stopped — decay
          totalDistance = Math.max(0, totalDistance - 20);
        }

        const pct = Math.round((totalDistance / TARGET_DISTANCE) * 100);
        setMouseProgress(pct);

        if (totalDistance >= TARGET_DISTANCE) {
          triggerCompletion();
        }
      }

      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      lastMouseTime = now;
    };

    // Passive decay when mouse is idle
    const decayTimer = setInterval(() => {
      totalDistance = Math.max(0, totalDistance - 15);
      setMouseProgress(Math.round((totalDistance / TARGET_DISTANCE) * 100));
    }, DECAY_INTERVAL);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(decayTimer);
    };
  }, [isOpen]);

  const triggerCompletion = () => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    setIsShaking(true);
    setMouseProgress(100);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate([100, 50, 100, 50, 200]); } catch (_) {}
    }

    setTimeout(() => {
      setIsShaking(false);
      setIsCompleted(true);

      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 }, colors: ['#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#FFFFFF'] });
        setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#7C3AED', '#F59E0B'] }), 200);
        setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#EC4899', '#10B981'] }), 400);
      } catch (_) {}

      if (task) onCompleteSuccess(task.id);
    }, 900);
  };

  if (!isOpen || !task) return null;

  const onMobile = isTouch.current;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-[#6D3FF5] via-[#5F30E6] to-[#5022D9] text-white p-6 justify-between select-none"
      >
        {/* Top bar */}
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
            {/* Icon circle */}
            <motion.div
              animate={
                isShaking
                  ? { x: [-15, 15, -12, 12, -8, 8, 0], rotate: [-15, 15, -10, 10, -5, 5, 0], scale: [1, 1.2, 0.9, 1.15, 1] }
                  : { scale: [1, 1.05, 1] }
              }
              transition={
                isShaking
                  ? { duration: 0.8, ease: 'easeInOut' }
                  : { repeat: Infinity, duration: 2.2, ease: 'easeInOut' }
              }
              onClick={triggerCompletion}
              className="relative w-36 h-36 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl shadow-purple-950/40 mb-6 cursor-pointer group active:scale-95"
            >
              <div className="absolute inset-0 rounded-full bg-white/10 animate-ping opacity-30 pointer-events-none" />
              {onMobile
                ? <Smartphone className="w-16 h-16 text-white stroke-[1.8] group-hover:scale-110 transition-transform" />
                : <Mouse className="w-16 h-16 text-white stroke-[1.8] group-hover:scale-110 transition-transform" />
              }
            </motion.div>

            {/* Desktop mouse-shake progress meter */}
            {!onMobile && (
              <div className="w-56 mb-5">
                <div className="flex justify-between text-[11px] font-bold text-purple-200 mb-1.5">
                  <span>SHAKE METER</span>
                  <span>{mouseProgress}%</span>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${mouseProgress}%` }}
                    transition={{ duration: 0.1 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            )}

            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight uppercase leading-tight">
              {onMobile ? 'SHAKE TO COMPLETE' : 'WIGGLE YOUR MOUSE!'}
            </h2>

            <p className="text-purple-100 text-sm sm:text-base max-w-xs mt-3 leading-relaxed font-medium">
              {onMobile
                ? permissionDenied
                  ? 'Motion access denied. Tap the button below!'
                  : 'Give your phone a quick shake to mark this done.'
                : 'Move your mouse rapidly left and right, or just tap the button below.'}
            </p>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={triggerCompletion}
              className="mt-8 px-6 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-purple-100 text-xs font-bold tracking-wider uppercase border border-white/25 transition cursor-pointer backdrop-blur-sm shadow-xs"
            >
              TAP TO COMPLETE
            </motion.button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="flex flex-col items-center justify-center my-auto text-center px-4"
          >
            <div className="mb-4">
              <PockyMascot mood="celebrating" size="xl" showBadge />
            </div>
            <h2 className="text-3xl font-extrabold font-heading text-white tracking-tight">
              Task Complete!
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-lg text-rose-600 font-bold text-sm"
              >
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>+5 ❤️ Health Restored</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
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

        {/* Bottom Button */}
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
              <span>Complete Task</span>
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
