import { test } from "node:test";
import assert from "node:assert/strict";
import { createBackup, restoreBackup, validateBackup } from "../src/backup.js";
import { initialize, keys } from "../src/data.js";

const memory = () => {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: (key) => values.delete(key) };
};

test("local backup restores patients, reports and accounts", () => {
  globalThis.localStorage = memory();
  initialize();
  const backup = createBackup();
  const before = JSON.parse(backup).data;
  localStorage.setItem(keys.patients, "[]");
  restoreBackup(backup);
  assert.deepEqual(JSON.parse(localStorage.getItem(keys.patients)), before[keys.patients]);
  assert.deepEqual(JSON.parse(localStorage.getItem(keys.reports)), before[keys.reports]);
  assert.equal(JSON.parse(localStorage.getItem("gerireport_users")).length, 2);
});

test("invalid backup is rejected before changing local data", () => {
  globalThis.localStorage = memory();
  initialize();
  const oldPatients = localStorage.getItem(keys.patients);
  assert.throws(() => restoreBackup("not json"));
  const backup = JSON.parse(createBackup());
  backup.data[keys.reports][0].patient = "Paciente inexistente";
  assert.throws(() => validateBackup(JSON.stringify(backup)), /reportes/);
  assert.equal(localStorage.getItem(keys.patients), oldPatients);
});
