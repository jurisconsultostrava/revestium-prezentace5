import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const schema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(1, "Passwort erforderlich"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setServerError(null);
    try {
      const { token, user } = await api.auth.login(data);
      login(token, user);
      navigate("/dashboard");
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Anmeldung fehlgeschlagen");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#04060e", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--sc)", fontSize: ".7rem", letterSpacing: ".25em", color: "var(--gold3)", textTransform: "uppercase", marginBottom: ".5rem" }}>REVESTIUM AG</p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2rem", color: "var(--cream)", fontWeight: 400 }}>Anmelden</h1>
          <p style={{ color: "var(--cream3)", fontSize: ".88rem", marginTop: ".5rem" }}>Noch kein Konto? <Link href="/register" style={{ color: "var(--gold)", textDecoration: "none" }}>Registrieren</Link></p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
            <label style={labelStyle}>E-Mail</label>
            <input {...register("email")} type="email" placeholder="max@unternehmen.de" style={inputStyle} />
            {errors.email && <p style={errStyle}>{errors.email.message}</p>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
            <label style={labelStyle}>Passwort</label>
            <input {...register("password")} type="password" placeholder="••••••••" style={inputStyle} />
            {errors.password && <p style={errStyle}>{errors.password.message}</p>}
          </div>

          {serverError && (
            <p style={{ color: "#e07070", fontSize: ".85rem", padding: ".6rem 1rem", background: "rgba(220,80,80,.1)", borderRadius: "4px", border: "1px solid rgba(220,80,80,.25)" }}>
              {serverError}
            </p>
          )}

          <button type="submit" disabled={isSubmitting} style={submitStyle}>
            {isSubmitting ? "Wird angemeldet…" : "Anmelden"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <Link href="/" style={{ color: "var(--cream3)", fontSize: ".82rem", textDecoration: "none" }}>← Zurück zur Startseite</Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--sc)", fontSize: ".65rem", letterSpacing: ".15em", color: "var(--gold3)", textTransform: "uppercase",
};
const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,.04)", border: "1px solid rgba(196,149,74,.25)", borderRadius: "3px",
  padding: ".65rem 1rem", color: "var(--cream)", fontSize: ".9rem", fontFamily: "var(--sans)", outline: "none",
  width: "100%", boxSizing: "border-box",
};
const errStyle: React.CSSProperties = { color: "#e07070", fontSize: ".78rem", margin: 0 };
const submitStyle: React.CSSProperties = {
  marginTop: ".5rem", padding: ".8rem 1.5rem", background: "var(--gold)", color: "#04060e",
  border: "none", borderRadius: "3px", fontFamily: "var(--sc)", fontSize: ".72rem",
  letterSpacing: ".15em", textTransform: "uppercase", cursor: "pointer", fontWeight: 600,
};
