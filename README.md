# Sai Charan Vadla — The Developer Lab

An interactive, scroll-driven software engineering portfolio built with React, TypeScript, Vite, Tailwind CSS, GSAP + ScrollTrigger, and Three.js.

## Features

- **Continuous Scroll-Driven Character Story**: An articulated 2.5D SVG developer character that transitions continuously via GSAP `ScrollTrigger` from welcoming/waving mode in the Hero into workstation coding mode in About, plus dedicated interactive states in Skills, Projects, and Contact.
- **Interactive Technology Ecosystem**: Explore Frontend, Backend, Database, Cloud/DevOps, AI, and Tools nodes with live dependency highlighting.
- **Deployment Pipeline Experience**: Career progression designed as an animated software release pipeline.
- **Interactive Project Showcases**: Real-world production, industrial AI, and cloud projects with animated architecture flow diagrams and a full case-study modal.
- **Performance & Accessibility**: Lazy-loaded below-the-fold sections, GPU-friendly transforms, software WebGL fallback detection, keyboard navigation, and full `prefers-reduced-motion` compliance.

## Updating Content

All portfolio data is separated from UI components inside `src/data/`:

- `src/data/profile.ts` — Bio, panels, terminal lines, and contact links
- `src/data/skills.ts` — Technology nodes, descriptions, and ecosystem connections
- `src/data/experience.ts` — Engineering deployment pipeline stages
- `src/data/projects.ts` — Project case studies, architecture flows, and repository/demo links

## Running Locally

```bash
npm install
npm run dev
```
