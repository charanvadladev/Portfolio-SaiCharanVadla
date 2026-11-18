import React, { useEffect } from 'react';
import { X, ExternalLink, Github, Layers, Check } from 'lucide-react';
import { ProjectItem } from '../data/projects';
import { ProjectFlowDiagram } from './ProjectFlowDiagram';

interface ProjectDetailProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#04060a]/85 p-4 backdrop-blur-md sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/15 bg-[#0d1118] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#0d1118]/95 px-6 py-5 backdrop-blur-md sm:px-8">
          <div className="flex items-start gap-3.5">
            {project.logoSrc && (
              <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-[#050407] p-1">
                <img
                  src={project.logoSrc}
                  alt={`${project.name} emblem`}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <div>
              <div className="text-xs font-mono-tech text-[#38bdf8]">
                {project.index} · {project.category}
              </div>
              <h2
                id="project-modal-title"
                className="mt-1 font-display text-2xl font-bold tracking-tight text-[#f3f6fa] sm:text-3xl"
              >
                {project.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#121824] text-[#94a3b8] hover:border-[#38bdf8]/50 hover:text-[#f3f6fa] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Case Study Body */}
        <div className="space-y-8 px-6 py-7 sm:px-8">
          {/* Overview */}
          <div>
            <h3 className="text-xs font-mono-tech uppercase tracking-wider text-[#64748b]">
              Overview
            </h3>
            <p className="mt-2 text-base leading-relaxed text-[#cbd5e1]">
              {project.shortDescription}
            </p>
          </div>

          {/* Live System Flow Diagram */}
          <ProjectFlowDiagram steps={project.flowSteps} isActive={true} compact />

          {/* Problem & Solution */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-[#07090d]/70 p-5">
              <h3 className="text-xs font-mono-tech uppercase tracking-wider text-[#f59e0b]">
                Problem
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#94a3b8]">
                {project.problem}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#07090d]/70 p-5">
              <h3 className="text-xs font-mono-tech uppercase tracking-wider text-[#38bdf8]">
                Solution
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#94a3b8]">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Architecture */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech uppercase tracking-wider text-[#64748b]">
              <Layers className="h-3.5 w-3.5 text-[#38bdf8]" />
              <span>Architecture</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#cbd5e1] sm:text-base">
              {project.architecture}
            </p>
          </div>

          {/* Key Features & Technology Stack */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xs font-mono-tech uppercase tracking-wider text-[#64748b]">
                Key Features
              </h3>
              <ul className="mt-3 space-y-2.5">
                {project.keyFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-[#cbd5e1]"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#38bdf8]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-mono-tech uppercase tracking-wider text-[#64748b]">
                  Technology Stack
                </h3>
                <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs font-mono-tech text-[#f3f6fa]">
                  {project.technologies.map((tech, idx) => (
                    <React.Fragment key={tech}>
                      <span>{tech}</span>
                      {idx < project.technologies.length - 1 && (
                        <span aria-hidden="true" className="text-[#475569]">
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono-tech uppercase tracking-wider text-[#64748b]">
                  My Contribution
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#94a3b8]">
                  {project.myContribution}
                </p>
              </div>
            </div>
          </div>

          {/* Results / Impact */}
          <div className="rounded-xl border border-[#38bdf8]/25 bg-[#38bdf8]/5 p-5">
            <h3 className="text-xs font-mono-tech uppercase tracking-wider text-[#38bdf8]">
              Results &amp; Engineering Impact
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#e2e8f0]">
              {project.resultsImpact}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 bg-[#121824] px-5 py-2.5 text-sm font-medium text-[#f3f6fa] hover:border-[#38bdf8]/50 transition-colors"
            >
              <Github className="h-4 w-4 text-[#38bdf8]" />
              <span>GitHub Profile</span>
            </a>

            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#38bdf8] px-5 py-2.5 text-sm font-semibold text-[#07090d] hover:bg-[#7dd3fc] transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
