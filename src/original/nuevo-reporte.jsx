import React from "react";
import css from "./nuevo-reporte.css?raw";
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
              <a className={"active"} href={"nuevo-reporte.html"}>
                <i className={"fas fa-pen-to-square"}></i>
                <span>{"Nuevo reporte"}</span>
              </a>
              <a href={"reportes.html"}>
                <i className={"fas fa-file-lines"}></i>
                <span>{"Reportes"}</span>
              </a>
              <a href={"seguimiento.html"}>
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
              <h2>{"Nuevo reporte geriátrico"}</h2>
              <p>
                {"Completa la información principal del turno domiciliario."}
              </p>
            </div>
          </header>
          {slots.pageIntro}
          <section className={"form-layout"}>
            <form
              className={"panel form report-form"}
              id={"reportForm"}
              {...bindings["reportForm"]}
            >
              <h3>{"Datos del paciente"}</h3>
              <div className={"two-cols"}>
                <div>
                  <label htmlFor={"patient"}>{"Paciente"}</label>
                  <select
                    id={"patient"}
                    required={true}
                    name={"patient"}
                    {...bindings["patient"]}
                  >
                    {slots["patient"]}
                  </select>
                </div>
                <div>
                  <label htmlFor={"shift"}>{"Turno"}</label>
                  <select
                    id={"shift"}
                    required={true}
                    name={"shift"}
                    {...bindings["shift"]}
                  >
                    <option>{"Mañana"}</option>
                    <option>{"Tarde"}</option>
                    <option>{"Noche"}</option>
                    <option>{"Turno completo"}</option>
                  </select>
                </div>
              </div>
              <h3>{"Signos vitales"}</h3>
              <div className={"three-cols"}>
                <div>
                  <label htmlFor={"pressure"}>{"Presión arterial"}</label>
                  <input
                    id={"pressure"}
                    placeholder={"120/80"}
                    required={true}
                    name={"pressure"}
                    {...bindings["pressure"]}
                  />
                </div>
                <div>
                  <label htmlFor={"heart"}>{"Frecuencia cardiaca"}</label>
                  <input
                    id={"heart"}
                    placeholder={"72 lpm"}
                    required={true}
                    name={"heart"}
                    {...bindings["heart"]}
                  />
                </div>
                <div>
                  <label htmlFor={"temp"}>{"Temperatura"}</label>
                  <input
                    id={"temp"}
                    placeholder={"36.5 °C"}
                    required={true}
                    name={"temp"}
                    {...bindings["temp"]}
                  />
                </div>
              </div>
              <h3>{"Cuidados del turno"}</h3>
              <div className={"two-cols"}>
                <div>
                  <label htmlFor={"meds"}>{"Medicamentos administrados"}</label>
                  <textarea
                    id={"meds"}
                    rows={"5"}
                    placeholder={"Ej. Losartán 50mg - 8:00 a.m."}
                    required={true}
                    name={"meds"}
                    {...bindings["meds"]}
                  ></textarea>
                </div>
                <div>
                  <label htmlFor={"food"}>{"Alimentación e hidratación"}</label>
                  <textarea
                    id={"food"}
                    rows={"5"}
                    placeholder={"Ej. Desayuno completo, 3 vasos de agua."}
                    required={true}
                    name={"food"}
                    {...bindings["food"]}
                  ></textarea>
                </div>
              </div>
              <label htmlFor={"incidents"}>{"Incidentes o alertas"}</label>
              <textarea
                id={"incidents"}
                rows={"4"}
                placeholder={
                  "Ej. Sin incidentes / caída leve / mareo / dolor..."
                }
                name={"incidents"}
                {...bindings["incidents"]}
              ></textarea>
              <label htmlFor={"notes"}>{"Observaciones generales"}</label>
              <textarea
                id={"notes"}
                rows={"5"}
                placeholder={
                  "Resumen del estado del paciente durante el turno."
                }
                required={true}
                name={"notes"}
                {...bindings["notes"]}
              ></textarea>
              <button className={"primary-btn"} type={"submit"}>
                {"Guardar y generar reporte"}
              </button>
            </form>
            <aside className={"panel preview-card"}>
              <h3>{"Vista previa"}</h3>
              <div
                id={"livePreview"}
                className={"generated-report"}
                {...bindings["livePreview"]}
              >
                {slots["livePreview"]}
              </div>
            </aside>
          </section>
        </main>
      </div>
    </>
  );
}
