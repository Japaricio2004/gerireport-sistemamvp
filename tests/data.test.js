import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialize,
  keys,
  read,
  summarizeReport,
  checkVitalAlerts,
  reportReview,
} from "../src/data.js";
const values = new Map();
globalThis.localStorage = {
  getItem: (k) => values.get(k) ?? null,
  setItem: (k, v) => values.set(k, String(v)),
  removeItem: (k) => values.delete(k),
};
test("initialization seeds once and preserves existing patient and report data", () => {
  initialize();
  const patients = read(keys.patients, []);
  const reports = read(keys.reports, []);
  assert.equal(patients.length, 6);
  assert.equal(reports.length, 5);
  localStorage.setItem(
    keys.patients,
    JSON.stringify([...patients, { name: "Paciente propio" }]),
  );
  initialize();
  assert.equal(read(keys.patients, []).length, 7);
  assert.deepEqual(read(keys.reports, []), reports);
});
test("corrupt storage safely falls back", () => {
  localStorage.setItem("bad", "{");
  assert.deepEqual(read("bad", []), []);
});
test("summaries support existing manual and shift reports", () => {
  const r = read(keys.reports, []).find((r) => r.id === 2);
  const s = summarizeReport(r);
  assert.equal(s.status, "Revisar");
  assert.equal(s.incidentCount, 1);
  assert.equal(s.medication, "Administrada");
  const manual = summarizeReport({
    type: "manual",
    patient: "Demo",
    incidents: "Observación",
    meds: "Registrada",
    food: "Completa",
  });
  assert.equal(manual.status, "Revisar");
  assert.equal(manual.medication, "Registrada");
  assert.equal(manual.incidentCount, 1);
});
test("vital alert rules distinguish configured ranges", () => {
  assert.equal(
    checkVitalAlerts({
      pressure: "120/80",
      heart: "72",
      temp: "36.5",
      spo2: "98",
    }).alert,
    false,
  );
  assert.equal(
    checkVitalAlerts({
      pressure: "180/110",
      heart: "120",
      temp: "39",
      spo2: "90",
    }).issues.length,
    5,
  );
});

test("empty turns are not classified as stable", () => {
  assert.equal(
    summarizeReport({
      type: "turno",
      patient: "Demo",
      records: [],
      status: "Estable",
    }).status,
    "Sin registros",
  );
});
test("manual reports distinguish no incidents from an observation and flag configured vital alerts", () => {
  assert.equal(
    summarizeReport({ type: "manual", incidents: "Sin incidentes." })
      .incidentCount,
    0,
  );
  assert.equal(
    summarizeReport({ type: "manual", incidents: "  Sin novedades  " }).status,
    "Estable",
  );
  assert.equal(
    summarizeReport({ type: "manual", incidents: "Observación de demo" })
      .status,
    "Revisar",
  );
  assert.equal(
    summarizeReport({ type: "manual", pressure: "180/110", incidents: "" })
      .status,
    "Revisar",
  );
});
test("shift alerts remain visible even without an incident record", () => {
  assert.equal(
    summarizeReport({
      type: "turno",
      records: [{ type: "vitals", alert: true }],
      status: "Estable",
    }).status,
    "Revisar",
  );
});

test("review explanations include each cause and count records rather than individual measurements", () => {
  const records = [
    {
      id: 1,
      type: "vitals",
      time: "08:00",
      data: { pressure: "180/110", heart: "72", temp: "36.5", spo2: "98" },
    },
    {
      id: 2,
      type: "medication",
      time: "08:30",
      data: { name: "Medicación demo", status: "No administrado" },
    },
    {
      id: 3,
      type: "food",
      title: "Almuerzo",
      time: "12:00",
      data: { amount: "0" },
    },
    { id: 4, type: "incident", time: "13:00", detail: "Observación ficticia" },
    { id: 5, type: "food", data: { amount: "75" } },
  ];
  const entries = reportReview({ type: "turno", records });
  assert.equal(entries.length, 4);
  assert.equal(entries[0].reasons.length, 2);
  assert.equal(entries[1].time, "08:30");
  assert.match(entries[1].reasons[0], /no administrada/);
  assert.match(entries[2].reasons[0], /0 %/);
  assert.match(entries[3].reasons[0], /Observación ficticia/);
  assert.equal(summarizeReport({ type: "turno", records }).reviewCount, 4);
});
test("partial food is not reported as complete and normal records do not show a warning", () => {
  const report = {
    type: "turno",
    records: [{ id: 1, type: "food", data: { amount: "75" } }],
  };
  assert.equal(summarizeReport(report).food, "Parcial");
  assert.deepEqual(reportReview(report), []);
  assert.equal(summarizeReport(report).reviewCount, 0);
});
test("manual review provides the same measurement reasons and avoids false incident alerts", () => {
  const report = {
    type: "manual",
    pressure: "180/110",
    incidents: "Sin incidentes",
  };
  assert.equal(reportReview(report).length, 1);
  assert.equal(summarizeReport(report).incidentCount, 0);
  assert.equal(summarizeReport(report).reviewCount, 1);
});
