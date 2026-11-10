import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useStore } from "./store";
const links = [
  ["Inicio", "/index.html", "fa-gauge-high"],
  ["Pacientes", "/pages/pacientes.html", "fa-users"],
  ["Modo Turno", "/pages/turno.html", "fa-clock"],
  ["Nuevo reporte", "/pages/nuevo-reporte.html", "fa-pen-to-square"],
  ["Reportes", "/pages/reportes.html", "fa-file-lines"],
  ["Seguimiento", "/pages/seguimiento.html", "fa-chart-line"],
  ["Vista familiar", "/pages/vista-familiar.html", "fa-eye"],
  ["Cerrar sesión", "/pages/login.html", "fa-arrow-right-from-bracket"],
];
export default function Sidebar({
  open = false,
  onClose,
  activePath = location.pathname,
}) {
  const { user } = useStore();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useLayoutEffect(() => {
    const sidebar = document.getElementById("care-navigation");
    if (!sidebar) return;
    const media = window.matchMedia("(max-width: 760px)");
    const sync = () => sidebar.toggleAttribute("inert", media.matches && !open);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [open]);
  useLayoutEffect(() => {
    if (!open) return;
    const trigger = document.querySelector(
      '[aria-controls="care-navigation"]',
    );
    const previous = document.activeElement;
    const firstLink = document.querySelector("#care-navigation .nav a");
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      trigger?.focus();
      closeRef.current?.();
    };
    const focusTimer = window.setTimeout(() => firstLink?.focus(), 0);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      if (previous?.isConnected) previous.focus();
    };
  }, [open]);
  const current = activePath === "/" ? "/index.html" : activePath;
  return (
    <>
      <aside
        id="care-navigation"
        className={"sidebar care-sidebar" + (open ? " open" : "")}
        aria-label="Menú de GeriReport"
      >
        <nav className="nav" aria-label="Navegación principal">
          {[...links.slice(0, -1), ...(user?.role === "admin" ? [["Usuarios y respaldo", "/pages/usuarios.html", "fa-user-shield"]] : []), links.at(-1)].filter(([, href]) => user?.role === "technician" || !["/pages/turno.html", "/pages/nuevo-reporte.html"].includes(href)).map(([label, href, icon]) => {
            const active =
              current === href ||
              (current === "/pages/reporte-detalle.html" &&
                href === "/pages/reportes.html");
            return (
              <a
                className={active ? "active" : ""}
                aria-current={active ? "page" : undefined}
                href={href}
                key={href}
                onClick={onClose}
              >
                <i className={"fas " + icon} aria-hidden="true" />
                <span>{label}</span>
              </a>
            );
          })}
        </nav>
        {user?.role === "technician" && <div className="sidebar-card" id="sidebarTurnoCard">
          <SidebarTurn />
        </div>}
      </aside>
      {open && (
        <button
          className="care-nav-scrim"
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
        />
      )}
    </>
  );
}
function SidebarTurn() {
  const { turn: storedTurn, user } = useStore();
  const turn = storedTurn?.technician === user?.name ? storedTurn : null;
  return (
    <>
      <div className="shift-card-heading">
        <span className="shift-card-icon" aria-hidden="true">
          <i className={turn ? "fas fa-clock" : "fas fa-calendar-check"} />
        </span>
        <span className="shift-card-caption">Tu turno</span>
        {turn && <span className="shift-card-live">En curso</span>}
      </div>
      <div className="shift-card-copy">
        <strong className="shift-card-title">
          {turn?.patient || "Sin turno activo"}
        </strong>
        <p className="shift-card-description">
          {turn
            ? "Iniciado a las " + turn.startLabel
            : "Elige un paciente para comenzar el registro de cuidados."}
        </p>
      </div>
      <a
        className="shift-card-action"
        href={turn ? "/pages/turno.html" : "/pages/pacientes.html"}
      >
        <span>{turn ? "Continuar turno" : "Elegir paciente"}</span>
        <i className="fas fa-arrow-right" aria-hidden="true" />
      </a>
    </>
  );
}
