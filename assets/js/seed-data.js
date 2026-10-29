/* ============================================================
   GeriReport - seed-data.js
   Crea reportes de ejemplo (datos ficticios) la primera vez
   que se abre el prototipo, para poder demostrar el historial,
   la vista familiar y las alertas sin cargar datos manualmente.
   ============================================================ */

(function seedDemoData() {
  const SEED_FLAG = "gerireport_seeded_v2";
  if (localStorage.getItem(SEED_FLAG)) return;

  // Asegura que existan los pacientes por defecto
  if (typeof getPatients === "function") getPatients();

  const existingReports = JSON.parse(localStorage.getItem("gerireport_reports") || "[]");
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
          { id: 1.1, time: "08:30", type: "food", icon: "🍽️", title: "Desayuno", detail: "Consumo: 100% · Buen apetito", alert: false, data: { meal: "Desayuno", amount: "100", note: "Buen apetito" } },
          { id: 1.2, time: "09:15", type: "vitals", icon: "🩺", title: "Signos vitales", detail: "Presión: 120/80 · FC: 72 lpm · Temp: 36.5 °C · SpO₂: 98%", alert: false, data: { pressure: "120/80", heart: "72", temp: "36.5", spo2: "98" } },
          { id: 1.3, time: "10:00", type: "medication", icon: "💊", title: "Medicación", detail: "Losartán 50mg · 1 tableta · Administrado", alert: false, data: { name: "Losartán 50mg", dose: "1 tableta", time: "10:00", status: "Administrado" } },
          { id: 1.4, time: "12:30", type: "food", icon: "🍽️", title: "Almuerzo", detail: "Consumo: 80%", alert: false, data: { meal: "Almuerzo", amount: "80", note: "" } },
          { id: 1.5, time: "16:00", type: "hygiene", icon: "🧼", title: "Higiene", detail: "Baño, Higiene bucal", alert: false, data: { activities: ["Baño", "Higiene bucal"] } },
          { id: 1.6, time: "19:30", type: "wellbeing", icon: "🙂", title: "Bienestar", detail: "Bien 🙂", alert: false, data: { state: "Bien 🙂" } }
        ]
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
        notes: "Se detectó un pico de presión durante la mañana; se recomienda control posterior.",
        status: "Revisar",
        incidentCount: 1,
        records: [
          { id: 2.1, time: "08:15", type: "vitals", icon: "🩺", title: "Signos vitales", detail: "Presión: 180/110 · FC: 95 lpm · Temp: 36.8 °C · SpO₂: 96%", alert: true, data: { pressure: "180/110", heart: "95", temp: "36.8", spo2: "96" } },
          { id: 2.2, time: "08:30", type: "medication", icon: "💊", title: "Medicación", detail: "Losartán 50mg · 1 tableta · Administrado", alert: false, data: { name: "Losartán 50mg", dose: "1 tableta", time: "08:30", status: "Administrado" } },
          { id: 2.3, time: "09:00", type: "food", icon: "🍽️", title: "Desayuno", detail: "Consumo: 75%", alert: false, data: { meal: "Desayuno", amount: "75", note: "" } },
          { id: 2.4, time: "10:40", type: "incident", icon: "⚠️", title: "Incidente: Dolor", detail: "Paciente presenta dolor leve en rodilla izquierda.", alert: true, data: { incidentType: "Dolor", description: "Paciente presenta dolor leve en rodilla izquierda.", time: "10:40" } },
          { id: 2.5, time: "13:30", type: "wellbeing", icon: "🙂", title: "Bienestar", detail: "Tranquilo 😌", alert: false, data: { state: "Tranquilo 😌" } }
        ]
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
          { id: 3.1, time: "09:00", type: "vitals", icon: "🩺", title: "Signos vitales", detail: "Presión: 130/85 · FC: 78 lpm · Temp: 36.6 °C · SpO₂: 97%", alert: false, data: { pressure: "130/85", heart: "78", temp: "36.6", spo2: "97" } },
          { id: 3.2, time: "13:00", type: "food", icon: "🍽️", title: "Almuerzo", detail: "Consumo: 100%", alert: false, data: { meal: "Almuerzo", amount: "100", note: "" } },
          { id: 3.3, time: "08:15", type: "sleep", icon: "🛏️", title: "Sueño", detail: "7 horas · Calidad: Buena", alert: false, data: { hours: "7", quality: "Buena" } }
        ]
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
        notes: "Registro de demostración con una observación pendiente de revisión.",
        status: "Revisar",
        incidentCount: 1,
        records: [
          { id: 4.1, time: "09:10", type: "vitals", icon: "🩺", title: "Signos vitales", detail: "Presión: 148/92 · FC: 86 lpm · Temp: 36.7 °C · SpO₂: 95%", alert: true, data: { pressure: "148/92", heart: "86", temp: "36.7", spo2: "95" } },
          { id: 4.2, time: "10:00", type: "medication", icon: "💊", title: "Medicación", detail: "Medicación habitual · 1 dosis · Administrado", alert: false, data: { name: "Medicación habitual", dose: "1 dosis", time: "10:00", status: "Administrado" } },
          { id: 4.3, time: "11:20", type: "food", icon: "🍽️", title: "Almuerzo", detail: "Consumo: 75%", alert: false, data: { meal: "Almuerzo", amount: "75", note: "" } },
          { id: 4.4, time: "12:15", type: "incident", icon: "⚠️", title: "Incidente: Observación", detail: "Se deja nota para revisión del equipo a cargo.", alert: true, data: { incidentType: "Observación", description: "Se deja nota para revisión del equipo a cargo.", time: "12:15" } }
        ]
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
          { id: 5.1, time: "09:00", type: "vitals", icon: "🩺", title: "Signos vitales", detail: "Presión: 122/78 · FC: 74 lpm · Temp: 36.6 °C · SpO₂: 97%", alert: false, data: { pressure: "122/78", heart: "74", temp: "36.6", spo2: "97" } },
          { id: 5.2, time: "12:30", type: "food", icon: "🍽️", title: "Almuerzo", detail: "Consumo: 100% · Buen apetito", alert: false, data: { meal: "Almuerzo", amount: "100", note: "Buen apetito" } },
          { id: 5.3, time: "13:00", type: "medication", icon: "💊", title: "Medicación", detail: "Medicación habitual · 1 dosis · Administrado", alert: false, data: { name: "Medicación habitual", dose: "1 dosis", time: "13:00", status: "Administrado" } },
          { id: 5.4, time: "16:00", type: "wellbeing", icon: "🙂", title: "Bienestar", detail: "Tranquila y participativa", alert: false, data: { state: "Tranquila y participativa" } }
        ]
      }
    ];

  const newDemoReports = demoReports.filter((report) =>
    ["Alberto Morales", "Clara Vargas"].includes(report.patient) &&
    !existingReports.some((saved) => saved.patient === report.patient)
  );
  saveReports(existingReports.length ? [...existingReports, ...newDemoReports] : demoReports);

  localStorage.setItem(SEED_FLAG, "true");
})();
