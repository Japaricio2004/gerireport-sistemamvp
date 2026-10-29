import { resolve } from "node:path";
import { readdirSync, readFileSync } from "node:fs";
import { defineConfig } from "vite";

const page = (path) => resolve(import.meta.dirname, path);

export default defineConfig({
  plugins: [{
    name: "copy-legacy-assets",
    generateBundle() {
      for (const folder of ["js", "img"]) {
        const directory = page(`assets/${folder}`);
        for (const fileName of readdirSync(directory)) {
          this.emitFile({
            type: "asset",
            fileName: `assets/${folder}/${fileName}`,
            source: readFileSync(page(`assets/${folder}/${fileName}`)),
          });
        }
      }
    },
  }],
  build: {
    rollupOptions: {
      input: {
        dashboard: page("index.html"),
        familiarDemo: page("LANDING.html"),
        login: page("pages/login.html"),
        patients: page("pages/pacientes.html"),
        shift: page("pages/turno.html"),
        newReport: page("pages/nuevo-reporte.html"),
        reports: page("pages/reportes.html"),
        reportDetail: page("pages/reporte-detalle.html"),
        followUp: page("pages/seguimiento.html"),
        familyView: page("pages/vista-familiar.html"),
      },
    },
  },
});
