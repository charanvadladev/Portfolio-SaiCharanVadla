import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FlowNode } from '../data/projects';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ProjectFlowDiagramProps {
  steps: FlowNode[];
  isActive?: boolean;
  compact?: boolean;
}

/**
 * Interactive system architecture flow visualization with animated SVG data-flow
 * conduits behind sequential architecture nodes.
 */
export const ProjectFlowDiagram: React.FC<ProjectFlowDiagramProps> = ({
  steps,
  isActive = false,
  compact = false,
}) => {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/12 bg-[#060609]/95 ${
        compact ? 'p-4' : 'p-5 sm:p-6'
      }`}
    >
      {/* Animated SVG Motion-Flow Signal Conduit Backdrop */}
      <svg
        aria-hidden="true"
        viewBox="0 0 600 120"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-55"
      >
        <path
          d="M 20 60 C 140 20, 260 100, 380 55 C 470 25, 540 70, 585 60"
          fill="none"
          stroke="rgba(255, 255, 255, 0.14)"
          strokeWidth="1.5"
        />
        <path
          d="M 20 60 C 140 20, 260 100, 380 55 C 470 25, 540 70, 585 60"
          fill="none"
          stroke={isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'}
          strokeWidth={isActive ? '2' : '1.3'}
          strokeDasharray="14 24"
          className={reducedMotion ? '' : 'motion-flow-line'}
        />
      </svg>

      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono-tech text-[#a1a1aa]">
        <span>SYSTEM ARCHITECTURE FLOW</span>
        <span className={isActive ? 'text-white' : 'text-[#71717a]'}>
          {isActive ? 'Signal Active' : 'Hover to trace'}
        </span>
      </div>

      <div
        className={`relative z-10 mt-4 grid gap-2.5 ${
          steps.length >= 6
            ? 'grid-cols-2 sm:grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
        }`}
      >
        {steps.map((node, index) => (
          <div key={node.id} className="relative flex items-center gap-2">
            <div
              className={`w-full rounded-lg border px-3 py-2.5 transition-all duration-300 ${
                isActive
                  ? 'border-white/35 bg-[#0e0f14]/95'
                  : 'border-white/10 bg-[#0a0b0f]/95'
              }`}
              style={{
                transitionDelay: isActive ? `${index * 45}ms` : '0ms',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-tech tabular-nums text-white">
                  0{index + 1}
                </span>
                {index < steps.length - 1 && (
                  <ArrowRight
                    className={`h-3 w-3 transition-transform duration-300 ${
                      isActive ? 'translate-x-0.5 text-white' : 'text-[#52525b]'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="mt-1 font-display text-xs font-semibold text-white sm:text-sm">
                {node.label}
              </div>
              <div className="mt-0.5 text-[11px] font-mono-tech text-[#a1a1aa]">
                {node.sublabel}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
