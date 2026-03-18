import React, { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" }
];

const HERO_STATS = [
  { value: "5+", label: "Production Projects" },
  { value: "3+", label: "Domains Covered" },
  { value: "22", label: "Years Old, Building Real Things" }
];

const PROJECTS = [
  {
    name: "CineStream",
    accent: "#f97316",
    tag: "Android · Media",
    description:
      "14MB video player with FFmpeg software decoding, EAC3/AC3, gesture controls, subtitles — 25% faster load than market alternatives. Lighter than anything on the market.",
    tech: ["Android", "ExoPlayer", "FFmpeg", "Java"],
    link: "https://github.com/exor-26"
  },
  {
    name: "TBUS",
    accent: "#6366f1",
    tag: "Android · FinTech",
    description:
      "End-to-end bus booking platform. RedBus alternative charging owners 5–10% only — zero user fees. Firebase, Razorpay, Google Auth, offline mode.",
    tech: ["Android", "Firebase", "Razorpay", "Google Auth"],
    link: "https://github.com/exor-26/TBUS"
  },
  {
    name: "KIEPL Portal",
    accent: "#10b981",
    tag: "Web · ERP",
    description:
      "Full internal ERP replacing complete paperwork. Role-based access: HR, Admin, Engineers. Attendance, OT, payments, records — all in one system.",
    tech: ["HTML", "CSS", "JavaScript", "Role-based Auth"],
    link: "https://kiepl.co"
  },
  {
    name: "AI WhatsApp Agent",
    accent: "#a855f7",
    tag: "AI · Local LLM",
    description:
      "Offline human-level WhatsApp agent. Qwen 2.5 3B running fully local — zero cloud. Smart takeover on inactivity, steps back when you re-engage.",
    tech: ["Qwen 2.5", "Local LLM", "Python"],
    link: "https://github.com/exor-26"
  }
];

const SKILLS = [
  "Android Development",
  "Firebase",
  "ExoPlayer",
  "FFmpeg",
  "AI Integration",
  "Local LLM",
  "Qwen 2.5",
  "Real-time Systems",
  "React JSX",
  "Tailwind",
  "API Development",
  "UI/UX Design",
  "Payment Gateways",
  "Role-based Auth",
  "Web Technologies",
  "ERP Systems"
];

const MARQUEE_ROWS = [
  [
    "Android Development",
    "Firebase",
    "ExoPlayer",
    "FFmpeg",
    "AI Integration",
    "Local LLM",
    "Qwen 2.5",
    "Real-time Systems"
  ],
  [
    "React JSX",
    "Tailwind",
    "API Development",
    "UI/UX Design",
    "Payment Gateways",
    "Role-based Auth",
    "Web Technologies",
    "ERP Systems"
  ]
];

const COUNTER_TARGETS = [
  { key: "projects", label: "Projects", value: 5, suffix: "+" },
  { key: "domains", label: "Domains", value: 3, suffix: "+" },
  { key: "philosophy", label: "Architecture Philosophy", value: 1, suffix: "" }
];

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
.aditya-portfolio{--bg:#080810;--text:#f0f0f5;--muted:#6b6b80;--orange:#f97316;--indigo:#6366f1;--max:1480px;position:relative;min-height:100vh;overflow-x:clip;background:radial-gradient(circle at top left,rgba(99,102,241,.06),transparent 35%),radial-gradient(circle at bottom right,rgba(249,115,22,.05),transparent 30%),#080810;color:var(--text);font-family:'DM Sans',sans-serif}
.aditya-portfolio *{box-sizing:border-box}
.aditya-portfolio a,.aditya-portfolio button{-webkit-tap-highlight-color:transparent}
@media (hover:hover) and (pointer:fine){.aditya-portfolio,.aditya-portfolio *{cursor:none!important}}
.aditya-noise{position:fixed;inset:0;pointer-events:none;opacity:.035;mix-blend-mode:soft-light;z-index:3;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E")}
.orb{position:fixed;border-radius:999px;filter:blur(80px);pointer-events:none;z-index:1;opacity:.09;animation:drift 14s ease-in-out infinite alternate}
.orb-one{top:8%;left:-8%;width:clamp(15rem,30vw,28rem);height:clamp(15rem,30vw,28rem);background:radial-gradient(circle,rgba(249,115,22,.9),transparent 70%)}
.orb-two{top:38%;right:-10%;width:clamp(16rem,32vw,30rem);height:clamp(16rem,32vw,30rem);background:radial-gradient(circle,rgba(99,102,241,.9),transparent 68%);animation-duration:12s}
.orb-three{bottom:4%;left:35%;width:clamp(14rem,26vw,24rem);height:clamp(14rem,26vw,24rem);background:radial-gradient(circle,rgba(168,85,247,.85),transparent 72%);animation-duration:15s}
.scroll-progress{position:fixed;top:0;left:0;height:2px;width:var(--progress,0%);z-index:60;background:linear-gradient(90deg,#f97316,#6366f1);box-shadow:0 0 24px rgba(99,102,241,.45)}
.glass-card{position:relative;overflow:hidden;background:rgba(255,255,255,.04);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.08);box-shadow:0 8px 32px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.06)}
.glass-card::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at top left,rgba(255,255,255,.08),transparent 40%),linear-gradient(180deg,rgba(255,255,255,.02),transparent 35%)}
.syne{font-family:'Syne',sans-serif}
.text-gradient{background:linear-gradient(90deg,#f97316,#fb7185,#6366f1);background-size:200% 200%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:gradientShift 6s ease infinite}
.section-wrap{position:relative;isolation:isolate}
.section-wrap::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(40rem circle at var(--spot-x,50%) var(--spot-y,50%),rgba(249,115,22,.05),transparent 45%);opacity:var(--spot-opacity,0);transition:opacity .18s ease}
.hero-tag{display:inline-flex;align-items:center;gap:.75rem;border-radius:999px;padding:.7rem 1rem;font-size:.92rem;letter-spacing:.01em;color:rgba(240,240,245,.94)}
.pulse-dot,.status-dot{width:.6rem;height:.6rem;border-radius:999px;flex:none}
.pulse-dot{background:#22c55e;box-shadow:0 0 0 0 rgba(34,197,94,.55);animation:pulse 1.8s ease infinite}
.status-dot{background:#f97316;box-shadow:0 0 18px rgba(249,115,22,.55)}
.hero-title{font-size:clamp(2.5rem,8vw,6rem);line-height:.92;letter-spacing:-.05em;min-height:clamp(5.4rem,12vw,11rem)}
.type-line{display:block}
.type-caret{display:inline-block;width:.08em;height:.95em;margin-left:.12em;border-radius:999px;vertical-align:-.08em;background:rgba(240,240,245,.82);animation:blink 1s steps(1,end) infinite}
.hero-copy{opacity:0;transform:translateY(16px);transition:opacity .7s ease,transform .7s ease}
.hero-copy.is-visible{opacity:1;transform:translateY(0)}
.hero-subtitle{max-width:38rem;color:rgba(240,240,245,.78);font-size:clamp(1rem,1.4vw,1.15rem);line-height:1.75}
.btn-base{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:.7rem;border-radius:999px;padding:.95rem 1.35rem;font-size:.96rem;font-weight:600;letter-spacing:.01em;transition:transform .18s ease,background .24s ease,border-color .24s ease,box-shadow .24s ease;will-change:transform}
.btn-primary{background:linear-gradient(135deg,rgba(249,115,22,1),rgba(251,146,60,.96));color:#fff7ed;box-shadow:0 14px 44px rgba(249,115,22,.28)}
.btn-glass{border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:var(--text);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);box-shadow:0 8px 32px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.06)}
.tilt-frame{transform-style:preserve-3d;transition:transform .18s ease,box-shadow .22s ease;will-change:transform}
.tilt-depth{transform:translateZ(26px)}
.scroll-indicator{position:absolute;left:50%;bottom:1.75rem;transform:translateX(-50%);display:inline-flex;align-items:center;justify-content:center;width:2.6rem;height:2.6rem;border-radius:999px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);backdrop-filter:blur(20px);animation:bounce 2.2s ease infinite}
.marquee-shell{position:relative;overflow:hidden}
.marquee-shell::before,.marquee-shell::after{content:"";position:absolute;top:0;bottom:0;width:4rem;z-index:2;pointer-events:none}
.marquee-shell::before{left:0;background:linear-gradient(90deg,#080810,rgba(8,8,16,0))}
.marquee-shell::after{right:0;background:linear-gradient(270deg,#080810,rgba(8,8,16,0))}
.marquee-track{display:flex;width:max-content;gap:1rem;animation:marquee 30s linear infinite}
.marquee-row[data-direction="reverse"] .marquee-track{animation-name:marqueeReverse}
.marquee-row:hover .marquee-track{animation-play-state:paused}
.pill{display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;border-radius:999px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);color:rgba(240,240,245,.78);padding:.7rem 1rem;box-shadow:inset 0 1px 0 rgba(255,255,255,.05)}
.section-kicker{color:rgba(249,115,22,.92);font-size:.78rem;letter-spacing:.35em;text-transform:uppercase}
.section-title{font-size:clamp(2rem,4vw,3.75rem);line-height:1;letter-spacing:-.05em}
.reveal-item{opacity:0;transform:translateY(30px);transition:opacity .7s cubic-bezier(.2,1,.22,1),transform .7s cubic-bezier(.2,1,.22,1);transition-delay:var(--delay,0ms)}
.reveal-item.is-visible{opacity:1;transform:translateY(0)}
.project-card{position:relative;min-height:24rem;padding:1.5rem;border-top:3px solid var(--accent);border-radius:1.5rem;transform-style:preserve-3d;box-shadow:0 10px 40px rgba(0,0,0,.36),inset 0 1px 0 rgba(255,255,255,.06)}
.project-card::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 20% 0%,var(--accent-soft),transparent 45%),radial-gradient(circle at var(--glow-x,50%) var(--glow-y,50%),var(--accent-mid),transparent 32%)}
.project-card:hover{box-shadow:0 20px 52px rgba(0,0,0,.4),0 0 36px var(--accent-glow),inset 0 1px 0 rgba(255,255,255,.08)}
.project-link{position:relative;z-index:1;display:inline-flex;align-items:center;justify-content:center;width:2.75rem;height:2.75rem;border-radius:999px;border:1px solid rgba(255,255,255,.12);color:var(--text);background:rgba(255,255,255,.04);transition:background .22s ease,color .22s ease,border-color .22s ease,transform .22s ease}
.project-link:hover{background:var(--accent);border-color:var(--accent);color:#fff;transform:translateY(-2px)}
.skill-chip{transition:transform .18s ease,box-shadow .22s ease,border-color .22s ease}
.skill-chip:hover{transform:translateY(-4px);border-color:rgba(255,255,255,.18);box-shadow:0 12px 26px rgba(0,0,0,.26)}
.cinema-card{background:radial-gradient(circle at 8% 20%,rgba(249,115,22,.2),transparent 24%),radial-gradient(circle at 85% 80%,rgba(99,102,241,.18),transparent 28%),linear-gradient(135deg,rgba(18,18,30,.92),rgba(10,10,18,.72))}
.cinema-title{font-size:clamp(1.45rem,7vw,2.5rem);line-height:.92;letter-spacing:-.05em;overflow-wrap:anywhere}
.cinema-copy{max-width:34rem;margin-inline:auto}
.counter-card{text-align:center;padding:1.5rem;border-radius:1.5rem}
.counter-value{font-family:'Syne',sans-serif;font-size:clamp(2rem,4vw,3.25rem);line-height:1;letter-spacing:-.05em}
.contact-card{padding:clamp(1.5rem,4vw,4rem);border-radius:2rem;background:radial-gradient(circle at 15% 20%,rgba(249,115,22,.12),transparent 24%),radial-gradient(circle at 80% 80%,rgba(99,102,241,.12),transparent 28%),rgba(255,255,255,.04)}
.footer-copy{color:rgba(240,240,245,.64);font-size:.95rem}
.cursor-dot,.cursor-ring{position:fixed;top:0;left:0;pointer-events:none;z-index:80;border-radius:999px;opacity:0;transition:width .18s ease,height .18s ease,border-color .18s ease,background .18s ease,opacity .18s ease;will-change:transform}
.cursor-dot{width:6px;height:6px;background:#f0f0f5;box-shadow:0 0 18px rgba(240,240,245,.65)}
.cursor-ring{width:32px;height:32px;border:1px solid rgba(240,240,245,.45);display:flex;align-items:center;justify-content:center;color:rgba(240,240,245,.9);font-size:.62rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;backdrop-filter:blur(10px)}
.cursor-ring.is-active,.cursor-dot.is-active{opacity:1}
.cursor-ring.mode-button{width:48px;height:48px;background:rgba(249,115,22,.2);border-color:rgba(249,115,22,.55)}
.cursor-ring.mode-project{width:56px;height:56px;background:rgba(99,102,241,.14);border-color:rgba(99,102,241,.44)}
.cursor-dot.is-hidden{opacity:0!important}
.mobile-menu{position:fixed;inset:0;z-index:55;padding:6rem 1.5rem 2rem;background:radial-gradient(circle at top,rgba(99,102,241,.14),transparent 32%),rgba(8,8,16,.92);backdrop-filter:blur(24px);transform:translateY(-100%);transition:transform .32s ease}
.mobile-menu.is-open{transform:translateY(0)}
.nav-link{position:relative;color:rgba(240,240,245,.72);transition:color .18s ease}
.nav-link:hover,.nav-link.is-active{color:#fff}
.nav-link.is-active::after{content:"";position:absolute;left:50%;bottom:-.65rem;width:.4rem;height:.4rem;transform:translateX(-50%);border-radius:999px;background:var(--orange);box-shadow:0 0 18px rgba(249,115,22,.7)}
.menu-button{width:3rem;height:3rem;border-radius:999px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);backdrop-filter:blur(16px)}
.menu-button span{display:block;width:1.2rem;height:2px;margin:.22rem auto;border-radius:999px;background:#f0f0f5;transition:transform .18s ease,opacity .18s ease}
.menu-button.is-open span:nth-child(1){transform:translateY(6px) rotate(45deg)}
.menu-button.is-open span:nth-child(2){opacity:0}
.menu-button.is-open span:nth-child(3){transform:translateY(-6px) rotate(-45deg)}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes blink{50%{opacity:0}}
@keyframes pulse{70%{box-shadow:0 0 0 10px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}
@keyframes drift{0%{transform:translate3d(0,0,0) scale(1)}100%{transform:translate3d(3rem,-2rem,0) scale(1.08)}}
@keyframes bounce{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,-10px)}}
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes marqueeReverse{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}
@media (max-width:1023px){.hero-title{min-height:auto}}
@media (max-width:639px){.hero-title{font-size:clamp(2.5rem,10vw,3.5rem)}.project-card{min-height:auto}.marquee-shell::before,.marquee-shell::after{width:2.5rem}.cinema-card{padding:1.35rem}.cinema-title{font-size:clamp(1.35rem,6.6vw,1.9rem);letter-spacing:-.04em}.cinema-copy{font-size:.95rem;line-height:1.9}}
@media (min-width:1024px){.cinema-copy{margin-inline:0}}
@media (hover:none),(pointer:coarse){.tilt-frame{transform:none!important}.cursor-dot,.cursor-ring{display:none!important}}
`;

const titleSource = "Software\nArchitect";

function hexToRgba(hex, alpha) {
  const normalized = hex.replace("#", "");
  const safe = normalized.length === 3
    ? normalized.split("").map((part) => part + part).join("")
    : normalized;
  const value = Number.parseInt(safe, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function accentVars(accent) {
  return {
    "--accent": accent,
    "--accent-soft": hexToRgba(accent, 0.18),
    "--accent-mid": hexToRgba(accent, 0.14),
    "--accent-glow": hexToRgba(accent, 0.32)
  };
}

function usePointerCapability() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mediaQuery.matches && window.innerWidth >= 640);

    update();
    mediaQuery.addEventListener?.("change", update);
    window.addEventListener("resize", update);

    return () => {
      mediaQuery.removeEventListener?.("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return enabled;
}

function useSpotlight(ref) {
  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return undefined;
    }

    const onMove = (event) => {
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
      node.style.setProperty("--spot-opacity", "1");
    };

    const onLeave = () => node.style.setProperty("--spot-opacity", "0");

    node.addEventListener("mousemove", onMove);
    node.addEventListener("mouseleave", onLeave);
    return () => {
      node.removeEventListener("mousemove", onMove);
      node.removeEventListener("mouseleave", onLeave);
    };
  }, [ref]);
}

function MagneticButton({ href, children, className, canHover, external = false }) {
  const ref = useRef(null);
  const [transform, setTransform] = useState("translate3d(0px, 0px, 0)");

  const handleMove = (event) => {
    if (!canHover || !ref.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    setTransform(`translate3d(${(x * 0.3).toFixed(2)}px, ${(y * 0.3).toFixed(2)}px, 0)`);
  };

  return (
    <a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={className}
      style={{ transform }}
      data-cursor="button"
      onMouseMove={handleMove}
      onMouseLeave={() => setTransform("translate3d(0px, 0px, 0)")}
    >
      {children}
    </a>
  );
}

function TiltCard({ children, className = "", accent = "#6366f1", canHover, style, ...props }) {
  const ref = useRef(null);
  const [transform, setTransform] = useState("perspective(900px) rotateX(0deg) rotateY(0deg)");

  const handleMove = (event) => {
    if (!canHover || !ref.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 14;
    const rotateX = (0.5 - py) * 14;

    ref.current.style.setProperty("--glow-x", `${(px * 100).toFixed(1)}%`);
    ref.current.style.setProperty("--glow-y", `${(py * 100).toFixed(1)}%`);
    setTransform(`perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`);
  };

  return (
    <div
      ref={ref}
      className={`tilt-frame ${className}`}
      style={{ transform, ...accentVars(accent), ...style }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTransform("perspective(900px) rotateX(0deg) rotateY(0deg)")}
      {...props}
    >
      {children}
    </div>
  );
}

function ProjectCard({ project, index, canHover }) {
  const cardRef = useRef(null);

  const handleMove = (event) => {
    if (!canHover || !cardRef.current) {
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--glow-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    cardRef.current.style.setProperty("--glow-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <TiltCard
      className="reveal-item h-full"
      accent={project.accent}
      canHover={canHover}
      data-reveal="true"
      style={{ "--delay": `${index * 120}ms` }}
    >
      <article
        ref={cardRef}
        className="project-card glass-card flex h-full flex-col justify-between"
        data-cursor="project"
        style={accentVars(project.accent)}
        onMouseMove={handleMove}
      >
        <div className="relative z-[1] flex items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.28em]" style={{ color: project.accent }}>
              {project.tag}
            </p>
            <h3 className="syne tilt-depth text-[clamp(1.5rem,2vw,2.1rem)] font-extrabold leading-none tracking-[-0.04em]">
              {project.name}
            </h3>
          </div>
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.name}`}
            className="project-link"
            data-cursor="button"
          >
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="relative z-[1] mt-8 space-y-6">
          <p className="max-w-[42ch] text-[1rem] leading-7 text-[rgba(240,240,245,0.78)]">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-full px-3 py-2 text-sm font-medium"
                style={{ background: hexToRgba(project.accent, 0.15), color: project.accent }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

function StatCard({ stat, index, canHover }) {
  return (
    <TiltCard accent={index % 2 === 0 ? "#f97316" : "#6366f1"} canHover={canHover}>
      <div className="glass-card rounded-[1.6rem] p-6 lg:p-7">
        <div className="tilt-depth">
          <div className="syne text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-none tracking-[-0.06em]">
            {stat.value}
          </div>
          <p className="mt-3 max-w-[12rem] text-sm leading-6 text-[rgba(240,240,245,0.7)]">{stat.label}</p>
        </div>
      </div>
    </TiltCard>
  );
}

function AdityaPortfolio() {
  const heroRef = useRef(null);
  const workRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const cursorRef = useRef({ dotX: 0, dotY: 0, ringX: 0, ringY: 0, targetX: 0, targetY: 0, mode: "default", visible: false });

  const [heroReady, setHeroReady] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navSolid, setNavSolid] = useState(false);
  const [activeSection, setActiveSection] = useState("work");
  const [menuOpen, setMenuOpen] = useState(false);
  const [counters, setCounters] = useState({ projects: 0, domains: 0, philosophy: 0 });
  const [cursorMode, setCursorMode] = useState("default");
  const [cursorVisible, setCursorVisible] = useState(false);
  const canHover = usePointerCapability();

  useSpotlight(heroRef);
  useSpotlight(workRef);
  useSpotlight(skillsRef);
  useSpotlight(contactRef);

  useEffect(() => {
    const timer = window.setTimeout(() => setHeroReady(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typedCount >= titleSource.length) {
      return undefined;
    }

    const timer = window.setTimeout(() => setTypedCount((count) => count + 1), typedCount === 8 ? 180 : 78);
    return () => window.clearTimeout(timer);
  }, [typedCount]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
      setNavSolid(scrollTop > 60);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const sections = [workRef.current, skillsRef.current, contactRef.current].filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current?.target?.id) {
          setActiveSection(current.target.id);
        }
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-20% 0px -35% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const nodes = Array.from(document.querySelectorAll("[data-reveal='true']"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!skillsRef.current || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    let frame = 0;
    let started = false;
    const target = skillsRef.current;

    const animate = () => {
      const startedAt = performance.now();
      const duration = 1200;
      const tick = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - (1 - progress) * (1 - progress);
        setCounters({
          projects: Math.round(COUNTER_TARGETS[0].value * eased),
          domains: Math.round(COUNTER_TARGETS[1].value * eased),
          philosophy: Math.round(COUNTER_TARGETS[2].value * eased)
        });
        if (progress < 1) {
          frame = window.requestAnimationFrame(tick);
        }
      };
      frame = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          animate();
          observer.disconnect();
        }
      });
    }, { threshold: 0.35 });

    observer.observe(target);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!canHover) {
      return undefined;
    }

    let frame = 0;

    const onMove = (event) => {
      const state = cursorRef.current;
      state.targetX = event.clientX;
      state.targetY = event.clientY;
      state.dotX = event.clientX;
      state.dotY = event.clientY;
      if (!state.visible) {
        state.visible = true;
        setCursorVisible(true);
      }
    };

    const onLeave = () => {
      cursorRef.current.visible = false;
      setCursorVisible(false);
    };

    const onHover = (event) => {
      const nextMode = event.target.closest?.("[data-cursor]")?.getAttribute("data-cursor") || "default";
      cursorRef.current.mode = nextMode;
      setCursorMode((current) => (current === nextMode ? current : nextMode));
    };

    const render = () => {
      const state = cursorRef.current;
      state.ringX += (state.targetX - state.ringX) * 0.18;
      state.ringY += (state.targetY - state.ringY) * 0.18;
      const ringSize = state.mode === "project" ? 56 : state.mode === "button" ? 48 : 32;
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${state.dotX - 3}px, ${state.dotY - 3}px, 0)`;
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${state.ringX - ringSize / 2}px, ${state.ringY - ringSize / 2}px, 0)`;
      }
      frame = window.requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    document.addEventListener("mouseover", onHover);
    document.addEventListener("focusin", onHover);
    frame = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("mouseover", onHover);
      document.removeEventListener("focusin", onHover);
      window.cancelAnimationFrame(frame);
    };
  }, [canHover]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  const typed = titleSource.slice(0, typedCount);
  const [lineOne = "", lineTwo = ""] = typed.split("\n");
  const typingDone = typedCount >= titleSource.length;

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <div className="aditya-portfolio">
      <style>{STYLES}</style>
      <div className="scroll-progress" style={{ "--progress": `${scrollProgress}%` }} />
      <div className="aditya-noise" />
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="orb orb-three" />

      <div
        ref={cursorDotRef}
        className={`cursor-dot ${cursorVisible && canHover ? "is-active" : ""} ${cursorMode !== "default" ? "is-hidden" : ""}`}
      />
      <div
        ref={cursorRingRef}
        className={`cursor-ring ${cursorVisible && canHover ? "is-active" : ""} ${cursorMode === "button" ? "mode-button" : ""} ${cursorMode === "project" ? "mode-project" : ""}`}
      >
        {cursorMode === "project" ? "VIEW" : ""}
      </div>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${navSolid ? "border-b border-white/10 bg-[rgba(8,8,16,0.62)] backdrop-blur-2xl" : "bg-transparent"}`}
      >
        <nav className="mx-auto flex max-w-[var(--max)] items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="syne flex items-center gap-1 text-xl font-extrabold tracking-[0.18em] text-white sm:text-2xl"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-cursor="button"
          >
            <span>ADITYA</span>
            <span className="text-[#f97316]">.</span>
          </button>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nav-link text-sm font-medium ${activeSection === item.id ? "is-active" : ""}`}
                onClick={() => scrollToSection(item.id)}
                data-cursor="button"
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`menu-button lg:hidden ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            data-cursor="button"
          >
            <span />
            <span />
            <span />
          </button>
        </nav>
      </header>

      <div className={`mobile-menu lg:hidden ${menuOpen ? "is-open" : ""}`}>
        <div className="mx-auto flex max-w-xl flex-col gap-6">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="syne text-left text-[clamp(2rem,8vw,3.4rem)] font-extrabold tracking-[-0.06em] text-white"
              onClick={() => scrollToSection(item.id)}
              data-cursor="button"
            >
              {item.label}
            </button>
          ))}
          <MagneticButton
            href="mailto:adityakumar3575@gmail.com"
            className="btn-base btn-primary mt-4 w-full justify-center"
            canHover={canHover}
          >
            Get in touch <span aria-hidden="true">→</span>
          </MagneticButton>
        </div>
      </div>

      <main className="relative z-10">
        <section
          ref={heroRef}
          className="section-wrap relative flex min-h-screen items-center px-5 pb-24 pt-28 sm:px-6 lg:px-8"
        >
          <div className="mx-auto grid max-w-[var(--max)] items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-3xl">
              <div className={`flex flex-wrap gap-3 reveal-item ${heroReady ? "is-visible" : ""}`} style={{ "--delay": "60ms" }}>
                <div className="hero-tag glass-card">
                  <span className="pulse-dot" />
                  <span>Available for serious projects</span>
                </div>
                <div className="hero-tag glass-card">
                  <span className="status-dot" />
                  <span>Currently building: CineStream v9 · Android</span>
                </div>
              </div>

              <div className={`mt-8 reveal-item ${heroReady ? "is-visible" : ""}`} style={{ "--delay": "160ms" }}>
                <h1 className="hero-title syne font-extrabold">
                  <span className="type-line">{lineOne || "\u00A0"}</span>
                  <span className="type-line text-gradient">
                    {lineTwo || "\u00A0"}
                    {!typingDone ? <span className="type-caret" /> : null}
                  </span>
                </h1>
              </div>

              <div className={`hero-copy mt-8 ${typingDone ? "is-visible" : ""}`}>
                <p className="hero-subtitle">
                  I build systems, not just code — Android, AI, ERP, Web. Based in Bhagalpur. Working globally.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                  <MagneticButton
                    href="mailto:adityakumar3575@gmail.com"
                    className="btn-base btn-primary w-full sm:w-auto"
                    canHover={canHover}
                  >
                    Get in touch <span aria-hidden="true">→</span>
                  </MagneticButton>
                  <MagneticButton
                    href="https://github.com/exor-26"
                    external
                    className="btn-base btn-glass w-full sm:w-auto"
                    canHover={canHover}
                  >
                    GitHub
                  </MagneticButton>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="grid gap-5">
                {HERO_STATS.map((stat, index) => (
                  <StatCard key={stat.label} stat={stat} index={index} canHover={canHover} />
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="scroll-indicator"
            onClick={() => scrollToSection("work")}
            aria-label="Scroll to selected work"
            data-cursor="button"
          >
            <span className="text-lg">⌄</span>
          </button>
        </section>

        <section className="px-5 pb-10 sm:px-6 lg:px-8">
          <div className="marquee-shell mx-auto max-w-[var(--max)] space-y-4">
            {MARQUEE_ROWS.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className="marquee-row overflow-hidden"
                data-direction={rowIndex === 1 ? "reverse" : "forward"}
              >
                <div className="marquee-track">
                  {[...row, ...row].map((item, itemIndex) => (
                    <span key={`${item}-${itemIndex}`} className="pill text-sm sm:text-base">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="work" ref={workRef} className="section-wrap px-5 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[var(--max)]">
            <div className="mb-12 max-w-2xl space-y-4">
              <p className="section-kicker">Selected Work</p>
              <h2 className="section-title syne font-extrabold">Things I&apos;ve built</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {PROJECTS.map((project, index) => (
                <ProjectCard key={project.name} project={project} index={index} canHover={canHover} />
              ))}
            </div>
          </div>
        </section>

        <section id="skills" ref={skillsRef} className="section-wrap px-5 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[var(--max)]">
            <div className="mb-12 max-w-2xl space-y-4">
              <p className="section-kicker">Skills</p>
              <h2 className="section-title syne font-extrabold">What I work with</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {COUNTER_TARGETS.map((item, index) => (
                <div
                  key={item.key}
                  className="counter-card glass-card reveal-item"
                  data-reveal="true"
                  style={{ "--delay": `${index * 120}ms` }}
                >
                  <div className="counter-value">
                    {counters[item.key]}
                    {item.suffix}
                  </div>
                  <p className="mt-3 text-sm uppercase tracking-[0.24em] text-[rgba(240,240,245,0.56)]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="glass-card reveal-item mt-8 rounded-[1.75rem] p-5 sm:p-7" data-reveal="true" style={{ "--delay": "120ms" }}>
              <div className="flex flex-wrap gap-3">
                {SKILLS.map((skill) => (
                  <span key={skill} className="pill skill-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="cinema-card glass-card reveal-item mt-8 rounded-[2rem] p-6 sm:p-8 lg:p-10" data-reveal="true" style={{ "--delay": "180ms" }}>
              <div className="grid items-center gap-5 lg:grid-cols-[auto_1fr]">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(249,115,22,0.22),rgba(99,102,241,0.25))] text-5xl shadow-[0_12px_44px_rgba(0,0,0,0.24)] sm:h-28 sm:w-28 lg:mx-0">
                  <span aria-hidden="true">🎬</span>
                </div>
                <div className="space-y-4 text-center lg:text-left">
                  <h3 className="cinema-title syne font-extrabold">
                    Cinematography
                  </h3>
                  <p className="cinema-copy text-[1rem] leading-7 text-[rgba(240,240,245,0.78)]">
                    Beyond code — I shoot and grade cinematic visuals. Creative techniques, visual storytelling.
                    See the work:
                  </p>
                  <MagneticButton
                    href="https://instagram.com/exor_qz"
                    external
                    className="btn-base btn-primary inline-flex w-full justify-center sm:w-auto"
                    canHover={canHover}
                  >
                    @exor_qz
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" ref={contactRef} className="section-wrap px-5 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[var(--max)]">
            <div className="contact-card glass-card reveal-item text-center" data-reveal="true">
              <p className="section-kicker">Let&apos;s Build Something</p>
              <h2 className="section-title syne mt-4 font-extrabold">Got a serious project?</h2>
              <p className="mx-auto mt-6 max-w-2xl text-[clamp(1rem,1.35vw,1.1rem)] leading-8 text-[rgba(240,240,245,0.78)]">
                Clear scope. Proper agreement. Clean execution. No guesswork, no free demos — just real work.
              </p>

              <div className="mt-10 flex flex-col items-stretch justify-center gap-4 lg:flex-row">
                <MagneticButton
                  href="mailto:adityakumar3575@gmail.com"
                  className="btn-base btn-primary w-full lg:w-auto"
                  canHover={canHover}
                >
                  ✉ adityakumar3575@gmail.com
                </MagneticButton>
                <MagneticButton
                  href="https://github.com/exor-26"
                  external
                  className="btn-base btn-glass w-full lg:w-auto"
                  canHover={canHover}
                >
                  github.com/exor-26
                </MagneticButton>
                <MagneticButton
                  href="https://instagram.com/exor_qz"
                  external
                  className="btn-base btn-glass w-full lg:w-auto"
                  canHover={canHover}
                >
                  @exor_qz Instagram
                </MagneticButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 px-5 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[var(--max)] flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center md:flex-row md:text-left">
          <p className="footer-copy">Aditya · Software Architect · Bhagalpur, India</p>
          <p className="footer-copy text-xs uppercase tracking-[0.22em]">Built by me, obviously.</p>
        </div>
      </footer>
    </div>
  );
}

export default AdityaPortfolio;
