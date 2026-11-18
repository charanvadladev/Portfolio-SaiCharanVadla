import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { CustomCursor } from './components/CustomCursor';
import { Navigation } from './components/Navigation';
import { SocialRails } from './components/SocialRails';
import { CharacterScene, CharacterPoseMode } from './components/CharacterScene';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { WhatIDo } from './components/WhatIDo';
import { Footer } from './components/Footer';
import { useReducedMotion } from './hooks/useReducedMotion';
import { runHeroEntrance } from './animations/heroAnimations';

const Experience = lazy(() =>
  import('./components/Experience').then((m) => ({ default: m.Experience })),
);
const Projects = lazy(() =>
  import('./components/Projects').then((m) => ({ default: m.Projects })),
);
const TechStackSpheres = lazy(() =>
  import('./components/TechStackSpheres').then((m) => ({ default: m.TechStackSpheres })),
);
const Contact = lazy(() =>
  import('./components/Contact').then((m) => ({ default: m.Contact })),
);

const TRACKED_SECTIONS = [
  'hero',
  'about',
  'what-i-do',
  'experience',
  'projects',
  'skills',
  'contact',
] as const;

type SectionId = (typeof TRACKED_SECTIONS)[number];

export function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isLoaded || !rootRef.current) return;
    runHeroEntrance(rootRef.current, reducedMotion);
  }, [isLoaded, reducedMotion]);

  useEffect(() => {
    const updateActiveSection = () => {
      const focalY = window.innerHeight * 0.44;
      let current: SectionId = 'hero';

      for (const id of TRACKED_SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= focalY) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [isLoaded]);

  const poseMode: CharacterPoseMode =
    activeSection === 'about'
      ? 'about'
      : activeSection === 'what-i-do'
        ? 'workspace'
        : 'hero';

  const actorVisible =
    activeSection === 'hero' ||
    activeSection === 'about' ||
    activeSection === 'what-i-do';

  return (
    <div ref={rootRef} className="relative min-h-screen bg-[#050407] text-[#f4f4f5]">
      {/* Pure deep obsidian studio backdrop with subtle grain (zero grid or colorful halo clutter) */}
      <div
        aria-hidden="true"
        className="lab-noise pointer-events-none fixed inset-0 z-0"
      />

      {/* Full-viewport Three.js 3D Developer Stage */}
      <CharacterScene poseMode={poseMode} visible={actorVisible} />

      {/* Desktop precision cursor */}
      <CustomCursor />

      {/* Fast profile boot screen */}
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}

      {/* Minimal 3-Zone Top Bar & Fixed Desktop Side Rails */}
      <Navigation />
      <SocialRails />

      {/* Main Portfolio Flow */}
      <main className="relative z-20">
        <Hero />
        <About />
        <WhatIDo />

        <Suspense
          fallback={
            <div className="mx-auto max-w-[1320px] px-6 py-24 font-mono-tech text-xs text-[#64748b]">
              Loading engineering modules...
            </div>
          }
        >
          <Experience />
          <Projects />
          <TechStackSpheres />
          <Contact />
        </Suspense>
      </main>

      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}

export default App;
