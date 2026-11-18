import React, { useRef, useState } from 'react';
import { Mail, Linkedin, Github, ArrowUpRight, Copy, Check, Send } from 'lucide-react';
import { DEVELOPER_PROFILE } from '../data/profile';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { revealSectionElements } from '../animations/scrollAnimations';

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderMessage, setSenderMessage] = useState('');
  const [draftOpened, setDraftOpened] = useState(false);

  useScrollAnimation(
    sectionRef,
    () => {
      if (sectionRef.current) {
        revealSectionElements(sectionRef.current, '[data-contact-reveal]', reducedMotion);
      }
    },
    [reducedMotion],
  );

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(DEVELOPER_PROFILE.contact.email);
    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 1800);
  };

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      senderName ? `Engineering Inquiry from ${senderName}` : 'Engineering Inquiry',
    );
    const body = encodeURIComponent(senderMessage || 'Hi Sai Charan,\n\n');
    window.location.href = `mailto:${DEVELOPER_PROFILE.contact.email}?subject=${subject}&body=${body}`;
    setDraftOpened(true);
    window.setTimeout(() => setDraftOpened(false), 3000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="relative border-t border-white/10 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left: Oversized MoncyDev Editorial Contact Heading & Channels */}
          <div className="lg:col-span-5">
            <div
              data-contact-reveal
              className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#a78bfa]"
            >
              06. Get In Touch
            </div>

            <h2
              id="contact-heading"
              data-contact-reveal
              className="mt-3 font-display text-4xl font-bold tracking-tight text-[#f3f6fa] sm:text-5xl lg:text-6xl"
            >
              {DEVELOPER_PROFILE.contact.heading}
            </h2>

            <p
              data-contact-reveal
              className="mt-4 max-w-md text-base leading-relaxed text-[#94a3b8] sm:text-lg"
            >
              {DEVELOPER_PROFILE.contact.supporting}
            </p>

            <div data-contact-reveal className="mt-8 space-y-3.5">
              <div className="rounded-xl border border-white/10 bg-[#0d1118] p-4 transition-colors hover:border-[#38bdf8]/45">
                <div className="flex items-center justify-between text-xs font-mono-tech text-[#64748b]">
                  <span>Email</span>
                  <Mail className="h-3.5 w-3.5 text-[#38bdf8]" />
                </div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <a
                    href={`mailto:${DEVELOPER_PROFILE.contact.email}`}
                    className="truncate text-sm font-medium text-[#f3f6fa] hover:text-[#38bdf8] transition-colors"
                  >
                    {DEVELOPER_PROFILE.contact.email}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex shrink-0 items-center gap-1.5 text-xs font-mono-tech text-[#94a3b8] hover:text-[#f3f6fa] transition-colors"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#34d399]" />
                        <span className="text-[#34d399]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <a
                  href={DEVELOPER_PROFILE.contact.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-white/10 bg-[#0d1118] p-4 transition-colors hover:border-[#38bdf8]/45"
                >
                  <div className="flex items-center justify-between text-xs font-mono-tech text-[#64748b]">
                    <span>LinkedIn</span>
                    <Linkedin className="h-3.5 w-3.5 text-[#38bdf8]" />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm font-medium text-[#f3f6fa]">
                    <span>Profile</span>
                    <ArrowUpRight className="h-4 w-4 text-[#94a3b8] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#38bdf8]" />
                  </div>
                  <div className="mt-1 text-xs font-mono-tech text-[#64748b]">
                    Placeholder URL
                  </div>
                </a>

                <a
                  href={DEVELOPER_PROFILE.contact.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-white/10 bg-[#0d1118] p-4 transition-colors hover:border-[#38bdf8]/45"
                >
                  <div className="flex items-center justify-between text-xs font-mono-tech text-[#64748b]">
                    <span>GitHub</span>
                    <Github className="h-3.5 w-3.5 text-[#38bdf8]" />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm font-medium text-[#f3f6fa]">
                    <span>Repositories</span>
                    <ArrowUpRight className="h-4 w-4 text-[#94a3b8] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#38bdf8]" />
                  </div>
                  <div className="mt-1 text-xs font-mono-tech text-[#64748b]">
                    Placeholder URL
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Direct Email Draft Composer */}
          <div data-contact-reveal className="lg:col-span-7">
            <form
              onSubmit={handleComposeSubmit}
              className="rounded-2xl border border-white/10 bg-[#0d1118]/90 p-6 sm:p-8"
            >
              <div className="flex items-center justify-between text-xs font-mono-tech text-[#94a3b8]">
                <span>Direct Message</span>
                <span className="text-[#38bdf8]">{DEVELOPER_PROFILE.location} · CET</span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-mono-tech text-[#94a3b8]"
                  >
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Recruiter, Engineering Manager, or Founder"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#07090d] px-4 py-3 text-sm text-[#f3f6fa] placeholder-[#64748b] focus:border-[#38bdf8] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-mono-tech text-[#94a3b8]"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={senderMessage}
                    onChange={(e) => setSenderMessage(e.target.value)}
                    placeholder="Share details about your team, engineering role, or project..."
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#07090d] px-4 py-3 text-sm text-[#f3f6fa] placeholder-[#64748b] focus:border-[#38bdf8] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-[#64748b]">
                  {draftOpened
                    ? 'Email client draft opened.'
                    : 'Opens directly in your default mail client.'}
                </span>
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#38bdf8] px-6 py-2.5 text-sm font-semibold text-[#07090d] hover:bg-[#7dd3fc] transition-colors whitespace-nowrap shrink-0"
                >
                  <Send className="h-4 w-4" />
                  <span>Open Email Draft</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
