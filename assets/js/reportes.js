const reportForm = document.getElementById("reportForm");
const preview = document.getElementById("livePreview");

const patientSelect = document.getElementById("patient");
if (patientSelect && typeof getPatients === "function") {
  getPatients().forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.name;
    opt.textContent = p.name;
    patientSelect.appendChild(opt);
  });
}

const fields = ["patient", "shift", "pressure", "heart", "temp", "meds", "food", "incidents", "notes"];

function getReportData() {
  const data = {};
  fields.forEach((id) => {
    data[id] = document.getElementById(id)?.value || "";
  });
  return data;
}

function renderPreview() {
  const data = getReportData();

  if (!data.patient && !data.pressure && !data.notes) {
    preview.innerHTML = `<p class="muted">Completa el formulario para visualizar el reporte.</p>`;
    return;
  }

  preview.innerHTML = `
    <h4>Reporte geriátrico domiciliario</h4>
    <p><b>Paciente:</b> ${data.patient || "Pendiente"}</p>
    <p><b>Turno:</b> ${data.shift || "Pendiente"}</p>
    <p><b>Presión arterial:</b> ${data.pressure || "Pendiente"}</p>
    <p><b>Frecuencia cardiaca:</b> ${data.heart || "Pendiente"}</p>
    <p><b>Temperatura:</b> ${data.temp || "Pendiente"}</p>
    <p><b>Medicamentos:</b> ${data.meds || "Pendiente"}</p>
    <p><b>Alimentación:</b> ${data.food || "Pendiente"}</p>
    <p><b>Incidentes:</b> ${data.incidents || "Sin registrar"}</p>
    <p><b>Observaciones:</b> ${data.notes || "Pendiente"}</p>
  `;
}

fields.forEach((id) => {
  const element = document.getElementById(id);
  if (element) element.addEventListener("input", renderPreview);
});

if (reportForm) {
  reportForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      id: Date.now(),
      type: "manual",
      createdAt: formatDate(),
      ...getReportData()
    };

    const reports = getReports();
    reports.unshift(data);
    saveReports(reports);

    await showAppDialog({ title: "Reporte guardado", message: "El reporte ficticio ya está disponible en el historial." });
    window.location.href = `reporte-detalle.html?id=${data.id}`;
  });
}
