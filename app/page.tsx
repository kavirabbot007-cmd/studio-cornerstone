/**
 * CRAFTMEN STUDIO — page.tsx
 *
 * SETUP (do this once):
 * 1. Create folder: public/images/
 * 2. Copy your files there with EXACT names:
 *    logo.png  → your circular logo (image 1 you shared)
 *    p1.jpg    → dining room contemporary (image 2)
 *    p2.jpg    → classical living room burgundy (image 3)
 *    p3.jpg    → corridor with bull sculpture (image 4)
 *    p4.jpg    → burgundy wallpaper room (image 5)
 *    p5.jpg    → open plan living (image 6)
 *    p6.jpg    → detail living room (image 7)
 *    p7.jpg    → formal seating (image 8)
 *    p8.jpg    → bright living room (image 9)
 *    p9.jpg    → dresser detail (image 10 - wait, image 9 is dresser detail)
 *    p10.jpg   → dining nook with shelves (image 10 - wait let me recount)
 *    p11.jpg   → corridor with kitchen view (image 11)
 *    p12.jpg   → formal dining chandelier (image 12)
 *    p13.jpg   → marble living room (image 13)
 *    p14.jpg   → grey luxury living (image 14)
 *    p15.jpg   → modern living beige (image 15)
 *
 * 3. npm install framer-motion lucide-react
 */

"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, X, Phone, MapPin, Clock } from "lucide-react";

/* ══════════════════════════════════════════════
   CONTAINER SCROLL — 3D perspective showcase
══════════════════════════════════════════════ */
function ContainerScroll({
  children,
  titleComponent,
}: {
  children: React.ReactNode;
  titleComponent: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const rotate   = useTransform(scrollYProgress, [0, 0.45], [isMobile ? 10 : 16, 0]);
  const scale    = useTransform(scrollYProgress, [0, 0.45], [isMobile ? 0.82 : 0.88, 1]);
  const translateY = useTransform(scrollYProgress, [0, 0.45], [0, -50]);

  return (
    <div ref={ref} style={{ height: isMobile ? "120vh" : "155vh" }} className="relative">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-4 md:px-8">
        <motion.div style={{ translateY }} className="text-center mb-8 z-10">
          {titleComponent}
        </motion.div>
        <motion.div
          style={{ rotateX: rotate, scale, transformPerspective: "1400px", transformOrigin: "center top" }}
          className="w-full max-w-5xl"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FADE IN
══════════════════════════════════════════════ */
function FadeIn({
  children, delay = 0, className = "", direction = "up", style = {},
}: {
  children: React.ReactNode; delay?: number; className?: string;
  direction?: "up" | "left" | "right" | "none"; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const dirs: Record<string, object> = { up: { y: 28 }, left: { x: -28 }, right: { x: 28 }, none: {} };
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, ...dirs[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.82, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className} style={style}>
      {children}
    </motion.div>
  );
}

function Eyebrow({ text, dark = false }: { text: string; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="block w-8 h-px flex-shrink-0" style={{ background: dark ? "#c9a96e" : "#9a7a4a" }} />
      <span className="font-sans text-[9px] tracking-[0.36em] uppercase"
        style={{ color: dark ? "#c9a96e" : "#9a7a4a" }}>{text}</span>
    </div>
  );
}

function Counter({ to, suffix, label, active }: {
  to: number; suffix: string; label: string; active: boolean;
}) {
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!active || done.current) return;
    done.current = true;
    const step = Math.ceil(to / 55);
    let cur = 0;
    const id = setInterval(() => { cur = Math.min(cur + step, to); setVal(cur); if (cur >= to) clearInterval(id); }, 18);
    return () => clearInterval(id);
  }, [active, to]);
  return (
    <FadeIn className="text-center px-6 py-8 hover:-translate-y-1 transition-all duration-300"
      style={{ background: "#faf6f0", border: "1px solid rgba(201,169,110,0.2)" }}>
      <span className="block font-serif text-[50px] font-light leading-none" style={{ color: "#1a1510" }}>{val}{suffix}</span>
      <span className="block font-sans text-[9px] tracking-[0.28em] uppercase mt-2" style={{ color: "#9a7a4a" }}>{label}</span>
    </FadeIn>
  );
}

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const PROJECTS = [
  { img: "/images/p2.webp",  title: "The Classical Residence",  cat: "Heritage Living",   loc: "South Delhi",       year: "2024", area: "6,800 sq ft" },
  { img: "/images/p12.webp", title: "The Chandelier Suite",     cat: "Formal Dining",     loc: "Greater Kailash",   year: "2024", area: "4,200 sq ft" },
  { img: "/images/p1.webp",  title: "Contemporary Villa",       cat: "Modern Living",     loc: "Gurugram",          year: "2024", area: "3,900 sq ft" },
  { img: "/images/p14.webp", title: "The Grey Manor",           cat: "Luxury Apartment",  loc: "Lutyens Delhi",     year: "2023", area: "5,100 sq ft" },
  { img: "/images/p10.webp", title: "Walnut Study & Dining",    cat: "Multifunctional",   loc: "Vasant Vihar",      year: "2023", area: "2,400 sq ft" },
  { img: "/images/p13.webp", title: "Marble Pavilion",          cat: "Residential",       loc: "Defence Colony",    year: "2022", area: "7,200 sq ft" },
];

const GALLERY = [
  { img: "/images/p3.webp",  label: "Classical Corridor",  span: "row-span-2" },
  { img: "/images/p5.webp",  label: "Open Plan Living",    span: "" },
  { img: "/images/p4.webp",  label: "Burgundy Alcove",     span: "" },
  { img: "/images/p6.webp",  label: "Walnut & Velvet",     span: "" },
  { img: "/images/p7.webp",  label: "Heritage Seating",    span: "col-span-2" },
  { img: "/images/p8.webp",  label: "Morning Room",        span: "" },
  { img: "/images/p9.webp",  label: "Artisan Dresser",     span: "" },
  { img: "/images/p11.webp", label: "Gallery Corridor",    span: "" },
];

const TESTIMONIALS = [
  { q: "Craftmen Studio transformed our apartment into something we could never have imagined. Every detail, every surface — considered with absolute care.", name: "Priya & Arjun Mehra",  role: "Homeowners, South Delhi",   init: "PM" },
  { q: "The classical living room they designed has become the soul of our home. Guests ask about it every single time they visit.",                          name: "Sunita Kapoor",          role: "Villa Owner, Vasant Vihar", init: "SK" },
  { q: "From the marble flooring to the hand-picked art — every element felt intentional. This is what real interior architecture looks like.",               name: "Vikram & Naina Sharma", role: "Penthouse, Lutyens Delhi",  init: "VS" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backTop,  setBackTop]  = useState(false);
  const [counters, setCounters] = useState(false);
  const [clock,    setClock]    = useState("");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [heroIdx,  setHeroIdx]  = useState(0);

  const heroImgs = ["/images/p2.webp", "/images/p12.webp", "/images/p13.webp"];

  useEffect(() => {
    let raf = 0;
    const h = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const d = document.documentElement.scrollHeight - window.innerHeight;
        setNavSolid(y > 80); setBackTop(y > 600);
        setProgress(d > 0 ? (y / d) * 100 : 0);
        const el = document.getElementById("stats");
        if (el && !counters && el.getBoundingClientRect().top < window.innerHeight * 0.85) setCounters(true);
      });
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => { window.removeEventListener("scroll", h); cancelAnimationFrame(raf); };
  }, [counters]);

  useEffect(() => {
    const tick = () => {
      const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
      const ist = new Date(utc + 19800000);
      const p = (n: number) => n.toString().padStart(2, "0");
      setClock(`${p(ist.getHours())}:${p(ist.getMinutes())} IST`);
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setHeroIdx(i => (i + 1) % heroImgs.length), 5500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenuOpen(false); setLightbox(null); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <>
      {/* Progress */}
      <div className="fixed top-0 left-0 h-[2px] z-[9999] pointer-events-none"
        style={{ width: `${progress}%`, background: "linear-gradient(to right, #9a7a4a, #c9a96e, #e2c898)", transition: "width .15s ease" }} />

      {/* Back to top */}
      <AnimatePresence>
        {backTop && (
          <motion.button className="fixed bottom-8 right-8 z-[400] w-11 h-11 flex items-center justify-center text-base border-0 cursor-pointer transition-colors duration-300"
            style={{ background: "#0d0b08", border: "1px solid rgba(201,169,110,0.4)", color: "#c9a96e" }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</motion.button>
        )}
      </AnimatePresence>

      {/* ══ NAVBAR ══ */}
      <nav className="fixed top-0 w-full z-[500] flex items-center gap-5 transition-all duration-400"
        style={{
          padding: navSolid ? "12px 56px" : "20px 56px",
          background: navSolid ? "rgba(13,11,8,0.94)" : "transparent",
          backdropFilter: navSolid ? "blur(24px)" : "none",
          borderBottom: navSolid ? "1px solid rgba(201,169,110,0.12)" : "none",
        }}>
        <a href="#" className="mr-auto flex-shrink-0 flex items-center gap-3 no-underline">
          <img src="/images/logo.webp" alt="Craftmen Studio" className="w-10 h-10 rounded-full object-cover" />
          <div className="hidden md:flex flex-col leading-none">
            <span className="font-sans text-[8px] tracking-[0.5em] uppercase" style={{ color: "#c9a96e" }}>Interior Architecture</span>
            <span className="font-serif text-[18px] font-light" style={{ color: "#faf6f0" }}>Craftmen Studio</span>
          </div>
        </a>
        <div className="hidden md:flex items-center gap-1 rounded-full py-1 px-1"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
          {["Projects","Process","Services","About","Contact"].map(n => (
            <a key={n} href={`#${n.toLowerCase()}`}
              className="font-sans text-[10px] tracking-[0.18em] uppercase px-4 py-2 rounded-full no-underline transition-colors duration-300"
              style={{ color: "rgba(250,246,240,0.55)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#faf6f0")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(250,246,240,0.55)")}>{n}</a>
          ))}
        </div>
        <span className="hidden lg:block font-sans text-[10px] tracking-[0.14em]" style={{ color: "#5a5248" }}>{clock}</span>
        <a href="#contact" className="hidden md:inline-flex font-sans text-[9px] tracking-[0.26em] uppercase px-5 py-2.5 no-underline flex-shrink-0 transition-colors duration-300"
          style={{ background: "#c9a96e", color: "#0d0b08" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#e2c898")}
          onMouseLeave={e => (e.currentTarget.style.background = "#c9a96e")}>Enquire</a>
        <button className="md:hidden flex flex-col gap-[5px] bg-transparent border-0 cursor-pointer p-1"
          onClick={() => setMenuOpen(true)}>
          <span className="block w-6 h-px" style={{ background: "#faf6f0" }} />
          <span className="block w-6 h-px" style={{ background: "#faf6f0" }} />
          <span className="block w-6 h-px" style={{ background: "#faf6f0" }} />
        </button>
      </nav>

      {/* ══ MOBILE MENU ══ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="fixed inset-0 z-[800] flex flex-col justify-center px-10 py-20"
            style={{ background: "#0d0b08" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="absolute top-6 right-10 bg-transparent border-0 cursor-pointer"
              style={{ color: "#c9a96e" }} onClick={() => setMenuOpen(false)}><X size={26} /></button>
            {["Projects","Process","Services","About","Contact"].map((n, i) => (
              <motion.a key={n} href={`#${n.toLowerCase()}`}
                className="flex items-center gap-4 py-4 no-underline transition-colors duration-300"
                style={{ borderBottom: "1px solid rgba(201,169,110,0.1)", color: "#faf6f0" }}
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }} onClick={() => setMenuOpen(false)}
                onMouseEnter={e => (e.currentTarget.style.color = "#c9a96e")}
                onMouseLeave={e => (e.currentTarget.style.color = "#faf6f0")}>
                <span className="font-sans text-[9px] tracking-[0.22em]" style={{ color: "#c9a96e" }}>0{i + 1}</span>
                <span className="font-serif text-[38px] font-light flex-1">{n}</span>
                <ArrowRight size={18} style={{ color: "#c9a96e" }} />
              </motion.a>
            ))}
            <div className="absolute bottom-8 left-10 font-sans text-[11px] flex flex-col gap-1" style={{ color: "#5a5248" }}>
              <span>+91 98717 66962</span>
              <span>350, MG Rd, Sultanpur, New Delhi 110030</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ HERO — CINEMATIC SLIDESHOW ══ */}
      <section id="hero" className="relative flex items-end overflow-hidden" style={{ height: "100vh", minHeight: "700px" }}>
        {heroImgs.map((src, i) => (
          <motion.div key={src} className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: i === heroIdx ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}>
            <img src={src} alt="" className="w-full h-full object-cover" />
          </motion.div>
        ))}
        <div className="absolute inset-0 z-[1]"
          style={{ background: "linear-gradient(135deg, rgba(13,11,8,0.88) 0%, rgba(13,11,8,0.42) 55%, rgba(13,11,8,0.7) 100%)" }} />
        <div className="absolute inset-0 z-[2]"
          style={{ background: "linear-gradient(to top, rgba(13,11,8,0.95) 0%, transparent 48%)" }} />

        <div className="relative z-[3] w-full max-w-[1100px] px-14 pb-24">
          <FadeIn delay={0.2}><Eyebrow text="New Delhi · Est. 2019 · Interior Architecture" dark /></FadeIn>
          <h1 className="font-serif font-light leading-none mb-7" style={{ color: "#faf6f0", fontSize: "clamp(58px,9.5vw,140px)" }}>
            <FadeIn delay={0.35}><span className="block">Spaces That</span></FadeIn>
            <FadeIn delay={0.55}><span className="block italic pl-16" style={{ color: "#e2c898" }}>Tell Stories</span></FadeIn>
          </h1>
          <FadeIn delay={0.72}>
            <p className="font-sans font-light text-sm leading-[1.85] max-w-[380px] mb-10" style={{ color: "rgba(250,246,240,0.6)" }}>
              We craft bespoke interiors where Indian craftsmanship meets refined contemporary design. Every space, a reflection of the life lived within it.
            </p>
          </FadeIn>
          <FadeIn delay={0.88}>
            <div className="flex items-center gap-6 mb-12">
              <a href="#projects" className="inline-flex items-center gap-3 font-sans text-[10px] font-medium tracking-[0.22em] uppercase px-7 py-4 no-underline transition-all duration-300 hover:gap-5"
                style={{ background: "#c9a96e", color: "#0d0b08" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#e2c898")}
                onMouseLeave={e => (e.currentTarget.style.background = "#c9a96e")}>
                View Our Work <ArrowRight size={14} />
              </a>
              <a href="#about" className="font-sans text-[11px] tracking-[0.14em] no-underline transition-colors duration-300"
                style={{ color: "rgba(250,246,240,0.4)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c9a96e")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(250,246,240,0.4)")}>Our Philosophy →</a>
            </div>
          </FadeIn>
          <FadeIn delay={1.0}>
            <div className="flex items-center max-w-[340px] pt-6" style={{ borderTop: "1px solid rgba(201,169,110,0.2)" }}>
              {[["24+","Projects"],["5+","Years"],["100%","Bespoke"]].map(([n, l], i) => (
                <div key={l} className="flex-1 pr-4 mr-4"
                  style={{ borderRight: i < 2 ? "1px solid rgba(201,169,110,0.2)" : "none" }}>
                  <span className="block font-serif text-[28px] font-light leading-none" style={{ color: "#faf6f0" }}>{n}</span>
                  <span className="block font-sans text-[8px] tracking-[0.25em] uppercase mt-1" style={{ color: "#c9a96e" }}>{l}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-10 right-14 z-[3] flex gap-2">
          {heroImgs.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)} className="h-px cursor-pointer border-0 transition-all duration-500"
              style={{ width: i === heroIdx ? "32px" : "16px", background: i === heroIdx ? "#c9a96e" : "rgba(201,169,110,0.3)" }} />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute right-14 bottom-28 z-[3] flex flex-col items-center gap-3 font-sans text-[8px] tracking-[0.35em] uppercase"
          style={{ color: "#5a5248" }}>
          <div className="w-px h-12 overflow-hidden relative" style={{ background: "rgba(250,246,240,0.1)" }}>
            <div className="w-px h-[40%] absolute" style={{ background: "#c9a96e", animation: "scrollBar 2.2s ease infinite" }} />
          </div>
          <span>Scroll</span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-[3] hidden md:flex justify-center gap-4 py-3 font-sans text-[9px] tracking-[0.28em] uppercase"
          style={{ background: "rgba(13,11,8,0.5)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(201,169,110,0.1)", color: "rgba(250,246,240,0.28)" }}>
          <span>Interior Architecture</span>
          <span style={{ color: "#c9a96e", fontSize: "6px" }}>◆</span>
          <span>Spatial Design</span>
          <span style={{ color: "#c9a96e", fontSize: "6px" }}>◆</span>
          <span>New Delhi</span>
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <div className="overflow-hidden py-3" style={{ background: "#0d0b08", borderTop: "1px solid rgba(201,169,110,0.12)", borderBottom: "1px solid rgba(201,169,110,0.12)" }}>
        <div className="flex w-max" style={{ animation: "marquee 42s linear infinite" }}>
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className="flex items-center gap-4 px-2 font-sans text-[9.5px] tracking-[0.28em] uppercase whitespace-nowrap"
              style={{ color: "#5a5248" }}>
              <span style={{ color: "#c9a96e", fontSize: "7px" }}>◈</span><span>Residential Design</span>
              <span style={{ color: "#c9a96e", fontSize: "7px" }}>◈</span><span>Commercial Interiors</span>
              <span style={{ color: "#c9a96e", fontSize: "7px" }}>◈</span><span>Turnkey Projects</span>
              <span style={{ color: "#c9a96e", fontSize: "7px" }}>◈</span><span>Luxury Spaces</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ CONTAINER SCROLL SHOWCASE ══ */}
      <div style={{ background: "#faf6f0" }}>
        <ContainerScroll titleComponent={
          <div>
            <FadeIn><Eyebrow text="Our Work" /></FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-serif font-light" style={{ color: "#1a1510", fontSize: "clamp(36px,5vw,70px)", lineHeight: 1.0 }}>
                Designed to be<br /><em className="italic" style={{ color: "#9a7a4a" }}>Remembered</em>
              </h2>
            </FadeIn>
          </div>
        }>
          <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl" style={{ background: "#1a1510", boxShadow: "0 60px 120px rgba(0,0,0,0.4)" }}>
            {["/images/p2.webp","/images/p12.webp","/images/p1.webp",
              "/images/p14.webp","/images/p10.webp","/images/p13.webp"].map((src, i) => (
              <div key={i} className="overflow-hidden rounded-xl cursor-pointer group"
                style={{ aspectRatio: i === 0 || i === 3 ? "4/3" : "16/9" }}
                onClick={() => setLightbox(src)}>
                <img src={src} alt={`Project ${i + 1}`} loading={i < 2 ? "eager" : "lazy"}
                  className="w-full h-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.07]" />
              </div>
            ))}
          </div>
        </ContainerScroll>
      </div>

      {/* ══ STATS ══ */}
      <section id="stats" className="px-14 py-20" style={{ background: "#f0ebe2" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] max-w-4xl mx-auto mb-14">
          <Counter to={24}  suffix="+" label="Projects Completed" active={counters} />
          <Counter to={5}   suffix="+" label="Years of Practice"  active={counters} />
          <Counter to={100} suffix="%" label="Bespoke Design"     active={counters} />
          <Counter to={14}  suffix=""  label="Industry Awards"    active={counters} />
        </div>
        <FadeIn className="flex items-center gap-8 max-w-3xl mx-auto">
          <span className="flex-1 h-px" style={{ background: "rgba(154,122,74,0.25)" }} />
          <p className="font-serif text-[18px] font-light text-center leading-[1.7] flex-shrink-0 max-w-[480px]" style={{ color: "#5a5248" }}>
            We design for the way you live — not the way a magazine says you should.
            <em className="italic" style={{ color: "#9a7a4a" }}> Every room, a considered decision.</em>
          </p>
          <span className="flex-1 h-px" style={{ background: "rgba(154,122,74,0.25)" }} />
        </FadeIn>
      </section>

      {/* ══ PROJECTS BENTO ══ */}
      <section id="projects" className="px-14 py-24" style={{ background: "#faf6f0" }}>
        <FadeIn><Eyebrow text="Selected Work / 2022–2024" /></FadeIn>
        <div className="flex items-start gap-16 mb-12">
          <FadeIn>
            <h2 className="font-serif font-light leading-[1.0]" style={{ color: "#1a1510", fontSize: "clamp(42px,5.5vw,80px)" }}>
              Case <em className="italic" style={{ color: "#9a7a4a" }}>Studies</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="font-sans text-sm font-light leading-[1.85] max-w-[360px] pt-3" style={{ color: "#8a8278" }}>
            Six projects that define the Craftmen language — where heritage craft meets the demands of modern luxury living.
          </FadeIn>
        </div>
        <div className="grid grid-cols-12 gap-[3px]" style={{ gridAutoRows: "400px" }}>
          {PROJECTS.map((p, i) => {
            const spans = ["col-span-7","col-span-5","col-span-5","col-span-7","col-span-6","col-span-6"];
            const offsets = ["","","","","",""] as const;
            return (
              <FadeIn key={i} delay={i * 0.07}
                className={`${spans[i]} relative overflow-hidden group cursor-pointer`}
                style={{ background: "#e8e2d8", marginTop: i === 2 ? "64px" : "0" } as React.CSSProperties}
                onClick={() => setLightbox(p.img)}>
                <img src={p.img} alt={p.title} loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]" />
                <div className="absolute inset-0 transition-opacity duration-500"
                  style={{ background: "linear-gradient(to top, rgba(13,11,8,0.85) 0%, rgba(13,11,8,0.1) 50%, transparent 100%)" }} />
                <span className="absolute top-4 right-4 font-sans text-[8px] tracking-[0.22em] uppercase z-10 px-2.5 py-1.5"
                  style={{ background: "#c9a96e", color: "#0d0b08" }}>{p.cat}</span>
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex gap-3 mb-1.5 font-sans text-[9px]" style={{ color: "#c9a96e" }}>
                    <span>{p.year}</span>
                    <span style={{ color: "#8a8278" }}>{p.area}</span>
                  </div>
                  <h3 className="font-serif text-[22px] font-light leading-tight" style={{ color: "#faf6f0" }}>{p.title}</h3>
                  <p className="font-sans text-[10px] mt-1" style={{ color: "#8a8278" }}>{p.loc}</p>
                  <div className="flex items-center gap-2 mt-3 font-sans text-[9px] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75"
                    style={{ color: "#c9a96e" }}>
                    <span>View Project</span><ArrowRight size={12} />
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* ══ INTERLUDE ══ */}
      <div className="relative flex items-center justify-center overflow-hidden" style={{ height: "480px" }}>
        <img src="/images/p8.webp" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ transform: "scale(1.08)" }} />
        <div className="absolute inset-0" style={{ background: "rgba(13,11,8,0.76)" }} />
        <FadeIn className="relative z-10 text-center px-8 max-w-[680px]">
          <span className="font-serif text-[72px] block leading-[0.5] mb-2" style={{ color: "#c9a96e", opacity: 0.2 }}>"</span>
          <p className="font-serif font-light italic leading-[1.5]" style={{ color: "#faf6f0", fontSize: "clamp(22px,3vw,40px)" }}>
            We believe a home should feel like an extension of the person who lives in it — not a showroom.
          </p>
          <span className="block font-sans text-[9px] tracking-[0.3em] uppercase mt-6" style={{ color: "#c9a96e" }}>
            — Founder, Craftmen Studio
          </span>
        </FadeIn>
      </div>

      {/* ══ PROCESS ══ */}
      <section id="process" className="px-14 py-24" style={{ background: "#f0ebe2" }}>
        <FadeIn><Eyebrow text="How We Work" /></FadeIn>
        <FadeIn>
          <h2 className="font-serif font-light leading-[1.0] mb-14" style={{ color: "#1a1510", fontSize: "clamp(42px,5.5vw,80px)" }}>
            The <em className="italic" style={{ color: "#9a7a4a" }}>Process</em>
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[2px]">
          {[
            { n:"01", icon:"◎", title:"Discovery",  desc:"An unhurried conversation about how you live, what you love, and what has always felt slightly off. We listen before we propose anything." },
            { n:"02", icon:"◈", title:"Concept",    desc:"A fully formed design direction — mood boards, material samples, and spatial sketches. Nothing is shown until it has a clear point of view." },
            { n:"03", icon:"◫", title:"Design",     desc:"Complete construction drawings, 3D renders, and material specifications. Every decision resolved on paper before it touches your walls." },
            { n:"04", icon:"◉", title:"Execution",  desc:"We manage every contractor, artisan, and delivery. You see your space only when it is completely finished." },
          ].map((s, i) => (
            <FadeIn key={i} delay={i * 0.09}
              className="p-9 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
              style={{ background: "#faf6f0", border: "1px solid rgba(201,169,110,0.15)" }}>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500" style={{ background: "#c9a96e" }} />
              <div className="flex items-center gap-3 mb-6">
                <span className="font-sans text-[9px] tracking-[0.3em]" style={{ color: "#c9a96e" }}>{s.n}</span>
                <span className="flex-1 h-px" style={{ background: "rgba(201,169,110,0.2)" }} />
              </div>
              <p className="text-[22px] mb-3" style={{ color: "#9a7a4a" }}>{s.icon}</p>
              <h3 className="font-serif text-[26px] font-light mb-3" style={{ color: "#1a1510" }}>{s.title}</h3>
              <p className="font-sans text-[13px] font-light leading-[1.85]" style={{ color: "#8a8278" }}>{s.desc}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section id="services" className="px-14 py-24 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-20" style={{ background: "#faf6f0" }}>
        <div className="lg:sticky lg:top-[100px] self-start">
          <FadeIn><Eyebrow text="What We Offer" /></FadeIn>
          <FadeIn>
            <h2 className="font-serif font-light leading-[1.0] mb-5" style={{ color: "#1a1510", fontSize: "clamp(42px,5.5vw,80px)" }}>
              Our <em className="italic" style={{ color: "#9a7a4a" }}>Services</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="font-sans text-sm font-light leading-[1.85] mb-8 max-w-[300px]" style={{ color: "#8a8278" }}>
              From a single room to a complete villa — we bring the same depth of attention to every square foot.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <a href="#contact" className="inline-flex items-center gap-3 font-sans text-[10px] font-medium tracking-[0.22em] uppercase px-6 py-3.5 no-underline transition-all duration-300 hover:gap-5"
              style={{ background: "#c9a96e", color: "#0d0b08" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#e2c898")}
              onMouseLeave={e => (e.currentTarget.style.background = "#c9a96e")}>
              Start a Project <ArrowRight size={14} />
            </a>
          </FadeIn>
        </div>
        <div>
          {[
            { n:"01", title:"Residential Design",   tags:["Apartments","Villas","Farmhouses","Penthouses"],  desc:"Tailored interiors built around your lifestyle, your aesthetic, and the craft traditions we hold dear." },
            { n:"02", title:"Commercial Interiors",  tags:["Offices","Hotels","Retail","Restaurants"],        desc:"Spaces that communicate brand identity through architecture — where the room does the talking." },
            { n:"03", title:"Turnkey Execution",     tags:["Concept to Handover","Project Management"],       desc:"We handle every vendor, every timeline. You arrive to a finished space on the agreed date." },
            { n:"04", title:"Renovation & Refresh",  tags:["Remodels","Lighting Design","Art Curation"],      desc:"Surgical interventions that breathe new life into existing spaces without unnecessary disruption." },
          ].map((s, i) => (
            <FadeIn key={i} delay={i * 0.08}
              className="group py-6 px-2 cursor-default relative hover:px-4 transition-all duration-500"
              style={{ borderBottom: "1px solid rgba(201,169,110,0.15)" }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "rgba(201,169,110,0.04)" }} />
              <div className="relative flex items-center gap-4">
                <span className="font-sans text-[9px] tracking-[0.22em] w-5" style={{ color: "#c9a96e" }}>{s.n}</span>
                <h3 className="font-serif text-[24px] font-light flex-1" style={{ color: "#1a1510" }}>{s.title}</h3>
                <span className="text-[22px] font-light w-5 text-right group-hover:rotate-45 transition-transform duration-300"
                  style={{ color: "#c9a96e" }}>+</span>
              </div>
              <div className="hidden group-hover:block pl-9 pt-3">
                <p className="font-sans text-[13px] font-light leading-[1.85] mb-3" style={{ color: "#8a8278" }}>{s.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map(t => <span key={t} className="font-sans text-[8px] tracking-[0.2em] uppercase px-2.5 py-1"
                    style={{ color: "#9a7a4a", border: "1px solid rgba(154,122,74,0.35)" }}>{t}</span>)}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about" className="px-14 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" style={{ background: "#f0ebe2" }}>
        <FadeIn className="relative" direction="left">
          <div className="overflow-hidden">
            <img src="/images/p7.webp" alt="Craftmen Studio" loading="lazy"
              className="w-full object-cover hover:scale-[1.04] transition-transform duration-[1s]"
              style={{ aspectRatio: "3/4" }} />
          </div>
          <div className="absolute bottom-[-24px] right-[-24px] w-[42%] overflow-hidden"
            style={{ border: "3px solid #f0ebe2" }}>
            <img src="/images/p9.webp" alt="Detail" loading="lazy" className="w-full object-cover" style={{ aspectRatio: "1" }} />
          </div>
          <div className="absolute top-7 left-[-16px] text-center px-4 py-3.5"
            style={{ background: "#faf6f0", border: "1px solid rgba(201,169,110,0.3)" }}>
            <span className="block font-serif text-[36px] font-light leading-none" style={{ color: "#c9a96e" }}>5+</span>
            <span className="block font-sans text-[8px] tracking-[0.25em] uppercase mt-1" style={{ color: "#8a8278" }}>Years</span>
          </div>
        </FadeIn>
        <div>
          <FadeIn><Eyebrow text="The Practice" /></FadeIn>
          <FadeIn>
            <h2 className="font-serif font-light leading-[1.0] mb-5" style={{ color: "#1a1510", fontSize: "clamp(42px,5.5vw,80px)" }}>
              About <em className="italic" style={{ color: "#9a7a4a" }}>Craftmen</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="font-sans text-sm font-light leading-[1.95] mb-5" style={{ color: "#8a8278" }}>
              Craftmen Studio is based in Sultanpur, New Delhi. We work at the intersection of Indian craft heritage and contemporary spatial thinking — designing homes and commercial spaces that feel both deeply personal and effortlessly refined.
            </p>
          </FadeIn>
          <FadeIn delay={0.18}>
            <p className="font-sans text-sm font-light leading-[1.95] mb-8" style={{ color: "#8a8278" }}>
              We believe the best interiors are never about trends. They are about understanding how light behaves in a room at different hours, how materiality affects mood, and how architecture shapes the rituals of daily life.
            </p>
          </FadeIn>
          <FadeIn delay={0.26} className="flex gap-8 pt-7" style={{ borderTop: "1px solid rgba(201,169,110,0.2)" }}>
            {[["24+","Projects"],["5+","Years"],["100%","Bespoke"]].map(([n, l]) => (
              <div key={l}>
                <span className="block font-serif text-[34px] font-light leading-none" style={{ color: "#1a1510" }}>{n}</span>
                <span className="block font-sans text-[8px] tracking-[0.25em] uppercase mt-1" style={{ color: "#9a7a4a" }}>{l}</span>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* ══ GALLERY ══ */}
      <section className="px-14 py-24" style={{ background: "#faf6f0" }}>
        <FadeIn><Eyebrow text="Visual Diary" /></FadeIn>
        <div className="flex items-start gap-16 mb-12">
          <FadeIn>
            <h2 className="font-serif font-light leading-[1.0]" style={{ color: "#1a1510", fontSize: "clamp(42px,5.5vw,80px)" }}>
              Spaces We've <em className="italic" style={{ color: "#9a7a4a" }}>Made</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="font-sans text-sm font-light leading-[1.85] max-w-[360px] pt-3" style={{ color: "#8a8278" }}>
            A selection from our portfolio — rooms built on restraint, craft, and an obsessive attention to material quality.
          </FadeIn>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[3px]" style={{ gridAutoRows: "220px" }}>
          {GALLERY.map((g, i) => (
            <FadeIn key={i} delay={i * 0.06}
              className={`overflow-hidden relative cursor-pointer group ${g.span}`}
              style={{ background: "#e8e2d8" } as React.CSSProperties}
              onClick={() => setLightbox(g.img)}>
              <img src={g.img} alt={g.label} loading="lazy"
                className="absolute inset-0 w-full h-full object-cover brightness-95 transition-all duration-[1s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06] group-hover:brightness-100" />
              <div className="absolute inset-0 flex items-end justify-between p-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{ background: "rgba(13,11,8,0.42)" }}>
                <span className="font-serif text-[14px] font-light italic" style={{ color: "#faf6f0" }}>{g.label}</span>
                <ArrowRight size={15} style={{ color: "#c9a96e" }} />
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══ MATERIALS ══ */}
      <div className="px-14 py-14" style={{ background: "#f0ebe2", borderTop: "1px solid rgba(201,169,110,0.15)", borderBottom: "1px solid rgba(201,169,110,0.15)" }}>
        <FadeIn><Eyebrow text="Signature Materials" /></FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-[2px] mt-5">
          {[["Marble","Statuario & Nero"],["Timber","Walnut & Teak"],["Metal","Antique Brass"],
            ["Finish","Venetian Plaster"],["Textile","Aged Velvet"],["Stone","Fossil Limestone"]].map(([t, n], i) => (
            <FadeIn key={i} delay={i * 0.07}
              className="px-4 py-6 text-center hover:-translate-y-1 transition-all duration-300"
              style={{ background: "#faf6f0", border: "1px solid rgba(201,169,110,0.12)" }}>
              <span className="block font-sans text-[8px] tracking-[0.28em] uppercase mb-2" style={{ color: "#9a7a4a" }}>{t}</span>
              <span className="block font-serif text-[14px] font-light" style={{ color: "#1a1510" }}>{n}</span>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ══ TESTIMONIALS ══ */}
      <section className="px-14 py-24" style={{ background: "#faf6f0" }}>
        <FadeIn><Eyebrow text="Client Voices" /></FadeIn>
        <FadeIn className="mb-12">
          <h2 className="font-serif font-light leading-[1.0]" style={{ color: "#1a1510", fontSize: "clamp(42px,5.5vw,80px)" }}>
            What They <em className="italic" style={{ color: "#9a7a4a" }}>Say</em>
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[3px]">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={i} delay={i * 0.09}
              className="p-9 relative group hover:-translate-y-1 transition-all duration-300"
              style={{ background: "#f0ebe2", border: "1px solid rgba(201,169,110,0.12)" }}>
              <span className="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(to right, #c9a96e, transparent)" }} />
              <span className="font-serif text-[56px] block leading-[0.6] mb-1" style={{ color: "#c9a96e", opacity: 0.22 }}>"</span>
              <p className="font-serif text-[15px] font-light italic leading-[1.7] mb-6" style={{ color: "#1a1510" }}>{t.q}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-[13px] flex-shrink-0"
                  style={{ background: "#c9a96e", color: "#0d0b08" }}>{t.init}</div>
                <div>
                  <span className="block font-sans text-[12px] font-medium" style={{ color: "#1a1510" }}>{t.name}</span>
                  <span className="block font-sans text-[9px] tracking-[0.1em] mt-0.5" style={{ color: "#9a7a4a" }}>{t.role}</span>
                </div>
              </div>
            </FadeIn>
          ))}
          <FadeIn delay={0.32} className="flex flex-col items-center justify-center p-9 gap-2"
            style={{ background: "#c9a96e" }}>
            <span className="font-serif text-[52px] font-light leading-none" style={{ color: "#0d0b08" }}>24+</span>
            <span className="font-sans text-[9px] tracking-[0.25em] uppercase" style={{ color: "rgba(13,11,8,0.65)" }}>Happy Clients</span>
          </FadeIn>
          <FadeIn delay={0.4} className="flex flex-col items-center justify-center p-9 gap-2"
            style={{ background: "#f0ebe2", border: "1px solid rgba(201,169,110,0.12)" }}>
            <span className="font-serif text-[52px] font-light leading-none" style={{ color: "#c9a96e" }}>14</span>
            <span className="font-sans text-[9px] tracking-[0.25em] uppercase" style={{ color: "#8a8278" }}>Industry Awards</span>
          </FadeIn>
          <FadeIn delay={0.48} className="flex flex-col items-center justify-center p-9 gap-3"
            style={{ background: "#f0ebe2", border: "1px solid rgba(201,169,110,0.12)" }}>
            <img src="/images/logo.webp" alt="Craftmen Studio" className="w-16 h-16 rounded-full object-cover" />
            <p className="font-serif text-[14px] font-light italic text-center leading-[1.65]" style={{ color: "#5a5248" }}>
              Crafted with intention, not automation.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="px-14 py-24 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-20" style={{ background: "#f0ebe2" }}>
        <div>
          <FadeIn><Eyebrow text="Common Questions" /></FadeIn>
          <FadeIn>
            <h2 className="font-serif font-light leading-[1.0]" style={{ color: "#1a1510", fontSize: "clamp(42px,5.5vw,80px)" }}>
              Frequently <em className="italic" style={{ color: "#9a7a4a" }}>Asked</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="font-sans text-sm font-light leading-[1.85] mt-5 max-w-[300px]" style={{ color: "#8a8278" }}>
              Everything you need to know before we begin — answered honestly.
            </p>
          </FadeIn>
        </div>
        <div>
          {[
            { q: "How long does a residential project take?",          a: "A complete interior from first meeting to handover typically takes 4–8 months depending on scope. All timelines are mapped in our initial proposal." },
            { q: "Do you work outside Delhi?",                         a: "Yes — we take projects across India. We have worked in Mumbai, Bangalore, and Chandigarh. Travel and coordination costs are included in the project proposal." },
            { q: "What is your minimum project budget?",               a: "We work with a minimum execution budget of ₹45 lakhs for residential and ₹60 lakhs for commercial. Smaller consultancy engagements are available case-by-case." },
            { q: "Can we see the design before construction begins?",  a: "Absolutely. Our design phase includes full 3D renders, virtual walkthroughs, and material samples. Nothing is executed without your written approval." },
            { q: "How involved do we need to be during execution?",    a: "As involved as you prefer. We handle all contractor communication daily. Most clients choose weekly updates and bi-weekly site visits." },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.07}>
              <details className="group" style={{ borderBottom: "1px solid rgba(201,169,110,0.15)" }}>
                <summary className="flex justify-between items-center gap-4 py-5 font-sans text-sm font-light cursor-pointer list-none transition-colors duration-300"
                  style={{ color: "#1a1510" }}>
                  <span>{item.q}</span>
                  <span className="text-[22px] font-light flex-shrink-0 group-open:rotate-45 transition-transform duration-300"
                    style={{ color: "#c9a96e" }}>+</span>
                </summary>
                <p className="font-sans text-[13px] font-light leading-[1.85] pb-5" style={{ color: "#8a8278" }}>{item.a}</p>
              </details>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <div className="relative px-14 py-24 flex items-center justify-center overflow-hidden">
        <img src="/images/p14.webp" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "saturate(0.7)" }} />
        <div className="absolute inset-0" style={{ background: "rgba(13,11,8,0.87)" }} />
        <FadeIn className="relative z-10 text-center flex flex-col items-center gap-6">
          <span className="font-sans text-[9px] tracking-[0.38em] uppercase" style={{ color: "#c9a96e" }}>Ready to Begin?</span>
          <h2 className="font-serif font-light leading-[1.1]" style={{ color: "#faf6f0", fontSize: "clamp(32px,5vw,64px)" }}>
            Your space is waiting<br /><em className="italic" style={{ color: "#e2c898" }}>to be transformed.</em>
          </h2>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <a href="#contact" className="inline-flex items-center gap-3 font-sans text-[10px] font-medium tracking-[0.22em] uppercase px-7 py-4 no-underline transition-all duration-300 hover:gap-5"
              style={{ background: "#c9a96e", color: "#0d0b08" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#e2c898")}
              onMouseLeave={e => (e.currentTarget.style.background = "#c9a96e")}>
              Start a Conversation <ArrowRight size={14} />
            </a>
            <a href="tel:+919871766962" className="font-sans text-[13px] no-underline transition-colors duration-300"
              style={{ color: "rgba(250,246,240,0.45)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#c9a96e")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(250,246,240,0.45)")}>
              +91 98717 66962
            </a>
          </div>
        </FadeIn>
      </div>

      {/* ══ CONTACT ══ */}
      <section id="contact" className="px-14 py-24" style={{ background: "#faf6f0" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 w-full max-w-[1400px]">
          <div>
            <FadeIn><Eyebrow text="Begin a Conversation" /></FadeIn>
            <FadeIn>
              <h2 className="font-serif font-light leading-[1.0] mb-9" style={{ color: "#1a1510", fontSize: "clamp(42px,5.5vw,80px)" }}>
                Let's Create<br /><em className="italic" style={{ color: "#9a7a4a" }}>Something</em><br />Extraordinary
              </h2>
            </FadeIn>
            <FadeIn delay={0.12} className="flex flex-col gap-5">
              {[
                { icon: <MapPin size={13} />, key: "Studio", val: "350, Mehrauli-Gurgaon Road, Sultanpur\nNew Delhi, Delhi 110030" },
                { icon: <Phone size={13} />,  key: "Phone",  val: "+91 98717 66962", href: "tel:+919871766962" },
                { icon: <Clock size={13} />,  key: "Hours",  val: "Mon–Sat, 10am–7pm IST" },
              ].map(({ icon, key, val, href }) => (
                <div key={key} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0" style={{ color: "#c9a96e" }}>{icon}</span>
                  <div>
                    <span className="block font-sans text-[8px] tracking-[0.3em] uppercase mb-1" style={{ color: "#9a7a4a" }}>{key}</span>
                    {href
                      ? <a href={href} className="font-sans text-sm font-light no-underline transition-colors duration-300 whitespace-pre-line" style={{ color: "#8a8278" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#c9a96e")}
                          onMouseLeave={e => (e.currentTarget.style.color = "#8a8278")}>{val}</a>
                      : <span className="font-sans text-sm font-light whitespace-pre-line" style={{ color: "#8a8278" }}>{val}</span>}
                  </div>
                </div>
              ))}
            </FadeIn>
          </div>
          <FadeIn delay={0.2} className="p-9" style={{ background: "#f0ebe2", border: "1px solid rgba(201,169,110,0.2)" }}>
            <p className="font-serif text-[22px] font-light mb-6" style={{ color: "#1a1510" }}>Send an Enquiry</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {[["Full Name","Your name","text"],["Email","your@email.com","email"]].map(([l, p, t]) => (
                <div key={l} className="flex flex-col gap-1.5">
                  <label className="font-sans text-[8px] tracking-[0.28em] uppercase" style={{ color: "#9a7a4a" }}>{l}</label>
                  <input type={t} placeholder={p} className="px-3 py-2.5 font-sans text-[13px] font-light outline-none w-full transition-colors duration-300"
                    style={{ background: "#faf6f0", border: "1px solid rgba(201,169,110,0.25)", color: "#1a1510" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.25)")} />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5 mb-3">
              <label className="font-sans text-[8px] tracking-[0.28em] uppercase" style={{ color: "#9a7a4a" }}>Project Type</label>
              <select className="px-3 py-2.5 font-sans text-[13px] font-light outline-none w-full appearance-none"
                style={{ background: "#faf6f0", border: "1px solid rgba(201,169,110,0.25)", color: "#1a1510" }}>
                <option value="">Select a service</option>
                <option>Residential Design</option>
                <option>Commercial Interiors</option>
                <option>Turnkey Project</option>
                <option>Renovation &amp; Refresh</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 mb-5">
              <label className="font-sans text-[8px] tracking-[0.28em] uppercase" style={{ color: "#9a7a4a" }}>About Your Project</label>
              <textarea rows={4} placeholder="Location, area, budget range, timeline…"
                className="px-3 py-2.5 font-sans text-[13px] font-light outline-none w-full resize-y transition-colors duration-300"
                style={{ background: "#faf6f0", border: "1px solid rgba(201,169,110,0.25)", color: "#1a1510" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.25)")} />
            </div>
            <button className="inline-flex items-center gap-3 font-sans text-[10px] font-medium tracking-[0.22em] uppercase px-7 py-4 border-0 cursor-pointer transition-all duration-300 hover:gap-5"
              style={{ background: "#c9a96e", color: "#0d0b08" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#e2c898")}
              onMouseLeave={e => (e.currentTarget.style.background = "#c9a96e")}>
              Send Enquiry <ArrowRight size={15} />
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ══ MAP ══ */}
      <div className="relative" style={{ height: "360px" }}>
        <iframe
          src="https://maps.google.com/maps?q=350+Mehrauli+Gurgaon+Road+Sultanpur+New+Delhi&t=&z=14&ie=UTF8&iwloc=&output=embed"
          title="Craftmen Studio" className="w-full h-full border-0 block"
          style={{ filter: "grayscale(100%) contrast(0.78) brightness(0.88)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 60px rgba(240,235,226,.88)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <div className="w-3 h-3 rounded-full" style={{ background: "#c9a96e", animation: "pinPulse 2s ease infinite" }} />
          <span className="font-sans text-[9px] tracking-[0.18em] uppercase px-3 py-1.5 whitespace-nowrap"
            style={{ color: "#1a1510", background: "rgba(250,246,240,0.94)", border: "1px solid rgba(201,169,110,0.35)" }}>
            Craftmen Studio · Sultanpur, New Delhi
          </span>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <footer className="px-14 pt-16 pb-8" style={{ background: "#0d0b08", borderTop: "1px solid rgba(201,169,110,0.12)" }}>
        <div className="flex justify-between items-start mb-12 pb-12 flex-wrap gap-12"
          style={{ borderBottom: "1px solid rgba(201,169,110,0.1)" }}>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src="/images/logo.webp" alt="Craftmen Studio" className="w-12 h-12 rounded-full object-cover" />
              <span className="font-serif text-[22px] font-light" style={{ color: "#faf6f0" }}>
                Craftmen <em className="italic" style={{ color: "#e2c898" }}>Studio</em>
              </span>
            </div>
            <p className="font-sans text-[10px] tracking-[0.13em]" style={{ color: "#5a5248" }}>
              Interior Architecture &amp; Spatial Design · New Delhi
            </p>
          </div>
          <div className="flex gap-12 flex-wrap">
            {[
              { h:"Navigation", items:[["Projects","#projects"],["Process","#process"],["Services","#services"],["About","#about"],["Contact","#contact"]] },
              { h:"Services",   items:[["Residential Design","#services"],["Commercial Interiors","#services"],["Turnkey Projects","#services"],["Renovation","#services"]] },
              { h:"Contact",    items:[["+91 98717 66962","tel:+919871766962"],["350, MG Rd, Sultanpur",""],["New Delhi 110030",""],["Mon–Sat 10am–7pm",""]] },
            ].map(({ h, items }) => (
              <div key={h} className="flex flex-col gap-2.5">
                <span className="font-sans text-[8px] tracking-[0.36em] uppercase mb-1" style={{ color: "#c9a96e" }}>{h}</span>
                {items.map(([l, href]) => (
                  href
                    ? <a key={l} href={href} className="font-sans text-[12px] font-light no-underline transition-colors duration-300"
                        style={{ color: "#5a5248" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#faf6f0")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#5a5248")}>{l}</a>
                    : <span key={l} className="font-sans text-[12px] font-light" style={{ color: "#5a5248" }}>{l}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between font-sans text-[10px] flex-wrap gap-2" style={{ color: "rgba(250,246,240,0.18)" }}>
          <span>© 2026 Craftmen Studio — All rights reserved</span>
          <em className="not-italic">Crafted with intention, not automation</em>
        </div>
      </footer>

      {/* ══ LIGHTBOX ══ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div className="fixed inset-0 z-[10000] flex items-center justify-center"
            style={{ background: "rgba(13,11,8,0.97)", backdropFilter: "blur(14px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }} onClick={() => setLightbox(null)}>
            <button className="absolute top-6 right-6 bg-transparent border-0 cursor-pointer hover:rotate-90 transition-transform duration-300"
              style={{ color: "#c9a96e" }} onClick={() => setLightbox(null)}><X size={24} /></button>
            <motion.img src={lightbox} alt="Project"
              className="max-w-[88vw] max-h-[88vh] object-contain"
              style={{ border: "1px solid rgba(201,169,110,0.2)", boxShadow: "0 40px 120px rgba(0,0,0,.8)" }}
              initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ KEYFRAMES + FONTS ══ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; scroll-padding-top: 90px; overflow-x: hidden; }
        body { font-family: 'Jost', sans-serif; font-weight: 300; -webkit-font-smoothing: antialiased; overflow-x: hidden; background: #faf6f0; color: #1a1510; }
        .font-serif { font-family: 'Cormorant Garamond', Georgia, serif !important; }
        .font-sans  { font-family: 'Jost', sans-serif !important; }
        ::selection { background: #c9a96e; color: #0d0b08; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #f0ebe2; }
        ::-webkit-scrollbar-thumb { background: #c9a96e; border-radius: 2px; }
        details summary::-webkit-details-marker { display: none; }
        details summary { list-style: none; }
        @keyframes scrollBar {
          0%   { transform: translateY(-100%); opacity: 0; }
          25%  { opacity: 1; }
          75%  { opacity: 1; }
          100% { transform: translateY(280%); opacity: 0; }
        }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes pinPulse {
          0%,100% { box-shadow: 0 0 0 4px rgba(201,169,110,.3), 0 0 0 8px rgba(201,169,110,.1); }
          50%     { box-shadow: 0 0 0 8px rgba(201,169,110,.18), 0 0 0 16px rgba(201,169,110,.05); }
        }
        @media (max-width: 768px) {
          nav { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </>
  );
}