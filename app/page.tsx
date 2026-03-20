"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, X, ArrowUpRight, CheckCircle2, MapPin, Clock } from "lucide-react";

/* ── images ── */
const IMG = {
  hero1:  "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920",
  hero2:  "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1920",
  hero3:  "https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&cs=tinysrgb&w=1920",
  p1:     "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1400",
  p2:     "https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg?auto=compress&cs=tinysrgb&w=1400",
  p3:     "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1400",
  p4:     "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1400",
  p5:     "https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1400",
  p6:     "https://images.pexels.com/photos/2507016/pexels-photo-2507016.jpeg?auto=compress&cs=tinysrgb&w=1400",
  quote:  "https://images.pexels.com/photos/3935349/pexels-photo-3935349.jpeg?auto=compress&cs=tinysrgb&w=1920",
  cta:    "https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&cs=tinysrgb&w=1920",
  svc1:   "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=900",
  svc2:   "https://images.pexels.com/photos/2507016/pexels-photo-2507016.jpeg?auto=compress&cs=tinysrgb&w=900",
  svc3:   "https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&cs=tinysrgb&w=900",
  svc4:   "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=900",
};

/* ── FadeIn ── */
function FI({ c, d = 0, cls = "", s = {} }: {
  c: React.ReactNode; d?: number; cls?: string; s?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} className={cls} style={s}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: d, ease: [0.16, 1, 0.3, 1] }}>
      {c}
    </motion.div>
  );
}

/* ── Slide-in from left/right ── */
function SlideIn({ c, d = 0, from = "left", cls = "" }: {
  c: React.ReactNode; d?: number; from?: "left" | "right"; cls?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} className={cls}
      initial={{ opacity: 0, x: from === "left" ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.95, delay: d, ease: [0.16, 1, 0.3, 1] }}>
      {c}
    </motion.div>
  );
}

/* ── Section wrapper — clean, no opacity tricks ── */
function ParallaxSection({ children, id, bg = "#080706", className = "" }: {
  children: React.ReactNode; id?: string; bg?: string; className?: string;
}) {
  return (
    <div id={id} style={{ background: bg, position: "relative" }} className={className}>
      {children}
    </div>
  );
}

/* ── Counter ── */
function Counter({ to, suf, label, active }: {
  to: number; suf: string; label: string; active: boolean;
}) {
  const [v, setV] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!active || done.current) return;
    done.current = true;
    let c = 0;
    const step = Math.ceil(to / 52);
    const id = setInterval(() => { c = Math.min(c + step, to); setV(c); if (c >= to) clearInterval(id); }, 18);
    return () => clearInterval(id);
  }, [active, to]);
  return (
    <FI cls="stat-card" c={<>
      <span className="stat-num">{v}{suf}</span>
      <span className="stat-lbl">{label}</span>
    </>} />
  );
}

/* ── Projects ── */
const PROJECTS = [
  { img: IMG.p1, title:"The Kapoor Residence", loc:"South Delhi", year:"2024", tag:"Residential", area:"6,800 sq ft", duration:"8 months", budget:"₹2.4 Cr", scope:"Complete Interior", description:"A home that fuses classical Indian motifs with restrained European minimalism. Every surface considered: hand-laid marble floors, bespoke walnut joinery, and a lighting scheme that shifts with the time of day.", highlights:["Hand-laid Carrara marble floors","Bespoke walnut cabinetry","Custom brass hardware from Moradabad","Full smart home integration","Commission art by Delhi artist"] },
  { img: IMG.p2, title:"The Chandelier Suite", loc:"Greater Kailash", year:"2024", tag:"Dining", area:"4,200 sq ft", duration:"6 months", budget:"₹1.8 Cr", scope:"Dining & Living", description:"Designed around a single intention: the finest possible dinner party. Anchored by a commissioned chandelier of hand-blown Murano glass. The palette — warm ivory, deep burgundy, aged brass.", highlights:["Commission Murano glass chandelier","Burgundy silk wall panels from Banaras","12-seater marble & brass dining table","Integrated wine storage","Custom French linen upholstery"] },
  { img: IMG.p3, title:"Master Bedroom Retreat", loc:"Gurugram", year:"2024", tag:"Residential", area:"2,100 sq ft", duration:"4 months", budget:"₹90 Lakhs", scope:"Master Suite", description:"A bedroom designed as a sanctuary from city life. Walls in limewash plaster absorb light beautifully. The custom bed in solid walnut with a hand-stitched linen headboard.", highlights:["Limewash plaster walls — 3 coats","Custom solid walnut bed frame","Hand-stitched Belgian linen headboard","Concealed acoustic ceiling panels","Walk-in wardrobe with island dresser"] },
  { img: IMG.p4, title:"Obsidian Kitchen", loc:"Vasant Vihar", year:"2023", tag:"Culinary", area:"1,800 sq ft", duration:"3 months", budget:"₹65 Lakhs", scope:"Kitchen & Pantry", description:"A chef's kitchen designed for function and theatre. Matte black cabinetry against honed Calacatta marble. Professional-grade appliances concealed behind seamless panels.", highlights:["Matte black lacquer cabinetry","Honed Calacatta marble","Professional concealed appliances","6-seat island with waterfall edge","Integrated herb garden"] },
  { img: IMG.p5, title:"The Marble Spa", loc:"Lutyens Delhi", year:"2023", tag:"Wellness", area:"1,200 sq ft", duration:"3 months", budget:"₹55 Lakhs", scope:"Spa & Bathrooms", description:"A private spa within a Lutyens bungalow. Green onyx walls, a hammam in hand-cut zellige tile, and a meditation alcove lit only by candles.", highlights:["Green onyx feature walls","Hand-cut Moroccan zellige hammam","Heated limestone floors","Custom copper soaking tub","Cedar sauna — 4-person"] },
  { img: IMG.p6, title:"Walnut Dining Room", loc:"Defence Colony", year:"2022", tag:"Residential", area:"3,400 sq ft", duration:"5 months", budget:"₹1.2 Cr", scope:"Dining & Drawing Room", description:"A formal dining room for a family that entertains at the highest level. Wood-panelled walls in aged walnut sourced from a single tree. A suspended plaster ceiling references Mughal geometry.", highlights:["Single-source walnut panelling","Suspended plaster ceiling","Commission oil portrait","Hand-carved rosewood chairs","Antique dhurrie rugs from Jaipur"] },
];

export default function Page() {
  const [menu,    setMenu]    = useState(false);
  const [solid,   setSolid]   = useState(false);
  const [pct,     setPct]     = useState(0);
  const [btt,     setBtt]     = useState(false);
  const [statsOn, setStatsOn] = useState(false);
  const [clock,   setClock]   = useState("");
  const [heroIdx, setHeroIdx] = useState(0);
  const [filter,  setFilter]  = useState("All");
  const [modal,   setModal]   = useState<typeof PROJECTS[0] | null>(null);
  const [activeSvc, setActiveSvc] = useState(0);

  const heroImgs = [IMG.hero1, IMG.hero2, IMG.hero3];
  const TAGS = ["All","Residential","Dining","Culinary","Wellness"];
  const projects = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.tag === filter);
  const bcols = ["7","5","5","7","6","6"];

  useEffect(() => {
    let raf = 0;
    const fn = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setSolid(y > 60); setBtt(y > 500); setPct(h > 0 ? (y/h)*100 : 0);
        const el = document.getElementById("strig");
        if (el && !statsOn && el.getBoundingClientRect().top < window.innerHeight * 0.82) setStatsOn(true);
      });
    };
    window.addEventListener("scroll", fn, { passive: true }); fn();
    return () => { window.removeEventListener("scroll", fn); cancelAnimationFrame(raf); };
  }, [statsOn]);

  useEffect(() => {
    const tick = () => {
      const ist = new Date(Date.now() + new Date().getTimezoneOffset()*60000 + 19800000);
      const p = (n:number) => String(n).padStart(2,"0");
      setClock(`${p(ist.getHours())}:${p(ist.getMinutes())} IST`);
    };
    tick(); const id = setInterval(tick,1000); return ()=>clearInterval(id);
  },[]);

  useEffect(() => {
    const id = setInterval(()=>setHeroIdx(i=>(i+1)%heroImgs.length), 5500);
    return ()=>clearInterval(id);
  },[]);

  useEffect(() => {
    const fn = (e:KeyboardEvent) => { if(e.key==="Escape"){setMenu(false);setModal(null);} };
    window.addEventListener("keydown",fn); return ()=>window.removeEventListener("keydown",fn);
  },[]);

  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return ()=>{ document.body.style.overflow=""; };
  },[modal]);

  const SVCS = [
    { n:"01", title:"Residential Design", sub:"Homes that feel unmistakably yours", img: IMG.svc1,
      bullets:["Apartments, villas, farmhouses, penthouses","Full material specification & sourcing","Furniture design & procurement","Art curation & styling","Handover with care manual"],
      desc:"We build interiors around the life that happens inside them — not the photographs. From a single room to a 15,000 sq ft villa, the process is the same: extended listening, considered proposals, and meticulous execution." },
    { n:"02", title:"Commercial Interiors", sub:"Spaces that communicate before anyone speaks", img: IMG.svc2,
      bullets:["Offices, hotels, restaurants, retail","Brand-aligned spatial storytelling","Custom furniture & joinery","Hospitality & F&B specialists","Project timeline management"],
      desc:"A commercial interior is a brand statement written in marble and light. We design spaces that make clients want to sit down, stay longer, and come back — because the environment communicates something the logo alone cannot." },
    { n:"03", title:"Turnkey Execution", sub:"Concept to handover — we manage everything", img: IMG.svc3,
      bullets:["Full contractor management","Vendor sourcing & negotiation","Site supervision — daily","Budget tracking & reporting","Defect-free handover guarantee"],
      desc:"Most clients do not want to manage a construction site. They want to walk in on handover day to a finished home. We make that possible — handling every contractor, every delivery, every decision that doesn't require your input." },
    { n:"04", title:"Renovation & Refresh", sub:"Precise interventions, maximum impact", img: IMG.svc4,
      bullets:["Structural & cosmetic remodels","Lighting redesign","FF&E replacement","Art & object curation","Minimal disruption scheduling"],
      desc:"Sometimes a space needs a complete rethink. Sometimes it needs three changes executed perfectly. We are equally skilled at both — identifying which interventions will transform a space and which would merely change it." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,300;0,6..96,400;1,6..96,300;1,6..96,400&family=Raleway:wght@200;300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth;scroll-padding-top:90px;overflow-x:hidden}
        body{background:#080706;color:#f2ede7;font-family:'Raleway',sans-serif;font-weight:300;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        ::selection{background:#b89a6a;color:#080706}
        ::-webkit-scrollbar{width:2px}
        ::-webkit-scrollbar-track{background:#080706}
        ::-webkit-scrollbar-thumb{background:#b89a6a;border-radius:2px}
        a{text-decoration:none;color:inherit}
        img{display:block}
        details summary{list-style:none;cursor:pointer}
        details summary::-webkit-details-marker{display:none}

        /* type */
        .h2{font-family:'Bodoni Moda',serif;font-size:clamp(46px,5.8vw,92px);font-weight:300;line-height:.95;color:#f2ede7}
        .h2 em{font-style:italic;color:#d4b896}
        .ey{display:flex;align-items:center;gap:14px;margin-bottom:20px;font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.42em;text-transform:uppercase;color:#b89a6a;font-weight:400}
        .ey::before{content:'';display:block;width:26px;height:1px;background:#b89a6a;flex-shrink:0}

        /* btn */
        .bg{display:inline-flex;align-items:center;gap:14px;font-family:'Raleway',sans-serif;font-size:10px;font-weight:500;letter-spacing:.32em;text-transform:uppercase;background:#b89a6a;color:#080706;padding:15px 32px;border:none;cursor:pointer;transition:background .3s,gap .3s}
        .bg:hover{background:#d4b896;gap:20px}

        /* nav */
        .nav{position:fixed;top:0;width:100%;z-index:500;display:flex;align-items:center;gap:24px;padding:22px 80px;transition:padding .35s,background .35s,border-color .35s,backdrop-filter .35s;border-bottom:1px solid transparent}
        .nav.s{padding:13px 80px;background:rgba(8,7,6,.95);backdrop-filter:blur(24px);border-bottom-color:rgba(184,154,106,.12)}
        .nlogo{display:flex;align-items:center;gap:13px;margin-right:auto;flex-shrink:0}
        .nlogo img{width:40px;height:40px;border-radius:50%;object-fit:cover}
        .nlo-s{font-family:'Raleway',sans-serif;font-size:7.5px;letter-spacing:.55em;text-transform:uppercase;color:#b89a6a;font-weight:400}
        .nlo-n{font-family:'Bodoni Moda',serif;font-size:19px;font-weight:300;color:#f2ede7}
        .nlinks{display:flex;align-items:center;gap:2px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:100px;padding:4px}
        .nlink{font-family:'Raleway',sans-serif;font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:rgba(242,237,231,.5);padding:8px 18px;border-radius:100px;transition:color .25s;font-weight:400;white-space:nowrap}
        .nlink:hover{color:#f2ede7}
        .nclk{font-family:'Raleway',sans-serif;font-size:10px;letter-spacing:.14em;color:#3a3835;white-space:nowrap}
        .ncta{font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.32em;text-transform:uppercase;background:#b89a6a;color:#080706;padding:11px 24px;flex-shrink:0;transition:background .25s;font-weight:500}
        .ncta:hover{background:#d4b896}
        .burger{display:none;flex-direction:column;gap:5px;background:none;border:none;padding:4px;cursor:pointer}
        .burger span{display:block;width:24px;height:1px;background:#f2ede7}

        /* hero */
        .hero{position:relative;height:100vh;min-height:720px;display:flex;align-items:flex-end;overflow:hidden}
        .hslide{position:absolute;inset:0}
        .hslide img{width:100%;height:100%;object-fit:cover;object-position:center}
        .hov1{position:absolute;inset:0;background:linear-gradient(130deg,rgba(8,7,6,.9) 0%,rgba(8,7,6,.33) 55%,rgba(8,7,6,.7) 100%)}
        .hov2{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,7,6,1) 0%,rgba(8,7,6,.5) 35%,transparent 60%)}
        .hbody{position:relative;z-index:3;padding:0 80px 120px;max-width:1100px;width:100%}
        .hh1{font-family:'Bodoni Moda',serif;font-weight:500;line-height:1.06;color:#f2ede7;margin-bottom:32px}
        .hr1{display:block;font-size:clamp(58px,8.5vw,132px);letter-spacing:.04em;color:#f5f0ea}
        .hr2{display:block;font-size:clamp(58px,8.5vw,132px);font-style:italic;font-weight:400;color:#c9963a;letter-spacing:.02em;padding-left:0}
        .hsub{font-family:'Raleway',sans-serif;font-size:15px;font-weight:300;color:rgba(242,237,231,.54);line-height:1.84;max-width:400px;margin-bottom:36px}
        .hbtns{display:flex;align-items:center;gap:26px;margin-bottom:46px}
        .hg{font-family:'Raleway',sans-serif;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:rgba(242,237,231,.34);transition:color .3s}
        .hg:hover{color:#b89a6a}
        .hstats{display:flex;padding-top:26px;border-top:1px solid rgba(184,154,106,.18);max-width:400px}
        .hs{flex:1}
        .hs+.hs{padding-left:20px;margin-left:20px;border-left:1px solid rgba(184,154,106,.18)}
        .hs-n{display:block;font-family:'Bodoni Moda',serif;font-size:32px;font-weight:300;color:#f2ede7;line-height:1}
        .hs-l{display:block;font-family:'Raleway',sans-serif;font-size:8px;letter-spacing:.3em;text-transform:uppercase;color:#b89a6a;margin-top:6px;font-weight:400}
        .hscr{position:absolute;right:80px;bottom:130px;z-index:3;display:flex;flex-direction:column;align-items:center;gap:11px;font-family:'Raleway',sans-serif;font-size:8px;letter-spacing:.38em;text-transform:uppercase;color:#3a3835}
        .srail{width:1px;height:54px;background:rgba(242,237,231,.1);overflow:hidden;position:relative}
        .sbar{width:1px;height:40%;background:#b89a6a;position:absolute;animation:sb 2.2s ease infinite}
        @keyframes sb{0%{transform:translateY(-100%);opacity:0}28%{opacity:1}72%{opacity:1}100%{transform:translateY(260%);opacity:0}}
        .hdots{position:absolute;bottom:40px;right:80px;z-index:3;display:flex;gap:8px}
        .hdot{height:1px;border:none;cursor:pointer;transition:all .4s}
        .htagl{position:absolute;bottom:0;left:0;right:0;z-index:3;display:flex;justify-content:center;align-items:center;gap:18px;padding:14px 80px;background:rgba(8,7,6,.55);backdrop-filter:blur(10px);border-top:1px solid rgba(184,154,106,.1);font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:rgba(242,237,231,.24)}
        .htagl .dot{color:#b89a6a;font-size:5px}

        /* marquee */
        .mqw{overflow:hidden;background:#0a0908;border-top:1px solid rgba(184,154,106,.1);border-bottom:1px solid rgba(184,154,106,.1);padding:13px 0}
        .mqt{display:flex;width:max-content;animation:mq 46s linear infinite}
        @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .mqi{display:flex;align-items:center;gap:18px;padding:0 9px;font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:#3a3835;white-space:nowrap}
        .gem{color:#b89a6a;font-size:7px}

        /* stats */
        .sgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;margin-bottom:64px}
        .stat-card{padding:50px 28px;background:#111009;border:1px solid rgba(184,154,106,.08);text-align:center;transition:transform .3s,border-color .3s}
        .stat-card:hover{transform:translateY(-5px);border-color:rgba(184,154,106,.3)}
        .stat-num{display:block;font-family:'Bodoni Moda',serif;font-size:70px;font-weight:300;color:#f2ede7;line-height:1}
        .stat-lbl{display:block;font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:#b89a6a;margin-top:11px;font-weight:400}
        .squo{display:flex;align-items:center;gap:36px}
        .srul{flex:1;height:1px;background:rgba(184,154,106,.14)}
        .sq{font-family:'Bodoni Moda',serif;font-size:20px;font-weight:300;color:#6a6460;text-align:center;max-width:530px;flex-shrink:0;line-height:1.72}
        .sq em{font-style:italic;color:#d4b896}

        /* filter */
        .ftabs{display:flex;align-items:center;gap:6px;margin-bottom:40px;flex-wrap:wrap}
        .ftab{font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.26em;text-transform:uppercase;padding:9px 20px;border:1px solid rgba(184,154,106,.2);color:#6a6460;background:none;cursor:pointer;transition:all .3s;font-weight:400}
        .ftab:hover{border-color:rgba(184,154,106,.5);color:#f2ede7}
        .ftab.a{background:#b89a6a;color:#080706;border-color:#b89a6a}

        /* bento */
        .bento{display:grid;grid-template-columns:repeat(12,1fr);gap:3px}
        .bc{position:relative;overflow:hidden;cursor:pointer;background:#111009;min-height:460px}
        .bc img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;transition:transform 1.2s cubic-bezier(.16,1,.3,1)}
        .bc:hover img{transform:scale(1.07)}
        .bc-sh{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,7,6,.94) 0%,rgba(8,7,6,.08) 52%,transparent 100%)}
        .bc-tag{position:absolute;top:16px;right:16px;font-family:'Raleway',sans-serif;font-size:8px;letter-spacing:.22em;text-transform:uppercase;background:#b89a6a;color:#080706;padding:5px 11px;z-index:3;font-weight:500}
        .bc-yr{position:absolute;top:16px;left:16px;font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.18em;color:rgba(242,237,231,.45);z-index:3;transition:opacity .3s}
        .bc:hover .bc-yr{opacity:0}
        .bc-body{position:absolute;bottom:0;left:0;right:0;padding:28px;z-index:3;transform:translateY(8px);transition:transform .5s cubic-bezier(.16,1,.3,1)}
        .bc:hover .bc-body{transform:translateY(0)}
        .bc-meta{display:flex;align-items:center;gap:8px;margin-bottom:9px;font-family:'Raleway',sans-serif;font-size:10px;color:#b89a6a}
        .bc-sep{color:rgba(184,154,106,.35)}
        .bc-tit{font-family:'Bodoni Moda',serif;font-size:24px;font-weight:300;color:#f2ede7;line-height:1.15}
        .bc-cta{display:flex;align-items:center;gap:9px;margin-top:14px;font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#b89a6a;opacity:0;transform:translateY(6px);transition:opacity .35s .06s,transform .35s .06s}
        .bc:hover .bc-cta{opacity:1;transform:translateY(0)}
        .bc-line{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(to right,#b89a6a,#d4b896,transparent);transform:scaleX(0);transform-origin:left;transition:transform .55s cubic-bezier(.16,1,.3,1)}
        .bc:hover .bc-line{transform:scaleX(1)}

        /* interlude */
        .inter{position:relative;height:580px;overflow:hidden;display:flex;align-items:center;justify-content:center}
        .inter img{position:absolute;inset:-10%;width:120%;height:120%;object-fit:cover;object-position:center}
        .iov{position:absolute;inset:0;background:rgba(8,7,6,.78)}
        .ibody{position:relative;z-index:2;text-align:center;padding:0 40px;max-width:800px}
        .imk{font-family:'Bodoni Moda',serif;font-size:96px;color:#b89a6a;opacity:.13;display:block;line-height:.5;margin-bottom:14px}
        .iq{font-family:'Bodoni Moda',serif;font-size:clamp(26px,3.2vw,50px);font-weight:300;font-style:italic;color:#f2ede7;line-height:1.38}
        .icit{display:block;font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.36em;text-transform:uppercase;color:#b89a6a;margin-top:30px;font-weight:400}

        /* PROCESS — timeline style */
        .proc-wrap{margin-top:64px}
        .proc-timeline{display:grid;grid-template-columns:repeat(4,1fr);position:relative}
        .proc-timeline::before{content:'';position:absolute;top:28px;left:12.5%;right:12.5%;height:1px;background:linear-gradient(to right,transparent,#b89a6a 20%,#b89a6a 80%,transparent)}
        .pc{padding:56px 28px 0;text-align:center;position:relative}
        .pc-dot{width:14px;height:14px;background:#b89a6a;border-radius:50%;margin:0 auto 32px;border:2px solid #080706;box-shadow:0 0 0 6px rgba(184,154,106,.18),0 0 0 12px rgba(184,154,106,.07);flex-shrink:0}
        .pc-n{font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.36em;color:#b89a6a;font-weight:400;margin-bottom:10px}
        .pc-icon{font-size:28px;color:#d4b896;margin-bottom:14px}
        .pc-title{font-family:'Bodoni Moda',serif;font-size:28px;font-weight:300;color:#f2ede7;margin-bottom:14px;transition:color .3s}
        .pc:hover .pc-title{color:#e2c898}
        .pc-desc{font-family:'Raleway',sans-serif;font-size:13.5px;font-weight:300;color:#6a6460;line-height:1.9;max-width:240px;margin:0 auto}
        /* Detail cards below timeline */
        .proc-details{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;margin-top:3px}
        .pd{padding:28px 24px;background:#111009;border:1px solid rgba(184,154,106,.08);transition:border-color .4s}
        .pd:hover{border-color:rgba(184,154,106,.28)}
        .pd-label{font-family:'Raleway',sans-serif;font-size:8px;letter-spacing:.3em;text-transform:uppercase;color:#b89a6a;font-weight:400;margin-bottom:10px}
        .pd-items{display:flex;flex-direction:column;gap:8px}
        .pd-item{display:flex;align-items:flex-start;gap:9px;font-family:'Raleway',sans-serif;font-size:12.5px;font-weight:300;color:#6a6460;line-height:1.5}
        .pd-item::before{content:'◈';color:#b89a6a;font-size:7px;flex-shrink:0;margin-top:4px}

        /* SERVICES — side-by-side with image preview */
        .svc-outer{display:grid;grid-template-columns:1fr 1fr;gap:0;min-height:600px}
        .svc-left{border-right:1px solid rgba(184,154,106,.1)}
        .svc-tab{display:flex;align-items:flex-start;gap:18px;padding:28px 40px;border-bottom:1px solid rgba(184,154,106,.08);cursor:pointer;transition:background .3s;position:relative}
        .svc-tab:hover,.svc-tab.act{background:rgba(184,154,106,.04)}
        .svc-tab.act::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:#b89a6a}
        .svc-tab-n{font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.3em;color:#b89a6a;font-weight:400;flex-shrink:0;padding-top:4px}
        .svc-tab-inner{flex:1}
        .svc-tab-title{font-family:'Bodoni Moda',serif;font-size:22px;font-weight:300;color:#f2ede7;transition:color .3s;line-height:1.1;margin-bottom:4px}
        .svc-tab:hover .svc-tab-title,.svc-tab.act .svc-tab-title{color:#d4b896}
        .svc-tab-sub{font-family:'Raleway',sans-serif;font-size:11px;font-weight:300;color:#6a6460;letter-spacing:.08em}
        .svc-tab-arr{color:#b89a6a;opacity:0;transition:opacity .3s;margin-top:4px}
        .svc-tab:hover .svc-tab-arr,.svc-tab.act .svc-tab-arr{opacity:1}
        .svc-right{position:relative;overflow:hidden}
        .svc-panel{position:absolute;inset:0}
        .svc-panel img{width:100%;height:100%;object-fit:cover;object-position:center}
        .svc-panel-ov{position:absolute;inset:0;background:linear-gradient(135deg,rgba(8,7,6,.85) 0%,rgba(8,7,6,.4) 60%,transparent 100%)}
        .svc-panel-body{position:absolute;inset:0;padding:32px 36px;display:flex;flex-direction:column;justify-content:flex-end}
        .svc-panel-desc{font-family:'Raleway',sans-serif;font-size:14px;font-weight:300;color:rgba(242,237,231,.7);line-height:1.9;max-width:420px;margin-bottom:24px}
        .svc-bullets{display:flex;flex-direction:column;gap:8px}
        .svc-bull{display:flex;align-items:center;gap:10px;font-family:'Raleway',sans-serif;font-size:12px;font-weight:300;color:rgba(242,237,231,.55)}
        .svc-bull-dot{width:5px;height:5px;background:#b89a6a;border-radius:50%;flex-shrink:0}

        /* ABOUT */
        .about-hero-txt{font-family:'Bodoni Moda',serif;font-size:clamp(32px,4.2vw,64px);font-weight:300;line-height:1.08;color:#f2ede7;margin-bottom:52px}
        .about-hero-txt em{font-style:italic;color:#d4b896}
        .about-body-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;margin-bottom:64px}
        .about-p{font-family:'Raleway',sans-serif;font-size:14.5px;font-weight:300;color:#6a6460;line-height:1.95}
        .about-vals{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-bottom:64px}
        .av{padding:36px 28px;background:#111009;border:1px solid rgba(184,154,106,.08);transition:border-color .4s,transform .3s}
        .av:hover{border-color:rgba(184,154,106,.28);transform:translateY(-4px)}
        .av-icon{font-size:24px;color:#d4b896;margin-bottom:16px}
        .av-title{font-family:'Bodoni Moda',serif;font-size:22px;font-weight:300;color:#f2ede7;margin-bottom:10px}
        .av-desc{font-family:'Raleway',sans-serif;font-size:13px;font-weight:300;color:#6a6460;line-height:1.85}
        .about-timeline{border-top:1px solid rgba(184,154,106,.12);padding-top:48px;margin-bottom:64px}
        .at-title{font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.36em;text-transform:uppercase;color:#b89a6a;font-weight:500;margin-bottom:28px}
        .at-items{display:grid;grid-template-columns:repeat(4,1fr);gap:2px}
        .at-item{padding:24px 20px;border-left:2px solid rgba(184,154,106,.14);transition:border-color .3s}
        .at-item:hover{border-left-color:#b89a6a}
        .at-year{font-family:'Bodoni Moda',serif;font-size:28px;font-weight:300;color:#b89a6a;margin-bottom:8px;line-height:1}
        .at-event{font-family:'Raleway',sans-serif;font-size:13px;font-weight:300;color:#f2ede7;line-height:1.55;margin-bottom:6px}
        .at-sub{font-family:'Raleway',sans-serif;font-size:11px;font-weight:300;color:#6a6460;line-height:1.5}
        .about-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:2px}
        .astat{padding:36px 28px;background:#111009;border:1px solid rgba(184,154,106,.08);text-align:center;transition:transform .3s,border-color .3s}
        .astat:hover{transform:translateY(-4px);border-color:rgba(184,154,106,.28)}
        .astat-n{display:block;font-family:'Bodoni Moda',serif;font-size:52px;font-weight:300;color:#f2ede7;line-height:1}
        .astat-l{display:block;font-family:'Raleway',sans-serif;font-size:8px;letter-spacing:.28em;text-transform:uppercase;color:#b89a6a;margin-top:8px;font-weight:400}

        /* MATERIALS */
        .mat-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:2px;margin-top:24px}
        .mat-card{padding:28px 16px;background:#111009;border:1px solid rgba(184,154,106,.08);text-align:center;transition:transform .3s,border-color .3s}
        .mat-card:hover{transform:translateY(-5px);border-color:rgba(184,154,106,.32)}
        .mat-t{display:block;font-family:'Raleway',sans-serif;font-size:8px;letter-spacing:.3em;text-transform:uppercase;color:#b89a6a;margin-bottom:8px;font-weight:400}
        .mat-n{display:block;font-family:'Bodoni Moda',serif;font-size:16px;font-weight:300;color:#f2ede7}

        /* testi */
        .tgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:3px}
        .tc{padding:42px 36px;background:#111009;border:1px solid rgba(184,154,106,.08);position:relative;transition:transform .3s,border-color .3s}
        .tc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(to right,#b89a6a,transparent);opacity:0;transition:opacity .4s}
        .tc:hover{transform:translateY(-5px);border-color:rgba(184,154,106,.24)}
        .tc:hover::before{opacity:1}
        .tc-mk{font-family:'Bodoni Moda',serif;font-size:68px;color:#b89a6a;opacity:.16;display:block;line-height:.6;margin-bottom:8px}
        .tc-q{font-family:'Bodoni Moda',serif;font-size:16.5px;font-weight:300;font-style:italic;color:#f2ede7;line-height:1.72;margin-bottom:26px}
        .tc-who{display:flex;align-items:center;gap:12px}
        .tc-av{width:42px;height:42px;border-radius:50%;background:#8a7050;display:flex;align-items:center;justify-content:center;font-family:'Bodoni Moda',serif;font-size:14px;color:#080706;flex-shrink:0}
        .tc-nm{display:block;font-family:'Raleway',sans-serif;font-size:12px;font-weight:500;color:#f2ede7}
        .tc-rl{display:block;font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.12em;color:#b89a6a;margin-top:2px}
        .tc-gold{background:#111009 !important;border:1px solid rgba(184,154,106,.28) !important;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}
        .tc-gold:hover{border-color:rgba(184,154,106,.5) !important;transform:translateY(-5px)}
        .tc-gn{font-family:'Bodoni Moda',serif;font-size:64px;font-weight:300;color:#b89a6a;line-height:1}
        .tc-gl{font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:#6a6460;font-weight:400}

        /* FAQ — two column with side panel */
        .faq-outer{display:grid;grid-template-columns:1fr 1.6fr;gap:0;min-height:500px}
        .faq-left{padding:0 56px 0 0;border-right:1px solid rgba(184,154,106,.1)}
        .faq-right{padding:0 0 0 56px}
        .faq-item{border-bottom:1px solid rgba(184,154,106,.1)}
        .faq-q{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:22px 0;font-family:'Raleway',sans-serif;font-size:14px;font-weight:300;color:#f2ede7;transition:color .3s}
        .faq-item:hover .faq-q{color:#d4b896}
        .faq-plus{font-size:24px;color:#b89a6a;font-weight:200;flex-shrink:0;transition:transform .35s}
        .faq-item[open] .faq-plus{transform:rotate(45deg)}
        .faq-a{font-family:'Raleway',sans-serif;font-size:13.5px;font-weight:300;color:#6a6460;line-height:1.9;padding-bottom:22px}
        /* Right panel content */
        .faq-panel{background:#111009;border:1px solid rgba(184,154,106,.1);padding:40px 36px;height:100%}
        .faq-panel-title{font-family:'Bodoni Moda',serif;font-size:22px;font-weight:300;color:#f2ede7;margin-bottom:6px}
        .faq-panel-sub{font-family:'Raleway',sans-serif;font-size:13px;font-weight:300;color:#6a6460;line-height:1.85;margin-bottom:28px}
        .faq-promise{display:flex;flex-direction:column;gap:14px;margin-bottom:32px}
        .fp-item{display:flex;align-items:flex-start;gap:12px}
        .fp-icon{color:#b89a6a;flex-shrink:0;margin-top:1px}
        .fp-txt{font-family:'Raleway',sans-serif;font-size:13px;font-weight:300;color:rgba(242,237,231,.65);line-height:1.55}
        .faq-quote{border-top:1px solid rgba(184,154,106,.1);padding-top:24px;margin-top:auto}
        .faq-quote p{font-family:'Bodoni Moda',serif;font-size:16px;font-weight:300;font-style:italic;color:#6a6460;line-height:1.7}
        .faq-quote cite{display:block;font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#b89a6a;margin-top:10px;font-style:normal;font-weight:400}

        /* cta */
        .ctaband{position:relative;padding:110px 80px;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .ctabg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.5)}
        .ctaov{position:absolute;inset:0;background:rgba(8,7,6,.88)}
        .ctabody{position:relative;z-index:2;text-align:center;display:flex;flex-direction:column;align-items:center;gap:24px}
        .ctaey{font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.42em;text-transform:uppercase;color:#b89a6a;font-weight:400}
        .ctah{font-family:'Bodoni Moda',serif;font-size:clamp(34px,5.5vw,74px);font-weight:300;color:#f2ede7;line-height:1.06}
        .ctah em{font-style:italic;color:#e2c898}
        .ctaacts{display:flex;align-items:center;gap:28px;flex-wrap:wrap;justify-content:center}
        .ctaph{font-family:'Raleway',sans-serif;font-size:14px;color:rgba(242,237,231,.4);transition:color .3s}
        .ctaph:hover{color:#b89a6a}

        /* contact */
        .cgrid{display:grid;grid-template-columns:1fr 1.2fr;gap:72px;max-width:1400px}
        .cinfo{display:flex;flex-direction:column;gap:26px;margin-top:36px}
        .ci-k{display:block;font-family:'Raleway',sans-serif;font-size:8px;letter-spacing:.32em;text-transform:uppercase;color:#b89a6a;margin-bottom:5px;font-weight:400}
        .ci-v{font-family:'Raleway',sans-serif;font-size:14px;font-weight:300;color:#6a6460;line-height:1.78;transition:color .3s}
        a.ci-v:hover{color:#b89a6a}
        .fcard{background:#111009;border:1px solid rgba(184,154,106,.16);padding:44px}
        .ft2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
        .fd{display:flex;flex-direction:column;gap:7px;margin-bottom:14px}
        .ft2 .fd{margin-bottom:0}
        .fd label{font-family:'Raleway',sans-serif;font-size:8px;letter-spacing:.3em;text-transform:uppercase;color:#b89a6a;font-weight:400}
        .fd input,.fd select,.fd textarea{background:#0d0c0a;border:1px solid rgba(184,154,106,.18);padding:12px 14px;color:#f2ede7;font-family:'Raleway',sans-serif;font-size:13px;font-weight:300;outline:none;width:100%;appearance:none;-webkit-appearance:none;resize:vertical;transition:border-color .3s,background .3s;color-scheme:dark}
        .fd select option{background:#0d0c0a;color:#f2ede7}
        .fd input::placeholder,.fd textarea::placeholder{color:#3a3835}
        .fd input:focus,.fd select:focus,.fd textarea:focus{border-color:#b89a6a;background:rgba(184,154,106,.04)}

        /* map */
        .mapw{position:relative;height:420px}
        .mapf{width:100%;height:100%;border:none;display:block;filter:grayscale(100%) contrast(.72) brightness(.46)}
        .mapvig{position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 90px rgba(8,7,6,.92)}
        .mappin{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:9px;pointer-events:none}
        .mapdot{width:13px;height:13px;background:#b89a6a;border-radius:50%;animation:pp 2s ease infinite}
        @keyframes pp{0%,100%{box-shadow:0 0 0 4px rgba(184,154,106,.26),0 0 0 8px rgba(184,154,106,.09)}50%{box-shadow:0 0 0 8px rgba(184,154,106,.16),0 0 0 16px rgba(184,154,106,.04)}}
        .maplbl{font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#f2ede7;background:rgba(8,7,6,.86);border:1px solid rgba(184,154,106,.22);padding:6px 13px;white-space:nowrap}

        /* footer */
        .footer{padding:80px 80px 32px;background:#0d0c0a;border-top:1px solid rgba(184,154,106,.1)}
        .ft-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:56px;padding-bottom:56px;border-bottom:1px solid rgba(184,154,106,.09);flex-wrap:wrap;gap:48px}
        .ft-logo{display:flex;align-items:center;gap:13px;margin-bottom:10px}
        .ft-logo img{width:44px;height:44px;border-radius:50%;object-fit:cover}
        .ft-ln{font-family:'Bodoni Moda',serif;font-size:22px;font-weight:300;color:#f2ede7}
        .ft-ln em{font-style:italic;color:#e2c898}
        .ft-tag{font-family:'Raleway',sans-serif;font-size:10px;letter-spacing:.14em;color:#3a3835}
        .ft-cols{display:flex;gap:52px;flex-wrap:wrap}
        .ft-col{display:flex;flex-direction:column;gap:10px}
        .ft-ch{font-family:'Raleway',sans-serif;font-size:8px;letter-spacing:.38em;text-transform:uppercase;color:#b89a6a;margin-bottom:4px;font-weight:500}
        .ft-lk{font-family:'Raleway',sans-serif;font-size:12px;font-weight:300;color:#3a3835;transition:color .3s}
        a.ft-lk:hover{color:#f2ede7}
        .ft-bot{display:flex;justify-content:space-between;font-family:'Raleway',sans-serif;font-size:10px;color:rgba(242,237,231,.15);flex-wrap:wrap;gap:8px}

        /* mobile menu */
        .fmenu{position:fixed;inset:0;z-index:800;background:#0d0c0a;display:flex;flex-direction:column;justify-content:center;padding:88px 64px}
        .fmx{position:absolute;top:26px;right:64px;background:none;border:none;cursor:pointer;color:#b89a6a;transition:transform .3s}
        .fmx:hover{transform:rotate(90deg)}
        .fml{display:flex;align-items:center;gap:20px;padding:18px 0;border-bottom:1px solid rgba(184,154,106,.1);color:#f2ede7;transition:color .3s}
        .fml:hover{color:#b89a6a}
        .fmn{font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.26em;color:#b89a6a;width:26px;font-weight:400}
        .fmlab{font-family:'Bodoni Moda',serif;font-size:44px;font-weight:300;flex:1}
        .fmf{position:absolute;bottom:32px;left:64px;font-family:'Raleway',sans-serif;font-size:11px;color:#3a3835;display:flex;flex-direction:column;gap:4px}

        /* modal */
        .mbg{position:fixed;inset:0;z-index:9000;background:rgba(4,3,2,.92);backdrop-filter:blur(18px);display:flex;align-items:center;justify-content:center;padding:24px}
        .modal{background:#0f0e0c;border:1px solid rgba(184,154,106,.18);max-width:1000px;width:100%;max-height:90vh;overflow-y:auto;display:grid;grid-template-columns:1fr 1fr}
        .mimg{position:relative;min-height:560px;overflow:hidden}
        .mimg img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .mimgov{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,7,6,.6) 0%,transparent 60%)}
        .mbody{padding:48px 44px;overflow-y:auto;display:flex;flex-direction:column;gap:0}
        .mtag{font-family:'Raleway',sans-serif;font-size:8px;letter-spacing:.3em;text-transform:uppercase;background:#b89a6a;color:#080706;padding:5px 11px;display:inline-block;margin-bottom:20px;font-weight:500;align-self:flex-start}
        .mtit{font-family:'Bodoni Moda',serif;font-size:clamp(26px,3vw,36px);font-weight:300;color:#f2ede7;line-height:1.1;margin-bottom:6px}
        .mloc{font-family:'Raleway',sans-serif;font-size:12px;color:#b89a6a;letter-spacing:.18em;margin-bottom:28px}
        .mstats{display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-bottom:28px}
        .mstat{background:#161410;padding:16px 14px}
        .mstat-k{display:block;font-family:'Raleway',sans-serif;font-size:8px;letter-spacing:.28em;text-transform:uppercase;color:#b89a6a;margin-bottom:5px;font-weight:400}
        .mstat-v{display:block;font-family:'Bodoni Moda',serif;font-size:18px;font-weight:300;color:#f2ede7}
        .mdesc{font-family:'Raleway',sans-serif;font-size:13.5px;font-weight:300;color:#6a6460;line-height:1.92;margin-bottom:28px}
        .mhlt{font-family:'Raleway',sans-serif;font-size:8px;letter-spacing:.32em;text-transform:uppercase;color:#b89a6a;font-weight:500;margin-bottom:14px}
        .mhl{list-style:none;display:flex;flex-direction:column;gap:10px}
        .mhl li{display:flex;align-items:flex-start;gap:10px;font-family:'Raleway',sans-serif;font-size:13px;font-weight:300;color:rgba(242,237,231,.65);line-height:1.5}
        .mhl li::before{content:'◈';color:#b89a6a;font-size:7px;flex-shrink:0;margin-top:4px}
        .mx{position:absolute;top:20px;right:20px;background:rgba(8,7,6,.7);border:1px solid rgba(184,154,106,.3);cursor:pointer;color:#b89a6a;width:40px;height:40px;display:flex;align-items:center;justify-content:center;z-index:10;transition:background .3s,transform .3s}
        .mx:hover{background:#b89a6a;color:#080706;transform:rotate(90deg)}

        /* btt */
        .btt{position:fixed;bottom:28px;right:28px;z-index:400;width:46px;height:46px;background:#111009;border:1px solid rgba(184,154,106,.34);color:#b89a6a;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;transition:background .3s,color .3s}
        .btt:hover{background:#b89a6a;color:#080706}

        .sec-hdr-mob{display:flex;align-items:flex-start;gap:72px;margin-bottom:52px}
        @media(max-width:768px){.sec-hdr-mob{flex-direction:column !important;gap:14px !important}}
        @media(max-width:768px){
          .mp{padding-left:22px !important;padding-right:22px !important;padding-top:64px !important;padding-bottom:64px !important}
        }
        @media(max-width:1200px){
          .bento{grid-template-columns:repeat(2,1fr) !important}
          .bento .bc{grid-column:span 1 !important;margin-top:0 !important;min-height:380px}
          .proc-timeline{grid-template-columns:repeat(2,1fr)}
          .proc-timeline::before{display:none}
          .proc-details{grid-template-columns:repeat(2,1fr)}
          .at-items{grid-template-columns:repeat(2,1fr)}
          .about-stats{grid-template-columns:repeat(2,1fr)}
          .mat-grid{grid-template-columns:repeat(3,1fr)}
          .tgrid{grid-template-columns:repeat(2,1fr)}
          .modal{grid-template-columns:1fr}
          .mimg{min-height:320px}
          .about-vals{grid-template-columns:1fr 1fr}
          .sgrid{grid-template-columns:repeat(2,1fr)}
        }
        @media(max-width:1024px){
          .svc-outer{grid-template-columns:1fr}
          .svc-right{height:360px;position:relative}
          .faq-outer{grid-template-columns:1fr}
          .faq-left{border-right:none;padding:0}
          .faq-right{padding:0;margin-top:32px}
          .cgrid{grid-template-columns:1fr}
          .about-body-grid{grid-template-columns:1fr}
          .sgrid{grid-template-columns:repeat(2,1fr)}
        }
        @media(max-width:768px){
          /* Fix all inline-padded sections */
          .nav{padding:14px 22px !important}
          .nav.s{padding:12px 22px !important}
          .nlinks,.ncta,.nclk,.nlo-s{display:none !important}
          .burger{display:flex !important}
          .hbody{padding:0 20px 64px !important}
          .htagl,.hscr{display:none !important}
          /* Hero heading — large and bold on mobile */
          .hr1,.hr2{font-size:clamp(58px,15vw,88px) !important;line-height:1.05 !important}
          .hr2{padding-left:0 !important}
          .hh1{margin-bottom:18px !important}
          .hsub{font-size:13px !important;margin-bottom:22px !important}
          /* Services panel — show full text from top */
          .svc-panel-body{justify-content:flex-start !important;padding:22px 20px !important}
          /* Stats — 2 col on mobile */
          .sgrid{grid-template-columns:1fr 1fr !important}
          .squo{flex-direction:column !important;gap:12px !important;text-align:center}
          .sq{font-size:17px !important}
          .srul{width:40px !important;height:1px !important;flex:none !important}
          /* Projects bento */
          .bento{grid-template-columns:1fr !important}
          .bento .bc{min-height:300px;grid-column:span 1 !important;margin-top:0 !important}
          /* Process — 1 col */
          .proc-timeline{grid-template-columns:1fr !important}
          .proc-timeline::before{display:none !important}
          .pc{padding:28px 0 0 !important;text-align:left !important}
          .pc-dot{margin:0 0 16px 0 !important}
          .pc-desc{max-width:100% !important;text-align:left !important}
          .proc-details{grid-template-columns:1fr !important}
          /* Services */
          .svc-outer{grid-template-columns:1fr !important}
          .svc-right{height:auto !important;min-height:320px !important;position:relative !important}
          .svc-panel-body{justify-content:flex-start !important;padding:20px 18px !important;background:rgba(8,7,6,.82) !important;position:relative !important;z-index:2}
          .svc-panel{position:relative !important}
          .svc-panel img{position:relative !important;width:100% !important;height:240px !important;object-fit:cover !important}
          .svc-panel-ov{display:none !important}
          /* About */
          .about-body-grid{grid-template-columns:1fr !important}
          .about-vals{grid-template-columns:1fr !important}
          .about-hero-txt{font-size:24px !important;line-height:1.3 !important;margin-bottom:24px !important}
          .at-items{grid-template-columns:1fr !important}
          .about-stats{grid-template-columns:1fr 1fr !important}
          /* Section headers — stack on mobile */
          .sec-hdr{flex-direction:column !important;gap:12px !important}
          .sec-sub{padding-top:0 !important;max-width:100% !important;font-size:13px !important}
          /* h2 overflow fix */
          .h2{font-size:clamp(34px,9vw,52px) !important;word-break:break-word}
          /* Services header — fix text overflow right side */
          .svc-outer>div:first-child{padding-bottom:0}
          /* Contact h2 — prevent overflow */
          .cgrid .h2{font-size:clamp(32px,8vw,48px) !important}
          /* Process dots — fix stacking */
          .proc-timeline{grid-template-columns:1fr !important}
          .proc-timeline::before{display:none !important}
          .pc{padding:28px 16px 0 !important;text-align:left !important;border-left:2px solid rgba(184,154,106,.2) !important;border-top:none !important;margin-bottom:2px}
          .pc-dot{margin:0 0 14px 0 !important;display:none}
          /* FAQ */
          .faq-outer{grid-template-columns:1fr !important}
          .faq-left{border-right:none !important;padding:0 !important}
          .faq-right{padding:0 !important;margin-top:28px !important}
          .faq-panel{padding:28px 22px !important}
          /* Materials */
          .mat-grid{grid-template-columns:repeat(2,1fr) !important}
          /* Testimonials */
          .tgrid{grid-template-columns:1fr !important}
          /* Contact form */
          .cgrid{grid-template-columns:1fr !important}
          .ft2{grid-template-columns:1fr !important}
          /* CTA */
          .ctaband{padding:64px 22px !important}
          .ctaacts{flex-direction:column !important;gap:14px !important}
          /* Footer */
          .footer{padding:52px 22px 24px !important}
          .ft-top{flex-direction:column !important}
          .ft-cols{flex-direction:column !important;gap:20px !important}
          .ft-bot{flex-direction:column !important}
          /* Mobile menu */
          .fmenu{padding:88px 28px !important}
          .fmx{right:28px !important}
          .fmf{left:28px !important}
          .fmlab{font-size:32px !important}
          /* Modal */
          .modal{grid-template-columns:1fr !important}
          .mimg{min-height:240px !important}
          .mbody{padding:28px 20px !important}
          .mstats{grid-template-columns:1fr 1fr !important}
          /* Prevent ALL horizontal overflow */
          html,body{overflow-x:hidden !important;max-width:100vw !important}
          *{max-width:100% !important;word-break:break-word}
          /* Remove large inline padding from section divs */
          [style*="padding:100px 80px"],[style*="padding: 100px 80px"]{padding:56px 20px !important}
          [style*="padding:72px 80px"],[style*="padding: 72px 80px"]{padding:48px 20px !important}
          [style*="padding:56px 80px"],[style*="padding: 56px 80px"]{padding:40px 20px !important}
        }
      `}</style>

      {/* progress */}
      <div style={{ position:"fixed",top:0,left:0,height:2,zIndex:9999,width:`${pct}%`,background:"linear-gradient(to right,#8a7050,#b89a6a,#d4b896)",transition:"width .12s linear",pointerEvents:"none" }} />

      {/* btt */}
      <AnimatePresence>
        {btt && <motion.button className="btt" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>↑</motion.button>}
      </AnimatePresence>

      {/* ══ NAV ══ */}
      <nav className={`nav${solid?" s":""}`}>
        <a href="#" className="nlogo">
          <img src="/images/logo.webp" alt="Craftmen Studio" />
          <div style={{display:"flex",flexDirection:"column",lineHeight:1.15}}>
            <span className="nlo-s">Interior Architecture</span>
            <span className="nlo-n">Craftmen Studio</span>
          </div>
        </a>
        <div className="nlinks">
          {["Projects","Process","Services","About","Contact"].map(n=>(
            <a key={n} href={`#${n.toLowerCase()}`} className="nlink">{n}</a>
          ))}
        </div>
        <span className="nclk">{clock}</span>
        <a href="#contact" className="ncta">Enquire</a>
        <button className="burger" onClick={()=>setMenu(true)}><span/><span/><span/></button>
      </nav>

      {/* ══ MOBILE MENU ══ */}
      <AnimatePresence>
        {menu && (
          <motion.div className="fmenu" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}}>
            <button className="fmx" onClick={()=>setMenu(false)}><X size={26}/></button>
            {["Projects","Process","Services","About","Contact"].map((n,i)=>(
              <motion.a key={n} href={`#${n.toLowerCase()}`} className="fml"
                initial={{opacity:0,x:22}} animate={{opacity:1,x:0}} transition={{delay:i*.07}}
                onClick={()=>setMenu(false)}>
                <span className="fmn">0{i+1}</span>
                <span className="fmlab">{n}</span>
                <ArrowRight size={18} color="#b89a6a"/>
              </motion.a>
            ))}
            <div className="fmf"><span>+91 98717 66962</span><span>350, MG Rd, Sultanpur, New Delhi 110030</span></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ HERO ══ */}
      <section className="hero">
        {heroImgs.map((src,i)=>(
          <motion.div key={src} className="hslide" initial={{opacity:0}} animate={{opacity:i===heroIdx?1:0}} transition={{duration:1.6,ease:"easeInOut"}}>
            <img src={src} alt=""/>
          </motion.div>
        ))}
        <div className="hov1"/><div className="hov2"/>
        <div className="hbody">
          <h1 className="hh1">
            <FI c={<span className="hr1">Spaces That</span>} d={0.2}/>
            <FI c={<span className="hr2">Tell Stories</span>} d={0.42}/>
          </h1>
          <FI c={<p className="hsub">Bespoke interior architecture rooted in Indian craft tradition and refined by a contemporary spatial sensibility.</p>} d={0.62}/>
          <FI c={
            <div className="hbtns">
              <a href="#projects" className="bg">View Our Work <ArrowRight size={15}/></a>
              <a href="#about" className="hg">Our Philosophy →</a>
            </div>
          } d={0.78}/>
          <FI c={
            <div className="hstats">
              {[["24+","Projects"],["5+","Years"],["100%","Bespoke"]].map(([n,l])=>(
                <div key={l} className="hs">
                  <span className="hs-n">{n}</span>
                  <span className="hs-l">{l}</span>
                </div>
              ))}
            </div>
          } d={0.92}/>
        </div>
        <div className="hscr"><div className="srail"><div className="sbar"/></div><span>Scroll</span></div>
        <div className="hdots">
          {heroImgs.map((_,i)=>(
            <button key={i} className="hdot" onClick={()=>setHeroIdx(i)}
              style={{width:i===heroIdx?32:14,background:i===heroIdx?"#b89a6a":"rgba(184,154,106,.3)"}}/>
          ))}
        </div>
        <div className="htagl">
          <span>New Delhi</span><span className="dot">◆</span>
          <span>Est. 2019</span><span className="dot">◆</span>
          <span>Interior Architecture</span>
        </div>
      </section>

      {/* marquee */}
      <div className="mqw">
        <div className="mqt">
          {Array(10).fill(null).map((_,i)=>(
            <span key={i} className="mqi">
              <span className="gem">◈</span>Residential Design
              <span className="gem">◈</span>Commercial Interiors
              <span className="gem">◈</span>Turnkey Projects
              <span className="gem">◈</span>Luxury Spaces
            </span>
          ))}
        </div>
      </div>

      {/* ══ STATS ══ */}
      <div id="strig" style={{height:1}}/>
      <ParallaxSection bg="#0d0c0a" className="sec2" id="stats">
        <div style={{padding:"100px 80px"}} className="mp">
          <div className="sgrid">
            <Counter to={24}  suf="+" label="Projects Completed" active={statsOn}/>
            <Counter to={5}   suf="+" label="Years of Practice"  active={statsOn}/>
            <Counter to={100} suf="%" label="Bespoke Design"     active={statsOn}/>
            <Counter to={14}  suf=""  label="Industry Awards"    active={statsOn}/>
          </div>
          <FI c={
            <div className="squo">
              <span className="srul"/>
              <p className="sq">Every project begins with a single question:<br/><em>How do you want to feel when you come home?</em></p>
              <span className="srul"/>
            </div>
          }/>
        </div>
      </ParallaxSection>

      {/* ══ PROJECTS ══ */}
      <ParallaxSection bg="#080706" id="projects">
        <div style={{padding:"100px 80px"}} className="mp">
          <FI c={<p className="ey">Selected Work · 2022–2024</p>}/>
          <div className="sec-hdr-mob">
            <FI c={<h2 className="h2">Case <em>Studies</em></h2>}/>
            <FI c={<p style={{fontFamily:"'Raleway',sans-serif",fontSize:14,fontWeight:300,color:"#6a6460",lineHeight:1.92,maxWidth:360,paddingTop:14}}>Six spaces that define our range. Click any project to read the full story behind it.</p>} d={0.1}/>
          </div>
          <FI c={
            <div className="ftabs">
              {TAGS.map(t=>(
                <button key={t} className={`ftab${filter===t?" a":""}`} onClick={()=>setFilter(t)}>{t}</button>
              ))}
            </div>
          } d={0.15}/>
          <AnimatePresence mode="wait">
            <motion.div key={filter} className="bento"
              initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
              transition={{duration:.48,ease:[.16,1,.3,1]}}>
              {projects.map((p,i)=>(
                <motion.div key={p.title} className="bc"
                  style={{gridColumn:`span ${bcols[i]??"6"}`,marginTop:i===2&&filter==="All"?"64px":0} as React.CSSProperties}
                  initial={{opacity:0,y:32}} animate={{opacity:1,y:0}}
                  transition={{duration:.9,delay:i*.06,ease:[.16,1,.3,1]}}
                  onClick={()=>setModal(p)}>
                  <img src={p.img} alt={p.title} className="bc-img" loading={i<2?"eager":"lazy"}/>
                  <div className="bc-sh"/><span className="bc-tag">{p.tag}</span><span className="bc-yr">{p.year}</span>
                  <div className="bc-body">
                    <div className="bc-meta"><span>{p.area}</span><span className="bc-sep">·</span><span>{p.loc}</span></div>
                    <h3 className="bc-tit">{p.title}</h3>
                    <div className="bc-cta"><span>Read the Story</span><ArrowUpRight size={13}/></div>
                  </div>
                  <div className="bc-line"/>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </ParallaxSection>

      {/* ══ INTERLUDE ══ */}
      <div className="inter">
        <img src={IMG.quote} alt=""/>
        <div className="iov"/>
        <FI c={
          <div className="ibody">
            <span className="imk">"</span>
            <p className="iq">We believe a home should feel like an extension of the person who lives in it — not a showroom.</p>
            <span className="icit">— Founder, Craftmen Studio</span>
          </div>
        }/>
      </div>

      {/* ══ PROCESS — timeline ══ */}
      <ParallaxSection bg="#0d0c0a" id="process">
        <div style={{padding:"100px 80px"}} className="mp">
          <FI c={<p className="ey">How We Work</p>}/>
          <FI c={<h2 className="h2">The <em>Process</em></h2>}/>
          <div className="proc-wrap">
            {/* Timeline dots */}
            <div className="proc-timeline">
              {[
                {n:"01",icon:"◎",title:"Discovery",desc:"We listen before we propose anything. An extended conversation about how you actually live — not how you think you should."},
                {n:"02",icon:"◈",title:"Concept",  desc:"A single, fully resolved design direction. Not three options. One proposal, built from conviction. Nothing vague."},
                {n:"03",icon:"◫",title:"Design",   desc:"Construction drawings, 3D renders, material samples. Every decision made on paper before a single wall is touched."},
                {n:"04",icon:"◉",title:"Execution",desc:"We manage every contractor, delivery, and timeline. You walk in on handover day to a finished home."},
              ].map((s,i)=>{
                const ref = useRef<HTMLDivElement>(null);
                const inView = useInView(ref,{once:true,margin:"-60px"});
                return (
                  <motion.div key={i} ref={ref} className="pc"
                    initial={{opacity:0,y:48,rotateX:10}}
                    animate={inView?{opacity:1,y:0,rotateX:0}:{}}
                    transition={{duration:.95,delay:i*.12,ease:[.16,1,.3,1]}}
                    style={{transformPerspective:"900px"}}>
                    <div className="pc-dot"/>
                    <p className="pc-n">{s.n}</p>
                    <p className="pc-icon">{s.icon}</p>
                    <h3 className="pc-title">{s.title}</h3>
                    <p className="pc-desc">{s.desc}</p>
                  </motion.div>
                );
              })}
            </div>
            {/* Detail cards */}
            <div className="proc-details">
              {[
                {label:"What we cover", items:["Your lifestyle & daily rhythms","Spatial requirements","Budget range & priorities","Timeline expectations","Existing furniture & art"]},
                {label:"What you receive", items:["Concept boards — materials & mood","3D spatial sketches","Material sample box","Preliminary cost estimate","Revised brief document"]},
                {label:"What we produce", items:["Full construction drawings","Detailed 3D renders","Material specification book","Vendor quotations","Lighting & electrical layout"]},
                {label:"What we manage", items:["Contractor briefing & supervision","Weekly site reports","Budget tracking","Quality inspections","Defect-free final handover"]},
              ].map((d,i)=>(
                <FI key={i} d={i*.07} cls="pd" c={<>
                  <p className="pd-label">{d.label}</p>
                  <div className="pd-items">
                    {d.items.map(it=><div key={it} className="pd-item">{it}</div>)}
                  </div>
                </>}/>
              ))}
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* ══ SERVICES — interactive panel ══ */}
      <ParallaxSection bg="#080706" id="services">
        <div style={{padding:"100px 80px"}} className="mp">
          <FI c={<p className="ey">What We Offer</p>}/>
          <div className="sec-hdr-mob">
            <FI c={<h2 className="h2">Our <em>Services</em></h2>}/>
            <FI c={<p style={{fontFamily:"'Raleway',sans-serif",fontSize:14,fontWeight:300,color:"#6a6460",lineHeight:1.92,maxWidth:360,paddingTop:14}}>From a single room to a complete villa — we bring the same depth of attention to every square foot. Hover a service to explore it.</p>} d={0.1}/>
          </div>
          <FI d={0.15}>
            <div className="svc-outer">
              <div className="svc-left">
                {SVCS.map((s,i)=>(
                  <div key={i} className={`svc-tab${activeSvc===i?" act":""}`}
                    onMouseEnter={()=>setActiveSvc(i)}>
                    <span className="svc-tab-n">{s.n}</span>
                    <div className="svc-tab-inner">
                      <div className="svc-tab-title">{s.title}</div>
                      <div className="svc-tab-sub">{s.sub}</div>
                    </div>
                    <ArrowRight size={16} className="svc-tab-arr"/>
                  </div>
                ))}
                <div style={{padding:"28px 40px",borderTop:"1px solid rgba(184,154,106,.08)"}}>
                  <a href="#contact" className="bg">Start a Project <ArrowRight size={15}/></a>
                </div>
              </div>
              <div className="svc-right" style={{position:"relative"}}>
                <AnimatePresence mode="wait">
                  <motion.div key={activeSvc} className="svc-panel"
                    initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                    transition={{duration:.5,ease:"easeInOut"}}>
                    <img src={SVCS[activeSvc].img} alt={SVCS[activeSvc].title}/>
                    <div className="svc-panel-ov"/>
                    <div className="svc-panel-body">
                      <p className="svc-panel-desc">{SVCS[activeSvc].desc}</p>
                      <div className="svc-bullets">
                        {SVCS[activeSvc].bullets.map(b=>(
                          <div key={b} className="svc-bull">
                            <span className="svc-bull-dot"/>
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </FI>
        </div>
      </ParallaxSection>

      {/* ══ ABOUT — rich text + values + timeline + stats ══ */}
      <ParallaxSection bg="#0d0c0a" id="about">
        <div style={{padding:"100px 80px"}} className="mp">
          <FI c={<p className="ey">The Practice</p>}/>
          <FI c={<h2 className="h2">About <em>Craftmen</em></h2>}/>

          {/* Lead statement */}
          <FI d={0.1} c={
            <p className="about-hero-txt">
              We design the spaces where life <em>actually</em> happens —<br/>
              not the ones that make good photographs.
            </p>
          }/>

          {/* Body copy */}
          <FI d={0.18} cls="about-body-grid" c={<>
            <p className="about-p">Craftmen Studio is based in Sultanpur, New Delhi. We work at the intersection of Indian craft heritage and contemporary spatial thinking — designing homes and commercial spaces that feel deeply personal and effortlessly refined.<br/><br/>Our practice draws on a deep knowledge of Indian materials and artisanship: the marble workers of Agra, the brass casters of Moradabad, the weavers of Banaras. These are not decorative choices. They are structural ones.</p>
            <p className="about-p">We believe the best interiors are never about trends. They are about understanding how light behaves in a room at different hours, how materiality affects mood, and how architecture shapes the rituals of daily life.<br/><br/>Every project begins with listening — not presenting. We do not show portfolios at first meetings. We ask questions. Because a home that looks like someone else's is a home that never quite fits.</p>
          </>}/>

          {/* Values grid */}
          <FI d={0.22} cls="about-vals" c={<>
            {[
              {icon:"◎",title:"Craft First",   desc:"We source from Indian artisans — marble workers, brass casters, textile weavers — and build our designs around what they make best."},
              {icon:"◈",title:"One Direction", desc:"We don't present three options and ask you to choose. We present one — built from conviction, after weeks of listening."},
              {icon:"◉",title:"Full Honesty",  desc:"If a material is wrong, we say so. If a timeline is unrealistic, we say so. We are not in the business of telling clients what they want to hear."},
            ].map((v,i)=>(
              <FI key={i} d={i*.08} cls="av" c={<>
                <p className="av-icon">{v.icon}</p>
                <h3 className="av-title">{v.title}</h3>
                <p className="av-desc">{v.desc}</p>
              </>}/>
            ))}
          </>}/>

          {/* Studio timeline */}
          <FI d={0.28} cls="about-timeline" c={<>
            <p className="at-title">Studio History</p>
            <div className="at-items">
              {[
                {year:"2019",event:"Studio Founded",sub:"Started with a single apartment in Vasant Vihar. Three months. No compromises."},
                {year:"2021",event:"First Villa",sub:"9,800 sq ft in Mehrauli. Our first turnkey project. Won our first industry award."},
                {year:"2023",event:"Commercial Work",sub:"Expanded into hospitality and retail. First hotel lobby. First Michelin-listed restaurant interior."},
                {year:"2024",event:"14 Awards",sub:"Named Best Emerging Practice by Architectural Digest India. 24 completed projects."},
              ].map((t,i)=>(
                <FI key={i} d={i*.07} cls="at-item" c={<>
                  <div className="at-year">{t.year}</div>
                  <div className="at-event">{t.event}</div>
                  <div className="at-sub">{t.sub}</div>
                </>}/>
              ))}
            </div>
          </>}/>

          {/* Stats */}
          <FI d={0.34} cls="about-stats" c={<>
            {[["24+","Projects Completed"],["5+","Years of Practice"],["100%","Bespoke Design"],["14","Industry Awards"]].map(([n,l])=>(
              <div key={l} className="astat"><span className="astat-n">{n}</span><span className="astat-l">{l}</span></div>
            ))}
          </>}/>
        </div>
      </ParallaxSection>

      {/* ══ MATERIALS ══ */}
      <ParallaxSection bg="#080706">
        <div style={{padding:"72px 80px"}} className="mp">
          <FI c={<p className="ey">Signature Materials</p>}/>
          <div className="mat-grid">
            {[["Marble","Statuario & Nero"],["Timber","Walnut & Teak"],["Metal","Antique Brass"],["Finish","Venetian Plaster"],["Textile","Aged Velvet"],["Stone","Fossil Limestone"]].map(([t,n],i)=>(
              <FI key={i} d={i*.07} cls="mat-card" c={<><span className="mat-t">{t}</span><span className="mat-n">{n}</span></>}/>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* ══ TESTIMONIALS ══ */}
      <ParallaxSection bg="#0d0c0a">
        <div style={{padding:"100px 80px"}} className="mp">
          <FI c={<p className="ey">Client Voices</p>}/>
          <FI c={<h2 className="h2" style={{marginBottom:48}}>What They <em>Say</em></h2>}/>
          <div className="tgrid">
            {[
              {q:"Craftmen Studio transformed our home into something we could never have imagined. Every detail — considered with absolute care.",name:"Priya & Arjun Mehra", role:"Homeowners, South Delhi",  init:"PM"},
              {q:"The living room they designed has become the soul of our home. Every guest asks about it without fail.",                        name:"Sunita Kapoor",       role:"Villa Owner, Vasant Vihar",init:"SK"},
              {q:"From marble flooring to hand-picked art — every element felt intentional. This is what real interior architecture looks like.", name:"Vikram & Naina Sharma",role:"Penthouse, Lutyens Delhi", init:"VS"},
            ].map((t,i)=>(
              <FI key={i} d={i*.09} cls="tc" c={<>
                <span className="tc-mk">"</span>
                <p className="tc-q">{t.q}</p>
                <div className="tc-who">
                  <div className="tc-av">{t.init}</div>
                  <div><span className="tc-nm">{t.name}</span><span className="tc-rl">{t.role}</span></div>
                </div>
              </>}/>
            ))}
            <FI d={0.32} cls="tc tc-gold" c={<><span className="tc-gn">24+</span><span className="tc-gl">Happy Clients</span></>}/>
            <FI d={0.4} cls="tc" s={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}} c={<>
              <span style={{fontFamily:"'Bodoni Moda',serif",fontSize:62,fontWeight:300,color:"#b89a6a",lineHeight:1}}>14</span>
              <span style={{fontFamily:"'Raleway',sans-serif",fontSize:9,letterSpacing:".28em",textTransform:"uppercase" as const,color:"#6a6460",fontWeight:400}}>Industry Awards</span>
            </>}/>
            <FI d={0.48} cls="tc" s={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14}} c={<>
              <img src="/images/logo.webp" alt="Craftmen Studio" style={{width:62,height:62,borderRadius:"50%",objectFit:"cover"}}/>
              <p style={{fontFamily:"'Bodoni Moda',serif",fontSize:15,fontWeight:300,fontStyle:"italic",textAlign:"center",color:"#6a6460",lineHeight:1.65}}>Crafted with intention, not automation.</p>
            </>}/>
          </div>
        </div>
      </ParallaxSection>

      {/* ══ FAQ — with side panel ══ */}
      <ParallaxSection bg="#080706">
        <div style={{padding:"100px 80px"}} className="mp">
          <FI c={<p className="ey">Common Questions</p>}/>
          <FI c={<h2 className="h2" style={{marginBottom:52}}>Frequently <em>Asked</em></h2>}/>
          <div className="faq-outer">
            <div className="faq-left">
              {[
                {q:"How long does a residential project take?",        a:"A complete interior from first meeting to handover typically takes 4–8 months depending on scope. All timelines are mapped in our initial proposal and reviewed monthly."},
                {q:"Do you work outside Delhi?",                       a:"Yes — we take projects across India. We have worked in Mumbai, Bangalore, Goa, and Chandigarh. Travel and coordination costs are included in the project proposal."},
                {q:"What is your minimum project budget?",             a:"We work with a minimum execution budget of ₹45 lakhs for residential and ₹60 lakhs for commercial. Smaller consultancy engagements are available case-by-case."},
                {q:"Can we see the design before construction begins?",a:"Absolutely. Full 3D renders, virtual walkthroughs, and physical material samples are part of our standard design phase. Nothing is executed without your written approval."},
                {q:"How involved do we need to be during execution?",  a:"As involved as you prefer. We handle all contractor communication and site supervision daily. Most clients choose weekly update calls and bi-weekly site visits."},
                {q:"Do you offer a warranty on completed projects?",   a:"We offer a 12-month defect liability period on all executed work. Any issues that arise through normal use are addressed at no additional cost within this window."},
              ].map((item,i)=>(
                <FI key={i} d={i*.06} c={
                  <details className="faq-item">
                    <summary className="faq-q"><span>{item.q}</span><span className="faq-plus">+</span></summary>
                    <p className="faq-a">{item.a}</p>
                  </details>
                }/>
              ))}
            </div>
            <div className="faq-right">
              <SlideIn from="right" c={
                <div className="faq-panel" style={{display:"flex",flexDirection:"column",height:"100%"}}>
                  <p className="faq-panel-title">Before we begin</p>
                  <p className="faq-panel-sub">Every Craftmen Studio project begins with a commitment — from us and from you. Here is what that commitment looks like in practice.</p>
                  <div className="faq-promise">
                    {[
                      "We will never show you work we wouldn't live in ourselves.",
                      "We will tell you when something is wrong — even if you like it.",
                      "We will not start construction until every decision is made on paper.",
                      "We will manage your project as if the final space reflects on us. Because it does.",
                      "We will hand over a finished home — not a site with outstanding items.",
                    ].map((p,i)=>(
                      <div key={i} className="fp-item">
                        <CheckCircle2 size={15} className="fp-icon"/>
                        <span className="fp-txt">{p}</span>
                      </div>
                    ))}
                  </div>
                  <div className="faq-quote" style={{marginTop:"auto"}}>
                    <p>"The client who trusts us completely gets the best result. Not because we ignore their input — but because trust creates the space for conviction."</p>
                    <cite>— Founder, Craftmen Studio</cite>
                  </div>
                </div>
              }/>
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* ══ CTA ══ */}
      <div className="ctaband">
        <img src={IMG.cta} alt="" className="ctabg"/>
        <div className="ctaov"/>
        <FI c={
          <div className="ctabody">
            <span className="ctaey">Ready to Begin?</span>
            <h2 className="ctah">Your space is waiting<br/><em>to be transformed.</em></h2>
            <div className="ctaacts">
              <a href="#contact" className="bg">Start a Conversation <ArrowRight size={15}/></a>
              <a href="tel:+919871766962" className="ctaph">+91 98717 66962</a>
            </div>
          </div>
        }/>
      </div>

      {/* ══ CONTACT ══ */}
      <ParallaxSection bg="#080706" id="contact">
        <div style={{padding:"100px 80px"}} className="mp">
          <div className="cgrid">
            <div>
              <FI c={<p className="ey">Begin a Conversation</p>}/>
              <FI c={<h2 className="h2">Let's Create<br/><em>Something</em><br/>Extraordinary</h2>}/>
              <FI d={0.12} cls="cinfo" c={<>
                {[
                  {icon:<MapPin size={13}/>,k:"Studio",v:"350, Mehrauli-Gurgaon Road, Sultanpur\nNew Delhi, Delhi 110030"},
                  {icon:<ArrowRight size={13}/>,k:"Phone",v:"+91 98717 66962",href:"tel:+919871766962"},
                  {icon:<ArrowRight size={13}/>,k:"Hours",v:"Mon–Sat, 10am–7pm IST"},
                ].map(({icon,k,v,href})=>(
                  <div key={k} style={{display:"flex",alignItems:"flex-start",gap:13}}>
                    <span style={{color:"#b89a6a",marginTop:2,flexShrink:0}}>{icon}</span>
                    <div>
                      <span className="ci-k">{k}</span>
                      {href
                        ?<a href={href} className="ci-v" style={{whiteSpace:"pre-line",display:"block"}}>{v}</a>
                        :<span className="ci-v" style={{whiteSpace:"pre-line",display:"block"}}>{v}</span>}
                    </div>
                  </div>
                ))}
              </>}/>
            </div>
            <FI d={0.2} cls="fcard" c={<>
              <p style={{fontFamily:"'Bodoni Moda',serif",fontSize:26,fontWeight:300,color:"#f2ede7",marginBottom:28}}>Send an Enquiry</p>
              <div className="ft2">
                <div className="fd"><label>Full Name</label><input type="text" placeholder="Your name"/></div>
                <div className="fd"><label>Email</label><input type="email" placeholder="your@email.com"/></div>
              </div>
              <div className="fd"><label>Phone</label><input type="tel" placeholder="+91 00000 00000"/></div>
              <div className="fd">
                <label>Project Type</label>
                <select>
                  <option value="">Select a service</option>
                  <option>Residential Design</option>
                  <option>Commercial Interiors</option>
                  <option>Turnkey Project</option>
                  <option>Renovation &amp; Refresh</option>
                </select>
              </div>
              <div className="fd"><label>About Your Project</label><textarea rows={4} placeholder="Location, area, budget range, timeline…"/></div>
              <button className="bg" style={{marginTop:6}}>Send Enquiry <ArrowRight size={16}/></button>
            </>}/>
          </div>
        </div>
      </ParallaxSection>

      {/* map */}
      <div className="mapw">
        <iframe src="https://maps.google.com/maps?q=350+Mehrauli+Gurgaon+Road+Sultanpur+New+Delhi&t=&z=14&ie=UTF8&iwloc=&output=embed"
          title="Craftmen Studio" className="mapf"/>
        <div className="mapvig"/>
        <div className="mappin"><div className="mapdot"/><span className="maplbl">Craftmen Studio · Sultanpur, New Delhi</span></div>
      </div>

      {/* ══ FOOTER ══ */}
      <footer className="footer">
        <div className="ft-top">
          <div>
            <div className="ft-logo">
              <img src="/images/logo.webp" alt="Craftmen Studio"/>
              <div><div className="ft-ln">Craftmen <em>Studio</em></div></div>
            </div>
            <p className="ft-tag">Interior Architecture &amp; Spatial Design · New Delhi</p>
          </div>
          <div className="ft-cols">
            {[
              {h:"Navigation",items:[["Projects","#projects"],["Process","#process"],["Services","#services"],["About","#about"],["Contact","#contact"]]},
              {h:"Services",  items:[["Residential Design","#services"],["Commercial Interiors","#services"],["Turnkey Projects","#services"],["Renovation","#services"]]},
              {h:"Contact",   items:[["+91 98717 66962","tel:+919871766962"],["350, MG Rd, Sultanpur",""],["New Delhi, Delhi 110030",""],["Mon–Sat 10am–7pm",""]]},
            ].map(({h,items})=>(
              <div key={h} className="ft-col">
                <span className="ft-ch">{h}</span>
                {items.map(([l,href])=>(
                  href?<a key={l} href={href} className="ft-lk">{l}</a>
                      :<span key={l} className="ft-lk">{l}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="ft-bot">
          <span>© 2026 Craftmen Studio — All rights reserved</span>
          <em>Crafted with intention, not automation</em>
        </div>
      </footer>

      {/* ══ PROJECT MODAL ══ */}
      <AnimatePresence>
        {modal && (
          <motion.div className="mbg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}} onClick={()=>setModal(null)}>
            <motion.div className="modal"
              initial={{opacity:0,y:32,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20,scale:.97}}
              transition={{duration:.42,ease:[.16,1,.3,1]}} onClick={e=>e.stopPropagation()}>
              <div className="mimg">
                <img src={modal.img} alt={modal.title}/>
                <div className="mimgov"/>
                <button className="mx" onClick={()=>setModal(null)}><X size={18}/></button>
              </div>
              <div className="mbody">
                <span className="mtag">{modal.tag}</span>
                <h2 className="mtit">{modal.title}</h2>
                <p className="mloc">{modal.loc}</p>
                <div className="mstats">
                  {[["Area",modal.area],["Year",modal.year],["Duration",modal.duration],["Budget",modal.budget],["Scope",modal.scope]].map(([k,v])=>(
                    <div key={k} className="mstat">
                      <span className="mstat-k">{k}</span>
                      <span className="mstat-v">{v}</span>
                    </div>
                  ))}
                </div>
                <p className="mdesc">{modal.description}</p>
                <p className="mhlt">Project Highlights</p>
                <ul className="mhl">{modal.highlights.map((h,i)=><li key={i}>{h}</li>)}</ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}