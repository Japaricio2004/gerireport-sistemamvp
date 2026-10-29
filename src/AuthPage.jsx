import React, { useState } from "react";
import { useStore } from "./store";
import { authenticateTechnician } from "./auth";
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
      const user = await authenticateTechnician(data.username, data.password);
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
        <section className="login-card auth-card">
          <div className="brand">
            <div className="brand-icon">
              <i className="fas fa-heart-pulse" aria-hidden="true" />
            </div>
            <div className="brand-text">
              <h1>GeriReport</h1>
              <span>Gestión de cuidados</span>
            </div>
          </div>
          <h2>Iniciar sesión</h2>
          <p>Entra a la demo para organizar tus turnos y registrar cuidados.</p>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
          <form className="form" onSubmit={submit} aria-busy={busy}>
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <div className="input-wrapper">
                <i className="fas fa-user" aria-hidden="true" />
                <input
                  id="username"
                  name="username"
                  autoComplete="username"
                  placeholder="Ej. Ana Martínez"
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
                  placeholder="Cualquier contraseña para la demo"
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
              <i className="fas fa-arrow-right-to-bracket" aria-hidden="true" />
              {busy ? "Ingresando…" : "Ingresar al sistema"}
            </button>
          </form>
          <small className="auth-local-note">
            <i className="fas fa-circle-info" aria-hidden="true" />
            Demo: escribe el nombre que quieres mostrar y cualquier contraseña.
          </small>
        </section>
      </main>
    </>
  );
}
