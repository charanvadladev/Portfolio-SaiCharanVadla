import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveals section header and modular panels progressively on scroll,
 * cleanly reversing or maintaining clarity when scrolling back up.
 */
export function revealSectionElements(
  container: HTMLElement,
  selector: string,
  reducedMotion: boolean,
): void {
  const targets = container.querySelectorAll(selector);
  if (!targets.length) return;

  if (reducedMotion) {
    gsap.set(targets, { opacity: 1, y: 0, clearProps: 'transform' });
    return;
  }

  gsap.fromTo(
    targets,
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 0.65,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 78%',
        toggleActions: 'play none none reverse',
      },
    },
  );
}
