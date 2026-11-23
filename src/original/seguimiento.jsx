import React from "react";
import css from "./seguimiento.css?raw";
import theme from "../../assets/css/redesign.css?raw";
import polish from "../polish.css?raw";
import responsive from "../responsive.css?raw";
export default function OriginalTemplate({
  slots = {},
  bindings = {},
  onAction,
  section,
  onNavigate,
  onReport,
}) {
  return (
    <>
      <style>{css}</style>
      <style>{theme}</style>
      <style>{polish}</style>
      <style>{responsive}</style>
      <div className={"app-shell"}>
        {slots.sidebar ?? (
          <aside className={"sidebar"} id={"sidebar"} {...bindings["sidebar"]}>
            <div className={"brand"}>
              <div className={"brand-icon"}>{"GR"}</div>
              <div>
                <h1>{"GeriReport"}</h1>
                <span>{"Gestión de cuidados"}</span>
              </div>
            </div>
            <nav className={"nav"}>
              <a href={"../index.html"}>
                <i className={"fas fa-gauge-high"}></i>
                <span>{"Dashboard"}</span>
              </a>
              <a href={"pacientes.html"}>
                <i className={"fas fa-users"}></i>
                <span>{"Pacientes"}</span>
              </a>
              <a href={"turno.html"}>
                <i className={"fas fa-clock"}></i>
                <span>{"Modo Turno"}</span>
              </a>
              <a href={"nuevo-reporte.html"}>
                <i className={"fas fa-pen-to-square"}></i>
                <span>{"Nuevo reporte"}</span>
              </a>
              <a href={"reportes.html"}>
                <i className={"fas fa-file-lines"}></i>
                <span>{"Reportes"}</span>
              </a>
              <a className={"active"} href={"seguimiento.html"}>
                <i className={"fas fa-chart-line"}></i>
                <span>{"Seguimiento"}</span>
              </a>
              <a href={"vista-familiar.html"}>
                <i className={"fas fa-eye"}></i>
                <span>{"Vista familiar"}</span>
              </a>
              <a href={"login.html"}>
                <i className={"fas fa-arrow-right-from-bracket"}></i>
                <span>{"Cerrar sesión"}</span>
              </a>
            </nav>
            <div
              className={"sidebar-card"}
              id={"sidebarTurnoCard"}
              {...bindings["sidebarTurnoCard"]}
            >
              {slots["sidebarTurnoCard"]}
            </div>
          </aside>
        )}
        <main className={"main-content"}>
          <header className={"topbar"}>
            <button
              className={"menu-btn"}
              id={"menuBtn"}
              {...bindings["menuBtn"]}
            >
              {"☰"}
            </button>
            <div>
              <h2>
                <i
                  className={"fas fa-chart-line"}
                  style={{ color: "#216d5d" }}
                ></i>
                {" Seguimiento y alertas"}
              </h2>
              <p>{"Control simple de tareas importantes del adulto mayor."}</p>
            </div>
          </header>
          {slots.pageIntro}
          <section
            className={"kanban"}
            id={"originalKanban"}
            {...bindings["originalKanban"]}
          >
            {slots["originalKanban"]}
          </section>
        </main>
      </div>
    </>
  );
}
