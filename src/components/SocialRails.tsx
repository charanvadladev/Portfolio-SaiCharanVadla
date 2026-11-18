import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { DEVELOPER_PROFILE } from '../data/profile';

export const SocialRails: React.FC = () => {
  return (
    <>
      {/* Left Fixed Social Rail (Desktop xl+) */}
      <aside
        aria-label="Social Links"
        className="fixed bottom-0 left-7 z-30 hidden xl:flex flex-col items-center gap-5"
      >
        <a
          href={DEVELOPER_PROFILE.contact.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
          className="text-[#a1a1aa] transition-transform duration-200 hover:-translate-y-0.5 hover:text-white"
        >
          <Github className="h-4 w-4" />
        </a>
        <a
          href={DEVELOPER_PROFILE.contact.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
          className="text-[#a1a1aa] transition-transform duration-200 hover:-translate-y-0.5 hover:text-white"
        >
          <Linkedin className="h-4 w-4" />
        </a>
        <a
          href={`mailto:${DEVELOPER_PROFILE.contact.email}`}
          aria-label="Email Sai Charan Vadla"
          className="text-[#a1a1aa] transition-transform duration-200 hover:-translate-y-0.5 hover:text-white"
        >
          <Mail className="h-4 w-4" />
        </a>
        <span aria-hidden="true" className="h-20 w-px bg-white/15" />
      </aside>

      {/* Right Fixed Email Rail (Desktop xl+) */}
      <aside
        aria-label="Direct Email Rail"
        className="fixed bottom-0 right-7 z-30 hidden xl:flex flex-col items-center gap-5"
      >
        <a
          href={`mailto:${DEVELOPER_PROFILE.contact.email}`}
          className="font-mono-tech text-[11px] tracking-[0.16em] text-[#a1a1aa] transition-colors hover:text-white"
          style={{ writingMode: 'vertical-rl' }}
        >
          {DEVELOPER_PROFILE.contact.email}
        </a>
        <span aria-hidden="true" className="h-20 w-px bg-white/15" />
      </aside>
    </>
  );
};
