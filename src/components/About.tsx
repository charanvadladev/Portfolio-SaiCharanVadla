import React, { useRef } from 'react';
import { DEVELOPER_PROFILE } from '../data/profile';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { revealSectionElements } from '../animations/scrollAnimations';

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useScrollAnimation(
    sectionRef,
    () => {
      if (sectionRef.current) {
        revealSectionElements(sectionRef.current, '[data-about-reveal]', reducedMotion);
      }
    },
    [reducedMotion],
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="relative flex min-h-[86vh] items-center py-24 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-14">
        {/* Clean Right-Aligned Editorial Copy (with Focus Clip on Left on Desktop / Above on Mobile) */}
        <div className="pt-[34vh] lg:ml-auto lg:w-[46%] lg:pt-0 xl:w-[44%]">
          <div className="rounded-2xl bg-[#050407]/80 p-5 lg:bg-transparent lg:p-0">
            <div
              data-about-reveal
              className="font-mono-tech text-xs uppercase tracking-[0.28em] text-[#d4d4d8]"
            >
              About Me
            </div>

            <h2
              id="about-heading"
              data-about-reveal
              className="mt-4 font-display text-2xl font-bold leading-snug tracking-tight text-[#f4f4f5] sm:text-3xl lg:text-[2.1rem]"
            >
              I&apos;m a Full Stack Software Engineer passionate about building scalable web platforms, cloud systems, and applied AI workflows.
            </h2>

            <p
              data-about-reveal
              className="mt-5 text-base leading-relaxed text-[#a1a1aa]"
            >
              {DEVELOPER_PROFILE.aboutIntro}
            </p>

            {/* Unboxed Engineering Profile Facts */}
            <dl
              data-about-reveal
              className="mt-8 grid grid-cols-1 gap-5 border-t border-white/10 pt-6 sm:grid-cols-3"
            >
              <div>
                <dt className="font-mono-tech text-xs text-[#71717a]">Experience</dt>
                <dd className="mt-1 font-display text-lg font-semibold text-[#f4f4f5] tabular-nums">
                  4+ Years
                </dd>
              </div>
              <div>
                <dt className="font-mono-tech text-xs text-[#71717a]">Education</dt>
                <dd className="mt-1 font-display text-lg font-semibold text-[#f4f4f5]">
                  M.Sc. &amp; B.Tech.
                </dd>
              </div>
              <div>
                <dt className="font-mono-tech text-xs text-[#71717a]">Location</dt>
                <dd className="mt-1 font-display text-lg font-semibold text-[#d4d4d8]">
                  {DEVELOPER_PROFILE.location}
                </dd>
              </div>
            </dl>

            {/* University Education Summary */}
            <div
              data-about-reveal
              className="mt-6 space-y-2.5 border-t border-white/10 pt-5"
            >
              {DEVELOPER_PROFILE.educationHistory.map((edu) => (
                <div
                  key={edu.degree}
                  className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <div>
                    <span className="font-display text-sm font-semibold text-[#f4f4f5]">
                      {edu.degree}
                    </span>
                    <span aria-hidden="true" className="mx-2 text-[#52525b]">
                      ·
                    </span>
                    <span className="text-sm text-[#a1a1aa]">{edu.institution}</span>
                  </div>
                  <span className="font-mono-tech text-xs text-[#71717a] tabular-nums shrink-0">
                    {edu.period}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
