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

  const [activeMup, setActiveMup] = useState("deposit");

  function showMup(id: string) { setActiveMup(id); }

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
              <div className="timeline" style={{ marginTop: "2.5rem" }}>
                <div className="tl-item reveal d1"><div className="tl-year">2020</div><div className="tl-dot" /><div><p className="tl-h">Gründung der Rechtsstruktur</p><p className="tl-p">Gründung der Firma JURISCONSULT LTD (London) und Beginn des Aufbaus einer Marke für den Einzelhandel mit Edelmetallen.</p></div></div>
                <div className="tl-item reveal d2"><div className="tl-year">2021</div><div className="tl-dot" /><div><p className="tl-h">Gründung der Holding</p><p className="tl-p">Moje Zlato und Moje zlatnictví werden in die Unternehmensgruppe aufgenommen. Das Czech Assay Office vergibt das Hersteller- und Haftungszeichen.</p></div></div>
                <div className="tl-item reveal d3"><div className="tl-year">2023</div><div className="tl-dot" /><div><p className="tl-h">LBMA-Clearing &amp; Marktzugang</p><p className="tl-p">Zulassung als professionelle Gegenpartei für das Clearing-Mitglied LPMCL und Zugang zur Handelsstruktur der LBMA.</p></div></div>
                <div className="tl-item reveal d4"><div className="tl-year">2024</div><div className="tl-dot" /><div><p className="tl-h">Tschechische Nationalbank &amp; AUROM live</p><p className="tl-p">Vertragsabschluss mit der Tschechischen Nationalbank über den Verkauf und Vertrieb von Edelmetallen. Start des Treasury-Managementsystems AUROM und Dealer Commander.</p></div></div>
                <div className="tl-item reveal d4"><div className="tl-year">2025</div><div className="tl-dot" /><div><p className="tl-h">Europäische Holdingstruktur &amp; Raffinerie-Partnerschaft</p><p className="tl-p">Holdingstruktur in Irland, Großbritannien, Tschechien und der Slowakei. Vertragsabschluss mit einer deutschen Raffinerie (London Good Delivery). Produktarchitektur Gold Hypo &amp; Repo fertiggestellt.</p></div></div>
                <div className="tl-item reveal d4"><div className="tl-year">2026</div><div className="tl-dot" /><div><p className="tl-h">REVESTIUM AG &amp; Gold Bank SK Pilotbetrieb</p><p className="tl-p">Gold Bank SK im Pilotbetrieb als Lizenz/Franchise an das Broker-Pool-Netzwerk verteilt. Übernahme der REVESTIUM AG und Vorbereitung auf die Tokenisierung gemäß dem Schweizer DLT-Gesetz.</p></div></div>
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
        </div>
      </section>

      {/* ── PRODUKTE ── */}
      <section id="produkte" className="section prod-bg">
        <div className="section-inner">
          <div className="reveal">
            <p className="eyebrow">Produkte &amp; Dienstleistungen</p>
            <h2 className="sh">Umfassende Dienstleistungen rund um Gold —<br /><em>beide Seiten der Bilanz</em></h2>
            <p className="sub">Umfassende Lösungen für die physische Lagerung von Gold, Kreditprodukte und eine proprietäre Treasury-Verwaltung auf einer gemeinsamen Infrastruktur für vier Rechtsordnungen. Eine einzige Integration für ein breites Produktspektrum.</p>
          </div>

          <div className="cat-strip reveal"><p className="cat-strip-title">Digitale Plattformen</p></div>
          <div className="prod-grid reveal">
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <p className="pc-tag">Gold Bank CZ · SK · EU</p>
              <p className="pc-name">Gold Bank</p>
              <p className="pc-desc">Die erste europäische Plattform, die physisches Gold mit der vollständigen Digitalisierung des gesamten Lebenszyklus verbindet. Kunden kaufen, verwalten und lagern Gold — direkt vom Smartphone oder Computer aus. Kreditkonto in CZK und EUR, automatisches Sparprogramm in Gold, Rückkauf zu Marktpreisen, Umwandlung in physische Barren mit Kurierlieferung. Vollständige AML/KYC-Konformität mit eigenem KYC-Portal. Web + iOS + Android.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Jahresertrag</span><span className="acc">+10 % p.a. in Au (vertraglich)</span></div>
                <div className="pc-row"><span>Unterlegung</span><span>LBMA Good Delivery</span></div>
                <div className="pc-row"><span>Kreditkonto</span><span>CZK &amp; EUR</span></div>
                <div className="pc-row"><span>App</span><span>iOS · Android · Web</span></div>
                <div className="pc-row"><span>Märkte</span><span>gold-bank.cz · .sk · .eu</span></div>
              </div>
            </div>
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge unique">Proprietär</span>
              <p className="pc-tag">KI-Treasury &amp; Research</p>
              <p className="pc-name">AUROM &amp;<br /><em>AUROM PRO Dealer Commander</em></p>
              <p className="pc-desc">Eigenentwickeltes Forschungs- und Analysesystem für die Verwaltung und Neugewichtung von Portfolios mithilfe von KI: tägliche SARIMA/Prophet-Prognose, Smart Hedging CME + OTC, Yield-Hunter-Strategie, Stresstests. Auf dem Markt existiert kein vergleichbares Produkt mit einer so umfangreichen Wissensbasis und Verknüpfung von Aktivitäten zwischen physischer Verwaltung, Lagerverwaltung und dem Informationsaustausch zwischen nicht-bankgebundenem und reguliertem Segment.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Hedging</span><span>CME + OTC</span></div>
                <div className="pc-row"><span>B2B SaaS Potenzial</span><span>0,1–0,2 % AuM p.a.</span></div>
                <div className="pc-row"><span>Status</span><span className="acc">Live · proprietär</span></div>
              </div>
            </div>
          </div>

          <div className="prod-grid three reveal" style={{ marginTop: "1px" }}>
            <div className="prod-card">
              <span className="pc-badge unique">Einzigartig in Europa</span>
              <p className="pc-tag">Strukturiertes Beteiligungsprogramm</p>
              <p className="pc-name">GOLD D10</p>
              <p className="pc-desc">Ein einzigartiges partizipatives Renditeprogramm mit einem bedeutenden Anteil an aktiven Handelsaktivitäten, das nicht als kollektives Anlageprogramm oder AIF-Fondsstruktur eingestuft ist. 10 diversifizierte Positionen zur Absicherung in physischem Gold, optimiert durch AUROM Research und Dealer Commander Execution. Zielgruppe: HNWI und qualifizierte Anleger.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Struktur</span><span>10 diversifizierte Positionen</span></div>
                <div className="pc-row"><span>Klassifizierung</span><span>Kein AIF · kein kollektives Programm</span></div>
              </div>
            </div>
            <div className="prod-card">
              <span className="pc-badge">Digitales Sparprogramm</span>
              <p className="pc-tag">Aufbauprogramm</p>
              <p className="pc-name">DIGI GOLD<br />Savings</p>
              <p className="pc-desc">Digitales Programm für die physische Verwahrung von Edelmetallen. Schrittweiser Aufbau eines physischen Goldbestands — vollständig digital, 100 % physisch durch LBMA gedeckt, mit automatischer DCA-Optimierung.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Einstieg</span><span>ab 50 EUR/Monat</span></div>
                <div className="pc-row"><span>Unterlegung</span><span>100 % physisch LBMA-gedeckt</span></div>
              </div>
            </div>
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge unique">Einzigartig in Europa</span><span className="pc-badge live">Rollout</span>
              <p className="pc-tag">Zahlungsmittel · Täglich</p>
              <p className="pc-name">Gold Card</p>
              <p className="pc-desc">Verbindung des Goldkontos bei der Gold Bank mit einer Mastercard — weltweit mit Gold zahlen. Transaktionen werden automatisch vom Goldguthaben abgezogen. Gold wird zu einer lebendigen Währung. Dieses Konzept bietet in Europa praktisch kein anderer Anbieter.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Karte</span><span>Mastercard</span></div>
                <div className="pc-row"><span>Abbuchung</span><span>Automatisch vom Goldkonto</span></div>
                <div className="pc-row"><span>Verfügbarkeit</span><span>Weltweit · täglich</span></div>
              </div>
            </div>
            <div className="prod-card"></div>
          </div>

          <div className="cat-strip reveal" style={{ marginTop: "4rem" }}><p className="cat-strip-title">Compliance &amp; Intelligence</p></div>
          <div className="prod-grid reveal">
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge unique">Eigene AML/KYC-Plattform</span>
              <p className="pc-tag">Compliance · Due Diligence · FATF</p>
              <p className="pc-name">ARGUS</p>
              <p className="pc-desc">Fortschrittliche Plattform für die Einhaltung von AML/KYC-Vorschriften, entwickelt für AML-Analysten, Compliance-Mitarbeiter und Risikomanager im Edelmetallhandel. Strukturierte Untersuchungen mit eindeutiger Fallnummer, automatisch generierte Checklisten, AI-OSINT-Analyse, Netzwerkbeziehungsdiagramm, interaktive Zeitleiste und automatische Risikobewertung. Konform mit §253/2008 Sb., 40 FATF-Empfehlungen, AMLD5, DSGVO, LBMA Responsible Sourcing, ISO 27001 und SOC 2 Typ II.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Primärmarkt</span><span>Edelmetallhändler · Finanzinstitute</span></div>
                <div className="pc-row"><span>Standards</span><span>FATF · AMLD5 · DSGVO · ISO 27001</span></div>
                <div className="pc-row"><span>LBMA Sourcing</span><span className="acc">5-stufige Lieferkettenkartierung</span></div>
                <div className="pc-row"><span>Risikobewertung</span><span>NIEDRIG / MITTEL / HOCH / KRITISCH</span></div>
                <div className="pc-row"><span>Bereitstellung</span><span>Privates SaaS · Datenspeicher EU</span></div>
              </div>
            </div>
            <div className="prod-card">
              <span className="pc-badge">Regulatory Intelligence</span>
              <p className="pc-tag">Regulatory Intelligence</p>
              <p className="pc-name">ARGUS PRO</p>
              <p className="pc-desc">Edelmetallhändler benötigen ab dem 1.7.2027 ein effektives Tool zur Erfüllung ihrer Pflichten beim Onboarding und bei der laufenden Überwachung gemäß der neuen europäischen AML-Gesetzgebung. ARGUS PRO adressiert EDD- und CDD-Prozesse, strukturiertes Fallmanagement, KPI-Dashboards und LBMA-konforme Compliance-Programme.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Edelmetallhändler</span><span>gemäß AMLA ab 1.7.2027</span></div>
                <div className="pc-row"><span>Finanzinstitute</span><span>EDD · CDD · PEP-Screening</span></div>
                <div className="pc-row"><span>Compliance-Teams</span><span>Fallmanagement · Audit-Trail</span></div>
                <div className="pc-row"><span>Management</span><span>Dashboard · KPI · Export</span></div>
              </div>
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
              <div className="pc-params">
                <div className="pc-row"><span>Laufzeit</span><span>5–20 Jahre</span></div>
                <div className="pc-row"><span>LTV</span><span className="acc">bis zu 80 %</span></div>
                <div className="pc-row"><span>Margin Call</span><span>LTV ≥ 88 %</span></div>
                <div className="pc-row"><span>Onboarding</span><span>2–5 Tage</span></div>
                <div className="pc-row"><span>EU-Wettbewerber</span><span className="acc">keine bekannten</span></div>
              </div>
            </div>
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge unique">Premium-Alternative</span><span className="pc-badge live">Ready to launch</span>
              <p className="pc-tag">Kurzfristiger Goldkredit</p>
              <p className="pc-name">Gold Repo</p>
              <p className="pc-desc">Kurzfristige Liquidität aus Gold ohne Verkauf. Der Kunde hinterlegt physisches Gold als Sicherheit — unser Unternehmen sorgt als Sicherheitenverwalter für die Verwahrung, die tägliche Bewertung (LBMA PM Fix) und das Ausfallmanagement (T+2). Keine Bonitätsprüfung. Im Vergleich zum Pfandhaus: 99,5 % Realisierung vs. 50–70 %, Abwicklung T+2 vs. Monate.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Laufzeit</span><span>1–12 Monate</span></div>
                <div className="pc-row"><span>LTV</span><span className="acc">bis zu 80 %</span></div>
                <div className="pc-row"><span>Bewertung</span><span>LBMA AM/PM täglich</span></div>
                <div className="pc-row"><span>Verwertung bei Ausfall</span><span>99,5 % LBMA, T+2</span></div>
                <div className="pc-row"><span>Versicherung</span><span>Kooperativa – Vienna Insurance Group</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GOLD AS COLLATERAL ── */}
      <section id="collateral" className="section" style={{ background: "var(--dark2)" }}>
        <div className="section-inner">
          <div className="reveal">
            <p className="eyebrow">World Gold Council · Linklaters LLP · 2025</p>
            <h2 className="sh">Gold as Collateral —<br /><em>institutionelle Infrastruktur</em></h2>
            <p className="sub">Das World Gold Council / Linklaters Whitepaper (2025) beschreibt eine strukturelle Marktlücke: Unallocated Gold trägt Gegenparteirisiko, Allocated Gold ist als Sicherheit operativ aufwändig. Pooled Gold Interests (PGI) adressieren beides durch direkte, bruchteilhafte Eigentumsrechte an segregiertem physischen Gold — CCP-tauglich, elektronisch übertragbar, ohne physische Bewegung der Barren. Die Gruppe positioniert sich als Collateral Agent und Liquiditätsgeber in diesem entstehenden Markt.</p>
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
              <span className="pc-badge unique">Institutional</span><span className="pc-badge live">Roadmap 2026</span>
              <p className="pc-tag">Gold Margining · OTC Counterparties</p>
              <p className="pc-name">Gold OTC<br />Margining</p>
              <p className="pc-desc">Gold-Margining für ausgewählte bilaterale Gegenparteien: physisches LBMA-Gold als Sicherheit für OTC-Derivate-Positionen ohne physische Segregation oder Tresortransfer. Kompatibel mit EU/UK EMIR Uncleared Margin Rules. Basis: PGI-Struktur als „Thing in Action" — elektronisch übertragbar, insolvenzfern vom Verwahrer.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Zielgruppe</span><span>HNWI · Family Offices · Institutionelle</span></div>
                <div className="pc-row"><span>Instrument</span><span>PGI / Warrant / Zastavní CP</span></div>
                <div className="pc-row"><span>Settlement</span><span className="acc">Atomic · T+0 / T+2</span></div>
                <div className="pc-row"><span>Rechtsrahmen</span><span>EMIR · OZ · English Law</span></div>
              </div>
            </div>
            <div className="prod-card">
              <span className="pc-badge">Optimierung</span>
              <p className="pc-tag">Cheapest-to-Deliver Collateral</p>
              <p className="pc-name">Collateral<br />Optimization Engine</p>
              <p className="pc-desc">Intelligente Substitution zwischen Barmitteln, US-Staatsanleihen und physischem Gold — automatische Auswahl der kostengünstigsten verfügbaren Sicherheit für jede Margin-Obligation. Integration mit Dealer Commander für Echtzeit-Bewertung und Portfolio-Optimierung.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Assets</span><span>Gold · Cash · UST · Repo</span></div>
                <div className="pc-row"><span>Engine</span><span>Dealer Commander Integration</span></div>
                <div className="pc-row"><span>Bewertung</span><span>LBMA PM Fix · Echtzeit</span></div>
              </div>
            </div>
          </div>

          <p className="cat-divider reveal">B — Triparty &amp; Custody-Enabled Collateral</p>
          <div className="prod-grid reveal">
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge unique">Kein Tresortransfer</span><span className="pc-badge live">Roadmap 2027</span>
              <p className="pc-tag">Triparty Custody · CCP &amp; FMI</p>
              <p className="pc-name">Triparty Gold<br />Custody</p>
              <p className="pc-desc">Custody-Bedingungen, die ein Sicherheiteninteresse an physischem Gold ohne physische Bewegung der Barren ermöglichen. Das Gold bleibt im Tresor — das Sicherheiteninteresse wird über ein Warrant-Instrument oder PGI-Struktur übertragen. Kompatibel mit CCP-Clearing (Initial Margin, Default Fund) und FMI-Anforderungen.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Struktur</span><span>PGI / Warrant · CDCP / eigenes Register</span></div>
                <div className="pc-row"><span>CCP-Tauglichkeit</span><span className="acc">EU/UK EMIR · Initial Margin</span></div>
                <div className="pc-row"><span>Insolvenzschutz</span><span>Segregiert · insolvenzfern</span></div>
                <div className="pc-row"><span>Physisch</span><span>Kein Tresortransfer erforderlich</span></div>
              </div>
            </div>
            <div className="prod-card">
              <span className="pc-badge">Legal Pack</span>
              <p className="pc-tag">Treasury &amp; Risk Teams</p>
              <p className="pc-name">Collateral<br />Legal &amp; Reporting Pack</p>
              <p className="pc-desc">Vollständiges juristisches und operatives Paket für Treasury- und Risk-Teams: tägliche Bewertungsreporte nach LBMA PM Fix, Margin-Call-Dokumentation, Trigger-Protokoll (LTV-Schwellen), Legal Opinion zu anwendbarem Recht (CZ/SK/UK/CH), Auditpfad für Regulatoren, ISDA-kompatible Sicherheitenvereinbarungen.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Reporting</span><span>Täglich · LBMA PM Fix</span></div>
                <div className="pc-row"><span>Legal</span><span>CZ · SK · UK · CH Jurisdiktionen</span></div>
                <div className="pc-row"><span>ISDA</span><span>Credit Support Annex kompatibel</span></div>
                <div className="pc-row"><span>Audit Trail</span><span>Vollständig · regulatorenfest</span></div>
              </div>
            </div>
          </div>

          <p className="cat-divider reveal">C — Gold Financing</p>
          <div className="prod-grid reveal">
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge unique">Intraday Liquidity</span><span className="pc-badge live">Roadmap 2026–27</span>
              <p className="pc-tag">Lombard · Credit Lines</p>
              <p className="pc-name">Gold Credit<br />Lines</p>
              <p className="pc-desc">Lombard- und Kreditlinien gegen transparent evidiertes physisches Gold: digitale Evidenz im eigenen Register oder via CDCP, tägliche Bewertung, automatisches Margin Management. Zielgruppe: Institutionelle Goldhalter, die kurzfristige Liquidität ohne Verkauf benötigen.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Struktur</span><span>Revolving · Lombard · Kreditlinie</span></div>
                <div className="pc-row"><span>Evidenz</span><span>Digitales Register · CDCP</span></div>
                <div className="pc-row"><span>Bewertung</span><span className="acc">LBMA PM Fix · tägliches MTM</span></div>
                <div className="pc-row"><span>Buyback</span><span>Garantiert · Fair Value</span></div>
              </div>
            </div>
            <div className="prod-card">
              <span className="pc-badge">Intraday</span>
              <p className="pc-tag">Digital Metal Collateral</p>
              <p className="pc-name">Intraday Gold<br />Liquidity Lines</p>
              <p className="pc-desc">Intraday-Liquiditätslinien gegen digital evidiertes Metall-Kollateral — atomare Aktivierung und Rückgabe innerhalb des Handelstages. Adressiert den im WGC/Linklaters-Whitepaper identifizierten Use Case: frictionless gold, instant collateralisation, atomic settlement.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Aktivierung</span><span className="acc">Atomic · T+0 intraday</span></div>
                <div className="pc-row"><span>Rückgabe</span><span>End of Day automatisch</span></div>
                <div className="pc-row"><span>Zielgruppe</span><span>OTC Clearing Members · Banken</span></div>
                <div className="pc-row"><span>Basis</span><span>WGC PGI-Ökosystem 2025</span></div>
              </div>
            </div>
          </div>

          <p className="cat-divider reveal">Positionierung im entstehenden PGI-Ökosystem</p>
          <div className="prod-grid reveal" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge unique">Strategisch</span>
              <p className="pc-tag">Role 1 — mit institutionellem Partner</p>
              <p className="pc-name">Core<br />Participant</p>
              <p className="pc-desc">Bei Gewinnung eines Bank- oder Fondspartners mit ausreichender Governance: gemeinsames Halten des Rechtstitels am Gold-Bar-Pool, Management von Loading-In/Out, Audit, Versicherung und Custody-Beziehungen — und Emission von PGI.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Voraussetzung</span><span>Institutioneller Bankpartner</span></div>
                <div className="pc-row"><span>Funktion</span><span>Rechtstitel · PGI-Emittent · Custody</span></div>
                <div className="pc-row"><span>Upside</span><span className="acc">Maximale Kontrolle &amp; Fee-Capture</span></div>
              </div>
            </div>
            <div className="prod-card">
              <span className="pc-badge">Distribution</span>
              <p className="pc-tag">Role 2 — über Gold Bank</p>
              <p className="pc-name">Participant /<br />Distributor</p>
              <p className="pc-desc">Gold Bank bietet eine der stärksten Kundendistributionen für physisches Gold im CEE-Raum. Als Participant werden PGI für Kunden gehalten und Trading-Flow generiert — unter Nutzung der bestehenden AML/KYC-Infrastruktur (ARGUS).</p>
              <div className="pc-params">
                <div className="pc-row"><span>Stärke</span><span>Gold Bank CZ · SK · EU Distribution</span></div>
                <div className="pc-row"><span>Funktion</span><span>PGI-Holding · Client Onboarding</span></div>
                <div className="pc-row"><span>Infrastruktur</span><span>ARGUS AML/KYC · Gold Bank API</span></div>
              </div>
            </div>
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge unique">Bevorzugte Einstiegsrolle</span>
              <p className="pc-tag">Role 3 — Kernstärke</p>
              <p className="pc-name">Liquidity Provider /<br />Market Maker</p>
              <p className="pc-desc">Die attraktivste Variante — direkt auf bestehenden Stärken aufbauend: präzises Pricing via AUROM/Dealer Commander, CME-Hedging, Flow-Management und Cross-Form-Arbitrage zwischen allocated, unallocated und PGI. Keine Banklizenz erforderlich.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Kernstärke</span><span>AUROM Pricing · CME Hedging</span></div>
                <div className="pc-row"><span>Funktion</span><span>Allocated ↔ Unallocated ↔ PGI</span></div>
                <div className="pc-row"><span>Ertrag</span><span className="acc">Bid-Ask · Conversion Fees · Arbitrage</span></div>
                <div className="pc-row"><span>Vorteil</span><span>Keine Banklizenz erforderlich</span></div>
              </div>
            </div>
          </div>

          <div className="reveal" style={{ marginTop: "3rem", padding: "2rem", background: "rgba(196,149,74,0.05)", border: "1px solid rgba(196,149,74,0.2)", borderLeft: "3px solid var(--gold)" }}>
            <p className="eyebrow" style={{ marginBottom: ".8rem" }}>Strategische Begründung</p>
            <p style={{ fontSize: ".88rem", color: "var(--cream3)", lineHeight: 1.8, maxWidth: "80ch" }}>Das Linklaters/WGC-Whitepaper (2025) identifiziert eine fundamentale Marktlücke: Unallocated Gold trägt Kontrahentenrisiko und ist nicht EMIR-konform. Allocated Gold ist operativ unpraktisch als Sicherheit. <strong style={{ color: "var(--cream)" }}>PGI lösen beides — und schaffen einen dritten Grundpfeiler des Goldmarkts.</strong> Die Gruppe positioniert sich als Collateral Agent und Custody-Infrastruktur für diesen entstehenden Markt. Frictionless Gold, Instant Collateralisation und Atomic Settlement sind laut dem Whitepaper die attraktivsten zukünftigen Use Cases des institutionellen Goldmarkts.</p>
          </div>
        </div>
      </section>

      {/* ── MEHR ÜBER PRODUKTE ── */}
      <section id="details" className="section mup-bg">
        <div className="section-inner">
          <div className="reveal">
            <p className="eyebrow">Mehr über unsere Produkte</p>
            <h2 className="sh">Produktarchitektur &amp;<br /><em>Partnerschaft</em></h2>
            <p className="sub">Jedes Produkt ist eigenständig funktionsfähig — und Teil eines integrierten Ökosystems.</p>
          </div>
          <div className="mup-tabs reveal" id="mupTabs">
            <button className={`mup-btn${activeMup === "deposit" ? " active" : ""}`} onClick={() => showMup("deposit")}>Gold Deposit &amp; D10</button>
            <button className={`mup-btn${activeMup === "digi" ? " active" : ""}`} onClick={() => showMup("digi")}>DIGI GOLD &amp; AUROM</button>
            <button className={`mup-btn${activeMup === "lending" ? " active" : ""}`} onClick={() => showMup("lending")}>Gold Hypo &amp; Repo</button>
            <button className={`mup-btn${activeMup === "wholesale" ? " active" : ""}`} onClick={() => showMup("wholesale")}>Wholesale &amp; Juwelier</button>
            <button className={`mup-btn${activeMup === "argus" ? " active" : ""}`} onClick={() => showMup("argus")}>ARGUS Compliance</button>
          </div>

          <div id="mup-deposit" className={`mup-panel reveal${activeMup === "deposit" ? " active" : ""}`}>
            <div className="mup-left">
              <h3>Gold Deposit &amp; GOLD D10</h3>
              <p>Gold Deposit ist die Grundlage unseres Ökosystems: Kunden hinterlegen physisches Gold und erhalten echten Ertrag in Gold — nicht in Fiat. GOLD D10 erweitert dieses Modell für anspruchsvolle Investoren mit strukturierten Ertragsstrategien über 10 diversifizierte Positionen.</p>
              <p className="mup-pull">Für den Bankpartner: Custody-Fee 0,3 % AuM p.a. + Paying Agent Fee. Kein eigener Betriebsaufwand — vollständig ausgelagert an Swiss Gold Deposit Group.</p>
              <div className="mup-params">
                <div className="mup-row"><span>Gold Deposit Ertrag (vertraglich)</span><span className="acc">+10 % p.a. in Au</span></div>
                <div className="mup-row"><span>D10 Zielertrag</span><span className="acc">Überdurchschnittlich in Au</span></div>
                <div className="mup-row"><span>Custody-Fee Partner</span><span>0,3 % AuM p.a.</span></div>
                <div className="mup-row"><span>CEE Potenzial</span><span>EUR 20B+</span></div>
              </div>
            </div>
            <div className="mup-cards">
              <div className="mup-card"><h4>Für den Kunden</h4><p>Gold bleibt im Tresor, wertet sich weiter auf. Kein Verkauf, kein Katastereintrag, kein Credit Scoring. Onboarding in 2–5 Tagen. LTV bis 80 %.</p></div>
              <div className="mup-card"><h4>Für die Bank</h4><p>Die Bank stellt nur den Kredit aus und hält den Warrant. Kein Kontakt mit physischem Gold. T+2 Realisierung. RWA unter Basel: Finanzielle Sicherheit 0–20 % vs. Immobilien 35–50 %. Clean P&amp;L: Zinsmarge minus CoF minus Risikokosten ≈ 3 % netto auf Portfolio.</p></div>
              <div className="mup-card"><h4>Trigger-System</h4><p>LTV ≥ 88 %: Margin Call an Kunden. LTV ≥ 92 %: Benachrichtigung der Bank. LTV ≥ 95 %: Forced Sale autorisiert. T+2 Settlement über StoneX — Erlös an Bank, Überschuss an Kunden.</p></div>
              <div className="mup-card"><h4>Vs. Immobilienpfand</h4><p>Klassische Hypothek: Onboarding 3–6 Monate, Realisierung 6–24 Monate, Verwertungsquote 50–70 %. Gold via Swiss Arrows: Onboarding 2–5 Tage, Realisierung T+2, Verwertungsquote 99,5 % LBMA. Kein Gutachteraufwand, kein Grundbucheintrag.</p></div>
            </div>
          </div>

          <div id="mup-digi" className={`mup-panel reveal${activeMup === "digi" ? " active" : ""}`}>
            <div className="mup-left">
              <h3>DIGI GOLD Savings &amp; AUROM</h3>
              <p>DIGI GOLD ist unser digitales Aufbauprogramm für physisches Gold — vollständig digital, 100 % physisch durch LBMA gedeckt, mit automatischer DCA-Optimierung. AUROM als proprietäres Forschungssystem optimiert alle Portfolios in Echtzeit.</p>
              <div className="mup-params">
                <div className="mup-row"><span>Einstieg</span><span>ab 50 EUR/Monat</span></div>
                <div className="mup-row"><span>Unterlegung</span><span>100 % physisch LBMA-gedeckt</span></div>
                <div className="mup-row"><span>AUROM Hedging</span><span>CME + OTC</span></div>
                <div className="mup-row"><span>B2B SaaS Potenzial</span><span>0,1–0,2 % AuM p.a.</span></div>
              </div>
            </div>
            <div className="mup-cards">
              <div className="mup-card"><h4>AUROM — proprietäres System</h4><p>Tägliche SARIMA/Prophet-Prognose, Smart Hedging, Yield-Hunter-Strategie, Stresstests. Kein vergleichbares Produkt auf dem Markt mit dieser Verknüpfung von physischer Verwaltung, Lagerverwaltung und reguliertem Segment.</p></div>
              <div className="mup-card"><h4>Dealer Commander</h4><p>Echtzeit-Treasury-Managementsystem für präzises Pricing und Hedging-Execution. CME-Integration für institutionelles Gold-Hedging. Proprietär entwickelt — nicht replizierbar.</p></div>
            </div>
          </div>

          <div id="mup-lending" className={`mup-panel reveal${activeMup === "lending" ? " active" : ""}`}>
            <div className="mup-left">
              <h3>Gold Hypo &amp; Gold Repo</h3>
              <p>Zwei komplementäre Kreditprodukte — Gold Hypo für langfristige Finanzierung (5–20 Jahre), Gold Repo für kurzfristige Liquidität (1–12 Monate). Beide nutzen dieselbe Collateral-Agent-Infrastruktur.</p>
              <div className="mup-params">
                <div className="mup-row"><span>Gold Hypo LTV</span><span className="acc">bis 80 %</span></div>
                <div className="mup-row"><span>Gold Repo LTV</span><span className="acc">bis 80 %</span></div>
                <div className="mup-row"><span>Bewertung</span><span>LBMA PM Fix täglich</span></div>
                <div className="mup-row"><span>Verwertung bei Ausfall</span><span>99,5 % LBMA, T+2</span></div>
                <div className="mup-row"><span>Versicherung</span><span>Kooperativa – Vienna Insurance Group</span></div>
              </div>
            </div>
            <div className="mup-cards">
              <div className="mup-card"><h4>Für die kreditgebende Bank</h4><p>Kein Kontakt mit physischem Gold, kein operatives Risiko. Bank stellt Kredit aus, hält Warrant. T+2 Realisierung im Ausfallfall. RWA-Vorteil gegenüber Immobilienpfand.</p></div>
              <div className="mup-card"><h4>Trigger-System</h4><p>LTV ≥ 88 %: Margin Call. LTV ≥ 92 %: Bankbenachrichtigung. LTV ≥ 95 %: Forced Sale autorisiert. SA Reserve Fund (2 % AUM) deckt Extremszenarien.</p></div>
            </div>
          </div>

          <div id="mup-wholesale" className={`mup-panel reveal${activeMup === "wholesale" ? " active" : ""}`}>
            <div className="mup-cards">
              <div className="mup-card"><h4></h4><p>Direkter Vertrag mit einer der führenden deutschen LBMA-Raffinerien (London Good Delivery). Sicherste Lieferkette, höchste Qualitätsstandards.</p></div>
              <div className="mup-card"><h4></h4><p>CME Prime Broker und Clearing-Partner. Institutionelle Settlement-Infrastruktur für T+2 Abwicklung bei Ausfällen und regulärem Handel.</p></div>
            </div>
          </div>

          <div id="mup-argus" className={`mup-panel reveal${activeMup === "argus" ? " active" : ""}`}>
            <div className="mup-left">
              <h3>ARGUS &amp; ARGUS PRO</h3>
              <p>ARGUS ist unsere proprietäre AML/KYC-Plattform für den Edelmetallhandel — vollständig konform mit FATF, AMLD5, DSGVO, LBMA Responsible Sourcing, ISO 27001 und SOC 2 Typ II.</p>
              <div className="mup-params">
                <div className="mup-row"><span>Standards</span><span>FATF · AMLD5 · §253/2008 Sb.</span></div>
                <div className="mup-row"><span>LBMA Sourcing</span><span className="acc">5-stufige Lieferkettenkartierung</span></div>
                <div className="mup-row"><span>AI OSINT</span><span>Intelligence-Bericht mit einem Klick</span></div>
                <div className="mup-row"><span>Risikobewertung</span><span>NIEDRIG / MITTEL / HOCH / KRITISCH</span></div>
                <div className="mup-row"><span>Bereitstellung</span><span>Privates SaaS · Datenspeicher EU</span></div>
              </div>
            </div>
            <div className="mup-cards">
              <div className="mup-card"><h4>Ab 1.7.2027 verpflichtend</h4><p>Edelmetallhändler benötigen ab dem 1.7.2027 ein effektives Tool zur Erfüllung ihrer AMLA-Pflichten. ARGUS PRO ist bereit. Wir sind bestens auf die Änderungen im Jahr 2027 vorbereitet.</p></div>
              <div className="mup-card"><h4>Für Finanzinstitute</h4><p>EDD- und CDD-Prozesse zur Überprüfung von Geschäftspartnern. Strukturiertes Fallmanagement statt Excel. Dashboard mit Kennzahlen und Exportfunktion.</p></div>
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
            <svg viewBox="0 0 860 520" xmlns="http://www.w3.org/2000/svg"
              style={{ width: "100%", maxWidth: "860px", display: "block", margin: "0 auto" }}
              fontFamily="'Commissioner',system-ui,sans-serif">
              <defs>
                <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#c4954a" stopOpacity=".18" />
                  <stop offset="100%" stopColor="#c4954a" stopOpacity="0" />
                </radialGradient>
                <marker id="a1" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3z" fill="#c4954a" opacity=".6" /></marker>
                <marker id="a2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3z" fill="#7aad7a" opacity=".5" /></marker>
                <marker id="a3" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3z" fill="#c8bfa8" opacity=".35" /></marker>
                <filter id="glow3">
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <rect width="860" height="520" fill="#080806" rx="8" />
              <rect x="1" y="1" width="858" height="518" fill="none" stroke="#c4954a" strokeWidth=".5" rx="8" opacity=".15" />
              <text x="30" y="95" fill="#8a8278" fontSize="8" letterSpacing=".14em" transform="rotate(-90,30,95)" textAnchor="middle" opacity=".6">KUNDEN</text>
              <text x="30" y="265" fill="#8a8278" fontSize="8" letterSpacing=".14em" transform="rotate(-90,30,265)" textAnchor="middle" opacity=".6">CORE ENGINE</text>
              <text x="30" y="430" fill="#8a8278" fontSize="8" letterSpacing=".14em" transform="rotate(-90,30,430)" textAnchor="middle" opacity=".6">INSTITUTIONELL</text>
              <line x1="60" y1="155" x2="820" y2="155" stroke="#c4954a" strokeWidth=".4" strokeDasharray="4,4" opacity=".18" />
              <line x1="60" y1="345" x2="820" y2="345" stroke="#c4954a" strokeWidth=".4" strokeDasharray="4,4" opacity=".18" />
              <rect x="80" y="30" width="130" height="108" rx="6" fill="#141310" stroke="#c4954a" strokeWidth="1.2" />
              <rect x="80" y="30" width="130" height="4" rx="3" fill="#c4954a" />
              <text x="145" y="52" textAnchor="middle" fill="#c4954a" fontSize="9.5" fontWeight="600" letterSpacing=".08em">Gold Bank</text>
              <text x="145" y="68" textAnchor="middle" fill="#ede8dc" fontSize="8.5" opacity=".8">CZ · SK · EU</text>
              <text x="145" y="84" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">38 Depots · EUR 9,1M AuM</text>
              <text x="145" y="99" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">+10 % p.a. in physischem Gold</text>
              <text x="145" y="114" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">iOS · Android · Web</text>
              <text x="145" y="129" textAnchor="middle" fill="#7aad7a" fontSize="7.5" opacity=".85">● Live</text>
              <rect x="230" y="30" width="130" height="108" rx="6" fill="#141310" stroke="#c4954a" strokeWidth=".8" opacity=".85" />
              <rect x="230" y="30" width="130" height="4" rx="3" fill="#c4954a" opacity=".6" />
              <text x="295" y="52" textAnchor="middle" fill="#c4954a" fontSize="9.5" fontWeight="600" letterSpacing=".08em">DIGI GOLD</text>
              <text x="295" y="68" textAnchor="middle" fill="#ede8dc" fontSize="8.5" opacity=".8">Savings</text>
              <text x="295" y="84" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">Ab 50 EUR/Monat</text>
              <text x="295" y="99" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">100 % physisch LBMA</text>
              <text x="295" y="114" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">DCA-Optimierung</text>
              <text x="295" y="129" textAnchor="middle" fill="#7aad7a" fontSize="7.5" opacity=".85">● Live</text>
              <rect x="380" y="30" width="130" height="108" rx="6" fill="#141310" stroke="#c4954a" strokeWidth=".8" opacity=".85" />
              <rect x="380" y="30" width="130" height="4" rx="3" fill="#c4954a" opacity=".6" />
              <text x="445" y="52" textAnchor="middle" fill="#c4954a" fontSize="9.5" fontWeight="600" letterSpacing=".08em">Gold Card</text>
              <text x="445" y="68" textAnchor="middle" fill="#ede8dc" fontSize="8.5" opacity=".8">Mastercard · täglich</text>
              <text x="445" y="84" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">Gold als lebendige Währung</text>
              <text x="445" y="99" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">Weltweit · 0 EU-Konkurrenten</text>
              <text x="445" y="114" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">Direkt vom Goldkonto</text>
              <text x="445" y="129" textAnchor="middle" fill="#c4954a" fontSize="7.5" opacity=".8">◉ Rollout</text>
              <rect x="530" y="30" width="130" height="108" rx="6" fill="#141310" stroke="#c4954a" strokeWidth=".8" opacity=".85" />
              <rect x="530" y="30" width="130" height="4" rx="3" fill="#c4954a" opacity=".6" />
              <text x="595" y="52" textAnchor="middle" fill="#c4954a" fontSize="9.5" fontWeight="600" letterSpacing=".08em">Edelmetalle</text>
              <text x="595" y="68" textAnchor="middle" fill="#ede8dc" fontSize="8.5" opacity=".8">Retail &amp; Wholesale</text>
              <text x="595" y="84" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">150+ Produkte</text>
              <text x="595" y="99" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">LBMA Good Delivery</text>
              <text x="595" y="114" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">Kunstjuwelier · Bespoke</text>
              <text x="595" y="129" textAnchor="middle" fill="#7aad7a" fontSize="7.5" opacity=".85">● Live</text>
              <ellipse cx="430" cy="255" rx="74" ry="54" fill="url(#coreGlow)" />
              <rect x="360" y="175" width="140" height="116" rx="8" fill="#1c1a16" stroke="#c4954a" strokeWidth="1.8" />
              <rect x="360" y="175" width="140" height="5" rx="4" fill="#c4954a" />
              <text x="430" y="200" textAnchor="middle" fill="#c4954a" fontSize="10" fontWeight="700" letterSpacing=".08em">AUROM</text>
              <text x="430" y="216" textAnchor="middle" fill="#c4954a" fontSize="9" opacity=".85">Dealer Commander</text>
              <line x1="375" y1="224" x2="485" y2="224" stroke="#c4954a" strokeWidth=".4" opacity=".3" />
              <text x="430" y="240" textAnchor="middle" fill="#ede8dc" fontSize="8.5" opacity=".85">AI Treasury · SARIMA</text>
              <text x="430" y="254" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".75">CME Hedging · OTC</text>
              <text x="430" y="268" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".75">Net ROI +23 %</text>
              <text x="430" y="280" textAnchor="middle" fill="#7aad7a" fontSize="7.5" opacity=".9">● Live · proprietär</text>
              <rect x="80" y="175" width="130" height="108" rx="6" fill="#141310" stroke="#c4954a" strokeWidth=".8" opacity=".85" />
              <rect x="80" y="175" width="130" height="4" rx="3" fill="#c4954a" opacity=".6" />
              <text x="145" y="197" textAnchor="middle" fill="#c4954a" fontSize="9.5" fontWeight="600" letterSpacing=".08em">GOLD D10</text>
              <text x="145" y="213" textAnchor="middle" fill="#ede8dc" fontSize="8.5" opacity=".8">Partizipationsprogramm</text>
              <text x="145" y="229" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">10 diversifizierte Positionen</text>
              <text x="145" y="244" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">Kein AIF · Kein Fonds</text>
              <text x="145" y="259" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">HNWI · Qual. Anleger</text>
              <text x="145" y="274" textAnchor="middle" fill="#c4954a" fontSize="7.5" opacity=".8">◉ Rollout</text>
              <rect x="640" y="175" width="130" height="108" rx="6" fill="#141310" stroke="#c4954a" strokeWidth=".8" opacity=".85" />
              <rect x="640" y="175" width="130" height="4" rx="3" fill="#c4954a" opacity=".6" />
              <text x="705" y="197" textAnchor="middle" fill="#c4954a" fontSize="9.5" fontWeight="600" letterSpacing=".08em">ARGUS</text>
              <text x="705" y="213" textAnchor="middle" fill="#ede8dc" fontSize="8.5" opacity=".8">AML/KYC Platform</text>
              <text x="705" y="229" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">FATF · AMLD5 · DSGVO</text>
              <text x="705" y="244" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">LBMA Responsible Sourcing</text>
              <text x="705" y="259" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">AI OSINT · Risk Scoring</text>
              <text x="705" y="274" textAnchor="middle" fill="#c4954a" fontSize="7.5" opacity=".8">◉ Rollout</text>
              <rect x="80" y="365" width="190" height="120" rx="6" fill="#141310" stroke="#c4954a" strokeWidth="1.2" />
              <rect x="80" y="365" width="190" height="4" rx="3" fill="#c4954a" />
              <text x="175" y="388" textAnchor="middle" fill="#c4954a" fontSize="9.5" fontWeight="600" letterSpacing=".08em">Gold Hypo</text>
              <text x="175" y="404" textAnchor="middle" fill="#ede8dc" fontSize="8.5" opacity=".8">Goldbesicherte Langzeitkredite</text>
              <text x="175" y="420" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">5–20 Jahre · LTV 80 %</text>
              <text x="175" y="435" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">Collateral Agent Modell</text>
              <text x="175" y="450" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">0 EU-Konkurrenten</text>
              <text x="175" y="470" textAnchor="middle" fill="#c4954a" fontSize="7.5" opacity=".85">◉ Ready to launch</text>
              <rect x="290" y="365" width="190" height="120" rx="6" fill="#141310" stroke="#c4954a" strokeWidth=".8" opacity=".9" />
              <rect x="290" y="365" width="190" height="4" rx="3" fill="#c4954a" opacity=".7" />
              <text x="385" y="388" textAnchor="middle" fill="#c4954a" fontSize="9.5" fontWeight="600" letterSpacing=".08em">Gold Repo</text>
              <text x="385" y="404" textAnchor="middle" fill="#ede8dc" fontSize="8.5" opacity=".8">Kurzfristiger Goldkredit</text>
              <text x="385" y="420" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">1–12 Monate · LTV 80 %</text>
              <text x="385" y="435" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">T+2 · 99,5 % LBMA</text>
              <text x="385" y="450" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".7">Kooperativa Versicherung</text>
              <text x="385" y="470" textAnchor="middle" fill="#c4954a" fontSize="7.5" opacity=".85">◉ Ready to launch</text>
              <rect x="500" y="365" width="270" height="120" rx="6" fill="#1c1a16" stroke="#c4954a" strokeWidth="1" strokeDasharray="5,3" />
              <rect x="500" y="365" width="270" height="4" rx="3" fill="#c4954a" opacity=".4" />
              <text x="635" y="388" textAnchor="middle" fill="#c4954a" fontSize="9.5" fontWeight="600" letterSpacing=".08em" opacity=".9">Gold as Collateral · PGI</text>
              <text x="635" y="404" textAnchor="middle" fill="#ede8dc" fontSize="8.5" opacity=".75">OTC Margining · Triparty · Intraday</text>
              <text x="635" y="420" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".65">Wholesale Digital Gold Ecosystem</text>
              <text x="635" y="435" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".65">WGC · Linklaters · LBMA Framework</text>
              <text x="635" y="450" textAnchor="middle" fill="#c8bfa8" fontSize="8" opacity=".65">Liquidity Provider · Market Maker</text>
              <text x="635" y="470" textAnchor="middle" fill="#c4954a" fontSize="7.5" opacity=".7">◌ Roadmap 2026–2027</text>
              <line x1="145" y1="138" x2="390" y2="175" stroke="#c4954a" strokeWidth=".8" strokeDasharray="3,3" markerEnd="url(#a1)" opacity=".35" />
              <line x1="295" y1="138" x2="415" y2="175" stroke="#c4954a" strokeWidth=".8" strokeDasharray="3,3" markerEnd="url(#a1)" opacity=".35" />
              <line x1="445" y1="138" x2="440" y2="175" stroke="#c4954a" strokeWidth=".8" strokeDasharray="3,3" markerEnd="url(#a1)" opacity=".35" />
              <line x1="595" y1="138" x2="465" y2="175" stroke="#c4954a" strokeWidth=".8" strokeDasharray="3,3" markerEnd="url(#a1)" opacity=".35" />
              <line x1="210" y1="232" x2="358" y2="240" stroke="#c4954a" strokeWidth="1.1" markerEnd="url(#a1)" opacity=".55" />
              <line x1="640" y1="232" x2="502" y2="240" stroke="#c4954a" strokeWidth="1.1" markerEnd="url(#a1)" opacity=".55" />
              <line x1="400" y1="291" x2="210" y2="363" stroke="#c4954a" strokeWidth="1.2" markerEnd="url(#a1)" opacity=".5" />
              <line x1="430" y1="291" x2="385" y2="363" stroke="#c4954a" strokeWidth="1.2" markerEnd="url(#a1)" opacity=".5" />
              <line x1="460" y1="291" x2="590" y2="363" stroke="#c4954a" strokeWidth=".9" strokeDasharray="4,3" markerEnd="url(#a1)" opacity=".35" />
              <text x="265" y="330" textAnchor="middle" fill="#c4954a" fontSize="7.5" opacity=".6">Pricing · Hedging</text>
              <text x="530" y="330" textAnchor="middle" fill="#c4954a" fontSize="7.5" opacity=".5">PGI · Collateral</text>
              <line x1="80" y1="500" x2="110" y2="500" stroke="#c4954a" strokeWidth="1" opacity=".7" />
              <text x="116" y="504" fill="#8a8278" fontSize="8">Live / Ready to launch</text>
              <line x1="230" y1="500" x2="260" y2="500" stroke="#c4954a" strokeWidth="1" strokeDasharray="4,3" opacity=".5" />
              <text x="266" y="504" fill="#8a8278" fontSize="8">Roadmap 2026–2027</text>
              <line x1="400" y1="500" x2="420" y2="500" stroke="#c4954a" strokeWidth="1.2" markerEnd="url(#a1)" opacity=".6" />
              <text x="426" y="504" fill="#8a8278" fontSize="8">Datenfluss / Integration</text>
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
            <h2 className="sh">Dun &amp; Bradstreet<br /><em>Rating H1</em></h2>
            <p className="sub">JURISCONSULT LTD. o.z. wird durch Dun &amp; Bradstreet — den weltweit führenden Anbieter für Unternehmensbonitätsbeurteilung — mit dem Rating <strong style={{ color: "var(--gold2)" }}>H1</strong> und einem Gesamtrisiko <strong style={{ color: "var(--gold2)" }}>„niedrig"</strong> bewertet. Das D&amp;B Rating ist für institutionelle Partner ein anerkannter Standard der Bonitätsprüfung in über 200 Ländern.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "3.5rem", alignItems: "start", marginBottom: "3rem" }} className="reveal d1">
            <div style={{ textAlign: "center", padding: "2.5rem 2rem", background: "var(--dark)", border: "1px solid var(--border)", flexShrink: 0 }}>
              <p style={{ fontFamily: "var(--sc)", fontSize: ".6rem", letterSpacing: ".22em", color: "#a8a090", marginBottom: ".7rem" }}>D&amp;B RATING</p>
              <p style={{ fontFamily: "var(--serif)", fontSize: "5.5rem", fontWeight: 300, lineHeight: 1, color: "var(--gold2)", letterSpacing: "-.02em" }}>H1</p>
              <div style={{ width: "32px", height: "1px", background: "var(--gold3)", margin: ".9rem auto" }}></div>
              <p style={{ fontFamily: "var(--sc)", fontSize: ".6rem", letterSpacing: ".16em", color: "#a8a090", marginBottom: ".25rem" }}>RISIKO</p>
              <p style={{ fontFamily: "var(--serif)", fontSize: "1rem", fontWeight: 400, color: "#e0d8c8" }}>Niedrig</p>
            </div>
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "var(--border2)" }}>
                <div style={{ background: "var(--dark)", padding: "1.25rem 1.1rem" }}>
                  <p style={{ fontFamily: "var(--sc)", fontSize: ".58rem", letterSpacing: ".14em", color: "#a8a090", marginBottom: ".4rem" }}>Finanzielle Stärke</p>
                  <p style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", fontWeight: 300, color: "var(--gold2)", marginBottom: ".2rem" }}>H</p>
                </div>
                <div style={{ background: "var(--dark)", padding: "1.25rem 1.1rem" }}>
                  <p style={{ fontFamily: "var(--sc)", fontSize: ".58rem", letterSpacing: ".14em", color: "#a8a090", marginBottom: ".4rem" }}>Risiko-Indikator</p>
                  <p style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", fontWeight: 300, color: "var(--gold2)", marginBottom: ".2rem" }}>1</p>
                </div>
                <div style={{ background: "var(--dark)", padding: "1.25rem 1.1rem" }}>
                  <p style={{ fontFamily: "var(--sc)", fontSize: ".58rem", letterSpacing: ".14em", color: "#a8a090", marginBottom: ".4rem" }}>Failure Score</p>
                  <p style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", fontWeight: 300, color: "var(--gold2)", marginBottom: ".2rem" }}>95</p>
                </div>
                <div style={{ background: "var(--dark)", padding: "1.25rem 1.1rem" }}>
                  <p style={{ fontFamily: "var(--sc)", fontSize: ".58rem", letterSpacing: ".14em", color: "#a8a090", marginBottom: ".4rem" }}>Delinquency Prob.</p>
                  <p style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", fontWeight: 300, color: "var(--gold2)", marginBottom: ".2rem" }}>3 %</p>
                </div>
                <div style={{ background: "var(--dark)", padding: "1.25rem 1.1rem" }}>
                  <p style={{ fontFamily: "var(--sc)", fontSize: ".58rem", letterSpacing: ".14em", color: "#a8a090", marginBottom: ".4rem" }}>Gesamtrisiko (12M)</p>
                  <p style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", fontWeight: 300, color: "var(--gold2)", marginBottom: ".2rem" }}>Niedrig</p>
                </div>
              </div>
              <div style={{ marginTop: "1rem", padding: ".9rem 1.1rem", background: "var(--dark)", border: "1px solid var(--border2)" }}>
                <p style={{ fontSize: ".76rem", color: "#b8b0a0", lineHeight: 1.7 }}>Bewertet durch <strong style={{ color: "#e0d8c8" }}>Dun &amp; Bradstreet</strong> — weltweit führender Anbieter mit über 500 Millionen Unternehmenseinträgen. Beurteilte Entität: <strong style={{ color: "#e0d8c8" }}>JURISCONSULT LTD. o.z.</strong> (IČ: 09913840, Prag) — tschechische Niederlassung von JURISCONSULT LTD, London (Companies House 12729220). Operativ ab: 16.02.2021.</p>
              </div>
            </div>
          </div>

          <div className="reveal d2" style={{ border: "1px solid var(--border2)", padding: "1.4rem 1.8rem", display: "flex", gap: "2.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: "var(--sc)", fontSize: ".58rem", letterSpacing: ".18em", color: "#a8a090", marginBottom: ".25rem" }}>D&amp;B VIABILITY RATING</p>
              <p style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", fontWeight: 300, color: "var(--gold2)", lineHeight: 1 }}>Niedrig <em style={{ fontSize: ".95rem", color: "#c8bfa8" }}>Risiko</em></p>
            </div>
            <div style={{ width: "1px", height: "36px", background: "var(--border2)", flexShrink: 0 }}></div>
            <div>
              <p style={{ fontFamily: "var(--sc)", fontSize: ".58rem", letterSpacing: ".18em", color: "#a8a090", marginBottom: ".25rem" }}>VIABILITY SCORE</p>
              <p style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", fontWeight: 300, color: "var(--gold2)", lineHeight: 1 }}>Stabil</p>
            </div>
            <div style={{ width: "1px", height: "36px", background: "var(--border2)", flexShrink: 0 }}></div>
            <div></div>
            <div style={{ width: "1px", height: "36px", background: "var(--border2)", flexShrink: 0 }}></div>
            <div style={{ flex: 1, minWidth: "220px" }}>
              <p style={{ fontSize: ".82rem", color: "#c8bfa8", lineHeight: 1.7 }}>Das D&amp;B Viability Rating bewertet die Überlebensfähigkeit im Branchenvergleich. JURISCONSULT LTD. o.z. wird über alle Vergleichszeiträume konsistent mit <strong style={{ color: "#e0d8c8" }}>niedrigem Risiko</strong> eingestuft.</p>
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
                <p style={{ fontSize: ".9rem", color: "#e0d8c8", lineHeight: 1.82, marginTop: "1rem", textAlign: "justify", hyphens: "auto" }}>Dank unserer Mitgliedschaft im <strong style={{ color: "#fff" }}>International Precious Metal Institute</strong> und unserem Engagement bei der <strong style={{ color: "#fff" }}>LBMA</strong> sind wir Teil eines globalen Netzwerks, das aktiv Standards, den Dialog und langfristige Stabilität innerhalb des Edelmetall-Ökosystems gestaltet.</p>
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

          <div className="imp-legal reveal">
            <p>© 2026 REVESTIUM AG · Jurisconsult Ltd.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
