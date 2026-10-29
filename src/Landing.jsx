import React, { useState } from "react";
import Template from "./original/landing";
const initialReport = {
  fecha: "12/09/2026 20:15",
  tecnico: "Renzo Crisanto",
  turno: "08:00–20:00",
  estado: "Alerta",
  paciente: "Juana Mendoza",
  presion: "135/85",
  temp: "37.2",
  saturacion: "96",
  glucosa: "165",
  medicacion: "Losartán 50mg, Metformina 850mg",
  alimentacion: "Parcial",
  higiene: "Realizada",
  sueño: "Normal",
  incidencia:
    "Dolor de cabeza leve, se administró paracetamol 500mg. Controlar presión en 2h.",
};
function Document({ report: r }) {
  return (
    <>
      <div className="doc-header">
        <div className="doc-title">
          <i className="fas fa-heartbeat" style={{ color: "#216d5d" }} />{" "}
          GeriReport
        </div>
        <div className="doc-meta">Reporte del {r.fecha}</div>
      </div>
      <div className="doc-patient">
        {[
          ["Paciente:", r.paciente],
          ["Edad:", "78 años"],
          ["DNI:", "12345678"],
          ["Técnico:", r.tecnico],
        ].map(([label, value]) => (
          <div className="field" key={label}>
            <strong>{label}</strong> <span>{value}</span>
          </div>
        ))}
      </div>
      <div className="section-block">
        <h4>Signos vitales</h4>
        <div className="grid-2">
          {[
            ["Presión", r.presion + " mmHg"],
            ["Temperatura", r.temp + " °C"],
            ["Saturación", r.saturacion + "%"],
            ["Glucosa", r.glucosa + " mg/dL"],
          ].map(([label, value]) => (
            <div className="item" key={label}>
              <span className="label">{label}</span>
              <span className="value">
                {value}{" "}
                {label === "Glucosa" && r.estado !== "Normal" && (
                  <span className="alert-tag">{r.estado}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="section-block">
        <h4>Medicación</h4>
        <div className="grid-2">
          {r.medicacion.split(",").map((m) => (
            <div className="item" key={m}>
              <span className="label">{m.trim()}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="section-block">
        <h4>Bienestar diario</h4>
        <div className="grid-2">
          {[
            ["Alimentación", r.alimentacion],
            ["Higiene", r.higiene],
            ["Sueño", r.sueño],
          ].map(([label, value]) => (
            <div className="item" key={label}>
              <span className="label">{label}</span>
              <span className="value">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="section-block">
        <h4>Incidencias</h4>
        <p
          style={{
            fontSize: ".85rem",
            background: "#f4f7fc",
            padding: ".6rem 1rem",
            borderRadius: 10,
            margin: 0,
          }}
        >
          {r.incidencia}
        </p>
      </div>
      <div className="doc-footer">
        <div>
          <i className="fas fa-check-circle" style={{ color: "#3a8872" }} />{" "}
          Validado
        </div>
        <div>Firma: técnico</div>
      </div>
    </>
  );
}
export default function Landing() {
  const [logged, setLogged] = useState(false);
  const [section, setSection] = useState("resumen");
  const [report, setReport] = useState(initialReport);
  const bindings = {
    loginScreen: { className: logged ? "hidden" : "" },
    dashboard: { className: logged ? "active" : "" },
    loginForm: {
      onSubmit: (e) => {
        e.preventDefault();
        setLogged(true);
      },
    },
    logoutBtn: {
      onClick: () => {
        setLogged(false);
        setSection("resumen");
      },
    },
    reporteSub: { children: report.fecha + " · Turno " + report.turno },
  };
  for (const id of ["resumen", "historial", "reporte", "alertas"])
    bindings["section-" + id] = {
      className: "section" + (section === id ? " active" : ""),
    };
  return (
    <Template
      bindings={bindings}
      slots={{ reporteContenido: <Document report={report} /> }}
      section={section}
      onNavigate={setSection}
      onReport={(r) => {
        setReport(r);
        setSection("reporte");
      }}
    />
  );
}
