import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'boot' | 'ready' | 'exit'>('boot');

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }

    const start = performance.now();
    const duration = 850;
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        setPhase('ready');
        window.setTimeout(() => {
          setPhase('exit');
          window.setTimeout(onComplete, 320);
        }, 260);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Loading Developer Lab"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#000000] transition-opacity duration-300 ${
        phase === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-md px-6">
        <div className="rounded-xl border border-white/10 bg-[#07070b] p-6 shadow-2xl">
          <div className="flex items-center justify-between text-xs font-mono-tech text-[#a1a1aa]">
            <span>THE DEVELOPER LAB</span>
            <span className="tabular-nums text-white">{progress}%</span>
          </div>

          <p className="mt-4 text-sm font-mono-tech tracking-wide text-white">
            {phase === 'boot' ? 'Loading portfolio...' : 'Portfolio ready'}
          </p>

          <div
            className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-white transition-transform duration-75 origin-left"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-xs font-mono-tech text-[#64748b]">
            <span>Sai Charan Vadla · Germany</span>
            <button
              type="button"
              onClick={onComplete}
              className="text-[#94a3b8] hover:text-[#f3f6fa] transition-colors cursor-pointer"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
