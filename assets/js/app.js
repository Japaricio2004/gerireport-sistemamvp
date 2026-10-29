/* ============================================================
   GeriReport - app.js
   Utilidades compartidas por todas las páginas:
   - Menú lateral (responsive)
   - Manejo de reportes en localStorage
   - Manejo del turno activo en localStorage
   - Tarjeta de "turno actual" en el sidebar
   - Utilidades de fecha / hora
   - Rangos de alerta para signos vitales
   ============================================================ */

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

function showAppDialog({ title = "GeriReport", message = "", kind = "alert", confirmLabel = "Entendido", cancelLabel = "Cancelar", placeholder = "" } = {}) {
  return new Promise((resolve) => {
    const previousFocus = document.activeElement;
    const overlay = document.createElement("div");
    overlay.className = "app-dialog-backdrop";
    overlay.innerHTML = `
      <section class="app-dialog" role="${kind === "alert" ? "alertdialog" : "dialog"}" aria-modal="true" aria-labelledby="appDialogTitle" aria-describedby="appDialogMessage">
        <span class="app-dialog-icon" aria-hidden="true"><i class="fas ${kind === "confirm" ? "fa-circle-question" : kind === "prompt" ? "fa-pen-to-square" : "fa-circle-info"}"></i></span>
        <h2 id="appDialogTitle"></h2>
        <p id="appDialogMessage"></p>
        ${kind === "prompt" ? `<input class="app-dialog-input" type="text" placeholder="">` : ""}
        <div class="app-dialog-actions">
          ${kind === "alert" ? "" : `<button class="app-dialog-button secondary" type="button" data-dialog-cancel>${cancelLabel}</button>`}
          <button class="app-dialog-button primary" type="button" data-dialog-confirm>${confirmLabel}</button>
        </div>
      </section>`;
    overlay.querySelector("#appDialogTitle").textContent = title;
    overlay.querySelector("#appDialogMessage").textContent = message;
    const input = overlay.querySelector(".app-dialog-input");
    if (input) input.placeholder = placeholder;
    document.body.append(overlay);

    const finish = (value) => {
      document.removeEventListener("keydown", onKeydown);
      overlay.remove();
      if (previousFocus && previousFocus.isConnected) previousFocus.focus();
      resolve(value);
    };
    const confirm = () => finish(kind === "prompt" ? input.value : true);
    const onKeydown = (event) => {
      if (event.key === "Escape") finish(kind === "alert" ? true : kind === "prompt" ? null : false);
      if (event.key === "Enter" && (event.target === input || event.target === overlay.querySelector("[data-dialog-confirm]"))) confirm();
    };
    overlay.querySelector("[data-dialog-confirm]").addEventListener("click", confirm);
    overlay.querySelector("[data-dialog-cancel]")?.addEventListener("click", () => finish(kind === "prompt" ? null : false));
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) finish(kind === "alert" ? true : kind === "prompt" ? null : false);
    });
    document.addEventListener("keydown", onKeydown);
    (input || overlay.querySelector("[data-dialog-confirm]")).focus();
  });
}

if (menuBtn && sidebar) {
  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}

/* ------------------------- Reportes ------------------------- */

const REPORTS_KEY = "gerireport_reports";

function getReports() {
  return JSON.parse(localStorage.getItem(REPORTS_KEY) || "[]");
}

function saveReports(reports) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

/* ---------------------- Turno activo -------------------------- */

const ACTIVE_TURNO_KEY = "gerireport_active_turno";

function getActiveTurno() {
  return JSON.parse(localStorage.getItem(ACTIVE_TURNO_KEY) || "null");
}

function saveActiveTurno(turno) {
  localStorage.setItem(ACTIVE_TURNO_KEY, JSON.stringify(turno));
}

function clearActiveTurno() {
  localStorage.removeItem(ACTIVE_TURNO_KEY);
}

/* --------------------------- Fechas ---------------------------- */

function formatDate(date = new Date()) {
  return date.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDateOnly(date = new Date()) {
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function formatTime(date = new Date()) {
  return date.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

/* ---------------- Rangos de alerta (signos vitales) ------------- */
/* Uso exclusivamente demostrativo: NO constituye un diagnóstico. */

const VITAL_RANGES = {
  systolic: { min: 90, max: 140 },
  diastolic: { min: 60, max: 90 },
  heart: { min: 60, max: 100 },
  temp: { min: 36, max: 37.5 },
  spo2: { min: 95, max: 100 }
};

function checkVitalAlerts({ pressure, heart, temp, spo2 }) {
  const issues = [];

  if (pressure) {
    const parts = String(pressure).split("/").map((n) => parseFloat(n));
    const [systolic, diastolic] = parts;
    if (!isNaN(systolic) && (systolic < VITAL_RANGES.systolic.min || systolic > VITAL_RANGES.systolic.max)) {
      issues.push(`Presión sistólica fuera de rango (${systolic} mmHg)`);
    }
    if (!isNaN(diastolic) && (diastolic < VITAL_RANGES.diastolic.min || diastolic > VITAL_RANGES.diastolic.max)) {
      issues.push(`Presión diastólica fuera de rango (${diastolic} mmHg)`);
    }
  }

  if (heart) {
    const hr = parseFloat(heart);
    if (!isNaN(hr) && (hr < VITAL_RANGES.heart.min || hr > VITAL_RANGES.heart.max)) {
      issues.push(`Frecuencia cardíaca fuera de rango (${hr} lpm)`);
    }
  }

  if (temp) {
    const t = parseFloat(temp);
    if (!isNaN(t) && (t < VITAL_RANGES.temp.min || t > VITAL_RANGES.temp.max)) {
      issues.push(`Temperatura fuera de rango (${t} °C)`);
    }
  }

  if (spo2) {
    const s = parseFloat(spo2);
    if (!isNaN(s) && s < VITAL_RANGES.spo2.min) {
      issues.push(`Saturación de oxígeno baja (${s}%)`);
    }
  }

  return { alert: issues.length > 0, issues };
}

/* ------------- Tarjeta de turno activo (sidebar) ---------------- */

function renderSidebarTurno() {
  const card = document.getElementById("sidebarTurnoCard");
  if (!card) return;

  const turno = getActiveTurno();

  if (!turno) {
    card.innerHTML = `
      <p>Turno</p>
      <strong>Sin turno activo</strong>
      <span>Selecciona un paciente para iniciar</span>
      <a class="ghost-btn small full sidebar-cta" href="${sidebarPathTo("pages/pacientes.html")}">Ir a pacientes</a>
    `;
    return;
  }

  card.innerHTML = `
    <p>Turno activo</p>
    <strong>${turno.patient}</strong>
    <span>Inicio: ${turno.startLabel}</span>
    <a class="primary-btn small full sidebar-cta" href="${sidebarPathTo("pages/turno.html")}">Continuar turno</a>
  `;
}

/* Detecta si estamos dentro de /pages/ para armar rutas relativas correctas */
function sidebarPathTo(path) {
  const inPages = window.location.pathname.includes("/pages/");
  if (path.startsWith("pages/")) {
    return inPages ? path.replace("pages/", "") : path;
  }
  return inPages ? `../${path}` : path;
}

document.addEventListener("DOMContentLoaded", renderSidebarTurno);
