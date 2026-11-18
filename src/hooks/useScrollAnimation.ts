import { useEffect, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Registers a scoped GSAP animation context tied to a React container ref
 * and automatically reverts all ScrollTriggers and tweens on unmount.
 */
export function useScrollAnimation(
  scopeRef: RefObject<HTMLElement | null>,
  setup: (ctx: gsap.Context) => void,
  deps: unknown[] = [],
  disabled = false,
): void {
  useEffect(() => {
    if (disabled || !scopeRef.current) return;

    const ctx = gsap.context((self) => {
      setup(self);
    }, scopeRef);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, ...deps]);
}
