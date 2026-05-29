import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ParticleField from "@/components/ParticleField";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sri Vyshnavi Muduganti — AI Engineer & Developer" },
      { name: "description", content: "Software Developer and AI Engineer based in Hyderabad. LLM workflows, cloud-native apps, full-stack systems." },
      { property: "og:title", content: "Sri Vyshnavi Muduganti — AI Engineer & Developer" },
      { property: "og:description", content: "Software Developer and AI Engineer based in Hyderabad." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,700;1,900&display=swap" },
    ],
  }),
  component: Portfolio,
});

type SectionKey = "home" | "about" | "skills" | "projects" | "experience" | "certs" | "contact";

const SECTIONS: { key: SectionKey; num: string; label: string }[] = [
  { key: "home", num: "00", label: "Home" },
  { key: "about", num: "01", label: "About" },
  { key: "skills", num: "02", label: "Skills" },
  { key: "projects", num: "03", label: "Projects" },
  { key: "experience", num: "04", label: "Experience" },
  { key: "certs", num: "05", label: "Certs" },
  { key: "contact", num: "06", label: "Contact" },
];

function Portfolio() {
  const [section, setSection] = useState<SectionKey>("home");
  const prevIdxRef = useRef(0);
  const navScrollRef = useRef<HTMLDivElement>(null);
  const [showNavArrow, setShowNavArrow] = useState(false);
  const idx = SECTIONS.findIndex((s) => s.key === section);
  const direction = idx >= prevIdxRef.current ? 1 : -1;

  const go = (next: SectionKey) => {
    const nextIdx = SECTIONS.findIndex((s) => s.key === next);
    prevIdxRef.current = idx;
    if (nextIdx !== idx) setSection(next);
  };

  useEffect(() => {
    const el = navScrollRef.current;
    if (!el) return;
    const update = () => setShowNavArrow(el.scrollWidth - el.clientWidth - el.scrollLeft > 8);
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);


  // Forward (1): zoom-in — enter small→1, exit 1→large
  // Backward (-1): zoom-out — enter large→1, exit 1→small
  const variants = {
    initial: (dir: number) => ({
      opacity: 0,
      scale: dir === 1 ? 0.82 : 1.18,
      filter: "blur(12px)",
    }),
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: (dir: number) => ({
      opacity: 0,
      scale: dir === 1 ? 1.18 : 0.82,
      filter: "blur(12px)",
    }),
  };

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-background noise-bg">
      {/* Animated background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[320px] w-[320px] sm:h-[420px] sm:w-[420px] rounded-full bg-terra/30 blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] sm:h-[520px] sm:w-[520px] rounded-full bg-sage/25 blur-3xl animate-float" style={{ animationDelay: "-6s" }} />
        <div className="absolute -bottom-40 left-1/3 h-[380px] w-[380px] sm:h-[480px] sm:w-[480px] rounded-full bg-terra-light/30 blur-3xl animate-float" style={{ animationDelay: "-12s" }} />
      </div>

      {/* 3D particle ripple + fluid distortion field */}
      <ParticleField />

      {/* Top bar */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 sm:px-10 sm:py-5 gap-2">
        <a href="#" className="font-display text-lg sm:text-xl font-bold tracking-tight text-ink">
          SV<span className="text-terra">.</span>
        </a>
        <div className="glass rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-mute hidden md:flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-sage pulse-dot" />
          Open to opportunities
        </div>

      </header>


      {/* Section viewport with zoom transitions */}
      <main className="absolute inset-0 flex items-center justify-center pt-14 sm:pt-20 pb-28 sm:pb-32 px-3 sm:px-4">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.section
            key={section}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full max-w-6xl"
          >
            <SectionView section={section} go={go} />
          </motion.section>
        </AnimatePresence>
      </main>

      {/* Glass navigation pill */}
      <nav className="absolute bottom-4 sm:bottom-6 left-1/2 z-50 -translate-x-1/2 px-3 w-full max-w-[min(96vw,860px)]">
        <div className="relative">
          <div ref={navScrollRef} className="glass rounded-full p-1.5 flex items-center gap-1 overflow-x-auto hide-scrollbar">

          {SECTIONS.map((s) => {
            const active = s.key === section;
            return (
              <button
                key={s.key}
                onClick={() => go(s.key)}
                className={`relative shrink-0 rounded-full px-3 sm:px-4 py-2 sm:py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                  active ? "text-primary-foreground" : "text-ink-mute hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-terra to-terra-deep shadow-[0_8px_24px_-4px_oklch(0.55_0.15_35/0.5)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5 whitespace-nowrap">
                  <span className="opacity-60 text-[8px]">{s.num}</span>
                  <span>{s.label}</span>
                </span>
              </button>
            );
          })}
          </div>
          {/* Scroll hint arrow for narrow screens */}
          <AnimatePresence>
            {showNavArrow && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-l from-terra to-terra-deep text-primary-foreground shadow-lg"
              >
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  className="text-sm leading-none"
                >
                  ›
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-2 flex justify-center">

          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-mute/70">
            {String(idx).padStart(2, "0")} / {String(SECTIONS.length - 1).padStart(2, "0")}
          </div>
        </div>
      </nav>
    </div>
  );
}

/* ---------- Sections ---------- */

function SectionShell({ children, eyebrow, title }: { children: React.ReactNode; eyebrow?: string; title?: React.ReactNode }) {
  return (
    <div className="h-full w-full overflow-y-auto hide-scrollbar">
      <div className="glass rounded-[2rem] p-6 sm:p-10 md:p-14 min-h-full">
        {eyebrow && (
          <div className="mb-3 flex items-center gap-2.5">
            <span className="h-px w-7 bg-terra" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-terra">{eyebrow}</span>
          </div>
        )}
        {title && <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight text-ink mb-8">{title}</h2>}
        {children}
      </div>
    </div>
  );
}

function SectionView({ section, go }: { section: SectionKey; go: (s: SectionKey) => void }) {
  switch (section) {
    case "home": return <Home go={go} />;
    case "about": return <About />;
    case "skills": return <Skills />;
    case "projects": return <Projects />;
    case "experience": return <Experience />;
    case "certs": return <Certs />;
    case "contact": return <Contact />;
  }
}

function Home({ go }: { go: (s: SectionKey) => void }) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="glass rounded-[2.5rem] p-8 sm:p-14 md:p-20 w-full max-w-5xl text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-[0.04] pointer-events-none flex items-center justify-center">
          <span className="font-display text-[18vw] font-black leading-none text-terra select-none">SV</span>
        </div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-sage pulse-dot" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute">AI & Data Engineer · Hyderabad</span>
        </div>
        <h1 className="font-display font-black leading-[0.95] tracking-tight text-ink text-[clamp(2.8rem,8vw,6.5rem)]">
          Sri Vyshnavi
        </h1>
        <p className="mt-2 font-display text-[clamp(1.1rem,2.5vw,1.8rem)] font-bold text-terra italic">AI &amp; Data Engineer</p>
        <p className="mt-6 mx-auto max-w-xl text-base sm:text-lg text-ink-mute font-light leading-relaxed">
          Building <span className="text-ink font-medium">AI-powered workflows</span>, intelligent automation systems, and cloud-native applications that transform complex processes into seamless user experiences.
        </p>
        <p className="mt-3 mx-auto max-w-xl text-sm text-ink-mute/80 font-light leading-relaxed">
          Currently focused on <span className="text-ink font-medium">Generative AI</span>, Agentic Workflows, Retrieval-Augmented Generation (RAG), and scalable cloud deployments.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => go("projects")} className="glass-btn glass-btn-active rounded-full px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em]">
            View Projects →
          </button>
          <button onClick={() => go("about")} className="glass-btn rounded-full px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink">
            About me
          </button>
          <a href="https://linkedin.com/in/hellomsv" target="_blank" rel="noreferrer" className="glass-btn rounded-full px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink">
            LinkedIn ↗
          </a>
        </div>

      </div>
    </div>
  );
}

function About() {
  return (
    <SectionShell eyebrow="01 — About" title={<>Hello, I'm <em className="italic text-terra">Sri Vyshnavi.</em></>}>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-4 text-[0.92rem] leading-[1.85] text-ink-mute">
          <p>I'm an <span className="text-ink font-medium">AI & Data Engineer</span> with hands-on experience building intelligent automation systems, cloud-native applications, and AI-powered workflows.</p>
          <p>My work sits at the intersection of <span className="text-ink font-medium">software engineering, artificial intelligence, and user-centered design.</span> I enjoy transforming ideas into practical solutions that solve real-world problems.</p>
          <p>Over the past year, I've worked on cloud deployments, LLM-powered automation, real-time communication systems, and AI-assisted applications. My interests currently include <span className="text-ink font-medium">Generative AI, Agentic Systems, Retrieval-Augmented Generation (RAG), AI Infrastructure,</span> and scalable backend engineering.</p>
          <p>Outside of engineering, I've led student organizations, organized large-scale events, and developed strong communication and leadership skills that help me collaborate effectively across teams.</p>
          <div className="pt-3 flex items-center gap-2 font-mono text-xs text-sage">
            <span>◉</span> Bandlaguda, Hyderabad · Available for full-time roles
          </div>
        </div>
        <div className="glass-dark rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-terra to-terra-deep p-5">
            <div className="font-display text-lg font-bold text-primary-foreground">Muduganti Sri Vyshnavi</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-primary-foreground/70">AI & Data Engineer</div>
          </div>
          <div className="px-5">
            {[
              ["Degree", "B.Tech Computer Science"],
              ["University", "Sreenidhi Institute of Science & Technology"],
              ["CGPA", "7.7 / 10.0"],
              ["Current Role", "Software Developer @ Lakhi IT Inc"],
              ["Focus", "Generative AI · RAG · Cloud"],
              ["Email", "srivyshnavimuduganti@gmail.com"],
            ].map(([k, v], i, arr) => (
              <div key={k} className={`flex items-center justify-between py-3 ${i < arr.length - 1 ? "border-b border-white/10" : ""}`}>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-primary-foreground/50">{k}</span>
                <span className="text-[0.82rem] text-primary-foreground text-right max-w-[60%] truncate">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function Skills() {
  const groups = [
    { t: "Languages", items: ["Python", "JavaScript", "SQL", "HTML5", "CSS3"] },
    { t: "Web & Frameworks", items: ["React.js", "Node.js", "FastAPI", "REST APIs"] },
    { t: "Cloud & DevOps", items: ["AWS ECS Fargate", "API Gateway", "S3", "Docker", "CI/CD"] },
    { t: "AI & Automation", items: ["Prompt Engineering", "LLM Workflows", "Agentic AI", "LSTM / ML"] },
    { t: "Data & Analytics", items: ["Power BI", "Grafana", "OpenTelemetry", "Data Viz"] },
    { t: "Tools & Platforms", items: ["Git", "Twilio API", "LiveKit", "Agile"] },
  ];
  return (
    <SectionShell eyebrow="02 — Skills" title={<>Tech I <em className="italic text-terra">wield.</em></>}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((g) => (
          <div key={g.t} className="glass rounded-2xl p-5 transition-transform hover:-translate-y-1 duration-300">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-terra" />
              <h3 className="text-sm font-medium text-ink">{g.t}</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((i) => (
                <span key={i} className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-white/40 border border-white/50 text-ink-mute hover:text-terra hover:border-terra/40 transition">
                  {i}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function Projects() {
  const items = [
    { n: "01", t: "Campus AI", d: "A Python-powered AI assistant giving students real-time info on campus events, clubs, and activities — club-specific dashboards, auth, and an adaptive feedback loop.", tags: ["Python", "AI / NLP", "Auth", "Adaptive Learning"] },
    { n: "02", t: "Stock Market Prediction", d: "Deep learning model using LSTM networks to analyze historical stock data and forecast price trends with high temporal accuracy.", tags: ["LSTM", "Python", "Deep Learning", "Time Series"] },
    { n: "03", t: "GardenOS AI", d: "An intelligent AI OS for smart garden management — plant care recommendations, environment monitoring, automated scheduling.", tags: ["Agentic AI", "LLM", "Python", "IoT"] },
  ];
  return (
    <SectionShell eyebrow="03 — Projects" title={<>Things I've <em className="italic text-terra">built.</em></>}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p.n} className="glass rounded-2xl p-6 relative overflow-hidden group transition-all hover:-translate-y-2 duration-500">
            <span className="absolute top-2 right-4 font-display text-6xl font-black text-terra/10 leading-none select-none">{p.n}</span>
            <div className="h-1 w-8 rounded-full bg-gradient-to-r from-terra to-terra-light mb-4" />
            <h3 className="font-display text-xl font-bold text-ink mb-2">{p.t}</h3>
            <p className="text-[0.84rem] leading-[1.7] text-ink-mute mb-4">{p.d}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {p.tags.map((t) => (
                <span key={t} className="font-mono text-[9px] px-2 py-1 rounded-full bg-terra/10 border border-terra/20 text-terra-deep">{t}</span>
              ))}
            </div>
            <a href="#" className="glass-btn inline-flex rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
              ◎ GitHub ↗
            </a>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function Experience() {
  const items = [
    {
      date: "July 2025 — Present",
      co: "Lakhi Information Technologies Inc",
      meta: "Full-time · Hyderabad",
      role: "Software Developer",
      list: [
        "Containerized modules with Docker and deployed to AWS ECS Fargate for scalable production execution",
        "Built reusable React UI components, improving frontend maintainability and user workflows",
        "Implemented LLM-driven automation pipelines with prompt engineering to boost response quality",
        "Integrated real-time communication via LiveKit and WhatsApp automation via Twilio API",
        "Collaborated cross-functionally on dev, testing, documentation, and cloud deployment in agile sprints",
      ],
    },
    {
      date: "Leadership",
      co: "Sreenidhi Institute of Science and Technology",
      meta: "",
      role: "Vice President — The Arts Club",
      list: [
        "Led club operations and organized large-scale cultural events for 1000+ students",
        "Served as Coordinator Head, managing multi-club activities and the annual Technical Fest",
      ],
    },
  ];
  return (
    <SectionShell eyebrow="04 — Experience" title={<>Where I've <em className="italic text-terra">shipped.</em></>}>
      <div className="space-y-6">
        {items.map((e) => (
          <div key={e.role} className="glass rounded-2xl p-6 md:p-8 grid md:grid-cols-[200px_1fr] gap-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-terra mb-1.5">{e.date}</div>
              <div className="text-[0.85rem] text-ink-mute leading-snug">{e.co}</div>
              {e.meta && <div className="font-mono text-[10px] text-ink-mute/70 mt-1">{e.meta}</div>}
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-ink mb-3">{e.role}</h3>
              <ul className="space-y-2">
                {e.list.map((li) => (
                  <li key={li} className="flex gap-3 text-[0.88rem] text-ink-mute leading-[1.7]">
                    <span className="text-sage shrink-0">—</span>{li}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function Certs() {
  const items = [
    { i: "DA", t: "Data Analytics Professional Certificate", o: "Google" },
    { i: "AV", t: "Data Analytics & Visualization", o: "Accenture / Forage" },
    { i: "DS", t: "R for Data Science", o: "IBM" },
    { i: "CL", t: "AWS AI-ML Virtual Internship", o: "Amazon Web Services" },
    { i: "AI", t: "AI-ML Virtual Internship", o: "Google" },
  ];
  return (
    <SectionShell eyebrow="05 — Certifications" title={<>Credentials <em className="italic text-terra">earned.</em></>}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((c) => (
          <div key={c.t} className="glass rounded-2xl p-4 flex items-center gap-3 transition-transform hover:translate-x-1 duration-300">
            <div className="w-11 h-11 rounded-xl bg-terra/10 flex items-center justify-center shrink-0">
              <span className="font-mono text-[10px] font-bold tracking-widest text-terra">{c.i}</span>
            </div>
            <div>
              <div className="text-[0.85rem] font-medium text-ink leading-tight">{c.t}</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-mute mt-1">{c.o}</div>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function Contact() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="glass-dark rounded-[2.5rem] p-8 sm:p-14 md:p-20 w-full max-w-3xl text-center relative overflow-hidden bg-gradient-to-br from-terra to-terra-deep">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-sage/30 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 glass-btn rounded-full px-4 py-1.5 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-white pulse-dot" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white">Available for hire</span>
          </div>
          <h2 className="font-display font-black leading-[1.05] text-primary-foreground text-[clamp(2.4rem,6vw,4.5rem)]">
            Let's build<br /><em className="italic text-sand">something real.</em>
          </h2>
          <p className="mt-5 mx-auto max-w-md text-primary-foreground/75 text-[0.95rem]">
            Open to full-time roles in software engineering, AI/ML, or cloud infrastructure. Let's talk.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="mailto:srivyshnavimuduganti@gmail.com" className="rounded-full bg-white text-terra-deep px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] hover:-translate-y-0.5 transition shadow-lg">
              Send Email
            </a>
            <a href="https://linkedin.com/in/hellomsv" target="_blank" rel="noreferrer" className="glass-btn rounded-full px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white">
              LinkedIn ↗
            </a>
            <a href="/resume.pdf" target="_blank" rel="noreferrer" className="glass-btn rounded-full px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white">
              Resume ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
