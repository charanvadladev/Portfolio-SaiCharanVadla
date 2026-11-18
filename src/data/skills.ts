export type SkillCategory =
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'Cloud / DevOps'
  | 'AI'
  | 'Tools';

export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  connections: string[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  'Frontend',
  'Backend',
  'Database',
  'Cloud / DevOps',
  'AI',
  'Tools',
];

export const SKILLS_DATA: SkillNode[] = [
  // FRONTEND
  {
    id: 'react',
    name: 'React',
    category: 'Frontend',
    description:
      'Component-driven SPAs with hooks, state isolation, and fluid motion orchestration.',
    connections: ['typescript', 'javascript', 'css', 'rest-apis', 'docker'],
  },
  {
    id: 'angular',
    name: 'Angular',
    category: 'Frontend',
    description:
      'Enterprise web applications with modular architecture, RxJS streams, and strict typing.',
    connections: ['typescript', 'html', 'css', 'dotnet', 'rest-apis'],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Frontend',
    description:
      'End-to-end type safety across UI state, API contracts, and build tooling.',
    connections: ['react', 'angular', 'javascript', 'rest-apis'],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Frontend',
    description:
      'Modern ESNext asynchronous patterns, DOM optimization, and browser APIs.',
    connections: ['react', 'typescript', 'html', 'css'],
  },
  {
    id: 'html',
    name: 'HTML',
    category: 'Frontend',
    description:
      'Semantic document structure, WCAG accessibility landmarks, and SEO metadata.',
    connections: ['css', 'angular', 'react', 'javascript'],
  },
  {
    id: 'css',
    name: 'CSS',
    category: 'Frontend',
    description:
      'Responsive grid/flex layouts, custom properties, and GPU-composited animations.',
    connections: ['html', 'react', 'angular', 'javascript'],
  },

  // BACKEND
  {
    id: 'dotnet',
    name: '.NET / ASP.NET Core',
    category: 'Backend',
    description:
      'High-throughput REST services, clean architecture, auth middleware, and EF Core.',
    connections: ['csharp', 'rest-apis', 'microservices', 'postgresql', 'mongodb', 'azure', 'docker'],
  },
  {
    id: 'csharp',
    name: 'C#',
    category: 'Backend',
    description:
      'Strongly typed object-oriented & async service engineering across enterprise systems.',
    connections: ['dotnet', 'microservices', 'postgresql', 'rabbitmq'],
  },
  {
    id: 'java',
    name: 'Java',
    category: 'Backend',
    description:
      'Structured backend systems, OOP design patterns, and cross-service data processing.',
    connections: ['rest-apis', 'microservices', 'mysql', 'postgresql'],
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'Backend',
    description:
      'Lightweight Python APIs serving ML inference, computer vision, and structured JSON pipelines.',
    connections: ['rest-apis', 'computer-vision', 'llm-apis', 'docker'],
  },
  {
    id: 'rest-apis',
    name: 'REST APIs',
    category: 'Backend',
    description:
      'Versioned resource contracts, OpenAPI schemas, validation, and resilient error handling.',
    connections: ['dotnet', 'fastapi', 'react', 'angular', 'typescript'],
  },
  {
    id: 'microservices',
    name: 'Microservices',
    category: 'Backend',
    description:
      'Decoupled service boundaries communicating over HTTP and asynchronous message queues.',
    connections: ['dotnet', 'rabbitmq', 'docker', 'kubernetes', 'postgresql'],
  },

  // DATABASE
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'Database',
    description:
      'Relational data modeling, indexed queries, transactional integrity, and schema migrations.',
    connections: ['dotnet', 'csharp', 'microservices', 'docker', 'azure'],
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'Database',
    description:
      'Flexible document storage for inventory records, operational logs, and high-velocity payloads.',
    connections: ['dotnet', 'react', 'docker', 'rest-apis'],
  },
  {
    id: 'mysql',
    name: 'MySQL',
    category: 'Database',
    description:
      'Reliable relational persistence for structured business workflows and reporting.',
    connections: ['java', 'dotnet', 'rest-apis'],
  },

  // CLOUD / DEVOPS
  {
    id: 'azure',
    name: 'Azure',
    category: 'Cloud / DevOps',
    description:
      'Cloud application hosting, container services, managed databases, and identity integration.',
    connections: ['dotnet', 'docker', 'kubernetes', 'terraform', 'cicd'],
  },
  {
    id: 'aws',
    name: 'AWS',
    category: 'Cloud / DevOps',
    description:
      'Scalable compute, object storage, and containerized cloud deployments.',
    connections: ['docker', 'kubernetes', 'terraform', 'linux', 'cicd'],
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'Cloud / DevOps',
    description:
      'Reproducible multi-stage container builds for frontend, API, and AI worker services.',
    connections: ['kubernetes', 'github-actions', 'dotnet', 'fastapi', 'linux'],
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    category: 'Cloud / DevOps',
    description:
      'Container orchestration, declarative scaling, health probes, and rolling deployments.',
    connections: ['docker', 'terraform', 'azure', 'aws', 'microservices'],
  },
  {
    id: 'terraform',
    name: 'Terraform',
    category: 'Cloud / DevOps',
    description:
      'Infrastructure-as-code provisioning for repeatable cloud environments.',
    connections: ['azure', 'aws', 'kubernetes', 'cicd'],
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    category: 'Cloud / DevOps',
    description:
      'Automated test suites, container image publishing, and zero-downtime deployment workflows.',
    connections: ['cicd', 'git', 'github', 'docker'],
  },
  {
    id: 'cicd',
    name: 'CI/CD',
    category: 'Cloud / DevOps',
    description:
      'Continuous integration and automated release pipelines from commit to production.',
    connections: ['github-actions', 'docker', 'terraform', 'azure', 'aws'],
  },

  // AI
  {
    id: 'generative-ai',
    name: 'Generative AI',
    category: 'AI',
    description:
      'Integrating foundation models into domain workflows with structured validation and guardrails.',
    connections: ['llm-apis', 'ai-integration', 'ai-apps', 'fastapi'],
  },
  {
    id: 'llm-apis',
    name: 'LLM APIs',
    category: 'AI',
    description:
      'Prompt orchestration, schema-constrained JSON extraction, and context-grounded reasoning.',
    connections: ['generative-ai', 'ai-integration', 'fastapi', 'typescript'],
  },
  {
    id: 'ai-integration',
    name: 'AI Integration',
    category: 'AI',
    description:
      'Connecting inference pipelines cleanly into production web applications and operational tools.',
    connections: ['generative-ai', 'llm-apis', 'computer-vision', 'dotnet', 'react'],
  },
  {
    id: 'computer-vision',
    name: 'Computer Vision',
    category: 'AI',
    description:
      'Automated image analysis and visual classification for industrial fastener identification.',
    connections: ['fastapi', 'ai-integration', 'ai-apps'],
  },
  {
    id: 'ai-apps',
    name: 'AI-Powered Applications',
    category: 'AI',
    description:
      'End-to-end intelligent systems combining operator-friendly UIs with reliable ML backends.',
    connections: ['generative-ai', 'computer-vision', 'react', 'dotnet'],
  },

  // TOOLS
  {
    id: 'git',
    name: 'Git',
    category: 'Tools',
    description:
      'Branching strategies, clean commit history, and collaborative code review workflows.',
    connections: ['github', 'github-actions', 'linux'],
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Tools',
    description:
      'Repository governance, pull request automation, and integrated CI workflows.',
    connections: ['git', 'github-actions', 'cicd'],
  },
  {
    id: 'rabbitmq',
    name: 'RabbitMQ',
    category: 'Tools',
    description:
      'Reliable asynchronous event brokering between decoupled backend microservices.',
    connections: ['microservices', 'dotnet', 'csharp', 'docker'],
  },
  {
    id: 'linux',
    name: 'Linux',
    category: 'Tools',
    description:
      'Server administration, shell scripting, container host debugging, and process tooling.',
    connections: ['docker', 'aws', 'git', 'cicd'],
  },
];
