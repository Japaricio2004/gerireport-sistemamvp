import React, { useState } from "react";
import { useStore } from "./store";
import { authenticateUser } from "./auth";
import css from "./original/login.css?raw";
import theme from "../assets/css/redesign.css?raw";
import polish from "./polish.css?raw";
import responsive from "./responsive.css?raw";
export default function AuthPage() {
  const { signIn } = useStore();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setError("");
    setBusy(true);
    try {
      const user = await authenticateUser(data.username, data.password);
      signIn(user, data.remember === "on");
    } catch (err) {
      setError(
        err.message || "No se pudo iniciar la sesión. Inténtalo de nuevo.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <style>{css}</style>
      <style>{theme}</style>
      <style>{polish}</style>
      <style>{responsive}</style>
      <main className="login-container">
        <div className="auth-layout">
          <section className="auth-overview" aria-labelledby="auth-brand-title">
            <div className="brand">
              <div className="brand-icon">
                <i className="fas fa-heart-pulse" aria-hidden="true" />
              </div>
              <div className="brand-text">
                <h1 id="auth-brand-title">GeriReport</h1>
                <span>Gestión de cuidados de los pacientes</span>
              </div>
            </div>
            <div className="auth-overview-copy">
              <span className="auth-kicker">Cuidado conectado</span>
              <h2>Todo el turno, en un solo lugar.</h2>
              <p>
                Registra atenciones, revisa alertas y entrega reportes claros a
                tu equipo.
              </p>
            </div>
            <ul className="auth-benefits">
              <li>
                <i className="fas fa-check" aria-hidden="true" />
                Registro diario ordenado
              </li>
              <li>
                <i className="fas fa-check" aria-hidden="true" />
                Información accesible por paciente
              </li>
              <li>
                <i className="fas fa-check" aria-hidden="true" />
                Reportes listos para revisar
              </li>
            </ul>
          </section>
          <section
            className="login-card auth-card"
            aria-labelledby="login-title"
          >
            <span className="auth-kicker">Acceso al sistema</span>
            <h2 id="login-title">Iniciar sesión</h2>
            <p>
              Entra a la demo para organizar tus turnos y registrar cuidados.
            </p>
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}
            <form className="form" onSubmit={submit} aria-busy={busy}>
              <div className="form-group">
                <label htmlFor="username">Correo</label>
                <div className="input-wrapper">
                  <i className="fas fa-user" aria-hidden="true" />
                  <input
                    id="username"
                    name="username"
                    type="email"
                    autoComplete="username"
                    placeholder="renzo@gerireport.demo"
                    maxLength={100}
                    required
                    disabled={busy}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <div className="input-wrapper">
                  <i className="fas fa-lock" aria-hidden="true" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="off"
                    placeholder="Contraseña de la cuenta demo"
                    required
                    disabled={busy}
                  />
                </div>
              </div>
              <label className="auth-remember">
                <input name="remember" type="checkbox" />
                Mantener mi sesión iniciada
              </label>
              <button
                className="primary-btn auth-submit"
                type="submit"
                disabled={busy}
              >
                <i
                  className="fas fa-arrow-right-to-bracket"
                  aria-hidden="true"
                />
                {busy ? "Ingresando…" : "Ingresar al sistema"}
              </button>
            </form>
            <small className="auth-local-note">
              <i className="fas fa-circle-info" aria-hidden="true" />
              Técnico: renzo@gerireport.demo / renzo123. Administrador: admin@gerireport.demo / admin123. Usa solo datos ficticios; las cuentas se guardan en este navegador.
            </small>
          </section>
        </div>
      </main>
    </>
  );
}
