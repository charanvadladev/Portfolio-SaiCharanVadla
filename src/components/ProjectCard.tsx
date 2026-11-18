import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ProjectItem } from '../data/projects';
import { ProjectFlowDiagram } from './ProjectFlowDiagram';

interface ProjectCardProps {
  project: ProjectItem;
  onSelect: (project: ProjectItem) => void;
  isHighlighted?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  isHighlighted = false,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      data-cursor="project"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative overflow-hidden rounded-2xl border bg-[#0c101a] p-6 transition-colors duration-300 sm:p-8 lg:p-10 ${
        isHighlighted || hovered
          ? 'border-[#38bdf8]/40'
          : 'border-white/10 hover:border-white/25'
      }`}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left: Editorial Index, Title & Narrative */}
        <div className="lg:col-span-6">
          <div className="flex items-center gap-3 font-mono-tech text-xs text-[#94a3b8]">
            <span className="text-lg font-bold text-[#38bdf8] tabular-nums">
              {project.index}
            </span>
            <span aria-hidden="true" className="text-[#475569]">
              /
            </span>
            <span>{project.category}</span>
          </div>

          <div className="mt-3 flex items-start gap-3.5">
            {project.logoSrc && (
              <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-[#050407] p-1">
                <img
                  src={project.logoSrc}
                  alt={`${project.name} emblem`}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <h3 className="font-display text-2xl font-bold tracking-tight text-[#f3f6fa] sm:text-3xl">
              {project.name}
            </h3>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-[#94a3b8] sm:text-base">
            {project.shortDescription}
          </p>

          {/* Clean unboxed technology line */}
          <div className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono-tech text-xs text-[#cbd5e1]">
            {project.technologies.map((tech, idx) => (
              <React.Fragment key={tech}>
                <span className={hovered ? 'text-[#38bdf8] transition-colors' : ''}>
                  {tech}
                </span>
                {idx < project.technologies.length - 1 && (
                  <span aria-hidden="true" className="text-[#475569]">
                    ·
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-7">
            <button
              type="button"
              onClick={() => onSelect(project)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#38bdf8]/45 bg-[#38bdf8]/10 px-5 py-2.5 text-sm font-medium text-[#f3f6fa] transition-colors duration-200 hover:bg-[#38bdf8] hover:text-[#07090d] whitespace-nowrap shrink-0"
            >
              <span>Inspect Architecture</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* Right: Interactive Live System Architecture Flow */}
        <div className="lg:col-span-6">
          <ProjectFlowDiagram
            steps={project.flowSteps}
            isActive={hovered || isHighlighted}
            compact
          />
        </div>
      </div>
    </article>
  );
};
