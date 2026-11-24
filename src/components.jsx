import React, { useEffect, useRef, useId } from "react";
export function Modal({ title, children, onClose }) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement;
    ref.current.showModal();
    return () => previous?.isConnected && previous.focus();
  }, []);
  return (
    <dialog
      ref={ref}
      className="react-dialog"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target !== ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        )
          onClose();
      }}
    >
      <div className="section-heading">
        <h2 id={titleId}>{title}</h2>
        <button className="secondary-btn" aria-label="Cerrar" onClick={onClose}>
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Field({
  label,
  name,
  options,
  type = "text",
  required = false,
  ...props
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {options ? (
        <select name={name} required={required} {...props}>
          {options.map((o) => (
            <option key={o} value={o}>
              {o || "Seleccionar paciente"}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea name={name} required={required} {...props} />
      ) : (
        <input name={name} type={type} required={required} {...props} />
      )}
    </label>
  );
}
export function Status({ value }) {
  return (
    <span
      className={
        "patient-status " +
        (["Revisar", "Alerta", "Crítico"].includes(value)
          ? "patient-status-alert"
          : "")
      }
    >
      {value}
    </span>
  );
}
export function Timeline({ records = [] }) {
  return (
    <div className="timeline">
      {!records.length && <p>Aún no hay registros en este turno.</p>}
      {records.map((r) => (
        <article
          className={"record " + (r.alert ? "record-alert" : "")}
          key={r.id}
        >
          <small>{r.time}</small>
          <div>
            <strong>
              {r.icon} {r.title} {r.alert && "· Atención"}
            </strong>
            <p>{r.detail}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function VitalTrendsCard({ patientName, reports }) {
  const trends = reports && patientName ? 
    require("./data").compareVitalTrends(patientName, reports) : null;
  
  if (!trends || trends.recordsCount < 2) {
    return (
      <div className="vital-trends-empty">
        <p className="muted">
          <i className="fas fa-info-circle"></i> Se necesitan al menos 2 registros de signos vitales para mostrar tendencias.
        </p>
      </div>
    );
  }
  
  const getTrendClass = (trend) => {
    if (trend === "improving") return "trend-improving";
    if (trend === "worsening") return "trend-worsening";
    return "trend-stable";
  };
  
  return (
    <div className="vital-trends">
      <h4>📊 Evolución de Signos Vitales</h4>
      <p className="trends-subtitle">Últimos {trends.recordsCount} registros</p>
      
      <div className="trend-item">
        <div className="trend-label">
          <span>Presión Arterial</span>
          <span className="trend-current-value">{trends.pressure.latest}</span>
        </div>
        <div className="trend-history">
          {trends.pressure.history.slice(0, 3).map((val, i) => (
            <span key={i} className={i === 0 ? "current" : "old"}>{val}</span>
          ))}
        </div>
        <div className={`trend-status ${getTrendClass(trends.pressure.systolic.trend)}`}>
          <i className={`fas ${trends.pressure.systolic.icon}`}></i>
          <span>{trends.pressure.systolic.label}</span>
        </div>
      </div>
      
      <div className="trend-item">
        <div className="trend-label">
          <span>Frecuencia Cardíaca</span>
          <span className="trend-current-value">{trends.heart.latest} lpm</span>
        </div>
        <div className="trend-history">
          {trends.heart.history.slice(0, 3).map((val, i) => (
            <span key={i} className={i === 0 ? "current" : "old"}>{val}</span>
          ))}
        </div>
        <div className={`trend-status ${getTrendClass(trends.heart.trend)}`}>
          <i className={`fas ${trends.heart.icon}`}></i>
          <span>{trends.heart.label}</span>
        </div>
      </div>
      
      <div className="trend-item">
        <div className="trend-label">
          <span>Temperatura</span>
          <span className="trend-current-value">{trends.temp.latest} °C</span>
        </div>
        <div className="trend-history">
          {trends.temp.history.slice(0, 3).map((val, i) => (
            <span key={i} className={i === 0 ? "current" : "old"}>{val}</span>
          ))}
        </div>
        <div className={`trend-status ${getTrendClass(trends.temp.trend)}`}>
          <i className={`fas ${trends.temp.icon}`}></i>
          <span>{trends.temp.label}</span>
        </div>
      </div>
      
      <div className="trend-item">
        <div className="trend-label">
          <span>SpO₂</span>
          <span className="trend-current-value">{trends.spo2.latest}%</span>
        </div>
        <div className="trend-history">
          {trends.spo2.history.slice(0, 3).map((val, i) => (
            <span key={i} className={i === 0 ? "current" : "old"}>{val}</span>
          ))}
        </div>
        <div className={`trend-status ${getTrendClass(trends.spo2.trend)}`}>
          <i className={`fas ${trends.spo2.icon}`}></i>
          <span>{trends.spo2.label}</span>
        </div>
      </div>
    </div>
  );
}

export function StatsWidget({ icon, label, value, change, variant = "default", link }) {
  const getVariantClass = () => {
    if (variant === "alert") return "stat-widget-alert";
    if (variant === "success") return "stat-widget-success";
    return "stat-widget-default";
  };
  
  const content = (
    <>
      <div className="stat-icon">
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {change && <span className="stat-change">{change}</span>}
      </div>
    </>
  );
  
  if (link) {
    return (
      <a href={link} className={`stat-widget ${getVariantClass()}`}>
        {content}
      </a>
    );
  }
  
  return (
    <div className={`stat-widget ${getVariantClass()}`}>
      {content}
    </div>
  );
}
