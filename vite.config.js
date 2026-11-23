import { resolve } from "node:path";
import { defineConfig } from "vite";
const entries = [
  "index.html",
  "LANDING.html",
  "pages/login.html",
  "pages/pacientes.html",
  "pages/turno.html",
  "pages/nuevo-reporte.html",
  "pages/reportes.html",
  "pages/reporte-detalle.html",
  "pages/seguimiento.html",
  "pages/vista-familiar.html",
  "pages/usuarios.html",
];
export default defineConfig({
  build: {
    rollupOptions: {
      input: entries.map((file) => resolve(import.meta.dirname, file)),
      output: {
        manualChunks(id) {
          if (
            /node_modules\/(jspdf|pako|fast-png|iobuffer|@babel|fflate)/.test(
              id.replaceAll("\\", "/"),
            )
          )
            return "pdf";
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id.replaceAll('\\', '/'))) return "vendor";
        },
      },
    },
  },
});
