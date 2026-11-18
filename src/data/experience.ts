export interface ExperienceEntry {
  id: string;
  stageCode: string;
  company: string;
  location: string;
  period: string;
  roleTitle: string;
  projectFocus: string;
  logoSrc: string;
  logoVariant: 'invert-wordmark' | 'tile-cover' | 'tile-light';
  summary: string;
  technologies: string[];
}

export const EXPERIENCE_PIPELINE: ExperienceEntry[] = [
  {
    id: 'siemens-thesis',
    stageCode: '01',
    company: 'Siemens AG, Digital Industries',
    location: 'Karlsruhe, Germany',
    period: 'Jan 2026 – May 2026',
    roleTitle: 'Master Thesis – Software Engineer',
    projectFocus: 'AI-Powered Digital Shift Logbook – Insights Hub Production Copilot',
    logoSrc: '/assets/aistudio/siemens_03a24791.svg',
    logoVariant: 'invert-wordmark',
    summary:
      'Translated operator, supervisor, and process-engineer requirements into a role-based handover architecture featuring create/retrieve/summarize workflows, task escalation, and validated persistence rules across 50+ manufacturing scenarios.',
    technologies: ['Generative AI', 'Siemens Copilot'],
  },
  {
    id: 'siemens-working-student',
    stageCode: '02',
    company: 'Siemens AG, Digital Industries',
    location: 'Karlsruhe, Germany',
    period: 'May 2025 – Dec 2025',
    roleTitle: 'Working Student Software Developer',
    projectFocus: 'Insights Hub – Enterprise Dataset Manager',
    logoSrc: '/assets/aistudio/siemens_03a24791.svg',
    logoVariant: 'invert-wordmark',
    summary:
      'Delivered Angular filtering, sorting, aggregation, and visualization workflows for industrial datasets backed by REST endpoints, Jasmine/Karma unit tests, WebdriverIO E2E suites, and GitLab CI/CD release monitoring.',
    technologies: ['Angular', 'TypeScript', 'FastAPI', 'GitLab CI/CD'],
  },
  {
    id: 'peer-network',
    stageCode: '03',
    company: 'Peer Network',
    location: 'Berlin, Germany',
    period: 'Mar 2025 – Apr 2025',
    roleTitle: 'Web Developer Intern',
    projectFocus: 'Peer Social Networking Platform',
    logoSrc: '/assets/aistudio/peer_765d618e.jpg',
    logoVariant: 'tile-cover',
    summary:
      'Built responsive Ionic/Angular screens integrated with REST data flows, implementing pagination and lazy loading to minimize unnecessary initial rendering.',
    technologies: ['Ionic', 'Angular', 'TypeScript', 'REST APIs', 'Lazy Loading'],
  },
  {
    id: 'quixy',
    stageCode: '04',
    company: 'Quixy',
    location: 'Hyderabad, India',
    period: 'Sept 2021 – Aug 2024',
    roleTitle: 'Full Stack Engineer',
    projectFocus: 'Enterprise No-Code / Low-Code Platform',
    logoSrc: '/assets/aistudio/quixy_847b554e.png',
    logoVariant: 'tile-light',
    summary:
      'Engineered Angular modules and C#/ASP.NET Core REST APIs with Entity Framework Core and SQL Server for hundreds of client organizations—decoupling services via RabbitMQ, securing endpoints with JWT/OAuth 2.0, and migrating workloads to PostgreSQL/SQL Server.',
    technologies: ['C#', 'ASP.NET Core', 'Angular', 'SQL Server', 'PostgreSQL', 'RabbitMQ', 'JWT / OAuth 2.0'],
  },
];
