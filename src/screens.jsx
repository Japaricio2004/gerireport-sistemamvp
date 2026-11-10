import React, { useState, useEffect, useRef } from "react";
import { useStore, go } from "./store";
import { Modal, Field } from "./components";
import SectionContext from "./SectionContext";
import { USERS_KEY, clearSession } from "./auth";
import {
  keys,
  formatTime,
  formatDateOnly,
  formatDate,
  summarizeReport,
  checkVitalAlerts,
  reportReview,
  recordReviewReasons,
  canAccessPatient,
  reportsForUser,
  logActivity,
} from "./data";
import PatientsTemplate from "./original/pacientes";
import ShiftTemplate from "./original/turno";
import ManualTemplate from "./original/nuevo-reporte";
import HistoryTemplate from "./original/reportes";
import DetailTemplate from "./original/reporte-detalle";
import TasksTemplate from "./original/seguimiento";
import FamilyTemplate from "./original/vista-familiar";
export { default as Login } from "./AuthPage";

export const categories = {
  vitals: ["🩺", "Signos vitales"],
  medication: ["💊", "Medicación"],
  food: ["🍽️", "Alimentación"],
  sleep: ["🛏️", "Sueño"],
  hygiene: ["🧼", "Higiene"],
  wellbeing: ["🙂", "Bienestar"],
  incident: ["⚠️", "Incidentes"],
};
const modalTypes = {
  vitalsModal: "vitals",
  medsModal: "medication",
  foodModal: "food",
  sleepModal: "sleep",
  hygieneModal: "hygiene",
  wellbeingModal: "wellbeing",
  incidentModal: "incident",
};
const statusClass = (value) =>
  ["Revisar", "Alerta"].includes(value)
    ? "alerta"
    : value === "Crítico"
      ? "critico"
      : "estable";
const formData = (e) => Object.fromEntries(new FormData(e.currentTarget));
function validateText(form) {
  for (const field of form.querySelectorAll(
    "input[required], textarea[required]",
  )) {
    if (field.type === "checkbox") continue;
    field.setCustomValidity(
      field.value.trim() ? "" : "Escribe un valor; no uses solo espacios.",
    );
    field.oninput = () => field.setCustomValidity("");
    if (!field.reportValidity()) return false;
  }
  return true;
}
function usePageModal(id, close) {
  useEffect(() => {
    if (!id) return;
    const root = document.getElementById(id);
    if (!root) return;
    const previous = document.activeElement;
    const focusable = () =>
      [...root.querySelectorAll("button,input,select,textarea,a[href]")].filter(
        (el) => !el.disabled && el.getClientRects().length,
      );
    focusable()[0]?.focus();
    const handle = (e) => {
      if (document.querySelector("dialog[open]")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key === "Tab") {
        const nodes = focusable(),
          first = nodes[0],
          last = nodes.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.removeEventListener("keydown", handle);
      if (previous?.isConnected) previous.focus();
    };
  }, [id]);
}
const searchable = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
function useOriginal() {
  const { menuOpen: menu, setMenuOpen: setMenu } = useStore();
  return {
    bindings: {
      sidebar: { className: "sidebar" + (menu ? " open" : "") },
      menuBtn: {
        onClick: () => setMenu(!menu),
        "aria-label": menu ? "Cerrar menú" : "Abrir menú",
        "aria-controls": "care-navigation",
        "aria-expanded": menu,
      },
    },
    slots: {
      sidebar: false,
      pageIntro: <SectionContext />,
    },
  };
}
export function OriginalTimeline({ records = [] }) {
  return !records.length ? (
    <p className="muted">Aún no hay registros en este turno.</p>
  ) : (
    records.map((r) => (
      <div
        className={
          "timeline-item " +
          (recordReviewReasons(r).length ? "timeline-alert" : "")
        }
        key={r.id}
      >
        <div className="timeline-time">{r.time}</div>
        <div className="timeline-body">
          <div className="timeline-title">
            {r.icon} {r.title}{" "}
            {recordReviewReasons(r).length > 0 && (
              <span className="tag-alert">Para revisar</span>
            )}
          </div>
          <p>{r.detail}</p>
          {r.responsible && <small>Registrado por {r.responsible} · {r.createdAt ? new Date(r.createdAt).toLocaleDateString("es-PE") : ""}</small>}
        </div>
      </div>
    ))
  );
}
function ReviewNotice({ entries = [] }) {
  if (!entries.length) return null;
  return (
    <span className="review-notice">
      <strong>
        {entries.length === 1
          ? "Hay 1 registro para revisar"
          : `Hay ${entries.length} registros para revisar`}
      </strong>
      <span className="review-notice-list" role="list">
        {entries.map((entry) => (
          <span className="review-notice-item" role="listitem" key={entry.id}>
            {entry.time && <b>{entry.time}</b>}
            <span>{entry.reasons.join(" · ")}</span>
          </span>
        ))}
      </span>
      <small>
        Avisos de la demo para verificar registros; no son un diagnóstico ni
        envían notificaciones.
      </small>
    </span>
  );
}
function Badge({ status }) {
  const label =
    status === "Revisar"
      ? "Requiere revisión"
      : status === "Estable"
        ? "Sin observaciones"
        : status;
  return (
    <span
      className={
        "badge-status " +
        (status === "Revisar"
          ? "badge-danger"
          : status === "Sin registros"
            ? "badge-neutral"
            : "badge-success")
      }
    >
      <i
        className={
          "fas " +
          (status === "Revisar"
            ? "fa-triangle-exclamation"
            : status === "Sin registros"
              ? "fa-clock"
              : "fa-circle-check")
        }
      />{" "}
      {label}
    </span>
  );
}
function archiveTurn(store, turn, notes = "") {
  const report = {
    id: Date.now(),
    type: "turno",
    createdAt: formatDate(),
    patient: turn.patient,
    technician: turn.technician,
    date: turn.dateLabel,
    shift: "Turno completo",
    startTime: turn.startLabel,
    endTime: formatTime(),
    records: turn.records,
    notes,
    status: !turn.records.length
      ? "Sin registros"
      : reportReview(turn).length
        ? "Revisar"
        : "Estable",
    incidentCount: turn.records.filter((r) => r.type === "incident").length,
  };
  store.setReports([report, ...store.reports]);
  logActivity(store.user, "Finalizó turno", report.patient);
  return report;
}
export function Patients() {
  const base = useOriginal();
  const store = useStore();
  const { patients, setPatients, turn, setTurn, ask } = store;
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  usePageModal(open ? "patientModal" : null, () => setOpen(false));
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  async function start(p) {
    if (store.user.role !== "technician") return;
    if (!p.active || !p.consent?.by) return;
    if (turn && turn.technician !== store.user.name) {
      await ask("Turno en uso", "Otro técnico tiene un turno abierto en este navegador. Cierra ese turno desde su sesión antes de continuar.", false);
      return;
    }
    if (turn?.patient === p.name) {
      go("/pages/turno.html");
      return;
    }
    if (
      turn &&
      !(await ask(
        "Cambiar turno",
        `El turno de ${turn.patient} sigue abierto. Se guardará su reporte antes de iniciar otro turno. ¿Continuar?`,
      ))
    )
      return;
    if (turn) archiveTurn(store, turn);
    setTurn({
      patient: p.name,
      technician: store.user.name,
      startTime: new Date().toISOString(),
      startLabel: formatTime(),
      dateLabel: formatDateOnly(),
      records: [],
    });
    logActivity(store.user, "Inició turno", p.name);
    go("/pages/turno.html");
  }
  const assignedPatients = patients.filter((p) => canAccessPatient(p, store.user));
  const visiblePatients = assignedPatients.filter(
    (p) =>
      searchable(`${p.name} ${p.code || ""}`).includes(searchable(search)) &&
      (!status || (p.status || "Estable") === status),
  );
  const cards = visiblePatients.map((p, i) => (
    <article
      className={
        "patient-card patient-state-" +
        statusClass(p.status) +
        (turn?.patient === p.name ? " patient-with-turn" : "")
      }
      key={i}
    >
      <div className="card-header">
        <div className="avatar">
          {p.name
            .split(" ")
            .slice(0, 2)
            .map((x) => x[0])
            .join("")
            .toUpperCase()}
        </div>
        <div className="header-info">
          <span className="name">{p.name}</span>
          <span className="age">{p.code} · {p.age} años</span>
        </div>
        <span className={"status-badge " + statusClass(p.status)}>
          {p.status || "Estable"}
        </span>
      </div>
      <div className="card-body">
        {[
          ["fa-stethoscope", "Condición:", p.condition],
          ["fa-user", "Familiar:", p.family],
          ["fa-user-nurse", "Técnico:", p.assignedTo],
          ["fa-clock", "Estado:", p.active ? "Activo" : "Inactivo"],
          ["fa-shield-heart", "Consentimiento:", p.consent?.by ? `Registrado por ${p.consent.by}` : "Pendiente"],
        ].map(([icon, label, value]) => (
          <div className="detail" key={label}>
            <i className={"fas " + icon} />
            <span className="label">{label}</span>
            <span className="value">{value}</span>
          </div>
        ))}
      </div>
      <div className="card-footer">
        <button className="btn-action btn-turno" onClick={() => start(p)} disabled={store.user.role !== "technician" || !p.active || !p.consent?.by}>
          <i className="fas fa-play" />{" "}
          {turn?.patient === p.name ? "Continuar turno" : "Iniciar turno"}
        </button>
        <a
          className="btn-action btn-historial"
          href={"/pages/reportes.html?paciente=" + encodeURIComponent(p.name)}
        >
          <i className="fas fa-clock-rotate-left" /> Ver historial
        </a>
        <button className="btn-action btn-historial" onClick={() => { setEditing(p.name); setOpen(true); }}>Editar ficha</button>
        <button className="btn-action btn-historial" onClick={() => { setPatients(patients.map((item) => item.name === p.name ? { ...item, active: !item.active } : item)); logActivity(store.user, p.active ? "Desactivó paciente" : "Activó paciente", p.code); }} disabled={turn?.patient === p.name}>
          {p.active ? "Desactivar" : "Activar"}
        </button>
        {(!p.active || !p.consent?.by) && <small>{!p.active ? "Paciente inactivo" : "Registra el consentimiento para iniciar"}</small>}
      </div>
    </article>
  ));
  return (
    <PatientsTemplate
      slots={{
        ...base.slots,
        patientModalTitle: editing ? " Editar paciente" : " Registrar paciente",
        patientSubmitLabel: editing ? " Guardar cambios" : " Guardar paciente",
        technicianOptions: store.users.filter((account) => account.role === "technician" && account.active).map((account) => <option key={account.id} value={account.name} />),
        pageIntro: (
          <>
            <div className="patients-toolbar">
              <label className="patient-search">
                <span>Buscar paciente</span>
                <div>
                  <i className="fas fa-magnifying-glass" aria-hidden="true" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Nombre o código…"
                  />
                </div>
              </label>
              <label className="patient-state-filter">
                <span>Estado de cuidado</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  {[...new Set(patients.map((p) => p.status || "Estable"))].map(
                    (value) => (
                      <option key={value}>{value}</option>
                    ),
                  )}
                </select>
              </label>
              <span className="patient-result-count" role="status">
                {visiblePatients.length} de {assignedPatients.length} pacientes asignados
              </span>
            </div>
          </>
        ),
        patientGrid: (
          <>
            {cards.length ? (
              cards
            ) : (
              <div className="section-empty">
                <span className="section-empty-icon">
                  <i className="fas fa-magnifying-glass" aria-hidden="true" />
                </span>
                <h3>No encontramos pacientes</h3>
                <p>Prueba con otro nombre o cambia el estado seleccionado.</p>
              </div>
            )}
            {base.slots.pageIntro}
          </>
        ),
      }}
      bindings={{
        ...base.bindings,
        patientModal: {
          className: "modal" + (open ? " active" : ""),
          role: "dialog",
          "aria-modal": true,
          "aria-label": editing ? "Editar paciente" : "Registrar paciente",
        },
        patientName: { defaultValue: editing || "", readOnly: Boolean(editing) },
        patientAge: { min: 0, max: 120, defaultValue: patients.find((p) => p.name === editing)?.age || "" },
        patientCondition: { defaultValue: patients.find((p) => p.name === editing)?.condition || "" },
        patientFamily: { defaultValue: patients.find((p) => p.name === editing)?.family || "" },
        patientTechnician: { defaultValue: patients.find((p) => p.name === editing)?.assignedTo || (store.user.role === "admin" ? store.users.find((account) => account.role === "technician" && account.active)?.name : store.user.name) || "", readOnly: store.user.role !== "admin" || turn?.patient === editing },
        patientConsentBy: { defaultValue: patients.find((p) => p.name === editing)?.consent?.by || "" },
        patientConsent: { defaultChecked: Boolean(patients.find((p) => p.name === editing)?.consent) },
        patientForm: {
          key: editing || "new",
          onSubmit: (e) => {
            e.preventDefault();
            if (!validateText(e.currentTarget)) return;
            const d = formData(e);
            if (!editing &&
              patients.some(
                (p) => searchable(p.name) === searchable(d.patientName.trim()),
              )
            ) {
              const field = e.currentTarget.elements.patientName;
              field.setCustomValidity("Ya existe un paciente con este nombre.");
              field.oninput = () => field.setCustomValidity("");
              field.reportValidity();
              return;
            }
            if (!store.users.some((account) => account.role === "technician" && account.active && account.name === d.patientTechnician.trim())) {
              const field = e.currentTarget.elements.patientTechnician;
              field.setCustomValidity("Selecciona un técnico activo registrado.");
              field.oninput = () => field.setCustomValidity("");
              field.reportValidity();
              return;
            }
            const previous = patients.find((p) => p.name === editing);
            const next = {
              ...previous,
              name: d.patientName.trim(),
              code: previous?.code || `PAC-${Date.now().toString(36).toUpperCase()}`,
              age: d.patientAge,
              condition: d.patientCondition.trim(),
              family: d.patientFamily.trim(),
              assignedTo: d.patientTechnician.trim(),
              consent: previous?.consent?.by === d.patientConsentBy.trim() ? previous.consent : { by: d.patientConsentBy.trim(), at: new Date().toISOString() },
              active: previous?.active !== false,
              status: previous?.status || "Estable",
            };
            setPatients(editing ? patients.map((p) => p.name === editing ? next : p) : [...patients, next]);
            logActivity(store.user, editing ? "Editó paciente" : "Registró paciente", next.code);
            e.currentTarget.reset();
            setOpen(false);
            setEditing(null);
          },
        },
      }}
      onAction={(action) => {
        if (action === "openPatientModal()") { setEditing(null); setOpen(true); }
        else { setOpen(false); setEditing(null); }
      }}
    />
  );
}
export function Shift() {
  const base = useOriginal();
  const store = useStore();
  const { setTurn } = store;
  const turn = store.turn?.technician === store.user.name && store.patients.some((p) => p.name === store.turn.patient && canAccessPatient(p, store.user)) ? store.turn : null;
  const closing = useRef(false);
  const [modal, setModal] = useState(null);
  usePageModal(modal, () => setModal(null));
  const [notes, setNotes] = useState("");
  const [custom, setCustom] = useState(false);
  const [error, setError] = useState("");
  const [other, setOther] = useState("");
  const review = reportReview(turn);
  function add(type, data, detail, alert = false, title) {
    const [icon, label] = categories[type];
    setTurn({
      ...turn,
      records: [
        ...turn.records,
        {
          id: Date.now(),
          time: data.time || formatTime(),
          createdAt: new Date().toISOString(),
          responsible: store.user.name,
          type,
          icon,
          title: title || label,
          detail,
          alert,
          data,
        },
      ],
    });
    logActivity(store.user, "Registró atención", `${turn.patient}: ${label}`);
    setModal(null);
    setError("");
  }
  function save(type, e) {
    e.preventDefault();
    if (!validateText(e.currentTarget)) return;
    const d = formData(e);
    switch (type) {
      case "vitals":
        add(
          type,
          d,
          `Presión: ${d.pressure} · FC: ${d.heart} lpm · FR: ${d.resp} rpm · Temp: ${d.temp} °C · SpO₂: ${d.spo2}%`,
          checkVitalAlerts(d).alert,
        );
        break;
      case "medication":
        add(
          type,
          d,
          `${d.name} · ${d.dose} · ${d.status}`,
          d.status === "No administrado",
        );
        break;
      case "food":
        add(
          type,
          d,
          `Consumo: ${d.amount}%${d.hydration !== "" ? ` · Hidratación: ${d.hydration} ml` : ""}${d.note ? " · " + d.note : ""}`,
          Number(d.amount) === 0,
          d.meal,
        );
        break;
      case "sleep":
        add(type, d, `${d.hours} horas · Calidad: ${d.quality}`);
        break;
      case "hygiene": {
        const activities = new FormData(e.currentTarget).getAll("activities");
        if (!activities.length) {
          setError("Selecciona al menos una actividad de higiene.");
          return;
        }
        add(type, { activities }, activities.join(", "));
        break;
      }
      case "incident":
        add(type, d, d.description, true, "Incidente: " + d.incidentType);
        break;
      default:
        break;
    }
  }
  const names = {
    v_pressure: "pressure",
    v_heart: "heart",
    v_resp: "resp",
    v_temp: "temp",
    v_spo2: "spo2",
    m_name: "name",
    m_dose: "dose",
    m_time: "time",
    m_status: "status",
    f_meal: "meal",
    f_amount: "amount",
    f_note: "note",
    f_hydration: "hydration",
    s_hours: "hours",
    s_quality: "quality",
    i_type: "incidentType",
    i_description: "description",
    i_time: "time",
  };
  const bindings = {
    ...base.bindings,
    noTurnoState: { style: { display: turn ? "none" : "block" } },
    turnoActiveState: { style: { display: turn ? "block" : "none" } },
    turnoPatientName: { children: turn?.patient },
    turnoScheduleLabel: {
      children: turn
        ? `${turn.dateLabel} · Inicio ${turn.startLabel} · Técnico: ${turn.technician}`
        : "",
    },
    recordCount: {
      children: `${turn?.records.length || 0} registros`,
      "aria-live": "polite",
    },
    finalizarTurnoBtn: { onClick: () => setModal("summaryModal") },
    summaryNotes: { value: notes, onChange: (e) => setNotes(e.target.value) },
    alertBanner: {
      style: { display: review.length ? "block" : "none" },
      role: "status",
    },
    alertBannerText: {
      children: <ReviewNotice entries={review} />,
    },
  };
  for (const [id, name] of Object.entries(names))
    bindings[id] = {
      name,
      ...(["m_time", "i_time"].includes(id)
        ? { defaultValue: formatTime() }
        : {}),
      ...(id === "v_spo2" ? { min: 0, max: 100 } : {}),
      ...(id === "v_pressure"
        ? {
            pattern: "[0-9]{2,3}/[0-9]{2,3}",
            title: "Escribe dos números separados por /, por ejemplo 120/80.",
          }
        : {}),
      ...(id === "v_heart" ? { min: 1 } : {}),
      ...(id === "v_resp" ? { min: 1 } : {}),
      ...(id === "v_temp" ? { min: 0.1 } : {}),
    };
  for (const [id, type] of Object.entries(modalTypes)) {
    bindings[id] = {
      className: "modal" + (modal === id ? " active" : ""),
      role: "dialog",
      "aria-modal": true,
      "aria-label": categories[type][1],
    };
    const formId = {
      vitals: "vitalsForm",
      medication: "medsForm",
      food: "foodForm",
      sleep: "sleepForm",
      hygiene: "hygieneForm",
      incident: "incidentForm",
    }[type];
    if (formId)
      bindings[formId] = {
        key: modal === id ? "open" : "closed",
        onSubmit: (e) => save(type, e),
      };
  }
  bindings.summaryModal = {
    className: "modal" + (modal === "summaryModal" ? " active" : ""),
    role: "dialog",
    "aria-modal": true,
    "aria-labelledby": "shift-summary-title",
  };
  function action(source) {
    if (source.startsWith("openModal")) {
      setError("");
      setModal(source.match(/'([^']+)'/)[1]);
    } else if (source.startsWith("closeModal")) setModal(null);
    else if (source.startsWith("recordWellbeing(")) {
      const state = source.match(/'([^']+)'/)[1];
      add("wellbeing", { state }, state);
    } else if (source === "recordWellbeingOther()") setCustom(true);
    else if (source === "generateReport()") {
      if (!turn || closing.current) return;
      closing.current = true;
      const r = archiveTurn(store, turn, notes);
      setTurn(null);
      go("/pages/reporte-detalle.html?id=" + r.id);
    }
  }
  const hasAlerts = review.length > 0;
  const incidentCount =
    turn?.records.filter((record) => record.type === "incident").length || 0;
  const summary = turn && (
    <div className="shift-summary">
      <div className="shift-summary-patient">
        <span className="shift-summary-avatar" aria-hidden="true">
          {turn.patient
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")}
        </span>
        <div>
          <span className="shift-summary-eyebrow">Paciente atendido</span>
          <h4>{turn.patient}</h4>
        </div>
        <span
          className={
            "shift-summary-status" + (hasAlerts ? " needs-review" : "")
          }
        >
          {hasAlerts
            ? "Revisar registros"
            : turn.records.length
              ? "Sin alertas"
              : "Sin registros"}
        </span>
      </div>
      <div className="shift-summary-meta">
        <div>
          <span>Fecha del turno</span>
          <strong>{turn.dateLabel}</strong>
        </div>
        <div>
          <span>Inicio</span>
          <strong>{turn.startLabel}</strong>
        </div>
        <div>
          <span>Finalización</span>
          <strong>{formatTime()}</strong>
        </div>
      </div>
      <div className="shift-summary-heading">
        <h5>Cuidados registrados</h5>
        <span>
          {turn.records.length}{" "}
          {turn.records.length === 1 ? "registro" : "registros"}
        </span>
      </div>
      <div className="shift-summary-grid">
        {Object.entries(categories)
          .filter(([type]) => type !== "incident")
          .map(([type, [icon, label]]) => {
            const count = turn.records.filter(
              (record) => record.type === type,
            ).length;
            return (
              <div
                className={"shift-summary-item" + (count ? " has-records" : "")}
                key={type}
              >
                <span className="shift-summary-icon" aria-hidden="true">
                  {icon}
                </span>
                <span>{label}</span>
                <strong>{count}</strong>
              </div>
            );
          })}
      </div>
      <div
        className={
          "shift-summary-incidents" + (incidentCount ? " has-incidents" : "")
        }
      >
        <i className="fas fa-triangle-exclamation" aria-hidden="true" />
        <div>
          <strong>
            {incidentCount
              ? `${incidentCount} ${incidentCount === 1 ? "incidente registrado" : "incidentes registrados"}`
              : "Sin incidentes registrados"}
          </strong>
          <span>
            {hasAlerts
              ? "Revisa las observaciones antes de generar el reporte."
              : "El reporte incluirá todos los registros de este turno."}
          </span>
        </div>
      </div>
      <ReviewNotice entries={review} />
      {!turn.records.length && (
        <p className="shift-summary-empty">
          Aún no registraste cuidados. Puedes volver al turno para completar la
          información.
        </p>
      )}
    </div>
  );
  return (
    <>
      <ShiftTemplate
        bindings={bindings}
        slots={{
          ...base.slots,
          timeline: <OriginalTimeline records={turn?.records} />,
          summaryContent: summary,
        }}
        onAction={action}
      />
      {error && (
        <Modal title="Completa el registro" onClose={() => setError("")}>
          <p>{error}</p>
        </Modal>
      )}
      {custom && (
        <Modal title="Registrar bienestar" onClose={() => setCustom(false)}>
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!validateText(e.currentTarget)) return;
              add("wellbeing", { state: other }, other);
              setOther("");
              setCustom(false);
            }}
          >
            <Field
              label="Estado observado"
              value={other}
              onChange={(e) => setOther(e.target.value)}
              required
            />
            <button className="primary-btn">Guardar</button>
          </form>
        </Modal>
      )}
    </>
  );
}
const manualFields = [
  ["Paciente", "patient"],
  ["Turno", "shift"],
  ["Presión arterial", "pressure"],
  ["Frecuencia cardíaca", "heart"],
  ["Temperatura", "temp"],
  ["Medicamentos", "meds"],
  ["Alimentación", "food"],
  ["Incidentes", "incidents"],
  ["Observaciones", "notes"],
];
export function Manual() {
  const base = useOriginal();
  const { patients, reports, setReports, user } = useStore();
  const [data, setData] = useState({});
  const assignedPatients = patients.filter((p) => canAccessPatient(p, user) && p.active && p.consent?.by);
  return (
    <ManualTemplate
      bindings={{
        ...base.bindings,
        pressure: {
          pattern: "[0-9]{2,3}/[0-9]{2,3}",
          title: "Ejemplo: 120/80.",
        },
        heart: { type: "number", min: 1, step: 1, inputMode: "numeric" },
        temp: { type: "number", min: 0.1, step: 0.1, inputMode: "decimal" },
        reportForm: {
          onChange: (e) =>
            setData({ ...data, [e.target.name]: e.target.value }),
          onSubmit: (e) => {
            e.preventDefault();
            if (!validateText(e.currentTarget)) return;
            if (!assignedPatients.some((p) => p.name === e.currentTarget.elements.patient.value)) return;
            const r = {
              ...formData(e),
              id: Date.now(),
              type: "manual",
              technician: user.name,
              createdAt: formatDate(),
            };
            setReports([r, ...reports]);
            logActivity(user, "Creó reporte manual", r.patient);
            go("/pages/reporte-detalle.html?id=" + r.id);
          },
        },
      }}
      slots={{
        ...base.slots,
        livePreview:
          !data.patient && !data.pressure && !data.notes ? (
            <p className="muted">
              Completa el formulario para visualizar el reporte.
            </p>
          ) : (
            <>
              <h4>Reporte geriátrico domiciliario</h4>
              <ReviewNotice
                entries={reportReview({ ...data, type: "manual" })}
              />
              {manualFields.map(([label, name]) => (
                <p key={name}>
                  <b>{label}:</b> {data[name] || "Pendiente"}
                </p>
              ))}
            </>
          ),
        patient: (
          <>
            <option value="">Seleccionar paciente</option>
            {assignedPatients.map((p) => (
              <option key={p.name}>{p.name}</option>
            ))}
          </>
        ),
      }}
    />
  );
}
export function History() {
  const base = useOriginal();
  const { patients, reports, ask, user } = useStore();
  const assignedPatients = patients.filter((p) => canAccessPatient(p, user));
  const [filter, setFilter] = useState(
    new URLSearchParams(location.search).get("paciente") || "",
  );
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [shift, setShift] = useState("");
  const filtered = reportsForUser(reports, patients, user).filter((r) => {
    const patient = assignedPatients.find((p) => p.name === r.patient);
    const dateLabel = (r.date || r.createdAt || "").split(" ")[0].replace(/,$/, "");
    const [day, month, year] = dateLabel.split("/");
    return (!filter || r.patient === filter) &&
      (!query || searchable(`${r.patient} ${patient?.code || ""}`).includes(searchable(query))) &&
      (!date || `${year}-${month?.padStart(2, "0")}-${day?.padStart(2, "0")}` === date) &&
      (!shift || r.shift === shift);
  });
  async function reset() {
    if (user.role !== "admin") {
      await ask("Acceso de administrador", "Solo el administrador puede restablecer los datos de la demo.", false);
      return;
    }
    if (
      await ask(
        "Restablecer prototipo",
        "Se restaurarán los datos ficticios y se borrarán los cambios guardados en este navegador. ¿Continuar?",
      )
    ) {
      [
        ...Object.values(keys),
        "gerireport_seeded_v1",
        "gerireport_seeded_v2",
        USERS_KEY,
      ].forEach((k) => localStorage.removeItem(k));
      clearSession();
      location.assign("/pages/login.html");
    }
  }
  return (
    <HistoryTemplate
      bindings={{
        ...base.bindings,
        patientFilter: {
          value: filter,
          onChange: (e) => setFilter(e.target.value),
        },
      }}
      slots={{
        ...base.slots,
        pageIntro: <div className="history-extra-filters">
          <label>Nombre o código<input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar paciente" /></label>
          <label>Fecha<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <label>Turno<select value={shift} onChange={(e) => setShift(e.target.value)}><option value="">Todos</option>{[...new Set(reportsForUser(reports, patients, user).map((r) => r.shift).filter(Boolean))].map((value) => <option key={value}>{value}</option>)}</select></label>
        </div>,
        patientFilter: (
          <>
            <option value="">Todos los pacientes</option>
            {assignedPatients.map((p) => (
              <option key={p.name}>{p.name}</option>
            ))}
          </>
        ),
        reportsList: !filtered.length ? (
          <div className="generated-report history-empty">
            <h4>No hay reportes guardados aún</h4>
            <p className="muted">
              Inicia un turno o crea un reporte manual para verlo aquí.
            </p>
            <div className="report-actions history-empty-actions">
              <a className="primary-btn" href="/pages/pacientes.html">
                <i className="fas fa-play" aria-hidden="true" />
                Iniciar turno
              </a>
              <a
                className="ghost-btn history-manual-link"
                href="/pages/nuevo-reporte.html"
              >
                <i className="fas fa-pen-to-square" aria-hidden="true" />
                Reporte manual
              </a>
            </div>
          </div>
        ) : (
          [...new Set(filtered.map((r) => r.patient))].map((patient) => (
            <section className="history-group" key={patient}>
              <div className="panel-heading">
                <h3>{patient}</h3>
                <a
                  href={
                    "/pages/vista-familiar.html?paciente=" +
                    encodeURIComponent(patient)
                  }
                >
                  Vista familiar
                </a>
              </div>
              <div className="reports-list">
                {filtered
                  .filter((r) => r.patient === patient)
                  .sort((a, b) => b.id - a.id)
                  .map((r) => {
                    const s = summarizeReport(r);
                    return (
                      <div className="report-item" key={r.id}>
                        <div className="report-info">
                          <div className="report-icon">
                            <i
                              className={
                                "fas " +
                                (s.type === "turno"
                                  ? "fa-clock"
                                  : "fa-file-lines")
                              }
                            />
                          </div>
                          <div className="report-details">
                            <div className="patient-name">{s.date}</div>
                            <div className="meta">
                              <span>Técnico: {r.technician || "Sin registrar"}</span>
                              <span>
                                <i className="fas fa-calendar-day" />{" "}
                                {s.schedule}
                              </span>
                              <span>
                                <Badge status={s.status} />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="report-actions">
                          <a
                            className="btn-ver"
                            href={"/pages/reporte-detalle.html?id=" + r.id}
                          >
                            <i className="fas fa-eye" /> Ver reporte
                          </a>
                        </div>
                        <div className="report-summary">
                          <p>
                            <b>Incidentes:</b> {s.incidentCount}
                          </p>
                          <p>
                            <b>Para revisar:</b> {s.reviewCount} registros
                          </p>
                          <p>
                            <b>Medicación:</b> {s.medication}
                          </p>
                          <p>
                            <b>Alimentación:</b> {s.food}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>
          ))
        ),
      }}
      onAction={reset}
    />
  );
}
export function ReportContent({ report }) {
  const s = summarizeReport(report);
  const reportStatus =
    s.status === "Revisar"
      ? {
          className: "status-warning",
          icon: "fa-triangle-exclamation",
          label: "Requiere revisión",
        }
      : s.status === "Sin registros"
        ? {
            className: "status-neutral",
            icon: "fa-clipboard",
            label: "Sin registros",
          }
        : {
            className: "status-ok",
            icon: "fa-circle-check",
            label: "Sin observaciones",
          };
  return (
    <>
      <div className="pdf-masthead">
        <div>
          <strong>GeriReport</strong>
          <span>Registro de cuidados</span>
        </div>
        <p>
          INFORME DE ATENCIÓN
          <br />
          <span>Referencia: {report.id}</span>
        </p>
      </div>
      <div className="report-header">
        <div>
          <span className="badge">
            {report.type === "turno" ? "Reporte de turno" : "Reporte rápido"}
          </span>
          <h3>{report.patient}</h3>
          <p className="muted">
            Fecha: {s.date} ·{" "}
            {report.type === "turno"
              ? "Técnico: " + report.technician
              : "Turno: " + report.shift}
          </p>
          {report.type === "turno" && (
            <p className="muted">
              Turno: {report.startTime} - {report.endTime}
            </p>
          )}
        </div>
        <div
          className={"report-status " + reportStatus.className}
          role="status"
          aria-label={`${report.type === "turno" ? "Estado del turno" : "Estado del reporte"}: ${reportStatus.label}`}
        >
          <span className="report-status-label">
            {report.type === "turno" ? "Estado del turno" : "Estado del reporte"}
          </span>
          <strong>
            <i className={"fas " + reportStatus.icon} aria-hidden="true" />
            {reportStatus.label}
          </strong>
        </div>
      </div>
      <ReviewNotice entries={reportReview(report)} />
      {report.type === "turno" ? (
        <>
          {Object.entries(categories).map(([type, [icon, label]]) => {
            const records = report.records.filter((r) => r.type === type);
            return records.length ? (
              <div className="report-section" key={type}>
                <h4>
                  {icon} {label}
                </h4>
                {records.map((r) => (
                  <div
                    className={
                      "report-line " +
                      (recordReviewReasons(r).length ? "line-alert" : "")
                    }
                    key={r.id}
                  >
                    <span>{r.time}</span>
                    <p>
                      {type === "food" ? r.title + " · " : ""}
                      {r.detail}
                      {r.responsible && <small> · {r.responsible}</small>}
                    </p>
                  </div>
                ))}
              </div>
            ) : null;
          })}
          <div className="report-section report-section-wide report-timeline-section">
            <h4>📝 Línea temporal completa</h4>
            <div className="timeline">
              <OriginalTimeline records={report.records} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="report-section">
            <h4>🩺 Signos vitales</h4>
            <p>
              <b>Presión arterial:</b> {report.pressure || "Pendiente"}
            </p>
            <p>
              <b>Frecuencia cardíaca:</b> {report.heart || "Pendiente"}
            </p>
            <p>
              <b>Temperatura:</b> {report.temp || "Pendiente"}
            </p>
          </div>
          {[
            ["💊 Medicación", "meds"],
            ["🍽️ Alimentación", "food"],
            ["⚠️ Incidentes", "incidents"],
          ].map(([label, key]) => (
            <div className="report-section" key={key}>
              <h4>{label}</h4>
              <p>{report[key] || "Sin registrar"}</p>
            </div>
          ))}
        </>
      )}
      <div className="report-section report-section-wide">
        <h4>Observaciones generales</h4>
        <p>{report.notes || "Sin observaciones adicionales."}</p>
      </div>
      <footer className="pdf-footer">
        <strong>GeriReport · Registro de atención</strong>
        <span>
          Documento de seguimiento de cuidados. Información confidencial.
        </span>
      </footer>
    </>
  );
}
export function Detail() {
  const base = useOriginal();
  const { reports, patients, user } = useStore();
  const report = reportsForUser(reports, patients, user).find(
    (r) => String(r.id) === new URLSearchParams(location.search).get("id"),
  );
  const [downloading, setDownloading] = useState(false);
  const { ask } = useStore();
  async function download() {
    if (!report || downloading) return;
    setDownloading(true);
    try {
      const { downloadReportPdf } = await import("./reportPdf.js");
      await downloadReportPdf(report);
    } catch {
      await ask(
        "No se pudo descargar",
        "Vuelve a intentarlo. El reporte sigue guardado en el historial.",
        false,
      );
    } finally {
      setDownloading(false);
    }
  }
  return (
    <DetailTemplate
      {...base}
      bindings={{
        ...base.bindings,
        downloadReport: {
          disabled: !report || downloading,
          children: downloading ? "Preparando PDF…" : "Descargar PDF",
        },
      }}
      slots={{
        ...base.slots,
        reportSheet: report ? (
          <ReportContent report={report} />
        ) : (
          <>
            <p className="muted">
              No se encontró el reporte solicitado. Selecciona un reporte desde
              el historial para ver su detalle.
            </p>
            <a className="primary-btn" href="/pages/reportes.html">
              Ir al historial
            </a>
          </>
        ),
      }}
      onAction={download}
    />
  );
}
export function FollowUp() {
  const base = useOriginal();
  const { tasks: allTasks, setTasks, patients, user } = useStore();
  const tasks = allTasks.filter((task) => patients.some((patient) => patient.name === task.patient && canAccessPatient(patient, user)));
  const statuses = ["pending", "active", "done"];
  const labels = ["Pendiente", "En proceso", "Completado"];
  const icons = ["fa-hourglass-start", "fa-spinner", "fa-circle-check"];
  const moveTask = (task, status) => {
    setTasks(allTasks.map((entry) => entry.id === task.id ? { ...entry, status } : entry));
    logActivity(user, "Actualizó tarea", task.title);
  };
  return (
    <TasksTemplate
      {...base}
      slots={{
        ...base.slots,
        originalKanban: statuses.map((status, i) => (
          <article className="kanban-col" key={status}>
            <h3>
              <i className={"fas " + icons[i]} /> {labels[i]}{" "}
              <span className="count">
                {tasks.filter((t) => t.status === status).length}
              </span>
            </h3>
            {tasks
              .filter((t) => t.status === status)
              .map((t) => (
                <article
                  className={"task-card" + (status === "done" ? " done" : "")}
                  key={t.id}
                >
                  <strong>{t.title}</strong>
                  <p>
                    {t.patient} · {t.time}
                  </p>
                  <span
                    className={
                      "task-priority " +
                      (t.priority === "Alta" ? "priority-high" : "")
                    }
                  >
                    {t.priority === "Alta" && (
                      <i className="fas fa-circle-exclamation" />
                    )}{" "}
                    {t.priority}
                  </span>
                  <div className="task-controls">
                    {i > 0 && (
                      <button
                        className="task-control"
                        onClick={() => moveTask(t, statuses[i - 1])}
                      >
                        ← {labels[i - 1]}
                      </button>
                    )}
                    {i < 2 && (
                      <button
                        className="task-control"
                        onClick={() => moveTask(t, statuses[i + 1])}
                      >
                        Pasar a {labels[i + 1]} →
                      </button>
                    )}
                  </div>
                </article>
              ))}
          </article>
        )),
      }}
    />
  );
}
export function Family() {
  const base = useOriginal();
  const { patients, reports, user } = useStore();
  const assignedPatients = patients.filter((p) => canAccessPatient(p, user));
  const requestedPatient = new URLSearchParams(location.search).get("paciente");
  const [name, setName] = useState(
    requestedPatient ? assignedPatients.find(patient => patient.name === requestedPatient)?.name || '' : assignedPatients[0]?.name || '',
  );
  const patient = assignedPatients.find((p) => p.name === name);
  const report = reportsForUser(reports, patients, user)
    .filter((r) => r.patient === name)
    .sort((a, b) => b.id - a.id)[0];
  const s = report ? summarizeReport(report) : null;
  const state =
    s?.status === "Revisar"
      ? "Requiere revisión"
      : s?.status === "Estable"
        ? "Sin observaciones"
        : s?.status || "Sin reportes";
  return (
    <FamilyTemplate
      bindings={{
        ...base.bindings,
        familyPatientSelect: {
          value: name,
          onChange: (e) => setName(e.target.value),
        },
      }}
      slots={{
        ...base.slots,
        familyPatientSelect: <><option value="" disabled>Seleccionar paciente</option>{assignedPatients.map((p) => (
          <option key={p.name}>{p.name}</option>
        ))}</>,
        familyCard: patient ? (
          <div className="family-card">
            <div className="patient-header">
              <div className="avatar">
                {name
                  .split(" ")
                  .slice(0, 2)
                  .map((p) => p[0])
                  .join("")}
              </div>
              <div className="info">
                <h3>{name}</h3>
                <div className="sub">
                  <span>
                    {patient?.age} años · {patient?.condition}
                  </span>
                  {s && (
                    <span className={"badge-estado " + statusClass(s.status)}>
                      {state}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {!s ? (
              <p className="muted">
                Aún no hay reportes registrados para este paciente.
              </p>
            ) : (
              <>
                <div className="info-grid">
                  {[
                    [
                      "fa-triangle-exclamation",
                      "Registros para revisar",
                      s.reviewCount,
                    ],
                    ["fa-calendar-check", "Último reporte", s.date],
                    ["fa-clock", "Turno", s.schedule],
                    ["fa-heart-pulse", "Signos vitales", s.vitalsCount],
                  ].map(([icon, label, value]) => (
                    <div className="item" key={label}>
                      <div className="label">
                        <i className={"fas " + icon} /> {label}
                      </div>
                      <div className="value">{value}</div>
                    </div>
                  ))}
                </div>
                <ReviewNotice entries={reportReview(report)} />
                <div className="vitales-section">
                  <h4>
                    <i className="fas fa-clipboard-check" /> Resumen del último
                    turno
                  </h4>
                  <div className="vitales-grid">
                    {[
                      ["Alimentación", s.food],
                      ["Medicación", s.medication],
                      ["Higiene", s.hygiene],
                      ["Bienestar", s.wellbeing],
                    ].map(([label, value]) => (
                      <div className="vital-item" key={label}>
                        <div className="vital-label">{label}</div>
                        <div className="vital-value">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="ultimo-reporte">
                  <h4>
                    <i className="fas fa-file-lines" /> Último reporte
                  </h4>
                  <div className="reporte-preview">
                    <span>
                      <span className="fecha">{s.date}</span> · {s.schedule}
                    </span>
                    <span>
                      Estado:{" "}
                      <span className={"badge-status " + statusClass(s.status)}>
                        {state}
                      </span>
                    </span>
                    <a
                      className="btn-ver family-report-link"
                      href={"/pages/reporte-detalle.html?id=" + report.id}
                    >
                      <i className="fas fa-file-lines" aria-hidden="true" />
                      <span>Ver reporte</span>
                      <i className="fas fa-arrow-right" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="section-empty">
            <h3>{assignedPatients.length ? 'Selecciona un paciente' : 'No hay pacientes disponibles'}</h3>
            <p>{assignedPatients.length ? 'El paciente del enlace no está disponible. Elige uno en el selector.' : 'Registra un paciente para consultar su resumen familiar.'}</p>
            {!assignedPatients.length && <a className="primary-btn" href="/pages/pacientes.html">
              Ir a pacientes
            </a>}
          </div>
        ),
      }}
    />
  );
}
