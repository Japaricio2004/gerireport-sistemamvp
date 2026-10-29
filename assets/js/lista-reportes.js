/* ============================================================
   GeriReport - lista-reportes.js
   Historial de reportes agrupado por paciente (trazabilidad).
   ============================================================ */

const reportsList = document.getElementById("reportsList");
const patientFilter = document.getElementById("patientFilter");

function populateFilter() {
  if (!patientFilter) return;
  const patients = getPatients();
  const params = new URLSearchParams(window.location.search);
  const preselected = params.get("paciente") || "";

  patientFilter.innerHTML =
    `<option value="">Todos los pacientes</option>` +
    patients.map((p) => `<option value="${p.name}">${p.name}</option>`).join("");

  if (preselected) patientFilter.value = preselected;

  patientFilter.addEventListener("change", renderReports);
}

function statusBadge(summary) {
  return summary.status === "Revisar"
    ? `<span class="badge-status badge-danger"><i class="fas fa-triangle-exclamation"></i> Revisar</span>`
    : `<span class="badge-status badge-success"><i class="fas fa-circle-check"></i> Estable</span>`;
}

function renderReports() {
  if (!reportsList) return;
  const reports = getReports();
  const filterValue = patientFilter ? patientFilter.value : "";
  const filtered = filterValue ? reports.filter((r) => r.patient === filterValue) : reports;

  if (!filtered.length) {
    reportsList.innerHTML = `
      <div class="generated-report">
        <h4>No hay reportes guardados aún</h4>
        <p class="muted">Inicia un turno o crea un reporte manual para verlo aquí.</p>
        <div class="report-actions">
          <a class="primary-btn" href="pacientes.html">Iniciar turno</a>
          <a class="ghost-btn" href="nuevo-reporte.html">Reporte manual</a>
        </div>
      </div>
    `;
    return;
  }

  // Agrupar por paciente para mostrar trazabilidad
  const grouped = {};
  filtered.forEach((r) => {
    if (!grouped[r.patient]) grouped[r.patient] = [];
    grouped[r.patient].push(r);
  });

  reportsList.innerHTML = Object.keys(grouped).map((patient) => {
    const items = grouped[patient].sort((a, b) => b.id - a.id);
    return `
      <section class="history-group">
        <div class="panel-heading">
          <h3>${patient}</h3>
          <a href="vista-familiar.html?paciente=${encodeURIComponent(patient)}">Vista familiar</a>
        </div>
        <div class="reports-list">
          ${items.map((r) => {
            const summary = summarizeReport(r);
            return `
              <div class="report-item">
                <div class="report-info">
                  <div class="report-icon"><i class="fas ${summary.type === "turno" ? "fa-clock" : "fa-file-lines"}"></i></div>
                  <div class="report-details">
                    <div class="patient-name">${summary.date}</div>
                    <div class="meta">
                      <span><i class="fas fa-calendar-day"></i> ${summary.schedule}</span>
                      <span>${statusBadge(summary)}</span>
                    </div>
                  </div>
                </div>
                <div class="report-actions">
                  <a class="btn-ver" href="reporte-detalle.html?id=${encodeURIComponent(r.id)}" aria-label="Ver reporte de ${patient} del ${summary.date}"><i class="fas fa-eye"></i> Ver reporte</a>
                </div>
                <div class="report-summary">
                  <p><b>Incidentes:</b> ${summary.incidentCount}</p>
                  <p><b>Medicacion:</b> ${summary.medication}</p>
                  <p><b>Alimentacion:</b> ${summary.food}</p>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }).join("");
}

function clearReports() {
  if (confirm("¿Deseas limpiar todos los reportes guardados en esta demo?")) {
    localStorage.removeItem("gerireport_reports");
    renderReports();
  }
}

populateFilter();
renderReports();
