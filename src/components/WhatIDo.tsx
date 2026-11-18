import React, { useRef, useState } from 'react';
import { Code2, Cloud, Plus, Minus } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { revealSectionElements } from '../animations/scrollAnimations';

interface CapabilityItem {
  id: string;
  index: string;
  title: string;
  icon: 'code' | 'cloud';
  description: string;
  stack: string[];
}

const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'develop',
    index: '01',
    title: 'Develop',
    icon: 'code',
    description:
      'Building production full-stack applications uniting React, Angular, and TypeScript frontends with resilient C# / ASP.NET Core, Java, PostgreSQL, and MongoDB services.',
    stack: ['React', 'Angular', 'TypeScript', 'ASP.NET Core', 'C#', 'Java', 'PostgreSQL', 'MongoDB'],
  },
  {
    id: 'cloud-ai',
    index: '02',
    title: 'Cloud & AI',
    icon: 'cloud',
    description:
      'Automating containerized deployments on Azure & AWS with Docker, Kubernetes, Terraform, and GitLab/GitHub CI/CD while integrating FastAPI computer vision and LLM workflows.',
    stack: ['Azure', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'RabbitMQ', 'FastAPI', 'Generative AI'],
  },
];

export const WhatIDo: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [expandedId, setExpandedId] = useState<string>('develop');

  useScrollAnimation(
    sectionRef,
    () => {
      if (sectionRef.current) {
        revealSectionElements(sectionRef.current, '[data-whatido-reveal]', reducedMotion);
      }
    },
    [reducedMotion],
  );

  return (
    <section
      id="what-i-do"
      ref={sectionRef}
      aria-labelledby="whatido-heading"
      className="relative flex min-h-[92vh] items-center py-24 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Flank: Giant Stacked WHAT / I DO Typography */}
          <div className="lg:col-span-3">
            <h2
              id="whatido-heading"
              data-whatido-reveal
              className="font-display text-5xl font-extrabold uppercase leading-[0.92] tracking-tight text-[#f4f4f5] sm:text-6xl xl:text-7xl"
            >
              WHAT
              <br />
              <span className="text-[#f4f4f5]">I </span>
              <span className="text-[#a1a1aa]">DO</span>
            </h2>
          </div>

          {/* Center Space Reserved Open for Seated Developer + Workstation Clip */}
          <div
            aria-hidden="true"
            className="h-[34vh] w-full lg:col-span-5 lg:h-[480px]"
          />

          {/* Right Flank: Clean Minimalist Architectural Capabilities */}
          <div className="lg:col-span-4">
            <div className="space-y-4 rounded-2xl bg-[#050407]/85 p-2 lg:bg-transparent lg:p-0">
              {CAPABILITIES.map((cap) => {
                const isExpanded = expandedId === cap.id;
                const Icon = cap.icon === 'code' ? Code2 : Cloud;

                return (
                  <article
                    key={cap.id}
                    data-whatido-reveal
                    className={`rounded-2xl border transition-colors duration-200 ${
                      isExpanded
                        ? 'border-white/25 bg-[#0a0a0e]/95'
                        : 'border-white/10 bg-[#07070b]/85 hover:border-white/20'
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() =>
                        setExpandedId((prev) => (prev === cap.id ? '' : cap.id))
                      }
                      className="flex w-full items-center justify-between gap-4 p-6 text-left"
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#e4e4e7]">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <div className="font-mono-tech text-[11px] text-[#71717a] tabular-nums">
                            {cap.index}
                          </div>
                          <h3 className="font-display text-xl font-bold tracking-tight text-[#f4f4f5] sm:text-2xl">
                            {cap.title}
                          </h3>
                        </div>
                      </div>

                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-[#a1a1aa] transition-colors hover:text-[#f4f4f5]">
                        {isExpanded ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-white/10 px-6 pt-4 pb-6">
                        <p className="text-sm leading-relaxed text-[#a1a1aa]">
                          {cap.description}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono-tech text-xs text-[#e4e4e7]">
                          {cap.stack.map((tech, tIdx) => (
                            <React.Fragment key={tech}>
                              <span>{tech}</span>
                              {tIdx < cap.stack.length - 1 && (
                                <span aria-hidden="true" className="text-[#52525b]">
                                  ·
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
