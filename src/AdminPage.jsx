import React, { useState } from "react";
import { useStore } from "./store";
import { createUser, resetUserPassword, clearSession } from "./auth";
import { keys, logActivity, read } from "./data";
import { createBackup, restoreBackup } from "./backup";
import "./admin.css";

export default function AdminPage() {
  const { user, users, setUsers, ask } = useStore();
  const [audit, setAudit] = useState(() => read(keys.audit, []));
  const [message, setMessage] = useState("");
  const record = (action, target) => {
    logActivity(user, action, target);
    setAudit(read(keys.audit, []));
  };
  async function add(event) {
    event.preventDefault();
    setMessage("");
    try {
      const form = event.currentTarget;
      const data = Object.fromEntries(new FormData(form));
      const next = await createUser(users, data);
      setUsers(next);
      record("Creó usuario", data.email);
      form.reset();
      setMessage("Usuario creado en este navegador.");
    } catch (error) { setMessage(error.message); }
  }
  function change(id, patch) {
    if (id === user.id) return setMessage("No puedes cambiar tu propia cuenta activa.");
    try {
      setUsers(users.map((entry) => entry.id === id ? { ...entry, ...patch } : entry));
      record("Actualizó usuario", id);
      setMessage("Usuario actualizado.");
    } catch (error) { setMessage(error.message); }
  }
  async function changePassword(event, id) {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      const password = new FormData(form).get("newPassword");
      setUsers(await resetUserPassword(users, id, password));
      record("Cambió contraseña", id);
      form.reset();
      setMessage("Contraseña actualizada.");
    } catch (error) { setMessage(error.message); }
  }
  function download() {
    try {
      const blob = new Blob([createBackup()], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `GeriReport-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      record("Exportó respaldo", "Datos locales");
      setMessage("Respaldo descargado. Guárdalo en un lugar privado.");
    } catch (error) { setMessage(error.message); }
  }
  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!(await ask("Restaurar respaldo", "Se reemplazarán los datos y usuarios de esta demo local. ¿Continuar?"))) return;
    try {
      restoreBackup(await file.text());
      record("Restauró respaldo", file.name);
      clearSession();
      location.assign("/pages/login.html");
    } catch (error) { setMessage(error.message); }
  }
  return <main className="admin-page main-content">
    <header><h1>Usuarios y respaldo</h1><p>Administración de la demo local. Usa solo datos ficticios.</p></header>
    {message && <p className="admin-message" role="status">{message}</p>}
    <section className="admin-panel"><h2>Usuarios</h2>
      <div className="admin-users">{users.map((account) => <div className="admin-user" key={account.id}>
        <div><strong>{account.name}</strong><small>{account.email}</small></div>
        <label>Rol<select value={account.role} disabled={account.id === user.id} onChange={(event) => change(account.id, { role: event.target.value })}><option value="technician">Técnico</option><option value="admin">Administrador</option></select></label>
        <button type="button" disabled={account.id === user.id} onClick={() => change(account.id, { active: !account.active })}>{account.active ? "Desactivar" : "Activar"}</button>
        <form className="admin-password" onSubmit={(event) => changePassword(event, account.id)}><label>Nueva contraseña<input name="newPassword" type="password" minLength={8} required /></label><button type="submit">Cambiar</button></form>
      </div>)}</div>
      <h3>Agregar usuario</h3>
      <form className="admin-form" onSubmit={add}>
        <label>Nombre<input name="name" required maxLength={100} /></label>
        <label>Correo<input name="email" type="email" required /></label>
        <label>Contraseña inicial<input name="password" type="password" minLength={8} required /></label>
        <label>Rol<select name="role"><option value="technician">Técnico</option><option value="admin">Administrador</option></select></label>
        <button className="primary-btn" type="submit">Crear usuario</button>
      </form>
    </section>
    <section className="admin-panel"><h2>Respaldo local</h2><p>Descarga un JSON para recuperar esta demo en el mismo u otro navegador. El archivo contiene los datos ficticios y las cuentas locales.</p>
      <div className="admin-backup"><button className="primary-btn" type="button" onClick={download}>Descargar respaldo</button><label>Restaurar respaldo<input type="file" accept="application/json,.json" onChange={upload} /></label></div>
    </section>
    <section className="admin-panel"><h2>Actividad reciente</h2><p>Registro local de cambios; puede alterarse desde las herramientas del navegador.</p>
      {audit.length ? <ol className="admin-audit">{audit.slice(0, 30).map((entry, index) => <li key={`${entry.at}-${index}`}><time>{new Date(entry.at).toLocaleString("es-PE")}</time> · {entry.actor} · {entry.action} · {entry.target}</li>)}</ol> : <p>Aún no hay cambios registrados.</p>}
    </section>
  </main>;
}
