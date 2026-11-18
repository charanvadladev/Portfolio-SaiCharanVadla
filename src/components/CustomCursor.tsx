import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

type CursorVariant = 'default' | 'action' | 'project';

export const CustomCursor: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) return;

    setEnabled(true);
    document.body.classList.add('has-custom-cursor');

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) setVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-cursor="project"]')) {
        setVariant('project');
      } else if (target?.closest('a, button, [role="button"], [data-cursor="action"]')) {
        setVariant('action');
      } else {
        setVariant('default');
      }
    };

    const onMouseLeave = () => setVisible(false);

    const animateRing = () => {
      ringX += (targetX - ringX) * 0.22;
      ringY += (targetY - ringY) * 0.22;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      rafId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    rafId = requestAnimationFrame(animateRing);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion, visible]);

  if (!enabled || !visible) return null;

  const ringSize =
     variant === 'action' ? 'h-9 w-9 border-white/80' : 'h-7 w-7 border-white/30';

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]">
      <div
        ref={ringRef}
        className={`fixed -left-3.5 -top-3.5 rounded-full border transition-[width,height,margin,border-color,background-color] duration-150 ease-out flex items-center justify-center ${ringSize}`}
        style={{
          marginLeft: variant === 'action' ? '-4px' : '0px',
          marginTop:  variant === 'action' ? '-4px' : '0px',
        }}
      >
      </div>
      <div
        ref={dotRef}
        className="fixed -left-1 -top-1 h-2 w-2 rounded-full bg-white"
      />
    </div>
  );
};
