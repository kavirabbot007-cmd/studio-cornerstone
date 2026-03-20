"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, X, Phone, MapPin, Clock, Menu } from "lucide-react";

/* ─── helpers ─── */
function FadeIn({ children, delay = 0, className = "", up = true }: {
  children: React.ReactNode; delay?: number; className?: string; up?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: up ? 24 : 0 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

function Label({ text }: { text: string }) {
  return (
    <p style={{ fontFamily: "Jost, sans-serif", fontSize: 9, letterSpacing: "0.38em", textTransform: "uppercase", color: "#b89a6a", display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <span style={{ display: "block", width: 28, height: 1, background: "#b89a6a", flexShrink: 0 }} />
      {text}
    </p>
  );
}

const SERIF: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const SANS: React.CSSProperties  = { fontFamily: "Jost, sans-serif" };
const GOLD = "#b89a6a";
const GOLD2 = "#d4b896";
const CREAM = "#f2ede7";
const BG   = "#0a0908";
const BG2  = "#0f0e0c";
const BG3  = "#141210";
const GRAY = "#8a8480";

export default function Page() {
  const [menu,    setMenu]    = useState(false);
  const [solid,   setSolid]   = useState(false);
  const [pct,     setPct]     = useState(0);
  const [btt,     setBtt]     = useState(false);
  const [ticking, setTicking] = useState(false);
  const [clock,   setClock]   = useState("");
  const [lb,      setLb]      = useState<string | null>(null);
  const [hero,    setHero]    = useState(0);

  const heroImgs = [
    "/images/p2.webp",
    "/images/p12.webp",
    "/images/p14.webp",
  ];

  /* scroll */
  useEffect(() => {
    let raf = 0;
    const fn = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setSolid(y > 60);
        setBtt(y > 500);
        setPct(h > 0 ? (y / h) * 100 : 0);
        if (!ticking && document.getElementById("numbers")?.getBoundingClientRect().top! < window.innerHeight * 0.85) setTicking(true);
      });
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => { window.removeEventListener("scroll", fn); cancelAnimationFrame(raf); };
  }, [ticking]);

  /* clock */
  useEffect(() => {
    const t = () => {
      const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
      const ist = new Date(utc + 19800000);
      const p = (n: number) => String(n).padStart(2, "0");
      setClock(`${p(ist.getHours())}:${p(ist.getMinutes())} IST`);
    };
    t(); const id = setInterval(t, 1000); return () => clearInterval(id);
  }, []);

  /* hero slideshow */
  useEffect(() => {
    const id = setInterval(() => setHero(i => (i + 1) % heroImgs.length), 5000);
    return () => clearInterval(id);
  }, []);

  /* esc */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenu(false); setLb(null); } };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  /* counter */
  function Counter({ to, suf, label }: { to: number; suf: string; label: string }) {
    const [v, setV] = useState(0);
    const done = useRef(false);
    useEffect(() => {
      if (!ticking || done.current) return;
      done.current = true;
      let c = 0;
      const step = Math.ceil(to / 50);
      const id = setInterval(() => { c = Math.min(c + step, to); setV(c); if (c >= to) clearInterval(id); }, 20);
      return () => clearInterval(id);
    }, [ticking]);
    return (
      <FadeIn className="text-center" style={{ padding: "32px 20px", background: BG3, border: `1px solid rgba(184,154,106,.1)` }}>
        <span style={{ ...SERIF, display: "block", fontSize: 52, fontWeight: 300, color: CREAM, lineHeight: 1 }}>{v}{suf}</span>
        <span style={{ ...SANS, display: "block", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginTop: 8 }}>{label}</span>
      </FadeIn>
    );
  }

  const projects = [
    { img: "/images/p2.webp",  title: "The Classical Residence", loc: "South Delhi",     year: "2024", tag: "Residential" },
    { img: "/images/p12.webp", title: "The Chandelier Suite",    loc: "Greater Kailash", year: "2024", tag: "Dining"       },
    { img: "/images/p1.webp",  title: "Contemporary Villa",      loc: "Gurugram",        year: "2024", tag: "Residential" },
    { img: "/images/p14.webp", title: "The Grey Manor",          loc: "Lutyens Delhi",   year: "2023", tag: "Apartment"   },
    { img: "/images/p10.webp", title: "Walnut Study",            loc: "Vasant Vihar",    year: "2023", tag: "Commercial"  },
    { img: "/images/p13.webp", title: "Marble Pavilion",         loc: "Defence Colony",  year: "2022", tag: "Residential" },
  ];

  const gallery = [
    { img: "/images/p3.webp",  label: "Heritage Corridor",  tall: true  },
    { img: "/images/p5.webp",  label: "Open Plan Living",   tall: false },
    { img: "/images/p4.webp",  label: "Burgundy Alcove",    tall: false },
    { img: "/images/p7.webp",  label: "Classical Seating",  tall: false },
    { img: "/images/p6.webp",  label: "Walnut Interior",    tall: false },
    { img: "/images/p11.webp", label: "Gallery Corridor",   tall: true  },
  ];

  const testimonials = [
    { q: "Craftmen Studio transformed our home into something we could never have imagined. Every detail was considered with absolute care.", name: "Priya & Arjun Mehra", role: "South Delhi", init: "PM" },
    { q: "The classical living room they designed has become the soul of our home. Every guest asks about it without fail.", name: "Sunita Kapoor", role: "Vasant Vihar", init: "SK" },
    { q: "From marble flooring to hand-picked art — every element felt intentional. This is what real interior architecture looks like.", name: "Vikram Sharma", role: "Lutyens Delhi", init: "VS" },
  ];

  const sec: React.CSSProperties = { padding: "96px 64px" };
  const secDark: React.CSSProperties = { ...sec, background: BG2 };

  return (
    <>
      {/* font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; scroll-padding-top: 80px; overflow-x: hidden; }
        body { background: #0a0908; color: #f2ede7; font-family: Jost, sans-serif; font-weight: 300; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        ::selection { background: #b89a6a; color: #0a0908; }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-track { background: #0a0908; }
        ::-webkit-scrollbar-thumb { background: #b89a6a; border-radius: 2px; }
        details summary { list-style: none; cursor: pointer; }
        details summary::-webkit-details-marker { display: none; }
        a { text-decoration: none; }
        img { display: block; }
        @keyframes sb { 0%{transform:translateY(-100%);opacity:0} 30%{opacity:1} 70%{opacity:1} 100%{transform:translateY(250%);opacity:0} }
        @keyframes mq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes pp { 0%,100%{box-shadow:0 0 0 4px rgba(184,154,106,.25),0 0 0 8px rgba(184,154,106,.08)} 50%{box-shadow:0 0 0 8px rgba(184,154,106,.15),0 0 0 16px rgba(184,154,106,.04)} }
        @media(max-width:768px) {
          .hide-mob { display: none !important; }
          .sec-pad  { padding: 64px 20px !important; }
          .hero-txt  { padding: 0 20px 80px !important; }
          .grid-4   { grid-template-columns: 1fr 1fr !important; }
          .grid-3   { grid-template-columns: 1fr !important; }
          .grid-2   { grid-template-columns: 1fr !important; }
          .bento    { grid-template-columns: 1fr !important; grid-auto-rows: 280px !important; }
          .svc-grid { grid-template-columns: 1fr !important; }
          .about-grid { grid-template-columns: 1fr !important; }
          .ft-top   { flex-direction: column !important; }
          .ft-cols  { flex-direction: column !important; gap: 24px !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .faq-grid  { grid-template-columns: 1fr !important; }
          .nav-inner { padding: 14px 20px !important; }
        }
      `}</style>

      {/* progress */}
      <div style={{ position: "fixed", top: 0, left: 0, height: 2, zIndex: 9999, width: `${pct}%`, background: `linear-gradient(to right, #8a7050, #b89a6a, #d4b896)`, transition: "width .12s ease", pointerEvents: "none" }} />

      {/* back to top */}
      <AnimatePresence>
        {btt && (
          <motion.button
            style={{ position: "fixed", bottom: 28, right: 28, zIndex: 400, width: 44, height: 44, background: BG3, border: `1px solid rgba(184,154,106,.35)`, color: GOLD, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</motion.button>
        )}
      </AnimatePresence>

      {/* ══════════════════ NAVBAR ══════════════════ */}
      <nav className="nav-inner" style={{
        position: "fixed", top: 0, width: "100%", zIndex: 500,
        display: "flex", alignItems: "center", gap: 24, padding: solid ? "12px 64px" : "20px 64px",
        background: solid ? "rgba(10,9,8,.94)" : "transparent",
        backdropFilter: solid ? "blur(20px)" : "none",
        borderBottom: solid ? "1px solid rgba(184,154,106,.1)" : "none",
        transition: "all .35s ease",
      }}>
        <a href="#" style={{ marginRight: "auto", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <img src="/images/logo.webp" alt="Craftmen Studio" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} />
          <div className="hide-mob" style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <span style={{ ...SANS, fontSize: 8, letterSpacing: "0.5em", textTransform: "uppercase", color: GOLD }}>Interior Architecture</span>
            <span style={{ ...SERIF, fontSize: 18, fontWeight: 300, color: CREAM }}>Craftmen Studio</span>
          </div>
        </a>

        {/* pill nav */}
        <div className="hide-mob" style={{ display: "flex", alignItems: "center", gap: 2, borderRadius: 100, padding: "4px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
          {["Projects","Process","Services","About","Contact"].map(n => (
            <a key={n} href={`#${n.toLowerCase()}`}
              style={{ ...SANS, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(242,237,231,.55)", padding: "7px 16px", borderRadius: 100, transition: "color .25s" }}
              onMouseEnter={e => (e.currentTarget.style.color = CREAM)}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(242,237,231,.55)")}>{n}</a>
          ))}
        </div>

        <span className="hide-mob" style={{ ...SANS, fontSize: 10, letterSpacing: "0.14em", color: "#4a4845" }}>{clock}</span>

        <a href="#contact" className="hide-mob"
          style={{ ...SANS, fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase", background: GOLD, color: BG, padding: "10px 22px", flexShrink: 0, transition: "background .25s" }}
          onMouseEnter={e => (e.currentTarget.style.background = GOLD2)}
          onMouseLeave={e => (e.currentTarget.style.background = GOLD)}>Enquire</a>

        <button style={{ display: "none" }} className="hide-mob" />
        <button
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexDirection: "column", gap: 5 }}
          onClick={() => setMenu(true)}>
          <span style={{ display: "block", width: 24, height: 1, background: CREAM }} />
          <span style={{ display: "block", width: 24, height: 1, background: CREAM }} />
          <span style={{ display: "block", width: 24, height: 1, background: CREAM }} />
        </button>
      </nav>

      {/* ══════════════════ MOBILE MENU ══════════════════ */}
      <AnimatePresence>
        {menu && (
          <motion.div style={{ position: "fixed", inset: 0, zIndex: 800, background: BG2, display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 40px" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <button style={{ position: "absolute", top: 24, right: 40, background: "none", border: "none", cursor: "pointer", color: GOLD }} onClick={() => setMenu(false)}>
              <X size={26} />
            </button>
            {["Projects","Process","Services","About","Contact"].map((n, i) => (
              <motion.a key={n} href={`#${n.toLowerCase()}`}
                style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: "1px solid rgba(184,154,106,.1)", color: CREAM, transition: "color .25s" }}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }} onClick={() => setMenu(false)}
                onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={e => (e.currentTarget.style.color = CREAM)}>
                <span style={{ ...SANS, fontSize: 9, letterSpacing: "0.22em", color: GOLD, width: 24 }}>0{i + 1}</span>
                <span style={{ ...SERIF, fontSize: 38, fontWeight: 300, flex: 1 }}>{n}</span>
                <ArrowRight size={18} color={GOLD} />
              </motion.a>
            ))}
            <div style={{ position: "absolute", bottom: 32, left: 40, ...SANS, fontSize: 11, color: "#4a4845", display: "flex", flexDirection: "column", gap: 4 }}>
              <span>+91 98717 66962</span>
              <span>350, MG Rd, Sultanpur, New Delhi 110030</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════ HERO ══════════════════ */}
      <section id="hero" style={{ position: "relative", height: "100vh", minHeight: 700, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        {heroImgs.map((src, i) => (
          <motion.div key={src} style={{ position: "absolute", inset: 0 }}
            initial={{ opacity: 0 }} animate={{ opacity: i === hero ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}>
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(130deg, rgba(10,9,8,.9) 0%, rgba(10,9,8,.4) 55%, rgba(10,9,8,.7) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,9,8,.97) 0%, transparent 50%)" }} />

        <div className="hero-txt" style={{ position: "relative", zIndex: 2, padding: "0 64px 96px", maxWidth: 1000, width: "100%" }}>
          <FadeIn delay={0.1}><Label text="New Delhi · Est. 2019 · Interior Architecture" /></FadeIn>
          <h1 style={{ ...SERIF, fontWeight: 300, lineHeight: 0.92, color: CREAM, marginBottom: 24 }}>
            <FadeIn delay={0.25}><span style={{ display: "block", fontSize: "clamp(64px,10vw,148px)" }}>Spaces That</span></FadeIn>
            <FadeIn delay={0.45}><span style={{ display: "block", fontSize: "clamp(64px,10vw,148px)", fontStyle: "italic", color: GOLD2, paddingLeft: "clamp(32px,5vw,80px)" }}>Tell Stories</span></FadeIn>
          </h1>
          <FadeIn delay={0.65}>
            <p style={{ ...SANS, fontSize: 14, fontWeight: 300, color: "rgba(242,237,231,.58)", lineHeight: 1.8, maxWidth: 380, marginBottom: 32 }}>
              Bespoke interior architecture rooted in Indian craft and refined by a contemporary spatial sensibility.
            </p>
          </FadeIn>
          <FadeIn delay={0.8}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
              <a href="#projects"
                style={{ ...SANS, fontSize: 10, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", background: GOLD, color: BG, padding: "14px 28px", display: "inline-flex", alignItems: "center", gap: 12, transition: "all .3s" }}
                onMouseEnter={e => { e.currentTarget.style.background = GOLD2; e.currentTarget.style.gap = "18px"; }}
                onMouseLeave={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.gap = "12px"; }}>
                View Our Work <ArrowRight size={14} />
              </a>
              <a href="#about"
                style={{ ...SANS, fontSize: 11, letterSpacing: "0.14em", color: "rgba(242,237,231,.38)", transition: "color .3s" }}
                onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(242,237,231,.38)")}>Our Practice →</a>
            </div>
          </FadeIn>
          <FadeIn delay={0.95}>
            <div style={{ display: "flex", alignItems: "center", paddingTop: 24, borderTop: "1px solid rgba(184,154,106,.18)", maxWidth: 340 }}>
              {[["24+","Projects"],["5+","Years"],["100%","Bespoke"]].map(([n, l], i) => (
                <div key={l} style={{ flex: 1, paddingRight: i < 2 ? 16 : 0, marginRight: i < 2 ? 16 : 0, borderRight: i < 2 ? "1px solid rgba(184,154,106,.18)" : "none" }}>
                  <span style={{ ...SERIF, display: "block", fontSize: 28, fontWeight: 300, color: CREAM, lineHeight: 1 }}>{n}</span>
                  <span style={{ ...SANS, display: "block", fontSize: 8, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, marginTop: 5 }}>{l}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* slide dots */}
        <div style={{ position: "absolute", bottom: 36, right: 64, zIndex: 2, display: "flex", gap: 8 }}>
          {heroImgs.map((_, i) => (
            <button key={i} onClick={() => setHero(i)} style={{ height: 1, border: "none", cursor: "pointer", transition: "all .4s", width: i === hero ? 32 : 14, background: i === hero ? GOLD : "rgba(184,154,106,.3)" }} />
          ))}
        </div>

        {/* scroll rail */}
        <div style={{ position: "absolute", right: 64, bottom: 120, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, ...SANS, fontSize: 8, letterSpacing: "0.35em", textTransform: "uppercase" as const, color: "#4a4845" }}>
          <div style={{ width: 1, height: 48, background: "rgba(242,237,231,.1)", overflow: "hidden", position: "relative" }}>
            <div style={{ width: 1, height: "40%", background: GOLD, position: "absolute", animation: "sb 2.2s ease infinite" }} />
          </div>
          <span>Scroll</span>
        </div>
      </section>

      {/* ── marquee ── */}
      <div style={{ overflow: "hidden", background: BG2, borderTop: "1px solid rgba(184,154,106,.1)", borderBottom: "1px solid rgba(184,154,106,.1)", padding: "12px 0" }}>
        <div style={{ display: "flex", width: "max-content", animation: "mq 40s linear infinite" }}>
          {Array(10).fill(null).map((_, i) => (
            <span key={i} style={{ ...SANS, display: "flex", alignItems: "center", gap: 16, padding: "0 8px", fontSize: 9.5, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "#4a4845", whiteSpace: "nowrap" as const }}>
              <span style={{ color: GOLD, fontSize: 7 }}>◈</span>Residential Design
              <span style={{ color: GOLD, fontSize: 7 }}>◈</span>Commercial Interiors
              <span style={{ color: GOLD, fontSize: 7 }}>◈</span>Turnkey Projects
              <span style={{ color: GOLD, fontSize: 7 }}>◈</span>Luxury Spaces
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════ STATS ══════════════════ */}
      <section id="numbers" style={{ ...secDark }} className="sec-pad">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2, marginBottom: 56 }} className="grid-4">
          <Counter to={24}  suf="+" label="Projects Completed" />
          <Counter to={5}   suf="+" label="Years of Practice"  />
          <Counter to={100} suf="%" label="Bespoke Design"     />
          <Counter to={14}  suf=""  label="Industry Awards"    />
        </div>
        <FadeIn style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <span style={{ flex: 1, height: 1, background: "rgba(184,154,106,.14)" }} />
          <p style={{ ...SERIF, fontSize: 19, fontWeight: 300, color: GRAY, textAlign: "center", maxWidth: 500, lineHeight: 1.7, flexShrink: 0 }}>
            Every project begins with a single question:<br />
            <em style={{ color: GOLD2, fontStyle: "italic" }}>How do you want to feel when you come home?</em>
          </p>
          <span style={{ flex: 1, height: 1, background: "rgba(184,154,106,.14)" }} />
        </FadeIn>
      </section>

      {/* ══════════════════ PROJECTS ══════════════════ */}
      <section id="projects" style={{ ...sec, background: BG }} className="sec-pad">
        <FadeIn><Label text="Selected Work · 2022–2024" /></FadeIn>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 64, marginBottom: 48 }}>
          <FadeIn>
            <h2 style={{ ...SERIF, fontSize: "clamp(40px,5.5vw,80px)", fontWeight: 300, lineHeight: 1, color: CREAM }}>
              Case <em style={{ fontStyle: "italic", color: GOLD2 }}>Studies</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} style={{ ...SANS, fontSize: 14, fontWeight: 300, color: GRAY, lineHeight: 1.85, maxWidth: 360, paddingTop: 10 }}>
            Six spaces that define our range — from intimate master suites to sprawling villas.
          </FadeIn>
        </div>

        {/* bento */}
        <div className="bento" style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 3, gridAutoRows: 400 }}>
          {projects.map((p, i) => {
            const cols = ["7","5","5","7","6","6"];
            const mt   = i === 2 ? "60px" : "0px";
            return (
              <FadeIn key={i} delay={i * 0.07}
                style={{ gridColumn: `span ${cols[i]}`, marginTop: mt, position: "relative", overflow: "hidden", cursor: "pointer", background: BG3 } as React.CSSProperties}
                className="proj-card"
                onClick={() => setLb(p.img)}>
                <img src={p.img} alt={p.title} loading="lazy"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 1.1s cubic-bezier(.16,1,.3,1)" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,9,8,.88) 0%, rgba(10,9,8,.08) 50%, transparent 100%)" }} />
                <span style={{ position: "absolute", top: 14, right: 14, ...SANS, fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase" as const, background: GOLD, color: BG, padding: "4px 10px", zIndex: 2 }}>{p.tag}</span>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, zIndex: 2 }}>
                  <div style={{ ...SANS, fontSize: 9, color: GOLD, display: "flex", gap: 12, marginBottom: 6 }}>
                    <span>{p.year}</span>
                  </div>
                  <h3 style={{ ...SERIF, fontSize: 22, fontWeight: 300, color: CREAM, lineHeight: 1.2 }}>{p.title}</h3>
                  <p style={{ ...SANS, fontSize: 10, color: GRAY, marginTop: 3 }}>{p.loc}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* ══════════════════ QUOTE BREAK ══════════════════ */}
      <div style={{ position: "relative", height: 460, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <img src="/images/p8.webp" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.07)" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,9,8,.78)" }} />
        <FadeIn style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 32px", maxWidth: 680 }}>
          <span style={{ ...SERIF, fontSize: 72, color: GOLD, opacity: 0.18, display: "block", lineHeight: 0.5, marginBottom: 8 }}>"</span>
          <p style={{ ...SERIF, fontSize: "clamp(20px,2.8vw,38px)", fontWeight: 300, fontStyle: "italic", color: CREAM, lineHeight: 1.5 }}>
            We believe a home should feel like an extension of the person who lives in it — not a showroom.
          </p>
          <span style={{ ...SANS, display: "block", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD, marginTop: 24 }}>
            — Founder, Craftmen Studio
          </span>
        </FadeIn>
      </div>

      {/* ══════════════════ PROCESS ══════════════════ */}
      <section id="process" style={{ ...secDark }} className="sec-pad">
        <FadeIn><Label text="How We Work" /></FadeIn>
        <FadeIn>
          <h2 style={{ ...SERIF, fontSize: "clamp(40px,5.5vw,80px)", fontWeight: 300, lineHeight: 1, color: CREAM, marginBottom: 48 }}>
            The <em style={{ fontStyle: "italic", color: GOLD2 }}>Process</em>
          </h2>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2 }} className="grid-4">
          {[
            { n:"01", icon:"◎", t:"Discovery",  d:"An unhurried conversation about how you live, what you love, and what has always felt slightly off. We listen before we propose anything." },
            { n:"02", icon:"◈", t:"Concept",    d:"A fully formed design direction — mood boards, material samples, and spatial sketches. Nothing is shown until it has a clear point of view." },
            { n:"03", icon:"◫", t:"Design",     d:"Complete construction drawings, 3D renders, and material specifications. Every decision resolved on paper before touching your walls." },
            { n:"04", icon:"◉", t:"Execution",  d:"We manage every contractor, artisan, and delivery. You see your space only when it is completely finished." },
          ].map((s, i) => (
            <FadeIn key={i} delay={i * 0.09}
              style={{ padding: "36px 28px", background: BG3, border: `1px solid rgba(184,154,106,.08)`, position: "relative", overflow: "hidden", transition: "transform .3s, border-color .3s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(184,154,106,.3)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(184,154,106,.08)"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <span style={{ ...SANS, fontSize: 9, letterSpacing: "0.3em", color: GOLD }}>{s.n}</span>
                <span style={{ flex: 1, height: 1, background: "rgba(184,154,106,.18)" }} />
              </div>
              <p style={{ fontSize: 22, color: GOLD2, marginBottom: 12 }}>{s.icon}</p>
              <h3 style={{ ...SERIF, fontSize: 26, fontWeight: 300, color: CREAM, marginBottom: 12 }}>{s.t}</h3>
              <p style={{ ...SANS, fontSize: 13, fontWeight: 300, color: GRAY, lineHeight: 1.85 }}>{s.d}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════════════════ SERVICES ══════════════════ */}
      <section id="services" style={{ ...sec, background: BG, display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 72 }} className="sec-pad svc-grid">
        <div style={{ position: "sticky", top: 90, alignSelf: "start" }}>
          <FadeIn><Label text="What We Offer" /></FadeIn>
          <FadeIn>
            <h2 style={{ ...SERIF, fontSize: "clamp(40px,5.5vw,80px)", fontWeight: 300, lineHeight: 1, color: CREAM, marginBottom: 16 }}>
              Our <em style={{ fontStyle: "italic", color: GOLD2 }}>Services</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p style={{ ...SANS, fontSize: 14, fontWeight: 300, color: GRAY, lineHeight: 1.85, marginBottom: 28, maxWidth: 300 }}>
              From a single room to a complete villa — the same depth of attention to every square foot.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <a href="#contact"
              style={{ ...SANS, fontSize: 10, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", background: GOLD, color: BG, padding: "13px 24px", display: "inline-flex", alignItems: "center", gap: 12, transition: "all .3s" }}
              onMouseEnter={e => { e.currentTarget.style.background = GOLD2; }}
              onMouseLeave={e => { e.currentTarget.style.background = GOLD; }}>
              Start a Project <ArrowRight size={14} />
            </a>
          </FadeIn>
        </div>
        <div>
          {[
            { n:"01", t:"Residential Design",   tags:["Apartments","Villas","Farmhouses"],  d:"Tailored interiors built around your lifestyle, your aesthetic, and the craft traditions we hold dear." },
            { n:"02", t:"Commercial Interiors",  tags:["Offices","Hotels","Restaurants"],    d:"Spaces that communicate brand identity through architecture — where the room does the talking." },
            { n:"03", t:"Turnkey Execution",     tags:["Full Handover","Project Management"],d:"We handle every vendor and timeline. You arrive to a finished space on the agreed date." },
            { n:"04", t:"Renovation & Refresh",  tags:["Remodels","Lighting","Art Curation"],d:"Surgical interventions that breathe new life into existing spaces without unnecessary disruption." },
          ].map((s, i) => (
            <FadeIn key={i} delay={i * 0.08}
              style={{ borderBottom: "1px solid rgba(184,154,106,.12)", padding: "22px 0", cursor: "default" }}
              className="svc-row">
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}
                onMouseEnter={e => { const p = e.currentTarget.nextElementSibling as HTMLElement; if (p) p.style.display = "block"; (e.currentTarget.querySelector(".svc-plus") as HTMLElement).style.transform = "rotate(45deg)"; }}
                onMouseLeave={e => { const p = e.currentTarget.nextElementSibling as HTMLElement; if (p) p.style.display = "none"; (e.currentTarget.querySelector(".svc-plus") as HTMLElement).style.transform = "rotate(0deg)"; }}>
                <span style={{ ...SANS, fontSize: 9, letterSpacing: "0.22em", color: GOLD, width: 20 }}>{s.n}</span>
                <h3 style={{ ...SERIF, fontSize: 24, fontWeight: 300, color: CREAM, flex: 1 }}>{s.t}</h3>
                <span className="svc-plus" style={{ fontSize: 22, color: GOLD, fontWeight: 200, transition: "transform .3s" }}>+</span>
              </div>
              <div style={{ display: "none", paddingLeft: 36, paddingTop: 12 }}>
                <p style={{ ...SANS, fontSize: 13, fontWeight: 300, color: GRAY, lineHeight: 1.85, marginBottom: 10 }}>{s.d}</p>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                  {s.tags.map(t => <span key={t} style={{ ...SANS, fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: GOLD, border: `1px solid rgba(184,154,106,.3)`, padding: "3px 10px" }}>{t}</span>)}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════════════════ ABOUT ══════════════════ */}
      <section id="about" style={{ ...secDark, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }} className="sec-pad about-grid">
        <FadeIn style={{ position: "relative" }}>
          <div style={{ overflow: "hidden" }}>
            <img src="/images/p7.webp" alt="Craftmen Studio" loading="lazy"
              style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", transition: "transform 1s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
          </div>
          <div style={{ position: "absolute", bottom: -24, right: -24, width: "42%", border: `3px solid ${BG2}`, overflow: "hidden" }}>
            <img src="/images/p9.webp" alt="" loading="lazy" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
          </div>
          <div style={{ position: "absolute", top: 28, left: -16, background: BG3, border: `1px solid rgba(184,154,106,.25)`, padding: "12px 16px", textAlign: "center" }}>
            <span style={{ ...SERIF, display: "block", fontSize: 36, fontWeight: 300, color: GOLD, lineHeight: 1 }}>5+</span>
            <span style={{ ...SANS, display: "block", fontSize: 8, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GRAY, marginTop: 4 }}>Years</span>
          </div>
        </FadeIn>
        <div>
          <FadeIn><Label text="The Practice" /></FadeIn>
          <FadeIn>
            <h2 style={{ ...SERIF, fontSize: "clamp(40px,5.5vw,80px)", fontWeight: 300, lineHeight: 1, color: CREAM, marginBottom: 20 }}>
              About <em style={{ fontStyle: "italic", color: GOLD2 }}>Craftmen</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p style={{ ...SANS, fontSize: 14, fontWeight: 300, color: GRAY, lineHeight: 1.95, marginBottom: 16 }}>
              Craftmen Studio is based in Sultanpur, New Delhi. We work at the intersection of Indian craft heritage and contemporary spatial thinking — designing homes and spaces that feel deeply personal and effortlessly refined.
            </p>
          </FadeIn>
          <FadeIn delay={0.18}>
            <p style={{ ...SANS, fontSize: 14, fontWeight: 300, color: GRAY, lineHeight: 1.95, marginBottom: 28 }}>
              We believe the best interiors are never about trends. They are about how light behaves at different hours, how materiality affects mood, and how architecture shapes the rituals of daily life.
            </p>
          </FadeIn>
          <FadeIn delay={0.26} style={{ display: "flex", gap: 28, paddingTop: 24, borderTop: "1px solid rgba(184,154,106,.16)" }}>
            {[["24+","Projects"],["5+","Years"],["100%","Bespoke"]].map(([n, l]) => (
              <div key={l}>
                <span style={{ ...SERIF, display: "block", fontSize: 34, fontWeight: 300, color: CREAM, lineHeight: 1 }}>{n}</span>
                <span style={{ ...SANS, display: "block", fontSize: 8, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GOLD, marginTop: 4 }}>{l}</span>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════ GALLERY ══════════════════ */}
      <section style={{ ...sec, background: BG }} className="sec-pad">
        <FadeIn><Label text="Visual Diary" /></FadeIn>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 64, marginBottom: 40 }}>
          <FadeIn>
            <h2 style={{ ...SERIF, fontSize: "clamp(40px,5.5vw,80px)", fontWeight: 300, lineHeight: 1, color: CREAM }}>
              Spaces We've <em style={{ fontStyle: "italic", color: GOLD2 }}>Made</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} style={{ ...SANS, fontSize: 14, fontWeight: 300, color: GRAY, lineHeight: 1.85, maxWidth: 340, paddingTop: 10 }}>
            A selection from our portfolio — rooms built on restraint, craft, and material quality.
          </FadeIn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 3, gridAutoRows: "220px" }} className="grid-4">
          {gallery.map((g, i) => (
            <FadeIn key={i} delay={i * 0.06}
              style={{ overflow: "hidden", position: "relative", cursor: "pointer", background: BG3, gridRow: g.tall ? "span 2" : "span 1" } as React.CSSProperties}
              onClick={() => setLb(g.img)}>
              <img src={g.img} alt={g.label} loading="lazy"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.9)", transition: "transform 1s ease, filter 1s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.06)"; e.currentTarget.style.filter = "brightness(1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.filter = "brightness(.9)"; }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: 14, opacity: 0, background: "rgba(10,9,8,.42)", transition: "opacity .35s" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0")}>
                <span style={{ ...SERIF, fontSize: 14, fontStyle: "italic", color: CREAM }}>{g.label}</span>
                <ArrowRight size={14} color={GOLD} />
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── materials ── */}
      <div style={{ ...sec, background: BG2, paddingTop: 56, paddingBottom: 56 }} className="sec-pad">
        <FadeIn><Label text="Signature Materials" /></FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 2, marginTop: 16 }} className="grid-4">
          {[["Marble","Statuario & Nero"],["Timber","Walnut & Teak"],["Metal","Antique Brass"],["Finish","Venetian Plaster"],["Textile","Aged Velvet"],["Stone","Fossil Limestone"]].map(([t, n], i) => (
            <FadeIn key={i} delay={i * 0.07}
              style={{ padding: "22px 14px", textAlign: "center", background: BG3, border: `1px solid rgba(184,154,106,.08)`, transition: "transform .3s, border-color .3s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(184,154,106,.3)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(184,154,106,.08)"; }}>
              <span style={{ ...SANS, display: "block", fontSize: 8, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 6 }}>{t}</span>
              <span style={{ ...SERIF, display: "block", fontSize: 14, fontWeight: 300, color: CREAM }}>{n}</span>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section style={{ ...sec, background: BG }} className="sec-pad">
        <FadeIn><Label text="Client Voices" /></FadeIn>
        <FadeIn style={{ marginBottom: 40 }}>
          <h2 style={{ ...SERIF, fontSize: "clamp(40px,5.5vw,80px)", fontWeight: 300, lineHeight: 1, color: CREAM }}>
            What They <em style={{ fontStyle: "italic", color: GOLD2 }}>Say</em>
          </h2>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 3 }} className="grid-3">
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.09}
              style={{ padding: "32px 28px", background: BG3, border: `1px solid rgba(184,154,106,.08)`, position: "relative", transition: "transform .3s, border-color .3s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(184,154,106,.28)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(184,154,106,.08)"; }}>
              <span style={{ ...SERIF, fontSize: 56, color: GOLD, opacity: 0.2, display: "block", lineHeight: 0.6, marginBottom: 8 }}>"</span>
              <p style={{ ...SERIF, fontSize: 15, fontWeight: 300, fontStyle: "italic", color: CREAM, lineHeight: 1.7, marginBottom: 22 }}>{t.q}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#8a7050", display: "flex", alignItems: "center", justifyContent: "center", ...SERIF, fontSize: 13, color: BG, flexShrink: 0 }}>{t.init}</div>
                <div>
                  <span style={{ ...SANS, display: "block", fontSize: 12, fontWeight: 400, color: CREAM }}>{t.name}</span>
                  <span style={{ ...SANS, display: "block", fontSize: 9, letterSpacing: "0.1em", color: GOLD, marginTop: 2 }}>{t.role}</span>
                </div>
              </div>
            </FadeIn>
          ))}
          <FadeIn delay={0.32} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 8, background: GOLD }}>
            <span style={{ ...SERIF, fontSize: 52, fontWeight: 300, color: BG, lineHeight: 1 }}>24+</span>
            <span style={{ ...SANS, fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "rgba(10,9,8,.65)" }}>Happy Clients</span>
          </FadeIn>
          <FadeIn delay={0.4} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 8, background: BG3, border: `1px solid rgba(184,154,106,.08)` }}>
            <span style={{ ...SERIF, fontSize: 52, fontWeight: 300, color: GOLD, lineHeight: 1 }}>14</span>
            <span style={{ ...SANS, fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: GRAY }}>Industry Awards</span>
          </FadeIn>
          <FadeIn delay={0.48} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 14, background: BG3, border: `1px solid rgba(184,154,106,.08)` }}>
            <img src="/images/logo.webp" alt="Craftmen Studio" style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }} />
            <p style={{ ...SERIF, fontSize: 14, fontWeight: 300, fontStyle: "italic", textAlign: "center", color: GRAY, lineHeight: 1.65 }}>Crafted with intention, not automation.</p>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════ FAQ ══════════════════ */}
      <section style={{ ...secDark, display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 64 }} className="sec-pad faq-grid">
        <div>
          <FadeIn><Label text="Common Questions" /></FadeIn>
          <FadeIn>
            <h2 style={{ ...SERIF, fontSize: "clamp(40px,5.5vw,80px)", fontWeight: 300, lineHeight: 1, color: CREAM }}>
              Frequently <em style={{ fontStyle: "italic", color: GOLD2 }}>Asked</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p style={{ ...SANS, fontSize: 14, fontWeight: 300, color: GRAY, lineHeight: 1.85, marginTop: 16, maxWidth: 280 }}>
              Everything you need to know before we begin — answered honestly.
            </p>
          </FadeIn>
        </div>
        <div>
          {[
            { q:"How long does a residential project take?",          a:"A complete interior from first meeting to handover typically takes 4–8 months depending on scope. Timelines are mapped in our initial proposal." },
            { q:"Do you work outside Delhi?",                         a:"Yes — we take projects across India. We have worked in Mumbai, Bangalore, and Chandigarh. Travel costs are included in the project proposal." },
            { q:"What is your minimum project budget?",               a:"Minimum execution budget of ₹45 lakhs for residential and ₹60 lakhs for commercial. Smaller consultancy engagements are available case-by-case." },
            { q:"Can we see the design before construction begins?",  a:"Absolutely. Full 3D renders, virtual walkthroughs, and material samples are part of our design phase. Nothing is executed without your written approval." },
            { q:"How involved do we need to be during execution?",    a:"As involved as you prefer. We handle all contractor communication daily. Most clients choose weekly updates and bi-weekly site visits." },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.07}>
              <details style={{ borderBottom: "1px solid rgba(184,154,106,.12)" }}>
                <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "18px 0", ...SANS, fontSize: 14, fontWeight: 300, color: CREAM, transition: "color .3s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = GOLD2)}
                  onMouseLeave={e => (e.currentTarget.style.color = CREAM)}>
                  <span>{item.q}</span>
                  <span style={{ fontSize: 22, color: GOLD, fontWeight: 200, flexShrink: 0 }}>+</span>
                </summary>
                <p style={{ ...SANS, fontSize: 13, fontWeight: 300, color: GRAY, lineHeight: 1.85, paddingBottom: 18 }}>{item.a}</p>
              </details>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <div style={{ position: "relative", padding: "96px 64px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <img src="/images/p13.webp" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.6)" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,9,8,.88)" }} />
        <FadeIn style={{ position: "relative", zIndex: 2, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <span style={{ ...SANS, fontSize: 9, letterSpacing: "0.38em", textTransform: "uppercase" as const, color: GOLD }}>Ready to Begin?</span>
          <h2 style={{ ...SERIF, fontSize: "clamp(30px,5vw,62px)", fontWeight: 300, color: CREAM, lineHeight: 1.1 }}>
            Your space is waiting<br /><em style={{ fontStyle: "italic", color: GOLD2 }}>to be transformed.</em>
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" as const, justifyContent: "center" }}>
            <a href="#contact"
              style={{ ...SANS, fontSize: 10, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", background: GOLD, color: BG, padding: "13px 28px", display: "inline-flex", alignItems: "center", gap: 12, transition: "all .3s" }}
              onMouseEnter={e => (e.currentTarget.style.background = GOLD2)}
              onMouseLeave={e => (e.currentTarget.style.background = GOLD)}>
              Start a Conversation <ArrowRight size={14} />
            </a>
            <a href="tel:+919871766962"
              style={{ ...SANS, fontSize: 13, color: "rgba(242,237,231,.4)", transition: "color .3s" }}
              onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(242,237,231,.4)")}>
              +91 98717 66962
            </a>
          </div>
        </FadeIn>
      </div>

      {/* ══════════════════ CONTACT ══════════════════ */}
      <section id="contact" style={{ ...sec, background: BG }} className="sec-pad">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 64, maxWidth: 1300 }} className="contact-grid">
          <div>
            <FadeIn><Label text="Begin a Conversation" /></FadeIn>
            <FadeIn>
              <h2 style={{ ...SERIF, fontSize: "clamp(40px,5.5vw,80px)", fontWeight: 300, lineHeight: 1, color: CREAM, marginBottom: 32 }}>
                Let's Create<br /><em style={{ fontStyle: "italic", color: GOLD2 }}>Something</em><br />Extraordinary
              </h2>
            </FadeIn>
            <FadeIn delay={0.12} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: <MapPin size={13} />, k: "Studio", v: "350, Mehrauli-Gurgaon Road, Sultanpur\nNew Delhi, Delhi 110030" },
                { icon: <Phone size={13} />,  k: "Phone",  v: "+91 98717 66962", href: "tel:+919871766962" },
                { icon: <Clock size={13} />,  k: "Hours",  v: "Mon–Sat, 10am–7pm IST" },
              ].map(({ icon, k, v, href }) => (
                <div key={k} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ color: GOLD, marginTop: 2, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <span style={{ ...SANS, display: "block", fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 4 }}>{k}</span>
                    {href
                      ? <a href={href} style={{ ...SANS, fontSize: 14, fontWeight: 300, color: GRAY, whiteSpace: "pre-line" as const, transition: "color .3s" }}
                          onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                          onMouseLeave={e => (e.currentTarget.style.color = GRAY)}>{v}</a>
                      : <span style={{ ...SANS, fontSize: 14, fontWeight: 300, color: GRAY, whiteSpace: "pre-line" as const }}>{v}</span>}
                  </div>
                </div>
              ))}
            </FadeIn>
          </div>

          <FadeIn delay={0.2} style={{ padding: 36, background: BG3, border: `1px solid rgba(184,154,106,.16)` }}>
            <p style={{ ...SERIF, fontSize: 22, fontWeight: 300, color: CREAM, marginBottom: 24 }}>Send an Enquiry</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              {[["Full Name","Your name","text"],["Email","your@email.com","email"]].map(([l, p, t]) => (
                <div key={l} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ ...SANS, fontSize: 8, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>{l}</label>
                  <input type={t} placeholder={p}
                    style={{ ...SANS, background: BG2, border: `1px solid rgba(184,154,106,.18)`, padding: "10px 12px", color: CREAM, fontSize: 13, fontWeight: 300, outline: "none", width: "100%", transition: "border-color .3s" }}
                    onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(184,154,106,.18)")} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
              <label style={{ ...SANS, fontSize: 8, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>Project Type</label>
              <select style={{ ...SANS, background: BG2, border: `1px solid rgba(184,154,106,.18)`, padding: "10px 12px", color: CREAM, fontSize: 13, fontWeight: 300, outline: "none", width: "100%", appearance: "none" }}>
                <option value="">Select a service</option>
                <option>Residential Design</option>
                <option>Commercial Interiors</option>
                <option>Turnkey Project</option>
                <option>Renovation & Refresh</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
              <label style={{ ...SANS, fontSize: 8, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: GOLD }}>About Your Project</label>
              <textarea rows={4} placeholder="Location, area, budget range, timeline…"
                style={{ ...SANS, background: BG2, border: `1px solid rgba(184,154,106,.18)`, padding: "10px 12px", color: CREAM, fontSize: 13, fontWeight: 300, outline: "none", width: "100%", resize: "vertical", transition: "border-color .3s" }}
                onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(184,154,106,.18)")} />
            </div>
            <button
              style={{ ...SANS, background: GOLD, color: BG, fontSize: 10, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 28px", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 12, transition: "background .3s" }}
              onMouseEnter={e => (e.currentTarget.style.background = GOLD2)}
              onMouseLeave={e => (e.currentTarget.style.background = GOLD)}>
              Send Enquiry <ArrowRight size={15} />
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ── map ── */}
      <div style={{ position: "relative", height: 360 }}>
        <iframe
          src="https://maps.google.com/maps?q=350+Mehrauli+Gurgaon+Road+Sultanpur+New+Delhi&t=&z=14&ie=UTF8&iwloc=&output=embed"
          title="Craftmen Studio" style={{ width: "100%", height: "100%", border: "none", display: "block", filter: "grayscale(100%) contrast(.75) brightness(.5)" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", boxShadow: "inset 0 0 70px rgba(10,9,8,.9)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, pointerEvents: "none" }}>
          <div style={{ width: 12, height: 12, background: GOLD, borderRadius: "50%", animation: "pp 2s ease infinite" }} />
          <span style={{ ...SANS, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: CREAM, background: "rgba(10,9,8,.85)", border: `1px solid rgba(184,154,106,.25)`, padding: "5px 12px", whiteSpace: "nowrap" }}>
            Craftmen Studio · Sultanpur, New Delhi
          </span>
        </div>
      </div>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer style={{ padding: "64px 64px 28px", background: BG2, borderTop: "1px solid rgba(184,154,106,.1)" }}>
        <div className="ft-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48, paddingBottom: 48, borderBottom: "1px solid rgba(184,154,106,.09)", gap: 40, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <img src="/images/logo.webp" alt="Craftmen Studio" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
              <span style={{ ...SERIF, fontSize: 22, fontWeight: 300, color: CREAM }}>Craftmen <em style={{ fontStyle: "italic", color: GOLD2 }}>Studio</em></span>
            </div>
            <p style={{ ...SANS, fontSize: 10, letterSpacing: "0.13em", color: "#4a4845" }}>Interior Architecture & Spatial Design · New Delhi</p>
          </div>
          <div className="ft-cols" style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            {[
              { h:"Navigation", items:[["Projects","#projects"],["Process","#process"],["Services","#services"],["About","#about"],["Contact","#contact"]] },
              { h:"Services",   items:[["Residential Design","#services"],["Commercial Interiors","#services"],["Turnkey Projects","#services"],["Renovation","#services"]] },
              { h:"Contact",    items:[["+91 98717 66962","tel:+919871766962"],["350, MG Rd, Sultanpur",""],["New Delhi, Delhi 110030",""],["Mon–Sat 10am–7pm",""]] },
            ].map(({ h, items }) => (
              <div key={h} style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <span style={{ ...SANS, fontSize: 8, letterSpacing: "0.36em", textTransform: "uppercase" as const, color: GOLD, marginBottom: 4 }}>{h}</span>
                {items.map(([l, href]) => (
                  href
                    ? <a key={l} href={href} style={{ ...SANS, fontSize: 12, fontWeight: 300, color: "#4a4845", transition: "color .3s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = CREAM)}
                        onMouseLeave={e => (e.currentTarget.style.color = "#4a4845")}>{l}</a>
                    : <span key={l} style={{ ...SANS, fontSize: 12, fontWeight: 300, color: "#4a4845" }}>{l}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", ...SANS, fontSize: 10, color: "rgba(242,237,231,.18)", flexWrap: "wrap", gap: 8 }}>
          <span>© 2026 Craftmen Studio — All rights reserved</span>
          <em style={{ fontStyle: "italic" }}>Crafted with intention, not automation</em>
        </div>
      </footer>

      {/* ══════════════════ LIGHTBOX ══════════════════ */}
      <AnimatePresence>
        {lb && (
          <motion.div
            style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(10,9,8,.97)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            onClick={() => setLb(null)}>
            <button style={{ position: "absolute", top: 24, right: 24, background: "none", border: "none", cursor: "pointer", color: GOLD, transition: "transform .3s" }}
              onClick={() => setLb(null)} onMouseEnter={e => (e.currentTarget.style.transform = "rotate(90deg)")} onMouseLeave={e => (e.currentTarget.style.transform = "rotate(0)")}>
              <X size={24} />
            </button>
            <motion.img src={lb} alt="Project"
              style={{ maxWidth: "88vw", maxHeight: "88vh", objectFit: "contain", border: "1px solid rgba(184,154,106,.2)" }}
              initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}