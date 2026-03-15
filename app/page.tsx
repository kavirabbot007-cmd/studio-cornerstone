/**
 * STUDIO CORNERSTONE — page.tsx
 * Complete luxury interior design website.
 *
 * SETUP: run  npm install three @types/three  before starting the dev server.
 *
 * Features:
 *  • Full-screen cinematic loader
 *  • Interactive 3D luxury room (Three.js) as hero background
 *  • Liquid magnetic cursor
 *  • Scroll progress bar + side dot-nav
 *  • Live IST clock in navbar
 *  • Staggered char-split headline reveals
 *  • Animated stat counters
 *  • Asymmetric 3-D-tilt project cards
 *  • Parallax quote interlude
 *  • Sticky services sidebar with expand rows
 *  • Masonry gallery with lightbox
 *  • FAQ accordion
 *  • Animated contact form
 *  • Greyscale Google Map with pulsing pin
 *  • All images via Pexels CDN
 */

"use client";
import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   IMAGE CONSTANTS  (Pexels CDN)
───────────────────────────────────────────── */
const px = (id: number, w = 1920) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const IMG = {
  hero:     px(3316922),       // warm contemporary living room
  p1:       px(6180674),       // living room golden hour
  p2:       px(35189706),      // marble luxury kitchen
  p3:       px(8135502),       // bright master bedroom
  p4:       px(5997959),       // grand villa staircase
  p5:       px(27390284),      // modern interior kitchen
  p6:       px(16249146),      // marble spa bathroom
  interlude:px(19846360),      // open-plan living light
  about:    px(3316922, 900),  // portrait crop living room
  aboutThumb:px(8135502, 600), // bedroom detail
  contact:  px(695193),        // grand hotel lobby
  cta:      px(18703869),      // moody luxury room
  g1:       px(6180674, 800),
  g2:       px(35189706, 800),
  g3:       px(8135502, 800),
  g4:       px(16249146, 800),
  g5:       px(5997959, 800),
  g6:       px(27390284, 800),
  g7:       px(19846360, 800),
  g8:       px(695193, 800),
};

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type Project = {
  src: string; title: string; sub: string;
  year: string; area: string; tag: string;
};

/* ─────────────────────────────────────────────
   ANIMATED COUNTER  (standalone component)
───────────────────────────────────────────── */
function Counter({ to, suffix, label, active }: { to: number; suffix: string; label: string; active: boolean }) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    let cur = 0;
    const step = Math.ceil(to / 60);
    const id = setInterval(() => {
      cur = Math.min(cur + step, to);
      setVal(cur);
      if (cur >= to) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [active, to]);
  return (
    <div className="cs-stat reveal">
      <span className="cs-stat-n">{val}{suffix}</span>
      <span className="cs-stat-l">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   3-D TILT CARD  (standalone component)
───────────────────────────────────────────── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 16;
    const y = ((e.clientY - top) / height - 0.5) * -16;
    el.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) scale(1.02)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)`;
  };
  return (
    <div ref={ref} className={`cs-tcard ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CHAR SPLIT TITLE  (standalone component)
───────────────────────────────────────────── */
function SplitText({ text, delay = 0, italic = false }: { text: string; delay?: number; italic?: boolean }) {
  return (
    <span className={italic ? "italic-gold" : ""} aria-label={text}>
      {text.split("").map((c, i) => (
        <span key={i} className="schar reveal" style={{ transitionDelay: `${delay + i * 0.038}s` }}>
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </span>
  );
}

/* ═════════════════════════════════════════════
   MAIN PAGE
═════════════════════════════════════════════ */
export default function Home() {
  /* ── STATE ── */
  const [loaded,        setLoaded]        = useState(false);
  const [loadPct,       setLoadPct]        = useState(0);
  const [navSolid,      setNavSolid]       = useState(false);
  const [menuOpen,      setMenuOpen]       = useState(false);
  const [progressW,     setProgressW]      = useState(0);
  const [scrollY,       setScrollY]        = useState(0);
  const [countersOn,    setCountersOn]     = useState(false);
  const [clockStr,      setClockStr]       = useState("");
  const [backTop,       setBackTop]        = useState(false);
  const [lightbox,      setLightbox]       = useState<string | null>(null);
  const [activeSection, setActiveSection]  = useState("hero");

  /* ── REFS ── */
  const blobRef      = useRef<HTMLDivElement>(null);
  const dotRef       = useRef<HTMLDivElement>(null);
  const threeCanvas  = useRef<HTMLCanvasElement>(null);
  const mouseX       = useRef(0.5);
  const mouseY       = useRef(0.5);
  const blobX        = useRef(-200);
  const blobY        = useRef(-200);
  const threeCleanup = useRef<(() => void) | null>(null);

  /* ─────────────────────────────────────────
     LOADER
  ───────────────────────────────────────── */
  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) {
        setLoadPct(100);
        clearInterval(id);
        setTimeout(() => setLoaded(true), 750);
      } else {
        setLoadPct(Math.floor(p));
      }
    }, 70);
    return () => clearInterval(id);
  }, []);

  /* ─────────────────────────────────────────
     THREE.JS  — Interactive 3D Luxury Room
  ───────────────────────────────────────── */
  useEffect(() => {
    if (!loaded) return;
    const canvas = threeCanvas.current;
    if (!canvas) return;

    let animId = 0;
    let THREE: any = null;
    let mounted = true;

    const boot = async () => {
      try {
        THREE = await import("three");
      } catch {
        return; // graceful no-op if three not installed
      }
      if (!mounted) return;

      const W = canvas.clientWidth  || canvas.offsetWidth  || 800;
      const H = canvas.clientHeight || canvas.offsetHeight || 600;

      /* renderer */
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(W, H, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ReinhardToneMapping;
      renderer.toneMappingExposure = 1.4;

      /* scene */
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x080706, 0.06);

      /* camera */
      const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 100);
      const CAM_RADIUS = 9;
      let camTheta = Math.PI / 4;
      let camThetaTarget = camTheta;
      camera.position.set(
        CAM_RADIUS * Math.sin(camTheta),
        3.5,
        CAM_RADIUS * Math.cos(camTheta)
      );
      camera.lookAt(0, 1.2, 0);

      /* ── MATERIALS ── */
      const mFloor  = new THREE.MeshStandardMaterial({ color: 0x0a0907, roughness: 0.12, metalness: 0.35 });
      const mWall   = new THREE.MeshStandardMaterial({ color: 0x0d0c0a, roughness: 1.0 });
      const mGold   = new THREE.MeshStandardMaterial({ color: 0xb89a6a, roughness: 0.18, metalness: 0.9 });
      const mSofa   = new THREE.MeshStandardMaterial({ color: 0x1e1b16, roughness: 0.85 });
      const mDark   = new THREE.MeshStandardMaterial({ color: 0x151210, roughness: 0.7 });
      const mCream  = new THREE.MeshStandardMaterial({ color: 0xe8e0d5, roughness: 0.9 });
      const mGlass  = new THREE.MeshPhysicalMaterial({ color: 0x88aabb, roughness: 0.0, metalness: 0.0, transmission: 0.92, transparent: true, opacity: 0.25 });

      /* room group — everything rotates together */
      const room = new THREE.Group();
      scene.add(room);

      /* FLOOR */
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), mFloor);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      room.add(floor);

      /* floor grid — architectural blueprint feel */
      const grid = new THREE.GridHelper(12, 24, 0x2a2010, 0x181410);
      grid.position.y = 0.002;
      room.add(grid);

      /* BACK WALL */
      const bWall = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), mWall);
      bWall.position.set(0, 3, -6);
      bWall.receiveShadow = true;
      room.add(bWall);

      /* LEFT WALL */
      const lWall = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), mWall);
      lWall.rotation.y = Math.PI / 2;
      lWall.position.set(-6, 3, 0);
      lWall.receiveShadow = true;
      room.add(lWall);

      /* CEILING */
      const ceil = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.MeshStandardMaterial({ color: 0x0c0b09, roughness: 1 }));
      ceil.rotation.x = Math.PI / 2;
      ceil.position.y = 6;
      room.add(ceil);

      /* WINDOW FRAME on back wall */
      const mkFrame = (w: number, h: number, t: number, mat: any) => new THREE.Mesh(new THREE.BoxGeometry(w, h, t), mat);
      const winH = 3.2, winW = 2.8;
      const frameThick = 0.07;
      const winX = -1.5, winY = 2.8, winZ = -5.95;
      // top bar
      const wTop = mkFrame(winW + frameThick * 2, frameThick, frameThick, mGold);
      wTop.position.set(winX, winY + winH / 2, winZ); room.add(wTop);
      // bottom bar
      const wBot = wTop.clone(); wBot.position.set(winX, winY - winH / 2, winZ); room.add(wBot);
      // left bar
      const wLeft = mkFrame(frameThick, winH, frameThick, mGold);
      wLeft.position.set(winX - winW / 2, winY, winZ); room.add(wLeft);
      // right bar
      const wRight = wLeft.clone(); wRight.position.set(winX + winW / 2, winY, winZ); room.add(wRight);
      // glass pane
      const glass = new THREE.Mesh(new THREE.PlaneGeometry(winW, winH), mGlass);
      glass.position.set(winX, winY, winZ + 0.01); room.add(glass);

      /* GOLD SKIRTING BOARD (back wall) */
      const skirt = new THREE.Mesh(new THREE.BoxGeometry(12, 0.08, 0.04), mGold);
      skirt.position.set(0, 0.04, -5.98); room.add(skirt);

      /* SOFA */
      const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.52, 1.3), mSofa);
      sofaBase.position.set(0.2, 0.26, -2.2); sofaBase.castShadow = true; room.add(sofaBase);
      const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.72, 0.22), mSofa);
      sofaBack.position.set(0.2, 0.88, -2.85); sofaBack.castShadow = true; room.add(sofaBack);
      const sofaArmL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.62, 1.3), mSofa);
      sofaArmL.position.set(-1.59, 0.7, -2.2); room.add(sofaArmL);
      const sofaArmR = sofaArmL.clone(); sofaArmR.position.set(1.99, 0.7, -2.2); room.add(sofaArmR);
      // cream cushions
      for (let i = -1; i <= 1; i++) {
        const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.22, 0.6), mCream);
        cushion.position.set(i * 1.1 + 0.2, 0.63, -2.2);
        room.add(cushion);
      }

      /* COFFEE TABLE */
      const tTop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 0.85), mGold);
      tTop.position.set(0.2, 0.56, -0.7); tTop.castShadow = true; room.add(tTop);
      // legs
      const legGeo = new THREE.BoxGeometry(0.045, 0.56, 0.045);
      [[0.9, -0.35], [0.9, 0.35], [-0.9, -0.35], [-0.9, 0.35]].forEach(([dx, dz]) => {
        const leg = new THREE.Mesh(legGeo, mGold);
        leg.position.set(0.2 + dx, 0.28, -0.7 + dz);
        room.add(leg);
      });

      /* MARBLE TRAY on coffee table */
      const tray = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.025, 0.45),
        new THREE.MeshStandardMaterial({ color: 0xd6cfc8, roughness: 0.3, metalness: 0.1 })
      );
      tray.position.set(0.2, 0.595, -0.7); room.add(tray);

      /* GOLD VASE */
      const vaseGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.32, 12);
      const vase = new THREE.Mesh(vaseGeo, mGold);
      vase.position.set(0.0, 0.75, -0.7); room.add(vase);

      /* FLOOR LAMP */
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 2.4, 10), mGold);
      pole.position.set(2.6, 1.2, -2.4); room.add(pole);
      const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.06, 12), mGold);
      lampBase.position.set(2.6, 0.03, -2.4); room.add(lampBase);
      const shadeGeo = new THREE.ConeGeometry(0.28, 0.42, 16, 1, true);
      const shadeMat = new THREE.MeshStandardMaterial({
        color: 0xf5f0e8, side: THREE.BackSide,
        emissive: 0xffd080, emissiveIntensity: 0.55
      });
      const shade = new THREE.Mesh(shadeGeo, shadeMat);
      shade.position.set(2.6, 2.61, -2.4); room.add(shade);

      /* SIDE TABLE */
      const sTable = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.5, 20), mDark);
      sTable.position.set(2.6, 0.25, -2.4); room.add(sTable);
      const sTop = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.03, 20), mGold);
      sTop.position.set(2.6, 0.515, -2.4); room.add(sTop);

      /* WALL ART — back wall */
      const art = new THREE.Mesh(
        new THREE.PlaneGeometry(1.8, 1.1),
        new THREE.MeshStandardMaterial({ color: 0x1a160f, roughness: 1 })
      );
      art.position.set(1.8, 2.6, -5.94); room.add(art);
      const artFrame = new THREE.Mesh(
        new THREE.BoxGeometry(1.88, 1.18, 0.045),
        mGold
      );
      artFrame.position.set(1.8, 2.6, -5.92); room.add(artFrame);

      /* TALL PLANT */
      const plantPot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.28, 12), mDark);
      plantPot.position.set(-2.8, 0.14, -3.2); room.add(plantPot);
      const plantStem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.4, 6), new THREE.MeshStandardMaterial({ color: 0x2a3520 }));
      plantStem.position.set(-2.8, 0.98, -3.2); room.add(plantStem);
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 6), new THREE.MeshStandardMaterial({ color: 0x1a2a14, roughness: 1 }));
      leaf.scale.set(1, 1.4, 0.6);
      leaf.position.set(-2.8, 1.85, -3.2); room.add(leaf);

      /* GOLD CEILING DETAIL (recessed ring) */
      const ceilRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.8, 0.04, 8, 48),
        mGold
      );
      ceilRing.rotation.x = Math.PI / 2;
      ceilRing.position.set(0, 5.97, -1); room.add(ceilRing);

      /* ── LIGHTS ── */
      // Ambient — very dark warm
      const ambient = new THREE.AmbientLight(0x1e1a14, 1.2);
      scene.add(ambient);

      // Floor lamp point light
      const lampPt = new THREE.PointLight(0xffd080, 3.5, 8);
      lampPt.position.set(2.6, 2.4, -2.4);
      lampPt.castShadow = true;
      scene.add(lampPt);

      // Ceiling downlight above sofa
      const ceil1 = new THREE.SpotLight(0xfff5e0, 2.8, 9, Math.PI / 7, 0.35);
      ceil1.position.set(0.2, 5.5, -2.2);
      ceil1.target.position.set(0.2, 0, -2.2);
      ceil1.castShadow = true;
      scene.add(ceil1);
      scene.add(ceil1.target);

      // Window "moonlight" — cool blue-white from outside
      const winLight = new THREE.SpotLight(0xddeeff, 1.2, 14, Math.PI / 8, 0.6);
      winLight.position.set(-1.5, 6, -7);
      winLight.target.position.set(-1.5, 0, -2);
      scene.add(winLight);
      scene.add(winLight.target);

      // Subtle fill from camera side
      const fillLight = new THREE.DirectionalLight(0x443322, 0.4);
      fillLight.position.set(6, 5, 6);
      scene.add(fillLight);

      /* ── ANIMATE ── */
      const clock = new THREE.Clock();
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // camera orbit — slow auto-rotate + mouse parallax
        const mx = mouseX.current;
        camThetaTarget = Math.PI / 4 + (mx - 0.5) * 0.55;
        camTheta += (camThetaTarget - camTheta) * 0.012;
        camTheta += 0.00045; // slow auto-drift

        camera.position.set(
          CAM_RADIUS * Math.sin(camTheta),
          3.2 + (mouseY.current - 0.5) * 0.6,
          CAM_RADIUS * Math.cos(camTheta)
        );
        camera.lookAt(0, 1.4, 0);

        // subtle lamp flicker
        lampPt.intensity = 3.5 + Math.sin(t * 1.3) * 0.15;

        // vase slow spin
        vase.rotation.y = t * 0.4;

        renderer.render(scene, camera);
      };
      animate();

      /* ── RESIZE ── */
      const onResize = () => {
        const w = canvas.clientWidth  || canvas.offsetWidth;
        const h = canvas.clientHeight || canvas.offsetHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      window.addEventListener("resize", onResize);

      threeCleanup.current = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
      };
    };

    boot();
    return () => {
      mounted = false;
      threeCleanup.current?.();
    };
  }, [loaded]);

  /* ─────────────────────────────────────────
     CURSOR
  ───────────────────────────────────────── */
  useEffect(() => {
    if (!loaded) return;
    let raf = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const move = (e: MouseEvent) => {
      mouseX.current = e.clientX / window.innerWidth;
      mouseY.current = e.clientY / window.innerHeight;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${e.clientX - 4}px,${e.clientY - 4}px)`;
    };
    const loop = () => {
      blobX.current = lerp(blobX.current, mouseX.current * window.innerWidth, 0.08);
      blobY.current = lerp(blobY.current, mouseY.current * window.innerHeight, 0.08);
      if (blobRef.current)
        blobRef.current.style.transform = `translate(${blobX.current - 24}px,${blobY.current - 24}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("mousemove", move);

    const onEnter = () => blobRef.current?.classList.add("blob-hov");
    const onLeave = () => blobRef.current?.classList.remove("blob-hov");
    const attach = () =>
      document.querySelectorAll("a,button,.cs-tcard,.mag").forEach(el => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    attach();

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, [loaded]);

  /* ─────────────────────────────────────────
     SCROLL
  ───────────────────────────────────────── */
  useEffect(() => {
    if (!loaded) return;
    const SECS = ["hero", "projects", "process", "services", "about", "contact"];
    const tick = () => {
      const y = window.scrollY;
      setScrollY(y);
      setNavSolid(y > 60);
      setBackTop(y > 500);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgressW(docH > 0 ? (y / docH) * 100 : 0);

      document.querySelectorAll(".reveal:not(.revealed)").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.91)
          el.classList.add("revealed");
      });

      const statsEl = document.getElementById("stats");
      if (statsEl && !countersOn && statsEl.getBoundingClientRect().top < window.innerHeight * 0.85)
        setCountersOn(true);

      SECS.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 180 && r.bottom > 180) setActiveSection(id);
        }
      });
    };
    window.addEventListener("scroll", tick, { passive: true });
    tick();
    return () => window.removeEventListener("scroll", tick);
  }, [loaded, countersOn]);

  /* ─────────────────────────────────────────
     CLOCK  (IST = UTC+5:30)
  ───────────────────────────────────────── */
  useEffect(() => {
    if (!loaded) return;
    const update = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const ist = new Date(utc + 5.5 * 3600000);
      const h = ist.getHours().toString().padStart(2, "0");
      const m = ist.getMinutes().toString().padStart(2, "0");
      const s = ist.getSeconds().toString().padStart(2, "0");
      setClockStr(`${h}:${m}:${s} IST`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [loaded]);

  /* ─────────────────────────────────────────
     DATA
  ───────────────────────────────────────── */
  const PROJECTS: Project[] = [
    { src: IMG.p1, title: "The Mehta Residence",   sub: "Luxury Living · South Delhi",     year: "2024", area: "4,200 sq ft",  tag: "Residential" },
    { src: IMG.p2, title: "Opaline Kitchen",        sub: "Contemporary Kitchen · Gurugram",  year: "2024", area: "980 sq ft",    tag: "Residential" },
    { src: IMG.p3, title: "The Silk Bedroom",       sub: "Master Suite · Vasant Kunj",       year: "2023", area: "1,100 sq ft",  tag: "Residential" },
    { src: IMG.p4, title: "Villa Aranya",           sub: "Complete Villa · Lutyens Delhi",   year: "2023", area: "9,800 sq ft",  tag: "Villa"        },
    { src: IMG.p5, title: "Obsidian Office HQ",     sub: "Corporate Interiors · Aerocity",   year: "2022", area: "6,200 sq ft",  tag: "Commercial"   },
    { src: IMG.p6, title: "The Marble Spa",         sub: "Wellness Suite · Chanakyapuri",    year: "2022", area: "800 sq ft",    tag: "Hospitality"  },
  ];

  const GALLERY = [
    { src: IMG.g1, label: "Golden Living Room", span: "tall"   },
    { src: IMG.g2, label: "Marble Kitchen",      span: "normal" },
    { src: IMG.g3, label: "Master Bedroom",      span: "wide"   },
    { src: IMG.g4, label: "Spa Bathroom",        span: "normal" },
    { src: IMG.g5, label: "Grand Staircase",     span: "normal" },
    { src: IMG.g6, label: "Modern Culinary",     span: "tall"   },
    { src: IMG.g7, label: "Open-Plan Living",    span: "wide"   },
    { src: IMG.g8, label: "Hotel Lobby",         span: "normal" },
  ];

  /* ─────────────────────────────────────────
     LOADING SCREEN
  ───────────────────────────────────────── */
  if (!loaded) return (
    <div className="cs-loader">
      <div className="cs-ld-wrap">
        <p className="cs-ld-studio">Studio</p>
        <h1 className="cs-ld-name">Cornerstone</h1>
        <div className="cs-ld-bar-bg"><div className="cs-ld-bar" style={{ width: `${loadPct}%` }} /></div>
        <p className="cs-ld-pct">{String(loadPct).padStart(2, "0")}</p>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{background:#080706;color:#f2ede7;overflow:hidden;font-family:'Jost',sans-serif}
        .cs-loader{position:fixed;inset:0;background:#080706;display:flex;align-items:center;justify-content:center;z-index:9999}
        .cs-ld-wrap{display:flex;flex-direction:column;align-items:center;gap:24px}
        .cs-ld-studio{font-family:'Jost',sans-serif;font-weight:200;font-size:10px;letter-spacing:.5em;text-transform:uppercase;color:#b89a6a}
        .cs-ld-name{font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:300;letter-spacing:.06em;color:#f2ede7}
        .cs-ld-bar-bg{width:240px;height:1px;background:rgba(184,154,106,.2);overflow:hidden}
        .cs-ld-bar{height:100%;background:#b89a6a;transition:width .1s linear}
        .cs-ld-pct{font-family:'Jost',sans-serif;font-size:11px;letter-spacing:.3em;color:rgba(184,154,106,.6)}
      `}</style>
    </div>
  );

  /* ─────────────────────────────────────────
     MAIN RENDER
  ───────────────────────────────────────── */
  return (
    <main className="cs-root">

      {/* ── CURSOR ── */}
      <div ref={blobRef} className="cs-blob" />
      <div ref={dotRef}  className="cs-dot"  />

      {/* ── SCROLL PROGRESS ── */}
      <div className="cs-prog" style={{ width: `${progressW}%` }} />

      {/* ── SIDE DOT NAV ── */}
      <nav className="cs-dnav" aria-label="Section nav">
        {["hero","projects","process","services","about","contact"].map(id => (
          <a key={id} href={`#${id}`} className={`cs-dnav-pip ${activeSection === id ? "cs-dnav-pip--on" : ""}`} title={id}>
            <span className="cs-dnav-dot" />
            <span className="cs-dnav-lbl">{id}</span>
          </a>
        ))}
      </nav>

      {/* ── BACK TO TOP ── */}
      <button className={`cs-btt mag ${backTop ? "cs-btt--show" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Top">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 11V2M2 6.5L6.5 2L11 6.5" stroke="currentColor" strokeWidth="1.2"/></svg>
      </button>

      {/* ═══════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════ */}
      <nav className={`cs-nav ${navSolid ? "cs-nav--s" : ""}`}>
        <a href="#" className="cs-logo">
          <span className="cs-logo-sm">Studio</span>
          <span className="cs-logo-lg">Cornerstone</span>
        </a>
        <ul className="cs-nav-links">
          {[["#projects","Projects"],["#process","Process"],["#services","Services"],["#about","About"],["#contact","Contact"]].map(([h,l]) => (
            <li key={h}><a href={h} className="cs-nl"><span>{l}</span><span>{l}</span></a></li>
          ))}
        </ul>
        <span className="cs-clock">{clockStr}</span>
        <a href="#contact" className="cs-nav-cta mag">Enquire</a>
        <button className="cs-burger mag" onClick={() => setMenuOpen(true)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ═══════════════════════════════════════
          FULL-SCREEN MENU
      ═══════════════════════════════════════ */}
      <div className={`cs-fmenu ${menuOpen ? "cs-fmenu--open" : ""}`}>
        <button className="cs-fmenu-x mag" onClick={() => setMenuOpen(false)}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><line x1="4" y1="4" x2="24" y2="24" stroke="#b89a6a" strokeWidth="1.2"/><line x1="24" y1="4" x2="4" y2="24" stroke="#b89a6a" strokeWidth="1.2"/></svg>
        </button>
        <div className="cs-fmenu-links">
          {[["#projects","01","Projects"],["#process","02","Process"],["#services","03","Services"],["#about","04","About"],["#contact","05","Contact"]].map(([href,n,label],i) => (
            <a key={href} href={href} className="cs-fml" style={{ animationDelay: `${i * 0.07}s` }} onClick={() => setMenuOpen(false)}>
              <span className="cs-fml-n">{n}</span>
              <span className="cs-fml-label">{label}</span>
              <svg className="cs-fml-arr" width="28" height="14" viewBox="0 0 28 14" fill="none"><path d="M0 7H26M21 2L26 7L21 12" stroke="currentColor" strokeWidth="1"/></svg>
            </a>
          ))}
        </div>
        <div className="cs-fmenu-foot">
          <span>+91 94584 04963</span>
          <span>D3 Vasant Kunj, New Delhi 110070</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          HERO  — Three.js 3D scene
      ═══════════════════════════════════════ */}
      <section id="hero" className="cs-hero">
        {/* 3D canvas — behind everything */}
        <canvas ref={threeCanvas} className="cs-3d-canvas" />
        {/* fallback image shown if Three.js not installed */}
        <img src={IMG.hero} alt="" className="cs-hero-fallback" />
        <div className="cs-hero-vignette" />
        <div className="cs-hero-grain" />

        <div className="cs-hero-body">
          <p className="cs-eyebrow reveal">
            <span className="el" />
            New Delhi &nbsp;·&nbsp; Est. 2018 &nbsp;·&nbsp; Interior Architecture
          </p>

          <h1 className="cs-hero-h1">
            <span className="cs-h1-row">
              <SplitText text="Studio" delay={0.25} />
            </span>
            <span className="cs-h1-row cs-h1-row--in">
              <SplitText text="Corner" delay={0.55} italic />
              <SplitText text="stone"  delay={0.88} />
            </span>
          </h1>

          <p className="cs-hero-desc reveal" style={{ transitionDelay: "1.1s" }}>
            We design the spaces you come home to.
            Bespoke interior architecture built on material mastery, spatial logic, and an obsessive pursuit of beauty.
          </p>

          <div className="cs-hero-actions reveal" style={{ transitionDelay: "1.28s" }}>
            <a href="#projects" className="cs-btn-gold mag">
              <span>View Projects</span>
              <svg width="16" height="9" viewBox="0 0 16 9" fill="none"><path d="M0 4.5H14.5M10.5.5L14.5 4.5L10.5 8.5" stroke="currentColor" strokeWidth="1.1"/></svg>
            </a>
            <a href="#about" className="cs-btn-ghost">Our Practice →</a>
          </div>

          <div className="cs-hero-mini-stats reveal" style={{ transitionDelay: "1.45s" }}>
            {[["24+","Projects"],["6+","Years"],["100%","Bespoke"]].map(([n,l]) => (
              <div key={l} className="cs-hms-item">
                <span className="cs-hms-n">{n}</span>
                <span className="cs-hms-l">{l}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="cs-hero-scroll">
          <span className="cs-scroll-line" />
          <span>Scroll to explore</span>
        </p>

        <p className="cs-hero-tagline">
          Interior Architecture &nbsp;<span className="cs-dot-g">◆</span>&nbsp;
          Spatial Design &nbsp;<span className="cs-dot-g">◆</span>&nbsp;
          New Delhi
        </p>
      </section>

      {/* ═══════════════════════════════════════
          MARQUEE
      ═══════════════════════════════════════ */}
      <div className="cs-marquee">
        <div className="cs-mq-track">
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className="cs-mq-chunk">
              <span className="cs-mq-gem">◈</span><span>Residential Design</span>
              <span className="cs-mq-gem">◈</span><span>Commercial Interiors</span>
              <span className="cs-mq-gem">◈</span><span>Turnkey Projects</span>
              <span className="cs-mq-gem">◈</span><span>Luxury Spaces</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          STATS
      ═══════════════════════════════════════ */}
      <section id="stats" className="cs-stats">
        <div className="cs-stats-grid">
          <Counter to={24}  suffix="+" label="Projects Completed" active={countersOn} />
          <Counter to={6}   suffix="+" label="Years of Practice"  active={countersOn} />
          <Counter to={100} suffix="%" label="Bespoke Design"     active={countersOn} />
          <Counter to={18}  suffix=""  label="Industry Awards"    active={countersOn} />
        </div>
        <div className="cs-stats-quote reveal">
          <span className="cs-sq-rule" />
          <p className="cs-sq-text">
            Every project begins with a single question:<br />
            <em>How do you want to feel when you come home?</em>
          </p>
          <span className="cs-sq-rule" />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PROJECTS
      ═══════════════════════════════════════ */}
      <section id="projects" className="cs-projects">
        <div className="cs-sec-ey reveal"><span className="el" />Selected Work / 2022–2024</div>
        <div className="cs-projects-hdr reveal">
          <h2 className="cs-h2">Our<br /><em>Projects</em></h2>
          <p className="cs-projects-desc">
            Six spaces that represent our range — from intimate master bedrooms to sprawling villas. Each one a collaboration built over months of listening.
          </p>
        </div>

        <div className="cs-pgrid">
          {PROJECTS.map((p, i) => (
            <TiltCard key={i} className={`cs-pc cs-pc-${["a","b","c","d","e","f"][i]} reveal`}>
              <div className="cs-pc-img" onClick={() => setLightbox(p.src)}>
                <img src={p.src} alt={p.title} loading="lazy" />
                <div className="cs-pc-shade" />
                <span className="cs-pc-tag">{p.tag}</span>
              </div>
              <div className="cs-pc-body">
                <div className="cs-pc-meta"><span>{p.year}</span><span>{p.area}</span></div>
                <h3 className="cs-pc-title">{p.title}</h3>
                <p className="cs-pc-sub">{p.sub}</p>
                <div className="cs-pc-cta">
                  <span>View Project</span>
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none"><path d="M0 4H12.5M9 1L12.5 4L9 7" stroke="currentColor" strokeWidth="1"/></svg>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          INTERLUDE QUOTE
      ═══════════════════════════════════════ */}
      <div className="cs-interlude">
        <img
          src={IMG.interlude}
          alt=""
          className="cs-il-photo"
          style={{ transform: `translateY(${(scrollY - 2600) * 0.12}px)` }}
        />
        <div className="cs-il-shade" />
        <blockquote className="cs-il-quote reveal">
          <span className="cs-il-mark">"</span>
          <p>We do not decorate spaces.<br />We orchestrate experiences<br />that outlast the moment.</p>
          <cite>— Founder, Studio Cornerstone</cite>
        </blockquote>
      </div>

      {/* ═══════════════════════════════════════
          PROCESS
      ═══════════════════════════════════════ */}
      <section id="process" className="cs-process">
        <div className="cs-sec-ey reveal"><span className="el" />How We Work</div>
        <h2 className="cs-h2 reveal">The<br /><em>Process</em></h2>
        <div className="cs-proc-grid">
          {[
            { n:"01", icon:"◎", title:"Discovery",  desc:"An extended conversation — in person, not on a form. We listen to how you live, what you love, and what you've never managed to articulate." },
            { n:"02", icon:"◈", title:"Concept",    desc:"A spatial manifesto: mood boards, material palettes, hand-drawn sketches. Nothing is shown until it has a point of view and a reason to exist." },
            { n:"03", icon:"◫", title:"Design",     desc:"Technical drawings, 3D renders, on-site walkthroughs. Every dimension, material, and light source resolved before a nail is struck." },
            { n:"04", icon:"◉", title:"Execution",  desc:"We coordinate every contractor and timeline. You arrive on handover day to a finished home — not a project site." },
          ].map((s, i) => (
            <div key={i} className="cs-step reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="cs-step-top">
                <span className="cs-step-n">{s.n}</span>
                <span className="cs-step-hr" />
              </div>
              <p className="cs-step-icon">{s.icon}</p>
              <h3 className="cs-step-title">{s.title}</h3>
              <p className="cs-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SERVICES
      ═══════════════════════════════════════ */}
      <section id="services" className="cs-services">
        <div className="cs-svc-left">
          <div className="cs-sec-ey reveal"><span className="el" />What We Offer</div>
          <h2 className="cs-h2 reveal">Our<br /><em>Services</em></h2>
          <p className="cs-svc-intro reveal">Whether furnishing a single room or orchestrating a 10,000 sq ft villa, we bring the same obsessive attention to every square foot.</p>
          <a href="#contact" className="cs-btn-gold reveal mag">
            <span>Start a Project</span>
            <svg width="16" height="9" viewBox="0 0 16 9" fill="none"><path d="M0 4.5H14.5M10.5.5L14.5 4.5L10.5 8.5" stroke="currentColor" strokeWidth="1.1"/></svg>
          </a>
        </div>
        <div className="cs-svc-right">
          {[
            { n:"01", title:"Residential Design",   tags:["Apartments","Villas","Farmhouses","Penthouses"], desc:"Tailored interiors that feel unmistakably yours — blending your aesthetic instincts with our spatial expertise." },
            { n:"02", title:"Commercial Interiors",  tags:["Offices","Hotels","Retail","Restaurants"],        desc:"Environments that communicate brand personality through space, where architecture does the work before a word is spoken." },
            { n:"03", title:"Turnkey Execution",     tags:["Concept","Build","Furnish","Handover"],           desc:"We manage every contractor, vendor, and timeline. You arrive to a finished space — not a site." },
            { n:"04", title:"Renovation & Refresh",  tags:["Remodels","Lighting","FF&E","Art Curation"],      desc:"Precise interventions for spaces that need reimagining — not a renovation for renovation's sake." },
          ].map((s, i) => (
            <div key={i} className="cs-svc-row reveal mag" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="cs-svc-row-h">
                <span className="cs-svc-n">{s.n}</span>
                <h3 className="cs-svc-title">{s.title}</h3>
                <span className="cs-svc-plus">+</span>
              </div>
              <div className="cs-svc-row-b">
                <p className="cs-svc-desc">{s.desc}</p>
                <div className="cs-svc-tags">{s.tags.map(t => <span key={t}>{t}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ABOUT
      ═══════════════════════════════════════ */}
      <section id="about" className="cs-about">
        <div className="cs-about-vis">
          <div className="cs-about-main reveal">
            <img src={IMG.about} alt="Studio" loading="lazy" />
          </div>
          <div className="cs-about-thumb reveal" style={{ transitionDelay: "0.18s" }}>
            <img src={IMG.aboutThumb} alt="Detail" loading="lazy" />
          </div>
          <div className="cs-about-badge reveal" style={{ transitionDelay: "0.34s" }}>
            <span className="cs-ab-n">6+</span>
            <span className="cs-ab-l">Years</span>
          </div>
        </div>
        <div className="cs-about-copy">
          <div className="cs-sec-ey reveal"><span className="el" />The Practice</div>
          <h2 className="cs-h2 reveal">About<br /><em>Studio Cornerstone</em></h2>
          <p className="cs-about-p reveal">
            Studio Cornerstone is a design practice based in Vasant Kunj, New Delhi, specialising in bespoke interior architecture and luxury spatial design. We work at the intersection of Indian craft tradition and contemporary European sensibility.
          </p>
          <p className="cs-about-p reveal" style={{ transitionDelay: "0.12s" }}>
            The studio was founded on a single conviction: interior architecture is not decoration. It is the structure of daily experience. We design for the way light moves through a room at 6 pm, for the feeling of a corridor that makes you slow down, for the silence that follows when a door closes just right.
          </p>
          <div className="cs-about-stats reveal" style={{ transitionDelay: "0.22s" }}>
            {[["24+","Projects"],["6+","Years"],["100%","Bespoke"]].map(([n,l]) => (
              <div key={l} className="cs-as">
                <span className="cs-as-n">{n}</span>
                <span className="cs-as-l">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          GALLERY
      ═══════════════════════════════════════ */}
      <section className="cs-gallery">
        <div className="cs-sec-ey reveal"><span className="el" />Visual Diary</div>
        <div className="cs-gal-hdr reveal">
          <h2 className="cs-h2">Spaces We've<br /><em>Imagined</em></h2>
          <p className="cs-gal-desc">A glimpse into the textures, volumes and light we work with — every image a chapter in an ongoing story of spatial craft.</p>
        </div>
        <div className="cs-gal-grid">
          {GALLERY.map((g, i) => (
            <div
              key={i}
              className={`cs-gal-cell cs-gal-${g.span} reveal`}
              style={{ transitionDelay: `${i * 0.07}s` }}
              onClick={() => setLightbox(g.src)}
            >
              <img src={g.src} alt={g.label} loading="lazy" className="cs-gal-img" />
              <div className="cs-gal-over">
                <span className="cs-gal-lbl">{g.label}</span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 3H15M15 3V15M15 3L3 15" stroke="currentColor" strokeWidth="1.1"/></svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MATERIALS
      ═══════════════════════════════════════ */}
      <div className="cs-mats">
        <div className="cs-sec-ey reveal"><span className="el" />Signature Materials</div>
        <div className="cs-mats-grid">
          {[["Marble","Nero Marquina"],["Timber","White Oak"],["Metal","Brushed Brass"],["Finish","Venetian Plaster"],["Textile","Aged Leather"],["Stone","Onyx"]].map(([t,n],i) => (
            <div key={i} className="cs-mat reveal" style={{ transitionDelay: `${i * 0.07}s` }}>
              <span className="cs-mat-t">{t}</span>
              <span className="cs-mat-n">{n}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          FAQ
      ═══════════════════════════════════════ */}
      <section className="cs-faq">
        <div className="cs-faq-left">
          <div className="cs-sec-ey reveal"><span className="el" />Common Questions</div>
          <h2 className="cs-h2 reveal">Frequently<br /><em>Asked</em></h2>
          <p className="cs-faq-sub reveal">Everything you need to know before we begin — answered honestly, without jargon.</p>
        </div>
        <div className="cs-faq-right">
          {[
            { q:"How long does a residential project take?",       a:"A complete residential interior from first meeting to handover typically takes 4–8 months. The exact timeline depends on scope, complexity, and construction phasing — all mapped out in our initial proposal." },
            { q:"Do you work outside Delhi?",                      a:"Yes — we take projects across India. We've completed work in Mumbai, Bangalore, Goa, and Chandigarh. Travel and coordination costs are included transparently in the project budget." },
            { q:"What is your minimum project budget?",            a:"We typically work with a minimum execution budget of ₹45 lakhs for residential projects and ₹60 lakhs for commercial. Smaller consultancy engagements are available on a case-by-case basis." },
            { q:"Can we see the design before construction begins?", a:"Absolutely. Our design phase includes detailed 3D renders, a virtual walkthrough, and material samples. Nothing is executed without your written approval." },
            { q:"How involved do we need to be during execution?", a:"As involved as you prefer. We handle all contractor communication and on-site management. Most clients choose weekly photo updates and bi-weekly site visits — you won't need to follow up on anything." },
          ].map((item, i) => (
            <details key={i} className="cs-faq-item reveal" style={{ transitionDelay: `${i * 0.07}s` }}>
              <summary className="cs-faq-q">
                <span>{item.q}</span>
                <span className="cs-faq-ico">+</span>
              </summary>
              <p className="cs-faq-a">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════ */}
      <section className="cs-testi">
        <div className="cs-sec-ey reveal"><span className="el" />Client Voices</div>
        <div className="cs-testi-grid">
          {[
            { q:"Studio Cornerstone didn't just design our home — they gave us a completely new way of living in it. The attention to light alone changed everything.", name:"Priya & Arjun Mehta", role:"Homeowners, South Delhi", init:"PM" },
            { q:"Working with them felt like having the world's most articulate friend who also happened to understand architecture. Every decision made sense.", name:"Kaveri Sharma", role:"Villa Owner, Lutyens Delhi", init:"KS" },
            { q:"Our office now makes clients ask about the designer before they've even sat down. That's exactly what we wanted.", name:"Rahul Nanda", role:"Founder, Aerocity HQ", init:"RN" },
          ].map((t, i) => (
            <div key={i} className="cs-tc reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <span className="cs-tc-mark">"</span>
              <p className="cs-tc-q">{t.q}</p>
              <div className="cs-tc-who">
                <div className="cs-tc-av">{t.init}</div>
                <div>
                  <span className="cs-tc-name">{t.name}</span>
                  <span className="cs-tc-role">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA BAND
      ═══════════════════════════════════════ */}
      <div className="cs-cta">
        <img src={IMG.cta} alt="" className="cs-cta-bg" />
        <div className="cs-cta-shade" />
        <div className="cs-cta-body reveal">
          <span className="cs-cta-ey">Ready to Begin?</span>
          <h2 className="cs-cta-h">Your space is waiting<br /><em>to be transformed.</em></h2>
          <div className="cs-cta-acts">
            <a href="#contact" className="cs-btn-gold mag"><span>Start a Conversation</span><svg width="16" height="9" viewBox="0 0 16 9" fill="none"><path d="M0 4.5H14.5M10.5.5L14.5 4.5L10.5 8.5" stroke="currentColor" strokeWidth="1.1"/></svg></a>
            <a href="tel:+919458404963" className="cs-cta-phone">+91 94584 04963</a>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          CONTACT
      ═══════════════════════════════════════ */}
      <section id="contact" className="cs-contact">
        <div className="cs-contact-bg">
          <img src={IMG.contact} alt="" loading="lazy" />
          <div className="cs-contact-shade" />
        </div>
        <div className="cs-contact-inner">
          <div className="cs-ci-left">
            <div className="cs-sec-ey reveal"><span className="el" />Begin a Conversation</div>
            <h2 className="cs-h2 reveal" style={{ color:"var(--cream)" }}>Let's Create<br /><em>Something</em><br />Extraordinary</h2>
            <div className="cs-ci-info reveal">
              {[["Studio","D3, Vasant Kunj Exit Road\nSector D3 & D4, New Delhi 110070"],["Phone","+91 94584 04963"],["Hours","Mon–Sat, 10am–7pm IST"]].map(([k,v]) => (
                <div key={k} className="cs-ci-row">
                  <span className="cs-ci-key">{k}</span>
                  {k === "Phone"
                    ? <a href="tel:+919458404963" className="cs-ci-val cs-ci-link">{v}</a>
                    : <span className="cs-ci-val" style={{ whiteSpace:"pre-line" }}>{v}</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="cs-ci-right reveal" style={{ transitionDelay:"0.18s" }}>
            <div className="cs-form">
              <p className="cs-form-title">Send an Enquiry</p>
              <div className="cs-form-2">
                <div className="cs-field"><label>Full Name</label><input type="text" placeholder="Your name" /></div>
                <div className="cs-field"><label>Email</label><input type="email" placeholder="your@email.com" /></div>
              </div>
              <div className="cs-field"><label>Phone</label><input type="tel" placeholder="+91 00000 00000" /></div>
              <div className="cs-field">
                <label>Project Type</label>
                <select>
                  <option value="">Select a service</option>
                  <option>Residential Design</option>
                  <option>Commercial Interiors</option>
                  <option>Turnkey Project</option>
                  <option>Renovation & Refresh</option>
                </select>
              </div>
              <div className="cs-field"><label>Tell us about your project</label><textarea rows={4} placeholder="Location, area, budget, timeline…" /></div>
              <button className="cs-form-sub mag">
                <span>Send Enquiry</span>
                <svg width="18" height="10" viewBox="0 0 18 10" fill="none"><path d="M0 5H16M12 1L16 5L12 9" stroke="currentColor" strokeWidth="1.2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MAP
      ═══════════════════════════════════════ */}
      <div className="cs-map">
        <iframe src="https://maps.google.com/maps?q=vasant+kunj+delhi&t=&z=14&ie=UTF8&iwloc=&output=embed" title="Studio Cornerstone Location" className="cs-map-frame" />
        <div className="cs-map-vig" />
        <div className="cs-map-pin">
          <div className="cs-pin-pulse" />
          <span className="cs-pin-lbl">Studio Cornerstone · Vasant Kunj</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer className="cs-footer">
        <div className="cs-ft-top">
          <div className="cs-ft-brand">
            <span className="cs-ft-logo">Studio <em>Cornerstone</em></span>
            <p className="cs-ft-tag">Interior Architecture & Spatial Design · New Delhi</p>
          </div>
          <div className="cs-ft-cols">
            <div className="cs-ft-col">
              <span className="cs-ft-ch">Navigation</span>
              {["Projects","Process","Services","About","Contact"].map(l => <a key={l} href={`#${l.toLowerCase()}`} className="cs-ft-link">{l}</a>)}
            </div>
            <div className="cs-ft-col">
              <span className="cs-ft-ch">Services</span>
              {["Residential Design","Commercial Interiors","Turnkey Projects","Renovation"].map(l => <span key={l} className="cs-ft-link">{l}</span>)}
            </div>
            <div className="cs-ft-col">
              <span className="cs-ft-ch">Contact</span>
              <a href="tel:+919458404963" className="cs-ft-link">+91 94584 04963</a>
              <span className="cs-ft-link">D3 Vasant Kunj, New Delhi</span>
              <span className="cs-ft-link">Mon–Sat, 10am–7pm IST</span>
            </div>
          </div>
        </div>
        <div className="cs-ft-bot">
          <span>© 2026 Studio Cornerstone Pvt Ltd — All rights reserved</span>
          <span className="cs-ft-craft">Crafted with intention, not automation</span>
        </div>
      </footer>

      {/* ═══════════════════════════════════════
          LIGHTBOX
      ═══════════════════════════════════════ */}
      {lightbox && (
        <div className="cs-lb" onClick={() => setLightbox(null)}>
          <button className="cs-lb-x mag" onClick={() => setLightbox(null)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><line x1="3" y1="3" x2="21" y2="21" stroke="#b89a6a" strokeWidth="1.2"/><line x1="21" y1="3" x2="3" y2="21" stroke="#b89a6a" strokeWidth="1.2"/></svg>
          </button>
          <img src={lightbox} alt="Project" className="cs-lb-img" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* ═══════════════════════════════════════
          GLOBAL STYLES
      ═══════════════════════════════════════ */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --gold:    #b89a6a;
          --gold-lt: #d4b896;
          --gold-dk: #8a7050;
          --cream:   #f2ede7;
          --ink:     #080706;
          --ink2:    #0e0d0b;
          --ink3:    #161410;
          --ink4:    #201e18;
          --gray:    #5c5854;
          --gray-lt: #8e8a85;
          --serif:   'Cormorant Garamond', Georgia, serif;
          --sans:    'Jost', sans-serif;
        }

        html { scroll-behavior: smooth; overflow-x: hidden; cursor: none; scroll-padding-top: 90px; }
        body { background: var(--ink); color: var(--cream); font-family: var(--sans); font-weight: 300; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        ::selection { background: var(--gold); color: var(--ink); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: var(--ink2); }
        ::-webkit-scrollbar-thumb { background: var(--gold-dk); }
        ::-webkit-scrollbar-thumb:hover { background: var(--gold); }
        *:focus-visible { outline: 1px solid var(--gold); outline-offset: 3px; }

        /* ── CURSOR ── */
        .cs-blob {
          position: fixed; top: 0; left: 0; width: 48px; height: 48px;
          border: 1px solid rgba(184,154,106,.6); border-radius: 50%;
          pointer-events: none; z-index: 8000;
          transition: width .3s, height .3s, background .3s, border-color .3s;
          will-change: transform;
        }
        .cs-blob.blob-hov { width: 68px; height: 68px; background: rgba(184,154,106,.09); border-color: var(--gold-lt); }
        .cs-dot { position: fixed; top: 0; left: 0; width: 8px; height: 8px; background: var(--gold); border-radius: 50%; pointer-events: none; z-index: 8001; will-change: transform; }

        /* ── SCROLL PROGRESS ── */
        .cs-prog { position: fixed; top: 0; left: 0; height: 2px; background: linear-gradient(to right, var(--gold-dk), var(--gold), var(--gold-lt)); z-index: 9999; box-shadow: 0 0 6px rgba(184,154,106,.5); transition: width .1s linear; }

        /* ── SIDE DOT NAV ── */
        .cs-dnav { position: fixed; right: 22px; top: 50%; transform: translateY(-50%); z-index: 400; display: flex; flex-direction: column; gap: 14px; }
        .cs-dnav-pip { display: flex; align-items: center; gap: 8px; text-decoration: none; justify-content: flex-end; }
        .cs-dnav-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(184,154,106,.28); border: 1px solid rgba(184,154,106,.4); transition: all .3s; flex-shrink: 0; }
        .cs-dnav-lbl { font-family: var(--sans); font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); opacity: 0; transform: translateX(6px); transition: opacity .3s, transform .3s; white-space: nowrap; }
        .cs-dnav-pip:hover .cs-dnav-lbl, .cs-dnav-pip--on .cs-dnav-lbl { opacity: 1; transform: none; }
        .cs-dnav-pip:hover .cs-dnav-dot { background: var(--gold); transform: scale(1.5); }
        .cs-dnav-pip--on .cs-dnav-dot { background: var(--gold); width: 9px; height: 9px; box-shadow: 0 0 8px rgba(184,154,106,.55); border-color: var(--gold-lt); }

        /* ── BACK TO TOP ── */
        .cs-btt { position: fixed; bottom: 32px; right: 32px; z-index: 400; width: 44px; height: 44px; background: var(--ink3); border: 1px solid rgba(184,154,106,.3); color: var(--gold); display: flex; align-items: center; justify-content: center; cursor: none; opacity: 0; transform: translateY(16px); transition: opacity .4s, transform .4s, background .3s, border-color .3s; }
        .cs-btt--show { opacity: 1; transform: none; }
        .cs-btt:hover { background: var(--gold); color: var(--ink); border-color: var(--gold); }

        /* ── ROOT ── */
        .cs-root { position: relative; z-index: 1; }

        /* ── REVEAL ── */
        .reveal { opacity: 0; transform: translateY(44px); transition: opacity .95s cubic-bezier(.16,1,.3,1), transform .95s cubic-bezier(.16,1,.3,1); }
        .revealed { opacity: 1 !important; transform: none !important; }
        .schar { display: inline-block; }
        .schar.reveal { opacity: 0; transform: translateY(.6em); }
        .schar.revealed { opacity: 1; transform: none; }
        .italic-gold { font-style: italic; color: var(--gold-lt); }

        /* ── NAVBAR ── */
        .cs-nav { position: fixed; top: 0; width: 100%; display: flex; align-items: center; gap: 36px; padding: 28px 60px; z-index: 500; transition: padding .4s, background .4s, backdrop-filter .4s, border-color .4s; border-bottom: 1px solid transparent; }
        .cs-nav--s { padding: 16px 60px; background: rgba(8,7,6,.92); backdrop-filter: blur(28px) saturate(1.5); border-bottom-color: rgba(184,154,106,.1); }
        .cs-logo { text-decoration: none; display: flex; flex-direction: column; line-height: 1.1; margin-right: auto; }
        .cs-logo-sm { font-family: var(--sans); font-weight: 200; font-size: 9px; letter-spacing: .5em; text-transform: uppercase; color: var(--gold); }
        .cs-logo-lg { font-family: var(--serif); font-size: 21px; font-weight: 400; color: var(--cream); letter-spacing: .04em; }
        .cs-nav-links { display: flex; gap: 30px; list-style: none; }
        .cs-nl { display: flex; flex-direction: column; height: 1.3em; overflow: hidden; font-family: var(--sans); font-size: 10px; font-weight: 400; letter-spacing: .22em; text-transform: uppercase; color: var(--gray-lt); text-decoration: none; }
        .cs-nl span:first-child, .cs-nl span:last-child { display: block; transition: transform .38s cubic-bezier(.76,0,.24,1); }
        .cs-nl span:last-child { color: var(--gold); }
        .cs-nl:hover span:first-child { transform: translateY(-100%); }
        .cs-nl:hover span:last-child  { transform: translateY(-100%); }
        .cs-clock { font-family: var(--sans); font-size: 10px; font-weight: 300; letter-spacing: .15em; color: var(--gray); font-variant-numeric: tabular-nums; white-space: nowrap; }
        .cs-nav-cta { font-family: var(--sans); font-size: 9px; font-weight: 500; letter-spacing: .28em; text-transform: uppercase; color: var(--ink); background: var(--gold); padding: 11px 22px; text-decoration: none; transition: background .3s; }
        .cs-nav-cta:hover { background: var(--gold-lt); }
        .cs-burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: none; padding: 4px; }
        .cs-burger span { display: block; width: 24px; height: 1px; background: var(--cream); }

        /* ── FULL MENU ── */
        .cs-fmenu { position: fixed; inset: 0; background: var(--ink2); z-index: 800; display: flex; flex-direction: column; justify-content: center; padding: 80px 60px; pointer-events: none; opacity: 0; transform: translateY(-14px); transition: opacity .45s cubic-bezier(.76,0,.24,1), transform .45s cubic-bezier(.76,0,.24,1); }
        .cs-fmenu--open { pointer-events: all; opacity: 1; transform: none; }
        .cs-fmenu-x { position: absolute; top: 28px; right: 60px; background: none; border: none; cursor: none; padding: 8px; transition: transform .3s; }
        .cs-fmenu-x:hover { transform: rotate(90deg); }
        .cs-fmenu-links { display: flex; flex-direction: column; }
        .cs-fml { display: flex; align-items: center; gap: 20px; text-decoration: none; padding: 18px 0; border-bottom: 1px solid rgba(184,154,106,.1); color: var(--cream); opacity: 0; transform: translateX(28px); transition: color .3s; }
        .cs-fmenu--open .cs-fml { animation: fmlIn .48s cubic-bezier(.16,1,.3,1) forwards; }
        @keyframes fmlIn { to { opacity: 1; transform: none; } }
        .cs-fml:hover { color: var(--gold); }
        .cs-fml-n { font-family: var(--sans); font-size: 9px; letter-spacing: .22em; color: var(--gold); width: 24px; }
        .cs-fml-label { font-family: var(--serif); font-size: 50px; font-weight: 300; flex: 1; }
        .cs-fml-arr { opacity: 0; transform: translateX(-8px); transition: all .3s; }
        .cs-fml:hover .cs-fml-arr { opacity: 1; transform: none; }
        .cs-fmenu-foot { position: absolute; bottom: 36px; left: 60px; display: flex; gap: 40px; font-family: var(--sans); font-size: 11px; color: var(--gray); }

        /* ── HERO ── */
        .cs-hero { position: relative; height: 100vh; min-height: 700px; display: flex; align-items: flex-end; overflow: hidden; }
        .cs-3d-canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }
        .cs-hero-fallback { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; opacity: .45; }
        /* when three.js loads it covers the fallback */
        .cs-hero-vignette { position: absolute; inset: 0; z-index: 2; background: linear-gradient(150deg, rgba(8,7,6,.88) 0%, rgba(8,7,6,.35) 55%, rgba(8,7,6,.65) 100%); }
        .cs-hero-grain { position: absolute; inset: 0; z-index: 3; opacity: .04; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 180px; pointer-events: none; }
        .cs-hero-body { position: relative; z-index: 4; padding: 0 60px 88px; max-width: 1080px; width: 100%; }
        .cs-eyebrow { display: flex; align-items: center; gap: 14px; font-family: var(--sans); font-size: 9px; letter-spacing: .36em; text-transform: uppercase; color: var(--gold); margin-bottom: 24px; }
        .el { display: block; width: 34px; height: 1px; background: var(--gold); flex-shrink: 0; }
        .cs-hero-h1 { font-family: var(--serif); font-weight: 300; line-height: .9; color: var(--cream); margin-bottom: 36px; }
        .cs-h1-row { display: block; font-size: clamp(72px, 10.5vw, 162px); }
        .cs-h1-row--in { padding-left: 70px; }
        .cs-hero-desc { font-family: var(--sans); font-size: 14px; font-weight: 300; color: rgba(242,237,231,.62); line-height: 1.75; max-width: 380px; margin-bottom: 36px; }
        .cs-hero-actions { display: flex; align-items: center; gap: 28px; }
        .cs-btn-gold { display: inline-flex; align-items: center; gap: 14px; background: var(--gold); color: var(--ink); font-family: var(--sans); font-size: 10px; font-weight: 500; letter-spacing: .22em; text-transform: uppercase; padding: 15px 28px; text-decoration: none; border: none; cursor: none; transition: background .3s, gap .3s; }
        .cs-btn-gold:hover { background: var(--gold-lt); gap: 20px; }
        .cs-btn-ghost { font-family: var(--sans); font-size: 11px; letter-spacing: .14em; color: rgba(242,237,231,.45); text-decoration: none; transition: color .3s; }
        .cs-btn-ghost:hover { color: var(--gold); }
        .cs-hero-scroll { position: absolute; right: 36px; bottom: 80px; z-index: 4; display: flex; flex-direction: column; align-items: center; gap: 12px; font-family: var(--sans); font-size: 8px; letter-spacing: .36em; text-transform: uppercase; color: var(--gray); }
        .cs-scroll-line { display: block; width: 1px; height: 56px; background: linear-gradient(to bottom, transparent, var(--gold)); animation: sc 2.2s ease infinite; }
        @keyframes sc { 0%,100%{opacity:.4} 50%{opacity:1} }
        .cs-hero-mini-stats { display: flex; align-items: center; gap: 0; margin-top: 40px; border-top: 1px solid rgba(184,154,106,.15); padding-top: 28px; max-width: 380px; }
        .cs-hms-item { flex: 1; padding-right: 24px; border-right: 1px solid rgba(184,154,106,.15); margin-right: 24px; }
        .cs-hms-item:last-child { border-right: none; margin-right: 0; padding-right: 0; }
        .cs-hms-n { display: block; font-family: var(--serif); font-size: 32px; font-weight: 300; color: var(--cream); line-height: 1; }
        .cs-hms-l { display: block; font-family: var(--sans); font-size: 8px; letter-spacing: .25em; text-transform: uppercase; color: var(--gold); margin-top: 5px; }
        .cs-hero-tagline { position: absolute; bottom: 0; left: 0; right: 0; z-index: 4; padding: 14px 60px; background: rgba(8,7,6,.55); backdrop-filter: blur(10px); border-top: 1px solid rgba(184,154,106,.1); font-family: var(--sans); font-size: 9px; letter-spacing: .28em; text-transform: uppercase; color: rgba(242,237,231,.35); display: flex; justify-content: center; align-items: center; gap: 16px; }
        .cs-dot-g { color: var(--gold); font-size: 6px; }

        /* ── MARQUEE ── */
        .cs-marquee { overflow: hidden; background: var(--ink2); border-top: 1px solid rgba(184,154,106,.12); border-bottom: 1px solid rgba(184,154,106,.12); padding: 14px 0; }
        .cs-mq-track { display: flex; width: max-content; animation: mqScroll 38s linear infinite; }
        @keyframes mqScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .cs-mq-chunk { display: flex; align-items: center; gap: 20px; padding: 0 10px; font-family: var(--sans); font-size: 9.5px; letter-spacing: .28em; text-transform: uppercase; color: var(--gray); white-space: nowrap; }
        .cs-mq-gem { color: var(--gold); font-size: 7px; }

        /* ── STATS ── */
        .cs-stats { padding: 96px 60px; }
        .cs-stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; margin-bottom: 72px; }
        .cs-stat { padding: 44px 32px; background: var(--ink3); border: 1px solid rgba(184,154,106,.07); text-align: center; transition: background .4s, border-color .4s, transform .4s; overflow: hidden; }
        .cs-stat:hover { background: var(--ink4); border-color: rgba(184,154,106,.28); transform: translateY(-5px); }
        .cs-stat-n { display: block; font-family: var(--serif); font-size: 62px; font-weight: 300; color: var(--cream); line-height: 1; }
        .cs-stat-l { display: block; font-family: var(--sans); font-size: 9px; letter-spacing: .28em; text-transform: uppercase; color: var(--gold); margin-top: 8px; }
        .cs-stats-quote { display: flex; align-items: center; gap: 44px; }
        .cs-sq-rule { flex: 1; height: 1px; background: rgba(184,154,106,.16); }
        .cs-sq-text { font-family: var(--serif); font-size: 20px; font-weight: 300; color: var(--gray-lt); text-align: center; max-width: 540px; flex-shrink: 0; line-height: 1.65; }
        .cs-sq-text em { color: var(--gold-lt); font-style: italic; }

        /* ── SECTION EYEBROW ── */
        .cs-sec-ey { display: flex; align-items: center; gap: 13px; font-family: var(--sans); font-size: 9px; letter-spacing: .32em; text-transform: uppercase; color: var(--gold); margin-bottom: 18px; }

        /* ── H2 ── */
        .cs-h2 { font-family: var(--serif); font-size: clamp(44px,5.5vw,86px); font-weight: 300; line-height: 1.0; color: var(--cream); }
        .cs-h2 em { font-style: italic; color: var(--gold-lt); }

        /* ── PROJECTS ── */
        .cs-projects { padding: 112px 60px; }
        .cs-projects-hdr { display: flex; align-items: flex-start; gap: 80px; margin-bottom: 56px; }
        .cs-projects-desc { font-family: var(--sans); font-size: 14px; font-weight: 300; color: var(--gray-lt); line-height: 1.85; max-width: 420px; padding-top: 12px; }
        .cs-pgrid { display: grid; grid-template-columns: repeat(12,1fr); grid-auto-rows: 440px; gap: 3px; }
        .cs-tcard { transition: transform .45s cubic-bezier(.16,1,.3,1); will-change: transform; }
        .cs-pc { position: relative; overflow: hidden; background: var(--ink3); }
        .cs-pc-a { grid-column: span 7; }
        .cs-pc-b { grid-column: span 5; }
        .cs-pc-c { grid-column: span 5; margin-top: 60px; }
        .cs-pc-d { grid-column: span 7; }
        .cs-pc-e { grid-column: span 6; }
        .cs-pc-f { grid-column: span 6; }
        .cs-pc-img { position: absolute; inset: 0; overflow: hidden; cursor: none; }
        .cs-pc-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 1.1s cubic-bezier(.16,1,.3,1); }
        .cs-pc:hover .cs-pc-img img { transform: scale(1.07); }
        .cs-pc-shade { position: absolute; inset: 0; background: linear-gradient(to top, rgba(8,7,6,.88) 0%, rgba(8,7,6,.1) 50%, transparent 100%); transition: opacity .5s; }
        .cs-pc:hover .cs-pc-shade { opacity: .96; }
        .cs-pc-tag { position: absolute; top: 18px; right: 18px; font-family: var(--sans); font-size: 8px; letter-spacing: .22em; text-transform: uppercase; background: var(--gold); color: var(--ink); padding: 5px 11px; }
        .cs-pc-body { position: absolute; bottom: 0; left: 0; right: 0; padding: 26px; transform: translateY(10px); transition: transform .5s cubic-bezier(.16,1,.3,1); z-index: 2; }
        .cs-pc:hover .cs-pc-body { transform: none; }
        .cs-pc-meta { display: flex; gap: 14px; margin-bottom: 8px; font-family: var(--sans); font-size: 9px; color: var(--gold); }
        .cs-pc-meta span:last-child { color: var(--gray-lt); }
        .cs-pc-title { font-family: var(--serif); font-size: 24px; font-weight: 300; color: var(--cream); line-height: 1.2; }
        .cs-pc-sub { font-family: var(--sans); font-size: 10px; color: var(--gray-lt); margin-top: 4px; }
        .cs-pc-cta { display: inline-flex; align-items: center; gap: 10px; margin-top: 14px; font-family: var(--sans); font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); opacity: 0; transform: translateY(6px); transition: opacity .4s .1s, transform .4s .1s; }
        .cs-pc:hover .cs-pc-cta { opacity: 1; transform: none; }

        /* ── INTERLUDE ── */
        .cs-interlude { position: relative; height: 580px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .cs-il-photo { position: absolute; inset: -10%; width: 120%; height: 120%; object-fit: cover; will-change: transform; }
        .cs-il-shade { position: absolute; inset: 0; background: rgba(8,7,6,.72); }
        .cs-il-quote { position: relative; z-index: 2; text-align: center; padding: 0 40px; max-width: 720px; }
        .cs-il-mark { font-family: var(--serif); font-size: 88px; color: var(--gold); opacity: .2; display: block; line-height: .5; margin-bottom: -8px; }
        .cs-il-quote p { font-family: var(--serif); font-size: clamp(24px,3vw,44px); font-weight: 300; font-style: italic; color: var(--cream); line-height: 1.45; }
        .cs-il-quote cite { display: block; font-family: var(--sans); font-size: 9px; letter-spacing: .3em; text-transform: uppercase; color: var(--gold); margin-top: 26px; font-style: normal; }

        /* ── PROCESS ── */
        .cs-process { padding: 112px 60px; background: var(--ink2); }
        .cs-proc-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; margin-top: 56px; }
        .cs-step { padding: 40px 30px; background: var(--ink3); border: 1px solid rgba(184,154,106,.07); position: relative; overflow: hidden; transition: background .4s, transform .4s; }
        .cs-step::after { content:''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: var(--gold); transition: width .6s; }
        .cs-step:hover::after { width: 100%; }
        .cs-step:hover { background: var(--ink4); transform: translateY(-5px); }
        .cs-step-top { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; }
        .cs-step-n { font-family: var(--sans); font-size: 9px; letter-spacing: .3em; color: var(--gold); }
        .cs-step-hr { flex: 1; height: 1px; background: rgba(184,154,106,.18); }
        .cs-step-icon { font-size: 20px; color: var(--gold-lt); margin-bottom: 16px; }
        .cs-step-title { font-family: var(--serif); font-size: 27px; font-weight: 300; color: var(--cream); margin-bottom: 14px; }
        .cs-step-desc { font-family: var(--sans); font-size: 13px; font-weight: 300; color: var(--gray-lt); line-height: 1.85; }

        /* ── SERVICES ── */
        .cs-services { padding: 112px 60px; display: grid; grid-template-columns: 1fr 1.5fr; gap: 96px; align-items: start; }
        .cs-svc-left { position: sticky; top: 108px; }
        .cs-svc-intro { font-family: var(--sans); font-size: 14px; color: var(--gray-lt); line-height: 1.85; margin: 22px 0 34px; max-width: 320px; }
        .cs-svc-row { padding: 26px 0; border-bottom: 1px solid rgba(184,154,106,.1); position: relative; cursor: none; }
        .cs-svc-row::before { content:''; position: absolute; left:0; top:0; width:0; height:100%; background: rgba(184,154,106,.025); transition: width .5s; }
        .cs-svc-row:hover::before { width: 100%; }
        .cs-svc-row-h { display: flex; align-items: center; gap: 16px; }
        .cs-svc-n { font-family: var(--sans); font-size: 9px; letter-spacing: .22em; color: var(--gold); width: 24px; }
        .cs-svc-title { font-family: var(--serif); font-size: 25px; font-weight: 300; color: var(--cream); flex: 1; }
        .cs-svc-plus { font-size: 20px; color: var(--gold); font-weight: 200; transition: transform .3s; width: 24px; text-align: right; }
        .cs-svc-row:hover .cs-svc-plus { transform: rotate(45deg); }
        .cs-svc-row-b { padding: 14px 0 4px 40px; display: none; }
        .cs-svc-row:hover .cs-svc-row-b { display: block; }
        .cs-svc-desc { font-family: var(--sans); font-size: 13px; color: var(--gray-lt); line-height: 1.85; margin-bottom: 14px; }
        .cs-svc-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .cs-svc-tags span { font-family: var(--sans); font-size: 8px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); border: 1px solid rgba(184,154,106,.3); padding: 5px 11px; }

        /* ── ABOUT ── */
        .cs-about { padding: 112px 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .cs-about-vis { position: relative; }
        .cs-about-main { overflow: hidden; }
        .cs-about-main img { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; transition: transform 1s; }
        .cs-about-main:hover img { transform: scale(1.04); }
        .cs-about-thumb { position: absolute; bottom: -32px; right: -32px; width: 42%; border: 3px solid var(--ink); overflow: hidden; }
        .cs-about-thumb img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
        .cs-about-badge { position: absolute; top: 32px; left: -20px; background: var(--ink3); border: 1px solid rgba(184,154,106,.25); padding: 16px 20px; text-align: center; }
        .cs-ab-n { display: block; font-family: var(--serif); font-size: 42px; font-weight: 300; color: var(--gold); line-height: 1; }
        .cs-ab-l { display: block; font-family: var(--sans); font-size: 8px; letter-spacing: .25em; text-transform: uppercase; color: var(--gray-lt); margin-top: 4px; }
        .cs-about-p { font-family: var(--sans); font-size: 14px; font-weight: 300; color: var(--gray-lt); line-height: 1.95; margin-bottom: 20px; margin-top: 20px; }
        .cs-about-stats { display: flex; gap: 44px; margin-top: 36px; padding-top: 32px; border-top: 1px solid rgba(184,154,106,.16); }
        .cs-as-n { display: block; font-family: var(--serif); font-size: 40px; font-weight: 300; color: var(--cream); line-height: 1; }
        .cs-as-l { display: block; font-family: var(--sans); font-size: 8px; letter-spacing: .25em; text-transform: uppercase; color: var(--gold); margin-top: 4px; }

        /* ── GALLERY ── */
        .cs-gallery { padding: 112px 60px; background: var(--ink2); }
        .cs-gal-hdr { display: flex; align-items: flex-start; gap: 80px; margin: 18px 0 56px; }
        .cs-gal-desc { font-family: var(--sans); font-size: 14px; font-weight: 300; color: var(--gray-lt); line-height: 1.85; max-width: 400px; padding-top: 12px; }
        .cs-gal-grid { display: grid; grid-template-columns: repeat(4,1fr); grid-auto-rows: 230px; gap: 3px; }
        .cs-gal-cell { overflow: hidden; position: relative; cursor: none; background: var(--ink3); }
        .cs-gal-normal { grid-column: span 1; grid-row: span 1; }
        .cs-gal-tall   { grid-column: span 1; grid-row: span 2; }
        .cs-gal-wide   { grid-column: span 2; grid-row: span 1; }
        .cs-gal-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 1s cubic-bezier(.16,1,.3,1); filter: brightness(.9); }
        .cs-gal-cell:hover .cs-gal-img { transform: scale(1.07); filter: brightness(1); }
        .cs-gal-over { position: absolute; inset: 0; background: rgba(8,7,6,0); display: flex; align-items: flex-end; justify-content: space-between; padding: 18px; opacity: 0; transition: opacity .4s, background .4s; }
        .cs-gal-cell:hover .cs-gal-over { opacity: 1; background: rgba(8,7,6,.45); }
        .cs-gal-lbl { font-family: var(--serif); font-size: 15px; font-weight: 300; font-style: italic; color: var(--cream); }
        .cs-gal-over svg { color: var(--gold); }

        /* ── MATERIALS ── */
        .cs-mats { padding: 72px 60px; border-top: 1px solid rgba(184,154,106,.1); border-bottom: 1px solid rgba(184,154,106,.1); }
        .cs-mats-grid { display: grid; grid-template-columns: repeat(6,1fr); gap: 2px; margin-top: 32px; }
        .cs-mat { padding: 26px 18px; background: var(--ink3); border: 1px solid rgba(184,154,106,.07); text-align: center; transition: background .35s, border-color .35s, transform .35s; }
        .cs-mat:hover { background: var(--ink4); border-color: rgba(184,154,106,.3); transform: translateY(-5px); }
        .cs-mat-t { display: block; font-family: var(--sans); font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: var(--gold); margin-bottom: 9px; }
        .cs-mat-n { display: block; font-family: var(--serif); font-size: 16px; font-weight: 300; color: var(--cream); }

        /* ── FAQ ── */
        .cs-faq { padding: 112px 60px; display: grid; grid-template-columns: 1fr 1.5fr; gap: 96px; align-items: start; }
        .cs-faq-sub { font-family: var(--sans); font-size: 14px; color: var(--gray-lt); line-height: 1.85; margin-top: 22px; max-width: 310px; }
        .cs-faq-item { border-bottom: 1px solid rgba(184,154,106,.1); }
        .cs-faq-q { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 22px 0; font-family: var(--sans); font-size: 14px; font-weight: 300; color: var(--cream); cursor: none; list-style: none; transition: color .3s; }
        .cs-faq-q::-webkit-details-marker { display: none; }
        .cs-faq-item:hover .cs-faq-q, .cs-faq-item[open] .cs-faq-q { color: var(--gold-lt); }
        .cs-faq-ico { font-size: 20px; color: var(--gold); font-weight: 200; flex-shrink: 0; transition: transform .3s; }
        .cs-faq-item[open] .cs-faq-ico { transform: rotate(45deg); }
        .cs-faq-a { font-family: var(--sans); font-size: 13px; font-weight: 300; color: var(--gray-lt); line-height: 1.85; padding: 0 0 22px; }

        /* ── TESTIMONIALS ── */
        .cs-testi { padding: 112px 60px; background: var(--ink2); }
        .cs-testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; margin-top: 52px; }
        .cs-tc { padding: 40px 32px; background: var(--ink3); border: 1px solid rgba(184,154,106,.07); position: relative; overflow: hidden; transition: background .4s, border-color .4s, transform .4s; }
        .cs-tc::after { content:''; position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: linear-gradient(to right, var(--gold), transparent); opacity: 0; transition: opacity .4s; }
        .cs-tc:hover { background: var(--ink4); border-color: rgba(184,154,106,.22); transform: translateY(-5px); }
        .cs-tc:hover::after { opacity: 1; }
        .cs-tc-mark { font-family: var(--serif); font-size: 68px; color: var(--gold); opacity: .2; display: block; line-height: .6; margin-bottom: -6px; }
        .cs-tc-q { font-family: var(--serif); font-size: 17px; font-weight: 300; font-style: italic; color: var(--cream); line-height: 1.65; margin-bottom: 28px; }
        .cs-tc-who { display: flex; align-items: center; gap: 12px; }
        .cs-tc-av { width: 40px; height: 40px; border-radius: 50%; background: var(--gold-dk); display: flex; align-items: center; justify-content: center; font-family: var(--serif); font-size: 14px; color: var(--ink); flex-shrink: 0; }
        .cs-tc-name { display: block; font-family: var(--sans); font-size: 12px; font-weight: 400; color: var(--cream); }
        .cs-tc-role { display: block; font-family: var(--sans); font-size: 9px; letter-spacing: .1em; color: var(--gold); margin-top: 2px; }

        /* ── CTA BAND ── */
        .cs-cta { position: relative; padding: 112px 60px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .cs-cta-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: saturate(.5); }
        .cs-cta-shade { position: absolute; inset: 0; background: rgba(8,7,6,.88); }
        .cs-cta-body { position: relative; z-index: 2; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 28px; }
        .cs-cta-ey { font-family: var(--sans); font-size: 9px; letter-spacing: .38em; text-transform: uppercase; color: var(--gold); }
        .cs-cta-h { font-family: var(--serif); font-size: clamp(36px,5vw,70px); font-weight: 300; color: var(--cream); line-height: 1.1; }
        .cs-cta-h em { font-style: italic; color: var(--gold-lt); }
        .cs-cta-acts { display: flex; align-items: center; gap: 28px; }
        .cs-cta-phone { font-family: var(--sans); font-size: 13px; letter-spacing: .08em; color: rgba(242,237,231,.5); text-decoration: none; transition: color .3s; }
        .cs-cta-phone:hover { color: var(--gold); }

        /* ── CONTACT ── */
        .cs-contact { position: relative; min-height: 760px; display: flex; align-items: center; }
        .cs-contact-bg { position: absolute; inset: 0; overflow: hidden; }
        .cs-contact-bg img { width: 100%; height: 100%; object-fit: cover; }
        .cs-contact-shade { position: absolute; inset: 0; background: linear-gradient(to right, rgba(8,7,6,.97) 0%, rgba(8,7,6,.88) 50%, rgba(8,7,6,.65) 100%); }
        .cs-contact-inner { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr 1.15fr; gap: 80px; padding: 96px 60px; width: 100%; max-width: 1400px; }
        .cs-ci-info { margin-top: 40px; display: flex; flex-direction: column; gap: 24px; }
        .cs-ci-row { }
        .cs-ci-key { display: block; font-family: var(--sans); font-size: 8px; letter-spacing: .3em; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; }
        .cs-ci-val { font-family: var(--sans); font-size: 14px; font-weight: 300; color: rgba(242,237,231,.62); line-height: 1.75; }
        .cs-ci-link { text-decoration: none; transition: color .3s; }
        .cs-ci-link:hover { color: var(--gold); }
        .cs-form { background: rgba(14,13,11,.9); backdrop-filter: blur(24px) saturate(1.4); border: 1px solid rgba(184,154,106,.14); padding: 40px; }
        .cs-form-title { font-family: var(--serif); font-size: 22px; font-weight: 300; color: var(--cream); margin-bottom: 28px; }
        .cs-form-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .cs-field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 12px; }
        .cs-form-2 .cs-field { margin-bottom: 0; }
        .cs-field label { font-family: var(--sans); font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: var(--gold); }
        .cs-field input, .cs-field select, .cs-field textarea { background: rgba(242,237,231,.04); border: 1px solid rgba(184,154,106,.16); padding: 12px 14px; color: var(--cream); font-family: var(--sans); font-size: 13px; font-weight: 300; outline: none; width: 100%; border-radius: 0; transition: border-color .3s, background .3s; appearance: none; resize: vertical; }
        .cs-field input::placeholder, .cs-field textarea::placeholder { color: var(--gray); }
        .cs-field input:focus, .cs-field select:focus, .cs-field textarea:focus { border-color: var(--gold); background: rgba(184,154,106,.05); }
        .cs-field textarea { min-height: 108px; }
        .cs-form-sub { display: inline-flex; align-items: center; gap: 14px; background: var(--gold); color: var(--ink); font-family: var(--sans); font-size: 10px; font-weight: 500; letter-spacing: .22em; text-transform: uppercase; padding: 15px 32px; border: none; cursor: none; margin-top: 6px; transition: background .3s, gap .3s; }
        .cs-form-sub:hover { background: var(--gold-lt); gap: 20px; }

        /* ── MAP ── */
        .cs-map { position: relative; height: 420px; }
        .cs-map-frame { width: 100%; height: 100%; border: 0; display: block; filter: grayscale(100%) contrast(.75) brightness(.62); }
        .cs-map-vig { position: absolute; inset: 0; pointer-events: none; box-shadow: inset 0 0 80px rgba(8,7,6,.85); }
        .cs-map-pin { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); display: flex; flex-direction: column; align-items: center; gap: 10px; pointer-events: none; }
        .cs-pin-pulse { width: 13px; height: 13px; background: var(--gold); border-radius: 50%; box-shadow: 0 0 0 5px rgba(184,154,106,.25), 0 0 0 10px rgba(184,154,106,.1); animation: pp 2s ease infinite; }
        @keyframes pp { 0%,100%{box-shadow:0 0 0 5px rgba(184,154,106,.28),0 0 0 10px rgba(184,154,106,.1)} 50%{box-shadow:0 0 0 10px rgba(184,154,106,.18),0 0 0 20px rgba(184,154,106,.05)} }
        .cs-pin-lbl { font-family: var(--sans); font-size: 9px; letter-spacing: .18em; text-transform: uppercase; color: var(--cream); background: rgba(8,7,6,.82); padding: 6px 13px; border: 1px solid rgba(184,154,106,.2); white-space: nowrap; }

        /* ── FOOTER ── */
        .cs-footer { padding: 76px 60px 36px; background: var(--ink2); border-top: 1px solid rgba(184,154,106,.1); }
        .cs-ft-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 56px; padding-bottom: 56px; border-bottom: 1px solid rgba(184,154,106,.09); gap: 60px; }
        .cs-ft-logo { display: block; font-family: var(--serif); font-size: 30px; font-weight: 300; color: var(--cream); }
        .cs-ft-logo em { font-style: italic; color: var(--gold-lt); }
        .cs-ft-tag { font-family: var(--sans); font-size: 10px; letter-spacing: .13em; color: var(--gray); margin-top: 8px; }
        .cs-ft-cols { display: flex; gap: 52px; }
        .cs-ft-col { display: flex; flex-direction: column; gap: 10px; }
        .cs-ft-ch { font-family: var(--sans); font-size: 8px; letter-spacing: .36em; text-transform: uppercase; color: var(--gold); margin-bottom: 4px; }
        .cs-ft-link { font-family: var(--sans); font-size: 12px; font-weight: 300; color: var(--gray); text-decoration: none; transition: color .3s; }
        a.cs-ft-link:hover { color: var(--cream); }
        .cs-ft-bot { display: flex; justify-content: space-between; font-family: var(--sans); font-size: 10px; color: rgba(94,90,86,.5); }
        .cs-ft-craft { font-style: italic; }

        /* ── LIGHTBOX ── */
        .cs-lb { position: fixed; inset: 0; z-index: 10000; background: rgba(8,7,6,.96); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(14px); animation: lbin .35s ease; }
        @keyframes lbin { from{opacity:0} to{opacity:1} }
        .cs-lb-x { position: absolute; top: 26px; right: 26px; background: none; border: none; cursor: none; padding: 8px; transition: transform .3s; }
        .cs-lb-x:hover { transform: rotate(90deg); }
        .cs-lb-img { max-width: 88vw; max-height: 88vh; object-fit: contain; border: 1px solid rgba(184,154,106,.2); animation: lbimg .45s cubic-bezier(.16,1,.3,1); box-shadow: 0 40px 120px rgba(0,0,0,.8); }
        @keyframes lbimg { from{transform:scale(.94);opacity:0} to{transform:scale(1);opacity:1} }

        /* ── RESPONSIVE ── */
        @media (max-width: 1200px) {
          .cs-pgrid { grid-template-columns: repeat(2,1fr); }
          .cs-pc-a,.cs-pc-b,.cs-pc-c,.cs-pc-d,.cs-pc-e,.cs-pc-f { grid-column: span 1; }
          .cs-pc-c { margin-top: 0; }
          .cs-proc-grid { grid-template-columns: repeat(2,1fr); }
          .cs-stats-grid { grid-template-columns: repeat(2,1fr); }
          .cs-mats-grid { grid-template-columns: repeat(3,1fr); }
          .cs-gal-grid { grid-template-columns: repeat(2,1fr); }
          .cs-gal-wide { grid-column: span 2; }
        }
        @media (max-width: 1024px) {
          .cs-services { grid-template-columns: 1fr; gap: 48px; }
          .cs-svc-left { position: static; }
          .cs-about { grid-template-columns: 1fr; gap: 56px; }
          .cs-about-thumb { display: none; }
          .cs-contact-inner { grid-template-columns: 1fr; }
          .cs-faq { grid-template-columns: 1fr; gap: 48px; }
          .cs-testi-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .cs-nav { padding: 18px 24px; gap: 20px; }
          .cs-nav--s { padding: 14px 24px; }
          .cs-nav-links, .cs-nav-cta, .cs-clock { display: none; }
          .cs-burger { display: flex; }
          .cs-fmenu { padding: 80px 24px; }
          .cs-fmenu-x { right: 24px; }
          .cs-fmenu-foot { left: 24px; flex-direction: column; gap: 6px; }
          .cs-fml-label { font-size: 36px; }
          .cs-hero-body { padding: 0 24px 76px; }
          .cs-hero-tagline { display: none; }
          .cs-h1-row--in { padding-left: 28px; }
          .cs-stats { padding: 80px 24px; }
          .cs-stats-grid { grid-template-columns: 1fr 1fr; }
          .cs-stats-quote { flex-direction: column; gap: 20px; }
          .cs-sq-rule { width: 60px; height: 1px; align-self: center; }
          .cs-projects { padding: 80px 24px; }
          .cs-projects-hdr { flex-direction: column; gap: 16px; }
          .cs-pgrid { grid-template-columns: 1fr; grid-auto-rows: 320px; }
          .cs-interlude { height: 480px; }
          .cs-process { padding: 80px 24px; }
          .cs-proc-grid { grid-template-columns: 1fr; }
          .cs-services { padding: 80px 24px; }
          .cs-about { padding: 80px 24px; }
          .cs-gallery { padding: 80px 24px; }
          .cs-gal-hdr { flex-direction: column; gap: 16px; }
          .cs-gal-grid { grid-template-columns: 1fr 1fr; grid-auto-rows: 160px; }
          .cs-gal-tall { grid-row: span 1; }
          .cs-mats { padding: 56px 24px; }
          .cs-mats-grid { grid-template-columns: repeat(2,1fr); }
          .cs-faq { padding: 80px 24px; }
          .cs-testi { padding: 80px 24px; }
          .cs-testi-grid { grid-template-columns: 1fr; }
          .cs-cta { padding: 80px 24px; }
          .cs-cta-acts { flex-direction: column; gap: 16px; }
          .cs-contact-inner { padding: 80px 24px; }
          .cs-form-2 { grid-template-columns: 1fr; }
          .cs-footer { padding: 56px 24px 28px; }
          .cs-ft-top { flex-direction: column; }
          .cs-ft-cols { flex-direction: column; gap: 24px; }
          .cs-ft-bot { flex-direction: column; gap: 6px; }
          .cs-dnav { display: none; }
          .cs-btt { bottom: 20px; right: 20px; }
          .cs-blob, .cs-dot { display: none; }
          html { cursor: auto; }
        }
      `}</style>
    </main>
  );
}