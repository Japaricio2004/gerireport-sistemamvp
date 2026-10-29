/* ============================================================
   GeriReport - turno.js
   Lógica del "Modo Turno": registro de información, línea
   temporal, alertas de valores fuera de rango, finalización
   del turno y generación del reporte.
   ============================================================ */

let turno = getActiveTurno();

const noTurnoState = document.getElementById("noTurnoState");
const turnoActiveState = document.getElementById("turnoActiveState");

function init() {
  turno = getActiveTurno();

  if (!turno) {
    if (noTurnoState) noTurnoState.style.display = "block";
    if (turnoActiveState) turnoActiveState.style.display = "none";
    return;
  }

  document.getElementById("turnoPatientName").textContent = turno.patient;
  document.getElementById("turnoScheduleLabel").textContent =
    `${turno.dateLabel} · Inicio ${turno.startLabel} · Técnico: ${turno.technician}`;

  // Prellenar horas por defecto en los formularios con hora actual
  const nowTime = formatTime();
  const medTime = document.getElementById("m_time");
  const incTime = document.getElementById("i_time");
  if (medTime) medTime.value = nowTime;
  if (incTime) incTime.value = nowTime;

  renderTimeline();
}

function openModal(id) {
  document.getElementById(id).classList.add("active");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
  const form = document.querySelector(`#${id} form`);
  if (form) form.reset();
  const medTime = document.getElementById("m_time");
  const incTime = document.getElementById("i_time");
  if (medTime) medTime.value = formatTime();
  if (incTime) incTime.value = formatTime();
}

function addRecord(record) {
  turno.records.push({
    id: Date.now() + Math.random(),
    time: formatTime(),
    ...record
  });
  saveActiveTurno(turno);
  renderTimeline();
}

function showAlert(message) {
  const banner = document.getElementById("alertBanner");
  if (!banner) return;
  banner.style.display = "block";
  banner.innerHTML = `
    <strong>⚠️ Valor fuera del rango configurado</strong>
    <p>${message}</p>
    <p>Verifique el registro y comuníquese con el responsable correspondiente.</p>
  `;
}

function hideAlertBannerSoon() {
  // La franja de alerta permanece visible; se puede cerrar manualmente
  // creando un botón si se desea. Se mantiene simple para el MVP.
}

/* -------------------- Formularios de registro -------------------- */

document.getElementById("vitalsForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const pressure = document.getElementById("v_pressure").value;
  const heart = document.getElementById("v_heart").value;
  const temp = document.getElementById("v_temp").value;
  const spo2 = document.getElementById("v_spo2").value;

  const { alert: isAlert, issues } = checkVitalAlerts({ pressure, heart, temp, spo2 });

  addRecord({
    type: "vitals",
    icon: "🩺",
    title: "Signos vitales",
    detail: `Presión: ${pressure} · FC: ${heart} lpm · Temp: ${temp} °C · SpO₂: ${spo2}%`,
    alert: isAlert,
    data: { pressure, heart, temp, spo2 }
  });

  if (isAlert) {
    showAlert(issues.join(" · "));
  }

  closeModal("vitalsModal");
});

document.getElementById("medsForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("m_name").value;
  const dose = document.getElementById("m_dose").value;
  const time = document.getElementById("m_time").value || formatTime();
  const status = document.getElementById("m_status").value;

  addRecord({
    type: "medication",
    icon: "💊",
    title: "Medicación",
    detail: `${name} · ${dose} · ${status}`,
    alert: status === "No administrado",
    data: { name, dose, time, status }
  });

  if (status === "No administrado") {
    showAlert(`${name} no fue administrado. Verifique con el responsable.`);
  }

  closeModal("medsModal");
});

document.getElementById("foodForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const meal = document.getElementById("f_meal").value;
  const amount = document.getElementById("f_amount").value;
  const note = document.getElementById("f_note").value;

  addRecord({
    type: "food",
    icon: "🍽️",
    title: meal,
    detail: `Consumo: ${amount}%${note ? " · " + note : ""}`,
    alert: Number(amount) === 0,
    data: { meal, amount, note }
  });

  closeModal("foodModal");
});

document.getElementById("sleepForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const hours = document.getElementById("s_hours").value;
  const quality = document.getElementById("s_quality").value;

  addRecord({
    type: "sleep",
    icon: "🛏️",
    title: "Sueño",
    detail: `${hours} horas · Calidad: ${quality}`,
    alert: false,
    data: { hours, quality }
  });

  closeModal("sleepModal");
});

document.getElementById("hygieneForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const checked = Array.from(
    document.querySelectorAll("#hygieneForm input[type='checkbox']:checked")
  ).map((c) => c.value);

  if (checked.length === 0) {
    await showAppDialog({ title: "Completa el registro", message: "Selecciona al menos una actividad de higiene." });
    return;
  }

  addRecord({
    type: "hygiene",
    icon: "🧼",
    title: "Higiene",
    detail: checked.join(", "),
    alert: false,
    data: { activities: checked }
  });

  document.querySelectorAll("#hygieneForm input[type='checkbox']").forEach((c) => (c.checked = false));
  closeModal("hygieneModal");
});

function recordWellbeing(state) {
  addRecord({
    type: "wellbeing",
    icon: "🙂",
    title: "Bienestar",
    detail: state,
    alert: false,
    data: { state }
  });
  closeModal("wellbeingModal");
}

async function recordWellbeingOther() {
  const custom = await showAppDialog({ title: "Registrar bienestar", message: "Describe brevemente el estado observado.", kind: "prompt", confirmLabel: "Guardar", placeholder: "Ej. Se muestra tranquilo" });
  if (custom && custom.trim()) {
    recordWellbeing(custom.trim());
  }
}

document.getElementById("incidentForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const type = document.getElementById("i_type").value;
  const description = document.getElementById("i_description").value;
  const time = document.getElementById("i_time").value || formatTime();

  addRecord({
    type: "incident",
    icon: "⚠️",
    title: `Incidente: ${type}`,
    detail: description,
    alert: true,
    data: { incidentType: type, description, time }
  });

  showAlert(`Incidente registrado (${type}). Verifique el registro y comuníquese con el responsable correspondiente.`);

  closeModal("incidentModal");
});

/* -------------------------- Línea temporal ------------------------- */

function renderTimeline() {
  const container = document.getElementById("timeline");
  const countLabel = document.getElementById("recordCount");
  if (!container) return;

  const records = [...turno.records].sort((a, b) => a.id - b.id);
  countLabel.textContent = `${records.length} registro${records.length === 1 ? "" : "s"}`;

  if (records.length === 0) {
    container.innerHTML = `<p class="muted">Aún no hay registros en este turno.</p>`;
    return;
  }

  container.innerHTML = records.map((r) => `
    <div class="timeline-item ${r.alert ? "timeline-alert" : ""}">
      <div class="timeline-time">${r.time}</div>
      <div class="timeline-body">
        <div class="timeline-title">${r.icon} ${r.title} ${r.alert ? '<span class="tag-alert">Atención</span>' : ""}</div>
        <p>${r.detail}</p>
      </div>
    </div>
  `).join("");
}

/* --------------------------- Finalizar turno ------------------------- */

document.getElementById("finalizarTurnoBtn")?.addEventListener("click", async () => {
  if (turno.records.length === 0) {
    const confirmed = await showAppDialog({ title: "Finalizar turno sin registros", message: "Aún no has registrado información en este turno. ¿Deseas finalizarlo de todas formas?", kind: "confirm", confirmLabel: "Finalizar turno" });
    if (!confirmed) {
      return;
    }
  }

  const counts = {
    vitals: 0, medication: 0, food: 0, sleep: 0, hygiene: 0, wellbeing: 0, incident: 0
  };
  turno.records.forEach((r) => { if (counts[r.type] !== undefined) counts[r.type]++; });

  const hasAlert = turno.records.some((r) => r.alert);

  document.getElementById("summaryContent").innerHTML = `
    <h4>${turno.patient}</h4>
    <p><b>Inicio:</b> ${turno.startLabel} &nbsp; <b>Fin:</b> ${formatTime()}</p>
    <p><b>🩺 Signos vitales:</b> ${counts.vitals} registro(s)</p>
    <p><b>💊 Medicación:</b> ${counts.medication} registro(s)</p>
    <p><b>🍽️ Alimentación:</b> ${counts.food} registro(s)</p>
    <p><b>🛏️ Sueño:</b> ${counts.sleep} registro(s)</p>
    <p><b>🧼 Higiene:</b> ${counts.hygiene} registro(s)</p>
    <p><b>🙂 Bienestar:</b> ${counts.wellbeing} registro(s)</p>
    <p><b>⚠️ Incidentes:</b> ${counts.incident} registro(s)</p>
    <p><b>Estado general:</b> ${hasAlert ? "Revisar ⚠️" : "Estable 🟢"}</p>
  `;

  openModal("summaryModal");
});

function generateReport() {
  const notes = document.getElementById("summaryNotes").value;
  const endLabel = formatTime();

  const hasAlert = turno.records.some((r) => r.alert);
  const incidentCount = turno.records.filter((r) => r.type === "incident").length;

  const report = {
    id: Date.now(),
    type: "turno",
    createdAt: formatDate(),
    patient: turno.patient,
    technician: turno.technician,
    date: turno.dateLabel,
    shift: "Turno completo",
    startTime: turno.startLabel,
    endTime: endLabel,
    records: turno.records,
    notes: notes || "",
    status: hasAlert ? "Revisar" : "Estable",
    incidentCount
  };

  const reports = getReports();
  reports.unshift(report);
  saveReports(reports);

  clearActiveTurno();
  window.location.href = `reporte-detalle.html?id=${report.id}`;
}

init();
