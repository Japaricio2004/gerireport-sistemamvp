import { keys } from "./data.js";
import { readUsers, validUsers, USERS_KEY } from "./auth.js";

const fields = [keys.patients, keys.reports, keys.turn, keys.tasks, keys.audit, USERS_KEY];

export function createBackup() {
  const data = Object.fromEntries(fields.map((key) => [key, JSON.parse(localStorage.getItem(key) || (key === keys.turn ? "null" : "[]"))]));
  data[USERS_KEY] = readUsers();
  return JSON.stringify({ application: "GeriReport", version: 1, exportedAt: new Date().toISOString(), data }, null, 2);
}

export function validateBackup(raw) {
  let backup;
  try { backup = JSON.parse(raw); } catch { throw new Error("El archivo no contiene JSON válido."); }
  if (backup?.application !== "GeriReport" || backup.version !== 1 || !backup.data)
    throw new Error("El archivo no es un respaldo compatible de GeriReport.");
  const data = backup.data;
  const patients = data[keys.patients], reports = data[keys.reports], turn = data[keys.turn];
  if (!Array.isArray(patients) || !patients.every((patient) => typeof patient?.name === "string" && patient.name.trim() && typeof patient.assignedTo === "string") ||
      new Set(patients.map((patient) => patient.name)).size !== patients.length)
    throw new Error("El respaldo tiene pacientes inválidos o duplicados.");
  const names = new Set(patients.map((patient) => patient.name));
  if (!Array.isArray(reports) || !reports.every((report) => report && ["number", "string"].includes(typeof report.id) && names.has(report.patient) && ["turno", "manual"].includes(report.type) && (report.type !== "turno" || Array.isArray(report.records))))
    throw new Error("El respaldo contiene reportes sin paciente o registros inválidos.");
  if (turn !== null && (!turn || !names.has(turn.patient) || !Array.isArray(turn.records)))
    throw new Error("El turno del respaldo no es válido.");
  if (!Array.isArray(data[keys.tasks]) || !Array.isArray(data[keys.audit]) || !validUsers(data[USERS_KEY]))
    throw new Error("El respaldo contiene tareas, actividad o usuarios inválidos.");
  return data;
}

export function restoreBackup(raw) {
  const data = validateBackup(raw);
  const previous = Object.fromEntries(fields.map((key) => [key, localStorage.getItem(key)]));
  const oldSeed = localStorage.getItem("gerireport_seeded_v2");
  try {
    for (const key of fields) localStorage.setItem(key, JSON.stringify(data[key]));
    localStorage.setItem("gerireport_seeded_v2", "true");
  } catch (error) {
    for (const key of fields) previous[key] === null ? localStorage.removeItem(key) : localStorage.setItem(key, previous[key]);
    oldSeed === null ? localStorage.removeItem("gerireport_seeded_v2") : localStorage.setItem("gerireport_seeded_v2", oldSeed);
    throw error;
  }
}
