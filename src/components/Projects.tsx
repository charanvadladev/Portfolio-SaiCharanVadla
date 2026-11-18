import React, { useRef } from 'react';
import { PROJECTS_DATA } from '../data/projects';
import { ProjectCard } from './ProjectCard';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { revealSectionElements } from '../animations/scrollAnimations';

export const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useScrollAnimation(
    sectionRef,
    () => {
      if (sectionRef.current) {
        revealSectionElements(sectionRef.current, '[data-projects-reveal]', reducedMotion);
      }
    },
    [reducedMotion],
  );

  const featuredProject = PROJECTS_DATA[0];

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-labelledby="projects-heading"
      className="relative border-t border-white/10 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12">
        <div className="max-w-2xl">
          <div
            data-projects-reveal
            className="font-mono-tech text-xs uppercase tracking-[0.2em] text-white"
          >
            04. My Work
          </div>
          <h2
            id="projects-heading"
            data-projects-reveal
            className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Featured production build.
          </h2>
        </div>

        {featuredProject && (
          <div data-projects-reveal className="mt-10">
            <ProjectCard project={featuredProject} isHighlighted />
          </div>
        )}
      </div>
    </section>
  );
};
