import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createServer } from "vite";
import { createServer as createHttpServer } from "node:http";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
// Fixtures were captured from the pre-migration Git version, before JSX conversion.
const voidTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);
const dynamicIds = new Set([
  "patientGrid",
  "sidebarTurnoCard",
  "timeline",
  "summaryContent",
  "livePreview",
  "reportsList",
  "reportSheet",
  "familyCard",
  "reporteContenido",
  "patient",
  "patientFilter",
  "familyPatientSelect",
]);
function structure(html) {
  const nodes = [];
  let skip = 0;
  for (const match of html
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .matchAll(/<(\/?)([a-z][\w:-]*)\b([^>]*)>/gi)) {
    const [, closing, tag, attrs] = match;
    if (closing) {
      if (skip && !voidTags.has(tag)) skip--;
      continue;
    }
    if (skip) {
      if (!voidTags.has(tag)) skip++;
      continue;
    }
    const className = attrs.match(/\bclass="([^"]*)"/)?.[1] || "";
    const id = attrs.match(/\bid="([^"]*)"/)?.[1];
    nodes.push([tag, className]);
    if (dynamicIds.has(id) || className === "kanban") skip = 1;
  }
  return nodes;
}
test("original screen CSS and DOM layout are preserved during React conversion", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: { server: createHttpServer() } },
    appType: "custom",
  });
  try {
    for (const name of [
      "pacientes",
      "turno",
      "nuevo-reporte",
      "reportes",
      "reporte-detalle",
      "seguimiento",
      "vista-familiar",
      "login",
      "landing",
    ]) {
      const baseline = JSON.parse(
        await readFile(
          new URL("./fixtures/" + name + ".json", import.meta.url),
          "utf8",
        ),
      );
      const css = await readFile(
        new URL("../src/original/" + name + ".css", import.meta.url),
        "utf8",
      );
      assert.equal(
        createHash("sha256").update(css).digest("hex"),
        baseline.cssSha256,
        name + " original CSS",
      );
      const { default: Template } = await server.ssrLoadModule(
        "/src/original/" + name + ".jsx",
      );
      assert.deepEqual(
        structure(
          renderToStaticMarkup(
            React.createElement(Template, { section: "resumen" }),
          ),
        ),
        baseline.structure,
        name + " original layout",
      );
    }
  } finally {
    await server.close();
  }
});
