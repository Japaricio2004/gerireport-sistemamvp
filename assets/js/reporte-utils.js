/* ============================================================
   GeriReport - reporte-utils.js
   Funciones compartidas para leer y resumir reportes,
   ya sean generados desde el Modo Turno (con línea temporal)
   o creados con el formulario manual "Nuevo reporte".
   ============================================================ */

function getReportById(id) {
  const reports = getReports();
  return reports.find((r) => String(r.id) === String(id));
}

function isTurnoReport(report) {
  return report && report.type === "turno" && Array.isArray(report.records);
}

function recordsByType(report, type) {
  if (!isTurnoReport(report)) return [];
  return report.records.filter((r) => r.type === type);
}

/* Resumen normalizado usado por la vista familiar y el historial */
function summarizeReport(report) {
  if (isTurnoReport(report)) {
    const vitals = recordsByType(report, "vitals");
    const meds = recordsByType(report, "medication");
    const food = recordsByType(report, "food");
    const sleep = recordsByType(report, "sleep");
    const hygiene = recordsByType(report, "hygiene");
    const wellbeing = recordsByType(report, "wellbeing");
    const incidents = recordsByType(report, "incident");

    const allMedsAdministered = meds.length > 0 && meds.every((m) => m.data.status === "Administrado");
    const anyFoodRejected = food.some((f) => Number(f.data.amount) === 0);
    const lastSleep = sleep[sleep.length - 1];
    const lastWellbeing = wellbeing[wellbeing.length - 1];

    return {
      type: "turno",
      patient: report.patient,
      date: report.date,
      schedule: `${report.startTime} - ${report.endTime}`,
      status: report.status || (incidents.length > 0 ? "Revisar" : "Estable"),
      food: food.length ? (anyFoodRejected ? "Parcial / con rechazo" : "Completa") : "Sin registrar",
      medication: meds.length ? (allMedsAdministered ? "Administrada" : "Pendiente / incompleta") : "Sin registrar",
      hygiene: hygiene.length ? "Realizada" : "Sin registrar",
      sleep: lastSleep ? `${lastSleep.data.hours} horas (${lastSleep.data.quality})` : "Sin registrar",
      wellbeing: lastWellbeing ? lastWellbeing.detail : "Sin registrar",
      incidentCount: incidents.length,
      vitalsCount: vitals.length
    };
  }

  // Reporte manual (formulario "Nuevo reporte")
  return {
    type: "manual",
    patient: report.patient,
    date: report.createdAt,
    schedule: report.shift || "Reporte rápido",
    status: report.incidents && report.incidents.trim() ? "Revisar" : "Estable",
    food: report.food || "Sin registrar",
    medication: report.meds || "Sin registrar",
    hygiene: "Sin registrar",
    sleep: "Sin registrar",
    wellbeing: "Sin registrar",
    incidentCount: report.incidents && report.incidents.trim() ? 1 : 0,
    vitalsCount: report.pressure ? 1 : 0
  };
}
