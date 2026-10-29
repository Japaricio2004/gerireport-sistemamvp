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
        if (e.target === ref.current) onClose();
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
