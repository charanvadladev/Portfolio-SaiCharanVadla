import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PROJECTS_DATA, ProjectItem } from '../data/projects';
import { ProjectCard } from './ProjectCard';
import { ProjectDetail } from './ProjectDetail';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { revealSectionElements } from '../animations/scrollAnimations';

export const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useScrollAnimation(
    sectionRef,
    () => {
      if (sectionRef.current) {
        revealSectionElements(sectionRef.current, '[data-projects-reveal]', reducedMotion);
      }
    },
    [reducedMotion],
  );

  const goToSlide = (index: number) => {
    const clamped = Math.max(0, Math.min(PROJECTS_DATA.length - 1, index));
    setActiveIndex(clamped);
    if (trackRef.current) {
      const child = trackRef.current.children[clamped] as HTMLElement | undefined;
      if (child) {
        child.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'nearest',
          inline: 'start',
        });
      }
    }
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-labelledby="projects-heading"
      className="relative border-t border-white/10 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div data-projects-reveal className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#38bdf8]">
              04. My Work
            </div>
            <h2
              id="projects-heading"
              data-projects-reveal
              className="mt-3 font-display text-3xl font-bold tracking-tight text-[#f3f6fa] sm:text-4xl lg:text-5xl"
            >
              Selected systems &amp; production builds.
            </h2>
          </div>

          {/* MoncyDev-style Showcase Stepper Controls */}
          <div data-projects-reveal className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#0d1118] p-1">
              {PROJECTS_DATA.map((project, idx) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`min-h-[36px] rounded-lg px-2.5 font-mono-tech text-xs tabular-nums transition-colors ${
                    activeIndex === idx
                      ? 'bg-[#38bdf8] font-semibold text-[#07090d]'
                      : 'text-[#94a3b8] hover:text-[#f3f6fa]'
                  }`}
                >
                  {project.index}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous project"
                onClick={() => goToSlide(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-[#0d1118] text-[#f3f6fa] transition-colors hover:border-[#38bdf8]/50 disabled:opacity-35"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next project"
                onClick={() => goToSlide(activeIndex + 1)}
                disabled={activeIndex === PROJECTS_DATA.length - 1}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-[#0d1118] text-[#f3f6fa] transition-colors hover:border-[#38bdf8]/50 disabled:opacity-35"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Snap Showcase Track */}
        <div
          ref={trackRef}
          data-projects-reveal
          onScroll={() => {
            if (!trackRef.current) return;
            const scrollLeft = trackRef.current.scrollLeft;
            const cardWidth = trackRef.current.firstElementChild?.clientWidth || 1;
            const idx = Math.round(scrollLeft / cardWidth);
            if (idx >= 0 && idx < PROJECTS_DATA.length && idx !== activeIndex) {
              setActiveIndex(idx);
            }
          }}
          className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
        >
          {PROJECTS_DATA.map((project, idx) => (
            <div
              key={project.id}
              className="w-[92%] shrink-0 snap-start lg:w-[86%] xl:w-[82%]"
            >
              <ProjectCard
                project={project}
                onSelect={setSelectedProject}
                isHighlighted={activeIndex === idx}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Full Case Study Modal */}
      <ProjectDetail
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
