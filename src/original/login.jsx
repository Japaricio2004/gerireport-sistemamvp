import React from "react";
import css from "./login.css?raw";
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

      <div className={"waves"} aria-hidden={"true"}>
        <svg viewBox={"0 0 1440 320"} preserveAspectRatio={"none"}>
          <path
            fill={"#3a8872"}
            fillOpacity={"0.4"}
            d={
              "M0,160L48,144C96,128,192,96,288,112C384,128,480,192,576,208C672,224,768,192,864,160C960,128,1056,96,1152,112C1248,128,1344,192,1392,224L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            }
          ></path>
          <path
            fill={"#216d5d"}
            fillOpacity={"0.3"}
            d={
              "M0,224L48,208C96,192,192,160,288,176C384,192,480,256,576,256C672,256,768,192,864,176C960,160,1056,192,1152,208C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            }
          ></path>
        </svg>
      </div>
      <main className={"login-container"}>
        <section className={"login-card"}>
          <div className={"brand"}>
            <div className={"brand-icon"}>
              <i className={"fas fa-heartbeat"}></i>
            </div>
            <div className={"brand-text"}>
              <h1>{"GeriReport"}</h1>
              <span>{"Sistema de reportes geriátricos"}</span>
            </div>
          </div>
          <h2>{"Bienvenido, técnico geriatra"}</h2>
          <p>
            {
              "Accede al panel para gestionar pacientes, registrar reportes e incidencias durante tu turno asistencial."
            }
          </p>
          <form
            className={"form"}
            onSubmit={(e) =>
              onAction?.(
                "event.preventDefault(); window.location.href='../index.html';",
                e,
              )
            }
          >
            <div className={"form-group"}>
              <label htmlFor={"email"}>{"Correo institucional"}</label>
              <div className={"input-wrapper"}>
                <i className={"fas fa-envelope"}></i>
                <input
                  type={"email"}
                  id={"email"}
                  placeholder={"tecnico@gerireport.pe"}
                  required={true}
                  name={"email"}
                  {...bindings["email"]}
                />
              </div>
            </div>

            <div className={"form-group"}>
              <label htmlFor={"password"}>{"Contraseña"}</label>
              <div className={"input-wrapper"}>
                <i className={"fas fa-lock"}></i>
                <input
                  type={"password"}
                  id={"password"}
                  placeholder={"••••••••"}
                  required={true}
                  name={"password"}
                  {...bindings["password"]}
                />
              </div>
            </div>

            <div className={"form-options"}>
              <label className={"remember"}>
                <input type={"checkbox"} defaultChecked={true} />
                {" Recordarme\n          "}
              </label>
              <a
                href={"#"}
                onClick={(e) =>
                  onAction?.(
                    "event.preventDefault(); showAppDialog({ title: 'Recuperación de contraseña', message: 'Esta opción no está habilitada en el prototipo.' });",
                    e,
                  )
                }
              >
                {"¿Olvidaste tu contraseña?"}
              </a>
            </div>

            <button className={"primary-btn"} type={"submit"}>
              <i className={"fas fa-arrow-right-to-bracket"}></i>
              {" Ingresar al sistema\n        "}
            </button>
          </form>
          <small className={"muted"}>
            {
              "Acceso de demostración: puedes usar cualquier correo y contraseña."
            }
          </small>
          <small className={"muted"}>
            {"MVP funcional · Registro rápido de reportes geriátricos"}
          </small>
        </section>
      </main>
    </>
  );
}
