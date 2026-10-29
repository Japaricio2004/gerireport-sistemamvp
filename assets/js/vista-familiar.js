/* ============================================================
   GeriReport - vista-familiar.js
   Vista simplificada, pensada para familiares: sin datos
   técnicos ni jerga clínica innecesaria.
   ============================================================ */

const familySelect = document.getElementById("familyPatientSelect");
const familyCard = document.getElementById("familyCard");

function populateFamilySelect() {
  const patients = getPatients();
  const params = new URLSearchParams(window.location.search);
  const preselected = params.get("paciente") || (patients[0] && patients[0].name) || "";

  familySelect.innerHTML = patients.map((p) => `<option value="${p.name}">${p.name}</option>`).join("");
  if (preselected) familySelect.value = preselected;

  familySelect.addEventListener("change", renderFamilyCard);
}

function latestReportFor(patientName) {
  const reports = getReports().filter((r) => r.patient === patientName);
  if (!reports.length) return null;
  return reports.sort((a, b) => b.id - a.id)[0];
}

function renderFamilyCard() {
  const patientName = familySelect.value;
  const report = latestReportFor(patientName);
  const patient = getPatients().find((item) => item.name === patientName);
  const initials = patientName.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  if (!report) {
    familyCard.innerHTML = `
      <div class="family-card">
        <div class="patient-header">
          <div class="avatar">${initials}</div>
          <div class="info">
            <h3>${patientName}</h3>
            <div class="sub"><span>${patient ? `${patient.age} años · ${patient.condition}` : "Paciente registrado"}</span></div>
          </div>
        </div>
        <p class="muted">Aún no hay reportes registrados para este paciente.</p>
      </div>
    `;
    return;
  }

  const s = summarizeReport(report);
  const statusClass = s.status === "Revisar" ? "alerta" : "estable";
  const reportStatus = s.status === "Revisar" ? "Alerta" : "Estable";

  familyCard.innerHTML = `
    <div class="family-card">
      <div class="patient-header">
        <div class="avatar">${initials}</div>
        <div class="info">
          <h3>${patientName}</h3>
          <div class="sub">
            <span>${patient ? `${patient.age} años · ${patient.condition}` : "Paciente registrado"}</span>
            <span class="badge-estado ${statusClass}">${reportStatus}</span>
          </div>
        </div>
      </div>

      <div class="info-grid">
        <div class="item">
          <div class="label"><i class="fas fa-triangle-exclamation"></i> Alertas activas</div>
          <div class="value">${s.incidentCount} ${s.incidentCount ? '<span class="alert-indicator"><i class="fas fa-circle-exclamation"></i></span>' : ""}</div>
        </div>
        <div class="item">
          <div class="label"><i class="fas fa-calendar-check"></i> Último reporte</div>
          <div class="value">${s.date}</div>
        </div>
        <div class="item">
          <div class="label"><i class="fas fa-clock"></i> Turno</div>
          <div class="value">${s.schedule}</div>
        </div>
        <div class="item">
          <div class="label"><i class="fas fa-heart-pulse"></i> Signos vitales</div>
          <div class="value">${s.vitalsCount}</div>
        </div>
      </div>

      <div class="vitales-section">
        <h4><i class="fas fa-clipboard-check"></i> Resumen del último turno</h4>
        <div class="vitales-grid">
          <div class="vital-item"><div class="vital-label">Alimentación</div><div class="vital-value">${s.food}</div></div>
          <div class="vital-item"><div class="vital-label">Medicación</div><div class="vital-value">${s.medication}</div></div>
          <div class="vital-item"><div class="vital-label">Higiene</div><div class="vital-value">${s.hygiene}</div></div>
          <div class="vital-item"><div class="vital-label">Bienestar</div><div class="vital-value">${s.wellbeing}</div></div>
        </div>
      </div>

      <div class="ultimo-reporte">
        <h4><i class="fas fa-file-lines"></i> Último reporte</h4>
        <div class="reporte-preview">
          <span><span class="fecha">${s.date}</span> · ${s.schedule}</span>
          <span>Estado: <span class="badge-status ${statusClass}">${reportStatus}</span></span>
          <a class="btn-ver" href="reporte-detalle.html?id=${report.id}"><i class="fas fa-eye"></i> Ver reporte</a>
        </div>
      </div>
    </div>
  `;
}

populateFamilySelect();
renderFamilyCard();
