import React, { useEffect, useRef } from "react";
import { useStore } from "./store";
export default function AppHeader({ section = "Dashboard" }) {
  const { user } = useStore();
  const header = useRef(null);
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    const frame = element.closest(".workspace-frame");
    const resize = () =>
      frame?.style.setProperty(
        "--workspace-header-height",
        element.offsetHeight + "px",
      );
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => {
      observer.disconnect();
      frame?.style.removeProperty("--workspace-header-height");
    };
  }, []);
  if (!user) return null;
  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return (
    <header
      ref={header}
      className="workspace-topbar"
      aria-label="Sesión del técnico"
    >
      <div className="workspace-identity">
        <span className="workspace-logo" aria-hidden="true">
          <i className="fas fa-heart-pulse" />
        </span>
        <div className="workspace-wordmark">
          <strong>GeriReport</strong>
          <span>Gestión de cuidados</span>
        </div>
      </div>
      <div className="workspace-location" aria-label="Sección actual">
        <span>Espacio de trabajo</span>
        <div>
          <i className="fas fa-layer-group" aria-hidden="true" />
          <strong>{section}</strong>
        </div>
      </div>
      <div className="workspace-user">
        <span className="workspace-user-avatar" aria-hidden="true">
          {initials}
        </span>
        <div className="workspace-user-details">
          <strong>{user.name}</strong>
          <span>Técnico de cuidados</span>
        </div>
        <span className="workspace-session">
          <span aria-hidden="true" />
          Sesión activa
        </span>
      </div>
    </header>
  );
}
