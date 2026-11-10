import React from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { ArrowUpRight, Download, Github, Linkedin, Mail, MapPin, Terminal, Cpu, Code2, Activity, ExternalLink, Menu, ChevronDown } from 'lucide-react';
import './style.css';

const projects = [
  { n:'01', type:'RESEARCH / TINYML', title:'Multimodal Bio-Signal Preprocessing Framework', desc:'Developing a modular preprocessing pipeline for ECG, EEG, EMG, EOG, PCG and PPG signals, beginning with ECG.', tags:['Python','NumPy','SciPy','PyWavelets'], detail:'65K+ ECG samples processed', icon:Activity },
  { n:'02', type:'MACHINE LEARNING', title:'Credit Card Fraud Detection', desc:'A fraud classification system using Logistic Regression and Random Forest, with an interactive Streamlit prediction interface.', tags:['Python','Pandas','Scikit-learn','Streamlit'], detail:'Classification · Model evaluation', icon:Cpu },
  { n:'03', type:'GENERATIVE AI', title:'AI-Powered Academic Document Generator', desc:'An AI-assisted platform that transforms user prompts into formatted PowerPoint presentations and PDF documents.', tags:['Python','Groq API','python-pptx','ReportLab'], detail:'PPT + PDF generation', icon:Code2 },
];
const skills = [
  ['LANGUAGES',['C','C++','Java','Python','SQL']],
  ['FRONTEND',['HTML','CSS','JavaScript','React.js','Tailwind CSS']],
  ['BACKEND & DATABASES',['Node.js','Express.js','MongoDB','MySQL']],
  ['ML / DATA',['NumPy','Pandas','Matplotlib','SciPy','Scikit-learn','PyWavelets']],
  ['CORE CONCEPTS',['DSA','DBMS','Operating Systems','Computer Networks','OOP']],
  ['TOOLS',['Git','GitHub','VS Code','Jupyter Notebook','Streamlit']],
];
function SectionLabel({children}) { return <div className="section-label"><span>//</span> {children}</div> }
function App(){
  return <div className="site-shell">
    <div className="topbar"><a className="brand" href="#home">GB<span>.</span></a><div className="brand-meta">BHARADWAZ <i>COMPUTER SCIENCE ENGINEER</i><b>●</b></div><nav><a href="#home">01_HOME</a><a href="#about">02_ABOUT</a><a href="#projects">03_PROJECTS</a><a href="#stack">04_STACK</a><a href="#contact">05_CONTACT</a></nav><a className="menu-icon" href="#contact" aria-label="Contact"><Menu size={17}/></a></div>
    <main>
      <div className="left-column">
        <motion.section id="home" className="hero panel" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
          <div className="hero-copy"><div className="terminal-line">&gt; INITIALIZING_PORTFOLIO.EXE</div><div className="terminal-line muted">&gt; STATUS: ONLINE</div>
            <h1>Building systems<br/>behind the <em>interface.</em></h1>
            <p className="intro">I’m a Computer Science Engineering student who enjoys building useful software, exploring machine learning, and working with intelligent systems.</p>
            <div className="actions"><a className="btn primary" href="#projects">VIEW MY WORK <ArrowUpRight size={14}/></a><a className="btn" href="/Bharadwaz_Resume.pdf" download>DOWNLOAD CV <Download size={14}/></a></div>
            <a className="scroll-hint" href="#about">&gt; SCROLL_TO_EXPLORE <ChevronDown size={13}/></a>
          </div>
          <div className="profile-visual"><div className="scan scan-a"/><div className="monogram">GB</div><div className="profile-caption">PROFILE / 2026</div><div className="corner tl"/><div className="corner br"/></div>
          <aside className="hero-meta"><div><span>WHO_AM_I</span><b>Bharadwaz</b></div><div><span>ROLE</span><b>CSE Student<br/>Developer</b></div><div><span>LOCATION</span><b>India</b></div><div><span>EDUCATION</span><b>SASTRA University</b></div></aside>
        </motion.section>
        <section id="about" className="about-strip panel"><SectionLabel>ABOUT / PROFILE</SectionLabel><p>I’m currently pursuing a B.Tech in Computer Science and Engineering at <strong>SASTRA Deemed University</strong>. My interests span full-stack development, machine learning and signal processing, with a focus on turning technical ideas into practical applications.</p><div className="stats"><div><b>9.04</b><span>CGPA / 10</span></div><div><b>65K+</b><span>ECG SAMPLES PROCESSED</span></div><div><b>03</b><span>FEATURED PROJECTS</span></div></div></section>
        <section id="projects" className="projects-section"><div className="section-heading"><SectionLabel>SELECTED PROJECTS</SectionLabel><span className="tiny-link">03 CASE STUDIES <ExternalLink size={11}/></span></div><div className="project-grid">{projects.map((p,i)=><motion.article className="project-card panel" key={p.n} whileHover={{y:-4,borderColor:'rgba(62,218,165,.55)'}} transition={{duration:.2}}><div className="project-top"><span>{p.n}</span><span>+</span></div><div className="project-icon"><p.icon size={22}/></div><div className="project-type">// {p.type}</div><h3>{p.title}</h3><p>{p.desc}</p><div className="project-detail">{p.detail}</div><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div></motion.article>)}</div></section>
        <div className="system-panel panel"><div><SectionLabel>SYSTEM_LOG</SectionLabel><p>[14:30:01] Portfolio initialized.</p><p>[14:30:02] Loading projects...</p><p>[14:30:03] Ready.</p></div><div><SectionLabel>FOCUS_AREAS</SectionLabel><div className="focus-icons"><span>ML</span><span>AI</span><span>FS</span><span>IoT</span><span>DSA</span></div></div></div>
      </div>
      <div className="right-column">
        <section className="case-studies panel"><div className="section-heading"><SectionLabel>CASE STUDIES</SectionLabel><a className="tiny-link" href="#projects">VIEW_ALL_PROJECTS <ExternalLink size={11}/></a></div>{projects.map(p=><a className="case-row" href="#projects" key={p.n}><div className="case-number">{p.n}</div><div className="case-thumb"><p.icon size={27}/><span>PROJECT / PREVIEW</span></div><div className="case-info"><h3>{p.title}</h3><p>{p.desc}</p><div className="tags">{p.tags.slice(0,3).map(t=><span key={t}>{t}</span>)}</div></div><div className="case-result"><span>HIGHLIGHT</span><b>{p.detail}</b><ArrowUpRight size={13}/></div></a>)}</section>
        <section id="stack" className="stack-panel panel"><div className="stack-main"><SectionLabel>TECHNICAL SKILLS</SectionLabel>{skills.map(([group,items])=><div className="skill-group" key={group}><span>{group}</span><p>{items.join('  ·  ')}</p></div>)}</div><div className="stack-side"><SectionLabel>EXPERIENCE</SectionLabel><div className="experience"><span> MAY 2026 — JUL 2026</span><h3>Full Stack Developer Intern</h3><b>ProveIT Catalysts</b><p>Developed a MERN stack application for PSR Educational Services, implementing responsive interfaces and backend services.</p></div><div className="experience"><span> AUG 2025 — PRESENT</span><h3>Member</h3><b>Error Mindz Club · SASTRA</b><p>Participated in technical workshops, coding events and collaborative development activities.</p></div></div></section>
        <section className="education panel"><SectionLabel>EDUCATION & CERTIFICATION</SectionLabel><div className="edu-row"><div><h3>B.Tech · Computer Science and Engineering</h3><p>SASTRA Deemed University · Thanjavur</p></div><b>2028</b></div><div className="edu-row"><div><h3>Intermediate · Class XII</h3><p>Vidhya Bharathi Junior College</p></div><b>2024</b></div><div className="edu-row"><div><h3>Google Cloud Gen AI Academy APAC 2026</h3><p>Google Cloud & Hack2Skill · Cohort 2</p></div><b>2026</b></div></section>
        <section id="contact" className="contact-panel panel"><div><SectionLabel>LET’S_BUILD_SOMETHING_GREAT</SectionLabel><h2>Have an idea?<br/>Let's make it <em>real.</em></h2><p>Open to learning, collaboration and interesting software projects.</p></div><a className="contact-cta" href="mailto:128003082@sastra.ac.in"><span>SEND_MESSAGE</span><b>GET IN TOUCH <ArrowUpRight size={14}/></b><small>128003082@sastra.ac.in</small></a></section>
        <footer className="footer panel"><a className="brand" href="#home">GB<span>.</span></a><span>THANKS FOR VISITING · BUILT WITH CURIOSITY</span><div className="socials"><a href="https://github.com/Bharadwaz28" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={16}/></a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={16}/></a><a href="mailto:128003082@sastra.ac.in" aria-label="Email"><Mail size={16}/></a></div></footer>
      </div>
    </main>
    <div className="bottom-note"><span>© 2026 BHARADWAZ</span><span>DESIGNED / ENGINEERED WITH INTENT <b>●</b></span></div>
  </div>
}

createRoot(document.getElementById('root')).render(<App/>);
