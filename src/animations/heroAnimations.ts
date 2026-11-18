import gsap from 'gsap';

/**
 * Orchestrates the staggered MoncyDev-style split-hero entrance sequence
 * strictly on existing DOM nodes inside container (zero missing-target warnings).
 */
export function runHeroEntrance(
  container: HTMLElement,
  reducedMotion: boolean,
): gsap.core.Timeline | null {
  const allTargets = container.querySelectorAll('[data-hero-stagger]');
  if (!allTargets.length) return null;

  if (reducedMotion) {
    gsap.set(allTargets, {
      opacity: 1,
      y: 0,
      scale: 1,
      clearProps: 'transform',
    });
    return null;
  }

  const tl = gsap.timeline({
    defaults: {
      ease: 'power3.out',
    },
  });

  const addIfFound = (
    selector: string,
    vars: gsap.TweenVars,
    position: number,
  ) => {
    const els = container.querySelectorAll(selector);
    if (els.length > 0) {
      tl.fromTo(els, { opacity: 0, y: 18 }, { opacity: 1, y: 0, ...vars }, position);
    }
  };

  addIfFound('[data-hero-meta]', { duration: 0.48 }, 0.08);
  addIfFound('[data-hero-name]', { duration: 0.62 }, 0.16);
  addIfFound('[data-hero-role]', { duration: 0.56, stagger: 0.06 }, 0.24);
  addIfFound('[data-hero-summary]', { duration: 0.5, stagger: 0.06 }, 0.34);
  addIfFound('[data-hero-cta]', { duration: 0.48, stagger: 0.08 }, 0.44);

  return tl;
}
