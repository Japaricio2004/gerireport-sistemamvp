import React from "react";
import { useStore } from "./store";
import { summarizeReport, reportReview, canAccessPatient, reportsForUser } from "./data";
function Guide({ steps }) {
  return (
    <ol className="section-guide" aria-label="Pasos del registro">
      {steps.map(([title, detail], index) => (
        <li key={title}>
          <span className="guide-number">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <strong>{title}</strong>
            <small>{detail}</small>
          </div>
        </li>
      ))}
    </ol>
  );
}
export default function SectionContext() {
  const store = useStore();
  const patients = store.patients.filter((patient) => canAccessPatient(patient, store.user));
  const reports = reportsForUser(store.reports, store.patients, store.user);
  const tasks = store.tasks.filter((task) => patients.some((patient) => patient.name === task.patient));
  const turn = store.turn?.technician === store.user?.name && patients.some((patient) => patient.name === store.turn.patient) ? store.turn : null;
  const path = location.pathname;
  if (path.endsWith("nuevo-reporte.html"))
    return (
      <Guide
        steps={[
          ["Identifica al paciente", "Selecciona el paciente y su turno"],
          ["Documenta los cuidados", "Completa signos y atenciones"],
          ["Revisa y guarda", "Consulta la vista previa del reporte"],
        ]}
      />
    );
  if (path.endsWith("turno.html") && !turn)
    return (
      <Guide
        steps={[
          ["Elige un paciente", "Abre su ficha para iniciar el turno"],
          [
            "Registra cada atención",
            "Organiza los cuidados en una línea temporal",
          ],
          ["Cierra con un reporte", "Revisa y guarda el resumen del turno"],
        ]}
      />
    );
  let stats = [];
  let caption = "Resumen de actividad";
  if (path.endsWith("pacientes.html")) {
    caption = "Tu red de cuidados";
    stats = [
      [
        "fa-users",
        "Pacientes registrados",
        patients.length,
        "Personas bajo tu cuidado",
        "mint",
      ],
      [
        "fa-heart-pulse",
        "Requieren atención",
        patients.filter((p) => ["Alerta", "Crítico"].includes(p.status)).length,
        "Según el estado de su ficha",
        "amber",
      ],
      [
        "fa-clock",
        "Turno actual",
        turn ? "En curso" : "Por iniciar",
        turn?.patient || "Todo listo para comenzar",
        "blue",
      ],
    ];
  } else if (path.endsWith("reportes.html")) {
    caption = "Historial completo";
    stats = [
      [
        "fa-file-lines",
        "Reportes guardados",
        reports.length,
        "Cuidados documentados",
        "mint",
      ],
      [
        "fa-triangle-exclamation",
        "Para revisar",
        reports.filter((r) => summarizeReport(r).status === "Revisar").length,
        "Reportes con observaciones",
        "amber",
      ],
      [
        "fa-user-check",
        "Pacientes con historial",
        new Set(reports.map((r) => r.patient)).size,
        "Seguimiento en un solo lugar",
        "blue",
      ],
    ];
  } else if (path.endsWith("seguimiento.html")) {
    caption = "Organiza tu jornada";
    stats = [
      [
        "fa-list-check",
        "Tareas del equipo",
        tasks.length,
        "Plan de cuidados registrado",
        "blue",
      ],
      [
        "fa-flag",
        "Prioridad alta",
        tasks.filter((t) => t.priority === "Alta" && t.status !== "done")
          .length,
        "Pendientes de completar",
        "amber",
      ],
      [
        "fa-circle-check",
        "Completadas",
        tasks.filter((t) => t.status === "done").length,
        "Avance de la jornada",
        "mint",
      ],
    ];
  } else if (path.endsWith("turno.html") && turn) {
    caption = "Cada atención cuenta";
    stats = [
      [
        "fa-clipboard-list",
        "Registros del turno",
        turn.records.length,
        "Tu registro de cuidados",
        "mint",
      ],
      [
        "fa-triangle-exclamation",
        "Para revisar",
        reportReview(turn).length,
        "Observaciones del turno",
        "amber",
      ],
      ["fa-clock", "Inicio del turno", turn.startLabel, turn.patient, "blue"],
    ];
  }
  if (!stats.length) return null;
  const done = tasks.filter((t) => t.status === "done").length;
  return (
    <section className="section-context" aria-label={caption}>
      <p className="context-caption">{caption}</p>
      <div className="context-grid">
        {stats.map(([icon, label, value, detail, tone]) => (
          <article className={"context-stat context-" + tone} key={label}>
            <span className="context-icon" aria-hidden="true">
              <i className={"fas " + icon} />
            </span>
            <div>
              <span className="context-label">{label}</span>
              <strong>{value}</strong>
              <small>{detail}</small>
            </div>
          </article>
        ))}
      </div>
      {path.endsWith("seguimiento.html") && (
        <div className="context-progress">
          <span>Progreso del plan</span>
          <progress
            value={done}
            max={tasks.length || 1}
            aria-label="Tareas completadas"
          />
          <strong>
            {tasks.length ? Math.round((done / tasks.length) * 100) : 0}%
          </strong>
        </div>
      )}
    </section>
  );
}
