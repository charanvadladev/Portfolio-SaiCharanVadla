import React, { useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { ProjectItem } from '../data/projects';
import { ProjectFlowDiagram } from './ProjectFlowDiagram';

interface ProjectCardProps {
  project: ProjectItem;
  isHighlighted?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isHighlighted = false,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      data-cursor="project"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative overflow-hidden rounded-2xl border bg-[#090b10] p-6 transition-colors duration-300 sm:p-8 lg:p-10 ${
        isHighlighted || hovered
          ? 'border-white/30'
          : 'border-white/12 hover:border-white/25'
      }`}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left: Editorial Index, Title & Narrative */}
        <div className="lg:col-span-6">
          <div className="flex items-center gap-3 font-mono-tech text-xs text-[#d4d4d8]">
            <span className="text-lg font-bold text-white tabular-nums">
              {project.index}
            </span>
            <span aria-hidden="true" className="text-[#52525b]">
              /
            </span>
            <span className="text-white/85">{project.category}</span>
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
            <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {project.name}
            </h3>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-[#d4d4d8] sm:text-base">
            {project.shortDescription}
          </p>

          {/* Clean unboxed technology line */}
          <div className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono-tech text-xs text-white/90">
            {project.technologies.map((tech, idx) => (
              <React.Fragment key={tech}>
                <span>{tech}</span>
                {idx < project.technologies.length - 1 && (
                  <span aria-hidden="true" className="text-[#52525b]">
                    ·
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={project.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#050407] transition-colors duration-200 hover:bg-[#e4e4e7] whitespace-nowrap shrink-0"
            >
              <span>Visit Application</span>
              <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:border-white/40 hover:bg-white/10 whitespace-nowrap shrink-0"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
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
