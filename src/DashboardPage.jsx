import React from "react";
import { useStore } from "./store";
import { summarizeReport } from "./data";
import "../assets/css/redesign.css";

export default function DashboardPage() {
  const {
    patients,
    reports,
    turn: activeTurn,
    menuOpen,
    setMenuOpen,
  } = useStore();
  const today = new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
  const initials = (name) =>
    name
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  return (
    <div className="dashboard-shell">
      <main className="main-content">
        <header className="topbar">
          <button
            className="menu-btn"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className="fa-solid fa-bars" />
          </button>
          <div className="page-heading">
            <span className="eyebrow">{today}</span>
            <h1>Dashboard</h1>
          </div>
          <div className="topbar-actions">
            <a className="quiet-link" href="pages/reportes.html">
              <i className="fa-regular fa-bell" />
              <span>Actividad</span>
            </a>
            <a className="primary-btn" href="pages/pacientes.html">
              <i className="fa-solid fa-plus" /> Iniciar turno
            </a>
          </div>
        </header>

        <section className="welcome-panel">
          <div className="welcome-copy">
            <span className="status-label">
              <span className="live-dot" /> CUIDADO DOMICILIARIO
            </span>
            <h2>
              Un día de cuidado, <span>bien organizado.</span>
            </h2>
            <p>
              Registra cada atención y mantén a todo el equipo al tanto del
              bienestar de tus pacientes.
            </p>
            <div className="welcome-actions">
              <a
                className="primary-btn"
                href={activeTurn ? "pages/turno.html" : "pages/pacientes.html"}
              >
                <i className="fa-solid fa-arrow-right" />{" "}
                {activeTurn ? "Continuar turno" : "Comenzar un turno"}
              </a>
              <a className="text-link" href="pages/reportes.html">
                Ver reportes{" "}
                <i className="fa-solid fa-arrow-up-right-from-square" />
              </a>
            </div>
          </div>
          <div className="welcome-visual" aria-hidden="true">
            <div className="care-orbit orbit-one" />
            <div className="care-orbit orbit-two" />
            <div className="care-symbol">
              <i className="fa-solid fa-heart-pulse" />
            </div>
            <span className="visual-caption">
              Cuidado cercano
              <br />
              registro confiable
            </span>
          </div>
        </section>

        <section className="metrics-grid" aria-label="Resumen de actividad">
          <article className="metric-card">
            <span className="metric-icon mint">
              <i className="fa-solid fa-user-group" />
            </span>
            <div className="metric-label">Pacientes registrados</div>
            <strong>{patients.length}</strong>
            <small>En seguimiento domiciliario</small>
          </article>
          <article className="metric-card">
            <span className="metric-icon blue">
              <i className="fa-solid fa-file-lines" />
            </span>
            <div className="metric-label">Reportes guardados</div>
            <strong>{reports.length}</strong>
            <small>Historial disponible</small>
          </article>
          <article className="metric-card">
            <span className="metric-icon amber">
              <i className="fa-solid fa-triangle-exclamation" />
            </span>
            <div className="metric-label">Reportes para revisar</div>
            <strong>
              {
                reports.filter(
                  (report) => summarizeReport(report).status === "Revisar",
                ).length
              }
            </strong>
            <small>Revisa el seguimiento del turno</small>
          </article>
        </section>

        <section className="dashboard-content">
          <article className="surface patients-surface">
            <div className="section-heading">
              <div>
                <span className="eyebrow">ATENCIÓN</span>
                <h2>Pacientes</h2>
              </div>
              <a className="text-link" href="pages/pacientes.html">
                Ver todos <i className="fa-solid fa-arrow-right" />
              </a>
            </div>
            <div className="patient-list">
              {patients.slice(0, 4).map((patient, index) => (
                <a
                  className="patient-row"
                  href="pages/pacientes.html"
                  key={`${patient.name}-${index}`}
                >
                  <span className={`patient-avatar tone-${index % 3}`}>
                    {initials(patient.name)}
                  </span>
                  <span className="patient-info">
                    <strong>{patient.name}</strong>
                    <small>
                      {patient.age} años · {patient.condition}
                    </small>
                  </span>
                  <span
                    className={`patient-status ${patient.status === "Alerta" ? "patient-status-alert" : patient.status === "Crítico" ? "patient-status-critical" : ""}`}
                  >
                    <span /> {patient.status || "Estable"}
                  </span>
                  <i className="fa-solid fa-chevron-right row-chevron" />
                </a>
              ))}
              {patients.length === 0 && (
                <p className="empty-state">
                  Aún no hay pacientes. Registra el primero para empezar.
                </p>
              )}
            </div>
          </article>

          <article className="surface shift-surface">
            <div className="section-heading">
              <div>
                <span className="eyebrow">SEGUIMIENTO</span>
                <h2>Tu turno</h2>
              </div>
              <span className="shift-icon">
                <i className="fa-regular fa-calendar-check" />
              </span>
            </div>
            {activeTurn ? (
              <div className="active-turn">
                <span className="turn-state">
                  <span className="live-dot" /> EN CURSO
                </span>
                <h3>{activeTurn.patient}</h3>
                <p>Iniciado a las {activeTurn.startLabel || "--:--"}</p>
                <a className="secondary-btn" href="pages/turno.html">
                  Abrir registro <i className="fa-solid fa-arrow-right" />
                </a>
              </div>
            ) : (
              <div className="empty-turn">
                <span className="empty-turn-icon">
                  <i className="fa-solid fa-mug-hot" />
                </span>
                <h3>Todo listo para empezar</h3>
                <p>
                  Selecciona un paciente para iniciar el registro de cuidados.
                </p>
                <a className="secondary-btn" href="pages/pacientes.html">
                  Elegir paciente <i className="fa-solid fa-arrow-right" />
                </a>
              </div>
            )}
          </article>
        </section>
        <footer className="dashboard-footer">
          <span>
            GeriReport <span>·</span> Gestión de cuidados
          </span>
          <a href="pages/vista-familiar.html">
            Acceso para familiares{" "}
            <i className="fa-solid fa-arrow-up-right-from-square" />
          </a>
        </footer>
      </main>
    </div>
  );
}
