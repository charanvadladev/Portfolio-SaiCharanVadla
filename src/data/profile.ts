export interface ProfilePanel {
  label: string;
  value: string;
  detail: string;
}

export const DEVELOPER_PROFILE = {
  brandWordmark: 'Sai Charan',
  fullName: 'Sai Charan Vadla',
  role: 'Full Stack Software Engineer',
  location: 'Germany',
  experienceYears: '4+ years hands-on software development',
  education: 'M.Sc. Software Engineering — University of Europe for Applied Sciences',
  focus: ['Web Applications', 'Cloud', 'AI', 'Distributed Systems'],
  heroHeadline: "Hi, I'm Sai Charan.",
  heroSupporting:
    'I build scalable web applications, cloud systems, and intelligent software experiences.',
  heroMetadata: ['Software Engineer', 'Full Stack', 'Cloud', 'AI'],
  aboutIntro:
    'I am a Full Stack Software Engineer based in Germany with 4+ years of hands-on experience building enterprise SaaS, industrial, and business applications. My work bridges resilient backend services in C# and ASP.NET Core, modern TypeScript interfaces in React and Angular, automated cloud infrastructure, and practical AI integrations.',
  educationHistory: [
    {
      degree: 'M.Sc. Software Engineering',
      institution: 'University of Europe for Applied Sciences, Germany',
      period: 'Sept 2024 – Jul 2026',
      focus:
        'Software architecture, cloud systems, data engineering, and applied AI for industrial operations.',
    },
    {
      degree: 'B.Tech. Computer Science',
      institution: 'Anurag Group of Institutions, Hyderabad, India',
      period: 'Jun 2016 – Jul 2021',
      focus: 'Core computer science, algorithms, databases, and software engineering fundamentals.',
    },
  ],
  panels: [
    {
      label: 'Role',
      value: 'Full Stack Software Engineer',
      detail: 'End-to-end delivery from UI architecture to cloud runtime',
    },
    {
      label: 'Location',
      value: 'Germany',
      detail: 'Open to software engineering & cloud architecture roles',
    },
    {
      label: 'Experience',
      value: '4+ Years',
      detail: 'Enterprise SaaS, industrial software & distributed systems',
    },
    {
      label: 'Education',
      value: 'M.Sc. Software Engineering',
      detail: 'University of Europe for Applied Sciences, Germany',
    },
    {
      label: 'Primary Focus',
      value: 'Web · Cloud · AI · Distributed Systems',
      detail: 'Clean architecture, CI/CD automation, and applied machine learning',
    },
  ] as ProfilePanel[],
  terminalBootLines: [
    '> initializing portfolio...',
    '> loading projects...',
    '> connecting to developer...',
    '> system ready.',
  ],
  developerObjectCode: `const developer = {
  name: "Sai Charan Vadla",
  role: "Full Stack Engineer",
  location: "Germany",
  focus: ["Web", "Cloud", "AI"]
};`,
  contact: {
    heading: "Let's Build Something.",
    supporting:
      'Have an interesting product, engineering challenge, or opportunity? Let us talk.',
    email: 'saicharanvadla1@gmail.com',
    githubUrl: 'https://github.com/charanvadladev',
    linkedinUrl: 'https://www.linkedin.com/in/charan-vadla/',
  },
};
