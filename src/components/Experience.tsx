import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap } from 'lucide-react';
import { EXPERIENCE_PIPELINE, ExperienceEntry } from '../data/experience';
import { DEVELOPER_PROFILE } from '../data/profile';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

gsap.registerPlugin(ScrollTrigger);

const CompanyLogoBadge: React.FC<{ stage: ExperienceEntry }> = ({ stage }) => {
  if (stage.logoVariant === 'invert-wordmark') {
    return (
      <div className="inline-flex h-10 items-center rounded-lg border border-white/10 bg-[#0c101a] px-3">
        <img
          src={stage.logoSrc}
          alt={`${stage.company} logo`}
          className="h-5 w-auto object-contain brightness-0 invert"
        />
      </div>
    );
  }

  if (stage.logoVariant === 'tile-light') {
    return (
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/95 p-1.5">
        <img
          src={stage.logoSrc}
          alt={`${stage.company} logo`}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="inline-flex h-10 w-10 overflow-hidden rounded-lg border border-white/15 bg-[#0c101a]">
      <img
        src={stage.logoSrc}
        alt={`${stage.company} logo`}
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const spineRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useScrollAnimation(
    sectionRef,
    () => {
      if (!sectionRef.current || reducedMotion) return;

      if (spineRef.current) {
        gsap.fromTo(
          spineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              end: 'bottom 80%',
              scrub: 0.5,
            },
          },
        );
      }

      const items = sectionRef.current.querySelectorAll('[data-career-item]');
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });
    },
    [reducedMotion],
  );

  return (
    <section
      id="experience"
      ref={sectionRef}
      aria-labelledby="experience-heading"
      className="relative border-t border-white/10 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#a78bfa]">
            03. Experience &amp; Education
          </div>
          <h2
            id="experience-heading"
            className="mt-3 font-display text-3xl font-bold tracking-tight text-[#f3f6fa] sm:text-4xl lg:text-5xl"
          >
            Engineering across industry &amp; research.
          </h2>
        </div>

        {/* Centered Vertical Spine Timeline */}
        <div className="relative mt-16 pl-7 md:pl-0">
          {/* Background Spine */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-2 w-px bg-white/10 md:left-1/2 md:-translate-x-1/2"
          />
          {/* Scroll-Scrubbed Gradient Progress Spine */}
          <div
            ref={spineRef}
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-2 w-0.5 origin-top bg-gradient-to-b from-[#38bdf8] via-[#a78bfa] to-[#34d399] md:left-1/2 md:-translate-x-1/2"
            style={{ transform: reducedMotion ? 'scaleY(1)' : 'scaleY(0)' }}
          />

          <div className="space-y-12 md:space-y-16">
            {EXPERIENCE_PIPELINE.map((stage, index) => {
              const isLeft = index % 2 === 0;

              return (
                <article
                  key={stage.id}
                  data-career-item
                  className="relative md:grid md:grid-cols-2 md:items-start md:gap-12"
                >
                  {/* Node Marker on Spine */}
                  <span
                    aria-hidden="true"
                    className="absolute top-2 -left-[22px] h-3 w-3 rounded-full border-2 border-[#38bdf8] bg-[#07090d] md:left-1/2 md:-translate-x-1/2"
                  />

                  {/* Left Column (Company Logo, Role & Period) */}
                  <div
                    className={
                      isLeft
                        ? 'md:pr-10 md:text-right'
                        : 'md:order-2 md:pl-10'
                    }
                  >
                    <div
                      className={`mb-3 flex items-center gap-3 ${
                        isLeft ? 'md:justify-end' : 'justify-start'
                      }`}
                    >
                      <CompanyLogoBadge stage={stage} />
                    </div>

                    <div className="font-mono-tech text-xs text-[#38bdf8] tabular-nums">
                      <span>{stage.period}</span>
                      <span aria-hidden="true" className="mx-2 text-[#475569]">
                        ·
                      </span>
                      <span className="text-[#94a3b8]">{stage.location}</span>
                    </div>

                    <h3 className="mt-1.5 font-display text-2xl font-bold text-[#f3f6fa]">
                      {stage.company}
                    </h3>
                    <div className="mt-1 font-sans text-sm font-medium text-[#a78bfa]">
                      {stage.roleTitle}
                    </div>
                  </div>

                  {/* Right / Opposite Column (Abstract Summary & Tech Stack) */}
                  <div
                    className={`mt-3 md:mt-0 ${
                      isLeft ? 'md:pl-10' : 'md:order-1 md:pr-10 md:text-right'
                    }`}
                  >
                    <div className="font-mono-tech text-xs text-[#cbd5e1]">
                      {stage.projectFocus}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[#94a3b8] sm:text-base">
                      {stage.summary}
                    </p>
                    <div
                      className={`mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono-tech text-xs text-[#cbd5e1] ${
                        isLeft ? '' : 'md:justify-end'
                      }`}
                    >
                      {stage.technologies.map((tech, tIdx) => (
                        <React.Fragment key={tech}>
                          <span>{tech}</span>
                          {tIdx < stage.technologies.length - 1 && (
                            <span aria-hidden="true" className="text-[#475569]">
                              ·
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Academic Education Subsection */}
        <div
          id="education"
          data-career-item
          className="mt-20 border-t border-white/10 pt-14"
        >
          <div className="flex items-center gap-2.5 font-mono-tech text-xs uppercase tracking-[0.2em] text-[#38bdf8]">
            <GraduationCap className="h-4 w-4" />
            <span>Education</span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {DEVELOPER_PROFILE.educationHistory.map((edu) => (
              <article
                key={edu.degree}
                className="rounded-2xl border border-white/10 bg-[#0b0d14] p-6 transition-colors hover:border-white/25"
              >
                <div className="font-mono-tech text-xs text-[#94a3b8] tabular-nums">
                  {edu.period}
                </div>
                <h3 className="mt-1.5 font-display text-xl font-bold text-[#f3f6fa]">
                  {edu.degree}
                </h3>
                <div className="mt-1 text-sm font-medium text-[#38bdf8]">
                  {edu.institution}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#94a3b8]">
                  {edu.focus}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
