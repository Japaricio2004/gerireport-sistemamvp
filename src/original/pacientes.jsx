import React from "react";
import css from "./pacientes.css?raw";
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
              <a className={"active"} href={"pacientes.html"}>
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
              <h2>
                <i className={"fas fa-users"} style={{ color: "#216d5d" }}></i>
                {" Pacientes"}
              </h2>
              <p>
                {"Registro básico de adultos mayores atendidos en domicilio."}
              </p>
            </div>
            <button
              className={"primary-btn"}
              onClick={(e) => onAction?.("openPatientModal()", e)}
            >
              <i className={"fas fa-plus"}></i>
              {" Nuevo paciente"}
            </button>
          </header>
          {slots.pageIntro}
          <section
            className={"patient-grid"}
            id={"patientGrid"}
            {...bindings["patientGrid"]}
          >
            {slots["patientGrid"]}
          </section>
        </main>
      </div>
      <div
        className={"modal"}
        id={"patientModal"}
        {...bindings["patientModal"]}
      >
        <div className={"modal-card"}>
          <button
            className={"close-btn"}
            onClick={(e) => onAction?.("closePatientModal()", e)}
          >
            {"×"}
          </button>
          <h3>
            <i className={"fas fa-user-plus"} style={{ color: "#216d5d" }}></i>
            {" Registrar paciente"}
          </h3>
          <form
            className={"form"}
            id={"patientForm"}
            {...bindings["patientForm"]}
          >
            <label>{"Nombre completo"}</label>
            <input
              id={"patientName"}
              required={true}
              placeholder={"Ej. Rosa Martínez"}
              name={"patientName"}
              {...bindings["patientName"]}
            />
            <label>{"Edad"}</label>
            <input
              id={"patientAge"}
              type={"number"}
              required={true}
              placeholder={"Ej. 84"}
              name={"patientAge"}
              {...bindings["patientAge"]}
            />
            <label>{"Condición principal"}</label>
            <input
              id={"patientCondition"}
              required={true}
              placeholder={"Ej. Hipertensión, diabetes, movilidad reducida"}
              name={"patientCondition"}
              {...bindings["patientCondition"]}
            />
            <label>{"Familiar responsable"}</label>
            <input
              id={"patientFamily"}
              required={true}
              placeholder={"Ej. Ana Martínez"}
              name={"patientFamily"}
              {...bindings["patientFamily"]}
            />
            <button className={"primary-btn full"} type={"submit"}>
              <i className={"fas fa-save"}></i>
              {" Guardar paciente"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
