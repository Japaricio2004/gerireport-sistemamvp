/* ============================================================
   GeriReport - pacientes.js
   Listado / registro de pacientes + inicio de turno.
   ============================================================ */

const defaultPatients = [
  {
    name: "María López",
    age: 82,
    condition: "Control de medicación y movilidad reducida",
    family: "Lucía López",
    status: "Estable"
  },
  {
    name: "Jorge Gálvez",
    age: 77,
    condition: "Hipertensión y control de presión arterial",
    family: "Carlos Gálvez",
    status: "Estable"
  },
  {
    name: "Elena Campos",
    age: 89,
    condition: "Seguimiento diario, hidratación y alimentación",
    family: "Rosa Campos",
    status: "Estable"
  },
  {
    name: "Alberto Morales",
    age: 81,
    condition: "Insuficiencia cardíaca, control de líquidos",
    family: "Laura Morales",
    status: "Alerta"
  },
  {
    name: "Clara Vargas",
    age: 84,
    condition: "Acompañamiento y estimulación cognitiva",
    family: "Pedro Vargas",
    status: "Estable"
  },
  {
    name: "Rosa Paredes",
    age: 76,
    condition: "EPOC, oxígeno domiciliario, control respiratorio",
    family: "Carlos Paredes",
    status: "Crítico"
  }
];

function getPatients() {
  const stored = JSON.parse(localStorage.getItem("gerireport_patients") || "null");
  if (!stored) {
    localStorage.setItem("gerireport_patients", JSON.stringify(defaultPatients));
    return defaultPatients;
  }
  const patients = [...stored, ...defaultPatients.filter((demo) => !stored.some((patient) => patient.name === demo.name))];
  if (patients.length !== stored.length) savePatients(patients);
  return patients;
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
    const status = p.status || "Estable";
    const statusClass = { Alerta: "alerta", Crítico: "critico", Seguimiento: "seguimiento" }[status] || "estable";
    const turnoBtn = isActivePatient
      ? `<button class="btn-action btn-turno" onclick="location.href='turno.html'"><i class="fas fa-play"></i> Continuar turno</button>`
      : `<button class="btn-action btn-turno" onclick="startTurno('${p.name.replace(/'/g, "\\'")}')"><i class="fas fa-play"></i> Iniciar turno</button>`;

    return `
      <article class="patient-card">
        <div class="card-header">
          <div class="avatar">${initials}</div>
          <div class="header-info"><span class="name">${p.name}</span><span class="age">${p.age} años</span></div>
          <span class="status-badge ${statusClass}">${status}</span>
        </div>
        <div class="card-body">
          <div class="detail"><i class="fas fa-stethoscope"></i><span class="label">Condición:</span><span class="value">${p.condition}</span></div>
          <div class="detail"><i class="fas fa-user"></i><span class="label">Familiar:</span><span class="value">${p.family}</span></div>
          <div class="detail"><i class="fas fa-clock"></i><span class="label">Estado:</span><span class="value">En seguimiento</span></div>
        </div>
        <div class="card-footer">
          ${turnoBtn}
          <a class="btn-action btn-historial" href="reportes.html?paciente=${encodeURIComponent(p.name)}"><i class="fas fa-clock-rotate-left"></i> Ver historial</a>
        </div>
      </article>
    `;
  }).join("");
}

function openPatientModal() {
  document.getElementById("patientModal").classList.add("active");
}

function closePatientModal() {
  document.getElementById("patientModal").classList.remove("active");
}

async function startTurno(patientName) {
  const existing = getActiveTurno();

  if (existing && existing.patient !== patientName) {
    const confirmSwitch = await showAppDialog({
      title: "Ya hay un turno activo",
      message: `El turno de ${existing.patient} sigue abierto. ¿Quieres cerrarlo e iniciar uno para ${patientName}?`,
      kind: "confirm",
      confirmLabel: "Cambiar turno"
    });
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
      family: document.getElementById("patientFamily").value,
      status: "Estable"
    });
    savePatients(patients);
    form.reset();
    closePatientModal();
    renderPatients();
  });
}

renderPatients();
