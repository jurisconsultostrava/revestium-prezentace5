import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const schema = z.object({
  firstName: z.string().min(2, "Mindestens 2 Zeichen"),
  lastName: z.string().min(2, "Mindestens 2 Zeichen"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  company: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(8, "Mindestens 8 Zeichen"),
  passwordConfirm: z.string(),
}).refine(d => d.password === d.passwordConfirm, {
  message: "Passwörter stimmen nicht überein",
  path: ["passwordConfirm"],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setServerError(null);
    try {
      const { token, user } = await api.auth.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        company: data.company,
        phone: data.phone,
        password: data.password,
      });
      login(token, user);
      navigate("/dashboard");
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Registrierung fehlgeschlagen");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#04060e", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--sc)", fontSize: ".7rem", letterSpacing: ".25em", color: "var(--gold3)", textTransform: "uppercase", marginBottom: ".5rem" }}>REVESTIUM AG</p>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2rem", color: "var(--cream)", fontWeight: 400 }}>Konto erstellen</h1>
          <p style={{ color: "var(--cream3)", fontSize: ".88rem", marginTop: ".5rem" }}>Bereits registriert? <Link href="/login" style={{ color: "var(--gold)", textDecoration: "none" }}>Anmelden</Link></p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Vorname" error={errors.firstName?.message}>
              <input {...register("firstName")} placeholder="Max" style={inputStyle} />
            </Field>
            <Field label="Nachname" error={errors.lastName?.message}>
              <input {...register("lastName")} placeholder="Mustermann" style={inputStyle} />
            </Field>
          </div>
          <Field label="E-Mail" error={errors.email?.message}>
            <input {...register("email")} type="email" placeholder="max@unternehmen.de" style={inputStyle} />
          </Field>
          <Field label="Unternehmen (optional)" error={errors.company?.message}>
            <input {...register("company")} placeholder="Mustermann GmbH" style={inputStyle} />
          </Field>
          <Field label="Telefon (optional)" error={errors.phone?.message}>
            <input {...register("phone")} placeholder="+49 123 456789" style={inputStyle} />
          </Field>
          <Field label="Passwort" error={errors.password?.message}>
            <input {...register("password")} type="password" placeholder="Mindestens 8 Zeichen" style={inputStyle} />
          </Field>
          <Field label="Passwort bestätigen" error={errors.passwordConfirm?.message}>
            <input {...register("passwordConfirm")} type="password" placeholder="Wiederholen" style={inputStyle} />
          </Field>

          {serverError && (
            <p style={{ color: "#e07070", fontSize: ".85rem", padding: ".6rem 1rem", background: "rgba(220,80,80,.1)", borderRadius: "4px", border: "1px solid rgba(220,80,80,.25)" }}>
              {serverError}
            </p>
          )}

          <button type="submit" disabled={isSubmitting} style={submitStyle}>
            {isSubmitting ? "Wird registriert…" : "Konto erstellen"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <Link href="/" style={{ color: "var(--cream3)", fontSize: ".82rem", textDecoration: "none" }}>← Zurück zur Startseite</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
      <label style={{ fontFamily: "var(--sc)", fontSize: ".65rem", letterSpacing: ".15em", color: "var(--gold3)", textTransform: "uppercase" }}>{label}</label>
      {children}
      {error && <p style={{ color: "#e07070", fontSize: ".78rem", margin: 0 }}>{error}</p>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,.04)",
  border: "1px solid rgba(196,149,74,.25)",
  borderRadius: "3px",
  padding: ".65rem 1rem",
  color: "var(--cream)",
  fontSize: ".9rem",
  fontFamily: "var(--sans)",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const submitStyle: React.CSSProperties = {
  marginTop: ".5rem",
  padding: ".8rem 1.5rem",
  background: "var(--gold)",
  color: "#04060e",
  border: "none",
  borderRadius: "3px",
  fontFamily: "var(--sc)",
  fontSize: ".72rem",
  letterSpacing: ".15em",
  textTransform: "uppercase",
  cursor: "pointer",
  fontWeight: 600,
};
