import { useRef, useState } from "react";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", institution: "", email: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const useCasesRef = useRef<HTMLElement>(null);
  const strukturRef = useRef<HTMLElement>(null);

  function scrollTo(ref: React.RefObject<HTMLElement | null>) {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitted(true);
  }

  return (
    <div style={{ background: "#080806", color: "#fff", fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: "100vh" }}>

      {/* ── NAVIGATION ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "1.4rem 3.5rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(8,8,6,0.93)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(196,149,74,0.14)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <span style={{
            fontFamily: "'Commissioner', system-ui, sans-serif",
            fontSize: "1rem", fontWeight: 600, letterSpacing: "0.04em",
            color: "#d4aa6a",
          }}>SWISS GOLD DEPOSIT</span>
          <span style={{ color: "rgba(196,149,74,0.4)", fontSize: "0.85rem" }}>·</span>
          <span style={{
            fontFamily: "'Commissioner', system-ui, sans-serif",
            fontSize: "0.62rem", fontWeight: 300, letterSpacing: "0.18em",
            color: "#8a8278", textTransform: "uppercase",
          }}>INSTITUTIONAL</span>
        </div>

        {/* Desktop nav */}
        <ul style={{ display: "flex", gap: "2.4rem", listStyle: "none", alignItems: "center" }} className="nav-links-desktop">
          {[
            { label: "Use Cases", href: "#use-cases" },
            { label: "Differenzierung", href: "#differenzierung" },
            { label: "Struktur", href: "#struktur" },
          ].map((item) => (
            <li key={item.label}>
              <a href={item.href} style={{
                fontFamily: "'Commissioner', system-ui, sans-serif",
                fontSize: "0.72rem", fontWeight: 400, letterSpacing: "0.12em",
                color: "#c8bfa8", textTransform: "uppercase",
                transition: "color 0.3s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "#d4aa6a")}
                onMouseLeave={e => (e.currentTarget.style.color = "#c8bfa8")}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#kontakt" style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em",
              textTransform: "uppercase", padding: "0.6rem 1.4rem",
              border: "1px solid rgba(196,149,74,0.5)", color: "#c4954a",
              borderRadius: "2px", transition: "all 0.2s", whiteSpace: "nowrap",
              display: "inline-block",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(196,149,74,0.12)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              Kontakt
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none", background: "none", border: "none", cursor: "pointer",
            color: "#c8bfa8", padding: "0.4rem",
          }}
          className="nav-hamburger"
          aria-label="Menü"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {menuOpen ? (
              <>
                <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" />
                <line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="1.5" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="19" y2="7" stroke="currentColor" strokeWidth="1.5" />
                <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="1.5" />
                <line x1="3" y1="15" x2="19" y2="15" stroke="currentColor" strokeWidth="1.5" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: "71px", left: 0, right: 0, zIndex: 99,
          background: "rgba(8,8,6,0.98)", borderBottom: "1px solid rgba(196,149,74,0.14)",
          padding: "1.5rem 2rem 2rem",
        }}>
          {[
            { label: "Use Cases", href: "#use-cases" },
            { label: "Differenzierung", href: "#differenzierung" },
            { label: "Struktur", href: "#struktur" },
            { label: "Kontakt", href: "#kontakt" },
          ].map((item) => (
            <a key={item.label} href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block", padding: "0.8rem 0",
                borderBottom: "1px solid rgba(196,149,74,0.08)",
                fontFamily: "'Commissioner', system-ui, sans-serif",
                fontSize: "0.8rem", letterSpacing: "0.14em", textTransform: "uppercase",
                color: "#c8bfa8",
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      {/* ── SECTION 1: HERO ── */}
      <section style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center",
        padding: "0 3.5rem",
        background: "#080806",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle grid overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(196,149,74,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(196,149,74,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }} />

        <div style={{ maxWidth: "1160px", margin: "0 auto", paddingTop: "7rem", paddingBottom: "7rem", position: "relative", zIndex: 1, width: "100%" }}>
          {/* Eyebrow */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.9rem",
            fontFamily: "'Commissioner', system-ui, sans-serif",
            fontSize: "0.65rem", fontWeight: 300, letterSpacing: "0.22em",
            color: "#c4954a", marginBottom: "1.4rem", textTransform: "uppercase",
          }}>
            Für Banken & Fonds
            <span style={{ display: "block", width: "32px", height: "1px", background: "#a07838" }} />
          </div>

          {/* H1 */}
          <h1 style={{
            fontFamily: "'Commissioner', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 4rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            marginBottom: "1.6rem",
            maxWidth: "18ch",
          }}>
            Gold‑Infrastruktur für{" "}
            <em style={{ fontStyle: "normal", color: "#d4aa6a" }}>beide Seiten</em>{" "}
            Ihrer Bilanz.
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize: "1.05rem", color: "#e0d8c8",
            maxWidth: "60ch", lineHeight: 1.82,
            marginBottom: "2.8rem",
            textAlign: "justify",
            hyphens: "auto",
          }}>
            Gold Bank, Gold Hypo und institutsfähige Collateral‑Strukturen verbinden
            physischen Edelmetall‑Bestand mit digitalen Konten, Kreditprogrammen und
            Treasury‑Steuerung – für Banken und Fonds im EU‑ und Schweizer Markt.
          </p>

          {/* Bullet points */}
          <ul style={{ listStyle: "none", marginBottom: "3rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {[
              { label: "Gold Bank:", text: "Digitale Einlagen‑ und Zahlungslösung auf physisch hinterlegtem LBMA‑Gold." },
              { label: "Gold Hypo:", text: "Gold‑besicherte Langfristkredite – operative Umsetzung in Tagen statt Wochen." },
              { label: "Gold als Sicherheiten‑Infrastruktur:", text: "PGI‑fähige Strukturen für Lombard‑, Repo‑ und Kreditlinien." },
            ].map((item) => (
              <li key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <span style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: "#c4954a", marginTop: "0.6rem", flexShrink: 0,
                }} />
                <span style={{ fontSize: "0.95rem", color: "#e0d8c8", lineHeight: 1.7 }}>
                  <strong style={{ color: "#d4aa6a", fontWeight: 500 }}>{item.label}</strong>{" "}
                  {item.text}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap" }}>
            <a href="#use-cases" style={{
              display: "inline-block",
              padding: "0.85rem 2rem",
              background: "#c4954a",
              color: "#080806",
              fontFamily: "'Commissioner', system-ui, sans-serif",
              fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em",
              textTransform: "uppercase", borderRadius: "2px",
              border: "1px solid #c4954a",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#d4aa6a"; (e.currentTarget as HTMLElement).style.borderColor = "#d4aa6a"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#c4954a"; (e.currentTarget as HTMLElement).style.borderColor = "#c4954a"; }}
            >
              Use Cases für Banken & Fonds
            </a>
            <a href="#struktur" style={{
              display: "inline-block",
              padding: "0.85rem 2rem",
              background: "transparent",
              color: "#c4954a",
              fontFamily: "'Commissioner', system-ui, sans-serif",
              fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.12em",
              textTransform: "uppercase", borderRadius: "2px",
              border: "1px solid rgba(196,149,74,0.5)",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(196,149,74,0.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              Regulatorischer Überblick
            </a>
          </div>

          {/* Bottom rule */}
          <div style={{ marginTop: "6rem", borderTop: "1px solid rgba(196,149,74,0.1)", paddingTop: "1.5rem", display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            {["LBMA Certified", "MiFID II", "FATF Compliant", "D&B Rating H1"].map((badge) => (
              <span key={badge} style={{
                fontFamily: "'Commissioner', system-ui, sans-serif",
                fontSize: "0.6rem", letterSpacing: "0.18em",
                color: "#8a8278", textTransform: "uppercase",
              }}>{badge}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: USE CASES ── */}
      <section id="use-cases" ref={useCasesRef} style={{
        background: "#0e0d0a",
        padding: "7rem 3.5rem",
        borderTop: "1px solid rgba(196,149,74,0.08)",
      }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
          {/* Eyebrow */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.9rem",
            fontFamily: "'Commissioner', system-ui, sans-serif",
            fontSize: "0.65rem", fontWeight: 300, letterSpacing: "0.22em",
            color: "#c4954a", marginBottom: "0.9rem", textTransform: "uppercase",
          }}>
            Business Development & Produkt
            <span style={{ display: "block", width: "32px", height: "1px", background: "#a07838" }} />
          </div>

          <h2 style={{
            fontFamily: "'Commissioner', system-ui, sans-serif",
            fontWeight: 600, fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
            lineHeight: 1.15, letterSpacing: "-0.02em",
            marginBottom: "0.7rem",
          }}>
            Use Cases für Ihre Produkt‑ und Business‑Teams
          </h2>
          <div style={{ width: "32px", height: "1px", background: "#a07838", margin: "1.2rem 0 3.5rem" }} />

          {/* Three‑column card grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1px",
            background: "rgba(196,149,74,0.08)",
          }}>
            {/* Card 1 – Gold Bank */}
            <UseCaseCard
              tag="01"
              title="Gold Bank"
              subtitle="Einlagen & Zahlungen"
              bullets={[
                "Goldkonten in CZK/EUR mit automatischem Sparprogramm in physischem Gold.",
                "Gold Card: Zahlungen weltweit direkt vom Goldguthaben – Gold als tägliches Zahlungsmittel statt gebundene Anlage.",
                "White‑Label‑ oder Co‑Branding‑Modelle für Banken und Nichtbank‑Institute.",
              ]}
            />
            {/* Card 2 – Gold Hypo */}
            <UseCaseCard
              tag="02"
              title="Gold Hypo"
              subtitle="Langfristige Kredite gegen Gold"
              bullets={[
                "Bankkredit, vollständig durch physisches, segregiertes Gold besichert – ohne operatives Gold‑Risiko in Ihrer Bilanz.",
                "Wir übernehmen Verwahrung, tägliche Bewertung (LBMA PM Fix), Warrant‑Ausstellung und Ausfallmanagement (T+2).",
                "Onboarding neuer Programme in 2–5 Tagen statt 3–6 Wochen, ohne Änderung Ihrer Kreditprozesse.",
              ]}
            />
            {/* Card 3 – Collateral */}
            <UseCaseCard
              tag="03"
              title="Gold als Sicherheiten‑Infrastruktur"
              subtitle="PGI / Collateral"
              bullets={[
                "Strukturierte Nutzung von physischem Gold als Sicherheitenbasis für Lombard‑, Repo‑, Kredit‑ und Intraday‑Linien.",
                "Anlehnung an das World Gold Council / Linklaters‑Modell für Pooled Gold Interests (PGI, 2025).",
                "Integration in bestehende Treasury‑ und Margining‑Prozesse, kompatibel mit EMIR‑Rahmen.",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 3: WARUM WIR ANDERS SIND ── */}
      <section id="differenzierung" style={{
        background: "#080806",
        padding: "7rem 3.5rem",
        borderTop: "1px solid rgba(196,149,74,0.08)",
      }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: "6rem",
            alignItems: "start",
          }}
            className="why-grid"
          >
            {/* Left */}
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.9rem",
                fontFamily: "'Commissioner', system-ui, sans-serif",
                fontSize: "0.65rem", fontWeight: 300, letterSpacing: "0.22em",
                color: "#c4954a", marginBottom: "0.9rem", textTransform: "uppercase",
              }}>
                Differenzierung
                <span style={{ display: "block", width: "32px", height: "1px", background: "#a07838" }} />
              </div>
              <h2 style={{
                fontFamily: "'Commissioner', system-ui, sans-serif",
                fontWeight: 600, fontSize: "clamp(1.4rem, 2.4vw, 2.1rem)",
                lineHeight: 1.2, letterSpacing: "-0.02em",
                marginBottom: "1.2rem",
              }}>
                Warum diese Gold‑Infrastruktur{" "}
                <em style={{ fontStyle: "normal", color: "#d4aa6a" }}>anders</em>{" "}
                ist
              </h2>
              <div style={{ width: "32px", height: "1px", background: "#a07838", margin: "0 0 1.6rem" }} />
              <p style={{
                fontSize: "0.9rem", color: "#c8bfa8", lineHeight: 1.82,
                textAlign: "justify", hyphens: "auto",
              }}>
                Integrierte Infrastruktur statt fragmentierter Insellösungen – physischer
                Handel, institutionelle Verwahrung, regulierte Kreditprodukte und
                Compliance auf einer Plattform.
              </p>
            </div>

            {/* Right – bullets */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
              {[
                {
                  n: "01",
                  text: "Kombination aus physischem Handel, Verwahrung, Kreditprodukten und Compliance auf einer Plattform – keine Insellösungen.",
                },
                {
                  n: "02",
                  text: "Juristische und forensische Strukturierung: RTO‑Erfahrung an der London Stock Exchange, EU‑MiFID‑Struktur, Schweizer Tokenisierungs‑Holding.",
                },
                {
                  n: "03",
                  text: "Dun & Bradstreet Rating H1 für die operative Einheit in Prag – niedriges Gesamtrisiko, stabiler Viability Score.",
                },
              ].map((item) => (
                <div key={item.n} style={{
                  display: "flex", gap: "1.4rem", alignItems: "flex-start",
                  padding: "1.4rem 1.6rem",
                  border: "1px solid rgba(196,149,74,0.1)",
                  background: "#0e0d0a",
                }}>
                  <span style={{
                    fontFamily: "'Commissioner', system-ui, sans-serif",
                    fontSize: "0.65rem", fontWeight: 300, letterSpacing: "0.14em",
                    color: "#a07838", flexShrink: 0, paddingTop: "0.1rem",
                  }}>{item.n}</span>
                  <p style={{ fontSize: "0.9rem", color: "#e0d8c8", lineHeight: 1.75, textAlign: "justify", hyphens: "auto" }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: STRUKTUR & REGULIERUNG ── */}
      <section id="struktur" ref={strukturRef} style={{
        background: "#0e0d0a",
        padding: "7rem 3.5rem",
        borderTop: "1px solid rgba(196,149,74,0.08)",
      }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
          {/* Eyebrow */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.9rem",
            fontFamily: "'Commissioner', system-ui, sans-serif",
            fontSize: "0.65rem", fontWeight: 300, letterSpacing: "0.22em",
            color: "#c4954a", marginBottom: "0.9rem", textTransform: "uppercase",
          }}>
            Rechtliche Struktur
            <span style={{ display: "block", width: "32px", height: "1px", background: "#a07838" }} />
          </div>

          <h2 style={{
            fontFamily: "'Commissioner', system-ui, sans-serif",
            fontWeight: 600, fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
            lineHeight: 1.15, letterSpacing: "-0.02em",
            marginBottom: "0.7rem",
          }}>
            Struktur & Regulierung
          </h2>
          <div style={{ width: "32px", height: "1px", background: "#a07838", margin: "1.2rem 0 1.5rem" }} />

          <p style={{
            fontSize: "0.95rem", color: "#e0d8c8", lineHeight: 1.82,
            maxWidth: "72ch", marginBottom: "3rem",
            textAlign: "justify", hyphens: "auto",
          }}>
            REVESTIUM AG (Zug) bündelt Holding‑, Tokenisierungs‑ und Governance‑Funktionen.
            JURISCONSULT LTD (London/Prag) stellt die kapitalmarkt‑ und rechtliche Struktur mit
            MiFID‑fähigen Instrumenten und D&B‑Rating H1. SWISS GOLD DEPOSIT Ltd (Dublin) ist
            auf den Vertrieb von Produkten innerhalb der EU gemäß MiFID II vorbereitet, SWISS
            ARROWS s.r.o. (Prag) betreibt Technologie‑, Entwicklungs‑ und Back‑Office‑Kapazitäten.
          </p>

          {/* Jurisdiction cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1px",
            background: "rgba(196,149,74,0.08)",
            marginBottom: "2.5rem",
          }}>
            {[
              { flag: "🇨🇭", name: "REVESTIUM AG", loc: "Zug, Schweiz", desc: "Holding, Tokenisierung & Governance" },
              { flag: "🇬🇧", name: "JURISCONSULT LTD", loc: "London / Prag", desc: "MiFID‑Struktur, Kapitalmarktrecht, D&B Rating H1" },
              { flag: "🇮🇪", name: "SWISS GOLD DEPOSIT Ltd", loc: "Dublin, Irland", desc: "EU MiFID II Vertriebseinheit" },
              { flag: "🇨🇿", name: "SWISS ARROWS s.r.o.", loc: "Prag, Tschechien", desc: "Technologie, Entwicklung & Back‑Office" },
            ].map((entity) => (
              <div key={entity.name} style={{
                background: "#141310",
                padding: "1.6rem 1.5rem",
                borderLeft: "1px solid rgba(196,149,74,0.18)",
              }}>
                <div style={{ fontSize: "1.4rem", marginBottom: "0.6rem" }}>{entity.flag}</div>
                <div style={{
                  fontFamily: "'Commissioner', system-ui, sans-serif",
                  fontSize: "0.68rem", letterSpacing: "0.1em",
                  color: "#d4aa6a", marginBottom: "0.2rem", textTransform: "uppercase",
                }}>
                  {entity.name}
                </div>
                <div style={{
                  fontFamily: "'Commissioner', system-ui, sans-serif",
                  fontSize: "0.62rem", letterSpacing: "0.08em",
                  color: "#8a8278", marginBottom: "0.7rem", textTransform: "uppercase",
                }}>
                  {entity.loc}
                </div>
                <p style={{ fontSize: "0.82rem", color: "#c8bfa8", lineHeight: 1.55, textAlign: "justify", hyphens: "auto" }}>
                  {entity.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Compliance note */}
          <div style={{
            display: "flex", alignItems: "flex-start", gap: "1rem",
            padding: "1rem 1.4rem",
            border: "1px solid rgba(196,149,74,0.12)",
            background: "rgba(196,149,74,0.04)",
          }}>
            <span style={{ color: "#c4954a", marginTop: "0.05rem", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1" />
                <path d="M5 7l1.5 1.5L9.5 5.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </span>
            <p style={{
              fontSize: "0.82rem", color: "#c8bfa8", lineHeight: 1.6,
              fontStyle: "italic",
            }}>
              Voll konform mit FATF‑Empfehlungen, EU‑AMLD, LBMA Responsible Sourcing und Datenschutzanforderungen.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: KONTAKT ── */}
      <section id="kontakt" style={{
        background: "#080806",
        padding: "7rem 3.5rem",
        borderTop: "1px solid rgba(196,149,74,0.08)",
      }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: "6rem",
            alignItems: "start",
          }}
            className="contact-grid"
          >
            {/* Left – contact info */}
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.9rem",
                fontFamily: "'Commissioner', system-ui, sans-serif",
                fontSize: "0.65rem", fontWeight: 300, letterSpacing: "0.22em",
                color: "#c4954a", marginBottom: "0.9rem", textTransform: "uppercase",
              }}>
                Direktkontakt
                <span style={{ display: "block", width: "32px", height: "1px", background: "#a07838" }} />
              </div>

              <h2 style={{
                fontFamily: "'Commissioner', system-ui, sans-serif",
                fontWeight: 600, fontSize: "clamp(1.4rem, 2.4vw, 2rem)",
                lineHeight: 1.2, letterSpacing: "-0.02em",
                marginBottom: "0.7rem",
              }}>
                Kontakt für Banken & Fonds
              </h2>
              <div style={{ width: "32px", height: "1px", background: "#a07838", margin: "1.2rem 0 2rem" }} />

              <div style={{
                padding: "1.6rem",
                border: "1px solid rgba(196,149,74,0.15)",
                background: "#0e0d0a",
                marginBottom: "1.8rem",
              }}>
                <div style={{
                  fontFamily: "'Commissioner', system-ui, sans-serif",
                  fontSize: "0.72rem", letterSpacing: "0.1em",
                  color: "#d4aa6a", marginBottom: "0.3rem", textTransform: "uppercase",
                }}>
                  Mag. iur. Augustina F. Schiller, MSc., LLM.
                </div>
                <div style={{ fontSize: "0.8rem", color: "#8a8278", marginBottom: "0.1rem", lineHeight: 1.5 }}>
                  President & CEO · Founder · Chief Legal Officer
                </div>
              </div>

              <p style={{
                fontSize: "0.9rem", color: "#c8bfa8", lineHeight: 1.82,
                textAlign: "justify", hyphens: "auto",
              }}>
                Gerne erläutern wir Ihnen konkrete Strukturen für Gold Bank, Gold Hypo oder
                goldbasierte Sicherheitenprogramme in einem vertraulichen Gespräch.
              </p>
            </div>

            {/* Right – contact form */}
            <div>
              {formSubmitted ? (
                <div style={{
                  padding: "3rem 2rem",
                  border: "1px solid rgba(196,149,74,0.2)",
                  background: "#0e0d0a",
                  textAlign: "center",
                }}>
                  <div style={{ color: "#c4954a", marginBottom: "1rem" }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1" />
                      <path d="M10 16l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p style={{
                    fontFamily: "'Commissioner', system-ui, sans-serif",
                    fontSize: "0.85rem", color: "#d4aa6a", letterSpacing: "0.06em",
                  }}>
                    Ihre Anfrage wurde übermittelt.
                  </p>
                  <p style={{ fontSize: "0.82rem", color: "#8a8278", marginTop: "0.5rem" }}>
                    Wir melden uns zeitnah bei Ihnen.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                  {[
                    { id: "name", label: "Name", type: "text", placeholder: "Vor- und Nachname" },
                    { id: "institution", label: "Institution", type: "text", placeholder: "Bank, Fonds oder Institut" },
                    { id: "email", label: "E‑Mail", type: "email", placeholder: "Ihre E‑Mail‑Adresse" },
                  ].map((field) => (
                    <div key={field.id}>
                      <label style={{
                        display: "block",
                        fontFamily: "'Commissioner', system-ui, sans-serif",
                        fontSize: "0.62rem", letterSpacing: "0.14em",
                        color: "#8a8278", textTransform: "uppercase",
                        marginBottom: "0.5rem",
                      }}>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        required
                        value={formData[field.id as keyof typeof formData]}
                        onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          background: "#0e0d0a",
                          border: "1px solid rgba(196,149,74,0.18)",
                          borderRadius: "2px",
                          color: "#ede8dc",
                          fontSize: "0.9rem",
                          fontFamily: "'DM Sans', system-ui, sans-serif",
                          outline: "none",
                          transition: "border-color 0.2s",
                        }}
                        onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(196,149,74,0.45)"; }}
                        onBlur={e => { (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(196,149,74,0.18)"; }}
                      />
                    </div>
                  ))}

                  <div>
                    <label style={{
                      display: "block",
                      fontFamily: "'Commissioner', system-ui, sans-serif",
                      fontSize: "0.62rem", letterSpacing: "0.14em",
                      color: "#8a8278", textTransform: "uppercase",
                      marginBottom: "0.5rem",
                    }}>
                      Nachricht
                    </label>
                    <textarea
                      placeholder="Beschreiben Sie Ihr Interesse oder Ihre Fragestellung"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        background: "#0e0d0a",
                        border: "1px solid rgba(196,149,74,0.18)",
                        borderRadius: "2px",
                        color: "#ede8dc",
                        fontSize: "0.9rem",
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        outline: "none",
                        resize: "vertical",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = "rgba(196,149,74,0.45)"; }}
                      onBlur={e => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = "rgba(196,149,74,0.18)"; }}
                    />
                  </div>

                  <button type="submit" style={{
                    padding: "0.85rem 2rem",
                    background: "#c4954a",
                    color: "#080806",
                    fontFamily: "'Commissioner', system-ui, sans-serif",
                    fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em",
                    textTransform: "uppercase", borderRadius: "2px",
                    border: "1px solid #c4954a",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    alignSelf: "flex-start",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#d4aa6a"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#c4954a"; }}
                  >
                    Anfrage senden
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: "#080806",
        borderTop: "1px solid rgba(196,149,74,0.12)",
        padding: "3rem 3.5rem",
      }}>
        <div style={{
          maxWidth: "1160px", margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          flexWrap: "wrap", gap: "2rem",
        }}>
          <div>
            <div style={{
              fontFamily: "'Commissioner', system-ui, sans-serif",
              fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.04em",
              color: "#d4aa6a", marginBottom: "0.3rem",
            }}>
              SWISS GOLD DEPOSIT
            </div>
            <div style={{
              fontFamily: "'Commissioner', system-ui, sans-serif",
              fontSize: "0.6rem", letterSpacing: "0.16em",
              color: "#8a8278", textTransform: "uppercase",
            }}>
              Institutional · Gold Banking · Collateral Services
            </div>
          </div>
          <div style={{
            fontFamily: "'Commissioner', system-ui, sans-serif",
            fontSize: "0.62rem", letterSpacing: "0.1em",
            color: "#8a8278",
          }}>
            © {new Date().getFullYear()} REVESTIUM AG, Zug · JURISCONSULT LTD, London
          </div>
        </div>
      </footer>

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        @media (max-width: 900px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
          .why-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .contact-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
        @media (max-width: 640px) {
          section { padding-left: 1.4rem !important; padding-right: 1.4rem !important; }
          footer { padding-left: 1.4rem !important; padding-right: 1.4rem !important; }
          nav { padding-left: 1.4rem !important; padding-right: 1.4rem !important; }
          h1 { font-size: 1.9rem !important; }
        }
      `}</style>
    </div>
  );
}

function UseCaseCard({
  tag,
  title,
  subtitle,
  bullets,
}: {
  tag: string;
  title: string;
  subtitle: string;
  bullets: string[];
}) {
  return (
    <div style={{
      background: "#141310",
      padding: "2.2rem 2rem",
      position: "relative",
      transition: "background 0.3s",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "#1c1a16"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "#141310"; }}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent, #a07838, transparent)",
      }} />

      <div style={{
        fontFamily: "'Commissioner', system-ui, sans-serif",
        fontSize: "0.58rem", letterSpacing: "0.18em",
        color: "#8a8278", textTransform: "uppercase",
        marginBottom: "0.6rem",
      }}>
        {tag}
      </div>

      <h3 style={{
        fontFamily: "'Commissioner', system-ui, sans-serif",
        fontSize: "1.2rem", fontWeight: 600,
        color: "#fff", lineHeight: 1.2,
        letterSpacing: "-0.01em", marginBottom: "0.2rem",
      }}>
        {title}
      </h3>
      <div style={{
        fontFamily: "'Commissioner', system-ui, sans-serif",
        fontSize: "0.7rem", letterSpacing: "0.1em",
        color: "#d4aa6a", textTransform: "uppercase",
        marginBottom: "1.4rem",
      }}>
        {subtitle}
      </div>

      <div style={{ width: "24px", height: "1px", background: "#a07838", marginBottom: "1.4rem" }} />

      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
            <span style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: "rgba(196,149,74,0.5)", marginTop: "0.55rem", flexShrink: 0,
            }} />
            <span style={{ fontSize: "0.86rem", color: "#e0d8c8", lineHeight: 1.72, textAlign: "justify", hyphens: "auto" }}>
              {b}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
