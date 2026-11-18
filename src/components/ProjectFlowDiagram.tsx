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
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#07090d]/90 ${
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
          stroke="rgba(56, 189, 248, 0.14)"
          strokeWidth="1.5"
        />
        <path
          d="M 20 60 C 140 20, 260 100, 380 55 C 470 25, 540 70, 585 60"
          fill="none"
          stroke={isActive ? '#38bdf8' : 'rgba(56, 189, 248, 0.4)'}
          strokeWidth={isActive ? '2.2' : '1.4'}
          strokeDasharray="14 24"
          className={reducedMotion ? '' : 'motion-flow-line'}
        />
      </svg>

      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono-tech text-[#64748b]">
        <span>SYSTEM ARCHITECTURE FLOW</span>
        <span className={isActive ? 'text-[#38bdf8]' : 'text-[#64748b]'}>
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
                  ? 'border-[#38bdf8]/60 bg-[#0f172a]/95 shadow-[0_0_20px_rgba(56,189,248,0.14)]'
                  : 'border-white/10 bg-[#0d1118]/92'
              }`}
              style={{
                transitionDelay: isActive ? `${index * 45}ms` : '0ms',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-tech tabular-nums text-[#38bdf8]">
                  0{index + 1}
                </span>
                {index < steps.length - 1 && (
                  <ArrowRight
                    className={`h-3 w-3 transition-transform duration-300 ${
                      isActive ? 'translate-x-0.5 text-[#38bdf8]' : 'text-[#475569]'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="mt-1 font-display text-xs font-semibold text-[#f3f6fa] sm:text-sm">
                {node.label}
              </div>
              <div className="mt-0.5 text-[11px] font-mono-tech text-[#94a3b8]">
                {node.sublabel}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
