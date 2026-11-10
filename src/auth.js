const SESSION_KEY = "gerireport_session";
export const USERS_KEY = "gerireport_users";
const roles = ["admin", "technician"];
const demoUsers = [
  { id: "admin@gerireport.demo", email: "admin@gerireport.demo", name: "Administrador demo", role: "admin", active: true, salt: "geri-demo-admin-2026", hash: "073465585da24809ee8e88db4a91fd27c4bcdce0f9a22cf21f822857ed2c3b47" },
  { id: "renzo@gerireport.demo", email: "renzo@gerireport.demo", name: "Renzo C.", role: "technician", active: true, salt: "geri-demo-renzo-2026", hash: "1afc05099d7c80a2769a7a36ba1f6ae8f4a6c7b5e4bc0325bba1ba4e708cae70" },
];
const publicUser = ({ id, email, name, role }) => ({ id, email, name, role });

export function validUsers(users) {
  return Array.isArray(users) && users.length > 0 && users.every((user) =>
    typeof user?.id === "string" && typeof user.email === "string" &&
    typeof user.name === "string" && roles.includes(user.role) &&
    typeof user.active === "boolean" && typeof user.salt === "string" &&
    /^[a-f0-9]{64}$/.test(user.hash),
  ) && users.some((user) => user.role === "admin" && user.active) &&
    new Set(users.map((user) => user.email.toLowerCase())).size === users.length;
}

export function readUsers() {
  try {
    const saved = localStorage.getItem(USERS_KEY);
    if (!saved) {
      localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
      return demoUsers;
    }
    const users = JSON.parse(saved);
    return validUsers(users) ? users : demoUsers;
  } catch {
    return demoUsers;
  }
}

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: new TextEncoder().encode(salt), iterations: 100000, hash: "SHA-256" }, key, 256);
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Identidades de demostración: los datos y hashes son accesibles desde el mismo navegador.
export async function authenticateUser(email, password) {
  const account = readUsers().find((user) => user.email === String(email || "").trim().toLowerCase());
  if (!account || !account.active || typeof password !== "string" || !password ||
      await hashPassword(password, account.salt) !== account.hash)
    throw new Error("Correo o contraseña incorrectos, o usuario inactivo.");
  return publicUser(account);
}

export async function createUser(users, { name, email, password, role }) {
  name = String(name || "").trim().replace(/\s+/g, " ");
  email = String(email || "").trim().toLowerCase();
  if (!name || name.length > 100) throw new Error("Escribe un nombre válido de hasta 100 caracteres.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Escribe un correo válido.");
  if (!roles.includes(role)) throw new Error("Selecciona un rol válido.");
  if (typeof password !== "string" || password.length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres.");
  if (users.some((user) => user.email.toLowerCase() === email)) throw new Error("Ese correo ya está registrado.");
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return [...users, { id: email, email, name, role, active: true, salt, hash: await hashPassword(password, salt) }];
}

export async function resetUserPassword(users, id, password) {
  if (typeof password !== "string" || password.length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres.");
  if (!users.some((user) => user.id === id)) throw new Error("Usuario no encontrado.");
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, "0")).join("");
  const hash = await hashPassword(password, salt);
  return users.map((user) => user.id === id ? { ...user, salt, hash } : user);
}

export function readSession() {
  for (const storage of [globalThis.sessionStorage, globalThis.localStorage]) {
    try {
      const saved = JSON.parse(storage?.getItem(SESSION_KEY) || "null");
      if (!saved) continue;
      const account = readUsers().find((user) => user.id === saved.id && user.active);
      if (account && saved.expiresAt > Date.now()) return publicUser(account);
      storage.removeItem(SESSION_KEY);
    } catch { /* Sesión inválida o almacenamiento no disponible. */ }
  }
  return null;
}

export function saveSession(user, remember) {
  clearSession();
  (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify({ ...publicUser(user), expiresAt: Date.now() + 8 * 60 * 60 * 1000 }));
}

export function clearSession() {
  globalThis.localStorage?.removeItem(SESSION_KEY);
  globalThis.sessionStorage?.removeItem(SESSION_KEY);
}
