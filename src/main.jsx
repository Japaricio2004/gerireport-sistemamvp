import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "../assets/css/redesign.css";

const links = [
  ["Panel principal", "index.html", "fa-grid-2"],
  ["Pacientes", "pages/pacientes.html", "fa-users"],
  ["Modo turno", "pages/turno.html", "fa-clock"],
  ["Nuevo reporte", "pages/nuevo-reporte.html", "fa-pen-to-square"],
  ["Historial", "pages/reportes.html", "fa-file-lines"],
  ["Seguimiento", "pages/seguimiento.html", "fa-chart-line"],
  ["Vista familiar", "pages/vista-familiar.html", "fa-eye"],
];

const demoPatients = [
  { name: "María López", age: 82, condition: "Movilidad reducida y control de medicación", family: "Lucía López", status: "Estable" },
  { name: "Jorge Gálvez", age: 77, condition: "Control de presión arterial", family: "Carlos Gálvez", status: "Estable" },
  { name: "Elena Campos", age: 89, condition: "Hidratación y alimentación", family: "Rosa Campos", status: "Estable" },
  { name: "Alberto Morales", age: 81, condition: "Insuficiencia cardíaca, control de líquidos", family: "Laura Morales", status: "Alerta" },
  { name: "Clara Vargas", age: 84, condition: "Acompañamiento y estimulación cognitiva", family: "Pedro Vargas", status: "Estable" },
  { name: "Rosa Paredes", age: 76, condition: "EPOC, control respiratorio", family: "Carlos Paredes", status: "Crítico" },
];

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const patients = readStorage("gerireport_patients", demoPatients);
  const reports = readStorage("gerireport_reports", []);
  const activeTurn = readStorage("gerireport_active_turno", null);
  const today = new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  const initials = (name) => name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  return (
    <div className="dashboard-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <a className="brand" href="index.html" aria-label="GeriReport, panel principal">
          <span className="brand-mark"><i className="fa-solid fa-heart-pulse" /></span>
          <span><strong>GeriReport</strong><small>Gestión de cuidados</small></span>
        </a>
        <p className="nav-caption">ESPACIO DE TRABAJO</p>
        <nav className="nav" aria-label="Navegación principal">
          {links.map(([label, href, icon], index) => (
            <a className={index === 0 ? "nav-link active" : "nav-link"} href={href} key={href}>
              <i className={`fa-solid ${icon}`} aria-hidden="true" /><span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-turn">
            <span className="turn-icon"><i className="fa-regular fa-clock" /></span>
            <div><small>{activeTurn ? "Turno en curso" : "Turno actual"}</small><strong>{activeTurn?.patient || "Sin turno activo"}</strong></div>
            {activeTurn && <span className="live-dot" aria-label="Activo" />}
          </div>
          <a className="profile" href="pages/login.html">
            <span className="profile-avatar">RC</span><span><strong>Renzo C.</strong><small>Cuidador</small></span>
            <i className="fa-solid fa-arrow-right-from-bracket" aria-label="Cerrar sesión" />
          </a>
        </div>
      </aside>

      {menuOpen && <button className="nav-scrim" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />}

      <main className="main-content">
        <header className="topbar">
          <button className="menu-btn" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><i className="fa-solid fa-bars" /></button>
          <div className="page-heading"><span className="eyebrow">{today}</span><h1>Panel principal</h1></div>
          <div className="topbar-actions">
            <a className="quiet-link" href="pages/reportes.html"><i className="fa-regular fa-bell" /><span>Actividad</span></a>
            <a className="primary-btn" href="pages/pacientes.html"><i className="fa-solid fa-plus" /> Iniciar turno</a>
          </div>
        </header>

        <section className="welcome-panel">
          <div className="welcome-copy">
            <span className="status-label"><span className="live-dot" /> CUIDADO DOMICILIARIO</span>
            <h2>Un día de cuidado, <span>bien organizado.</span></h2>
            <p>Registra cada atención y mantén a todo el equipo al tanto del bienestar de tus pacientes.</p>
            <div className="welcome-actions">
              <a className="primary-btn" href={activeTurn ? "pages/turno.html" : "pages/pacientes.html"}><i className="fa-solid fa-arrow-right" /> {activeTurn ? "Continuar turno" : "Comenzar un turno"}</a>
              <a className="text-link" href="pages/reportes.html">Ver reportes <i className="fa-solid fa-arrow-up-right-from-square" /></a>
            </div>
          </div>
          <div className="welcome-visual" aria-hidden="true">
            <div className="care-orbit orbit-one" /><div className="care-orbit orbit-two" />
            <div className="care-symbol"><i className="fa-solid fa-heart-pulse" /></div>
            <span className="visual-caption">Cuidado cercano<br />registro confiable</span>
          </div>
        </section>

        <section className="metrics-grid" aria-label="Resumen de actividad">
          <article className="metric-card"><span className="metric-icon mint"><i className="fa-solid fa-user-group" /></span><div className="metric-label">Pacientes registrados</div><strong>{patients.length}</strong><small>En seguimiento domiciliario</small></article>
          <article className="metric-card"><span className="metric-icon blue"><i className="fa-solid fa-file-lines" /></span><div className="metric-label">Reportes guardados</div><strong>{reports.length}</strong><small>Historial disponible</small></article>
          <article className="metric-card"><span className="metric-icon amber"><i className="fa-solid fa-triangle-exclamation" /></span><div className="metric-label">Alertas por revisar</div><strong>{reports.filter((report) => report.status === "Revisar" || report.records?.some((record) => record.alert)).length}</strong><small>Revisa el seguimiento del turno</small></article>
        </section>

        <section className="dashboard-content">
          <article className="surface patients-surface">
            <div className="section-heading"><div><span className="eyebrow">ATENCIÓN</span><h2>Pacientes</h2></div><a className="text-link" href="pages/pacientes.html">Ver todos <i className="fa-solid fa-arrow-right" /></a></div>
            <div className="patient-list">
              {patients.slice(0, 4).map((patient, index) => (
                <a className="patient-row" href="pages/pacientes.html" key={`${patient.name}-${index}`}>
                  <span className={`patient-avatar tone-${index % 3}`}>{initials(patient.name)}</span>
                  <span className="patient-info"><strong>{patient.name}</strong><small>{patient.age} años · {patient.condition}</small></span>
                  <span className={`patient-status ${patient.status === "Alerta" ? "patient-status-alert" : patient.status === "Crítico" ? "patient-status-critical" : ""}`}><span /> {patient.status || "Estable"}</span><i className="fa-solid fa-chevron-right row-chevron" />
                </a>
              ))}
              {patients.length === 0 && <p className="empty-state">Aún no hay pacientes. Registra el primero para empezar.</p>}
            </div>
          </article>

          <article className="surface shift-surface">
            <div className="section-heading"><div><span className="eyebrow">SEGUIMIENTO</span><h2>Tu turno</h2></div><span className="shift-icon"><i className="fa-regular fa-calendar-check" /></span></div>
            {activeTurn ? (
              <div className="active-turn"><span className="turn-state"><span className="live-dot" /> EN CURSO</span><h3>{activeTurn.patient}</h3><p>Iniciado a las {activeTurn.startLabel || "--:--"}</p><a className="secondary-btn" href="pages/turno.html">Abrir registro <i className="fa-solid fa-arrow-right" /></a></div>
            ) : (
              <div className="empty-turn"><span className="empty-turn-icon"><i className="fa-solid fa-mug-hot" /></span><h3>Todo listo para empezar</h3><p>Selecciona un paciente para iniciar el registro de cuidados.</p><a className="secondary-btn" href="pages/pacientes.html">Elegir paciente <i className="fa-solid fa-arrow-right" /></a></div>
            )}
          </article>
        </section>
        <footer className="dashboard-footer"><span>GeriReport <span>·</span> Gestión de cuidados</span><a href="pages/vista-familiar.html">Acceso para familiares <i className="fa-solid fa-arrow-up-right-from-square" /></a></footer>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
