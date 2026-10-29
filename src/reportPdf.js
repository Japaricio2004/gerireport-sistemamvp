import { jsPDF } from "jspdf";
import { summarizeReport, reportReview, recordReviewReasons } from "./data.js";

const labels = {
  vitals: "Signos vitales",
  medication: "Medicación",
  food: "Alimentación",
  sleep: "Sueño",
  hygiene: "Higiene",
  wellbeing: "Bienestar",
  incident: "Incidentes",
};
// Built-in PDF fonts cover Spanish; omit emoji glyphs unsupported by those fonts.
const plain = (value) =>
  String(value ?? "")
    .replace(/₂/g, "2")
    .replace(/[^\u0020-\u00ff\n]/g, "")
    .trim();
export function buildReportPdf(report, fonts = null) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  if (fonts) {
    for (const style of ["normal", "bold"]) {
      const file = `Montserrat-${style}.ttf`;
      doc.addFileToVFS(file, fonts[style]);
      doc.addFont(file, "Montserrat", style);
    }
  }
  const font = fonts ? "Montserrat" : "helvetica";
  const summary = summarizeReport(report);
  const left = 18,
    right = 192,
    bottom = 272,
    width = right - left;
  let y = 0;
  const color = (rgb) => doc.setTextColor(...rgb);
  const green = [33, 109, 93],
    dark = [37, 58, 52],
    muted = [98, 118, 109];
  function pageHeader(continued = false) {
    doc.setFont(font, "bold");
    doc.setFontSize(continued ? 14 : 24);
    color(green);
    doc.text("GeriReport", left, 23);
    doc.setFont(font, "normal");
    doc.setFontSize(8);
    color(muted);
    doc.text("REGISTRO DE CUIDADOS", left, 29);
    doc.text("INFORME DE ATENCIÓN", right, 22, { align: "right" });
    doc.text("Referencia: " + plain(report.id), right, 28, { align: "right" });
    doc.setDrawColor(...green);
    doc.setLineWidth(0.6);
    doc.line(left, 34, right, 34);
    y = 43;
  }
  function ensure(height) {
    if (y + height > bottom) {
      doc.addPage();
      pageHeader(true);
    }
  }
  function paragraph(
    text,
    { size = 10, indent = 0, bold = false, tint = dark } = {},
  ) {
    doc.setFont(font, bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(
      plain(text) || "Sin registrar",
      width - indent,
    );
    const lineHeight = size * 0.48;
    for (const line of lines) {
      ensure(lineHeight);
      doc.setFont(font, bold ? "bold" : "normal");
      doc.setFontSize(size);
      color(tint);
      doc.text(line, left + indent, y);
      y += lineHeight;
    }
    y += 2;
  }
  function section(title, entries) {
    ensure(20);
    doc.setFillColor(239, 246, 242);
    doc.rect(left, y - 4, width, 9, "F");
    paragraph(title, { bold: true, size: 11, tint: green });
    y += 3;
    for (const entry of entries) paragraph(entry);
    y += 4;
  }
  pageHeader();
  paragraph(report.type === "turno" ? "REPORTE DE TURNO" : "REPORTE MANUAL", {
    size: 8,
    tint: green,
  });
  paragraph(report.patient, { size: 19, bold: true });
  paragraph("Fecha: " + summary.date, { size: 9, tint: muted });
  paragraph("Técnico: " + (report.technician || "Sin registrar"), {
    size: 9,
    tint: muted,
  });
  paragraph("Turno: " + summary.schedule + "   |   Estado: " + summary.status, {
    size: 9,
    tint: muted,
  });
  y += 5;
  const review = reportReview(report);
  if (review.length) {
    section(
      `${review.length} ${review.length === 1 ? "registro para revisar" : "registros para revisar"}`,
      review.map(
        (entry) =>
          `${entry.time ? entry.time + " - " : ""}${entry.reasons.join(" / ")}`,
      ),
    );
    paragraph(
      "Avisos de la demo para verificar registros; no son un diagnóstico ni envían notificaciones.",
      { size: 8, tint: muted },
    );
    y += 3;
  }
  if (report.type === "turno") {
    if (!report.records.length)
      section("Registro de atenciones", [
        "Este turno se cerró sin registros de atención.",
      ]);
    for (const [type, title] of Object.entries(labels)) {
      const records = report.records.filter((record) => record.type === type);
      if (records.length)
        section(
          title,
          records.map(
            (record) =>
              `${record.time}  -  ${type === "food" ? record.title + ": " : ""}${record.detail}${recordReviewReasons(record).length ? " [Revisar]" : ""}`,
          ),
        );
    }
  } else {
    section("Signos vitales", [
      "Presión arterial: " + (report.pressure || "Sin registrar"),
      "Frecuencia cardíaca: " + (report.heart || "Sin registrar"),
      "Temperatura: " + (report.temp || "Sin registrar"),
    ]);
    for (const [title, key] of [
      ["Medicación", "meds"],
      ["Alimentación", "food"],
      ["Incidentes", "incidents"],
    ])
      section(title, [report[key] || "Sin registrar"]);
  }
  section("Observaciones generales", [
    report.notes || "Sin observaciones adicionales.",
  ]);
  const total = doc.getNumberOfPages();
  for (let page = 1; page <= total; page++) {
    doc.setPage(page);
    doc.setDrawColor(215, 227, 220);
    doc.setLineWidth(0.25);
    doc.line(left, 281, right, 281);
    doc.setFont(font, "normal");
    doc.setFontSize(7);
    color(muted);
    doc.text(
      "GeriReport - Información confidencial de seguimiento de cuidados.",
      left,
      286,
    );
    doc.text(`${page} / ${total}`, right, 286, { align: "right" });
  }
  doc.setProperties({
    title: "GeriReport - " + plain(report.patient),
    subject: "Registro de cuidados",
    creator: "GeriReport",
  });
  return doc;
}
let fontPromise;
async function loadFonts() {
  return (fontPromise ||= Promise.all(
    [
      new URL("../assets/fonts/Montserrat-Regular.ttf", import.meta.url),
      new URL("../assets/fonts/Montserrat-Bold.ttf", import.meta.url),
    ].map(async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Font could not be loaded");
      const bytes = new Uint8Array(await response.arrayBuffer());
      let binary = "";
      for (const byte of bytes) binary += String.fromCharCode(byte);
      return btoa(binary);
    }),
  )
    .then(([normal, bold]) => ({ normal, bold }))
    .catch((error) => {
      fontPromise = null;
      throw error;
    }));
}
export async function downloadReportPdf(report) {
  const name = report.patient
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .slice(0, 65);
  const fonts = await loadFonts();
  buildReportPdf(report, fonts).save(`GeriReport-${name}-${report.id}.pdf`);
}
