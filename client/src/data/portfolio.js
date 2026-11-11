/* ------------------------------------------------------------------
   ALL EDITABLE PORTFOLIO CONTENT LIVES IN THIS FILE.
   Change text, links, projects, and skills here. No component edits needed.
------------------------------------------------------------------- */

export const profile = {
  fullName: 'G Bharadwaz Naga Venkata Ramana',
  displayName: 'Bharadwaz Naga Venkata Ramana',
  shortName: 'Bharadwaz',
  monogram: 'GB',
  tagline: 'CSE Student & Developer',
  roles: ['CSE Student', 'Full Stack Developer', 'ML Enthusiast'],
  location: 'Thanjavur, India',
  timeZone: 'Asia/Kolkata',
  email: '128003082@sastra.ac.in',
  phone: { display: '+91 85558 70814', href: 'tel:+918555870814' },
  availability: 'Open for internships & collaborations',

  // >>> YOUR PHOTO: save it as client/public/profile.jpg, then set photo: '/profile.jpg' <<<
  // While this is '', the About section shows the GB mark instead.
  photo: '/profile.jpg',
};

export const about = {
  paragraphs: [
    "I'm a B.Tech Computer Science and Engineering student at SASTRA Deemed University, graduating in 2028.",
    'I work across the full stack with React.js, Node.js, Express.js and MongoDB. As a Full Stack Developer Intern at ProveIT Catalysts, I developed a production-ready MERN application for PSR Educational Services.',
    'Alongside web development, I work on machine learning and TinyML, including a bio-signal preprocessing framework and a credit card fraud detection system.',
  ],
  facts: [
    { label: 'University', value: 'SASTRA Deemed University' },
    { label: 'CGPA', value: '9.04 / 10' },
    { label: 'Based in', value: 'Thanjavur, India' },
    { label: 'Focus', value: 'Full Stack, ML, AI' },
  ],
};

export const links = {
  github: 'https://github.com/Bharadwaz28',

  // >>> PLACEHOLDER: paste your LinkedIn profile URL between the quotes. <<<
  // Example: 'https://www.linkedin.com/in/your-handle'
  // While this is empty, the LinkedIn button stays hidden on the live site.
  linkedin: 'https://www.linkedin.com/in/guggilla-bharadwaz-naga-venkata-ramana-9113a5369/',
};

// Put the PDF at client/public/Bharadwaz_Resume.pdf
export const resume = {
  path: '/Bharadwaz_Resume.pdf',
  fileName: 'Bharadwaz_Resume.pdf',
};

export const nav = [
  { id: 'home', label: '01_HOME' },
  { id: 'about', label: '02_ABOUT' },
  { id: 'projects', label: '03_PROJECTS' },
  { id: 'skills', label: '04_SKILLS' },
  { id: 'contact', label: '05_CONTACT' },
];

export const hero = {
  bootLine: 'INITIALIZING_PORTFOLIO.EXE',
  headingLines: ['Building Intelligent', 'Systems Behind the'],
  headingAccent: 'Interface.',
  intro:
    "I'm Bharadwaz Naga Venkata Ramana, a Computer Science Engineer focused on Full Stack Development, Machine Learning, and TinyML for real-world applications.",
};

/* ------------------------------ PROJECTS ------------------------------
   featured: true  -> shown on the main page (the first 3 featured projects are used).
   featured: false -> shown only in the "All projects" popup.
   To add a project, copy one block, change the text, and give it a new slug and number.
   github / live: paste a full URL to show the button. Leave '' to hide it.
   art: 'webapp' | 'signal' | 'fraud' | 'docs' | 'robot' (custom illustrations in ProjectArt.jsx)
----------------------------------------------------------------------- */
export const projects = [
  {
    slug: 'psr-educational-services',
    number: '01',
    featured: true,
    category: 'Full Stack Development',
    title: 'PSR Educational Services – Full Stack Web Application',
    shortTitle: 'PSR Educational Services',
    summary:
      'Developed a responsive MERN stack web application for PSR Educational Services, featuring interactive React interfaces, RESTful APIs, and MongoDB integration for managing student inquiries and application data.',
    overview: [
      'Designed and developed a responsive full-stack web application for PSR Educational Services to streamline student inquiries and educational consultancy operations.',
      'Built an interactive frontend using React.js and Tailwind CSS, developed RESTful APIs with Node.js and Express.js, and integrated MongoDB Atlas for managing student inquiries and application data.',
    ],
    highlights: [
      'Responsive full-stack web application for PSR Educational Services',
      'Interactive frontend built with React.js and Tailwind CSS',
      'RESTful APIs developed with Node.js and Express.js',
      'MongoDB Atlas integrated for student inquiries and application data',
    ],
    status: 'Jul 2026',
    tech: ['React.js', 'JavaScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB Atlas', 'Framer Motion'],
    art: 'webapp',
    github: 'https://github.com/Bharadwaz28/psr-educational-services',
    live: 'https://psr-educational-services.vercel.app/',
  },
  {
    slug: 'bio-signal-preprocessing',
    number: '02',
    featured: true,
    category: 'TinyML & Signal Processing',
    title: 'Multimodal Bio-Signal Preprocessing Framework for TinyML',
    shortTitle: 'Bio-Signal Preprocessing',
    summary:
      'Processed over 65,000 ECG samples using Python. Implemented Butterworth filtering, FFT, and Wavelet Transform for signal preprocessing. Building a modular pipeline for ECG, EEG, EMG, EOG, PCG, and PPG signals.',
    overview: [
      'A preprocessing framework that gets raw bio-signals ready for machine learning on small, low-power devices (TinyML).',
      'The work started with ECG: over 65,000 samples were processed in Python using Butterworth filtering, FFT, and the Wavelet Transform. The same steps are now being organised into a modular pipeline that covers six signal types.',
    ],
    highlights: [
      'Processed over 65,000 ECG samples in Python',
      'Butterworth filtering, FFT, and Wavelet Transform for signal preprocessing',
      'Modular pipeline in progress for ECG, EEG, EMG, EOG, PCG, and PPG',
    ],
    status: 'In progress',
    tech: ['Python', 'NumPy', 'SciPy', 'PyWavelets', 'WFDB'],
    art: 'signal',
    github: '',
    live: '',
  },
  {
    slug: 'ai-academic-document-generator',
    number: '03',
    featured: true,
    category: 'AI & Automation',
    title: 'AI-Powered Academic Document Generator',
    shortTitle: 'AI Document Generator',
    summary:
      'Developed an AI-powered document generation platform using Python and Groq API. Automated PowerPoint and PDF generation from user prompts with document formatting and export capabilities.',
    overview: [
      'A platform that turns a user prompt into a ready-to-use academic document.',
      'It is built with Python and the Groq API, and it automates PowerPoint and PDF generation, including document formatting and export.',
    ],
    highlights: [
      'AI-powered document generation with Python and the Groq API',
      'PowerPoint and PDF files generated automatically from user prompts',
      'Document formatting and export built in',
    ],
    status: 'Apr 2026',
    tech: ['Python', 'Groq API', 'Streamlit', 'python-pptx', 'ReportLab'],
    art: 'docs',
    github: 'https://github.com/Bharadwaz28/AI-Powered-Academic-Document-Generator',
    live: 'https://ai-powered-academic-document-generator.streamlit.app/',
  },
  {
    slug: 'credit-card-fraud-detection',
    number: '04',
    featured: false,
    category: 'Machine Learning',
    title: 'Credit Card Fraud Detection using Machine Learning',
    shortTitle: 'Credit Card Fraud Detection',
    summary:
      'Built a credit card fraud detection system using Python, Pandas, and Scikit-learn. Trained and evaluated Logistic Regression and Random Forest models. Developed a Streamlit application for fraud prediction.',
    overview: [
      'A machine learning project that predicts whether a credit card transaction is fraudulent.',
      'The data is handled with Pandas, two models (Logistic Regression and Random Forest) are trained and evaluated with Scikit-learn, and a Streamlit application lets a user run fraud predictions.',
    ],
    highlights: [
      'Fraud detection system built with Python, Pandas, and Scikit-learn',
      'Logistic Regression and Random Forest models trained and evaluated',
      'Streamlit application for fraud prediction',
    ],
    status: 'Jul 2026',
    tech: ['Python', 'Pandas', 'Scikit-learn', 'Streamlit'],
    art: 'fraud',
    github: 'https://github.com/Bharadwaz28/Creditcard-Fraud-Detection-using-ML',
    live: 'https://credit-card-fraud-detection.streamlit.app/',
  },
  {
    slug: 'line-following-robot',
    number: '05',
    featured: false,
    category: 'Embedded Systems & Robotics',
    title: 'Line Following Robot',
    shortTitle: 'Line Following Robot',
    summary:
      'Developed an autonomous line-following robot using Arduino and IR sensors, implementing real-time path detection and motor control through an L298N driver for accurate navigation.',
    overview: [
      'Designed and developed an autonomous line-following robot using Arduino and an IR sensor array for real-time path detection and navigation.',
      'Integrated an L298N motor driver to control DC motors and implemented sensor-based logic to follow predefined paths with accurate directional movement.',
    ],
    highlights: [
      'Autonomous line-following robot built with Arduino and an IR sensor array',
      'L298N motor driver integrated to control the DC motors',
      'Sensor-based logic that follows predefined paths with accurate directional movement',
    ],
    status: 'Oct 2025',
    tech: ['Arduino', 'Embedded C', 'IR Sensors', 'L298N Motor Driver', 'DC Motors'],
    art: 'robot',
    github: 'https://github.com/Bharadwaz28/arduino-line-follower-robot',
    live: 'https://www.youtube.com/watch?v=V55Q80DPv40',
  },
];

export const experience = [
  {
    number: '01',
    role: 'Full Stack Developer Intern',
    company: 'ProveIT Catalysts',
    location: 'Hyderabad',
    duration: 'May 2026 – Jul 2026',
    type: 'Internship',
    client: 'PSR Educational Services',
    points: [
      'Contributed to developing a full-stack educational consultancy website for PSR Educational Services.',
      'Developed responsive frontend components using React.js and Vite.',
      'Worked on backend integration using Node.js and Express.js.',
      'Integrated MongoDB Atlas for application data management.',
      'Contributed to building and deploying a functional web application',
    ],
    tech: [],
  },
];

// No proficiency numbers on purpose: skills are shown as plain badges.
export const skillGroups = [
  { id: 'languages', title: 'Programming languages', items: ['Python', 'Java', 'C', 'C++', 'SQL'] },
  { id: 'frontend', title: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Tailwind CSS'] },
  { id: 'backend', title: 'Backend', items: ['Node.js', 'Express.js'] },
  { id: 'databases', title: 'Databases', items: ['MongoDB', 'MySQL'] },
  {
    id: 'ml',
    title: 'Machine learning & scientific libraries',
    items: ['NumPy', 'Pandas', 'Matplotlib', 'SciPy', 'Scikit-learn', 'PyWavelets', 'Streamlit'],
  },
  {
    id: 'core',
    title: 'Core computer science',
    items: ['Data Structures and Algorithms', 'DBMS', 'Operating Systems', 'Computer Networks', 'OOP'],
  },
  { id: 'tools', title: 'Tools', items: ['Git', 'GitHub', 'VS Code', 'Jupyter Notebook'] },
];

// Scrolling strip under the projects.
export const techStack = [
  'Python', 'C++', 'Java', 'JavaScript', 'React.js', 'Node.js', 'Express.js',
  'MongoDB', 'MySQL', 'SQL', 'Tailwind CSS', 'Scikit-learn', 'NumPy', 'Pandas',
];

export const education = [
  {
    school: 'SASTRA Deemed University',
    degree: 'B.Tech Computer Science and Engineering',
    year: '2028',
    yearNote: 'Expected',
    result: 'CGPA: 9.04 / 10',
  },
  {
    school: 'Vidhya Bharathi Junior College',
    degree: 'Intermediate (Class XII)',
    year: '2024',
    yearNote: '',
    result: 'Percentage: 99%',
  },
];

export const certifications = [
  {
    title: 'Google Cloud Gen AI Academy APAC 2026 – Cohort 2',
    provider: 'Google Cloud & Hack2Skill',
    date: 'Jul 2026',
    url: '', // optional certificate link
  },
];

export const involvement = [
  {
    org: 'Error Mindz Club',
    role: 'Member, SASTRA Deemed University',
    period: 'Aug 2025 – Present',
    points: [
      'Participated in technical workshops and coding events.',
      'Collaborated with peers on software development activities.',
      'Strengthened knowledge in AI, software engineering, and full-stack development.',
    ],
  },
];

export const contact = {
  eyebrow: "LET'S_BUILD_SOMETHING_GREAT",
  headingStart: 'Ready to build what',
  headingAccent: 'matters.',
  text: "I'm currently open to internship opportunities, technical collaborations, and interesting software projects.",
};
