import React from "react";
import css from "./turno.css?raw";
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
              <a className={"active"} href={"turno.html"}>
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
                <i className={"fas fa-clock"} style={{ color: "#216d5d" }}></i>
                {" Modo Turno"}
              </h2>
              <p>{"Registra la información del turno en pocos toques."}</p>
            </div>
          </header>
          {slots.pageIntro}

          <section
            className={"panel empty-state"}
            id={"noTurnoState"}
            style={{ display: "none" }}
            {...bindings["noTurnoState"]}
          >
            <h3>{"No hay ningún turno activo"}</h3>
            <p className={"muted"}>
              {
                'Selecciona un paciente en la sección "Pacientes" para iniciar un turno.'
              }
            </p>
            <a className={"primary-btn"} href={"pacientes.html"}>
              <i className={"fas fa-arrow-right"}></i>
              {" Ir a Pacientes"}
            </a>
          </section>

          <div id={"turnoActiveState"} {...bindings["turnoActiveState"]}>
            <section className={"turno-header"}>
              <div className={"turno-header-info"}>
                <span className={"badge"}>
                  <i className={"fas fa-circle-check"}></i>
                  {" TURNO ACTIVO"}
                </span>
                <h3 id={"turnoPatientName"} {...bindings["turnoPatientName"]}>
                  {bindings["turnoPatientName"]?.children ?? <>{"—"}</>}
                </h3>
                <p
                  id={"turnoScheduleLabel"}
                  {...bindings["turnoScheduleLabel"]}
                >
                  {bindings["turnoScheduleLabel"]?.children ?? <>{"—"}</>}
                </p>
              </div>
              <button
                className={"danger-btn"}
                id={"finalizarTurnoBtn"}
                {...bindings["finalizarTurnoBtn"]}
              >
                <i className={"fas fa-flag-checkered"}></i>
                {" Finalizar turno"}
              </button>
            </section>
            <section
              className={"alert-banner"}
              id={"alertBanner"}
              style={{ display: "none" }}
              {...bindings["alertBanner"]}
            >
              <i className={"fas fa-circle-exclamation"}></i>
              <span id={"alertBannerText"} {...bindings["alertBannerText"]}>
                {bindings["alertBannerText"]?.children ?? (
                  <>{"Alerta: valores críticos detectados"}</>
                )}
              </span>
            </section>
            <section className={"turno-actions-grid"}>
              <button
                className={"turno-action-btn"}
                onClick={(e) => onAction?.("openModal('vitalsModal')", e)}
              >
                <span className={"turno-action-icon"}>{"🩺"}</span>
                <span>{"Signos vitales"}</span>
              </button>
              <button
                className={"turno-action-btn"}
                onClick={(e) => onAction?.("openModal('medsModal')", e)}
              >
                <span className={"turno-action-icon"}>{"💊"}</span>
                <span>{"Medicación"}</span>
              </button>
              <button
                className={"turno-action-btn"}
                onClick={(e) => onAction?.("openModal('foodModal')", e)}
              >
                <span className={"turno-action-icon"}>{"🍽️"}</span>
                <span>{"Alimentación"}</span>
              </button>
              <button
                className={"turno-action-btn"}
                onClick={(e) => onAction?.("openModal('sleepModal')", e)}
              >
                <span className={"turno-action-icon"}>{"🛏️"}</span>
                <span>{"Sueño"}</span>
              </button>
              <button
                className={"turno-action-btn"}
                onClick={(e) => onAction?.("openModal('hygieneModal')", e)}
              >
                <span className={"turno-action-icon"}>{"🧼"}</span>
                <span>{"Higiene"}</span>
              </button>
              <button
                className={"turno-action-btn"}
                onClick={(e) => onAction?.("openModal('wellbeingModal')", e)}
              >
                <span className={"turno-action-icon"}>{"🙂"}</span>
                <span>{"Bienestar"}</span>
              </button>
              <button
                className={"turno-action-btn alert-variant"}
                onClick={(e) => onAction?.("openModal('incidentModal')", e)}
              >
                <span className={"turno-action-icon"}>{"⚠️"}</span>
                <span>{"Incidente"}</span>
              </button>
            </section>
            <section className={"panel"}>
              <div className={"panel-heading"}>
                <h3>
                  <i
                    className={"fas fa-timeline"}
                    style={{ color: "#216d5d" }}
                  ></i>
                  {" Línea temporal del turno"}
                </h3>
                <span
                  className={"muted"}
                  id={"recordCount"}
                  {...bindings["recordCount"]}
                >
                  {bindings["recordCount"]?.children ?? <>{"0 registros"}</>}
                </span>
              </div>
              <div
                className={"timeline"}
                id={"timeline"}
                {...bindings["timeline"]}
              >
                {slots["timeline"]}
              </div>
            </section>
          </div>
        </main>
      </div>

      <div className={"modal"} id={"vitalsModal"} {...bindings["vitalsModal"]}>
        <div className={"modal-card"}>
          <button
            className={"close-btn"}
            onClick={(e) => onAction?.("closeModal('vitalsModal')", e)}
          >
            {"×"}
          </button>
          <h3>
            <i
              className={"fas fa-heart-pulse"}
              style={{ color: "#216d5d" }}
            ></i>
            {" Registrar signos vitales"}
          </h3>
          <form
            className={"form"}
            id={"vitalsForm"}
            {...bindings["vitalsForm"]}
          >
            <div className={"two-cols"}>
              <div>
                <label htmlFor={"v_pressure"}>{"Presión arterial"}</label>
                <input
                  id={"v_pressure"}
                  placeholder={"120/80"}
                  required={true}
                  name={"v_pressure"}
                  {...bindings["v_pressure"]}
                />
              </div>
              <div>
                <label htmlFor={"v_heart"}>{"Frecuencia cardíaca (lpm)"}</label>
                <input
                  id={"v_heart"}
                  type={"number"}
                  placeholder={"72"}
                  required={true}
                  name={"v_heart"}
                  {...bindings["v_heart"]}
                />
              </div>
            </div>
            <div className={"two-cols"}>
              <div>
                <label htmlFor={"v_temp"}>{"Temperatura (°C)"}</label>
                <input
                  id={"v_temp"}
                  type={"number"}
                  step={"0.1"}
                  placeholder={"36.5"}
                  required={true}
                  name={"v_temp"}
                  {...bindings["v_temp"]}
                />
              </div>
              <div>
                <label htmlFor={"v_spo2"}>{"Saturación de oxígeno (%)"}</label>
                <input
                  id={"v_spo2"}
                  type={"number"}
                  placeholder={"98"}
                  required={true}
                  name={"v_spo2"}
                  {...bindings["v_spo2"]}
                />
              </div>
            </div>
            <button className={"primary-btn full"} type={"submit"}>
              <i className={"fas fa-save"}></i>
              {" Guardar registro"}
            </button>
          </form>
        </div>
      </div>

      <div className={"modal"} id={"medsModal"} {...bindings["medsModal"]}>
        <div className={"modal-card"}>
          <button
            className={"close-btn"}
            onClick={(e) => onAction?.("closeModal('medsModal')", e)}
          >
            {"×"}
          </button>
          <h3>
            <i className={"fas fa-pills"} style={{ color: "#216d5d" }}></i>
            {" Registrar medicación"}
          </h3>
          <form className={"form"} id={"medsForm"} {...bindings["medsForm"]}>
            <label htmlFor={"m_name"}>{"Medicamento"}</label>
            <input
              id={"m_name"}
              placeholder={"Ej. Paracetamol 500 mg"}
              required={true}
              name={"m_name"}
              {...bindings["m_name"]}
            />
            <div className={"two-cols"}>
              <div>
                <label htmlFor={"m_dose"}>{"Dosis"}</label>
                <input
                  id={"m_dose"}
                  placeholder={"Ej. 1 tableta"}
                  required={true}
                  name={"m_dose"}
                  {...bindings["m_dose"]}
                />
              </div>
              <div>
                <label htmlFor={"m_time"}>{"Hora"}</label>
                <input
                  id={"m_time"}
                  type={"time"}
                  required={true}
                  name={"m_time"}
                  {...bindings["m_time"]}
                />
              </div>
            </div>
            <label htmlFor={"m_status"}>{"Estado"}</label>
            <select
              id={"m_status"}
              required={true}
              name={"m_status"}
              {...bindings["m_status"]}
            >
              <option value={"Administrado"}>{"Administrado"}</option>
              <option value={"No administrado"}>{"No administrado"}</option>
            </select>
            <button className={"primary-btn full"} type={"submit"}>
              <i className={"fas fa-save"}></i>
              {" Guardar registro"}
            </button>
          </form>
        </div>
      </div>

      <div className={"modal"} id={"foodModal"} {...bindings["foodModal"]}>
        <div className={"modal-card"}>
          <button
            className={"close-btn"}
            onClick={(e) => onAction?.("closeModal('foodModal')", e)}
          >
            {"×"}
          </button>
          <h3>
            <i className={"fas fa-utensils"} style={{ color: "#216d5d" }}></i>
            {" Registrar alimentación"}
          </h3>
          <form className={"form"} id={"foodForm"} {...bindings["foodForm"]}>
            <label htmlFor={"f_meal"}>{"Comida"}</label>
            <select
              id={"f_meal"}
              required={true}
              name={"f_meal"}
              {...bindings["f_meal"]}
            >
              <option>{"Desayuno"}</option>
              <option>{"Almuerzo"}</option>
              <option>{"Cena"}</option>
              <option>{"Merienda"}</option>
            </select>
            <label htmlFor={"f_amount"}>{"Cantidad consumida"}</label>
            <select
              id={"f_amount"}
              required={true}
              name={"f_amount"}
              {...bindings["f_amount"]}
            >
              <option value={"100"}>{"Completo (100%)"}</option>
              <option value={"75"}>{"Bastante (75%)"}</option>
              <option value={"50"}>{"Parcial (50%)"}</option>
              <option value={"25"}>{"Poco (25%)"}</option>
              <option value={"0"}>{"Rechazado (0%)"}</option>
            </select>
            <label htmlFor={"f_note"}>{"Nota (opcional)"}</label>
            <input
              id={"f_note"}
              placeholder={"Ej. Buen apetito"}
              name={"f_note"}
              {...bindings["f_note"]}
            />
            <button className={"primary-btn full"} type={"submit"}>
              <i className={"fas fa-save"}></i>
              {" Guardar registro"}
            </button>
          </form>
        </div>
      </div>

      <div className={"modal"} id={"sleepModal"} {...bindings["sleepModal"]}>
        <div className={"modal-card"}>
          <button
            className={"close-btn"}
            onClick={(e) => onAction?.("closeModal('sleepModal')", e)}
          >
            {"×"}
          </button>
          <h3>
            <i className={"fas fa-bed"} style={{ color: "#216d5d" }}></i>
            {" Registrar sueño"}
          </h3>
          <form className={"form"} id={"sleepForm"} {...bindings["sleepForm"]}>
            <label htmlFor={"s_hours"}>{"Horas de sueño"}</label>
            <input
              id={"s_hours"}
              type={"number"}
              step={"0.5"}
              placeholder={"Ej. 7"}
              required={true}
              name={"s_hours"}
              {...bindings["s_hours"]}
            />
            <label htmlFor={"s_quality"}>{"Calidad del descanso"}</label>
            <select
              id={"s_quality"}
              required={true}
              name={"s_quality"}
              {...bindings["s_quality"]}
            >
              <option>{"Buena"}</option>
              <option>{"Regular"}</option>
              <option>{"Mala"}</option>
            </select>
            <button className={"primary-btn full"} type={"submit"}>
              <i className={"fas fa-save"}></i>
              {" Guardar registro"}
            </button>
          </form>
        </div>
      </div>

      <div
        className={"modal"}
        id={"hygieneModal"}
        {...bindings["hygieneModal"]}
      >
        <div className={"modal-card"}>
          <button
            className={"close-btn"}
            onClick={(e) => onAction?.("closeModal('hygieneModal')", e)}
          >
            {"×"}
          </button>
          <h3>
            <i className={"fas fa-soap"} style={{ color: "#216d5d" }}></i>
            {" Registrar higiene"}
          </h3>
          <form
            className={"form"}
            id={"hygieneForm"}
            {...bindings["hygieneForm"]}
          >
            <label>{"Actividades realizadas"}</label>
            <div className={"checkbox-grid"}>
              <label className={"checkbox-item"}>
                <input
                  type={"checkbox"}
                  name="activities"
                  defaultValue={"Baño"}
                />
                {" Baño"}
              </label>
              <label className={"checkbox-item"}>
                <input
                  type={"checkbox"}
                  name="activities"
                  defaultValue={"Higiene bucal"}
                />
                {" Higiene bucal"}
              </label>
              <label className={"checkbox-item"}>
                <input
                  type={"checkbox"}
                  name="activities"
                  defaultValue={"Cambio de ropa"}
                />
                {" Cambio de ropa"}
              </label>
              <label className={"checkbox-item"}>
                <input
                  type={"checkbox"}
                  name="activities"
                  defaultValue={"Higiene general"}
                />
                {" Higiene general"}
              </label>
            </div>
            <button className={"primary-btn full"} type={"submit"}>
              <i className={"fas fa-save"}></i>
              {" Guardar registro"}
            </button>
          </form>
        </div>
      </div>

      <div
        className={"modal"}
        id={"wellbeingModal"}
        {...bindings["wellbeingModal"]}
      >
        <div className={"modal-card"}>
          <button
            className={"close-btn"}
            onClick={(e) => onAction?.("closeModal('wellbeingModal')", e)}
          >
            {"×"}
          </button>
          <h3>
            <i className={"fas fa-face-smile"} style={{ color: "#216d5d" }}></i>
            {" Estado de bienestar"}
          </h3>
          <p className={"muted"}>
            {"Selecciona el estado observado del paciente."}
          </p>
          <div className={"wellbeing-grid"}>
            <button
              type={"button"}
              className={"wellbeing-btn"}
              onClick={(e) => onAction?.("recordWellbeing('Bien 🙂')", e)}
            >
              {"🙂 Bien"}
            </button>
            <button
              type={"button"}
              className={"wellbeing-btn"}
              onClick={(e) => onAction?.("recordWellbeing('Tranquilo 😌')", e)}
            >
              {"😌 Tranquilo"}
            </button>
            <button
              type={"button"}
              className={"wellbeing-btn"}
              onClick={(e) => onAction?.("recordWellbeing('Cansado 😴')", e)}
            >
              {"😴 Cansado"}
            </button>
            <button
              type={"button"}
              className={"wellbeing-btn"}
              onClick={(e) => onAction?.("recordWellbeing('Ansioso 😟')", e)}
            >
              {"😟 Ansioso"}
            </button>
            <button
              type={"button"}
              className={"wellbeing-btn"}
              onClick={(e) => onAction?.("recordWellbeing('Triste 🙁')", e)}
            >
              {"🙁 Triste"}
            </button>
            <button
              type={"button"}
              className={"wellbeing-btn"}
              onClick={(e) => onAction?.("recordWellbeingOther()", e)}
            >
              {"✍️ Otro"}
            </button>
          </div>
        </div>
      </div>

      <div
        className={"modal"}
        id={"incidentModal"}
        {...bindings["incidentModal"]}
      >
        <div className={"modal-card"}>
          <button
            className={"close-btn"}
            onClick={(e) => onAction?.("closeModal('incidentModal')", e)}
          >
            {"×"}
          </button>
          <h3>
            <i
              className={"fas fa-triangle-exclamation"}
              style={{ color: "#e53e3e" }}
            ></i>
            {" Registrar incidente"}
          </h3>
          <p className={"muted"}>
            {
              "Registra el hecho de forma objetiva. No se realizan diagnósticos médicos."
            }
          </p>
          <form
            className={"form"}
            id={"incidentForm"}
            {...bindings["incidentForm"]}
          >
            <label htmlFor={"i_type"}>{"Tipo"}</label>
            <select
              id={"i_type"}
              required={true}
              name={"i_type"}
              {...bindings["i_type"]}
            >
              <option>{"Caída"}</option>
              <option>{"Dolor"}</option>
              <option>{"Confusión"}</option>
              <option>{"Rechazo de alimento"}</option>
              <option>{"Otro"}</option>
            </select>
            <label htmlFor={"i_description"}>{"Descripción"}</label>
            <textarea
              id={"i_description"}
              rows={"3"}
              placeholder={"Ej. Paciente presenta dolor leve en rodilla."}
              required={true}
              name={"i_description"}
              {...bindings["i_description"]}
            ></textarea>
            <label htmlFor={"i_time"}>{"Hora"}</label>
            <input
              id={"i_time"}
              type={"time"}
              required={true}
              name={"i_time"}
              {...bindings["i_time"]}
            />
            <button className={"primary-btn full"} type={"submit"}>
              <i className={"fas fa-save"}></i>
              {" Guardar incidente"}
            </button>
          </form>
        </div>
      </div>

      <div
        className={"modal"}
        id={"summaryModal"}
        {...bindings["summaryModal"]}
      >
        <div className={"modal-card"}>
          <button
            className={"close-btn"}
            onClick={(e) => onAction?.("closeModal('summaryModal')", e)}
          >
            {"×"}
          </button>
          <h3 id="shift-summary-title">
            <i className={"fas fa-file-lines"} style={{ color: "#216d5d" }}></i>
            {" Resumen del turno"}
          </h3>
          <div
            id={"summaryContent"}
            className={"generated-report"}
            {...bindings["summaryContent"]}
          >
            {slots["summaryContent"]}
          </div>
          <label htmlFor="summaryNotes">
            {"Observaciones generales (opcional)"}
          </label>
          <textarea
            id={"summaryNotes"}
            rows={"3"}
            placeholder={"Resumen del estado del paciente durante el turno."}
            name={"summaryNotes"}
            {...bindings["summaryNotes"]}
          ></textarea>
          <div className={"report-actions"}>
            <button
              className={"ghost-btn"}
              onClick={(e) => onAction?.("closeModal('summaryModal')", e)}
            >
              <i className={"fas fa-arrow-left"}></i>
              {" Seguir turno"}
            </button>
            <button
              className={"primary-btn"}
              onClick={(e) => onAction?.("generateReport()", e)}
            >
              <i className={"fas fa-file-pdf"}></i>
              {" Generar reporte"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
