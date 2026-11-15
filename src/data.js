// ===== EDIT YOUR CONTENT HERE =====
export const DATA = {
  name: 'Amal Johnson',
  role: 'Full Stack Developer',
  tagline: 'MERN stack developer from Kerala, building efficient, scalable web apps.',
  about:
    'I’m a full stack developer from Wayanad, Kerala, trained in the MERN stack with a BCA from Bengaluru City University. I enjoy connecting frontend and backend into apps that are fast and easy to use, and I’m looking for a Full Stack Developer role where I can keep learning and contribute to real projects.',
  // used for the text on the 3D monitor and laptop screens
  projects: [
    { title: 'Service Management System', desc: 'Responsive MERN app for booking and tracking repair and service requests, with role-based access for users, technicians and admins, and JWT login.', stack: ['MongoDB', 'Express', 'React', 'Node.js'], link: 'https://fixifyprvtltd.vercel.app/' },
    { title: 'Public Complaint Portal', desc: 'Self-initiated complaint management system where users submit complaints, track status updates and get responses from admins, with role-based authentication.', stack: ['Full stack', 'Role-based auth', 'Vercel'], link: 'https://complaintportal-mu.vercel.app/' },
    { title: 'More on GitHub', desc: 'Other projects and experiments live on my GitHub profile.', stack: ['GitHub'], link: 'https://github.com/amaljohnzn' },
  ],
  skills: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Tailwind CSS', 'DaisyUI', 'MongoDB', 'Express.js', 'Node.js', 'Git', 'Postman', 'Figma', 'Vercel', 'AWS basics'],
  contact: [
    { label: 'Email', href: 'mailto:amaljnzn@gmail.com', text: 'amaljnzn@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/amaljohnzn', text: 'github.com/amaljohnzn' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/amaljonzn', text: 'linkedin.com/in/amaljonzn' },
  ],
};

export const EMAIL = 'amaljnzn@gmail.com';
export const ROLES = ['Full Stack Developer', 'MERN Developer', 'UI Builder'];

export const EXPERIENCE = [
  {
    title: 'IT Support',
    meta: 'Embark Edu Solutions · June 2025 – Aug 2026',
    points: [
      'Provided technical support for hardware, software, network and system-related issues, keeping day-to-day IT operations smooth.',
      'Assisted users with troubleshooting, software installation and system maintenance.',
    ],
  },
];

// Fallback project cards (used when the API is not reachable). `shot` picks the preview image.
export const PROJECT_CARDS = [
  {
    title: 'Service Management System',
    desc: 'Responsive MERN app for booking and tracking repair and service requests, with role-based access for users, technicians and admins, and secure JWT login.',
    stack: ['MongoDB', 'Express', 'React', 'Node.js', 'JWT'],
    live: 'https://fixifyprvtltd.vercel.app/',
    repo: 'https://github.com/amaljohnzn',
    shot: 'service',
  },
  {
    title: 'Public Complaint Portal',
    desc: 'Self-initiated complaint management system where users submit complaints, track status updates and receive responses from administrators, with role-based authentication.',
    stack: ['Full stack', 'Role-based auth', 'Vercel'],
    live: 'https://complaintportal-mu.vercel.app/',
    repo: 'https://github.com/amaljohnzn',
    shot: 'complaint',
  },
];

export const EDUCATION = [
  { title: 'Full Stack Development', meta: 'Entri Software Limited · Kochi · 2025' },
  { title: 'Bachelor of Computer Application', meta: 'Bengaluru City University · Bengaluru · 2024' },
  { title: 'Diploma in Cooperative Accounting & Taxation', meta: 'Pass Cooperative Training · Calicut · 2020' },
];

export const CERTS = [
  { title: 'Full Stack Web Development (MERN)', meta: 'Illinois Institute of Technology, US & Entri · 2025', text: 'Built full stack apps with MongoDB, Express.js, React.js and Node.js, through to deployment.' },
  { title: 'Cloud Computing', meta: 'SB College of Management Studies · 2023', text: 'Cloud services, virtualization, scalability, and basic AWS and Azure concepts.' },
  { title: 'ChatGPT Essentials', meta: 'Entri · 2025', text: 'Effective prompting, content generation and AI-assisted workflows.' },
  { title: 'Microsoft Excel', meta: 'Entri · 2025', text: 'Formulas, functions, data entry, organization and analysis.' },
  { title: 'SAP – FICO & MM', meta: 'Pass Corporate Training · 2021', text: 'Financial accounting, controlling, procurement and inventory basics.' },
  { title: 'Tally', meta: 'C-apt Multimedia Academy · 2019', text: 'Bookkeeping, voucher entry, ledgers and invoicing.' },
];

export const SKILL_GROUPS = [
  ['Frontend', ['HTML', 'CSS', 'JavaScript', 'React.js', 'Tailwind CSS', 'DaisyUI']],
  ['Backend & database', ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'JWT auth']],
  ['Cloud & deployment', ['AWS', 'Google Cloud', 'Microsoft Azure', 'Vercel', 'Netlify', 'Render']],
  ['Tools & design', ['Git', 'Postman', 'VS Code', 'Figma', 'Canva', 'Slack', 'OpenAI', 'MS Office']],
  ['Strengths', ['UI/UX design', 'Testing & debugging', 'Collaboration', 'Problem-solving']],
];
