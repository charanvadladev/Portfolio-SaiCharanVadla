export interface FlowNode {
  id: string;
  label: string;
  sublabel: string;
}

export interface ProjectItem {
  id: string;
  index: string;
  name: string;
  category: string;
  logoSrc?: string;
  tagline: string;
  shortDescription: string;
  technologies: string[];
  flowSteps: FlowNode[];
  githubUrl: string;
  applicationUrl: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'sri-laxmi-fasteners-wms',
    index: '01',
    name: 'Sri Laxmi Fasteners — Warehouse Management System',
    category: 'Independent Full-Stack Project · Germany / India',
    logoSrc: '/assets/aistudio/logo_457ae3d4.png',
    tagline:
      'Inventory, inward/outward stock, bag-level traceability & AI-assisted product identification',
    shortDescription:
      'Full-stack warehouse management platform covering stock inward/outward, quantity and production-date tracking, bag-level traceability, Excel bulk operations, and AI-assisted fastener attribute identification.',
    technologies: [
      'ASP.NET Core Web API',
      'React',
      'TypeScript',
      'MongoDB',
      'Excel Import/Export',
      'AI Vision DTOs',
      'Docker / CI/CD',
    ],
    flowSteps: [
      { id: 'product', label: 'Product & AI', sublabel: 'Type / Size / Grade' },
      { id: 'inventory', label: 'Inventory', sublabel: 'Inward / Outward' },
      { id: 'database', label: 'Database', sublabel: 'MongoDB Ledger' },
      { id: 'api', label: 'API', sublabel: 'ASP.NET Core' },
      { id: 'frontend', label: 'Frontend', sublabel: 'React + TS' },
      { id: 'user', label: 'Operator', sublabel: 'Bag & Excel Ops' },
    ],
    githubUrl: 'https://github.com/charanvadladev',
    applicationUrl: 'https://www.srilaxmifasteners.com/',
  },
];
