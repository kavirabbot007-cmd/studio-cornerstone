/**
 * CRAFTMEN STUDIO — page.tsx
 *
 * INSTALL (run once):
 *   npm install framer-motion @splinetool/react-spline @splinetool/runtime
 *             lucide-react clsx tailwind-merge class-variance-authority
 *             @radix-ui/react-slot
 *
 * FILE STRUCTURE:
 *   app/page.tsx           ← this file
 *   app/globals.css        ← provided globals.css
 *   tailwind.config.ts     ← provided tailwind.config.ts
 *   lib/utils.ts           ← provided utils.ts
 *   components/ui/
 *     splite.tsx
 *     spotlight.tsx
 *     tubelight-navbar.tsx
 *     bento-grid.tsx
 *     button.tsx
 *     card.tsx
 */

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowRight, X, MapPin, Phone, Clock } from "lucide-react";

import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────
   Pexels image helper
───────────────────────────────────────── */
const px = (id: number, w = 1920) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const IMGS = {
  hero:       px(3316922),
  interlude:  px(19846360),
  about:      px(695193, 1200),
  aboutSub:   px(8135502, 600),
  ctaBg:      px(18703869),
  contact:    px(6180674),
  p1:         px(6180674,  900),
  p2:         px(35189706, 900),
  p3:         px(8135502,  900),
  p4:         px(5997959,  900),
  p5:         px(27390284, 900),
  p6:         px(16249146, 900),
  g1:         px(6180674,  600),
  g2:         px(8135502,  600),
  g3:         px(35189706, 600),
  g4:         px(16249146, 600),
  g5:         px(5997959,  600),
  g6:         px(27390284, 600),
};

/* ─────────────────────────────────────────
   FadeIn — performant, runs once
───────────────────────────────────────── */
function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.78, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Eyebrow label
───────────────────────────────────────── */
function Eyebrow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="block w-8 h-px bg-gold flex-shrink-0" />
      <span className="font-sans text-[9px] tracking-[0.34em] uppercase text-gold">
        {text}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Animated counter
───────────────────────────────────────── */
function Counter({
  to, suffix, label, active,
}: {
  to: number; suffix: string; label: string; active: boolean;
}) {
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!active || done.current) return;
    done.current = true;
    const step = Math.ceil(to / 55);
    let cur = 0;
    const id = setInterval(() => {
      cur = Math.min(cur + step, to);
      setVal(cur);
      if (cur >= to) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [active, to]);
  return (
    <FadeIn className="bg-ink-3 border border-gold/[0.07] p-10 text-center hover:bg-ink-4 hover:border-gold/25 hover:-translate-y-1 transition-all duration-400">
      <span className="block font-serif text-[60px] font-light text-cream leading-none">
        {val}{suffix}
      </span>
      <span className="block font-sans text-[9px] tracking-[0.28em] uppercase text-gold mt-2">
        {label}
      </span>
    </FadeIn>
  );
}

/* ─────────────────────────────────────────
   Project card for bento
───────────────────────────────────────── */
function ProjectCard({
  src, title, sub, year, area, tag, onOpen,
}: {
  src: string; title: string; sub: string;
  year: string; area: string; tag: string;
  onOpen: () => void;
}) {
  return (
    <div className="relative w-full h-full overflow-hidden cursor-pointer group" onClick={onOpen}>
      <img
        src={src}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
      />
      {/* Shade */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent transition-opacity duration-500 group-hover:opacity-95" />
      {/* Tag */}
      <span className="absolute top-4 right-4 font-sans text-[8px] tracking-[0.22em] uppercase bg-gold text-ink px-2.5 py-1.5 z-10">
        {tag}
      </span>
      {/* Body */}
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-10">
        <div className="flex gap-3 mb-1.5 font-sans text-[9px] text-gold">
          <span>{year}</span>
          <span className="text-studio-gray-lt">{area}</span>
        </div>
        <h3 className="font-serif text-[22px] font-light text-cream leading-tight">{title}</h3>
        <p className="font-sans text-[10px] text-studio-gray-lt mt-1">{sub}</p>
        <div className="flex items-center gap-2 mt-3 font-sans text-[9px] tracking-[0.2em] uppercase text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          <span>View Project</span>
          <ArrowRight size={12} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const PROJECTS = [
  { src: IMGS.p1, title: "The Kapoor Residence",  sub: "Luxury Living · South Delhi",   year: "2024", area: "4,200 sq ft",  tag: "Residential" },
  { src: IMGS.p2, title: "Opaline Kitchen",        sub: "Contemporary · Gurugram",        year: "2024", area: "980 sq ft",    tag: "Residential" },
  { src: IMGS.p3, title: "The Silk Bedroom",       sub: "Master Suite · Sultanpur",       year: "2024", area: "1,100 sq ft",  tag: "Residential" },
  { src: IMGS.p4, title: "Villa Aranya",           sub: "Complete Villa · Mehrauli",      year: "2023", area: "9,800 sq ft",  tag: "Villa"        },
  { src: IMGS.p5, title: "Obsidian Office HQ",     sub: "Corporate Interiors · Aerocity", year: "2023", area: "6,200 sq ft",  tag: "Commercial"   },
  { src: IMGS.p6, title: "The Marble Spa",         sub: "Wellness Suite · Chanakyapuri",  year: "2022", area: "800 sq ft",    tag: "Hospitality"  },
];

const TESTIMONIALS = [
  { q: "Craftmen Studio didn't just design our home — they gave us a completely new way of living in it. The attention to light alone changed everything.", name: "Priya & Arjun Kapoor", role: "Homeowners, South Delhi",  init: "PK" },
  { q: "Working with them felt like having the world's most articulate friend who understood architecture deeply. Every decision made complete sense.", name: "Kaveri Sharma",        role: "Villa Owner, Sultanpur",    init: "KS" },
  { q: "Our office makes clients ask about the designer before they've even sat down. That's exactly what we wanted — a space that speaks first.", name: "Rahul Nanda",          role: "Founder, Aerocity HQ",      init: "RN" },
  { q: "From concept to handover, Craftmen handled everything. We didn't worry about a single thing. The result was far beyond what we imagined.", name: "Ananya Mehra",         role: "Penthouse Owner, Gurugram", init: "AM" },
];

const NAV_ITEMS = [
  { name: "Home",     url: "#hero"     },
  { name: "Projects", url: "#projects" },
  { name: "Process",  url: "#process"  },
  { name: "Services", url: "#services" },
  { name: "About",    url: "#about"    },
  { name: "Contact",  url: "#contact"  },
];

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function Home() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [navSolid,   setNavSolid]   = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [backTop,    setBackTop]    = useState(false);
  const [counters,   setCounters]   = useState(false);
  const [clock,      setClock]      = useState("");
  const [lightbox,   setLightbox]   = useState<string | null>(null);
  const [activeNav,  setActiveNav]  = useState("Home");

  /* ── Scroll (passive, rAF-throttled) ── */
  useEffect(() => {
    let raf = 0;
    const sections: [string, string][] = [
      ["hero","Home"],["projects","Projects"],["process","Process"],
      ["services","Services"],["about","About"],["contact","Contact"],
    ];

    const handler = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y    = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        setNavSolid(y > 60);
        setBackTop(y > 500);
        setProgress(docH > 0 ? (y / docH) * 100 : 0);

        // counters trigger
        const statsEl = document.getElementById("stats");
        if (statsEl && !counters && statsEl.getBoundingClientRect().top < window.innerHeight * 0.85)
          setCounters(true);

        // active nav
        sections.forEach(([id, label]) => {
          const el = document.getElementById(id);
          if (el) {
            const r = el.getBoundingClientRect();
            if (r.top <= 180 && r.bottom > 180) setActiveNav(label);
          }
        });
      });
    };

    window.addEventListener("scroll", handler, { passive: true });
    return () => { window.removeEventListener("scroll", handler); cancelAnimationFrame(raf); };
  }, [counters]);

  /* ── IST Clock ── */
  useEffect(() => {
    const tick = () => {
      const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
      const ist = new Date(utc + 19800000);
      const p   = (n: number) => n.toString().padStart(2, "0");
      setClock(`${p(ist.getHours())}:${p(ist.getMinutes())}:${p(ist.getSeconds())} IST`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* ── ESC closes overlays ── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMenuOpen(false); setLightbox(null); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <>
      {/* ── Progress bar ── */}
      <div
        className="scroll-progress transition-[width_.1s_linear]"
        style={{ width: `${progress}%` }}
      />

      {/* ── Back to top ── */}
      <AnimatePresence>
        {backTop && (
          <motion.button
            className="fixed bottom-8 right-8 z-[400] w-11 h-11 bg-ink-3 border border-gold/30 text-gold flex items-center justify-center text-lg hover:bg-gold hover:text-ink hover:border-gold transition-colors duration-300"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════
          NAVBAR
      ════════════════════════════════════ */}
      <nav className={cn(
        "fixed top-0 w-full flex items-center gap-6 z-[500] transition-all duration-400",
        navSolid
          ? "px-14 py-3.5 bg-ink/92 backdrop-blur-[28px] border-b border-gold/10"
          : "px-14 py-6"
      )}>
        {/* Logo */}
        <a href="#" className="flex flex-col leading-none mr-auto flex-shrink-0 no-underline">
          <span className="font-sans font-light text-[9px] tracking-[0.5em] uppercase text-gold">Interior Architecture</span>
          <span className="font-serif text-[21px] font-normal text-cream tracking-wide">Craftmen Studio</span>
        </a>

        {/* Tubelight nav */}
        <NavBar items={NAV_ITEMS} />

        <span className="font-sans text-[10px] tracking-[0.14em] text-studio-gray font-[variant-numeric:tabular-nums] whitespace-nowrap hidden lg:block">
          {clock}
        </span>
        <a href="#contact" className="hidden md:inline-flex font-sans text-[9px] tracking-[0.26em] uppercase text-ink bg-gold px-5 py-2.5 hover:bg-gold-light transition-colors duration-300 flex-shrink-0">
          Enquire
        </a>
        <button
          className="flex flex-col gap-[5px] md:hidden bg-transparent border-0 cursor-pointer p-1"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <span className="block w-6 h-px bg-cream" />
          <span className="block w-6 h-px bg-cream" />
          <span className="block w-6 h-px bg-cream" />
        </button>
      </nav>

      {/* ════════════════════════════════════
          FULLSCREEN MENU
      ════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[800] bg-ink-2 flex flex-col justify-center px-14 py-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <button
              className="absolute top-6 right-14 text-gold hover:rotate-90 transition-transform duration-300 bg-transparent border-0 cursor-pointer"
              onClick={() => setMenuOpen(false)}
            >
              <X size={26} />
            </button>
            <div className="flex flex-col">
              {[["#projects","01","Projects"],["#process","02","Process"],["#services","03","Services"],["#about","04","About"],["#contact","05","Contact"]].map(
                ([href, num, label], i) => (
                  <motion.a
                    key={href}
                    href={href}
                    className="flex items-center gap-5 py-4 border-b border-gold/10 text-cream hover:text-gold no-underline transition-colors duration-300"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, ease: [0.16,1,.3,1] }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="font-sans text-[9px] tracking-[0.22em] text-gold w-6">{num}</span>
                    <span className="font-serif text-[42px] font-light flex-1">{label}</span>
                    <ArrowRight size={18} className="text-gold" />
                  </motion.a>
                )
              )}
            </div>
            <div className="absolute bottom-8 left-14 flex flex-col gap-1 font-sans text-[11px] text-studio-gray">
              <span>+91 98717 66962</span>
              <span>350, MG Rd, Sultanpur, New Delhi 110030</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════
          HERO — Spline 3D + Spotlight
      ════════════════════════════════════ */}
      <section id="hero" className="relative h-screen min-h-[700px] flex items-end overflow-hidden">
        {/* Spline */}
        <div className="absolute inset-0 z-[1]">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
        {/* Fallback photo */}
        <img src={IMGS.hero} alt="" className="absolute inset-0 w-full h-full object-cover z-0 opacity-50" />
        {/* Aceternity spotlight */}
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 z-[2]" />
        {/* Overlay */}
        <div className="absolute inset-0 z-[3] bg-gradient-to-br from-ink/90 via-ink/35 to-ink/65" />
        {/* Grain */}
        <div className="absolute inset-0 z-[4] opacity-[0.04] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')] bg-[length:180px]" />

        {/* Content */}
        <div className="relative z-[5] px-14 pb-20 max-w-[1080px] w-full">
          <FadeIn delay={0.18}>
            <Eyebrow text="New Delhi · Est. 2019 · Interior Architecture" />
          </FadeIn>
          <h1 className="font-serif font-light leading-[0.9] text-cream mb-6">
            <FadeIn delay={0.3}>
              <span className="block text-[clamp(68px,10.5vw,156px)]">Craftmen</span>
            </FadeIn>
            <FadeIn delay={0.5}>
              <span className="block text-[clamp(68px,10.5vw,156px)] pl-16 italic text-gold-light">Studio</span>
            </FadeIn>
          </h1>
          <FadeIn delay={0.68}>
            <p className="font-sans font-light text-sm text-cream/60 leading-[1.75] max-w-[360px] mb-8">
              We design the spaces you come home to. Bespoke interior architecture built on material mastery, spatial logic, and an obsessive pursuit of beauty.
            </p>
          </FadeIn>
          <FadeIn delay={0.82}>
            <div className="flex items-center gap-6 mb-9">
              <a href="#projects" className="inline-flex items-center gap-3 bg-gold text-ink font-sans text-[10px] font-medium tracking-[0.22em] uppercase px-6 py-3.5 hover:bg-gold-light hover:gap-5 transition-all duration-300 no-underline">
                View Projects <ArrowRight size={14} />
              </a>
              <a href="#about" className="font-sans text-[11px] tracking-[0.14em] text-cream/40 hover:text-gold transition-colors duration-300 no-underline">
                Our Practice →
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={0.94}>
            <div className="flex items-center pt-6 border-t border-gold/15 max-w-[340px]">
              {[["24+","Projects"],["5+","Years"],["100%","Bespoke"]].map(([n, l], i) => (
                <div key={l} className={cn("flex-1", i < 2 && "pr-4 mr-4 border-r border-gold/15")}>
                  <span className="block font-serif text-[30px] font-light text-cream leading-none">{n}</span>
                  <span className="block font-sans text-[8px] tracking-[0.25em] uppercase text-gold mt-1">{l}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Scroll indicator */}
        <div className="absolute right-8 bottom-20 z-[5] flex flex-col items-center gap-2.5 font-sans text-[8px] tracking-[0.35em] uppercase text-studio-gray">
          <div className="w-px h-13 bg-cream/10 overflow-hidden relative">
            <div className="w-px h-[40%] bg-gold animate-scroll-bar absolute" />
          </div>
          <span>Scroll</span>
        </div>

        {/* Bottom tagline */}
        <div className="absolute bottom-0 left-0 right-0 z-[5] px-14 py-3 bg-ink/50 backdrop-blur-[10px] border-t border-gold/10 font-sans text-[9px] tracking-[0.28em] uppercase text-cream/30 hidden md:flex justify-center gap-4">
          <span>Interior Architecture</span>
          <span className="text-gold text-[6px]">◆</span>
          <span>Spatial Design</span>
          <span className="text-gold text-[6px]">◆</span>
          <span>New Delhi</span>
        </div>
      </section>

      {/* ════════════════════════════════════
          MARQUEE
      ════════════════════════════════════ */}
      <div className="overflow-hidden bg-ink-2 border-y border-gold/[0.12] py-3">
        <div className="flex w-max animate-marquee">
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className="flex items-center gap-4 px-2 font-sans text-[9.5px] tracking-[0.28em] uppercase text-studio-gray whitespace-nowrap">
              <span className="text-gold text-[7px]">◈</span><span>Residential Design</span>
              <span className="text-gold text-[7px]">◈</span><span>Commercial Interiors</span>
              <span className="text-gold text-[7px]">◈</span><span>Turnkey Projects</span>
              <span className="text-gold text-[7px]">◈</span><span>Luxury Spaces</span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════
          STATS
      ════════════════════════════════════ */}
      <section id="stats" className="px-14 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] mb-16">
          <Counter to={24}  suffix="+" label="Projects Completed" active={counters} />
          <Counter to={5}   suffix="+" label="Years of Practice"  active={counters} />
          <Counter to={100} suffix="%" label="Bespoke Design"     active={counters} />
          <Counter to={14}  suffix=""  label="Industry Awards"    active={counters} />
        </div>
        <FadeIn className="flex items-center gap-10">
          <span className="flex-1 h-px bg-gold/16" />
          <p className="font-serif text-[19px] font-light text-studio-gray-lt text-center max-w-[520px] leading-[1.65] flex-shrink-0">
            Every project begins with a single question:<br />
            <em className="text-gold-light">How do you want to feel when you come home?</em>
          </p>
          <span className="flex-1 h-px bg-gold/16" />
        </FadeIn>
      </section>

      {/* ════════════════════════════════════
          PROJECTS — BENTO GRID
      ════════════════════════════════════ */}
      <section id="projects" className="px-14 py-24">
        <FadeIn><Eyebrow text="Selected Work / 2022–2024" /></FadeIn>
        <div className="flex items-start gap-20 mb-13">
          <FadeIn>
            <h2 className="font-serif font-light text-[clamp(42px,5.5vw,84px)] leading-[1.0] text-cream">
              Case<br /><em className="italic text-gold-light">Studies</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="font-sans text-sm font-light text-studio-gray-lt leading-[1.85] max-w-[400px] pt-3">
            Six spaces that define our range — from intimate master suites to sprawling villas. Each one built over months of deep collaboration.
          </FadeIn>
        </div>

        {/* Bento grid — 12 col */}
        <BentoGrid className="grid-cols-12" style={{ gridAutoRows: "420px" } as React.CSSProperties}>
          {/* Row 1 */}
          <BentoCard className="col-span-7" style={{ gridRow: 1 } as React.CSSProperties}>
            <FadeIn className="w-full h-full" delay={0}>
              <ProjectCard {...PROJECTS[0]} onOpen={() => setLightbox(PROJECTS[0].src)} />
            </FadeIn>
          </BentoCard>
          <BentoCard className="col-span-5" style={{ gridRow: 1 } as React.CSSProperties}>
            <FadeIn className="w-full h-full" delay={0.06}>
              <ProjectCard {...PROJECTS[1]} onOpen={() => setLightbox(PROJECTS[1].src)} />
            </FadeIn>
          </BentoCard>
          {/* Row 2 */}
          <BentoCard className="col-span-5" style={{ gridRow: 2, marginTop: "60px" } as React.CSSProperties}>
            <FadeIn className="w-full h-full" delay={0.12}>
              <ProjectCard {...PROJECTS[2]} onOpen={() => setLightbox(PROJECTS[2].src)} />
            </FadeIn>
          </BentoCard>
          <BentoCard className="col-span-7" style={{ gridRow: 2 } as React.CSSProperties}>
            <FadeIn className="w-full h-full" delay={0.18}>
              <ProjectCard {...PROJECTS[3]} onOpen={() => setLightbox(PROJECTS[3].src)} />
            </FadeIn>
          </BentoCard>
          {/* Row 3 */}
          <BentoCard className="col-span-6" style={{ gridRow: 3 } as React.CSSProperties}>
            <FadeIn className="w-full h-full" delay={0.22}>
              <ProjectCard {...PROJECTS[4]} onOpen={() => setLightbox(PROJECTS[4].src)} />
            </FadeIn>
          </BentoCard>
          <BentoCard className="col-span-6" style={{ gridRow: 3 } as React.CSSProperties}>
            <FadeIn className="w-full h-full" delay={0.28}>
              <ProjectCard {...PROJECTS[5]} onOpen={() => setLightbox(PROJECTS[5].src)} />
            </FadeIn>
          </BentoCard>
        </BentoGrid>
      </section>

      {/* ════════════════════════════════════
          INTERLUDE QUOTE (CSS only parallax)
      ════════════════════════════════════ */}
      <div className="relative h-[520px] overflow-hidden flex items-center justify-center">
        <img
          src={IMGS.interlude}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110"
          style={{ transform: "scale(1.1)" }}
        />
        <div className="absolute inset-0 bg-ink/72" />
        <FadeIn className="relative z-10 text-center px-10 max-w-[680px]">
          <span className="font-serif text-[80px] text-gold opacity-20 leading-[0.5] block mb-1">"</span>
          <p className="font-serif text-[clamp(22px,3vw,42px)] font-light italic text-cream leading-[1.45]">
            We don't decorate spaces.<br />We craft experiences<br />that outlast the moment.
          </p>
          <span className="block font-sans text-[9px] tracking-[0.3em] uppercase text-gold mt-6">
            — Founder, Craftmen Studio
          </span>
        </FadeIn>
      </div>

      {/* ════════════════════════════════════
          PROCESS
      ════════════════════════════════════ */}
      <section id="process" className="px-14 py-24 bg-ink-2">
        <FadeIn><Eyebrow text="How We Work" /></FadeIn>
        <FadeIn>
          <h2 className="font-serif font-light text-[clamp(42px,5.5vw,84px)] leading-[1.0] text-cream mb-14">
            The <em className="italic text-gold-light">Process</em>
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[2px]">
          {[
            { n:"01", icon:"◎", title:"Discovery",  desc:"An extended conversation — in person, not on a form. We listen to how you live, what you love, and what you've never been able to articulate." },
            { n:"02", icon:"◈", title:"Concept",    desc:"A spatial manifesto: mood boards, material palettes, and hand-drawn sketches. Nothing is presented until it has a clear point of view." },
            { n:"03", icon:"◫", title:"Design",     desc:"Technical drawings, 3D renders, and full walkthroughs. Every dimension and material resolved before a single nail is struck." },
            { n:"04", icon:"◉", title:"Execution",  desc:"We coordinate every contractor and timeline. You arrive on handover day to a finished home — not a project site." },
          ].map((s, i) => (
            <FadeIn key={i} delay={i * 0.09} className="bg-ink-3 border border-gold/[0.07] p-9 relative overflow-hidden hover:bg-ink-4 hover:-translate-y-1 transition-all duration-400 group">
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gold group-hover:w-full transition-[width_.6s]" />
              <div className="flex items-center gap-3 mb-5">
                <span className="font-sans text-[9px] tracking-[0.3em] text-gold">{s.n}</span>
                <span className="flex-1 h-px bg-gold/18" />
              </div>
              <p className="text-[20px] text-gold-light mb-3">{s.icon}</p>
              <h3 className="font-serif text-[26px] font-light text-cream mb-3">{s.title}</h3>
              <p className="font-sans text-[13px] font-light text-studio-gray-lt leading-[1.85]">{s.desc}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          SERVICES
      ════════════════════════════════════ */}
      <section id="services" className="px-14 py-24 grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-20">
        <div className="lg:sticky lg:top-[100px] self-start">
          <FadeIn><Eyebrow text="What We Offer" /></FadeIn>
          <FadeIn>
            <h2 className="font-serif font-light text-[clamp(42px,5.5vw,84px)] leading-[1.0] text-cream mb-5">
              Our <em className="italic text-gold-light">Services</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="font-sans text-sm font-light text-studio-gray-lt leading-[1.85] max-w-[310px] mb-8">
              Whether furnishing a single room or orchestrating a 10,000 sq ft villa, we bring the same obsessive attention to every square foot.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <a href="#contact" className="inline-flex items-center gap-3 bg-gold text-ink font-sans text-[10px] font-medium tracking-[0.22em] uppercase px-6 py-3.5 hover:bg-gold-light hover:gap-5 transition-all duration-300 no-underline">
              Start a Project <ArrowRight size={14} />
            </a>
          </FadeIn>
        </div>
        <div>
          {[
            { n:"01", title:"Residential Design",  tags:["Apartments","Villas","Farmhouses","Penthouses"], desc:"Tailored interiors that feel unmistakably yours — built on your aesthetic instincts and our spatial expertise." },
            { n:"02", title:"Commercial Interiors", tags:["Offices","Hotels","Retail","Restaurants"],       desc:"Environments that communicate brand personality through space — where architecture does the work before a word is spoken." },
            { n:"03", title:"Turnkey Execution",    tags:["Concept","Build","Furnish","Handover"],          desc:"We manage every contractor, vendor, and timeline. You arrive to a finished space, not a project site." },
            { n:"04", title:"Renovation & Refresh", tags:["Remodels","Lighting","FF&E","Art Curation"],     desc:"Precise interventions for spaces that need reimagining — not a renovation for renovation's sake." },
          ].map((s, i) => (
            <FadeIn key={i} delay={i * 0.08} className="border-b border-gold/10 py-6 group cursor-default relative hover:bg-gold/[0.025] px-2 transition-colors duration-500">
              <div className="flex items-center gap-4">
                <span className="font-sans text-[9px] tracking-[0.22em] text-gold w-5">{s.n}</span>
                <h3 className="font-serif text-[24px] font-light text-cream flex-1">{s.title}</h3>
                <span className="text-[22px] text-gold font-light w-5 text-right group-hover:rotate-45 transition-transform duration-300">+</span>
              </div>
              <div className="hidden group-hover:block pl-9 pt-3">
                <p className="font-sans text-[13px] font-light text-studio-gray-lt leading-[1.85] mb-3">{s.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map(t => (
                    <span key={t} className="font-sans text-[8px] tracking-[0.2em] uppercase text-gold border border-gold/30 px-2.5 py-1">{t}</span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          ABOUT
      ════════════════════════════════════ */}
      <section id="about" className="px-14 py-24 grid grid-cols-1 lg:grid-cols-2 gap-18 items-center bg-ink-2">
        <FadeIn className="relative">
          <div className="overflow-hidden">
            <img src={IMGS.about} alt="Craftmen Studio" loading="lazy" className="w-full aspect-[3/4] object-cover hover:scale-[1.04] transition-transform duration-[1s]" />
          </div>
          <div className="absolute bottom-[-28px] right-[-28px] w-[40%] border-[3px] border-ink overflow-hidden">
            <img src={IMGS.aboutSub} alt="Interior detail" loading="lazy" className="w-full aspect-square object-cover" />
          </div>
          <div className="absolute top-7 left-[-18px] bg-ink-3 border border-gold/25 px-4 py-3.5 text-center">
            <span className="block font-serif text-[38px] font-light text-gold leading-none">5+</span>
            <span className="block font-sans text-[8px] tracking-[0.25em] uppercase text-studio-gray-lt mt-1">Years</span>
          </div>
        </FadeIn>
        <div>
          <FadeIn><Eyebrow text="The Practice" /></FadeIn>
          <FadeIn>
            <h2 className="font-serif font-light text-[clamp(42px,5.5vw,84px)] leading-[1.0] text-cream mb-5">
              About <em className="italic text-gold-light">Craftmen</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="font-sans text-sm font-light text-studio-gray-lt leading-[1.95] mb-5">
              Craftmen Studio is a design practice based in Sultanpur, New Delhi, specialising in bespoke interior architecture and luxury spatial design. We work at the intersection of Indian craft tradition and contemporary European sensibility.
            </p>
          </FadeIn>
          <FadeIn delay={0.18}>
            <p className="font-sans text-sm font-light text-studio-gray-lt leading-[1.95] mb-8">
              Founded on a single conviction: interior architecture is not decoration. It is the structure of daily experience. We design for the way light moves through a room at 6pm, for the feeling of a corridor that makes you slow down.
            </p>
          </FadeIn>
          <FadeIn delay={0.26} className="flex gap-9 pt-7 border-t border-gold/16">
            {[["24+","Projects"],["5+","Years"],["100%","Bespoke"]].map(([n, l]) => (
              <div key={l}>
                <span className="block font-serif text-[36px] font-light text-cream leading-none">{n}</span>
                <span className="block font-sans text-[8px] tracking-[0.25em] uppercase text-gold mt-1">{l}</span>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════
          GALLERY
      ════════════════════════════════════ */}
      <section className="px-14 py-24">
        <FadeIn><Eyebrow text="Visual Diary" /></FadeIn>
        <div className="flex items-start gap-18 mb-12">
          <FadeIn>
            <h2 className="font-serif font-light text-[clamp(42px,5.5vw,84px)] leading-[1.0] text-cream">
              Spaces We've <em className="italic text-gold-light">Imagined</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="font-sans text-sm font-light text-studio-gray-lt leading-[1.85] max-w-[380px] pt-3">
            A glimpse into the textures, volumes, and light we work with — every image a chapter in an ongoing story of spatial craft.
          </FadeIn>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] gap-[3px]">
          {[
            { src: IMGS.g1, label: "Golden Living Room", span: "row-span-2" },
            { src: IMGS.g2, label: "Marble Kitchen",      span: ""           },
            { src: IMGS.g3, label: "Master Bedroom",      span: "col-span-2" },
            { src: IMGS.g4, label: "Spa Bathroom",        span: ""           },
            { src: IMGS.g5, label: "Grand Staircase",     span: ""           },
            { src: IMGS.g6, label: "Modern Culinary",     span: "row-span-2" },
          ].map((g, i) => (
            <FadeIn key={i} delay={i * 0.06} className={cn("overflow-hidden relative cursor-pointer group bg-ink-3", g.span)}>
              <img src={g.src} alt={g.label} loading="lazy" className="absolute inset-0 w-full h-full object-cover brightness-90 transition-[transform,filter] duration-[1s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06] group-hover:brightness-100" />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/45 transition-colors duration-400 flex items-end justify-between p-4 opacity-0 group-hover:opacity-100">
                <span className="font-serif text-[14px] font-light italic text-cream">{g.label}</span>
                <ArrowRight size={16} className="text-gold" />
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          MATERIALS
      ════════════════════════════════════ */}
      <div className="px-14 py-16 border-y border-gold/10">
        <FadeIn><Eyebrow text="Signature Materials" /></FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-[2px] mt-6">
          {[["Marble","Nero Marquina"],["Timber","White Oak"],["Metal","Brushed Brass"],["Finish","Venetian Plaster"],["Textile","Aged Leather"],["Stone","Onyx"]].map(([t, n], i) => (
            <FadeIn key={i} delay={i * 0.07} className="bg-ink-3 border border-gold/[0.07] px-4 py-6 text-center hover:bg-ink-4 hover:border-gold/30 hover:-translate-y-1 transition-all duration-350">
              <span className="block font-sans text-[8px] tracking-[0.28em] uppercase text-gold mb-2">{t}</span>
              <span className="block font-serif text-[15px] font-light text-cream">{n}</span>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════
          TESTIMONIALS — BENTO GRID
      ════════════════════════════════════ */}
      <section className="px-14 py-24 bg-ink-2">
        <FadeIn><Eyebrow text="Client Voices" /></FadeIn>
        <FadeIn className="mb-12">
          <h2 className="font-serif font-light text-[clamp(42px,5.5vw,84px)] leading-[1.0] text-cream">
            What They <em className="italic text-gold-light">Say</em>
          </h2>
        </FadeIn>
        <BentoGrid className="grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <BentoCard className="p-9 relative hover:bg-ink-4 hover:-translate-y-1 transition-all duration-400 group">
                <span className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <span className="font-serif text-[60px] text-gold opacity-20 leading-[0.6] block">"</span>
                <p className="font-serif text-[16px] font-light italic text-cream leading-[1.65] mb-6">{t.q}</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-gold-dark flex items-center justify-center font-serif text-[13px] text-ink flex-shrink-0">
                    {t.init}
                  </div>
                  <div>
                    <span className="block font-sans text-[12px] font-medium text-cream">{t.name}</span>
                    <span className="block font-sans text-[9px] tracking-[0.1em] text-gold mt-0.5">{t.role}</span>
                  </div>
                </div>
              </BentoCard>
            </FadeIn>
          ))}
          {/* Gold stat card */}
          <FadeIn delay={0.36}>
            <BentoCard className="bg-gold border-0 flex flex-col items-center justify-center p-9 gap-2">
              <span className="font-serif text-[56px] font-light text-ink leading-none">24+</span>
              <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-ink/70">Happy Clients</span>
            </BentoCard>
          </FadeIn>
          <FadeIn delay={0.44}>
            <BentoCard className="flex flex-col items-center justify-center p-9 gap-2">
              <span className="font-serif text-[52px] font-light text-gold leading-none">14</span>
              <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-studio-gray-lt">Industry Awards</span>
            </BentoCard>
          </FadeIn>
        </BentoGrid>
      </section>

      {/* ════════════════════════════════════
          FAQ
      ════════════════════════════════════ */}
      <section className="px-14 py-24 grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-20">
        <div>
          <FadeIn><Eyebrow text="Common Questions" /></FadeIn>
          <FadeIn>
            <h2 className="font-serif font-light text-[clamp(42px,5.5vw,84px)] leading-[1.0] text-cream">
              Frequently <em className="italic text-gold-light">Asked</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="font-sans text-sm font-light text-studio-gray-lt leading-[1.85] mt-5 max-w-[300px]">
              Everything you need to know before we begin — answered honestly, without jargon.
            </p>
          </FadeIn>
        </div>
        <div>
          {[
            { q: "How long does a residential project take?",          a: "A complete interior from first meeting to handover typically takes 4–8 months depending on scope. All timelines are mapped in our initial proposal." },
            { q: "Do you work outside Delhi?",                         a: "Yes — we take projects across India. We've worked in Mumbai, Bangalore, Goa, and Chandigarh. Travel and coordination costs are included in the project proposal." },
            { q: "What is your minimum project budget?",               a: "We work with a minimum execution budget of ₹45 lakhs for residential and ₹60 lakhs for commercial projects. Smaller consultancy engagements are available case-by-case." },
            { q: "Can we see the design before construction begins?",  a: "Absolutely. Our design phase includes full 3D renders, virtual walkthroughs, and material samples. Nothing is executed without your written approval." },
            { q: "How involved do we need to be during execution?",    a: "As involved as you prefer. We handle all contractor communication and on-site management daily. Most clients choose weekly updates and bi-weekly site visits." },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.07}>
              <details className="border-b border-gold/10 group">
                <summary className="flex justify-between items-center gap-4 py-5 font-sans text-sm font-light text-cream cursor-pointer hover:text-gold-light list-none transition-colors duration-300">
                  <span>{item.q}</span>
                  <span className="text-[22px] text-gold font-light flex-shrink-0 group-open:rotate-45 transition-transform duration-300">+</span>
                </summary>
                <p className="font-sans text-[13px] font-light text-studio-gray-lt leading-[1.85] pb-5">{item.a}</p>
              </details>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          CTA BAND
      ════════════════════════════════════ */}
      <div className="relative px-14 py-24 flex items-center justify-center overflow-hidden">
        <img src={IMGS.ctaBg} alt="" className="absolute inset-0 w-full h-full object-cover saturate-50" />
        <div className="absolute inset-0 bg-ink/88" />
        <FadeIn className="relative z-10 text-center flex flex-col items-center gap-6">
          <span className="font-sans text-[9px] tracking-[0.38em] uppercase text-gold">Ready to Begin?</span>
          <h2 className="font-serif font-light text-[clamp(32px,5vw,68px)] text-cream leading-[1.1]">
            Your space is waiting<br /><em className="italic text-gold-light">to be transformed.</em>
          </h2>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <a href="#contact" className="inline-flex items-center gap-3 bg-gold text-ink font-sans text-[10px] font-medium tracking-[0.22em] uppercase px-6 py-3.5 hover:bg-gold-light hover:gap-5 transition-all duration-300 no-underline">
              Start a Conversation <ArrowRight size={14} />
            </a>
            <a href="tel:+919871766962" className="font-sans text-[13px] tracking-[0.08em] text-cream/45 hover:text-gold transition-colors duration-300 no-underline">
              +91 98717 66962
            </a>
          </div>
        </FadeIn>
      </div>

      {/* ════════════════════════════════════
          CONTACT
      ════════════════════════════════════ */}
      <section id="contact" className="relative min-h-[740px] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img src={IMGS.contact} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/97 via-ink/88 to-ink/65" />
        </div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-18 px-14 py-24 w-full max-w-[1400px]">
          <div>
            <FadeIn><Eyebrow text="Begin a Conversation" /></FadeIn>
            <FadeIn>
              <h2 className="font-serif font-light text-[clamp(42px,5.5vw,84px)] leading-[1.0] text-cream mb-9">
                Let's Create<br /><em className="italic text-gold-light">Something</em><br />Extraordinary
              </h2>
            </FadeIn>
            <FadeIn delay={0.12} className="flex flex-col gap-5">
              {[
                { icon: <MapPin size={13} />, key: "Studio", val: "350, Mehrauli-Gurgaon Road, Sultanpur\nNew Delhi, Delhi 110030" },
                { icon: <Phone size={13} />,  key: "Phone",  val: "+91 98717 66962", href: "tel:+919871766962" },
                { icon: <Clock size={13} />,  key: "Hours",  val: "Mon–Sat, 10am–7pm IST" },
              ].map(({ icon, key, val, href }) => (
                <div key={key} className="flex items-start gap-3">
                  <span className="text-gold mt-0.5 flex-shrink-0">{icon}</span>
                  <div>
                    <span className="block font-sans text-[8px] tracking-[0.3em] uppercase text-gold mb-1">{key}</span>
                    {href ? (
                      <a href={href} className="font-sans text-sm font-light text-cream/60 hover:text-gold transition-colors duration-300 no-underline whitespace-pre-line">{val}</a>
                    ) : (
                      <span className="font-sans text-sm font-light text-cream/60 whitespace-pre-line">{val}</span>
                    )}
                  </div>
                </div>
              ))}
            </FadeIn>
          </div>

          <FadeIn delay={0.2} className="bg-ink-2/90 backdrop-blur-[24px] border border-gold/14 p-9">
            <p className="font-serif text-[22px] font-light text-cream mb-6">Send an Enquiry</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {[["Full Name","Your name","text"],["Email","your@email.com","email"]].map(([l, p, t]) => (
                <div key={l} className="flex flex-col gap-1.5">
                  <label className="font-sans text-[8px] tracking-[0.28em] uppercase text-gold">{l}</label>
                  <input type={t} placeholder={p} className="bg-cream/[0.04] border border-gold/16 px-3 py-2.5 text-cream font-sans text-[13px] font-light outline-none placeholder:text-studio-gray focus:border-gold focus:bg-gold/5 transition-colors duration-300 w-full" />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5 mb-3">
              <label className="font-sans text-[8px] tracking-[0.28em] uppercase text-gold">Phone</label>
              <input type="tel" placeholder="+91 00000 00000" className="bg-cream/[0.04] border border-gold/16 px-3 py-2.5 text-cream font-sans text-[13px] font-light outline-none placeholder:text-studio-gray focus:border-gold focus:bg-gold/5 transition-colors duration-300 w-full" />
            </div>
            <div className="flex flex-col gap-1.5 mb-3">
              <label className="font-sans text-[8px] tracking-[0.28em] uppercase text-gold">Project Type</label>
              <select className="bg-cream/[0.04] border border-gold/16 px-3 py-2.5 text-cream font-sans text-[13px] font-light outline-none focus:border-gold focus:bg-gold/5 transition-colors duration-300 w-full appearance-none">
                <option value="">Select a service</option>
                <option>Residential Design</option>
                <option>Commercial Interiors</option>
                <option>Turnkey Project</option>
                <option>Renovation &amp; Refresh</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="font-sans text-[8px] tracking-[0.28em] uppercase text-gold">About Your Project</label>
              <textarea rows={4} placeholder="Location, area, budget range, timeline…" className="bg-cream/[0.04] border border-gold/16 px-3 py-2.5 text-cream font-sans text-[13px] font-light outline-none placeholder:text-studio-gray focus:border-gold focus:bg-gold/5 transition-colors duration-300 w-full resize-y" />
            </div>
            <button className="inline-flex items-center gap-3 bg-gold text-ink font-sans text-[10px] font-medium tracking-[0.22em] uppercase px-7 py-3.5 border-0 cursor-pointer hover:bg-gold-light hover:gap-5 transition-all duration-300">
              Send Enquiry <ArrowRight size={15} />
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════
          MAP
      ════════════════════════════════════ */}
      <div className="relative h-[380px]">
        <iframe
          src="https://maps.google.com/maps?q=350+Mehrauli+Gurgaon+Road+Sultanpur+New+Delhi&t=&z=14&ie=UTF8&iwloc=&output=embed"
          title="Craftmen Studio Location"
          className="w-full h-full border-0 block grayscale contrast-75 brightness-[0.62]"
        />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(8,7,6,.85)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <div className="w-3 h-3 bg-gold rounded-full animate-pin-pulse" />
          <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-cream bg-ink/82 border border-gold/20 px-3 py-1.5 whitespace-nowrap">
            Craftmen Studio · Sultanpur, New Delhi
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════
          FOOTER
      ════════════════════════════════════ */}
      <footer className="px-14 pt-18 pb-8 bg-ink-2 border-t border-gold/10">
        <div className="flex justify-between items-start mb-14 pb-14 border-b border-gold/9 gap-12 flex-wrap">
          <div>
            <span className="block font-serif text-[28px] font-light text-cream">
              Craftmen <em className="italic text-gold-light">Studio</em>
            </span>
            <p className="font-sans text-[10px] tracking-[0.13em] text-studio-gray mt-1.5">
              Interior Architecture &amp; Spatial Design · New Delhi
            </p>
          </div>
          <div className="flex gap-12 flex-wrap">
            {[
              { heading: "Navigation",  items: [["Projects","#projects"],["Process","#process"],["Services","#services"],["About","#about"],["Contact","#contact"]] },
              { heading: "Services",    items: [["Residential Design","#services"],["Commercial Interiors","#services"],["Turnkey Projects","#services"],["Renovation","#services"]] },
              { heading: "Contact",     items: [["+91 98717 66962","tel:+919871766962"],["350, MG Rd, Sultanpur",""],["New Delhi, Delhi 110030",""],["Mon–Sat 10am–7pm",""]] },
            ].map(({ heading, items }) => (
              <div key={heading} className="flex flex-col gap-2.5">
                <span className="font-sans text-[8px] tracking-[0.36em] uppercase text-gold mb-1">{heading}</span>
                {items.map(([label, href]) => (
                  href
                    ? <a key={label} href={href} className="font-sans text-[12px] font-light text-studio-gray hover:text-cream transition-colors duration-300 no-underline">{label}</a>
                    : <span key={label} className="font-sans text-[12px] font-light text-studio-gray">{label}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between font-sans text-[10px] text-cream/20 flex-wrap gap-2">
          <span>© 2026 Craftmen Studio — All rights reserved</span>
          <em className="not-italic">Crafted with intention, not automation</em>
        </div>
      </footer>

      {/* ════════════════════════════════════
          LIGHTBOX
      ════════════════════════════════════ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[10000] bg-ink/96 flex items-center justify-center backdrop-blur-[14px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 text-gold hover:rotate-90 transition-transform duration-300 bg-transparent border-0 cursor-pointer"
              onClick={() => setLightbox(null)}
            >
              <X size={24} />
            </button>
            <motion.img
              src={lightbox}
              alt="Project"
              className="max-w-[88vw] max-h-[88vh] object-contain border border-gold/20 shadow-[0_40px_120px_rgba(0,0,0,.8)]"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}