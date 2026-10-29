import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import DashboardPage from "./DashboardPage";
import { initialize, keys, demoTasks } from "./data";
import { Store, go, useSaved } from "./store";
import { Modal } from "./components";
import {
  Patients,
  Shift,
  Manual,
  History,
  Detail,
  FollowUp,
  Family,
  Login,
} from "./screens";
import Landing from "./Landing";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";
import { readSession, saveSession, clearSession } from "./auth";
import "./preserved.css";
import "./polish.css";
import "./sidebar.css";
import "./responsive.css";
initialize();
const pages = {
  "/": [DashboardPage, "Dashboard"],
  "/index.html": [DashboardPage, "Dashboard"],
  "/pages/pacientes.html": [Patients, "Pacientes"],
  "/pages/turno.html": [Shift, "Modo turno"],
  "/pages/nuevo-reporte.html": [Manual, "Nuevo reporte"],
  "/pages/reportes.html": [History, "Historial"],
  "/pages/reporte-detalle.html": [Detail, "Detalle del reporte"],
  "/pages/seguimiento.html": [FollowUp, "Seguimiento"],
  "/pages/vista-familiar.html": [Family, "Vista familiar"],
  "/pages/login.html": [Login, "Acceso"],
  "/LANDING.html": [Landing, "Portal familiar"],
};
export function App() {
  const [user, setUser] = useState(readSession);
  const [menuOpen, setMenuOpen] = useState(false);
  const signIn = (account, remember) => {
    saveSession(account, remember);
    setUser(account);
    go("/");
  };
  const signOut = () => {
    clearSession();
    setUser(null);
    go("/pages/login.html");
  };
  const [patients, setPatients] = useSaved(keys.patients, []);
  const [reports, setReports] = useSaved(keys.reports, []);
  const [turn, setTurn] = useSaved(keys.turn, null);
  const [tasks, setTasks] = useSaved(keys.tasks, demoTasks);
  const [url, setUrl] = useState(location.pathname + location.search);
  const [question, setQuestion] = useState(null);
  const ask = (title, message, confirm = true) =>
    new Promise((resolve) => setQuestion({ title, message, confirm, resolve }));
  useEffect(() => {
    const update = () => {
      setUrl(location.pathname + location.search);
      setMenuOpen(false);
    };
    const click = (e) => {
      const a = e.target.closest("a");
      if (
        !a ||
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        a.target ||
        a.hasAttribute("download")
      )
        return;
      const target = new URL(a.href, location.href);
      if (target.origin !== location.origin || target.hash) return;
      e.preventDefault();
      if (target.pathname === "/pages/login.html") {
        signOut();
        return;
      }
      go(target.pathname + target.search);
    };
    window.addEventListener("popstate", update);
    document.addEventListener("click", click);
    return () => {
      window.removeEventListener("popstate", update);
      document.removeEventListener("click", click);
    };
  }, []);
  const [Page, title] = pages[url.split("?")[0]] || [
    () => <a href="/">Volver al panel</a>,
    "Página no encontrada",
  ];
  useEffect(() => {
    document.title = "GeriReport | " + title;
  }, [title]);
  const publicPage = [
    "/pages/login.html",
    "/pages/vista-familiar.html",
    "/LANDING.html",
  ].includes(url.split("?")[0]);
  const needsLogin = !publicPage && !user;
  useEffect(() => {
    if (needsLogin) {
      history.replaceState({}, "", "/pages/login.html");
      setUrl("/pages/login.html");
    }
  }, [needsLogin]);
  const close = (value) => {
    question.resolve(value);
    setQuestion(null);
  };
  return (
    <Store.Provider
      value={{
        user,
        menuOpen,
        setMenuOpen,
        signIn,
        signOut,
        patients,
        setPatients,
        reports,
        setReports,
        turn,
        setTurn,
        tasks,
        setTasks,
        ask,
      }}
    >
      {needsLogin ? (
        <Login />
      ) : !["/pages/login.html", "/LANDING.html"].includes(
          url.split("?")[0],
        ) ? (
        <div
          className="workspace-frame"
          style={!user ? { "--workspace-header-height": "0px" } : undefined}
        >
          <AppHeader section={title} />
          <div className="workspace-layout">
            <Sidebar
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              activePath={url.split("?")[0]}
            />
            <div className="workspace-page">
              <Page key={url} />
            </div>
          </div>
        </div>
      ) : (
        <Page key={url} />
      )}
      {question && (
        <Modal title={question.title} onClose={() => close(false)}>
          <p>{question.message}</p>
          <div className="app-dialog-actions">
            {question.confirm && (
              <button
                className="app-dialog-button secondary"
                onClick={() => close(false)}
              >
                Cancelar
              </button>
            )}
            <button
              className="app-dialog-button primary"
              onClick={() => close(true)}
            >
              {question.confirm ? "Confirmar" : "Entendido"}
            </button>
          </div>
        </Modal>
      )}
    </Store.Provider>
  );
}
if (typeof document !== "undefined")
  createRoot(document.getElementById("root")).render(<App />);
