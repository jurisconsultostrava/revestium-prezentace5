import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { api, type Transaction } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const txSchema = z.object({
  type: z.enum(["buy", "sell", "deposit", "withdrawal", "repo", "hypo"]),
  amountGrams: z.string().min(1).refine(v => !isNaN(Number(v)) && Number(v) > 0, "Ungültige Menge"),
  priceEurPerGram: z.string().optional(),
  note: z.string().optional(),
});

type TxForm = z.infer<typeof txSchema>;

const TYPE_LABELS: Record<string, string> = {
  buy: "Kauf", sell: "Verkauf", deposit: "Einlage", withdrawal: "Entnahme",
  repo: "Gold Repo", hypo: "Gold Hypo",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#c4954a", confirmed: "#7aab7a", rejected: "#e07070", completed: "#7aab7a",
};

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const { user, logout, loading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    api.transactions.list()
      .then(({ transactions }) => setTransactions(transactions))
      .catch(console.error)
      .finally(() => setTxLoading(false));
  }, [user]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TxForm>({
    resolver: zodResolver(txSchema),
    defaultValues: { type: "buy" },
  });

  async function onSubmit(data: TxForm) {
    setSubmitError(null);
    try {
      const { transaction } = await api.transactions.create(data);
      setTransactions(prev => [transaction, ...prev]);
      setSubmitSuccess(true);
      reset();
      setTimeout(() => { setSubmitSuccess(false); setShowForm(false); }, 2000);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Fehler beim Erstellen");
    }
  }

  if (loading) {
    return <div style={{ minHeight: "100vh", background: "#04060e", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--cream3)" }}>Laden…</div>;
  }

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#04060e", color: "var(--cream)", fontFamily: "var(--sans)" }}>
      <nav style={{ padding: "1.2rem 2.5rem", borderBottom: "1px solid rgba(196,149,74,.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontFamily: "var(--sc)", fontSize: ".7rem", letterSpacing: ".2em", color: "var(--gold)", textDecoration: "none" }}>REVESTIUM AG</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ fontSize: ".85rem", color: "var(--cream3)" }}>{user.firstName} {user.lastName}</span>
          <button onClick={() => { logout(); navigate("/"); }} style={{ background: "none", border: "1px solid rgba(196,149,74,.3)", color: "var(--gold3)", padding: ".4rem .9rem", borderRadius: "2px", cursor: "pointer", fontFamily: "var(--sc)", fontSize: ".6rem", letterSpacing: ".12em" }}>ABMELDEN</button>
        </div>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 2rem" }}>
        <div style={{ marginBottom: "2.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontFamily: "var(--sc)", fontSize: ".65rem", letterSpacing: ".2em", color: "var(--gold3)", marginBottom: ".4rem" }}>MEIN KONTO</p>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", fontWeight: 400 }}>Willkommen, {user.firstName}</h1>
            {user.company && <p style={{ color: "var(--cream3)", fontSize: ".88rem", marginTop: ".25rem" }}>{user.company}</p>}
          </div>
          <button onClick={() => setShowForm(v => !v)} style={{ padding: ".7rem 1.4rem", background: showForm ? "transparent" : "var(--gold)", color: showForm ? "var(--gold)" : "#04060e", border: "1px solid var(--gold)", borderRadius: "3px", fontFamily: "var(--sc)", fontSize: ".68rem", letterSpacing: ".13em", cursor: "pointer" }}>
            {showForm ? "ABBRECHEN" : "+ NEUE TRANSAKTION"}
          </button>
        </div>

        {showForm && (
          <div style={{ marginBottom: "2.5rem", padding: "2rem", background: "rgba(196,149,74,.04)", border: "1px solid rgba(196,149,74,.2)", borderRadius: "4px" }}>
            <p style={{ fontFamily: "var(--sc)", fontSize: ".65rem", letterSpacing: ".2em", color: "var(--gold3)", marginBottom: "1.5rem" }}>NEUE TRANSAKTION</p>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", alignItems: "end" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
                <label style={labelStyle}>Typ</label>
                <select {...register("type")} style={inputStyle}>
                  {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                {errors.type && <p style={errStyle}>{errors.type.message}</p>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
                <label style={labelStyle}>Menge (Gramm)</label>
                <input {...register("amountGrams")} placeholder="100.00" style={inputStyle} />
                {errors.amountGrams && <p style={errStyle}>{errors.amountGrams.message}</p>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
                <label style={labelStyle}>Preis EUR/g (optional)</label>
                <input {...register("priceEurPerGram")} placeholder="85.00" style={inputStyle} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
                <label style={labelStyle}>Notiz (optional)</label>
                <input {...register("note")} placeholder="Interne Referenz" style={inputStyle} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                {submitError && <p style={errStyle}>{submitError}</p>}
                {submitSuccess && <p style={{ color: "#7aab7a", fontSize: ".82rem" }}>Transaktion eingereicht ✓</p>}
                <button type="submit" disabled={isSubmitting} style={{ padding: ".7rem 1.2rem", background: "var(--gold)", color: "#04060e", border: "none", borderRadius: "3px", fontFamily: "var(--sc)", fontSize: ".65rem", letterSpacing: ".13em", cursor: "pointer" }}>
                  {isSubmitting ? "Wird gesendet…" : "EINREICHEN"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          <p style={{ fontFamily: "var(--sc)", fontSize: ".65rem", letterSpacing: ".2em", color: "var(--gold3)", marginBottom: "1.2rem" }}>TRANSAKTIONSVERLAUF</p>
          {txLoading ? (
            <p style={{ color: "var(--cream3)" }}>Laden…</p>
          ) : transactions.length === 0 ? (
            <p style={{ color: "var(--cream3)", padding: "2rem", textAlign: "center", border: "1px dashed rgba(196,149,74,.2)", borderRadius: "4px" }}>Noch keine Transaktionen</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
              {transactions.map(tx => (
                <div key={tx.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", alignItems: "center", gap: "1.2rem", padding: "1rem 1.4rem", background: "rgba(255,255,255,.02)", border: "1px solid rgba(196,149,74,.1)", borderRadius: "3px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: STATUS_COLORS[tx.status] ?? "#888", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 500, marginBottom: ".15rem" }}>{TYPE_LABELS[tx.type] ?? tx.type}</p>
                    {tx.note && <p style={{ color: "var(--cream3)", fontSize: ".8rem" }}>{tx.note}</p>}
                  </div>
                  <p style={{ fontFamily: "var(--sc)", fontSize: ".78rem", color: "var(--gold2)" }}>{Number(tx.amountGrams).toFixed(2)} g</p>
                  <p style={{ color: "var(--cream3)", fontSize: ".78rem", textAlign: "right" }}>
                    {new Date(tx.createdAt).toLocaleDateString("de-DE")}<br />
                    <span style={{ color: STATUS_COLORS[tx.status] ?? "#888", fontSize: ".72rem", letterSpacing: ".05em" }}>{tx.status.toUpperCase()}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { fontFamily: "var(--sc)", fontSize: ".62rem", letterSpacing: ".15em", color: "var(--gold3)", textTransform: "uppercase" };
const inputStyle: React.CSSProperties = { background: "rgba(255,255,255,.04)", border: "1px solid rgba(196,149,74,.25)", borderRadius: "3px", padding: ".6rem .9rem", color: "var(--cream)", fontSize: ".88rem", fontFamily: "var(--sans)", outline: "none", width: "100%", boxSizing: "border-box" };
const errStyle: React.CSSProperties = { color: "#e07070", fontSize: ".78rem", margin: 0 };
