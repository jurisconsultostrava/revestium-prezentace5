import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

/* ── cobe WebGL Globe ── */
function useCobeGlobe(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let phi = 0;
    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: 1360,
      height: 1360,
      phi: 0,
      theta: 0.2,
      dark: 1,
      diffuse: 1.4,
      scale: 1,
      mapSamples: 16000,
      mapBrightness: 7,
      baseColor: [0.75, 0.56, 0.22],
      markerColor: [1.0, 0.88, 0.35],
      glowColor: [0.65, 0.48, 0.15],
      markers: [
        { location: [47.3769, 8.5417], size: 0.06 },
        { location: [51.5074, -0.1278], size: 0.06 },
        { location: [53.3498, -6.2603], size: 0.05 },
        { location: [50.0755, 14.4378], size: 0.05 },
      ],
      onRender: (state: Record<string, number>) => {
        state.phi = phi;
        phi += 0.003;
      },
    });
    return () => globe.destroy();
  }, [canvasRef]);
}

/* ── Matrix binary rain ── */
function useMatrixRain(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const FONT_SIZE = 16;
    const SPEED = 0.3;
    let W: number, H: number, cols: number, drops: number[];
    let animId: number;

    function init() {
      const hero = canvas!.parentElement;
      W = canvas!.width = (hero ? hero.offsetWidth : window.innerWidth) || window.innerWidth;
      H = canvas!.height = (hero ? hero.offsetHeight : window.innerHeight) || window.innerHeight;
      cols = Math.floor(W / FONT_SIZE);
      drops = Array.from({ length: cols }, () => Math.random() * -(H / FONT_SIZE));
    }

    function draw() {
      ctx!.fillStyle = "rgba(4,6,14,0.08)";
      ctx!.fillRect(0, 0, W, H);
      ctx!.font = `${FONT_SIZE}px monospace`;
      for (let i = 0; i < cols; i++) {
        const y = drops[i] * FONT_SIZE;
        ctx!.fillStyle = "rgba(255,220,130,0.95)";
        ctx!.fillText(Math.random() > 0.5 ? "1" : "0", i * FONT_SIZE, y);
        ctx!.fillStyle = "rgba(196,149,74,0.55)";
        ctx!.fillText(Math.random() > 0.5 ? "1" : "0", i * FONT_SIZE, y - FONT_SIZE * 2);
        ctx!.fillStyle = "rgba(160,120,56,0.25)";
        ctx!.fillText(Math.random() > 0.5 ? "1" : "0", i * FONT_SIZE, y - FONT_SIZE * 4);
        drops[i] += SPEED;
        if (drops[i] * FONT_SIZE > H && Math.random() > 0.985) {
          drops[i] = Math.random() * -20;
        }
      }
      animId = requestAnimationFrame(draw);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        init();
        window.addEventListener("resize", init);
        draw();
      });
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
    };
  }, [canvasRef]);
}

/* ── Scroll-reveal hook ── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.07, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll<HTMLElement>(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── Active nav highlight on scroll ── */
function useActiveNav() {
  useEffect(() => {
    const handle = () => {
      let cur = "";
      document.querySelectorAll<HTMLElement>("section[id], footer[id]").forEach(s => {
        if (window.scrollY >= s.offsetTop - 130) cur = s.id;
      });
      document.querySelectorAll<HTMLAnchorElement>(".nav-links a").forEach(a => {
        a.classList.toggle("active", a.getAttribute("href") === "#" + cur);
      });
    };
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);
}

export default function LandingPage() {
  const globeRef = useRef<HTMLCanvasElement>(null);
  useCobeGlobe(globeRef);
  useReveal();
  useActiveNav();


  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Commissioner:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
:root{
  --dark:#080806;--dark2:#0e0d0a;--dark3:#141310;--dark4:#1c1a16;--dark5:#242118;
  --gold:#c4954a;--gold2:#d4aa6a;--gold3:#a07838;
  --gold-dim:rgba(196,149,74,0.12);--gold-line:rgba(196,149,74,0.25);
  --cream:#ffffff;--cream2:#ede8dc;--cream3:#c8bfa8;--cream4:#8a8278;
  --border:rgba(196,149,74,0.14);--border2:rgba(255,255,255,0.05);
  --serif:'Commissioner',system-ui,sans-serif;
  --sc:'Commissioner',system-ui,sans-serif;
  --sans:'DM Sans',system-ui,sans-serif;
  --ease:cubic-bezier(0.16,1,0.3,1);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;font-size:17px;scroll-padding-top:80px;}
body{background:var(--dark);color:var(--cream);font-family:var(--sans);font-weight:400;line-height:1.75;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:var(--dark);}::-webkit-scrollbar-thumb{background:var(--gold3);}
a{color:inherit;text-decoration:none;}::selection{background:rgba(196,149,74,0.2);}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1rem 3.5rem;display:flex;justify-content:space-between;align-items:center;background:rgba(8,8,6,0.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);min-height:100px;}
.nav-logo{position:absolute;left:50%;transform:translateX(-55%);display:flex;align-items:center;gap:1.6rem;}
.nav-logo img:first-child{height:90px;width:auto;object-fit:contain;}
.nav-logo img:last-child{height:60px;width:auto;object-fit:contain;}
.nav-links{display:flex;gap:2.2rem;list-style:none;}
.nav-links a{font-family:var(--sc);font-size:.72rem;font-weight:400;letter-spacing:.12em;color:var(--cream3);transition:color .3s;}
.nav-links a:hover,.nav-links a.active{color:var(--gold2);}
.nav-contact{font-family:var(--sans);font-size:.72rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;padding:.6rem 1.4rem;border:1px solid rgba(196,149,74,0.5);color:var(--gold);border-radius:2px;transition:all .2s;white-space:nowrap;}
.nav-contact:hover{background:var(--gold);color:#080806;border-color:var(--gold);}
.hero{min-height:100vh;position:relative;overflow:hidden;background:#04060e;}
canvas#heroGlobe{position:absolute;right:1%;top:50%;transform:translateY(-50%);width:680px;height:680px;z-index:0;pointer-events:none;opacity:0.92;}
canvas#matrixRain{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;opacity:0.18;}
.hero-veil{position:absolute;inset:0;z-index:1;background:linear-gradient(to right,rgba(4,6,14,0.97) 0%,rgba(4,6,14,0.88) 40%,rgba(4,6,14,0.35) 100%),linear-gradient(to top,rgba(4,6,14,0.7) 0%,transparent 40%);}
.hero-lines{position:absolute;inset:0;pointer-events:none;z-index:1;background-image:linear-gradient(rgba(196,149,74,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(196,149,74,0.03) 1px,transparent 1px);background-size:80px 80px;}
.hero-inner{position:relative;z-index:2;min-height:100vh;display:flex;align-items:center;max-width:1180px;margin:0 auto;padding:9rem 3rem 6rem;padding-left:5%;}
@media(min-width:1100px){.hero-inner{padding-left:7%;}.hero-left{max-width:520px;}}
.hero-left{max-width:560px;}
.hero-accent-line{width:48px;height:2px;background:var(--gold);margin-bottom:1.8rem;opacity:0;animation:fadeUp .5s ease .05s forwards;}
.hero-eyebrow{font-family:var(--sans);font-size:.62rem;font-weight:500;letter-spacing:.26em;color:var(--gold);text-transform:uppercase;margin-bottom:1.6rem;opacity:0;animation:fadeUp .5s ease .1s forwards;}
.hero-h1{font-family:var(--sans);font-weight:700;font-size:clamp(1.6rem,4.5vw,3.6rem);line-height:1.06;letter-spacing:.025em;color:#E6D96A;margin-bottom:1.6rem;opacity:0;animation:fadeUp .7s ease .25s forwards;}
.hero-h1 em{font-weight:700;color:var(--gold);font-style:normal;}
.hero-sub{font-family:var(--sans);font-size:.95rem;font-weight:300;color:#989894;line-height:1.75;max-width:46ch;margin-bottom:2.4rem;text-align:left;opacity:0;animation:fadeUp .7s ease .4s forwards;}
.hero-ctas{display:flex;gap:.9rem;flex-wrap:wrap;margin-bottom:2.8rem;opacity:0;animation:fadeUp .7s ease .55s forwards;}
.hero-btn-primary{font-family:var(--sans);font-size:.75rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:.85rem 2.2rem;border-radius:2px;background:var(--gold);color:#04060e;text-decoration:none;transition:background .15s;white-space:nowrap;box-shadow:0 0 28px rgba(196,149,74,0.25);}
.hero-btn-primary:hover{background:#d4aa6a;}
.hero-btn-ghost{font-family:var(--sans);font-size:.75rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;padding:.85rem 2.2rem;border-radius:2px;border:1px solid rgba(196,149,74,0.38);color:rgba(196,149,74,0.85);text-decoration:none;transition:border-color .15s,color .15s;white-space:nowrap;}
.hero-btn-ghost:hover{border-color:var(--gold);color:var(--gold);}
.hero-divider{width:100%;height:1px;background:rgba(196,149,74,0.15);margin-bottom:2rem;opacity:0;animation:fadeUp .7s ease .65s forwards;}
.hero-metrics{display:flex;align-items:center;opacity:0;animation:fadeUp .7s ease .7s forwards;}
.hm{padding-right:2rem;}
.hm-val{font-family:var(--serif);font-size:1.45rem;font-weight:600;color:#fff;line-height:1;margin-bottom:.28rem;letter-spacing:-.01em;}
.hm-label{font-family:var(--sans);font-size:.58rem;font-weight:400;color:var(--gold);letter-spacing:.14em;text-transform:uppercase;opacity:.7;}
.hm-divider{width:1px;height:28px;background:rgba(196,149,74,0.18);margin-right:2rem;flex-shrink:0;}
.section{padding:7rem 3.5rem;}
.section-inner{max-width:1160px;margin:0 auto;}
.eyebrow{font-family:var(--sc);font-size:.65rem;font-weight:300;letter-spacing:.22em;color:var(--gold);margin-bottom:.9rem;display:flex;align-items:center;gap:.9rem;}
.eyebrow::after{content:'';flex:1;max-width:32px;height:1px;background:var(--gold3);}
.sh{font-family:var(--serif);font-weight:600;font-size:clamp(1.6rem,2.8vw,2.6rem);line-height:1.15;letter-spacing:-.02em;margin-bottom:.7rem;}
.sh em{font-weight:700;color:var(--gold2);font-style:normal;}
.sub{font-size:.97rem;color:#e0d8c8;max-width:58ch;line-height:1.82;margin-bottom:3rem;text-align:justify;hyphens:auto;-webkit-hyphens:auto;}
.gold-rule{width:32px;height:1px;background:var(--gold3);margin:1.2rem 0 2rem;}
.cat-divider{font-family:var(--sc);font-size:.62rem;letter-spacing:.2em;color:var(--gold3);padding:1rem 0;margin:2rem 0 1.2rem;border-top:1px solid var(--border2);}
.story-bg{background:var(--dark2);}
.story-grid{display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:start;}
.story-text p{font-size:.97rem;color:#e0d8c8;line-height:1.9;margin-bottom:1.3rem;text-align:justify;hyphens:auto;-webkit-hyphens:auto;}
.story-text strong{color:var(--cream2);font-weight:400;}
.story-text .pull{font-family:var(--sans);font-weight:500;font-size:1.1rem;color:var(--gold2);line-height:1.6;border-left:2px solid var(--gold3);padding-left:1.4rem;margin:2rem 0;letter-spacing:.01em;}
.timeline{position:relative;}
.timeline::before{content:'';position:absolute;left:46px;top:0;bottom:0;width:1px;background:linear-gradient(var(--border),transparent);}
.tl-item{display:grid;grid-template-columns:96px 1fr;padding:1.4rem 0;position:relative;}
.tl-year{font-family:var(--sc);font-size:.85rem;letter-spacing:.08em;color:var(--gold3);text-align:right;padding-right:1.4rem;padding-top:.05rem;}
.tl-dot{position:absolute;left:43px;top:1.65rem;width:7px;height:7px;border-radius:50%;background:var(--gold3);border:1px solid var(--dark2);}
.tl-h{font-size:.88rem;font-weight:500;color:var(--cream2);margin-bottom:.3rem;}
.tl-p{font-size:.84rem;color:#c8bfa8;line-height:1.65;text-align:justify;hyphens:auto;-webkit-hyphens:auto;}
.entity-stack{display:flex;flex-direction:column;gap:.65rem;margin-top:2rem;}
.entity{border:1px solid var(--border2);border-left:1px solid var(--border);background:var(--dark3);padding:1rem 1.2rem;display:grid;grid-template-columns:auto 1fr;gap:1rem;align-items:start;}
.e-flag{font-size:1.1rem;}
.e-name{font-family:var(--sc);font-size:.72rem;letter-spacing:.1em;color:var(--gold2);margin-bottom:.2rem;}
.e-desc{font-size:.82rem;color:#c8bfa8;line-height:1.55;text-align:justify;hyphens:auto;-webkit-hyphens:auto;}
.story-vizitka{margin-top:2.2rem;display:inline-block;}
.story-vizitka img{max-width:520px;width:100%;border-radius:3px;opacity:0.92;transition:opacity .3s;filter:brightness(1.02) contrast(1.02);}
.story-vizitka img:hover{opacity:1;}
.prod-bg{background:var(--dark);}
.prod-alt{background:var(--dark2);}
.cat-strip{border-top:1px solid var(--border);padding:2.5rem 0 2rem;margin-bottom:2.5rem;}
.cat-strip-title{font-family:var(--sc);font-size:.65rem;letter-spacing:.22em;color:var(--gold);}
.prod-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border2);}
.prod-grid.three{grid-template-columns:1fr 1fr 1fr;}
.prod-card{background:var(--dark2);padding:2.2rem 2rem;position:relative;overflow:hidden;transition:background .3s;}
.prod-card:hover{background:var(--dark3);}
.prod-card.featured{background:var(--dark3);}
.prod-card-accent{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold3),transparent);}
.pc-tag{font-family:var(--sc);font-size:.6rem;letter-spacing:.16em;color:var(--cream3);margin-bottom:.7rem;}
.pc-badge{display:inline-block;font-family:var(--sc);font-size:.58rem;letter-spacing:.1em;color:var(--gold);border:1px solid var(--border);padding:.18rem .55rem;margin-right:.4rem;margin-bottom:.7rem;}
.pc-badge.live{color:#7aad7a;border-color:rgba(122,173,122,0.3);}
.pc-badge.unique{color:var(--gold);border-color:var(--border);}
.pc-badge.zero{color:#c08080;border-color:rgba(192,128,128,0.3);}
.pc-name{font-family:var(--serif);font-size:1.3rem;font-weight:600;color:var(--cream);margin-bottom:.6rem;line-height:1.2;letter-spacing:-.01em;}
.pc-name em{font-weight:700;color:var(--gold2);font-style:normal;}
.pc-desc{font-size:.87rem;color:#e0d8c8;line-height:1.78;margin-bottom:1.3rem;text-align:justify;hyphens:auto;-webkit-hyphens:auto;}
.pc-params{border-top:1px solid var(--border2);}
.pc-row{display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--border2);font-size:.78rem;}
.pc-row:last-child{border-bottom:none;}
.pc-row span:first-child{color:var(--cream3);}
.pc-row span:last-child{font-weight:500;color:var(--cream2);}
.pc-row span.acc{color:var(--gold2);}
.mup-bg{background:var(--dark2);}
.mup-tabs{display:flex;gap:0;border:1px solid var(--border2);margin-bottom:3rem;overflow-x:auto;}
.mup-btn{flex:1;min-width:120px;padding:.8rem 1rem;background:transparent;border:none;font-family:var(--sc);font-size:.63rem;letter-spacing:.12em;color:var(--cream3);cursor:pointer;transition:all .25s;border-right:1px solid var(--border2);white-space:nowrap;}
.mup-btn:last-child{border-right:none;}
.mup-btn.active{background:var(--dark4);color:var(--gold2);}
.mup-panel{display:none;}
.mup-panel.active{display:grid;grid-template-columns:5fr 4fr;gap:5rem;align-items:start;}
.mup-left h3{font-family:var(--serif);font-size:1.4rem;font-weight:600;color:var(--cream);margin-bottom:.6rem;line-height:1.25;letter-spacing:-.01em;}
.mup-left p{font-size:.92rem;color:#e0d8c8;line-height:1.82;margin-bottom:1rem;text-align:justify;hyphens:auto;-webkit-hyphens:auto;}
.mup-params{border:1px solid var(--border2);margin-top:1.5rem;}
.mup-row{display:flex;justify-content:space-between;padding:.6rem 1rem;border-bottom:1px solid var(--border2);font-size:.8rem;}
.mup-row:last-child{border-bottom:none;}
.mup-row span:first-child{color:var(--cream3);}
.mup-row span:last-child{font-weight:500;color:var(--cream2);}
.mup-row span.acc{color:var(--gold2);}
.mup-pull{font-family:var(--sans);font-weight:500;font-size:.98rem;color:var(--gold2);line-height:1.65;border-left:2px solid var(--gold3);padding-left:1.2rem;margin:1.5rem 0;letter-spacing:.01em;}
.mup-cards{display:flex;flex-direction:column;gap:.8rem;}
.mup-card{background:var(--dark3);border:1px solid var(--border2);padding:1.2rem 1.3rem;}
.mup-card h4{font-family:var(--sc);font-size:.63rem;letter-spacing:.12em;color:var(--gold3);margin-bottom:.5rem;}
.mup-card p{font-size:.85rem;color:#e0d8c8;line-height:1.65;}
.mup-card p strong{color:var(--gold2);font-weight:500;}
.imp-bg{background:var(--dark3);border-top:1px solid var(--border2);}
.imp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:3rem;}
.imp-block h4{font-family:var(--sc);font-size:.62rem;letter-spacing:.16em;color:var(--gold3);margin-bottom:.9rem;padding-bottom:.6rem;border-bottom:1px solid var(--border2);}
.imp-block address{font-size:.82rem;color:var(--cream3);line-height:2;font-style:normal;}
.imp-block a{transition:color .2s;}
.imp-block a:hover{color:var(--gold2);}
.imp-legal{margin-top:3rem;padding-top:2rem;border-top:1px solid var(--border2);}
.imp-legal p{font-size:.77rem;color:#b8b0a0;line-height:1.8;margin-bottom:.7rem;}
.imp-legal strong{color:var(--cream3);font-weight:500;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:none;}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes barGrow{from{transform:scaleX(0);}to{transform:scaleX(1);}}
@keyframes dnbPulse{0%,100%{box-shadow:0 0 0 2px rgba(76,175,131,0.2);}50%{box-shadow:0 0 0 5px rgba(76,175,131,0.08);}}
.dnb-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#4caf83;box-shadow:0 0 0 2px rgba(76,175,131,0.2);animation:dnbPulse 2.5s ease-in-out infinite;margin-right:5px;}
.dnb-bar-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--gold3),var(--gold2));transform-origin:left;animation:barGrow 1s ease both;}
.reveal{opacity:0;transform:translateY(22px);transition:opacity .75s var(--ease),transform .75s var(--ease);}
.reveal.visible{opacity:1;transform:none;}
.d1{transition-delay:.08s}.d2{transition-delay:.18s}.d3{transition-delay:.28s}.d4{transition-delay:.38s}
@media(max-width:1000px){
  nav{padding:1rem 2rem;}.nav-links{display:none;}.section{padding:5rem 2rem;}
  .story-grid{grid-template-columns:1fr;gap:3rem;}.prod-grid{grid-template-columns:1fr;}.prod-grid.three{grid-template-columns:1fr 1fr;}
  .mup-panel.active{grid-template-columns:1fr;gap:2.5rem;}.imp-grid{grid-template-columns:1fr 1fr;}
}
@media(max-width:700px){
  .hero-inner{padding:7rem 1.5rem 4rem;}.hero-h1{font-size:clamp(2.2rem,9vw,3rem);}.hero-metrics{flex-wrap:wrap;gap:1rem;}.hm-divider{display:none;}
}
@media(max-width:600px){
  .imp-grid,.prod-grid.three{grid-template-columns:1fr;}.mup-tabs{flex-wrap:wrap;}
}
      `}</style>

      {/* ── NAV ── */}
      <nav>
        <a href="#" className="nav-logo">
          <img src="https://goldspot.cz/revestiumlogo.png" alt="REVESTIUM Group Switzerland"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          <img src="https://goldspot.cz/goldbanklogoreve.png" alt="Gold Bank"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
        </a>
        <ul className="nav-links">
          <li><a href="#geschichte"></a></li>
          <li><a href="#produkte"></a></li>
          <li><a href="#collateral"></a></li>
          <li><a href="#zahlen"></a></li>
          <li><a href="#team"></a></li>
          <li><a href="#impressum"></a></li>
        </ul>
        <a href="#impressum"></a>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" id="home">
        <canvas id="heroGlobe" ref={globeRef} />
        <div className="hero-veil" />
        <div className="hero-lines" />
        <div className="hero-inner">
          <div className="hero-left">
            <h1 className="hero-h1">Comprehensive<br />
              <span>solution for<br /></span><em>Gold as a Service</em></h1>
            <div className="hero-accent-line" />
            <p className="hero-sub">Von der passiven Reserve zum aktiven Kapital.<br />Genau so verstehen wir Gold in unserem Konzept „Gold as a Service". Wir betrachten es als ein einzigartiges Edelmetall, das sich in das digitalisierte Finanzsystem integrieren lässt, ohne dabei seine physische Substanz und seine Sicherungsfunktionen zu verlieren. Unsere umfassende Lösung erschließt das volle Potenzial, über das dieses einzigartige Edelmetall verfügt.</p>
            <div className="hero-ctas">
            </div>
            <div className="hero-divider" />
            <div className="hero-metrics">
              <div className="hm"><p className="hm-val">LBMA</p><p className="hm-label">Good Delivery Standard</p></div>
              <div className="hm-divider" />
              <div className="hm"><p className="hm-val">24/7</p><p className="hm-label">Verfügbarkeit</p></div>
              <div className="hm-divider" />
              <div className="hm"><p className="hm-val">AMLR/AMLA</p><p className="hm-label">Angepasst</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GESCHICHTE & STRUKTUR ── */}
      <section id="geschichte" className="section story-bg">
        <div className="section-inner">
          <div className="story-grid">
            <div className="reveal">
              <p className="eyebrow">Geschichte &amp; Profil</p>
              <h2 className="sh">Geschichte<br /><em>&amp; Unternehmensphilosophie</em></h2>
              <div className="gold-rule" />
              <div className="story-text">
                <p>Manchmal stehen wir vor einem scheinbar unlösbaren Problem — einem Hindernis, das uns an einen Berg wie den Mount Everest erinnert. Als ich als leitende Juristin der MVI-Gruppe vor der Aufgabe stand, die Rückübernahme eines an der Londoner Börse notierten irischen Bergbauunternehmens durchzuführen — unter Beteiligung von drei Aufsichtsbehörden, insgesamt vier europäischen und einem außereuropäischen Unternehmen — hatte ich trotz der Unterstützung meiner Kollegen von der Anwaltskanzlei Kinstellar das Gefühl, dass wir das niemals schaffen würden.</p>
                <p className="pull">„Bis dahin hatte noch niemand eine Übernahme dieser Größenordnung auf dieser Ebene durchgeführt."</p>
                <p>Aber wir haben es geschafft. Das RTO wurde erfolgreich abgeschlossen — die zweite Notierung eines tschechischen Unternehmens an der London Stock Exchange und gleichzeitig die historisch erste RTO-Transaktion dieser Größenordnung überhaupt.</p>
                <p>Diese Erfahrung wurde zur Grundlage unserer Unternehmensphilosophie: <strong>Das Wort „unmöglich" gibt es für uns nicht.</strong> Was andere als unüberwindbare Hürde sehen, ist für uns die Ausgangsbasis — der Punkt, von dem aus wir anfangen zu denken.</p>
              </div>
              <div className="story-vizitka reveal d1">
                <img src="https://goldspot.cz/osobnivizitka.png" alt="REVESTIUM vizitka" />
              </div>
            </div>
            <div className="reveal d2">
              <p className="eyebrow">Struktur &amp; Rechtsordnungen</p>
              <h2 className="sh">Vier Rechtsordnungen,<br /><em>eine Unternehmensgruppe</em></h2>
              <div className="gold-rule" />
              <div className="entity-stack">
                <div className="entity">
                  <div className="e-flag">🇨🇭</div>
                  <div><p className="e-name">REVESTIUM AG — Zug, Schweiz</p><p className="e-desc">Holding &amp; Tokenisierung · Gegründet 2020</p></div>
                </div>
                <div className="entity">
                  <div className="e-flag">🇬🇧</div>
                  <div>
                    <p className="e-name">JURISCONSULT LTD — London, Vereinigtes Königreich</p>
                    <p className="e-desc" style={{ marginBottom: ".45rem" }}>LEI: 315700UZ1Y9WYP99U441 · Companies House: 12729220</p>
                    <p className="e-desc">Aktive Registrierung bei der CDCP Prag. Aktive Lizenz des Czech Assay Office für den Import und Export von Edelmetallen sowie die Berechtigung zur Produktkennzeichnung und Herstellung von Edelmetalllegierungen.</p>
                  </div>
                </div>
                <div className="entity">
                  <div className="e-flag">🇮🇪</div>
                  <div><p className="e-name">SWISS GOLD DEPOSIT Ltd — Dublin, Irland</p><p className="e-desc">Bereit zur Zulassung in den 27 EU-Mitgliedstaaten · Vertriebsfenster in der EU gemäß MiFID II</p></div>
                </div>
                <div className="entity">
                  <div className="e-flag">🇨🇿</div>
                  <div><p className="e-name">MOJE ZLATO — Jurisconsult o.z., Tschechische Republik</p><p className="e-desc">LEI: 315700343MOJGZ62NN31 · Aktive Lizenz des Czech Assay Office für Import und Export von Edelmetallprodukten innerhalb der EU.</p></div>
                </div>
                <div className="entity" style={{ borderLeftColor: "var(--gold3)", background: "rgba(196,149,74,0.04)" }}>
                  <div className="e-flag" style={{ fontSize: ".9rem", paddingTop: ".15rem" }}>+</div>
                  <div><p className="e-name" style={{ color: "var(--cream2)" }}>Weitere Unternehmen im Portfolio</p><p className="e-desc">Unser Portfolio umfasst weitere Unternehmen, die ein Ökosystem für eine effektive Diversifizierung von Risiken und Kapital in ganz Europa bilden.</p></div>
                </div>
              </div>
            </div>
          </div>

          <div className="timeline reveal" style={{ maxWidth: "640px", margin: "3rem auto 0" }}>
            <div className="tl-item"><div className="tl-year">2020</div><div className="tl-dot" /><div><p className="tl-h">Gründung der Rechtsstruktur</p><p className="tl-p">Gründung der Firma JURISCONSULT LTD (London) und Beginn des Aufbaus einer Marke für den Einzelhandel mit Edelmetallen.</p></div></div>
            <div className="tl-item"><div className="tl-year">2021</div><div className="tl-dot" /><div><p className="tl-h">Gründung der Holding</p><p className="tl-p">Moje Zlato und Moje zlatnictví werden in die Unternehmensgruppe aufgenommen. Das Czech Assay Office vergibt das Hersteller- und Haftungszeichen.</p></div></div>
            <div className="tl-item"><div className="tl-year">2023</div><div className="tl-dot" /><div><p className="tl-h">LBMA-Clearing &amp; Marktzugang</p><p className="tl-p">Zulassung als professionelle Gegenpartei für das Clearing-Mitglied LPMCL und Zugang zur Handelsstruktur der LBMA.</p></div></div>
            <div className="tl-item"><div className="tl-year">2024</div><div className="tl-dot" /><div><p className="tl-h">Tschechische Nationalbank &amp; AUROM live</p><p className="tl-p">Vertragsabschluss mit der Tschechischen Nationalbank über den Verkauf und Vertrieb von Edelmetallen. Start des Treasury-Managementsystems AUROM und Dealer Commander.</p></div></div>
            <div className="tl-item"><div className="tl-year">2025</div><div className="tl-dot" /><div><p className="tl-h">Europäische Holdingstruktur &amp; Raffinerie-Partnerschaft</p><p className="tl-p">Holdingstruktur in Irland, Großbritannien, Tschechien und der Slowakei. Vertragsabschluss mit einer deutschen Raffinerie (London Good Delivery). Produktarchitektur Gold Hypo &amp; Repo fertiggestellt.</p></div></div>
            <div className="tl-item"><div className="tl-year">2026</div><div className="tl-dot" /><div><p className="tl-h">REVESTIUM AG &amp; Gold Bank SK Pilotbetrieb</p><p className="tl-p">Gold Bank SK im Pilotbetrieb als Lizenz/Franchise an das Broker-Pool-Netzwerk verteilt. Übernahme der REVESTIUM AG und Vorbereitung auf die Tokenisierung gemäß dem Schweizer DLT-Gesetz.</p></div></div>
          </div>
        </div>
      </section>

      {/* ── PRODUKTE ── */}
      <section id="produkte" className="section prod-bg">
        <div className="section-inner">
          <div className="reveal">
            <p className="eyebrow">Produkte &amp; Dienstleistungen</p>
            <h2 className="sh">Umfassende Dienstleistungen im Bereich Digitalisierung —<br /><em>Vom Kapital bis zur institutionellen Infrastruktur.</em></h2>
            <p className="sub">Umfassende Lösungen für Infrastruktur und Digitalisierung, angefangen bei der physischen Lagerung über Kreditprodukte und die eigene Kassenverwaltung bis hin zu institutionellen Dienstleistungen für vier verschiedene Rechtsordnungen. Eine einzige Integration für ein breites Produktspektrum.</p>
          </div>

          <div className="cat-strip reveal"><p className="cat-strip-title">Digitale Plattformen</p></div>
          <div className="prod-grid reveal">
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <p className="pc-tag">Gold Bank CZ · SK · EU</p>
              <p className="pc-name">Gold Bank</p>
              <p className="pc-desc">Die erste europäische Plattform, die physisches Gold mit der vollständigen Digitalisierung des gesamten Lebenszyklus verbindet. Kunden kaufen, verwalten und lagern Gold — direkt vom Smartphone oder Computer aus. Kreditkonto in CZK und EUR, automatisches Sparprogramm in Gold, Rückkauf zu Marktpreisen, Umwandlung in physische Barren mit Kurierlieferung. Vollständige AML/KYC-Konformität mit eigenem KYC-Portal. Web + iOS + Android.</p>
            </div>
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge unique">Proprietär</span>
              <p className="pc-tag">KI-Treasury &amp; Research</p>
              <p className="pc-name">AUROM &amp;<br /><em>AUROM PRO Dealer Commander</em></p>
              <p className="pc-desc">Eigenentwickeltes Forschungs- und Analysesystem für die Verwaltung und Neugewichtung von Portfolios mithilfe von KI: tägliche SARIMA/Prophet-Prognose, Smart Hedging CME + OTC, Yield-Hunter-Strategie, Stresstests. Auf dem Markt existiert kein vergleichbares Produkt mit einer so umfangreichen Wissensbasis und Verknüpfung von Aktivitäten zwischen physischer Verwaltung, Lagerverwaltung und dem Informationsaustausch zwischen nicht-bankgebundenem und reguliertem Segment.</p>
            </div>
          </div>

          <div className="prod-grid three reveal" style={{ marginTop: "1px" }}>
            <div className="prod-card">
              <span className="pc-badge unique">Einzigartig in Europa</span>
              <p className="pc-tag">Strukturiertes Beteiligungsprogramm</p>
              <p className="pc-name">GOLD D10</p>
              <p className="pc-desc">Ein einzigartiges partizipatives Renditeprogramm mit einem bedeutenden Anteil an aktiven Handelsaktivitäten, das nicht als kollektives Anlageprogramm oder AIF-Fondsstruktur eingestuft ist. 10 diversifizierte Positionen zur Absicherung in physischem Gold, optimiert durch AUROM Research und Dealer Commander Execution. Zielgruppe: HNWI und qualifizierte Anleger.</p>
            </div>
            <div className="prod-card">
              <span className="pc-badge">Digitales Sparprogramm</span>
              <p className="pc-tag">Aufbauprogramm</p>
              <p className="pc-name">DIGI GOLD<br />Savings</p>
              <p className="pc-desc">Digitales Programm für die physische Verwahrung von Edelmetallen. Schrittweiser Aufbau eines physischen Goldbestands — vollständig digital, 100 % physisch durch LBMA gedeckt, mit automatischer DCA-Optimierung.</p>
            </div>
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge unique">Einzigartig in Europa</span><span className="pc-badge live">Rollout</span>
              <p className="pc-tag">Zahlungsmittel · Täglich</p>
              <p className="pc-name">Gold Card</p>
              <p className="pc-desc">Verbindung des Goldkontos bei der Gold Bank mit einer Mastercard — weltweit mit Gold zahlen. Transaktionen werden automatisch vom Goldguthaben abgezogen. Gold wird zu einer lebendigen Währung. Dieses Konzept bietet in Europa praktisch kein anderer Anbieter.</p>
            </div>
          </div>

          <div className="cat-strip reveal" style={{ marginTop: "4rem" }}><p className="cat-strip-title">Compliance &amp; Intelligence</p></div>
          <div className="prod-grid reveal">
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge unique">Eigene AML/KYC-Plattform</span>
              <p className="pc-tag">Compliance · Due Diligence · FATF</p>
              <p className="pc-name">ARGUS</p>
              <p className="pc-desc">Fortschrittliche Plattform für die Einhaltung von AML/KYC-Vorschriften, entwickelt für AML-Analysten, Compliance-Mitarbeiter und Risikomanager im Edelmetallhandel. Strukturierte Untersuchungen mit eindeutiger Fallnummer, automatisch generierte Checklisten, AI-OSINT-Analyse, Netzwerkbeziehungsdiagramm, interaktive Zeitleiste und automatische Risikobewertung. Konform mit §253/2008 Sb., 40 FATF-Empfehlungen, AMLD5, DSGVO, LBMA Responsible Sourcing, ISO 27001 und SOC 2 Typ II.</p>
            </div>
            <div className="prod-card">
              <span className="pc-badge">Regulatory Intelligence</span>
              <p className="pc-tag">Regulatory Intelligence</p>
              <p className="pc-name">ARGUS PRO</p>
              <p className="pc-desc">Edelmetallhändler benötigen ab dem 1.7.2027 ein effektives Tool zur Erfüllung ihrer Pflichten beim Onboarding und bei der laufenden Überwachung gemäß der neuen europäischen AML-Gesetzgebung. ARGUS PRO adressiert EDD- und CDD-Prozesse, strukturiertes Fallmanagement, KPI-Dashboards und LBMA-konforme Compliance-Programme.</p>
            </div>
          </div>

          <div className="cat-strip reveal" style={{ marginTop: "4rem" }}><p className="cat-strip-title">Finanzprodukte — Symbiose mit dem Bankensystem</p></div>
          <div className="prod-grid reveal">
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge zero">Zero Competition EU</span><span className="pc-badge live">Ready to launch</span>
              <p className="pc-tag">Langfristiger Goldkredit</p>
              <p className="pc-name">Gold Hypo</p>
              <p className="pc-desc">Das erste und einzige Produkt für goldbesicherte Langzeitkredite in der EU. Der Kunde hinterlegt physisches Gold als Sicherheit — unser Unternehmen sorgt als Sicherheitenagent für die Verwahrung, die tägliche Bewertung (LBMA PM Fix), die Ausgabe von Warrants und das Ausfallmanagement (T+2 über einen Clearing-Partner im CME/LPMCL-System). Die Bank gewährt den Kredit, hält den Warrant und trägt kein operatives Risiko im Zusammenhang mit dem Gold.</p>
            </div>
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge unique">Premium-Alternative</span><span className="pc-badge live">Ready to launch</span>
              <p className="pc-tag">Kurzfristiger Goldkredit</p>
              <p className="pc-name">Gold Repo</p>
              <p className="pc-desc">Kurzfristige Liquidität aus Gold ohne Verkauf. Der Kunde hinterlegt physisches Gold als Sicherheit — unser Unternehmen sorgt als Sicherheitenverwalter für die Verwahrung, die tägliche Bewertung (LBMA PM Fix) und das Ausfallmanagement (T+2). Keine Bonitätsprüfung. Im Vergleich zum Pfandhaus: 99,5 % Realisierung vs. 50–70 %, Abwicklung T+2 vs. Monate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── GOLD AS COLLATERAL ── */}
      <section id="collateral" className="section" style={{ background: "var(--dark2)" }}>
        <div className="section-inner">
          <div className="reveal">
            <p className="eyebrow">Gold as Collateral — institutionelle Infrastruktur</p>
            <h2 className="sh">Das Sicherheiten-Dilemma —<br /><em>PGI als dritter Weg</em></h2>

            {/* ── Vergleichstabelle ── */}
            <div style={{ overflowX: "auto", marginTop: "2.5rem", marginBottom: "2.8rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".82rem", fontFamily: "var(--sans)" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--gold-line)" }}>
                    {["Kriterium", "Unallocated Gold", "Allocated Gold"].map((h, i) => (
                      <th key={i} style={{ textAlign: "left", padding: ".75rem 1.2rem", color: i === 0 ? "var(--gold)" : "var(--cream3)", fontFamily: "var(--sc)", letterSpacing: ".1em", fontWeight: 600, fontSize: ".7rem", textTransform: "uppercase", background: "var(--dark4)", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Rechtliche Stellung", "neg", "Unbesicherter Gläubigeranspruch", "pos", "Direktes Eigentum"],
                    ["Gegenparteirisiko", "neg", "Hoch (Insolvenzrisiko Custodian)", "pos", "Keines (segregierte Barren)"],
                    ["Basel III Klassifizierung", "neg", "Tier 3 (85 % RWA)", "pos", "Tier 1-fähig"],
                    ["Operative Kosten", "pos", "Gering (Buchungsverkehr)", "neg", "Hoch (physische Logistik)"],
                    ["CCP-Tauglichkeit", "neg", "Nein", "neu", "Bedingt (Lieferverpflichtung)"],
                    ["Settlement-Geschwindigkeit", "pos", "T+0 (elektronisch)", "neg", "T+2 bis T+5 (Tresorlogistik)"],
                  ].map(([crit, t2, v2, t3, v3], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border2)", background: i % 2 === 0 ? "var(--dark3)" : "var(--dark2)" }}>
                      <td style={{ padding: ".7rem 1.2rem", color: "var(--cream2)", fontWeight: 500 }}>{crit}</td>
                      <td style={{ padding: ".7rem 1.2rem", color: t2 === "neg" ? "#c07060" : t2 === "pos" ? "#7aab7a" : "var(--cream3)" }}>{v2}</td>
                      <td style={{ padding: ".7rem 1.2rem", color: t3 === "neg" ? "#c07060" : t3 === "pos" ? "#7aab7a" : "var(--cream3)" }}>{v3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Drei Säulen der PGI-Struktur ── */}
            <p style={{ fontFamily: "var(--sc)", fontSize: ".7rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: "1.2rem" }}>Drei Säulen der PGI-Struktur</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.4rem", marginBottom: "2.8rem" }}>
              {[
                { icon: "⚖", label: "Rechtliche Fundierung", items: ["Eigentumsrecht (kein Verwahrungsvertrag)", "Insolvenzfestigkeit: Gold außerhalb der Insolvenzmasse", "Fractional Ownership nach Schweizer ZGB Art. 646 ff.", "Zuordnung zu LBMA-Barren mit Seriennummern"] },
                { icon: "⚡", label: "Operative Umsetzung", items: ["Book-Entry-System: Elektronische Übertragung", "Kein physischer Transfer der Barren", "Instant Settlement: T+0 für Ownership Transfer", "Exaktes Collateral-Sizing ohne Bar-Breaking"] },
                { icon: "✓", label: "Regulatorische Konformität", items: ["CCP Initial Margin-fähig (EMIR / UMR)", "Basel III Tier 1: 0 % RWA auf Goldwert", "HQLA-Status: Potenzial für LCR-Anerkennung", "MiFID II transparent: Direkte Asset Ownership"] },
              ].map(({ icon, label, items }, i) => (
                <div key={i} style={{ background: "var(--dark4)", border: "1px solid var(--border)", borderTop: "2px solid var(--gold3)", padding: "1.6rem 1.3rem" }}>
                  <div style={{ fontSize: "1.3rem", color: "var(--gold)", marginBottom: ".6rem" }}>{icon}</div>
                  <p style={{ fontFamily: "var(--sc)", fontSize: ".7rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold2)", fontWeight: 600, marginBottom: ".9rem" }}>{label}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {items.map((item, j) => (
                      <li key={j} style={{ fontSize: ".78rem", color: "var(--cream3)", lineHeight: 1.65, paddingLeft: ".9rem", position: "relative", marginBottom: ".45rem" }}>
                        <span style={{ position: "absolute", left: 0, color: "var(--gold3)" }}>·</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* ── Settlement-Vergleich ── */}
            <div style={{ background: "var(--dark3)", border: "1px solid var(--border)", padding: "2rem 2rem", marginBottom: "2.5rem" }}>
              <p style={{ fontFamily: "var(--sc)", fontSize: ".7rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, textAlign: "center", marginBottom: "1.8rem" }}>Settlement-Vergleich: PGI vs. Traditional Allocated</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                <div>
                  <p style={{ fontFamily: "var(--sc)", fontSize: ".68rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#7aab7a", fontWeight: 600, marginBottom: ".9rem", paddingBottom: ".5rem", borderBottom: "1px solid rgba(122,171,122,0.22)" }}>PGI: T+0 Electronic Settlement</p>
                  {["Collateral Call empfangen", "PGI-Register aktualisiert (elektronisch)", "Ownership Transfer bestätigt", "CCP Margin-Anforderung erfüllt"].map((step, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: ".7rem", marginBottom: ".65rem" }}>
                      <span style={{ minWidth: "1.3rem", height: "1.3rem", borderRadius: "50%", background: "rgba(122,171,122,0.12)", border: "1px solid rgba(122,171,122,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".6rem", color: "#7aab7a", fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                      <span style={{ fontSize: ".8rem", color: "var(--cream3)", lineHeight: 1.5 }}>{step}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: ".9rem", background: "rgba(122,171,122,0.08)", border: "1px solid rgba(122,171,122,0.18)", padding: ".55rem 1rem", textAlign: "center", fontSize: ".76rem", color: "#7aab7a", fontWeight: 600 }}>Gesamt: wenige Minuten</div>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--sc)", fontSize: ".68rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#c07060", fontWeight: 600, marginBottom: ".9rem", paddingBottom: ".5rem", borderBottom: "1px solid rgba(192,112,96,0.22)" }}>Allocated: T+2 bis T+5 Physical</p>
                  {["Collateral Call empfangen", "Vault-Zugang organisieren", "Physical Barren identifizieren", "Transport / Versicherung arrangieren", "Chain-of-Custody Dokumentation", "Delivery & Confirmation"].map((step, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: ".7rem", marginBottom: ".65rem" }}>
                      <span style={{ minWidth: "1.3rem", height: "1.3rem", borderRadius: "50%", background: "rgba(192,112,96,0.1)", border: "1px solid rgba(192,112,96,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".6rem", color: "#c07060", fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                      <span style={{ fontSize: ".8rem", color: "var(--cream3)", lineHeight: 1.5 }}>{step}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: ".9rem", background: "rgba(192,112,96,0.08)", border: "1px solid rgba(192,112,96,0.18)", padding: ".55rem 1rem", textAlign: "center", fontSize: ".76rem", color: "#c07060", fontWeight: 600 }}>Gesamt: 2–5 Geschäftstage</div>
                </div>
              </div>
            </div>

            {/* ── Quellennachweis ── */}
            <div style={{ borderLeft: "3px solid var(--gold3)", background: "var(--dark3)", padding: "1.3rem 1.6rem" }}>
              <p style={{ fontFamily: "var(--sc)", fontSize: ".68rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: ".5rem" }}>Quellennachweis</p>
              <p style={{ fontSize: ".8rem", color: "var(--cream3)", lineHeight: 1.75 }}>
                <strong style={{ color: "var(--cream2)" }}>World Gold Council / Linklaters (Januar 2025):</strong> <em>„Gold as High-Quality Liquid Assets – Legal and Operational Frameworks for Institutional Markets"</em> — Das Whitepaper dokumentiert erste Pilotprojekte bei CCPs (CME, Eurex) und identifiziert PGI-Strukturen als regulatorisch bevorzugten Standard für Gold Collateral.
              </p>
            </div>
          </div>

          <div className="gold-rule reveal" style={{ margin: "2rem 0 3rem" }} />

          <div className="reveal" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", marginBottom: "3rem" }}>
            <svg viewBox="0 0 860 340" xmlns="http://www.w3.org/2000/svg"
              style={{ width: "100%", maxWidth: "860px", display: "block", margin: "0 auto" }}
              fontFamily="'Commissioner',system-ui,sans-serif">
              <defs>
                <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#c4954a" opacity=".7" />
                </marker>
                <marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#ede8dc" opacity=".4" />
                </marker>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <rect width="860" height="340" fill="#0a0906" rx="6" />
              <rect x="1" y="1" width="858" height="338" fill="none" stroke="#c4954a" strokeWidth=".5" rx="6" opacity=".12" />
              <rect x="294" y="100" width="272" height="148" rx="6" fill="rgba(196,149,74,0.04)" stroke="#c4954a" strokeWidth=".6" opacity=".5" />
              <text x="430" y="94" textAnchor="middle" fill="#c4954a" fontSize="8" letterSpacing=".14em" opacity=".55">SWISS ARROWS — COLLATERAL AGENT</text>
              <rect x="60" y="100" width="168" height="148" rx="6" fill="#141310" stroke="#c4954a" strokeWidth="1" />
              <rect x="60" y="100" width="168" height="3" rx="2" fill="#c4954a" />
              <text x="144" y="122" textAnchor="middle" fill="#c4954a" fontSize="9" fontWeight="600" letterSpacing=".08em">KUNDE</text>
              <text x="144" y="140" textAnchor="middle" fill="#ede8dc" fontSize="8.5" opacity=".8">Physisches Gold</text>
              <text x="144" y="157" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">Depot beim Custody-Partner</text>
              <text x="144" y="173" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">Versicherung: Kooperativa</text>
              <text x="144" y="189" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">Vienna Insurance Group</text>
              <text x="144" y="208" textAnchor="middle" fill="#7aad7a" fontSize="8" opacity=".85">● Onboarding 2–5 Tage</text>
              <text x="144" y="222" textAnchor="middle" fill="#7aad7a" fontSize="8" opacity=".85">● LTV bis 80 %</text>
              <rect x="314" y="116" width="232" height="116" rx="4" fill="#1c1a16" stroke="#c4954a" strokeWidth=".8" />
              <text x="430" y="140" textAnchor="middle" fill="#c4954a" fontSize="9.5" fontWeight="700" letterSpacing=".08em">WARRANT / PGI</text>
              <line x1="345" y1="150" x2="515" y2="150" stroke="#c4954a" strokeWidth=".4" opacity=".3" />
              <text x="430" y="167" textAnchor="middle" fill="#ede8dc" fontSize="8" opacity=".8">Evidenz im eigenen Register</text>
              <text x="430" y="183" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">oder CDCP Prag</text>
              <text x="430" y="199" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">LBMA PM Fix · täglich bewertet</text>
              <text x="430" y="215" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">Insolvenzfern · segregiert</text>
              <rect x="572" y="100" width="228" height="148" rx="6" fill="#141310" stroke="#c4954a" strokeWidth="1" />
              <rect x="572" y="100" width="228" height="3" rx="2" fill="#c4954a" />
              <text x="686" y="122" textAnchor="middle" fill="#c4954a" fontSize="9" fontWeight="600" letterSpacing=".08em">BANK / KREDITGEBER</text>
              <text x="686" y="140" textAnchor="middle" fill="#ede8dc" fontSize="8.5" opacity=".8">Kein Gold-Operationsrisiko</text>
              <text x="686" y="157" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">Kein Kontakt mit physischem Gold</text>
              <text x="686" y="173" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">Stellt Kredit aus · hält Warrant</text>
              <text x="686" y="188" textAnchor="middle" fill="#c8bfa8" fontSize="8.5" opacity=".7">Kein Gold-Operationsrisiko</text>
              <text x="686" y="207" textAnchor="middle" fill="#7aad7a" fontSize="8" opacity=".8">◎ Sauberes P&amp;L</text>
              <text x="686" y="221" textAnchor="middle" fill="#7aad7a" fontSize="8" opacity=".8">◎ T+2 Realisierung</text>
              <text x="686" y="235" textAnchor="middle" fill="#7aad7a" fontSize="8" opacity=".8">◎ RWA 0–20 % (Basel)</text>
              <rect x="296" y="310" width="188" height="22" rx="4" fill="rgba(196,149,74,0.08)" stroke="rgba(196,149,74,0.25)" strokeWidth=".8" />
              <text x="390" y="325" textAnchor="middle" fill="#c8bfa8" fontSize="8.5" opacity=".75">LBMA-Partner · CME/LPMCL · T+2 Liquidation</text>
              <path d="M168,152 L294,152" stroke="#c4954a" strokeWidth="1.2" markerEnd="url(#arr)" fill="none" opacity=".7" />
              <text x="231" y="144" textAnchor="middle" fill="#c4954a" fontSize="8" opacity=".85">Gold + Antrag</text>
              <path d="M484,152 L574,152" stroke="#c4954a" strokeWidth="1.2" markerEnd="url(#arr)" fill="none" opacity=".7" />
              <text x="529" y="144" textAnchor="middle" fill="#c4954a" fontSize="8" opacity=".85">Warrant</text>
              <path d="M576,195 L390,195 Q310,195 210,195 L170,195" stroke="#ede8dc" strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#arr2)" fill="none" opacity=".4" />
              <text x="370" y="187" textAnchor="middle" fill="#ede8dc" fontSize="8" opacity=".5">Kredit an Kunden</text>
              <path d="M390,280 L390,308" stroke="#c4954a" strokeWidth="1" strokeDasharray="3,3" markerEnd="url(#arr)" fill="none" opacity=".45" />
              <text x="440" y="300" textAnchor="start" fill="#c8bfa8" fontSize="7.5" opacity=".6">Ausfall → Exit</text>
            </svg>
          </div>

          <p className="cat-divider reveal">A — Bilateral OTC Collateral Services</p>
          <div className="prod-grid reveal">
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge unique">Institutional</span>
              <p className="pc-tag">Gold Margining · OTC Counterparties</p>
              <p className="pc-name">Gold OTC<br />Margining</p>
              <p className="pc-desc">Gold-Margining für ausgewählte bilaterale Gegenparteien: physisches LBMA-Gold als Sicherheit für OTC-Derivate-Positionen ohne physische Segregation oder Tresortransfer. Kompatibel mit EU/UK EMIR Uncleared Margin Rules. Basis: PGI-Struktur als „Thing in Action" — elektronisch übertragbar, insolvenzfern vom Verwahrer.</p>
            </div>
            <div className="prod-card">
              <span className="pc-badge">Optimierung</span>
              <p className="pc-tag">Cheapest-to-Deliver Collateral</p>
              <p className="pc-name">Collateral<br />Optimization Engine</p>
              <p className="pc-desc">Intelligente Substitution zwischen Barmitteln, US-Staatsanleihen und physischem Gold — automatische Auswahl der kostengünstigsten verfügbaren Sicherheit für jede Margin-Obligation. Integration mit Dealer Commander für Echtzeit-Bewertung und Portfolio-Optimierung.</p>
            </div>
          </div>

          <p className="cat-divider reveal">B — Triparty &amp; Custody-Enabled Collateral</p>
          <div className="prod-grid reveal">
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge unique">Kein Tresortransfer</span>
              <p className="pc-tag">Triparty Custody · CCP &amp; FMI</p>
              <p className="pc-name">Triparty Gold<br />Custody</p>
              <p className="pc-desc">Custody-Bedingungen, die ein Sicherheiteninteresse an physischem Gold ohne physische Bewegung der Barren ermöglichen. Das Gold bleibt im Tresor — das Sicherheiteninteresse wird über ein Warrant-Instrument oder PGI-Struktur übertragen. Kompatibel mit CCP-Clearing (Initial Margin, Default Fund) und FMI-Anforderungen.</p>
            </div>
            <div className="prod-card">
              <span className="pc-badge">Legal Pack</span>
              <p className="pc-tag">Treasury &amp; Risk Teams</p>
              <p className="pc-name">Collateral<br />Legal &amp; Reporting Pack</p>
              <p className="pc-desc">Vollständiges juristisches und operatives Paket für Treasury- und Risk-Teams: tägliche Bewertungsreporte nach LBMA PM Fix, Margin-Call-Dokumentation, Trigger-Protokoll (LTV-Schwellen), Legal Opinion zu anwendbarem Recht (CZ/SK/UK/CH), Auditpfad für Regulatoren, ISDA-kompatible Sicherheitenvereinbarungen.</p>
            </div>
          </div>

          <p className="cat-divider reveal">C — Gold Financing</p>
          <div className="prod-grid reveal">
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge unique">Intraday Liquidity</span>
              <p className="pc-tag">Lombard · Credit Lines</p>
              <p className="pc-name">Gold Credit<br />Lines</p>
              <p className="pc-desc">Lombard- und Kreditlinien gegen transparent evidiertes physisches Gold: digitale Evidenz im eigenen Register oder via CDCP, tägliche Bewertung, automatisches Margin Management. Zielgruppe: Institutionelle Goldhalter, die kurzfristige Liquidität ohne Verkauf benötigen.</p>
            </div>
            <div className="prod-card">
              <span className="pc-badge">Intraday</span>
              <p className="pc-tag">Digital Metal Collateral</p>
              <p className="pc-name">Intraday Gold<br />Liquidity Lines</p>
              <p className="pc-desc">Intraday-Liquiditätslinien gegen digital evidiertes Metall-Kollateral — atomare Aktivierung und Rückgabe innerhalb des Handelstages. Adressiert den im WGC/Linklaters-Whitepaper identifizierten Use Case: frictionless gold, instant collateralisation, atomic settlement.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── ÖKOSYSTEM ── */}
      <section id="zahlen" className="section" style={{ background: "var(--dark)" }}>
        <div className="section-inner">
          <div className="reveal">
            <p className="eyebrow">Das integrierte Ökosystem</p>
            <h2 className="sh">Alle Produkte —<br /><em>eine gemeinsame Engine</em></h2>
            <p className="sub">Alle Produkte teilen dieselbe Pricing- und Hedging-Engine. Was Gold Bank für Einlagen lernt, verbessert die Kreditbewertung. Proprietär — nicht replizierbar.</p>
          </div>

          <div className="reveal" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", margin: "2rem 0" }}>
            <svg viewBox="0 0 1400 900" xmlns="http://www.w3.org/2000/svg"
              style={{ width: "100%", maxWidth: "1200px", display: "block", margin: "0 auto" }}
              fontFamily="'Commissioner',system-ui,sans-serif">
              <defs>
                <marker id="ec-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3z" fill="#c4954a" opacity=".6" />
                </marker>
                <marker id="ec-arr-g" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3z" fill="#7aab7a" opacity=".6" />
                </marker>
              </defs>

              {/* Background */}
              <rect width="1400" height="900" fill="#080806" rx="8" />
              <rect x="1" y="1" width="1398" height="898" fill="none" stroke="#c4954a" strokeWidth=".5" rx="8" opacity=".15" />

              {/* Grid lines */}
              <line x1="0" y1="150" x2="1400" y2="150" stroke="#c4954a" strokeWidth=".4" strokeDasharray="4,4" opacity=".1" />
              <line x1="0" y1="310" x2="1400" y2="310" stroke="#c4954a" strokeWidth=".4" strokeDasharray="4,4" opacity=".08" />
              <line x1="0" y1="545" x2="1400" y2="545" stroke="#c4954a" strokeWidth=".4" strokeDasharray="4,4" opacity=".08" />

              {/* Title */}
              <text x="700" y="50" fontSize="22" fontWeight="700" fill="#ede8dc" textAnchor="middle" letterSpacing=".06em">REVESTIUM GOLD GROUP ECOSYSTEM</text>
              <text x="700" y="74" fontSize="11" fill="#8a8278" textAnchor="middle" letterSpacing=".16em">RETAIL · INFRASTRUCTURE · INSTITUTIONAL</text>

              {/* Tier column labels */}
              <text x="233" y="122" fontSize="10" fontWeight="600" fill="#c4954a" textAnchor="middle" letterSpacing=".16em">RETAIL</text>
              <text x="700" y="122" fontSize="10" fontWeight="600" fill="#c4954a" textAnchor="middle" letterSpacing=".16em">CORE INFRASTRUCTURE</text>
              <text x="1167" y="122" fontSize="10" fontWeight="600" fill="#7aab7a" textAnchor="middle" letterSpacing=".16em">INSTITUTIONAL</text>

              {/* ── LEFT: RETAIL ── */}

              {/* Gold Bank (wide) */}
              <rect x="80" y="158" width="306" height="118" rx="6" fill="#141310" stroke="#c4954a" strokeWidth="1.5" />
              <rect x="80" y="158" width="306" height="4" rx="3" fill="#c4954a" />
              <text x="233" y="183" fontSize="14" fontWeight="700" fill="#c4954a" textAnchor="middle" letterSpacing=".08em">Gold Bank</text>
              <text x="233" y="199" fontSize="9.5" fill="#ede8dc" textAnchor="middle" opacity=".8">CZ · SK · EU</text>
              <text x="98" y="218" fontSize="9" fill="#c8bfa8" textAnchor="start">• 3,5 Bonus p.a. in physischem Gold</text>
              <text x="98" y="234" fontSize="9" fill="#c8bfa8" textAnchor="start">• iOS · Android · Web</text>
              <text x="98" y="252" fontSize="9" fill="#7aab7a" textAnchor="start">● Live</text>

              {/* DIGI GOLD */}
              <rect x="80" y="296" width="140" height="108" rx="6" fill="#141310" stroke="#c4954a" strokeWidth="1" opacity=".9" />
              <rect x="80" y="296" width="140" height="3" rx="2" fill="#c4954a" opacity=".7" />
              <text x="150" y="319" fontSize="12" fontWeight="700" fill="#c4954a" textAnchor="middle" letterSpacing=".07em">DIGI GOLD</text>
              <text x="150" y="333" fontSize="9" fill="#ede8dc" textAnchor="middle" opacity=".8">Savings</text>
              <text x="95" y="351" fontSize="8.5" fill="#c8bfa8" textAnchor="start">• Ab 50 EUR/Monat</text>
              <text x="95" y="365" fontSize="8.5" fill="#c8bfa8" textAnchor="start">• 100% physisch LBMA</text>
              <text x="95" y="379" fontSize="8.5" fill="#c8bfa8" textAnchor="start">• DCA-Dynamisierung</text>

              {/* Gold Card */}
              <rect x="246" y="296" width="140" height="108" rx="6" fill="#141310" stroke="#c4954a" strokeWidth="1" opacity=".9" />
              <rect x="246" y="296" width="140" height="3" rx="2" fill="#c4954a" opacity=".7" />
              <text x="316" y="319" fontSize="12" fontWeight="700" fill="#c4954a" textAnchor="middle" letterSpacing=".07em">Gold Card</text>
              <text x="316" y="333" fontSize="9" fill="#ede8dc" textAnchor="middle" opacity=".8">Mastercard · täglich</text>
              <text x="261" y="351" fontSize="8.5" fill="#c8bfa8" textAnchor="start">• Gold als Währung</text>
              <text x="261" y="365" fontSize="8.5" fill="#c8bfa8" textAnchor="start">• 0 EU-Konkurrenten</text>
              <text x="261" y="379" fontSize="8.5" fill="#c4954a" textAnchor="start">◉ Rollout</text>

              {/* Edelmetalle */}
              <rect x="80" y="424" width="306" height="100" rx="6" fill="#141310" stroke="#c4954a" strokeWidth="1" opacity=".85" />
              <rect x="80" y="424" width="306" height="3" rx="2" fill="#c4954a" opacity=".5" />
              <text x="233" y="447" fontSize="12" fontWeight="700" fill="#c4954a" textAnchor="middle" letterSpacing=".07em">Edelmetalle</text>
              <text x="233" y="461" fontSize="9" fill="#ede8dc" textAnchor="middle" opacity=".8">Retail &amp; Wholesale</text>
              <text x="98" y="478" fontSize="8.5" fill="#c8bfa8" textAnchor="start">• 150+ Produkte · LBMA Good Delivery</text>
              <text x="98" y="492" fontSize="8.5" fill="#c8bfa8" textAnchor="start">• Kunstbarren · Bespoke</text>
              <text x="98" y="508" fontSize="8.5" fill="#7aab7a" textAnchor="start">● Live</text>

              {/* ── CENTER: CORE INFRASTRUCTURE ── */}

              {/* AUROM – Central Hub */}
              <rect x="547" y="228" width="306" height="165" rx="8" fill="#1c1a16" stroke="#c4954a" strokeWidth="2" />
              <rect x="547" y="228" width="306" height="5" rx="4" fill="#c4954a" />
              <text x="700" y="258" fontSize="17" fontWeight="700" fill="#c4954a" textAnchor="middle" letterSpacing=".1em">AUROM</text>
              <text x="700" y="276" fontSize="10.5" fill="#ede8dc" textAnchor="middle" opacity=".85">Dealer Commander</text>
              <line x1="567" y1="286" x2="833" y2="286" stroke="#c4954a" strokeWidth=".4" opacity=".25" />
              <text x="700" y="305" fontSize="9.5" fill="#ede8dc" textAnchor="middle" opacity=".85">AI Treasury · SARIMA</text>
              <text x="700" y="321" fontSize="9" fill="#c8bfa8" textAnchor="middle" opacity=".75">CME Hedging · OTC</text>
              <text x="700" y="337" fontSize="9" fill="#c8bfa8" textAnchor="middle" opacity=".75">Net ROI +23 %</text>
              <text x="700" y="356" fontSize="9" fontWeight="600" fill="#7aab7a" textAnchor="middle" opacity=".9">● Live · proprietär</text>

              {/* GOLD D10 */}
              <rect x="547" y="420" width="145" height="108" rx="6" fill="#1c1a16" stroke="#c4954a" strokeWidth="1.2" />
              <rect x="547" y="420" width="145" height="3" rx="2" fill="#c4954a" opacity=".8" />
              <text x="619" y="444" fontSize="12" fontWeight="700" fill="#c4954a" textAnchor="middle" letterSpacing=".07em">GOLD D10</text>
              <text x="619" y="458" fontSize="9" fill="#ede8dc" textAnchor="middle" opacity=".8">Partizipativer Modell</text>
              <text x="562" y="475" fontSize="8.5" fill="#c8bfa8" textAnchor="start">• Secured Gold Bonds</text>
              <text x="562" y="489" fontSize="8.5" fill="#c8bfa8" textAnchor="start">• 10 diversifizierte Pos.</text>
              <text x="562" y="505" fontSize="8" fill="#c4954a" textAnchor="start">◉ Rollout</text>

              {/* ARGUS */}
              <rect x="708" y="420" width="145" height="108" rx="6" fill="#131a13" stroke="#7aab7a" strokeWidth="1.2" />
              <rect x="708" y="420" width="145" height="3" rx="2" fill="#7aab7a" opacity=".7" />
              <text x="780" y="444" fontSize="12" fontWeight="700" fill="#7aab7a" textAnchor="middle" letterSpacing=".07em">ARGUS</text>
              <text x="780" y="458" fontSize="9" fill="#ede8dc" textAnchor="middle" opacity=".8">AML/KYC Platform</text>
              <text x="723" y="475" fontSize="8.5" fill="#a7c8a7" textAnchor="start">• FATF · AML-DS · DSGVO</text>
              <text x="723" y="489" fontSize="8.5" fill="#a7c8a7" textAnchor="start">• AI OSINT · Risk Scoring</text>
              <text x="723" y="505" fontSize="8" fill="#7aab7a" textAnchor="start">◉ Rollout</text>

              {/* ── RIGHT: INSTITUTIONAL ── */}

              {/* REVESTIUM AG + PGI wrapper */}
              <rect x="1014" y="155" width="306" height="158" rx="8" fill="#1c1a16" stroke="#c4954a" strokeWidth="1.8" strokeDasharray="6,4" />
              <rect x="1014" y="155" width="306" height="4" rx="3" fill="#c4954a" opacity=".4" />
              <text x="1167" y="182" fontSize="15" fontWeight="700" fill="#c4954a" textAnchor="middle" letterSpacing=".08em">REVESTIUM AG</text>
              <text x="1167" y="198" fontSize="10" fill="#ede8dc" textAnchor="middle" opacity=".8">Collateral Agent</text>
              {/* PGI nested */}
              <rect x="1034" y="210" width="266" height="82" rx="5" fill="#131a13" stroke="#7aab7a" strokeWidth="1.5" />
              <text x="1167" y="232" fontSize="12" fontWeight="700" fill="#7aab7a" textAnchor="middle" letterSpacing=".06em">Gold as Collateral · PGI</text>
              <text x="1050" y="250" fontSize="8.5" fill="#a7c8a7" textAnchor="start">• OTC Margining · Intraday · Wholesale Digital Gold</text>
              <text x="1050" y="266" fontSize="8.5" fill="#a7c8a7" textAnchor="start">• WGC · Linklaters Framework</text>
              <text x="1050" y="282" fontSize="8" fill="#7aab7a" textAnchor="start" opacity=".85">◉ Infrastructure Ready 2025</text>

              {/* Gold Repo */}
              <rect x="1014" y="333" width="145" height="105" rx="6" fill="#131a13" stroke="#7aab7a" strokeWidth="1.2" />
              <rect x="1014" y="333" width="145" height="3" rx="2" fill="#7aab7a" opacity=".7" />
              <text x="1086" y="356" fontSize="12" fontWeight="700" fill="#7aab7a" textAnchor="middle" letterSpacing=".07em">Gold Repo</text>
              <text x="1086" y="370" fontSize="9" fill="#ede8dc" textAnchor="middle" opacity=".75">Kurzfristiger Goldkredit</text>
              <text x="1030" y="387" fontSize="8.5" fill="#a7c8a7" textAnchor="start">• 1–12 Monate · LTV 80%</text>
              <text x="1030" y="401" fontSize="8.5" fill="#a7c8a7" textAnchor="start">• T+2 · 99,5% LBMA</text>
              <text x="1030" y="418" fontSize="8" fill="#7aab7a" textAnchor="start">◉ Ready to launch</text>

              {/* Gold Hypo */}
              <rect x="1175" y="333" width="145" height="105" rx="6" fill="#131a13" stroke="#7aab7a" strokeWidth="1.2" />
              <rect x="1175" y="333" width="145" height="3" rx="2" fill="#7aab7a" opacity=".7" />
              <text x="1247" y="356" fontSize="12" fontWeight="700" fill="#7aab7a" textAnchor="middle" letterSpacing=".07em">Gold Hypo</text>
              <text x="1247" y="370" fontSize="9" fill="#ede8dc" textAnchor="middle" opacity=".75">Goldbes. Langzeitkredite</text>
              <text x="1190" y="387" fontSize="8.5" fill="#a7c8a7" textAnchor="start">• 5–20 Jahre</text>
              <text x="1190" y="401" fontSize="8.5" fill="#a7c8a7" textAnchor="start">• Collateral Agent Modell</text>
              <text x="1190" y="418" fontSize="8" fill="#7aab7a" textAnchor="start">◉ Ready to launch</text>

              {/* ── INFRASTRUCTURE LAYER ── */}
              <rect x="420" y="748" width="560" height="114" rx="6" fill="#111008" stroke="#c4954a" strokeWidth="1" opacity=".65" />
              <rect x="420" y="748" width="560" height="3" rx="2" fill="#c4954a" opacity=".3" />
              <text x="700" y="774" fontSize="13" fontWeight="700" fill="#c4954a" textAnchor="middle" letterSpacing=".14em">INFRASTRUCTURE</text>
              <line x1="440" y1="782" x2="960" y2="782" stroke="#c4954a" strokeWidth=".4" opacity=".2" />
              <text x="460" y="802" fontSize="10" fill="#8a8278" textAnchor="start">• LBMA Good Delivery Refinery</text>
              <text x="460" y="820" fontSize="10" fill="#8a8278" textAnchor="start">• CME Clearing Member (Prime Broker)</text>
              <text x="460" y="838" fontSize="10" fill="#8a8278" textAnchor="start">• WGC/Linklaters Framework</text>

              {/* ── CONNECTION LINES ── */}

              {/* Retail → AUROM */}
              <path d="M 386 350 L 547 315" stroke="#c4954a" strokeWidth="1.5" fill="none" strokeDasharray="5,4" markerEnd="url(#ec-arr)" opacity=".4" />
              <text x="448" y="322" fontSize="8.5" fill="#8a8278" transform="rotate(-13 448 322)">Pricing · Hedging</text>

              {/* AUROM → REVESTIUM/PGI */}
              <path d="M 853 313 L 1014 243" stroke="#c4954a" strokeWidth="2" fill="none" markerEnd="url(#ec-arr)" opacity=".55" />
              <text x="930" y="272" fontSize="8.5" fill="#8a8278">PGI · Collateral</text>

              {/* AUROM → Infrastructure */}
              <path d="M 700 393 L 700 748" stroke="#c4954a" strokeWidth="1.2" fill="none" strokeDasharray="5,4" markerEnd="url(#ec-arr)" opacity=".28" />
              <text x="712" y="590" fontSize="8.5" fill="#8a8278">Settlement</text>

              {/* PGI → Gold Repo */}
              <path d="M 1167 313 L 1086 333" stroke="#7aab7a" strokeWidth="1.5" fill="none" strokeDasharray="4,3" opacity=".5" />

              {/* PGI → Gold Hypo */}
              <path d="M 1167 313 L 1247 333" stroke="#7aab7a" strokeWidth="1.5" fill="none" strokeDasharray="4,3" opacity=".5" />

              {/* AUROM → D10 */}
              <path d="M 700 393 L 619 420" stroke="#c4954a" strokeWidth="1.2" fill="none" strokeDasharray="4,3" markerEnd="url(#ec-arr)" opacity=".4" />

              {/* AUROM → ARGUS */}
              <path d="M 700 393 L 780 420" stroke="#7aab7a" strokeWidth="1.2" fill="none" strokeDasharray="4,3" markerEnd="url(#ec-arr-g)" opacity=".4" />

              {/* Legend */}
              <line x1="440" y1="878" x2="472" y2="878" stroke="#c4954a" strokeWidth="1.2" opacity=".7" />
              <text x="478" y="882" fontSize="9" fill="#8a8278">Live / Ready to launch</text>
              <line x1="636" y1="878" x2="668" y2="878" stroke="#c4954a" strokeWidth="1.5" markerEnd="url(#ec-arr)" opacity=".6" />
              <text x="674" y="882" fontSize="9" fill="#8a8278">Datenfluss / Integration</text>
            </svg>
          </div>

          <div className="prod-grid reveal" style={{ gridTemplateColumns: "repeat(3,1fr)", marginTop: ".5rem" }}>
            <div className="prod-card">
              <p className="pc-tag">Beide Seiten der Bilanz</p>
              <p className="pc-name">Einlagen<br />&amp; Kredite</p>
              <p className="pc-desc">Gold Bank nimmt Einlagen an — Gold Hypo und Repo vergeben Kredite dagegen. Dasselbe physische Gold arbeitet auf beiden Seiten gleichzeitig. Kein anderes Nicht-Bankinstitut in Europa kann das.</p>
            </div>
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <p className="pc-tag">Das Herz der Infrastruktur</p>
              <p className="pc-name">AUROM als<br />gemeinsame Engine</p>
              <p className="pc-desc">Alle Produkte teilen dieselbe Pricing- und Hedging-Engine. Was Gold Bank für Einlagen lernt, verbessert die Kreditbewertung. Was Dealer Commander für Repo hedgt, optimiert D10. Proprietär — nicht replizierbar.</p>
            </div>
            <div className="prod-card">
              <p className="pc-tag">Die logische Erweiterung</p>
              <p className="pc-name">Gold as Collateral<br />als nächster Schritt</p>
              <p className="pc-desc">PGI, Triparty Custody, OTC Margining — das ist die institutionelle Skalierung der Infrastruktur, die wir bereits betreiben. Der Markt wartet. Die Infrastruktur ist bereit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── D&B RATING ── */}
      <section id="rating" className="section" style={{ background: "var(--dark2)", borderTop: "1px solid var(--border2)" }}>
        <div className="section-inner">
          <div className="reveal">
            <p className="eyebrow">Bonität &amp; Vertrauen</p>
            <h2 className="sh">Dun &amp; Bradstreet<br /><em>Independent Credit Assessment</em></h2>
          </div>

          {/* Trust card */}
          <div className="reveal d1" style={{ border: "1px solid var(--border2)", position: "relative", overflow: "hidden" }}>

            {/* left gold accent bar */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: "linear-gradient(180deg,var(--gold2),var(--gold3))" }} />

            {/* bottom gold rule */}
            <div style={{ position: "absolute", bottom: 0, left: "3.5rem", right: "3.5rem", height: "1px", background: "linear-gradient(90deg,transparent,var(--gold3),transparent)" }} />

            <div style={{ padding: "3rem 3.5rem 3.5rem" }}>

              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2.5rem", paddingBottom: "2rem", borderBottom: "1px solid var(--border2)" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.55rem", fontWeight: 400, color: "#e8e0d0", letterSpacing: ".02em", lineHeight: 1.2, marginBottom: ".5rem" }}>Independent Credit Assessment</h3>
                  <p style={{ fontSize: ".75rem", color: "#8a8278", letterSpacing: ".06em", lineHeight: 1.7, maxWidth: "360px" }}>REVESTIUM AG is independently rated by Dun &amp; Bradstreet — the global standard in commercial credit intelligence, trusted by over 90% of Fortune 500 companies.</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px", flexShrink: 0, marginLeft: "2rem" }}>
                  <span style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 600, color: "#cc2200", letterSpacing: ".05em" }}>D&amp;B</span>
                  <span style={{ fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase" as const, color: "#6a6260" }}>Dun &amp; Bradstreet</span>
                </div>
              </div>

              {/* KPI grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: "var(--border2)", border: "1px solid var(--border2)", marginBottom: "2.5rem" }}>
                <div style={{ background: "var(--dark)", padding: "1.6rem 1.4rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontFamily: "var(--sc)", fontSize: ".58rem", letterSpacing: ".2em", color: "var(--gold3)", fontWeight: 600 }}>D&amp;B Composite Rating</span>
                  <span style={{ fontFamily: "var(--serif)", fontSize: "2.8rem", fontWeight: 500, color: "var(--gold2)", lineHeight: 1, letterSpacing: ".02em" }}>O1</span>
                  <span style={{ fontSize: ".72rem", color: "#7a7268", lineHeight: 1.5, letterSpacing: ".03em" }}>Highest composite appraisal — reflects superior creditworthiness within the assessed class.</span>
                </div>
                <div style={{ background: "var(--dark)", padding: "1.6rem 1.4rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontFamily: "var(--sc)", fontSize: ".58rem", letterSpacing: ".2em", color: "var(--gold3)", fontWeight: 600 }}>Business Risk</span>
                  <span style={{ fontFamily: "var(--serif)", fontSize: "2.8rem", fontWeight: 500, color: "#2e7d5e", lineHeight: 1, letterSpacing: ".02em" }}>Low</span>
                  <span style={{ fontSize: ".72rem", color: "#7a7268", lineHeight: 1.5, letterSpacing: ".03em" }}>Consistently rated low risk across all monitored risk categories.</span>
                </div>
                <div style={{ background: "var(--dark)", padding: "1.6rem 1.4rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontFamily: "var(--sc)", fontSize: ".58rem", letterSpacing: ".2em", color: "var(--gold3)", fontWeight: 600 }}>Failure Score</span>
                  <span style={{ fontFamily: "var(--serif)", fontSize: "2.8rem", fontWeight: 500, color: "#2e7d5e", lineHeight: 1, letterSpacing: ".02em" }}>98<span style={{ fontSize: "1.2rem", color: "#5a5450" }}>/100</span></span>
                  <span style={{ fontSize: ".72rem", color: "#7a7268", lineHeight: 1.5, letterSpacing: ".03em" }}>98th percentile — near-lowest probability of business discontinuation in the D&amp;B global database.</span>
                </div>
              </div>

              {/* Trend bars */}
              <div style={{ marginBottom: "2.5rem" }}>
                <p style={{ fontFamily: "var(--sc)", fontSize: ".58rem", letterSpacing: ".2em", color: "var(--gold3)", fontWeight: 600, marginBottom: "1rem" }}>Risk Trajectory — 12-Month History</p>
                {[
                  { label: "12 months ago", width: "63%", score: "63", delay: ".1s" },
                  { label: "6 months ago",  width: "70%", score: "70", delay: ".2s" },
                  { label: "Current",        width: "98%", score: "98", delay: ".3s" },
                ].map(({ label, width, score, delay }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: ".6rem" }}>
                    <span style={{ fontSize: ".68rem", color: "#6a6260", width: "90px", textAlign: "right", letterSpacing: ".04em", flexShrink: 0 }}>{label}</span>
                    <div style={{ flex: 1, height: "4px", background: "rgba(255,255,255,0.07)", borderRadius: "2px", overflow: "hidden" }}>
                      <div className="dnb-bar-fill" style={{ width, animationDelay: delay }} />
                    </div>
                    <span style={{ fontSize: ".75rem", fontWeight: 600, color: "#c8bfa8", width: "26px", letterSpacing: ".04em" }}>{score}</span>
                  </div>
                ))}
                <p style={{ fontSize: ".68rem", color: "#4caf83", letterSpacing: ".08em", marginTop: ".9rem", display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ fontSize: ".9rem" }}>↑</span> Sustained improvement in D&amp;B Failure Score over 12 months
                </p>
              </div>

              {/* Footer */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1.75rem", borderTop: "1px solid var(--border2)" }}>
                <p style={{ fontSize: ".68rem", color: "#5a5450", letterSpacing: ".06em", lineHeight: 1.7 }}>
                  Rating issued by Dun &amp; Bradstreet · DUNS® registered entity<br />
                  Assessment based on independent commercial intelligence data
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, marginLeft: "2rem", border: "1px solid rgba(76,175,131,0.3)", padding: "5px 14px" }}>
                  <span className="dnb-dot" />
                  <span style={{ fontSize: ".68rem", letterSpacing: ".15em", textTransform: "uppercase" as const, color: "#4caf83", fontWeight: 600 }}>Verified · Active</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── IMPRESSUM ── */}
      <footer id="impressum" className="section imp-bg">
        <div className="section-inner">

          <div className="reveal" style={{ marginBottom: "4rem" }}>
            <p className="eyebrow">Strategie &amp; Ausblick</p>
            <h2 className="sh" style={{ fontSize: "1.8rem", marginBottom: "1.2rem" }}>Was sind unsere<br /><em>Pläne für die Zukunft?</em></h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", marginTop: "2rem" }}>
              <div>
                <p style={{ fontSize: ".9rem", color: "#e0d8c8", lineHeight: 1.82, textAlign: "justify", hyphens: "auto" }}>Langfristig werden regulatorische Entwicklungen, sich wandelnde ESG-Standards, Transparenz in der Lieferkette sowie die Digitalisierung von Handels- und Verwahrungsprozessen eine entscheidende Rolle spielen.</p>
              </div>
              <div>
                <p style={{ fontSize: ".9rem", color: "#e0d8c8", lineHeight: 1.82, textAlign: "justify", hyphens: "auto" }}>Dank unserer Mitgliedschaft im <strong style={{ color: "#fff" }}>International Precious Metal Institute</strong> und unserem Engagement bei der <strong style={{ color: "#fff" }}>LBMA</strong> sind wir Teil eines globalen Netzwerks, das aktiv Standards, den Dialog und langfristige Stabilität innerhalb des Edelmetall-Ökosystems gestaltet.</p>
              </div>
            </div>
            <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "3rem", flexWrap: "nowrap" }}>
              <img src="https://goldspot.cz/wxlpzswd_IPMI-50th-Logo-White.svg" alt="IPMI" style={{ height: "70px", width: "auto", opacity: .9, filter: "drop-shadow(0 0 8px rgba(196,149,74,0.25))" }} />
              <img src="https://goldspot.cz/Vizitka%20evropsk%C3%A1%208.5x5.5%20%20cm%20(3).png" alt="Vizitka" style={{ height: "70px", width: "auto", opacity: .9, filter: "drop-shadow(0 0 8px rgba(196,149,74,0.25))" }} />
              <img src="https://goldspot.cz/Primary-Logo-Gem-A-White-01-1024x468%20(1).jpg" alt="Gem-A" style={{ height: "50px", width: "auto", opacity: .9, filter: "drop-shadow(0 0 8px rgba(196,149,74,0.25))" }} />
            </div>
          </div>
          <p style={{ fontSize: ".9rem", color: "#e0d8c8", lineHeight: 1.82, textAlign: "justify", hyphens: "auto" }}>Wir stärken unsere operative Infrastruktur und die Anpassung an regulatorische Anforderungen. Gleichzeitig engagieren wir uns als vertrauenswürdiger Marktteilnehmer aktiv in Brancheninitiativen, fördern die Weiterbildung im Bereich physischer Edelmetalle und passen unsere Abläufe kontinuierlich an die LBMA-Standards an.</p>

          <div className="gold-rule reveal" style={{ marginBottom: "3.5rem" }} />

          <div className="reveal">
            <p className="eyebrow">Impressum</p>
            <p style={{ fontSize: ".8rem", color: "#8a8278", lineHeight: 1.7, marginBottom: "2rem" }}>Eigentümer und Betreiber dieser Website ist die REVESTIUM AG.</p>
          </div>

          <div className="imp-grid reveal">
            <div className="imp-block">
              <h4>REVESTIUM AG</h4>
              <address>Baarerstrasse 25<br />6300 Zug<br />Schweiz<br /><br />
                UID: <strong>CHE-383.245.411</strong><br />
                Tel.: +41 215 120 554<br /><br /><br />
                Verwaltungsratspräsidentin:<br />Mag. iur. Augustina F. Schiller,LLM.<br /><br />
                Director:<br /> Dr. iur. Marcus Altenburg
              </address>
            </div>
            <div className="imp-block">
              <h4>JURISCONSULT LTD</h4>
              <address>124 City Road<br />London, EC1V 2NX<br />United Kingdom<br /><br />
                Companies House: 12729220<br />
                UTR: 5076723030<br />
                Tel: +44 7704 494 137<br />
                LEI: 315700UZ1Y9WYP99U441<br />
                <span style={{ fontSize: ".75rem", color: "#8a8278" }}>SIC: 32120 · 46720 · 47770 · 64991</span>
              </address>
            </div>
            <div className="imp-block">
              <h4>SWISS GOLD DEPOSIT Ltd</h4>
              <address>Dublin<br />Irland<br /><br />
                The Black Church, St. Mary's Place, Dublin 7, D07 P4ax<br />
                Reg. Number 802415
              </address>
            </div>
            <div className="imp-block">
              <h4>JURISCONSULT LTD o.z.</h4>
              <address>Praha<br />Tschechische Republik<br /><br />
                IČ: 09913840<br />
                LEI: 315700343MOJGZ62NN31<br />
                Tel: +420 800 300 555
              </address>
            </div>
          </div>

          <div className="reveal" style={{ marginTop: "2.5rem", paddingTop: "2rem", borderTop: "1px solid var(--border2)" }}>
            <p style={{ fontFamily: "var(--sc)", fontSize: ".65rem", letterSpacing: ".18em", color: "var(--gold3)", marginBottom: "1.2rem" }}>Legal Notice</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
              <div>
                <p style={{ fontSize: ".82rem", color: "var(--cream3)", fontStyle: "italic", marginBottom: ".5rem" }}>Compliance and Anti-Money Laundering (AML) Policy</p>
                <p style={{ fontSize: ".82rem", color: "#b8b0a0", lineHeight: 1.8 }}>The company enters into business relationships and conducts transactions exclusively with partners based in the European Union, Switzerland, and the United Kingdom, which are considered low-risk jurisdictions under the Swiss Anti-Money Laundering Act (AMLA / GwG) and FATF assessments, given its full membership and implementation of international AML/CFT frameworks.</p>
                <p style={{ fontSize: ".82rem", color: "#b8b0a0", lineHeight: 1.8, marginTop: ".8rem" }}>The company strictly refrains from conducting business with natural or legal persons from high-risk third countries, as defined in European Commission Regulation (EU) 2016/1675 (as amended) and in the list of high-risk jurisdictions subject to a call for action issued by the FATF. In all its operations, REVESTIUM strictly adheres to these international compliance standards.</p>
              </div>
              <div>
                <p style={{ fontSize: ".82rem", color: "var(--cream3)", fontStyle: "italic", marginBottom: ".5rem" }}>Richtlinie zu Compliance und Geldwäschebekämpfung (AML)</p>
                <p style={{ fontSize: ".82rem", color: "#b8b0a0", lineHeight: 1.8 }}>Das Unternehmen geht Geschäftsbeziehungen ein und wickelt Transaktionen ausschließlich mit Partnern ab, die ihren Sitz in der Europäischen Union, der Schweiz und dem Vereinigten Königreich haben. Diese Länder gelten gemäß dem Schweizer Geldwäschereigesetz (GwG) und den Bewertungen der FATF als Länder mit geringem Risiko, da sie Vollmitglieder sind und die internationalen AML/CFT-Rahmenwerke umsetzen.</p>
                <p style={{ fontSize: ".82rem", color: "#b8b0a0", lineHeight: 1.8, marginTop: ".8rem" }}>Das Unternehmen verzichtet strikt auf Geschäfte mit natürlichen oder juristischen Personen aus Hochrisikoländern, wie sie in der Verordnung (EU) 2016/1675 der Europäischen Kommission (in der jeweils gültigen Fassung) und in der FATF-Liste der Hochrisikoländer, für die ein Handlungsaufruf vorliegt, definiert sind. Bei all seinen Geschäften hält sich REVESTIUM strikt an diese internationalen Compliance-Standards.</p>
              </div>
            </div>
          </div>

          <div className="imp-legal reveal">
            <p>©2026 REVESTIUM. All rights reserved. REVESTIUM is the trade name of Swizzen AG, registration number: CHE-383.245.411. Pursuant to notarial deed No. DB 39/2026 dated March 10, 2026, the company name is being changed to REVESTIUM AG; the update to the entry in the commercial register is currently in progress.</p>
            <p style={{ marginTop: "1rem" }}>©2026 REVESTIUM. Alle Rechte vorbehalten. REVESTIUM ist der Handelsname der Swizzen AG, Registrierungsnummer: CHE-383.245.411. Gemäß notarieller Urkunde Nr. DB 39/2026 vom 10. März 2026 wird der Firmenname in REVESTIUM AG geändert; die Aktualisierung des Eintrags im Handelsregister ist aktuell in Bearbeitung.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
