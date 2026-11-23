import { test } from "node:test";
import assert from "node:assert/strict";
import { authenticateUser, createUser, resetUserPassword, readUsers, readSession, saveSession, clearSession } from "../src/auth.js";

const memory = () => {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: (key) => values.delete(key) };
};

test("local demo accounts use credentials and roles", async () => {
  globalThis.localStorage = memory();
  globalThis.sessionStorage = memory();
  const users = readUsers();
  assert.equal(users.length, 2);
  const technician = await authenticateUser("renzo@gerireport.demo", "renzo123");
  const admin = await authenticateUser("admin@gerireport.demo", "admin123");
  assert.equal(technician.role, "technician");
  assert.equal(admin.role, "admin");
  await assert.rejects(authenticateUser("renzo@gerireport.demo", "incorrecta"));
  await assert.rejects(authenticateUser("otro@gerireport.demo", "renzo123"));
  saveSession(technician, false);
  assert.deepEqual(readSession(), technician);
  assert.equal(localStorage.getItem("gerireport_session"), null);
  assert.ok(!sessionStorage.getItem("gerireport_session").includes("renzo123"));
  clearSession();
  assert.equal(readSession(), null);
});

test("administrator can create an account and reset its password locally", async () => {
  globalThis.localStorage = memory();
  globalThis.sessionStorage = memory();
  let users = await createUser(readUsers(), { name: "Ana Martínez", email: "ANA@example.demo", password: "claveDemo8", role: "technician" });
  assert.ok(!JSON.stringify(users).includes("claveDemo8"));
  localStorage.setItem("gerireport_users", JSON.stringify(users));
  assert.equal((await authenticateUser("ana@example.demo", "claveDemo8")).name, "Ana Martínez");
  users = await resetUserPassword(users, "ana@example.demo", "nuevaClave8");
  localStorage.setItem("gerireport_users", JSON.stringify(users));
  await assert.rejects(authenticateUser("ana@example.demo", "claveDemo8"));
  assert.equal((await authenticateUser("ana@example.demo", "nuevaClave8")).role, "technician");
});

test("expired or deactivated sessions are rejected", async () => {
  globalThis.localStorage = memory();
  globalThis.sessionStorage = memory();
  const user = await authenticateUser("renzo@gerireport.demo", "renzo123");
  localStorage.setItem("gerireport_session", JSON.stringify({ ...user, expiresAt: Date.now() - 1 }));
  assert.equal(readSession(), null);
  saveSession(user, true);
  localStorage.setItem("gerireport_users", JSON.stringify(readUsers().map((entry) => entry.id === user.id ? { ...entry, active: false } : entry)));
  assert.equal(readSession(), null);
});
