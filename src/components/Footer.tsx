import React from 'react';
import { DEVELOPER_PROFILE } from '../data/profile';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#07090d] py-10">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between lg:px-12">
        <div>
          <div className="font-display text-base font-semibold text-[#f3f6fa]">
            {DEVELOPER_PROFILE.fullName}
          </div>
          <div className="mt-1 text-xs font-mono-tech text-[#94a3b8]">
            {DEVELOPER_PROFILE.role} · {DEVELOPER_PROFILE.location}
          </div>
        </div>

        <nav aria-label="Footer Links" className="flex items-center gap-6 text-sm text-[#94a3b8]">
          <a
            href={DEVELOPER_PROFILE.contact.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline hover:text-[#f3f6fa] transition-colors"
          >
            GitHub
          </a>
          <a
            href={DEVELOPER_PROFILE.contact.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline hover:text-[#f3f6fa] transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${DEVELOPER_PROFILE.contact.email}`}
            className="link-underline hover:text-[#f3f6fa] transition-colors"
          >
            Email
          </a>
        </nav>

        <div className="text-xs font-mono-tech text-[#64748b] tabular-nums">
          &copy; {currentYear} {DEVELOPER_PROFILE.fullName}
        </div>
      </div>
    </footer>
  );
};
