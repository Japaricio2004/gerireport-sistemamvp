/* ============================================================
   GeriReport - pacientes.js
   Listado / registro de pacientes + inicio de turno.
   ============================================================ */

const defaultPatients = [
  {
    name: "María López",
    age: 82,
    condition: "Control de medicación y movilidad reducida",
    family: "Lucía López"
  },
  {
    name: "Jorge Gálvez",
    age: 77,
    condition: "Hipertensión y control de presión arterial",
    family: "Carlos Gálvez"
  },
  {
    name: "Elena Campos",
    age: 89,
    condition: "Seguimiento diario, hidratación y alimentación",
    family: "Rosa Campos"
  }
];

function getPatients() {
  const stored = JSON.parse(localStorage.getItem("gerireport_patients") || "null");
  if (!stored) {
    localStorage.setItem("gerireport_patients", JSON.stringify(defaultPatients));
    return defaultPatients;
  }
  return stored;
}

function savePatients(patients) {
  localStorage.setItem("gerireport_patients", JSON.stringify(patients));
}

function renderPatients() {
  const grid = document.getElementById("patientGrid");
  if (!grid) return;
  const patients = getPatients();
  const activeTurno = getActiveTurno();

  grid.innerHTML = patients.map((p) => {
    const initials = p.name.split(" ").slice(0, 2).map(x => x[0]).join("").toUpperCase();
    const isActivePatient = activeTurno && activeTurno.patient === p.name;
    const turnoBtn = isActivePatient
      ? `<button class="primary-btn full" onclick="location.href='turno.html'">Continuar turno activo</button>`
      : `<button class="primary-btn full" onclick="startTurno('${p.name.replace(/'/g, "\\'")}')">🕐 Iniciar turno</button>`;

    return `
      <article class="patient-card">
        <div class="avatar">${initials}</div>
        <h3>${p.name}</h3>
        <p>${p.condition}</p>
        <div class="patient-meta">
          <span><b>Edad:</b> ${p.age} años</span>
          <span><b>Familiar:</b> ${p.family}</span>
          <span><b>Estado:</b> En seguimiento</span>
        </div>
        <div class="patient-card-actions">
          ${turnoBtn}
          <a class="ghost-btn small full" href="reportes.html?paciente=${encodeURIComponent(p.name)}">Ver historial</a>
        </div>
      </article>
    `;
  }).join("");
}

function openPatientModal() {
  document.getElementById("patientModal").classList.add("show");
}

function closePatientModal() {
  document.getElementById("patientModal").classList.remove("show");
}

function startTurno(patientName) {
  const existing = getActiveTurno();

  if (existing && existing.patient !== patientName) {
    const confirmSwitch = confirm(
      `Ya existe un turno activo para ${existing.patient}. ¿Deseas descartarlo e iniciar un nuevo turno para ${patientName}?`
    );
    if (!confirmSwitch) return;
  } else if (existing && existing.patient === patientName) {
    window.location.href = "turno.html";
    return;
  }

  const now = new Date();
  const turno = {
    patient: patientName,
    technician: "Renzo C.",
    startTime: now.toISOString(),
    startLabel: formatTime(now),
    dateLabel: formatDateOnly(now),
    records: []
  };

  saveActiveTurno(turno);
  window.location.href = "turno.html";
}

const form = document.getElementById("patientForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const patients = getPatients();
    patients.push({
      name: document.getElementById("patientName").value,
      age: document.getElementById("patientAge").value,
      condition: document.getElementById("patientCondition").value,
      family: document.getElementById("patientFamily").value
    });
    savePatients(patients);
    form.reset();
    closePatientModal();
    renderPatients();
  });
}

renderPatients();
