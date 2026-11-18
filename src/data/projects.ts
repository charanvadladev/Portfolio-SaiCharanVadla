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
  problem: string;
  solution: string;
  technologies: string[];
  keyFeatures: string[];
  architecture: string;
  myContribution: string;
  resultsImpact: string;
  flowType: 'warehouse' | 'ai-vision' | 'shift-logbook' | 'cloud-platform';
  flowSteps: FlowNode[];
  githubUrl: string;
  liveDemoUrl?: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'sri-laxmi-fasteners-wms',
    index: '01',
    name: 'Sri Laxmi Fasteners — Warehouse Management System',
    category: 'Independent Full-Stack Project · Germany / India',
    logoSrc: '/assets/aistudio/logo_457ae3d4.png',
    tagline: 'Inventory, inward/outward stock, bag-level traceability & AI-assisted product identification',
    shortDescription:
      'Designed and built full-stack warehouse-management workflows covering stock inward/outward, quantity and production-date tracking, bag-level traceability, Excel bulk operations, and AI-assisted fastener attribute identification.',
    problem:
      'High-SKU industrial fastener warehouses rely heavily on fragmented spreadsheets and manual bag inspection, creating audit gaps across inward receipts, bag dispatches, and fastener grade/size verification.',
    solution:
      'Engineered an ASP.NET Core Web API and React + TypeScript application backed by MongoDB with reusable inventory workflows, Excel bulk inward import/export, and AI-assisted visual attribute extraction returning structured DTOs.',
    technologies: [
      'ASP.NET Core Web API',
      'React',
      'TypeScript',
      'MongoDB',
      'Excel Import/Export',
      'AI Vision DTOs',
      'Docker / CI/CD',
    ],
    keyFeatures: [
      'Stock inward/outward workflows with quantity tracking, production/inward dates, and role-based access',
      'Bag-level traceability with automated bag generation and planned QR/barcode outward scanning',
      'Excel bulk stock-inward import and reporting export pipelines',
      'AI-assisted fastener image identification returning structured type, size, length, finish, and grade DTOs',
      'Planned production hardening with Docker, Kubernetes, automated backup/restore, Android scanning, and Tally ERP read integration',
    ],
    architecture:
      'React + TypeScript SPA communicates over authenticated REST APIs to an ASP.NET Core Web API layered around reusable inventory workflows, MongoDB storage, Excel batch processors, and an AI attribute-identification DTO pipeline.',
    myContribution:
      'Architected the warehouse domain workflows, implemented the ASP.NET Core Web API and React TypeScript client, integrated MongoDB persistence and Excel bulk import/export, and designed the AI product identification DTO pipeline and Docker/Kubernetes hardening roadmap.',
    resultsImpact:
      'Unified bag-level stock traceability, bulk spreadsheet ingestion, and structured fastener identification inside one auditable full-stack warehouse platform.',
    flowType: 'warehouse',
    flowSteps: [
      { id: 'product', label: 'Product & AI', sublabel: 'Type / Size / Grade' },
      { id: 'inventory', label: 'Inventory', sublabel: 'Inward / Outward' },
      { id: 'database', label: 'Database', sublabel: 'MongoDB Ledger' },
      { id: 'api', label: 'API', sublabel: 'ASP.NET Core' },
      { id: 'frontend', label: 'Frontend', sublabel: 'React + TS' },
      { id: 'user', label: 'Operator', sublabel: 'Bag & Excel Ops' },
    ],
    githubUrl: 'https://github.com/charanvadladev',
  },
  {
    id: 'ai-industrial-product-id',
    index: '02',
    name: 'AI-Powered Industrial Product Identification',
    category: 'Computer Vision & Structured AI Pipeline',
    tagline: 'Automated visual inspection and JSON attribute extraction for industrial fasteners',
    shortDescription:
      'An intelligent inspection application that analyzes uploaded photographs of industrial fasteners and extracts structured product attributes for downstream systems.',
    problem:
      'Identifying mixed or unlabeled industrial fasteners manually requires specialized domain knowledge and slows down warehouse receiving, sorting, and catalog matching.',
    solution:
      'Engineered an image-to-data inference pipeline that processes uploaded fastener images through computer vision and ML models, returning validated structured JSON specifications directly into the web application.',
    technologies: [
      'Computer Vision',
      'Python / ML',
      'FastAPI',
      'Structured JSON',
      'React',
      'ASP.NET Core',
    ],
    keyFeatures: [
      'Drag-and-drop image ingestion with client-side validation and preview',
      'Automated visual feature extraction and fastener attribute classification',
      'Schema-validated structured JSON response ready for inventory matching',
      'Seamless API bridge between Python ML inference and ASP.NET Core services',
    ],
    architecture:
      'React upload interface submits fastener imagery to an API gateway which routes payloads to a Python/FastAPI computer vision pipeline, returning structured JSON metadata rendered cleanly for operator verification.',
    myContribution:
      'Architected the end-to-end integration between the frontend upload experience, API orchestration layer, and computer vision inference endpoint with strict JSON schema validation.',
    resultsImpact:
      'Demonstrated how visual inspection workflows can translate raw shop-floor images into machine-readable product records ready for inventory search and categorization.',
    flowType: 'ai-vision',
    flowSteps: [
      { id: 'image', label: 'Image', sublabel: 'Fastener Photo' },
      { id: 'ai-model', label: 'AI Model', sublabel: 'Vision Inference' },
      { id: 'analysis', label: 'Analysis', sublabel: 'Feature Extraction' },
      { id: 'structured-result', label: 'Structured Result', sublabel: 'JSON Schema' },
      { id: 'application', label: 'Application', sublabel: 'Operator UI' },
    ],
    githubUrl: 'https://github.com/charanvadladev',
  },
  {
    id: 'digital-shift-logbook-ai',
    index: '03',
    name: 'Digital Shift Logbook — AI-Assisted Manufacturing',
    category: 'Master Thesis & Industrial AI Workflow',
    tagline: 'Intelligent shift handover, structured operational logging & production insights',
    shortDescription:
      'An AI-enabled industrial software project uniting structured digital shift workflows with intelligent assistant capabilities for manufacturing teams.',
    problem:
      'Manufacturing shift handovers frequently suffer from fragmented notes, inconsistent incident formatting, and difficulty surfacing recurring machine or process patterns across shifts.',
    solution:
      'Designed a digital shift logbook system where operators record events in a streamlined workflow augmented by an AI assistant that structures entries, summarizes handovers, and surfaces production insights.',
    technologies: [
      'Generative AI',
      'LLM APIs',
      'TypeScript',
      'React',
      'ASP.NET Core',
      'PostgreSQL',
    ],
    keyFeatures: [
      'Guided digital shift entry and handover workflow built for shop-floor clarity',
      'Context-aware AI assistant for summarizing shift logs and flagging recurring issues',
      'Structured production event persistence in PostgreSQL for historical traceability',
      'Insight generation turning free-text operator notes into actionable shift summaries',
    ],
    architecture:
      'Operator web client captures shift events into a structured backend repository; an AI orchestration service enriches logs via LLM APIs with schema constraints before storing searchable production insights.',
    myContribution:
      'Conducted requirement analysis, designed the digital workflow UX and relational schema, and implemented the AI assistant integration bridging natural-language logs with structured manufacturing insights.',
    resultsImpact:
      'Established a cohesive blueprint for combining human-in-the-loop manufacturing workflows with reliable LLM assistance without sacrificing operational auditability.',
    flowType: 'shift-logbook',
    flowSteps: [
      { id: 'operator', label: 'Operator', sublabel: 'Shift Entry' },
      { id: 'workflow', label: 'Digital Workflow', sublabel: 'Structured Form' },
      { id: 'ai-assistant', label: 'AI Assistant', sublabel: 'LLM Synthesis' },
      { id: 'prod-data', label: 'Production Data', sublabel: 'PostgreSQL Store' },
      { id: 'insights', label: 'Insights', sublabel: 'Handover Clarity' },
    ],
    githubUrl: 'https://github.com/charanvadladev',
  },
  {
    id: 'cloud-microservices-pipeline',
    index: '04',
    name: 'Event-Driven Cloud Microservices Blueprint',
    category: 'Cloud Architecture · DevOps & Messaging',
    tagline: 'Containerized distributed services with RabbitMQ, Terraform & automated CI/CD',
    shortDescription:
      'A modular distributed backend architecture demonstrating asynchronous message brokering, containerized deployment, and declarative cloud infrastructure.',
    problem:
      'Tightly coupled monolithic endpoints create deployment bottlenecks and cascading failures when background processing workloads spike.',
    solution:
      'Implemented decoupled .NET microservices communicating asynchronously via RabbitMQ queues, backed by PostgreSQL, packaged with Docker, and provisioned on cloud infrastructure using Terraform and GitHub Actions.',
    technologies: [
      'C#',
      '.NET / ASP.NET Core',
      'RabbitMQ',
      'PostgreSQL',
      'Docker',
      'Kubernetes',
      'Terraform',
      'Azure / AWS',
    ],
    keyFeatures: [
      'Asynchronous event-driven messaging via RabbitMQ for resilient task processing',
      'Multi-stage Docker containers orchestrated for predictable environment parity',
      'Declarative infrastructure definitions using Terraform',
      'Automated build, test, and deployment checks in GitHub Actions',
    ],
    architecture:
      'Client applications communicate with an API gateway that publishes domain events into RabbitMQ exchanges, consumed by isolated worker services persisting state in PostgreSQL inside containerized cloud nodes.',
    myContribution:
      'Designed the service boundaries, RabbitMQ messaging contracts, Dockerfiles, Terraform modules, and CI/CD automation scripts.',
    resultsImpact:
      'Provides a repeatable, production-aligned foundation for resilient distributed applications with clean separation of concerns.',
    flowType: 'cloud-platform',
    flowSteps: [
      { id: 'frontend', label: 'Frontend', sublabel: 'Client App' },
      { id: 'api', label: 'API', sublabel: '.NET Gateway' },
      { id: 'container', label: 'Container', sublabel: 'Docker & Queue' },
      { id: 'cloud', label: 'Cloud', sublabel: 'K8s & Terraform' },
      { id: 'database', label: 'Database', sublabel: 'PostgreSQL' },
    ],
    githubUrl: 'https://github.com/charanvadladev',
  },
];
