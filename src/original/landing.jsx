import React from "react";
import css from "./landing.css?raw";
import theme from "../../assets/css/redesign.css?raw";
import polish from "../polish.css?raw";
import responsive from "../responsive.css?raw";
export default function OriginalTemplate({
  slots = {},
  bindings = {},
  onAction,
  section,
  onNavigate,
  onReport,
}) {
  return (
    <>
      <style>{css}</style>
      <style>{theme}</style>
      <style>{polish}</style>
      <style>{responsive}</style>
      <div className={"app-wrapper"}>
        <div id={"loginScreen"} {...bindings["loginScreen"]}>
          <div className={"login-box"}>
            <div className={"brand-icon"}>
              <i className={"fas fa-heartbeat"}></i>
            </div>
            <h1>{"GeriReport"}</h1>
            <p>{"Acceso para familiares"}</p>
            <form id={"loginForm"} {...bindings["loginForm"]}>
              <div className={"form-group"}>
                <label>
                  <i className={"fas fa-id-card"}></i>
                  {" DNI"}
                </label>
                <input
                  type={"text"}
                  placeholder={"12345678"}
                  defaultValue={"12345678"}
                  required={true}
                />
              </div>
              <div className={"form-group"}>
                <label>
                  <i className={"fas fa-lock"}></i>
                  {" Contraseña"}
                </label>
                <input
                  type={"password"}
                  placeholder={"••••••••"}
                  defaultValue={"123456"}
                  required={true}
                />
              </div>
              <button type={"submit"} className={"btn-primary"}>
                <i className={"fas fa-arrow-right-to-bracket"}></i>
                {" Ingresar"}
              </button>
            </form>
            <div className={"login-footer"}>
              <i className={"fas fa-shield-alt"}></i>
              <span>{"Acceso seguro · Datos protegidos"}</span>
            </div>
          </div>
        </div>

        <div id={"dashboard"} {...bindings["dashboard"]}>
          <div className={"topbar"}>
            <div className={"brand"}>
              <div className={"brand-icon-small"}>
                <i className={"fas fa-heartbeat"}></i>
              </div>
              <h1>{"GeriReport"}</h1>
            </div>
            <div className={"user-area"}>
              <div className={"user-info"}>
                <i className={"fas fa-user-circle"}></i>
                <div>
                  <div className={"name"}>{"María Rodríguez"}</div>
                  <div className={"role"}>{"Familiar"}</div>
                </div>
              </div>
              <button
                className={"btn-logout"}
                id={"logoutBtn"}
                {...bindings["logoutBtn"]}
              >
                <i className={"fas fa-arrow-right-from-bracket"}></i>
              </button>
            </div>
          </div>
          <div className={"dashboard-body"}>
            <nav className={"sidebar"}>
              <button
                data-section={"resumen"}
                className={
                  "nav-item" + (section === "resumen" ? " active" : "")
                }
                onClick={() => onNavigate?.("resumen")}
              >
                <i className={"fas fa-gauge-high"}></i>
                <span>{"Resumen"}</span>
              </button>
              <button
                data-section={"historial"}
                className={
                  "nav-item" + (section === "historial" ? " active" : "")
                }
                onClick={() => onNavigate?.("historial")}
              >
                <i className={"fas fa-clock-rotate-left"}></i>
                <span>{"Historial"}</span>
              </button>
              <button
                data-section={"reporte"}
                className={
                  "nav-item" + (section === "reporte" ? " active" : "")
                }
                onClick={() => onNavigate?.("reporte")}
              >
                <i className={"fas fa-file-lines"}></i>
                <span>{"Reporte"}</span>
              </button>
              <button
                data-section={"alertas"}
                className={
                  "nav-item" + (section === "alertas" ? " active" : "")
                }
                onClick={() => onNavigate?.("alertas")}
              >
                <i className={"fas fa-triangle-exclamation"}></i>
                <span>{"Alertas"}</span>
              </button>
            </nav>
            <div className={"main-content"}>
              <div
                className={"section active"}
                id={"section-resumen"}
                {...bindings["section-resumen"]}
              >
                <div className={"section-header"}>
                  <h2>
                    <i
                      className={"fas fa-heart-pulse"}
                      style={{ color: "#216d5d" }}
                    ></i>
                    {" Resumen del paciente"}
                  </h2>
                  <span className={"sub"}>{"12/09/2026 20:15"}</span>
                </div>
                <div className={"card-grid"}>
                  <div className={"stat-card"}>
                    <div className={"icon-circle"}>
                      <i className={"fas fa-user"}></i>
                    </div>
                    <div className={"label"}>{"Paciente"}</div>
                    <div className={"value"} style={{ fontSize: "1.3rem" }}>
                      {"Juana Mendoza"}
                    </div>
                    <div className={"sub-text"}>
                      {"78 años · Diabetes tipo 2"}
                    </div>
                  </div>
                  <div className={"stat-card"}>
                    <div
                      className={"icon-circle"}
                      style={{ background: "#fef3c7", color: "#d97706" }}
                    >
                      <i className={"fas fa-triangle-exclamation"}></i>
                    </div>
                    <div className={"label"}>{"Alertas activas"}</div>
                    <div className={"value"} style={{ color: "#e53e3e" }}>
                      {"2"}
                    </div>
                    <div className={"sub-text"}>{"Glucosa · Presión"}</div>
                  </div>
                  <div className={"stat-card"}>
                    <div
                      className={"icon-circle"}
                      style={{ background: "#e6ffed", color: "#3a8872" }}
                    >
                      <i className={"fas fa-calendar-check"}></i>
                    </div>
                    <div className={"label"}>{"Último reporte"}</div>
                    <div className={"value"} style={{ fontSize: "1.2rem" }}>
                      {"Hoy 20:15"}
                    </div>
                    <div className={"sub-text"}>{"Técnico: Renzo C."}</div>
                  </div>
                  <div className={"stat-card"}>
                    <div
                      className={"icon-circle"}
                      style={{ background: "#eaf4ef", color: "#216d5d" }}
                    >
                      <i className={"fas fa-chart-line"}></i>
                    </div>
                    <div className={"label"}>{"Tendencia"}</div>
                    <div
                      className={"value"}
                      style={{ fontSize: "1.2rem", color: "#ed8936" }}
                    >
                      {"Estable"}
                    </div>
                    <div className={"sub-text"}>{"Últimos 7 días"}</div>
                  </div>
                </div>

                <div className={"chart-box"}>
                  <div className={"chart-title"}>
                    <h4>
                      <i
                        className={"fas fa-chart-simple"}
                        style={{ color: "#216d5d" }}
                      ></i>
                      {" Evolución de glucosa (mg/dL)"}
                    </h4>
                    <span>{"Última semana"}</span>
                  </div>
                  <div className={"chart-bars"}>
                    <div className={"bar-group"}>
                      <div
                        className={"bar normal"}
                        style={{ height: "40px" }}
                      ></div>
                      <div className={"bar-label"}>{"Lun"}</div>
                      <div className={"bar-value"}>{"125"}</div>
                    </div>
                    <div className={"bar-group"}>
                      <div
                        className={"bar medium"}
                        style={{ height: "55px" }}
                      ></div>
                      <div className={"bar-label"}>{"Mar"}</div>
                      <div className={"bar-value"}>{"145"}</div>
                    </div>
                    <div className={"bar-group"}>
                      <div
                        className={"bar normal"}
                        style={{ height: "45px" }}
                      ></div>
                      <div className={"bar-label"}>{"Mié"}</div>
                      <div className={"bar-value"}>{"130"}</div>
                    </div>
                    <div className={"bar-group"}>
                      <div
                        className={"bar high"}
                        style={{ height: "70px" }}
                      ></div>
                      <div className={"bar-label"}>{"Jue"}</div>
                      <div className={"bar-value"}>{"160"}</div>
                    </div>
                    <div className={"bar-group"}>
                      <div
                        className={"bar normal"}
                        style={{ height: "50px" }}
                      ></div>
                      <div className={"bar-label"}>{"Vie"}</div>
                      <div className={"bar-value"}>{"135"}</div>
                    </div>
                    <div className={"bar-group"}>
                      <div
                        className={"bar high"}
                        style={{ height: "65px" }}
                      ></div>
                      <div className={"bar-label"}>{"Sáb"}</div>
                      <div className={"bar-value"}>{"155"}</div>
                    </div>
                    <div className={"bar-group"}>
                      <div
                        className={"bar high"}
                        style={{ height: "75px" }}
                      ></div>
                      <div className={"bar-label"}>{"Dom"}</div>
                      <div className={"bar-value"}>{"165"}</div>
                    </div>
                  </div>
                  <div className={"chart-legend"}>
                    <span>
                      <span className={"dot dot-green"}></span>
                      {" Normal (70-130)"}
                    </span>
                    <span>
                      <span className={"dot dot-orange"}></span>
                      {" Moderado (131-150)"}
                    </span>
                    <span>
                      <span className={"dot dot-red"}></span>
                      {" Alto (>150)"}
                    </span>
                  </div>
                </div>

                <h4
                  style={{
                    fontSize: "0.9rem",
                    marginBottom: "0.6rem",
                    color: "#29453c",
                  }}
                >
                  <i
                    className={"fas fa-triangle-exclamation"}
                    style={{ color: "#e53e3e" }}
                  ></i>
                  {" Alertas activas"}
                </h4>
                <div className={"alert-list"}>
                  <div className={"alert-item"}>
                    <i className={"fas fa-circle-exclamation alert-icon"}></i>
                    <span className={"alert-text"}>
                      <strong>{"Glucosa elevada:"}</strong>
                      {" 165 mg/dL (normal: 70-130)"}
                    </span>
                    <span className={"alert-time"}>{"Hace 2h"}</span>
                  </div>
                  <div className={"alert-item"}>
                    <i className={"fas fa-circle-exclamation alert-icon"}></i>
                    <span className={"alert-text"}>
                      <strong>{"Presión arterial alta:"}</strong>
                      {" 135/85 mmHg"}
                    </span>
                    <span className={"alert-time"}>{"Hace 4h"}</span>
                  </div>
                </div>

                <h4
                  style={{
                    fontSize: "0.9rem",
                    margin: "1.2rem 0 0.6rem",
                    color: "#29453c",
                  }}
                >
                  <i
                    className={"fas fa-heart"}
                    style={{ color: "#e53e3e" }}
                  ></i>
                  {" Últimos signos vitales"}
                </h4>
                <div className={"vital-grid"}>
                  <div className={"vital-item"}>
                    <div className={"vital-label"}>{"Presión arterial"}</div>
                    <div className={"vital-value"}>{"135/85"}</div>
                    <div className={"vital-unit"}>{"mmHg"}</div>
                  </div>
                  <div className={"vital-item"}>
                    <div className={"vital-label"}>{"Temperatura"}</div>
                    <div className={"vital-value"}>{"37.2"}</div>
                    <div className={"vital-unit"}>{"°C"}</div>
                  </div>
                  <div className={"vital-item"}>
                    <div className={"vital-label"}>{"Saturación O₂"}</div>
                    <div className={"vital-value"}>{"96"}</div>
                    <div className={"vital-unit"}>{"%"}</div>
                  </div>
                  <div className={"vital-item"}>
                    <div className={"vital-label"}>{"Glucosa"}</div>
                    <div className={"vital-value"}>
                      {"165 "}
                      <span className={"vital-alert"}>
                        <i className={"fas fa-triangle-exclamation"}></i>
                      </span>
                    </div>
                    <div className={"vital-unit"}>{"mg/dL"}</div>
                  </div>
                </div>
              </div>

              <div
                className={"section"}
                id={"section-historial"}
                {...bindings["section-historial"]}
              >
                <div className={"section-header"}>
                  <h2>
                    <i
                      className={"fas fa-clock-rotate-left"}
                      style={{ color: "#216d5d" }}
                    ></i>
                    {" Historial de reportes"}
                  </h2>
                  <span className={"sub"}>{"Últimos 30 días"}</span>
                </div>
                <div className={"filter-bar"}>
                  <input type={"text"} placeholder={"Buscar técnico..."} />
                  <select>
                    <option>{"Todos los estados"}</option>
                    <option>{"Normal"}</option>
                    <option>{"Alerta"}</option>
                    <option>{"Crítico"}</option>
                  </select>
                  <input type={"date"} defaultValue={"2026-09-12"} />
                </div>
                <div className={"table-wrap"}>
                  <table>
                    <thead>
                      <tr>
                        <th>{"Fecha"}</th>
                        <th>{"Técnico"}</th>
                        <th>{"Turno"}</th>
                        <th>{"Estado"}</th>
                        <th>{"Resumen"}</th>
                        <th>{"Acción"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{"12/09 20:15"}</td>
                        <td>{"Renzo C."}</td>
                        <td>{"08:00–20:00"}</td>
                        <td>
                          <span className={"badge-status badge-warning"}>
                            {"Alerta"}
                          </span>
                        </td>
                        <td>{"Glucosa 165 mg/dL"}</td>
                        <td>
                          <button
                            className={"btn-ver"}
                            data-report={
                              '{"fecha":"12/09/2026 20:15","tecnico":"Renzo Crisanto","turno":"08:00–20:00","estado":"Alerta","paciente":"Juana Mendoza","presion":"135/85","temp":"37.2","saturacion":"96","glucosa":"165","medicacion":"Losartán 50mg, Metformina 850mg","alimentacion":"Parcial","higiene":"Realizada","sueño":"Normal","incidencia":"Dolor de cabeza leve, se administró paracetamol 500mg. Controlar presión en 2h."}'
                            }
                            onClick={() =>
                              onReport?.({
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
                              })
                            }
                          >
                            {"Ver"}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>{"11/09 19:50"}</td>
                        <td>{"Renzo C."}</td>
                        <td>{"08:00–20:00"}</td>
                        <td>
                          <span className={"badge-status badge-danger"}>
                            {"Crítico"}
                          </span>
                        </td>
                        <td>{"Temp 38.1°C, taquicardia"}</td>
                        <td>
                          <button
                            className={"btn-ver"}
                            data-report={
                              '{"fecha":"11/09/2026 19:50","tecnico":"Renzo Crisanto","turno":"08:00–20:00","estado":"Crítico","paciente":"Juana Mendoza","presion":"150/95","temp":"38.1","saturacion":"92","glucosa":"180","medicacion":"Losartán 50mg, Metformina 850mg, Paracetamol 500mg","alimentacion":"Rechazó","higiene":"Parcial","sueño":"Inquieto","incidencia":"Fiebre alta, se administró paracetamol. Se recomienda evaluación médica urgente."}'
                            }
                            onClick={() =>
                              onReport?.({
                                fecha: "11/09/2026 19:50",
                                tecnico: "Renzo Crisanto",
                                turno: "08:00–20:00",
                                estado: "Crítico",
                                paciente: "Juana Mendoza",
                                presion: "150/95",
                                temp: "38.1",
                                saturacion: "92",
                                glucosa: "180",
                                medicacion:
                                  "Losartán 50mg, Metformina 850mg, Paracetamol 500mg",
                                alimentacion: "Rechazó",
                                higiene: "Parcial",
                                sueño: "Inquieto",
                                incidencia:
                                  "Fiebre alta, se administró paracetamol. Se recomienda evaluación médica urgente.",
                              })
                            }
                          >
                            {"Ver"}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>{"10/09 20:00"}</td>
                        <td>{"Renzo C."}</td>
                        <td>{"08:00–20:00"}</td>
                        <td>
                          <span className={"badge-status badge-success"}>
                            {"Normal"}
                          </span>
                        </td>
                        <td>{"Signos estables"}</td>
                        <td>
                          <button
                            className={"btn-ver"}
                            data-report={
                              '{"fecha":"10/09/2026 20:00","tecnico":"Renzo Crisanto","turno":"08:00–20:00","estado":"Normal","paciente":"Juana Mendoza","presion":"120/80","temp":"36.8","saturacion":"97","glucosa":"120","medicacion":"Losartán 50mg, Metformina 850mg","alimentacion":"Completa","higiene":"Realizada","sueño":"Normal","incidencia":"Sin incidencias. Paciente estable."}'
                            }
                            onClick={() =>
                              onReport?.({
                                fecha: "10/09/2026 20:00",
                                tecnico: "Renzo Crisanto",
                                turno: "08:00–20:00",
                                estado: "Normal",
                                paciente: "Juana Mendoza",
                                presion: "120/80",
                                temp: "36.8",
                                saturacion: "97",
                                glucosa: "120",
                                medicacion: "Losartán 50mg, Metformina 850mg",
                                alimentacion: "Completa",
                                higiene: "Realizada",
                                sueño: "Normal",
                                incidencia:
                                  "Sin incidencias. Paciente estable.",
                              })
                            }
                          >
                            {"Ver"}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>{"09/09 19:30"}</td>
                        <td>{"Renzo C."}</td>
                        <td>{"08:00–20:00"}</td>
                        <td>
                          <span className={"badge-status badge-danger"}>
                            {"Crítico"}
                          </span>
                        </td>
                        <td>{"Hipotensión 90/60"}</td>
                        <td>
                          <button
                            className={"btn-ver"}
                            data-report={
                              '{"fecha":"09/09/2026 19:30","tecnico":"Renzo Crisanto","turno":"08:00–20:00","estado":"Crítico","paciente":"Juana Mendoza","presion":"90/60","temp":"36.2","saturacion":"94","glucosa":"110","medicacion":"Losartán 50mg (suspendido), Metformina 850mg","alimentacion":"Parcial","higiene":"Realizada","sueño":"Normal","incidencia":"Hipotensión, se suspendió Losartán. Se administró líquidos y se monitoreó."}'
                            }
                            onClick={() =>
                              onReport?.({
                                fecha: "09/09/2026 19:30",
                                tecnico: "Renzo Crisanto",
                                turno: "08:00–20:00",
                                estado: "Crítico",
                                paciente: "Juana Mendoza",
                                presion: "90/60",
                                temp: "36.2",
                                saturacion: "94",
                                glucosa: "110",
                                medicacion:
                                  "Losartán 50mg (suspendido), Metformina 850mg",
                                alimentacion: "Parcial",
                                higiene: "Realizada",
                                sueño: "Normal",
                                incidencia:
                                  "Hipotensión, se suspendió Losartán. Se administró líquidos y se monitoreó.",
                              })
                            }
                          >
                            {"Ver"}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>{"08/09 20:10"}</td>
                        <td>{"Renzo C."}</td>
                        <td>{"08:00–20:00"}</td>
                        <td>
                          <span className={"badge-status badge-success"}>
                            {"Normal"}
                          </span>
                        </td>
                        <td>{"Sin novedades"}</td>
                        <td>
                          <button
                            className={"btn-ver"}
                            data-report={
                              '{"fecha":"08/09/2026 20:10","tecnico":"Renzo Crisanto","turno":"08:00–20:00","estado":"Normal","paciente":"Juana Mendoza","presion":"125/82","temp":"36.9","saturacion":"98","glucosa":"128","medicacion":"Losartán 50mg, Metformina 850mg","alimentacion":"Completa","higiene":"Realizada","sueño":"Normal","incidencia":"Paciente estable, sin incidencias."}'
                            }
                            onClick={() =>
                              onReport?.({
                                fecha: "08/09/2026 20:10",
                                tecnico: "Renzo Crisanto",
                                turno: "08:00–20:00",
                                estado: "Normal",
                                paciente: "Juana Mendoza",
                                presion: "125/82",
                                temp: "36.9",
                                saturacion: "98",
                                glucosa: "128",
                                medicacion: "Losartán 50mg, Metformina 850mg",
                                alimentacion: "Completa",
                                higiene: "Realizada",
                                sueño: "Normal",
                                incidencia:
                                  "Paciente estable, sin incidencias.",
                              })
                            }
                          >
                            {"Ver"}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>{"07/09 19:45"}</td>
                        <td>{"María T."}</td>
                        <td>{"08:00–20:00"}</td>
                        <td>
                          <span className={"badge-status badge-warning"}>
                            {"Alerta"}
                          </span>
                        </td>
                        <td>{"Presión 140/90"}</td>
                        <td>
                          <button
                            className={"btn-ver"}
                            data-report={
                              '{"fecha":"07/09/2026 19:45","tecnico":"María Torres","turno":"08:00–20:00","estado":"Alerta","paciente":"Juana Mendoza","presion":"140/90","temp":"37.0","saturacion":"96","glucosa":"140","medicacion":"Losartán 50mg, Metformina 850mg","alimentacion":"Completa","higiene":"Realizada","sueño":"Normal","incidencia":"Presión elevada, se ajustó dosis de Losartán."}'
                            }
                            onClick={() =>
                              onReport?.({
                                fecha: "07/09/2026 19:45",
                                tecnico: "María Torres",
                                turno: "08:00–20:00",
                                estado: "Alerta",
                                paciente: "Juana Mendoza",
                                presion: "140/90",
                                temp: "37.0",
                                saturacion: "96",
                                glucosa: "140",
                                medicacion: "Losartán 50mg, Metformina 850mg",
                                alimentacion: "Completa",
                                higiene: "Realizada",
                                sueño: "Normal",
                                incidencia:
                                  "Presión elevada, se ajustó dosis de Losartán.",
                              })
                            }
                          >
                            {"Ver"}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  style={{
                    marginTop: "0.8rem",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.6rem",
                    fontSize: "0.8rem",
                    color: "#6d8078",
                  }}
                >
                  <span>{"1-6 de 18"}</span>
                  <button
                    className={"btn-outline"}
                    style={{ padding: "0.1rem 0.8rem" }}
                  >
                    {"Siguiente"}
                  </button>
                </div>
              </div>

              <div
                className={"section"}
                id={"section-reporte"}
                {...bindings["section-reporte"]}
              >
                <div className={"section-header"}>
                  <h2>
                    <i
                      className={"fas fa-file-lines"}
                      style={{ color: "#216d5d" }}
                    ></i>
                    {" Reporte completo"}
                  </h2>
                  <span
                    className={"sub"}
                    id={"reporteSub"}
                    {...bindings["reporteSub"]}
                  >
                    {bindings["reporteSub"]?.children ?? (
                      <>{"12/09/2026 · Turno 08–20"}</>
                    )}
                  </span>
                </div>
                <div
                  className={"report-document"}
                  id={"reporteContenido"}
                  {...bindings["reporteContenido"]}
                >
                  {slots["reporteContenido"]}
                </div>
                <div className={"report-actions"}>
                  <button className={"btn-primary small"}>
                    <i className={"fas fa-download"}></i>
                    {" PDF"}
                  </button>
                  <button className={"btn-outline"}>
                    <i className={"fas fa-share-nodes"}></i>
                    {" Compartir"}
                  </button>
                  <button className={"btn-outline"}>
                    <i className={"fas fa-print"}></i>
                    {" Imprimir"}
                  </button>
                </div>
              </div>

              <div
                className={"section"}
                id={"section-alertas"}
                {...bindings["section-alertas"]}
              >
                <div className={"section-header"}>
                  <h2>
                    <i
                      className={"fas fa-triangle-exclamation"}
                      style={{ color: "#e53e3e" }}
                    ></i>
                    {" Historial de alertas"}
                  </h2>
                  <span className={"sub"}>{"Eventos críticos detectados"}</span>
                </div>
                <div className={"filter-bar"}>
                  <select>
                    <option>{"Todos los tipos"}</option>
                    <option>{"Glucosa"}</option>
                    <option>{"Presión"}</option>
                    <option>{"Temperatura"}</option>
                    <option>{"Otros"}</option>
                  </select>
                  <select>
                    <option>{"Todos los estados"}</option>
                    <option>{"Activa"}</option>
                    <option>{"Resuelta"}</option>
                  </select>
                  <input type={"date"} defaultValue={"2026-09-12"} />
                </div>
                <div className={"table-wrap"}>
                  <table>
                    <thead>
                      <tr>
                        <th>{"Fecha"}</th>
                        <th>{"Tipo"}</th>
                        <th>{"Valor crítico"}</th>
                        <th>{"Estado"}</th>
                        <th>{"Reporte asociado"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{"12/09 20:15"}</td>
                        <td>{"Glucosa alta"}</td>
                        <td>{"165 mg/dL"}</td>
                        <td>
                          <span className={"badge-status badge-warning"}>
                            {"Activa"}
                          </span>
                        </td>
                        <td>
                          <button
                            className={"btn-ver"}
                            data-report={
                              '{"fecha":"12/09/2026 20:15","tecnico":"Renzo Crisanto","turno":"08:00–20:00","estado":"Alerta","paciente":"Juana Mendoza","presion":"135/85","temp":"37.2","saturacion":"96","glucosa":"165","medicacion":"Losartán 50mg, Metformina 850mg","alimentacion":"Parcial","higiene":"Realizada","sueño":"Normal","incidencia":"Dolor de cabeza leve, se administró paracetamol 500mg. Controlar presión en 2h."}'
                            }
                            onClick={() =>
                              onReport?.({
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
                              })
                            }
                          >
                            {"Ver reporte"}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>{"12/09 16:30"}</td>
                        <td>{"Presión alta"}</td>
                        <td>{"135/85 mmHg"}</td>
                        <td>
                          <span className={"badge-status badge-warning"}>
                            {"Activa"}
                          </span>
                        </td>
                        <td>
                          <button
                            className={"btn-ver"}
                            data-report={
                              '{"fecha":"12/09/2026 20:15","tecnico":"Renzo Crisanto","turno":"08:00–20:00","estado":"Alerta","paciente":"Juana Mendoza","presion":"135/85","temp":"37.2","saturacion":"96","glucosa":"165","medicacion":"Losartán 50mg, Metformina 850mg","alimentacion":"Parcial","higiene":"Realizada","sueño":"Normal","incidencia":"Dolor de cabeza leve, se administró paracetamol 500mg. Controlar presión en 2h."}'
                            }
                            onClick={() =>
                              onReport?.({
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
                              })
                            }
                          >
                            {"Ver reporte"}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>{"11/09 19:50"}</td>
                        <td>{"Fiebre"}</td>
                        <td>{"38.1 °C"}</td>
                        <td>
                          <span className={"badge-status badge-success"}>
                            {"Resuelta"}
                          </span>
                        </td>
                        <td>
                          <button
                            className={"btn-ver"}
                            data-report={
                              '{"fecha":"11/09/2026 19:50","tecnico":"Renzo Crisanto","turno":"08:00–20:00","estado":"Crítico","paciente":"Juana Mendoza","presion":"150/95","temp":"38.1","saturacion":"92","glucosa":"180","medicacion":"Losartán 50mg, Metformina 850mg, Paracetamol 500mg","alimentacion":"Rechazó","higiene":"Parcial","sueño":"Inquieto","incidencia":"Fiebre alta, se administró paracetamol. Se recomienda evaluación médica urgente."}'
                            }
                            onClick={() =>
                              onReport?.({
                                fecha: "11/09/2026 19:50",
                                tecnico: "Renzo Crisanto",
                                turno: "08:00–20:00",
                                estado: "Crítico",
                                paciente: "Juana Mendoza",
                                presion: "150/95",
                                temp: "38.1",
                                saturacion: "92",
                                glucosa: "180",
                                medicacion:
                                  "Losartán 50mg, Metformina 850mg, Paracetamol 500mg",
                                alimentacion: "Rechazó",
                                higiene: "Parcial",
                                sueño: "Inquieto",
                                incidencia:
                                  "Fiebre alta, se administró paracetamol. Se recomienda evaluación médica urgente.",
                              })
                            }
                          >
                            {"Ver reporte"}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>{"09/09 19:30"}</td>
                        <td>{"Hipotensión"}</td>
                        <td>{"90/60 mmHg"}</td>
                        <td>
                          <span className={"badge-status badge-success"}>
                            {"Resuelta"}
                          </span>
                        </td>
                        <td>
                          <button
                            className={"btn-ver"}
                            data-report={
                              '{"fecha":"09/09/2026 19:30","tecnico":"Renzo Crisanto","turno":"08:00–20:00","estado":"Crítico","paciente":"Juana Mendoza","presion":"90/60","temp":"36.2","saturacion":"94","glucosa":"110","medicacion":"Losartán 50mg (suspendido), Metformina 850mg","alimentacion":"Parcial","higiene":"Realizada","sueño":"Normal","incidencia":"Hipotensión, se suspendió Losartán. Se administró líquidos y se monitoreó."}'
                            }
                            onClick={() =>
                              onReport?.({
                                fecha: "09/09/2026 19:30",
                                tecnico: "Renzo Crisanto",
                                turno: "08:00–20:00",
                                estado: "Crítico",
                                paciente: "Juana Mendoza",
                                presion: "90/60",
                                temp: "36.2",
                                saturacion: "94",
                                glucosa: "110",
                                medicacion:
                                  "Losartán 50mg (suspendido), Metformina 850mg",
                                alimentacion: "Parcial",
                                higiene: "Realizada",
                                sueño: "Normal",
                                incidencia:
                                  "Hipotensión, se suspendió Losartán. Se administró líquidos y se monitoreó.",
                              })
                            }
                          >
                            {"Ver reporte"}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>{"07/09 19:45"}</td>
                        <td>{"Presión alta"}</td>
                        <td>{"140/90 mmHg"}</td>
                        <td>
                          <span className={"badge-status badge-success"}>
                            {"Resuelta"}
                          </span>
                        </td>
                        <td>
                          <button
                            className={"btn-ver"}
                            data-report={
                              '{"fecha":"07/09/2026 19:45","tecnico":"María Torres","turno":"08:00–20:00","estado":"Alerta","paciente":"Juana Mendoza","presion":"140/90","temp":"37.0","saturacion":"96","glucosa":"140","medicacion":"Losartán 50mg, Metformina 850mg","alimentacion":"Completa","higiene":"Realizada","sueño":"Normal","incidencia":"Presión elevada, se ajustó dosis de Losartán."}'
                            }
                            onClick={() =>
                              onReport?.({
                                fecha: "07/09/2026 19:45",
                                tecnico: "María Torres",
                                turno: "08:00–20:00",
                                estado: "Alerta",
                                paciente: "Juana Mendoza",
                                presion: "140/90",
                                temp: "37.0",
                                saturacion: "96",
                                glucosa: "140",
                                medicacion: "Losartán 50mg, Metformina 850mg",
                                alimentacion: "Completa",
                                higiene: "Realizada",
                                sueño: "Normal",
                                incidencia:
                                  "Presión elevada, se ajustó dosis de Losartán.",
                              })
                            }
                          >
                            {"Ver reporte"}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  style={{
                    marginTop: "0.8rem",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.6rem",
                    fontSize: "0.8rem",
                    color: "#6d8078",
                  }}
                >
                  <span>{"1-5 de 12"}</span>
                  <button
                    className={"btn-outline"}
                    style={{ padding: "0.1rem 0.8rem" }}
                  >
                    {"Siguiente"}
                  </button>
                </div>
                <div
                  style={{
                    marginTop: "1rem",
                    background: "#f0f7ff",
                    borderRadius: "1rem",
                    padding: "0.8rem 1.2rem",
                    borderLeft: "4px solid #216d5d",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#29453c",
                      margin: "0",
                    }}
                  >
                    <i
                      className={"fas fa-circle-info"}
                      style={{ color: "#216d5d" }}
                    ></i>
                    <strong>{"¿Qué son las alertas?"}</strong>
                    {
                      ' Son eventos críticos detectados durante los turnos. \n              Puedes ver el reporte completo de cada alerta haciendo clic en "Ver reporte".\n            '
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <nav className={"bottom-nav"}>
            <button
              data-section={"resumen"}
              className={"nav-btn" + (section === "resumen" ? " active" : "")}
              onClick={() => onNavigate?.("resumen")}
            >
              <i className={"fas fa-gauge-high"}></i>
              <span>{"Resumen"}</span>
            </button>
            <button
              data-section={"historial"}
              className={"nav-btn" + (section === "historial" ? " active" : "")}
              onClick={() => onNavigate?.("historial")}
            >
              <i className={"fas fa-clock-rotate-left"}></i>
              <span>{"Historial"}</span>
            </button>
            <button
              data-section={"reporte"}
              className={"nav-btn" + (section === "reporte" ? " active" : "")}
              onClick={() => onNavigate?.("reporte")}
            >
              <i className={"fas fa-file-lines"}></i>
              <span>{"Reporte"}</span>
            </button>
            <button
              data-section={"alertas"}
              className={"nav-btn" + (section === "alertas" ? " active" : "")}
              onClick={() => onNavigate?.("alertas")}
            >
              <i className={"fas fa-triangle-exclamation"}></i>
              <span>{"Alertas"}</span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
