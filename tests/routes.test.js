import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { createServer as createHttpServer } from "node:http";
import React from "react";
import { renderToString } from "react-dom/server";
test("all original routes render React screens including saved shift and report", async () => {
  const values = new Map();
  globalThis.localStorage = {
    getItem: (k) => values.get(k) ?? null,
    setItem: (k, v) => values.set(k, String(v)),
  };
  localStorage.setItem(
    "gerireport_session",
    JSON.stringify({
      id: "test-technician",
      name: "Ana Martínez",
      email: "ana@example.test",
    }),
  );
  const server = await createServer({
    server: { middlewareMode: true, hmr: { server: createHttpServer() } },
    appType: "custom",
  });
  try {
    const { App } = await server.ssrLoadModule("/src/main.jsx");
    let referenceSidebar;
    for (const [path, expected] of [
      ["/", "Inicio"],
      ["/pages/login.html", "Usuario"],
      ["/pages/pacientes.html", "Nuevo paciente"],
      ["/pages/turno.html", "Sin turno activo"],
      ["/pages/nuevo-reporte.html", "Vista previa"],
      ["/pages/reportes.html", "Restablecer demo"],
      ["/pages/seguimiento.html", "Control de presión"],
      ["/pages/vista-familiar.html", "Último reporte"],
      ["/LANDING.html", "Acceso para familiares"],
      ["/pages/reporte-detalle.html", "Reporte de turno"],
    ]) {
      globalThis.location = {
        pathname: path,
        search: path.includes("reporte-detalle") ? "?id=2" : "",
      };
      const html = renderToString(React.createElement(App));
      if (path === "/pages/nuevo-reporte.html") {
        assert.ok(
          html.includes('for="heart"'),
          "manual heart field has an associated label",
        );
        assert.match(
          html,
          /<input[^>]*id="heart"[^>]*type="number"|<input[^>]*type="number"[^>]*id="heart"/,
        );
      }
      if (!["/pages/login.html", "/LANDING.html"].includes(path)) {
        const sidebar = html.match(
          /<aside[^>]*care-sidebar[^>]*>[\s\S]*?<\/aside>/,
        )?.[0];
        assert.ok(sidebar, path + " uses the shared sidebar");
        assert.equal(
          (html.match(/<aside[^>]*care-sidebar/g) || []).length,
          1,
          path + " has only one sidebar",
        );
        assert.ok(
          html.indexOf('class="workspace-layout"') <
            html.indexOf("care-sidebar") &&
            html.indexOf("care-sidebar") <
              html.indexOf('class="workspace-page"'),
          path + " sidebar is outside the changing page layout",
        );
        assert.ok(sidebar.includes("Cerrar sesión"), path + " offers sign-out");
        assert.ok(
          sidebar.includes("shift-card-action"),
          path + " uses the same shift card",
        );
        const normalized = sidebar
          .replace(/ class="(?:active)?"/g, "")
          .replace(/ aria-current="page"/g, "");
        if (referenceSidebar)
          assert.equal(
            normalized,
            referenceSidebar,
            path + " matches dashboard sidebar",
          );
        else referenceSidebar = normalized;
      }
      if (path === "/pages/login.html") {
        const content = html.replace(/<style[\s\S]*?<\/style>/g, "");
        assert.ok(
          !content.includes("Crear cuenta"),
          "demo login has no registration",
        );
        assert.ok(
          content.includes("Gestión de cuidados de los pacientes"),
          "login identifies the patient-care purpose",
        );
      }
      if (path === "/pages/pacientes.html") {
        assert.ok(
          html.indexOf("Buscar paciente") < html.indexOf("Tu red de cuidados"),
          "patient search appears before secondary summary metrics",
        );
      }
      if (path === "/pages/reporte-detalle.html") {
        assert.ok(
          html.includes('aria-label="Estado del turno: Requiere revisión"'),
          "shift report status is explicit and accessible",
        );
      }
      if (
        ![
          "/pages/login.html",
          "/pages/vista-familiar.html",
          "/LANDING.html",
        ].includes(path)
      ) {
        assert.ok(
          html.includes("Ana Martínez"),
          "signed-in technician is visible",
        );
        assert.ok(
          html.indexOf("workspace-topbar") < html.indexOf('class="sidebar'),
          "identity header precedes sidebar",
        );
      }
      assert.ok(
        html
          .replace(/<style[\s\S]*?<\/style>/g, "")
          .replace(/<!--.*?-->/g, "")
          .includes(expected),
        path,
      );
    }
    localStorage.setItem(
      "gerireport_active_turno",
      JSON.stringify({
        patient: "Paciente de prueba",
        dateLabel: "28/10/2026",
        startLabel: "08:00",
        technician: "Demo",
        records: [
          {
            id: 1,
            time: "09:00",
            title: "Prueba",
            detail: "Registro persistido",
            type: "wellbeing",
          },
        ],
      }),
    );
    globalThis.location = { pathname: "/pages/turno.html", search: "" };
    assert.ok(
      renderToString(React.createElement(App)).includes("Registro persistido"),
    );
    globalThis.location = {pathname:'/pages/vista-familiar.html',search:'?paciente=no-existe'};
    assert.ok(renderToString(React.createElement(App)).includes('El paciente del enlace no está disponible.'));
    localStorage.setItem("gerireport_patients", "[]");
    globalThis.location = {
      pathname: "/pages/vista-familiar.html",
      search: "",
    };
    assert.ok(
      renderToString(React.createElement(App)).includes(
        "No hay pacientes disponibles",
      ),
    );
  } finally {
    await server.close();
  }
});
