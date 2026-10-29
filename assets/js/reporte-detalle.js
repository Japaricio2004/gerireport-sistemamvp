/* ============================================================
   GeriReport - reporte-detalle.js
   Renderiza el detalle completo de un reporte (turno o manual)
   listo para visualizar e imprimir / guardar como PDF.
   ============================================================ */

function renderRecordsSection(icon, title, records, formatter) {
  if (!records.length) return "";
  return `
    <div class="report-section">
      <h4>${icon} ${title}</h4>
      ${records.map(formatter).join("")}
    </div>
  `;
}

function renderTurnoReport(report) {
  const vitals = recordsByType(report, "vitals");
  const meds = recordsByType(report, "medication");
  const food = recordsByType(report, "food");
  const sleep = recordsByType(report, "sleep");
  const hygiene = recordsByType(report, "hygiene");
  const wellbeing = recordsByType(report, "wellbeing");
  const incidents = recordsByType(report, "incident");

  return `
    <div class="report-header">
      <div>
        <span class="badge">Reporte de turno</span>
        <h3>${report.patient}</h3>
        <p class="muted">Fecha: ${report.date} &nbsp;·&nbsp; Técnico: ${report.technician}</p>
        <p class="muted">Turno: ${report.startTime} - ${report.endTime}</p>
      </div>
      <div class="report-status ${report.status === "Revisar" ? "status-warning" : "status-ok"}">
        ${report.status === "Revisar" ? "⚠️ Revisar" : "🟢 Estable"}
      </div>
    </div>

    ${renderRecordsSection("🩺", "Signos vitales", vitals, (r) => `
      <div class="report-line ${r.alert ? "line-alert" : ""}">
        <span>${r.time}</span>
        <p>${r.detail}</p>
      </div>
    `)}

    ${renderRecordsSection("💊", "Medicación", meds, (r) => `
      <div class="report-line ${r.alert ? "line-alert" : ""}">
        <span>${r.time}</span>
        <p>${r.detail}</p>
      </div>
    `)}

    ${renderRecordsSection("🍽️", "Alimentación", food, (r) => `
      <div class="report-line ${r.alert ? "line-alert" : ""}">
        <span>${r.time}</span>
        <p>${r.title} · ${r.detail}</p>
      </div>
    `)}

    ${renderRecordsSection("🛏️", "Sueño", sleep, (r) => `
      <div class="report-line">
        <span>${r.time}</span>
        <p>${r.detail}</p>
      </div>
    `)}

    ${renderRecordsSection("🧼", "Higiene", hygiene, (r) => `
      <div class="report-line">
        <span>${r.time}</span>
        <p>${r.detail}</p>
      </div>
    `)}

    ${renderRecordsSection("🙂", "Bienestar", wellbeing, (r) => `
      <div class="report-line">
        <span>${r.time}</span>
        <p>${r.detail}</p>
      </div>
    `)}

    ${renderRecordsSection("⚠️", "Incidentes", incidents, (r) => `
      <div class="report-line line-alert">
        <span>${r.time}</span>
        <p><b>${r.title.replace("Incidente: ", "")}:</b> ${r.detail}</p>
      </div>
    `)}

    <div class="report-section report-section-wide">
      <h4>📝 Línea temporal completa</h4>
      <div class="timeline">
        ${[...report.records].sort((a, b) => a.id - b.id).map((r) => `
          <div class="timeline-item ${r.alert ? "timeline-alert" : ""}">
            <div class="timeline-time">${r.time}</div>
            <div class="timeline-body">
              <div class="timeline-title">${r.icon} ${r.title}</div>
              <p>${r.detail}</p>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="report-section report-section-wide">
      <h4>Observaciones generales</h4>
      <p>${report.notes && report.notes.trim() ? report.notes : "Sin observaciones adicionales."}</p>
    </div>
  `;
}

function renderManualReport(report) {
  return `
    <div class="report-header">
      <div>
        <span class="badge">Reporte rápido</span>
        <h3>${report.patient}</h3>
        <p class="muted">Fecha: ${report.createdAt} &nbsp;·&nbsp; Turno: ${report.shift}</p>
      </div>
      <div class="report-status ${report.incidents && report.incidents.trim() ? "status-warning" : "status-ok"}">
        ${report.incidents && report.incidents.trim() ? "⚠️ Revisar" : "🟢 Estable"}
      </div>
    </div>

    <div class="report-section">
      <h4>🩺 Signos vitales</h4>
      <p><b>Presión arterial:</b> ${report.pressure || "Pendiente"}</p>
      <p><b>Frecuencia cardíaca:</b> ${report.heart || "Pendiente"}</p>
      <p><b>Temperatura:</b> ${report.temp || "Pendiente"}</p>
    </div>

    <div class="report-section">
      <h4>💊 Medicación</h4>
      <p>${report.meds || "Sin registrar"}</p>
    </div>

    <div class="report-section">
      <h4>🍽️ Alimentación</h4>
      <p>${report.food || "Sin registrar"}</p>
    </div>

    <div class="report-section">
      <h4>⚠️ Incidentes</h4>
      <p>${report.incidents && report.incidents.trim() ? report.incidents : "Sin incidentes registrados."}</p>
    </div>

    <div class="report-section report-section-wide">
      <h4>Observaciones generales</h4>
      <p>${report.notes || "Sin observaciones adicionales."}</p>
    </div>
  `;
}

function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const sheet = document.getElementById("reportSheet");

  if (!sheet) return;

  if (!id) {
    sheet.innerHTML = `
      <p class="muted">Selecciona un reporte desde el historial para ver su detalle.</p>
      <a class="primary-btn" href="reportes.html"><i class="fas fa-arrow-left"></i> Ir al historial</a>
    `;
    return;
  }

  const report = getReportById(id);

  if (!report) {
    sheet.innerHTML = `
      <p class="muted">No se encontró el reporte solicitado.</p>
      <a class="primary-btn" href="reportes.html">Volver al historial</a>
    `;
    return;
  }

  document.title = `GeriReport | Reporte de ${report.patient}`;

  sheet.innerHTML = isTurnoReport(report) ? renderTurnoReport(report) : renderManualReport(report);
}

init();
