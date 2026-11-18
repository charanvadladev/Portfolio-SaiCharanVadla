import React, { useEffect, useState } from 'react';
import { Download, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#projects' },
  { label: 'Techstack', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

const RESUME_PDF_URL = '/assets/aistudio/Sai_Charan_Vadla_Resume_00dd917c.pdf';

export const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-[#050407]/92 py-4'
          : 'border-b border-transparent bg-transparent py-6'
      }`}
    >
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-8 px-6 lg:px-12">
        {/* Zone 1: Clean Single-Line Wordmark */}
        <a
          href="#hero"
          onClick={(e) => handleLinkClick(e, '#hero')}
          className="font-display text-lg font-semibold tracking-tight text-[#f4f4f5] whitespace-nowrap shrink-0"
        >
          sai.charan
        </a>

        {/* Zone 2: Clean Single-Line Primary Nav Links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              className="link-underline text-xs font-semibold uppercase tracking-[0.14em] text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors whitespace-nowrap shrink-0"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Subtle Secondary Resume Download Action + Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={RESUME_PDF_URL}
            download="Sai_Charan_Vadla_Resume.pdf"
            className="hidden md:inline-flex min-h-[38px] items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-medium tracking-wide text-[#e4e4e7] transition-colors duration-200 hover:border-white/35 hover:bg-white/10 hover:text-white whitespace-nowrap shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Resume</span>
          </a>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#0b0b0f] text-[#f4f4f5] md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out border-b border-white/10 bg-[#050407]/96 ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 border-b-0'
        }`}
      >
        <nav aria-label="Mobile Navigation" className="flex flex-col gap-1 px-6 py-4">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              className="flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium text-[#cbd5e1] hover:bg-white/5 hover:text-[#f3f6fa] transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a
            href={RESUME_PDF_URL}
            download="Sai_Charan_Vadla_Resume.pdf"
            onClick={() => setMobileOpen(false)}
            className="mt-2 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium text-[#f4f4f5] transition-colors hover:border-white/35 hover:bg-white/10"
          >
            <Download className="h-4 w-4" />
            <span>Download Resume</span>
          </a>
        </nav>
      </div>
    </header>
  );
};
