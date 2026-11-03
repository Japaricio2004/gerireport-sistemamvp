export const defaultPatients = [
  {
    name: "María López",
    age: 82,
    condition: "Control de medicación y movilidad reducida",
    family: "Lucía López",
    status: "Estable",
  },
  {
    name: "Jorge Gálvez",
    age: 77,
    condition: "Hipertensión y control de presión arterial",
    family: "Carlos Gálvez",
    status: "Estable",
  },
  {
    name: "Elena Campos",
    age: 89,
    condition: "Seguimiento diario, hidratación y alimentación",
    family: "Rosa Campos",
    status: "Estable",
  },
  {
    name: "Alberto Morales",
    age: 81,
    condition: "Insuficiencia cardíaca, control de líquidos",
    family: "Laura Morales",
    status: "Alerta",
  },
  {
    name: "Clara Vargas",
    age: 84,
    condition: "Acompañamiento y estimulación cognitiva",
    family: "Pedro Vargas",
    status: "Estable",
  },
  {
    name: "Rosa Paredes",
    age: 76,
    condition: "EPOC, oxígeno domiciliario, control respiratorio",
    family: "Carlos Paredes",
    status: "Crítico",
  },
];

export const demoTasks = [
  {
    id: 1,
    title: "Control de presión",
    patient: "Jorge Gálvez",
    time: "16:00",
    priority: "Alta",
    status: "pending",
  },
  {
    id: 2,
    title: "Revisar hidratación",
    patient: "Elena Campos",
    time: "Durante el turno",
    priority: "Media",
    status: "pending",
  },
  {
    id: 3,
    title: "Registrar medicación",
    patient: "María López",
    time: "Dosis nocturna",
    priority: "Media",
    status: "active",
  },
  {
    id: 4,
    title: "Reporte de alimentación",
    patient: "María López",
    time: "Almuerzo registrado",
    priority: "Completada",
    status: "done",
  },
  {
    id: 5,
    title: "Observación de movilidad",
    patient: "Elena Campos",
    time: "Sin incidencias",
    priority: "Completada",
    status: "done",
  },
];

export const keys = {
  patients: "gerireport_patients",
  reports: "gerireport_reports",
  turn: "gerireport_active_turno",
  tasks: "gerireport_tasks",
};
export function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    if (value == null) return fallback;
    const validRecord = (record) =>
      record && typeof record === "object" && typeof record.type === "string";
    const cleanRecords = (records) =>
      Array.isArray(records)
        ? records
            .filter(validRecord)
            .map((record) => ({
              ...record,
              data:
                record.data && typeof record.data === "object"
                  ? record.data
                  : {},
            }))
        : [];
    if (Array.isArray(fallback)) {
      if (!Array.isArray(value)) return fallback;
      if (key === keys.patients)
        return value.filter(
          (patient) => typeof patient?.name === "string" && patient.name.trim(),
        );
      if (key === keys.reports)
        return value
          .filter(
            (report) =>
              report &&
              typeof report.patient === "string" &&
              report.patient.trim() &&
              ["number", "string"].includes(typeof report.id),
          )
          .map((report) =>
            report.type === "turno"
              ? { ...report, records: cleanRecords(report.records) }
              : report,
          );
      if (key === keys.tasks)
        return value.filter(
          (task) =>
            task &&
            typeof task.title === "string" &&
            ["pending", "active", "done"].includes(task.status),
        );
    }
    if (key === keys.turn) {
      if (
        typeof value?.patient !== "string" ||
        !value.patient.trim() ||
        !Array.isArray(value.records)
      )
        return fallback;
      return { ...value, records: cleanRecords(value.records) };
    }
    return value;
  } catch {
    return fallback;
  }
}
export const formatDateOnly = (d = new Date()) => d.toLocaleDateString("es-PE");
export const formatTime = (d = new Date()) =>
  d.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
export const formatDate = () => new Date().toLocaleString("es-PE");
export function initialize() {
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = formatDateOnly(yesterdayDate);
  const today = formatDateOnly();

  const demoReports = [
    {
      id: 1,
      type: "turno",
      createdAt: `${yesterday} 20:05`,
      patient: "María López",
      technician: "Renzo C.",
      date: yesterday,
      shift: "Turno completo",
      startTime: "08:00",
      endTime: "20:00",
      notes: "Turno tranquilo, sin novedades relevantes.",
      status: "Estable",
      incidentCount: 0,
      records: [
        {
          id: 1.1,
          time: "08:30",
          type: "food",
          icon: "🍽️",
          title: "Desayuno",
          detail: "Consumo: 100% · Buen apetito",
          alert: false,
          data: { meal: "Desayuno", amount: "100", note: "Buen apetito" },
        },
        {
          id: 1.2,
          time: "09:15",
          type: "vitals",
          icon: "🩺",
          title: "Signos vitales",
          detail: "Presión: 120/80 · FC: 72 lpm · Temp: 36.5 °C · SpO₂: 98%",
          alert: false,
          data: { pressure: "120/80", heart: "72", temp: "36.5", spo2: "98" },
        },
        {
          id: 1.3,
          time: "10:00",
          type: "medication",
          icon: "💊",
          title: "Medicación",
          detail: "Losartán 50mg · 1 tableta · Administrado",
          alert: false,
          data: {
            name: "Losartán 50mg",
            dose: "1 tableta",
            time: "10:00",
            status: "Administrado",
          },
        },
        {
          id: 1.4,
          time: "12:30",
          type: "food",
          icon: "🍽️",
          title: "Almuerzo",
          detail: "Consumo: 80%",
          alert: false,
          data: { meal: "Almuerzo", amount: "80", note: "" },
        },
        {
          id: 1.5,
          time: "16:00",
          type: "hygiene",
          icon: "🧼",
          title: "Higiene",
          detail: "Baño, Higiene bucal",
          alert: false,
          data: { activities: ["Baño", "Higiene bucal"] },
        },
        {
          id: 1.6,
          time: "19:30",
          type: "wellbeing",
          icon: "🙂",
          title: "Bienestar",
          detail: "Bien 🙂",
          alert: false,
          data: { state: "Bien 🙂" },
        },
      ],
    },
    {
      id: 2,
      type: "turno",
      createdAt: `${today} 14:00`,
      patient: "María López",
      technician: "Renzo C.",
      date: today,
      shift: "Turno completo",
      startTime: "08:00",
      endTime: "14:00",
      notes:
        "Se detectó un pico de presión durante la mañana; se recomienda control posterior.",
      status: "Revisar",
      incidentCount: 1,
      records: [
        {
          id: 2.1,
          time: "08:15",
          type: "vitals",
          icon: "🩺",
          title: "Signos vitales",
          detail: "Presión: 180/110 · FC: 95 lpm · Temp: 36.8 °C · SpO₂: 96%",
          alert: true,
          data: { pressure: "180/110", heart: "95", temp: "36.8", spo2: "96" },
        },
        {
          id: 2.2,
          time: "08:30",
          type: "medication",
          icon: "💊",
          title: "Medicación",
          detail: "Losartán 50mg · 1 tableta · Administrado",
          alert: false,
          data: {
            name: "Losartán 50mg",
            dose: "1 tableta",
            time: "08:30",
            status: "Administrado",
          },
        },
        {
          id: 2.3,
          time: "09:00",
          type: "food",
          icon: "🍽️",
          title: "Desayuno",
          detail: "Consumo: 75%",
          alert: false,
          data: { meal: "Desayuno", amount: "75", note: "" },
        },
        {
          id: 2.4,
          time: "10:40",
          type: "incident",
          icon: "⚠️",
          title: "Incidente: Dolor",
          detail: "Paciente presenta dolor leve en rodilla izquierda.",
          alert: true,
          data: {
            incidentType: "Dolor",
            description: "Paciente presenta dolor leve en rodilla izquierda.",
            time: "10:40",
          },
        },
        {
          id: 2.5,
          time: "13:30",
          type: "wellbeing",
          icon: "🙂",
          title: "Bienestar",
          detail: "Tranquilo 😌",
          alert: false,
          data: { state: "Tranquilo 😌" },
        },
      ],
    },
    {
      id: 3,
      type: "turno",
      createdAt: `${yesterday} 20:10`,
      patient: "Jorge Gálvez",
      technician: "Renzo C.",
      date: yesterday,
      shift: "Turno completo",
      startTime: "08:00",
      endTime: "20:00",
      notes: "Buen control de presión durante todo el turno.",
      status: "Estable",
      incidentCount: 0,
      records: [
        {
          id: 3.1,
          time: "09:00",
          type: "vitals",
          icon: "🩺",
          title: "Signos vitales",
          detail: "Presión: 130/85 · FC: 78 lpm · Temp: 36.6 °C · SpO₂: 97%",
          alert: false,
          data: { pressure: "130/85", heart: "78", temp: "36.6", spo2: "97" },
        },
        {
          id: 3.2,
          time: "13:00",
          type: "food",
          icon: "🍽️",
          title: "Almuerzo",
          detail: "Consumo: 100%",
          alert: false,
          data: { meal: "Almuerzo", amount: "100", note: "" },
        },
        {
          id: 3.3,
          time: "08:15",
          type: "sleep",
          icon: "🛏️",
          title: "Sueño",
          detail: "7 horas · Calidad: Buena",
          alert: false,
          data: { hours: "7", quality: "Buena" },
        },
      ],
    },
    {
      id: 4,
      type: "turno",
      createdAt: `${today} 14:00`,
      patient: "Alberto Morales",
      technician: "Renzo C.",
      date: today,
      shift: "Turno de mañana",
      startTime: "08:00",
      endTime: "14:00",
      notes:
        "Registro de demostración con una observación pendiente de revisión.",
      status: "Revisar",
      incidentCount: 1,
      records: [
        {
          id: 4.1,
          time: "09:10",
          type: "vitals",
          icon: "🩺",
          title: "Signos vitales",
          detail: "Presión: 148/92 · FC: 86 lpm · Temp: 36.7 °C · SpO₂: 95%",
          alert: true,
          data: { pressure: "148/92", heart: "86", temp: "36.7", spo2: "95" },
        },
        {
          id: 4.2,
          time: "10:00",
          type: "medication",
          icon: "💊",
          title: "Medicación",
          detail: "Medicación habitual · 1 dosis · Administrado",
          alert: false,
          data: {
            name: "Medicación habitual",
            dose: "1 dosis",
            time: "10:00",
            status: "Administrado",
          },
        },
        {
          id: 4.3,
          time: "11:20",
          type: "food",
          icon: "🍽️",
          title: "Almuerzo",
          detail: "Consumo: 75%",
          alert: false,
          data: { meal: "Almuerzo", amount: "75", note: "" },
        },
        {
          id: 4.4,
          time: "12:15",
          type: "incident",
          icon: "⚠️",
          title: "Incidente: Observación",
          detail: "Se deja nota para revisión del equipo a cargo.",
          alert: true,
          data: {
            incidentType: "Observación",
            description: "Se deja nota para revisión del equipo a cargo.",
            time: "12:15",
          },
        },
      ],
    },
    {
      id: 5,
      type: "turno",
      createdAt: `${yesterday} 20:05`,
      patient: "Clara Vargas",
      technician: "Renzo C.",
      date: yesterday,
      shift: "Turno completo",
      startTime: "08:00",
      endTime: "20:00",
      notes: "Rutina diaria completada sin incidencias registradas.",
      status: "Estable",
      incidentCount: 0,
      records: [
        {
          id: 5.1,
          time: "09:00",
          type: "vitals",
          icon: "🩺",
          title: "Signos vitales",
          detail: "Presión: 122/78 · FC: 74 lpm · Temp: 36.6 °C · SpO₂: 97%",
          alert: false,
          data: { pressure: "122/78", heart: "74", temp: "36.6", spo2: "97" },
        },
        {
          id: 5.2,
          time: "12:30",
          type: "food",
          icon: "🍽️",
          title: "Almuerzo",
          detail: "Consumo: 100% · Buen apetito",
          alert: false,
          data: { meal: "Almuerzo", amount: "100", note: "Buen apetito" },
        },
        {
          id: 5.3,
          time: "13:00",
          type: "medication",
          icon: "💊",
          title: "Medicación",
          detail: "Medicación habitual · 1 dosis · Administrado",
          alert: false,
          data: {
            name: "Medicación habitual",
            dose: "1 dosis",
            time: "13:00",
            status: "Administrado",
          },
        },
        {
          id: 5.4,
          time: "16:00",
          type: "wellbeing",
          icon: "🙂",
          title: "Bienestar",
          detail: "Tranquila y participativa",
          alert: false,
          data: { state: "Tranquila y participativa" },
        },
      ],
    },
  ];

  if (!localStorage.getItem(keys.patients))
    localStorage.setItem(keys.patients, JSON.stringify(defaultPatients));
  if (!localStorage.getItem("gerireport_seeded_v2")) {
    const existing = read(keys.reports, []);
    const added = demoReports.filter(
      (r) =>
        ["Alberto Morales", "Clara Vargas"].includes(r.patient) &&
        !existing.some((e) => e.patient === r.patient),
    );
    localStorage.setItem(
      keys.reports,
      JSON.stringify(existing.length ? [...existing, ...added] : demoReports),
    );
    localStorage.setItem("gerireport_seeded_v2", "true");
  }
}
function isTurnoReport(report) {
  return report && report.type === "turno" && Array.isArray(report.records);
}

function recordsByType(report, type) {
  if (!isTurnoReport(report)) return [];
  return report.records.filter((r) => r.type === type);
}

/* Resumen normalizado usado por la vista familiar y el historial */
export function hasIncident(value = "") {
  const text = value
    .trim()
    .toLocaleLowerCase("es")
    .replace(/[.!]+$/, "");
  return Boolean(
    text &&
    ![
      "sin incidentes",
      "sin incidencias",
      "ninguno",
      "ninguna",
      "no",
      "sin novedades",
    ].includes(text),
  );
}
export function recordReviewReasons(record) {
  const data = record.data || {};
  let reasons = [];
  if (record.type === "vitals") reasons = checkVitalAlerts(data).issues;
  if (record.type === "medication" && data.status === "No administrado")
    reasons = [
      `Medicación no administrada: ${data.name || record.detail || "sin nombre registrado"}.`,
    ];
  if (
    record.type === "food" &&
    data.amount !== undefined &&
    data.amount !== "" &&
    Number(data.amount) === 0
  )
    reasons = [
      `${record.title || data.meal || "Alimentación"}: consumo registrado de 0 % (rechazado).`,
    ];
  if (record.type === "incident")
    reasons = [
      `Incidente registrado: ${record.detail || data.description || "consulta el registro"}`,
    ];
  if (!reasons.length && record.alert)
    reasons = [
      `Registro marcado para revisión: ${record.detail || record.title || "consulta el detalle"}`,
    ];
  return reasons;
}
export function reportReview(report) {
  if (!report) return [];
  if (isTurnoReport(report) || Array.isArray(report.records)) {
    return report.records.flatMap((record, index) => {
      const reasons = recordReviewReasons(record);
      return reasons.length
        ? [{ id: record.id ?? index, time: record.time || "", reasons }]
        : [];
    });
  }
  const result = [];
  const vitalReasons = checkVitalAlerts(report).issues;
  if (vitalReasons.length)
    result.push({ id: "vitals", time: "", reasons: vitalReasons });
  if (hasIncident(report.incidents))
    result.push({
      id: "incident",
      time: "",
      reasons: [`Incidente registrado: ${report.incidents.trim()}`],
    });
  return result;
}
export function summarizeReport(report) {
  const review = reportReview(report);
  if (isTurnoReport(report)) {
    const vitals = recordsByType(report, "vitals");
    const meds = recordsByType(report, "medication");
    const food = recordsByType(report, "food");
    const sleep = recordsByType(report, "sleep");
    const hygiene = recordsByType(report, "hygiene");
    const wellbeing = recordsByType(report, "wellbeing");
    const incidents = recordsByType(report, "incident");

    const allMedsAdministered =
      meds.length > 0 && meds.every((m) => m.data?.status === "Administrado");
    const anyFoodRejected = food.some(
      (f) => f.data?.amount !== undefined && Number(f.data.amount) === 0,
    );
    const anyFoodPartial = food.some((f) => Number(f.data?.amount) < 100);
    const lastSleep = sleep[sleep.length - 1];
    const lastWellbeing = wellbeing[wellbeing.length - 1];

    return {
      type: "turno",
      patient: report.patient,
      date: report.date,
      schedule: `${report.startTime} - ${report.endTime}`,
      status: !report.records.length
        ? "Sin registros"
        : review.length
          ? "Revisar"
          : "Estable",
      food: food.length
        ? anyFoodRejected
          ? "Parcial / con rechazo"
          : anyFoodPartial
            ? "Parcial"
            : "Completa"
        : "Sin registrar",
      medication: meds.length
        ? allMedsAdministered
          ? "Administrada"
          : "Pendiente / incompleta"
        : "Sin registrar",
      hygiene: hygiene.length ? "Realizada" : "Sin registrar",
      sleep: lastSleep
        ? `${lastSleep.data.hours} horas (${lastSleep.data.quality})`
        : "Sin registrar",
      wellbeing: lastWellbeing ? lastWellbeing.detail : "Sin registrar",
      incidentCount: incidents.length,
      reviewCount: review.length,
      vitalsCount: vitals.length,
    };
  }

  // Reporte manual (formulario "Nuevo reporte")
  return {
    type: "manual",
    patient: report.patient,
    date: report.createdAt,
    schedule: report.shift || "Reporte rápido",
    status: review.length ? "Revisar" : "Estable",
    food: report.food || "Sin registrar",
    medication: report.meds || "Sin registrar",
    hygiene: "Sin registrar",
    sleep: "Sin registrar",
    wellbeing: "Sin registrar",
    incidentCount: hasIncident(report.incidents) ? 1 : 0,
    reviewCount: review.length,
    vitalsCount: report.pressure ? 1 : 0,
  };
}
const VITAL_RANGES = {
  systolic: { min: 90, max: 140 },
  diastolic: { min: 60, max: 90 },
  heart: { min: 60, max: 100 },
  temp: { min: 36, max: 37.5 },
  spo2: { min: 95, max: 100 },
};

export function checkVitalAlerts({ pressure, heart, temp, spo2 }) {
  const issues = [];

  if (pressure) {
    const parts = String(pressure)
      .split("/")
      .map((n) => parseFloat(n));
    const [systolic, diastolic] = parts;
    if (
      !isNaN(systolic) &&
      (systolic < VITAL_RANGES.systolic.min ||
        systolic > VITAL_RANGES.systolic.max)
    ) {
      issues.push(`Presión sistólica fuera de rango (${systolic} mmHg)`);
    }
    if (
      !isNaN(diastolic) &&
      (diastolic < VITAL_RANGES.diastolic.min ||
        diastolic > VITAL_RANGES.diastolic.max)
    ) {
      issues.push(`Presión diastólica fuera de rango (${diastolic} mmHg)`);
    }
  }

  if (heart) {
    const hr = parseFloat(heart);
    if (
      !isNaN(hr) &&
      (hr < VITAL_RANGES.heart.min || hr > VITAL_RANGES.heart.max)
    ) {
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
