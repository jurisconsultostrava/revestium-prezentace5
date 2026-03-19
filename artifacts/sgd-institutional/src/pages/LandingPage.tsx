import { useEffect, useRef, useState } from "react";

/* ── Scroll-reveal hook ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function LandingPage() {
  useReveal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", institution: "", email: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitted(true);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Commissioner:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --dark:#080806; --dark2:#0e0d0a; --dark3:#141310; --dark4:#1c1a16; --dark5:#242118;
          --gold:#c4954a; --gold2:#d4aa6a; --gold3:#a07838;
          --gold-dim:rgba(196,149,74,0.12); --gold-line:rgba(196,149,74,0.25);
          --cream:#ffffff; --cream2:#ede8dc; --cream3:#c8bfa8; --cream4:#8a8278;
          --border:rgba(196,149,74,0.14); --border2:rgba(255,255,255,0.05);
          --serif:'Commissioner',system-ui,sans-serif;
          --sans:'DM Sans',system-ui,sans-serif;
          --ease:cubic-bezier(0.16,1,0.3,1);
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;scroll-padding-top:80px;}
        body{background:var(--dark);color:var(--cream);font-family:var(--sans);font-weight:400;line-height:1.75;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
        ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-track{background:var(--dark);} ::-webkit-scrollbar-thumb{background:var(--gold3);}
        a{color:inherit;text-decoration:none;} ::selection{background:rgba(196,149,74,0.2);}

        /* REVEAL */
        .reveal{opacity:0;transform:translateY(22px);transition:opacity .75s var(--ease),transform .75s var(--ease);}
        .reveal.visible{opacity:1;transform:none;}
        .d1{transition-delay:.08s}.d2{transition-delay:.18s}.d3{transition-delay:.28s}.d4{transition-delay:.38s}

        /* HERO ANIMATIONS */
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:none;}}
        .anim1{opacity:0;animation:fadeUp .5s ease .05s forwards;}
        .anim2{opacity:0;animation:fadeUp .5s ease .15s forwards;}
        .anim3{opacity:0;animation:fadeUp .7s ease .28s forwards;}
        .anim4{opacity:0;animation:fadeUp .7s ease .42s forwards;}
        .anim5{opacity:0;animation:fadeUp .7s ease .56s forwards;}
        .anim6{opacity:0;animation:fadeUp .7s ease .68s forwards;}
        .anim7{opacity:0;animation:fadeUp .7s ease .74s forwards;}

        /* NAV */
        nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.4rem 3.5rem;
          display:flex;justify-content:space-between;align-items:center;
          background:rgba(8,8,6,0.92);backdrop-filter:blur(16px);
          border-bottom:1px solid var(--border);}
        .nav-links{display:flex;gap:2.2rem;list-style:none;}
        .nav-links a{font-family:var(--serif);font-size:.72rem;font-weight:400;letter-spacing:.12em;color:var(--cream3);transition:color .3s;}
        .nav-links a:hover{color:var(--gold2);}
        .nav-cta{font-family:var(--sans);font-size:.72rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;
          padding:.6rem 1.4rem;border:1px solid rgba(196,149,74,0.5);color:var(--gold);border-radius:2px;
          transition:all .2s;white-space:nowrap;}
        .nav-cta:hover{background:var(--gold);color:#080806;border-color:var(--gold);}

        /* HERO */
        .hero{min-height:100vh;position:relative;overflow:hidden;background:#04060e;}
        .hero-veil{position:absolute;inset:0;z-index:1;
          background:linear-gradient(to right,rgba(4,6,14,0.97) 0%,rgba(4,6,14,0.88) 40%,rgba(4,6,14,0.35) 100%),
                    linear-gradient(to top,rgba(4,6,14,0.7) 0%,transparent 40%);}
        .hero-lines{position:absolute;inset:0;pointer-events:none;z-index:1;
          background-image:linear-gradient(rgba(196,149,74,0.03) 1px,transparent 1px),
                           linear-gradient(90deg,rgba(196,149,74,0.03) 1px,transparent 1px);
          background-size:80px 80px;}
        .hero-inner{position:relative;z-index:2;min-height:100vh;display:flex;align-items:center;
          max-width:1180px;margin:0 auto;padding:9rem 3rem 6rem 5%;}
        @media(min-width:1100px){.hero-inner{padding-left:7%;} .hero-left{max-width:520px!important;}}
        .hero-accent-line{width:48px;height:2px;background:var(--gold);margin-bottom:1.8rem;}
        .hero-eyebrow{font-family:var(--sans);font-size:.62rem;font-weight:500;letter-spacing:.26em;color:var(--gold);text-transform:uppercase;margin-bottom:1.6rem;}
        .hero-h1{font-family:var(--serif);font-weight:700;font-size:clamp(2.6rem,5.5vw,4.6rem);line-height:1.06;letter-spacing:-.025em;color:#fff;margin-bottom:1.6rem;}
        .hero-h1 em{font-weight:700;color:var(--gold);font-style:normal;}
        .hero-sub{font-family:var(--sans);font-size:.92rem;font-weight:300;color:#a8a09a;line-height:1.75;max-width:46ch;margin-bottom:2.4rem;}
        .hero-ctas{display:flex;gap:.9rem;flex-wrap:wrap;margin-bottom:2.8rem;}
        .hero-btn-primary{font-family:var(--sans);font-size:.75rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
          padding:.85rem 2.2rem;border-radius:2px;background:var(--gold);color:#04060e;
          transition:background .15s;white-space:nowrap;box-shadow:0 0 28px rgba(196,149,74,0.25);}
        .hero-btn-primary:hover{background:#d4aa6a;}
        .hero-btn-ghost{font-family:var(--sans);font-size:.75rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;
          padding:.85rem 2.2rem;border-radius:2px;border:1px solid rgba(196,149,74,0.38);color:rgba(196,149,74,0.85);
          transition:border-color .15s,color .15s;white-space:nowrap;}
        .hero-btn-ghost:hover{border-color:var(--gold);color:var(--gold);}
        .hero-divider{width:100%;height:1px;background:rgba(196,149,74,0.15);margin-bottom:2rem;}
        .hero-metrics{display:flex;align-items:center;}
        .hm{padding-right:2rem;}
        .hm-val{font-family:var(--serif);font-size:1.45rem;font-weight:600;color:#fff;line-height:1;margin-bottom:.28rem;letter-spacing:-.01em;}
        .hm-label{font-family:var(--sans);font-size:.58rem;font-weight:400;color:var(--gold);letter-spacing:.14em;text-transform:uppercase;opacity:.7;}
        .hm-divider{width:1px;height:28px;background:rgba(196,149,74,0.18);margin-right:2rem;flex-shrink:0;}

        /* SECTION SHARED */
        .section{padding:7rem 3.5rem;}
        .section-inner{max-width:1160px;margin:0 auto;}
        .eyebrow{font-family:var(--serif);font-size:.65rem;font-weight:300;letter-spacing:.22em;color:var(--gold);
          margin-bottom:.9rem;display:flex;align-items:center;gap:.9rem;}
        .eyebrow::after{content:'';flex:1;max-width:32px;height:1px;background:var(--gold3);}
        .sh{font-family:var(--serif);font-weight:600;font-size:clamp(1.6rem,2.8vw,2.6rem);
          line-height:1.15;letter-spacing:-.02em;margin-bottom:.7rem;}
        .sh em{font-weight:700;color:var(--gold2);font-style:normal;}
        .sub{font-size:.97rem;color:#e0d8c8;max-width:58ch;line-height:1.82;margin-bottom:3rem;
          text-align:justify;hyphens:auto;}
        .gold-rule{width:32px;height:1px;background:var(--gold3);margin:1.2rem 0 2rem;}

        /* STORY BG */
        .story-bg{background:var(--dark2);}
        .story-grid{display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:start;}
        .story-text p{font-size:.97rem;color:#e0d8c8;line-height:1.9;margin-bottom:1.3rem;text-align:justify;hyphens:auto;}

        /* ENTITY */
        .entity-stack{display:flex;flex-direction:column;gap:.65rem;margin-top:2rem;}
        .entity{border:1px solid var(--border2);border-left:1px solid var(--border);background:var(--dark3);
          padding:1rem 1.2rem;display:grid;grid-template-columns:auto 1fr;gap:1rem;align-items:start;}
        .e-flag{font-size:1.1rem;}
        .e-name{font-family:var(--serif);font-size:.72rem;letter-spacing:.1em;color:var(--gold2);margin-bottom:.2rem;}
        .e-desc{font-size:.82rem;color:#c8bfa8;line-height:1.55;text-align:justify;hyphens:auto;}

        /* PROD CARDS */
        .prod-bg{background:var(--dark);}
        .prod-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border2);}
        .prod-grid.three{grid-template-columns:1fr 1fr 1fr;}
        .prod-card{background:var(--dark2);padding:2.2rem 2rem;position:relative;overflow:hidden;transition:background .3s;}
        .prod-card:hover{background:var(--dark3);}
        .prod-card.featured{background:var(--dark3);}
        .prod-card-accent{position:absolute;top:0;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,var(--gold3),transparent);}
        .pc-tag{font-family:var(--serif);font-size:.6rem;letter-spacing:.16em;color:var(--cream3);margin-bottom:.7rem;}
        .pc-badge{display:inline-block;font-family:var(--serif);font-size:.58rem;letter-spacing:.1em;color:var(--gold);
          border:1px solid var(--border);padding:.18rem .55rem;margin-right:.4rem;margin-bottom:.7rem;}
        .pc-badge.live{color:#7aad7a;border-color:rgba(122,173,122,0.3);}
        .pc-name{font-family:var(--serif);font-size:1.3rem;font-weight:600;color:var(--cream);
          margin-bottom:.6rem;line-height:1.2;letter-spacing:-.01em;}
        .pc-name em{font-weight:700;color:var(--gold2);font-style:normal;}
        .pc-desc{font-size:.87rem;color:#e0d8c8;line-height:1.78;margin-bottom:1.3rem;text-align:justify;hyphens:auto;}
        .pc-params{border-top:1px solid var(--border2);}
        .pc-row{display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--border2);font-size:.78rem;}
        .pc-row:last-child{border-bottom:none;}
        .pc-row span:first-child{color:var(--cream3);}
        .pc-row span:last-child{font-weight:500;color:var(--cream2);}
        .pc-row span.acc{color:var(--gold2);}

        /* DIFFERENZIERUNG */
        .diff-grid{display:grid;grid-template-columns:1fr 1.4fr;gap:6rem;align-items:start;}
        .diff-block{display:flex;gap:1.4rem;align-items:flex-start;padding:1.4rem 1.6rem;
          border:1px solid rgba(196,149,74,0.1);background:var(--dark2);margin-bottom:1px;}
        .diff-num{font-family:var(--serif);font-size:.65rem;font-weight:300;letter-spacing:.14em;
          color:var(--gold3);flex-shrink:0;padding-top:.1rem;}
        .diff-text{font-size:.9rem;color:#e0d8c8;line-height:1.75;text-align:justify;hyphens:auto;}

        /* COLLATERAL SVG SECTION */
        .collateral-bg{background:var(--dark2);}
        .strat-box{margin-top:3rem;padding:2rem;background:rgba(196,149,74,0.05);
          border:1px solid rgba(196,149,74,0.2);border-left:3px solid var(--gold);}

        /* TEAM */
        .team-bg{background:var(--dark2);}
        .team-card{background:var(--dark2);padding:1.8rem 1.5rem;transition:background .3s;
          border:1px solid var(--border2);}
        .team-card:hover{background:var(--dark3);}
        .t-name{font-family:var(--serif);font-size:.98rem;font-weight:600;color:var(--cream);margin-bottom:.2rem;}
        .t-role{font-family:var(--serif);font-size:.62rem;letter-spacing:.12em;color:var(--gold3);margin-bottom:.8rem;}
        .t-desc{font-size:.84rem;color:#c8bfa8;line-height:1.7;text-align:justify;hyphens:auto;}

        /* CONTACT FORM */
        .form-label{display:block;font-family:var(--serif);font-size:.62rem;letter-spacing:.14em;
          color:#8a8278;text-transform:uppercase;margin-bottom:.5rem;}
        .form-input{width:100%;padding:.75rem 1rem;background:var(--dark2);
          border:1px solid rgba(196,149,74,0.18);border-radius:2px;color:var(--cream2);
          font-size:.9rem;font-family:var(--sans);outline:none;transition:border-color .2s;}
        .form-input:focus{border-color:rgba(196,149,74,0.45);}
        .submit-btn{padding:.85rem 2.2rem;background:var(--gold);color:#080806;
          font-family:var(--sans);font-size:.75rem;font-weight:600;letter-spacing:.08em;
          text-transform:uppercase;border-radius:2px;border:none;cursor:pointer;transition:background .15s;}
        .submit-btn:hover{background:var(--gold2);}

        /* CAT DIVIDER */
        .cat-divider{font-family:var(--serif);font-size:.62rem;letter-spacing:.2em;color:var(--gold3);
          padding:1rem 0;margin:2rem 0 1.2rem;border-top:1px solid var(--border2);}

        /* IMPRESSUM BG */
        .imp-bg{background:var(--dark3);border-top:1px solid var(--border2);}
        .imp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:3rem;}
        .imp-block h4{font-family:var(--serif);font-size:.62rem;letter-spacing:.16em;color:var(--gold3);
          margin-bottom:.9rem;padding-bottom:.6rem;border-bottom:1px solid var(--border2);}
        .imp-block address{font-size:.82rem;color:var(--cream3);line-height:2;font-style:normal;}
        .imp-legal{margin-top:3rem;padding-top:2rem;border-top:1px solid var(--border2);}
        .imp-legal p{font-size:.77rem;color:#b8b0a0;line-height:1.8;margin-bottom:.7rem;}
        .imp-legal strong{color:var(--cream3);font-weight:500;}

        /* RESPONSIVE */
        @media(max-width:1000px){
          nav{padding:1rem 2rem;}
          .nav-links{display:none;}
          .nav-ham{display:block!important;}
          .section{padding:5rem 2rem;}
          .story-grid,.diff-grid{grid-template-columns:1fr;gap:3rem;}
          .prod-grid,.prod-grid.three{grid-template-columns:1fr;}
          .imp-grid{grid-template-columns:1fr 1fr;}
        }
        @media(max-width:700px){
          .hero-inner{padding:7rem 1.5rem 4rem!important;}
          .hero-h1{font-size:clamp(2.2rem,9vw,3rem)!important;}
          .hero-metrics{flex-wrap:wrap;gap:1rem;}
          .hm-divider{display:none;}
          .imp-grid{grid-template-columns:1fr;}
        }
        @media(max-width:600px){
          .prod-grid.three{grid-template-columns:1fr;}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav>
        <a href="#home">
          <img
            src="https://goldspot.cz/revestiumlogo.png"
            alt="REVESTIUM Group Switzerland"
            style={{ height: "34px", width: "auto", objectFit: "contain" }}
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              t.style.display = "none";
              const span = document.createElement("span");
              span.style.cssText = "font-family:'Commissioner',sans-serif;font-size:.9rem;font-weight:600;letter-spacing:.04em;color:#d4aa6a;";
              span.textContent = "REVESTIUM";
              t.parentElement?.appendChild(span);
            }}
          />
        </a>
        <ul className="nav-links">
          {[
            { label: "Use Cases", href: "#use-cases" },
            { label: "Collateral", href: "#collateral" },
            { label: "Differenzierung", href: "#differenzierung" },
            { label: "Struktur", href: "#struktur" },
          ].map((item) => (
            <li key={item.label}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a href="#kontakt" className="nav-cta">Kontakt</a>
          <button
            className="nav-ham"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#c8bfa8", padding: ".4rem" }}
            aria-label="Menü"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {menuOpen ? (
                <><line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5"/><line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="1.5"/></>
              ) : (
                <><line x1="3" y1="7" x2="19" y2="7" stroke="currentColor" strokeWidth="1.5"/><line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="1.5"/><line x1="3" y1="15" x2="19" y2="15" stroke="currentColor" strokeWidth="1.5"/></>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{ position: "fixed", top: "71px", left: 0, right: 0, zIndex: 99, background: "rgba(8,8,6,0.98)", borderBottom: "1px solid rgba(196,149,74,0.14)", padding: "1.5rem 2rem 2rem" }}>
          {[
            { label: "Use Cases", href: "#use-cases" },
            { label: "Collateral", href: "#collateral" },
            { label: "Differenzierung", href: "#differenzierung" },
            { label: "Struktur", href: "#struktur" },
            { label: "Kontakt", href: "#kontakt" },
          ].map((item) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: ".8rem 0", borderBottom: "1px solid rgba(196,149,74,0.08)", fontFamily: "'Commissioner',sans-serif", fontSize: ".8rem", letterSpacing: ".14em", textTransform: "uppercase", color: "#c8bfa8" }}>
              {item.label}
            </a>
          ))}
        </div>
      )}

      {/* ── SECTION 1: HERO ── */}
      <section className="hero" id="home">
        <div className="hero-veil" />
        <div className="hero-lines" />
        <div className="hero-inner">
          <div className="hero-left" style={{ maxWidth: "560px" }}>
            <div className="hero-accent-line anim1" />
            <p className="hero-eyebrow anim2">Für Banken &amp; Fonds · EU &amp; Schweiz</p>
            <h1 className="hero-h1 anim3">
              Gold‑Infrastruktur für <em>beide Seiten</em> Ihrer Bilanz.
            </h1>
            <p className="hero-sub anim4">
              Gold Bank, Gold Hypo und institutsfähige Collateral‑Strukturen verbinden physischen
              Edelmetall‑Bestand mit digitalen Konten, Kreditprogrammen und Treasury‑Steuerung –
              für Banken und Fonds im EU‑ und Schweizer Markt.
            </p>
            <div className="hero-ctas anim5">
              <a href="#use-cases" className="hero-btn-primary">Use Cases für Banken &amp; Fonds</a>
              <a href="#struktur" className="hero-btn-ghost">Regulatorischer Überblick</a>
            </div>
            <div className="hero-divider anim6" />
            <div className="hero-metrics anim7">
              <div className="hm">
                <p className="hm-val">LBMA</p>
                <p className="hm-label">Good Delivery Standard</p>
              </div>
              <div className="hm-divider" />
              <div className="hm">
                <p className="hm-val">4</p>
                <p className="hm-label">Rechtsordnungen</p>
              </div>
              <div className="hm-divider" />
              <div className="hm">
                <p className="hm-val">MiFID II</p>
                <p className="hm-label">EU Passporting bereit</p>
              </div>
              <div className="hm-divider" />
              <div className="hm">
                <p className="hm-val">D&amp;B H1</p>
                <p className="hm-label">Bonitätsrating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: USE CASES ── */}
      <section id="use-cases" className="section" style={{ background: "var(--dark2)" }}>
        <div className="section-inner">
          <div className="reveal">
            <p className="eyebrow">Business Development &amp; Produkt</p>
            <h2 className="sh">Use Cases für Ihre Produkt‑ und <em>Business‑Teams</em></h2>
            <div className="gold-rule" />
            <p className="sub">
              Drei sofort einsatzfähige Produktmodule – separat oder als integriertes Ökosystem –
              mit vollständiger operativer Infrastruktur durch Swiss Gold Deposit Group.
            </p>
          </div>

          <div className="prod-grid three reveal">
            {/* Card 1 */}
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge live">Rollout</span>
              <p className="pc-tag">Digitale Einlagen &amp; Zahlungen</p>
              <p className="pc-name">Gold Bank</p>
              <p className="pc-desc">
                Goldkonten in CZK/EUR mit automatischem Sparprogramm in physischem Gold.
                Gold Card: Zahlungen weltweit direkt vom Goldguthaben. White‑Label‑ oder
                Co‑Branding‑Modelle für Banken und Nichtbank‑Institute.
              </p>
              <div className="pc-params">
                <div className="pc-row"><span>Unterlegung</span><span>LBMA Good Delivery</span></div>
                <div className="pc-row"><span>Kreditkonto</span><span>CZK &amp; EUR</span></div>
                <div className="pc-row"><span>Karte</span><span>Mastercard · weltweit</span></div>
                <div className="pc-row"><span>Modell</span><span className="acc">White‑Label · Co‑Branding</span></div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge" style={{ color: "#c08080", borderColor: "rgba(192,128,128,0.3)" }}>Zero Competition EU</span>
              <span className="pc-badge live">Ready to launch</span>
              <p className="pc-tag">Langfristiger Goldkredit</p>
              <p className="pc-name">Gold Hypo</p>
              <p className="pc-desc">
                Bankkredit, vollständig durch physisches, segregiertes Gold besichert – ohne
                operatives Gold‑Risiko in Ihrer Bilanz. Verwahrung, tägliche Bewertung
                (LBMA PM Fix), Warrant‑Ausstellung und Ausfallmanagement (T+2).
              </p>
              <div className="pc-params">
                <div className="pc-row"><span>Laufzeit</span><span>5–20 Jahre</span></div>
                <div className="pc-row"><span>LTV</span><span className="acc">bis zu 80 %</span></div>
                <div className="pc-row"><span>Margin Call</span><span>LTV ≥ 88 %</span></div>
                <div className="pc-row"><span>Onboarding</span><span className="acc">2–5 Tage</span></div>
                <div className="pc-row"><span>EU‑Wettbewerber</span><span className="acc">keine bekannten</span></div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge" style={{ color: "#c4954a", borderColor: "rgba(196,149,74,0.3)" }}>Institutional</span>
              <span className="pc-badge live">Roadmap 2026</span>
              <p className="pc-tag">PGI / Collateral Infrastructure</p>
              <p className="pc-name">Gold als Sicherheiten‑Infrastruktur</p>
              <p className="pc-desc">
                Strukturierte Nutzung von physischem Gold als Sicherheitenbasis für Lombard‑,
                Repo‑, Kredit‑ und Intraday‑Linien. Anlehnung an das World Gold Council /
                Linklaters‑Modell für Pooled Gold Interests (PGI, 2025).
              </p>
              <div className="pc-params">
                <div className="pc-row"><span>Instrument</span><span>PGI / Warrant / Zastavní CP</span></div>
                <div className="pc-row"><span>Settlement</span><span className="acc">Atomic · T+0 / T+2</span></div>
                <div className="pc-row"><span>Rechtsrahmen</span><span>EMIR · English Law · OZ</span></div>
                <div className="pc-row"><span>CCP‑Tauglichkeit</span><span className="acc">EU/UK EMIR</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: COLLATERAL FLOW ── */}
      <section id="collateral" className="section prod-bg">
        <div className="section-inner">
          <div className="reveal">
            <p className="eyebrow">World Gold Council · Linklaters LLP · 2025</p>
            <h2 className="sh">Gold as Collateral —<br /><em>institutionelle Infrastruktur</em></h2>
            <div className="gold-rule" />
            <p className="sub">
              Das WGC/Linklaters‑Whitepaper (2025) beschreibt eine strukturelle Marktlücke:
              Unallocated Gold trägt Gegenparteirisiko, Allocated Gold ist als Sicherheit operativ
              aufwändig. Pooled Gold Interests (PGI) adressieren beides durch direkte, bruchteilhafte
              Eigentumsrechte an segregiertem physischen Gold – CCP‑tauglich, elektronisch
              übertragbar, ohne physische Bewegung der Barren.
            </p>
          </div>

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
              </defs>
              <rect width="860" height="340" fill="#0e0d0a" rx="6" />
              <rect x="1" y="1" width="858" height="338" fill="none" stroke="#c4954a" strokeWidth=".5" rx="6" opacity=".2" />
              {/* NODE 1: KUNDE */}
              <rect x="20" y="100" width="148" height="140" rx="6" fill="#141310" stroke="#c4954a" strokeWidth="1" opacity=".9" />
              <rect x="20" y="100" width="148" height="4" rx="3" fill="#c4954a" opacity=".7" />
              <text x="94" y="122" textAnchor="middle" fill="#c4954a" fontSize="10" fontWeight="600" letterSpacing=".12em">KUNDE</text>
              <text x="94" y="142" textAnchor="middle" fill="#ede8dc" fontSize="9.5" opacity=".85">Eigentümer von</text>
              <text x="94" y="156" textAnchor="middle" fill="#ede8dc" fontSize="9.5" opacity=".85">physischem Gold</text>
              <text x="94" y="175" textAnchor="middle" fill="#c8bfa8" fontSize="8.5" opacity=".7">Will nicht verkaufen</text>
              <text x="94" y="189" textAnchor="middle" fill="#c8bfa8" fontSize="8.5" opacity=".7">Braucht Liquidität</text>
              <text x="94" y="210" textAnchor="middle" fill="#7aad7a" fontSize="8" opacity=".8">◎ Erhält Kredit</text>
              <text x="94" y="224" textAnchor="middle" fill="#7aad7a" fontSize="8" opacity=".8">◎ Zahlt an Bank zurück</text>
              <text x="94" y="238" textAnchor="middle" fill="#7aad7a" fontSize="8" opacity=".8">◎ Gold zurück nach Tilgung</text>
              {/* NODE 2: COLLATERAL AGENT */}
              <rect x="296" y="60" width="188" height="220" rx="6" fill="#1c1a16" stroke="#c4954a" strokeWidth="1.5" />
              <rect x="296" y="60" width="188" height="5" rx="3" fill="#c4954a" />
              <text x="390" y="86" textAnchor="middle" fill="#c4954a" fontSize="9.5" fontWeight="700" letterSpacing=".12em">REVESTIUM AG</text>
              <text x="390" y="102" textAnchor="middle" fill="#c4954a" fontSize="9" opacity=".8">Collateral Agent</text>
              <line x1="310" y1="112" x2="470" y2="112" stroke="#c4954a" strokeWidth=".4" opacity=".3" />
              <text x="390" y="130" textAnchor="middle" fill="#ede8dc" fontSize="9" opacity=".9">Bewertung + Verwahrung</text>
              <text x="390" y="145" textAnchor="middle" fill="#ede8dc" fontSize="9" opacity=".9">LBMA AM/PM Fix täglich</text>
              <text x="390" y="165" textAnchor="middle" fill="#c8bfa8" fontSize="8.5" opacity=".75">Warrant / Wertpapieremission</text>
              <text x="390" y="179" textAnchor="middle" fill="#c8bfa8" fontSize="8.5" opacity=".75">Ausfallmanagement T+2</text>
              <text x="390" y="193" textAnchor="middle" fill="#c8bfa8" fontSize="8.5" opacity=".75">Versicherung Kooperativa</text>
              <text x="390" y="207" textAnchor="middle" fill="#c8bfa8" fontSize="8.5" opacity=".75">Margin Call LTV ≥ 88 %</text>
              <text x="390" y="221" textAnchor="middle" fill="#c8bfa8" fontSize="8.5" opacity=".75">Forced Sale LTV ≥ 95 %</text>
              <rect x="316" y="237" width="148" height="28" rx="4" fill="rgba(196,149,74,0.12)" stroke="rgba(196,149,74,0.3)" strokeWidth=".8" />
              <text x="390" y="254" textAnchor="middle" fill="#c4954a" fontSize="8.5" fontWeight="600">Swiss Gold Deposit Group</text>
              {/* NODE 3: BANK */}
              <rect x="576" y="100" width="148" height="140" rx="6" fill="#141310" stroke="#c4954a" strokeWidth="1" opacity=".9" />
              <rect x="576" y="100" width="148" height="4" rx="3" fill="#c4954a" opacity=".7" />
              <text x="650" y="122" textAnchor="middle" fill="#c4954a" fontSize="10" fontWeight="600" letterSpacing=".12em">BANK / FONDS</text>
              <text x="650" y="142" textAnchor="middle" fill="#ede8dc" fontSize="9.5" opacity=".85">Kreditgeber</text>
              <text x="650" y="160" textAnchor="middle" fill="#c8bfa8" fontSize="8.5" opacity=".7">Vertrag mit Kunden</text>
              <text x="650" y="174" textAnchor="middle" fill="#c8bfa8" fontSize="8.5" opacity=".7">Hält den Warrant</text>
              <text x="650" y="188" textAnchor="middle" fill="#c8bfa8" fontSize="8.5" opacity=".7">Kein Gold‑Operationsrisiko</text>
              <text x="650" y="207" textAnchor="middle" fill="#7aad7a" fontSize="8" opacity=".8">◎ Sauberes P&amp;L</text>
              <text x="650" y="221" textAnchor="middle" fill="#7aad7a" fontSize="8" opacity=".8">◎ T+2 Realisierung</text>
              <text x="650" y="235" textAnchor="middle" fill="#7aad7a" fontSize="8" opacity=".8">◎ RWA 0–20 % (Basel)</text>
              {/* NODE 4: LBMA EXIT */}
              <rect x="296" y="310" width="188" height="22" rx="4" fill="rgba(196,149,74,0.08)" stroke="rgba(196,149,74,0.25)" strokeWidth=".8" />
              <text x="390" y="325" textAnchor="middle" fill="#c8bfa8" fontSize="8.5" opacity=".75">LBMA‑Partner · CME/LPMCL · T+2 Liquidation</text>
              {/* ARROWS */}
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
              <span className="pc-badge" style={{ color: "#c4954a", borderColor: "rgba(196,149,74,0.3)" }}>Institutional</span>
              <span className="pc-badge live">Roadmap 2026</span>
              <p className="pc-tag">Gold Margining · OTC Counterparties</p>
              <p className="pc-name">Gold OTC Margining</p>
              <p className="pc-desc">Gold‑Margining für ausgewählte bilaterale Gegenparteien: physisches LBMA‑Gold als Sicherheit für OTC‑Derivate‑Positionen ohne physische Segregation. Kompatibel mit EU/UK EMIR Uncleared Margin Rules. Basis: PGI‑Struktur als „Thing in Action" – elektronisch übertragbar, insolvenzfern.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Instrument</span><span>PGI / Warrant / Zastavní CP</span></div>
                <div className="pc-row"><span>Settlement</span><span className="acc">Atomic · T+0 / T+2</span></div>
                <div className="pc-row"><span>Rechtsrahmen</span><span>EMIR · OZ · English Law</span></div>
              </div>
            </div>
            <div className="prod-card">
              <p className="pc-tag">Cheapest‑to‑Deliver Collateral</p>
              <p className="pc-name">Collateral Optimization Engine</p>
              <p className="pc-desc">Intelligente Substitution zwischen Barmitteln, US‑Staatsanleihen und physischem Gold – automatische Auswahl der kostengünstigsten verfügbaren Sicherheit für jede Margin‑Obligation. Integration mit Dealer Commander für Echtzeit‑Bewertung.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Assets</span><span>Gold · Cash · UST · Repo</span></div>
                <div className="pc-row"><span>Bewertung</span><span>LBMA PM Fix · Echtzeit</span></div>
              </div>
            </div>
          </div>

          <p className="cat-divider reveal">B — Triparty &amp; Custody‑Enabled Collateral</p>
          <div className="prod-grid reveal">
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge" style={{ color: "#c4954a", borderColor: "rgba(196,149,74,0.3)" }}>Kein Tresortransfer</span>
              <span className="pc-badge live">Roadmap 2027</span>
              <p className="pc-tag">Triparty Custody · CCP &amp; FMI</p>
              <p className="pc-name">Triparty Gold Custody</p>
              <p className="pc-desc">Sicherheiteninteresse an physischem Gold ohne physische Bewegung der Barren. Übertragung über Warrant‑Instrument oder PGI‑Struktur. Kompatibel mit CCP‑Clearing (Initial Margin, Default Fund) und FMI‑Anforderungen.</p>
              <div className="pc-params">
                <div className="pc-row"><span>CCP‑Tauglichkeit</span><span className="acc">EU/UK EMIR · Initial Margin</span></div>
                <div className="pc-row"><span>Insolvenzschutz</span><span>Segregiert · insolvenzfern</span></div>
              </div>
            </div>
            <div className="prod-card">
              <span className="pc-badge">Legal Pack</span>
              <p className="pc-tag">Treasury &amp; Risk Teams</p>
              <p className="pc-name">Collateral Legal &amp; Reporting Pack</p>
              <p className="pc-desc">Vollständiges juristisches und operatives Paket: tägliche Bewertungsreporte nach LBMA PM Fix, Margin‑Call‑Dokumentation, Legal Opinion (CZ/SK/UK/CH), Auditpfad, ISDA‑kompatible Sicherheitenvereinbarungen.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Reporting</span><span>Täglich · LBMA PM Fix</span></div>
                <div className="pc-row"><span>ISDA</span><span>Credit Support Annex konform</span></div>
              </div>
            </div>
          </div>

          <p className="cat-divider reveal">C — Gold Financing</p>
          <div className="prod-grid reveal">
            <div className="prod-card featured">
              <div className="prod-card-accent" />
              <span className="pc-badge">Intraday Liquidity</span>
              <span className="pc-badge live">Roadmap 2026–27</span>
              <p className="pc-tag">Lombard · Credit Lines</p>
              <p className="pc-name">Gold Credit Lines</p>
              <p className="pc-desc">Lombard‑ und Kreditlinien gegen transparent evidiertes physisches Gold: digitale Evidenz im eigenen Register oder via CDCP, tägliche Bewertung, automatisches Margin Management.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Struktur</span><span>Revolving · Lombard · Kreditlinie</span></div>
                <div className="pc-row"><span>Bewertung</span><span className="acc">LBMA PM Fix · tägliches MTM</span></div>
              </div>
            </div>
            <div className="prod-card">
              <span className="pc-badge">Intraday</span>
              <p className="pc-tag">Digital Metal Collateral</p>
              <p className="pc-name">Intraday Gold Liquidity Lines</p>
              <p className="pc-desc">Intraday‑Liquiditätslinien gegen digital evidiertes Metall‑Kollateral – atomare Aktivierung und Rückgabe innerhalb des Handelstages. Adressiert den im WGC/Linklaters‑Whitepaper identifizierten Use Case.</p>
              <div className="pc-params">
                <div className="pc-row"><span>Aktivierung</span><span className="acc">Atomic · T+0 intraday</span></div>
                <div className="pc-row"><span>Basis</span><span>WGC PGI‑Ökosystem 2025</span></div>
              </div>
            </div>
          </div>

          <div className="strat-box reveal">
            <p className="eyebrow" style={{ marginBottom: ".8rem" }}>Strategische Begründung</p>
            <p style={{ fontSize: ".88rem", color: "var(--cream3)", lineHeight: 1.8, maxWidth: "80ch" }}>
              Das Linklaters/WGC‑Whitepaper (2025) identifiziert eine fundamentale Marktlücke: Unallocated Gold trägt
              Kontrahentenrisiko und ist nicht EMIR‑konform. Allocated Gold ist operativ unpraktisch als Sicherheit.{" "}
              <strong style={{ color: "var(--cream)" }}>PGI lösen beides – und schaffen einen dritten Grundpfeiler des Goldmarkts.</strong>{" "}
              Die Gruppe positioniert sich als Collateral Agent und Custody‑Infrastruktur für diesen entstehenden Markt.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: DIFFERENZIERUNG ── */}
      <section id="differenzierung" className="section" style={{ background: "var(--dark2)" }}>
        <div className="section-inner">
          <div className="diff-grid">
            <div className="reveal">
              <p className="eyebrow">Differenzierung</p>
              <h2 className="sh">Warum diese Gold‑Infrastruktur <em>anders</em> ist</h2>
              <div className="gold-rule" />
              <p style={{ fontSize: ".9rem", color: "#c8bfa8", lineHeight: 1.82, textAlign: "justify", hyphens: "auto" }}>
                Integrierte Infrastruktur statt fragmentierter Insellösungen – physischer Handel,
                institutionelle Verwahrung, regulierte Kreditprodukte und Compliance auf einer Plattform,
                für vier Rechtsordnungen.
              </p>
            </div>
            <div>
              {[
                { n: "01", text: "Kombination aus physischem Handel, Verwahrung, Kreditprodukten und Compliance auf einer Plattform – keine Insellösungen." },
                { n: "02", text: "Juristische und forensische Strukturierung: RTO‑Erfahrung an der London Stock Exchange, EU‑MiFID‑Struktur, Schweizer Tokenisierungs‑Holding." },
                { n: "03", text: "Dun & Bradstreet Rating H1 für die operative Einheit in Prag – niedriges Gesamtrisiko, stabiler Viability Score." },
              ].map((item) => (
                <div key={item.n} className="diff-block reveal">
                  <span className="diff-num">{item.n}</span>
                  <p className="diff-text">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: STRUKTUR & REGULIERUNG ── */}
      <section id="struktur" className="section story-bg">
        <div className="section-inner">
          <div className="story-grid">
            <div className="reveal">
              <p className="eyebrow">Rechtliche Struktur</p>
              <h2 className="sh">Vier Rechtsordnungen,<br /><em>eine Unternehmensgruppe</em></h2>
              <div className="gold-rule" />
              <div className="story-text">
                <p>
                  REVESTIUM AG (Zug) bündelt Holding‑, Tokenisierungs‑ und Governance‑Funktionen.
                  JURISCONSULT LTD (London/Prag) stellt die kapitalmarkt‑ und rechtliche Struktur mit
                  MiFID‑fähigen Instrumenten und D&B‑Rating H1. SWISS GOLD DEPOSIT Ltd (Dublin) ist auf
                  den Vertrieb von Produkten innerhalb der EU gemäß MiFID II vorbereitet, SWISS ARROWS
                  s.r.o. (Prag) betreibt Technologie‑, Entwicklungs‑ und Back‑Office‑Kapazitäten.
                </p>
              </div>
              <div style={{ marginTop: "2rem", padding: "1rem 1.4rem", border: "1px solid rgba(196,149,74,0.12)", background: "rgba(196,149,74,0.04)", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginTop: "0.1rem", flexShrink: 0, color: "#c4954a" }}>
                  <circle cx="7" cy="7" r="6" stroke="#c4954a" strokeWidth="1" />
                  <path d="M5 7l1.5 1.5L9.5 5.5" stroke="#c4954a" strokeWidth="1" strokeLinecap="round" />
                </svg>
                <p style={{ fontSize: ".82rem", color: "#c8bfa8", lineHeight: 1.6, fontStyle: "italic" }}>
                  Voll konform mit FATF‑Empfehlungen, EU‑AMLD, LBMA Responsible Sourcing und Datenschutzanforderungen.
                </p>
              </div>
            </div>

            <div className="reveal d2">
              <p className="eyebrow">Struktur &amp; Rechtsordnungen</p>
              <h2 className="sh">Vier Einheiten,<br /><em>eine Infrastruktur</em></h2>
              <div className="gold-rule" />
              <div className="entity-stack">
                {[
                  { flag: "🇨🇭", name: "REVESTIUM AG — Zug, Schweiz", desc: "Holding & Tokenisierung · Gegründet 2020 · Governance für alle Jurisdiktionen" },
                  { flag: "🇬🇧", name: "JURISCONSULT LTD — London, Vereinigtes Königreich", desc: "LEI: 315700UZ1Y9WYP99U441 · Companies House: 12729220 · MiFID‑Struktur, D&B Rating H1, Kapitalmarktrecht" },
                  { flag: "🇮🇪", name: "SWISS GOLD DEPOSIT Ltd — Dublin, Irland", desc: "Bereit für die Registrierung in 27 EU‑Mitgliedstaaten · Vertrieb gemäß MiFID II" },
                  { flag: "🇨🇿", name: "SWISS ARROWS s.r.o. — Prag, Tschechische Republik", desc: "IČ: 09913840 · LEI: 315700343MOJGZ62NN31 · Technologie & Back‑Office · Czech Assay Office Lizenz" },
                ].map((entity) => (
                  <div key={entity.name} className="entity">
                    <div className="e-flag">{entity.flag}</div>
                    <div>
                      <p className="e-name">{entity.name}</p>
                      <p className="e-desc">{entity.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: KONTAKT ── */}
      <section id="kontakt" className="section" style={{ background: "var(--dark)" }}>
        <div className="section-inner">
          <div className="story-grid">
            <div className="reveal">
              <p className="eyebrow">Direktkontakt</p>
              <h2 className="sh">Kontakt für <em>Banken &amp; Fonds</em></h2>
              <div className="gold-rule" />

              <div style={{ padding: "1.6rem", border: "1px solid rgba(196,149,74,0.15)", background: "var(--dark2)", marginBottom: "1.8rem" }}>
                <div style={{ fontFamily: "'Commissioner',sans-serif", fontSize: ".72rem", letterSpacing: ".1em", color: "#d4aa6a", marginBottom: ".3rem", textTransform: "uppercase" }}>
                  Mag. iur. Augustina F. Schiller, MSc., LLM.
                </div>
                <div style={{ fontSize: ".8rem", color: "#8a8278", lineHeight: 1.5 }}>
                  President &amp; CEO · Founder · Chief Legal Officer
                </div>
              </div>

              <p style={{ fontSize: ".9rem", color: "#c8bfa8", lineHeight: 1.82, textAlign: "justify", hyphens: "auto", marginBottom: "2rem" }}>
                Gerne erläutern wir Ihnen konkrete Strukturen für Gold Bank, Gold Hypo oder
                goldbasierte Sicherheitenprogramme in einem vertraulichen Gespräch.
              </p>

              <div className="team-card" style={{ padding: "1.6rem" }}>
                <p className="eyebrow" style={{ marginBottom: ".8rem" }}>Büros &amp; Jurisdiktionen</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  {[
                    { flag: "🇨🇭", city: "Zug", note: "REVESTIUM AG" },
                    { flag: "🇬🇧", city: "London", note: "JURISCONSULT LTD" },
                    { flag: "🇮🇪", city: "Dublin", note: "Swiss Gold Deposit Ltd" },
                    { flag: "🇨🇿", city: "Prag", note: "Swiss Arrows s.r.o." },
                  ].map((o) => (
                    <div key={o.city} style={{ display: "flex", alignItems: "flex-start", gap: ".6rem" }}>
                      <span style={{ fontSize: "1.1rem" }}>{o.flag}</span>
                      <div>
                        <div style={{ fontFamily: "'Commissioner',sans-serif", fontSize: "1rem", fontWeight: 600, color: "#d4aa6a", letterSpacing: "-.01em" }}>{o.city}</div>
                        <div style={{ fontFamily: "'Commissioner',sans-serif", fontSize: ".6rem", letterSpacing: ".12em", color: "#8a8278", textTransform: "uppercase" }}>{o.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="reveal d2">
              {formSubmitted ? (
                <div style={{ padding: "3rem 2rem", border: "1px solid rgba(196,149,74,0.2)", background: "var(--dark2)", textAlign: "center" }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ margin: "0 auto 1rem", display: "block" }}>
                    <circle cx="16" cy="16" r="15" stroke="#c4954a" strokeWidth="1" />
                    <path d="M10 16l4 4 8-8" stroke="#c4954a" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <p style={{ fontFamily: "'Commissioner',sans-serif", fontSize: ".85rem", color: "#d4aa6a", letterSpacing: ".06em" }}>Ihre Anfrage wurde übermittelt.</p>
                  <p style={{ fontSize: ".82rem", color: "#8a8278", marginTop: ".5rem" }}>Wir melden uns zeitnah bei Ihnen.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                  {[
                    { id: "name", label: "Name", type: "text", placeholder: "Vor- und Nachname" },
                    { id: "institution", label: "Institution", type: "text", placeholder: "Bank, Fonds oder Institut" },
                    { id: "email", label: "E‑Mail", type: "email", placeholder: "Ihre E‑Mail‑Adresse" },
                  ].map((field) => (
                    <div key={field.id}>
                      <label className="form-label">{field.label}</label>
                      <input
                        className="form-input"
                        type={field.type}
                        placeholder={field.placeholder}
                        required
                        value={formData[field.id as keyof typeof formData]}
                        onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="form-label">Nachricht</label>
                    <textarea
                      className="form-input"
                      placeholder="Beschreiben Sie Ihr Interesse oder Ihre Fragestellung"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      style={{ resize: "vertical" }}
                    />
                  </div>
                  <div>
                    <button type="submit" className="submit-btn">Anfrage senden</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER / IMPRESSUM ── */}
      <footer className="section imp-bg" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="section-inner">
          <div className="imp-grid">
            <div className="imp-block">
              <h4>REVESTIUM AG</h4>
              <address>
                Zug, Schweiz<br />
                Holding &amp; Tokenisierung<br />
                Schweizer DLT‑Gesetz
              </address>
            </div>
            <div className="imp-block">
              <h4>JURISCONSULT LTD</h4>
              <address>
                London, Vereinigtes Königreich<br />
                LEI: 315700UZ1Y9WYP99U441<br />
                Companies House: 12729220
              </address>
            </div>
            <div className="imp-block">
              <h4>SWISS GOLD DEPOSIT Ltd</h4>
              <address>
                Dublin, Irland<br />
                MiFID II · EU Passporting<br />
                27 EU‑Mitgliedstaaten bereit
              </address>
            </div>
          </div>
          <div className="imp-legal">
            <p>
              <strong>Compliance:</strong> Voll konform mit FATF‑Empfehlungen, EU‑AMLD, LBMA Responsible Sourcing und
              Datenschutzanforderungen. D&B Bonitätsrating H1 für die operative Einheit SWISS ARROWS s.r.o. (Prag).
            </p>
            <p style={{ color: "#8a8278" }}>
              © {new Date().getFullYear()} REVESTIUM AG, Zug · JURISCONSULT LTD, London · Swiss Gold Deposit Group
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
