import React from 'react';
import { ArrowDownRight } from 'lucide-react';
import { DEVELOPER_PROFILE } from '../data/profile';

export const Hero: React.FC = () => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative flex min-h-screen flex-col justify-between pt-28 pb-12 lg:justify-center lg:pt-20 lg:pb-12"
    >
      <div className="relative z-20 mx-auto w-full max-w-[1320px] px-6 lg:px-14">
        <div className="flex min-h-[76vh] flex-col justify-between gap-6 lg:grid lg:min-h-0 lg:grid-cols-12 lg:items-center lg:gap-4">
          {/* Left Flank: Greeting & Name */}
          <div className="lg:col-span-3">
            <div className="inline-block bg-transparent p-0">
              <div
                data-hero-stagger
                data-hero-meta
                className="font-sans text-base font-medium tracking-wide text-[#d4d4d8] sm:text-lg"
              >
                Hello! I&apos;m
              </div>

              <h1
                data-hero-stagger
                data-hero-name
                className="mt-1.5 font-display text-[clamp(2.1rem,3.3vw,3.2rem)] font-bold uppercase leading-[1.02] tracking-tight text-[#f4f4f5]"
              >
                Sai Charan
                <br />
                Vadla
              </h1>

              {/* Clean Unboxed Metadata Line */}
              <div
                data-hero-stagger
                data-hero-summary
                className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono-tech text-[#a1a1aa]"
              >
                {DEVELOPER_PROFILE.heroMetadata.map((item, idx) => (
                  <React.Fragment key={item}>
                    <span className={idx === 0 ? 'text-[#f4f4f5]' : ''}>{item}</span>
                    {idx < DEVELOPER_PROFILE.heroMetadata.length - 1 && (
                      <span aria-hidden="true" className="text-[#52525b]">
                        ·
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Center Window Reserved Open for the 3D Avatar Bust & Waving Hand */}
          <div
            aria-hidden="true"
            className="h-[38vh] w-full lg:col-span-6 lg:h-[500px]"
          />

          {/* Right Flank: Kinetic Role Typography + Primary CTA */}
          <div className="self-end text-right lg:col-span-3 lg:self-auto">
            <div className="bg-transparent p-0 text-right">
              <div
                data-hero-stagger
                data-hero-role
                className="font-sans text-base font-medium tracking-wide text-[#d4d4d8] sm:text-lg"
              >
                A Full Stack
              </div>

              <div data-hero-stagger data-hero-role className="mt-1">
                <div className="font-display text-[clamp(2.1rem,3.6vw,3.2rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-[#a1a1aa]">
                  Engineer
                </div>
                <div className="-mt-1 font-display text-[clamp(2.1rem,3.6vw,3.2rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-[#f4f4f5]">
                  Developer
                </div>
              </div>

              <p
                data-hero-stagger
                data-hero-summary
                className="mt-4 ml-auto max-w-xs text-sm leading-relaxed text-[#a1a1aa]"
              >
                {DEVELOPER_PROFILE.heroSupporting}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <a
                  data-hero-stagger
                  data-hero-cta
                  href="#projects"
                  onClick={(e) => scrollToSection(e, '#projects')}
                  className="group inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#f4f4f5] transition-colors duration-200 hover:bg-[#f4f4f5] hover:text-[#050407] whitespace-nowrap shrink-0"
                >
                  <span>Explore Work</span>
                  <ArrowDownRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
