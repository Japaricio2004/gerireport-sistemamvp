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
  const pageWidth = doc.internal.pageSize.getWidth();
  const left = 17;
  const right = pageWidth - left;
  const width = right - left;
  const bottom = 268;
  let y = 0;
  const color = (rgb) => doc.setTextColor(...rgb);
  const forest = [8, 40, 31];
  const green = [12, 122, 92];
  const mint = [229, 242, 234];
  const paper = [250, 251, 249];
  const line = [220, 230, 222];
  const dark = [28, 48, 39];
  const muted = [92, 111, 101];
  const amber = [142, 88, 14];
  const amberBg = [251, 243, 222];
  const split = (text, size, maxWidth, bold = false) => {
    doc.setFont(font, bold ? "bold" : "normal");
    doc.setFontSize(size);
    return doc.splitTextToSize(plain(text) || "Sin registrar", maxWidth);
  };
  function pageHeader(continued = false) {
    doc.setFillColor(...forest);
    doc.rect(0, 0, pageWidth, continued ? 20 : 43, "F");
    doc.setFillColor(...green);
    doc.rect(0, 0, 4, continued ? 20 : 43, "F");
    doc.setFont(font, "bold");
    doc.setFontSize(continued ? 13 : 20);
    color([255, 255, 255]);
    doc.text("GeriReport", left, continued ? 13 : 19);
    doc.setFont(font, "normal");
    doc.setFontSize(7.5);
    color([194, 220, 207]);
    doc.text("REGISTRO DE CUIDADOS", left, continued ? 17 : 26);
    doc.setFont(font, "bold");
    doc.setFontSize(7.5);
    color([255, 255, 255]);
    doc.text(continued ? "INFORME DE ATENCIÓN" : "INFORME DE ATENCIÓN", right, continued ? 9 : 14, { align: "right" });
    doc.setFont(font, "normal");
    doc.setFontSize(7.5);
    color([194, 220, 207]);
    doc.text("Referencia " + plain(report.id), right, continued ? 15 : 21, { align: "right" });
    if (!continued) {
      doc.setFont(font, "bold");
      doc.setFontSize(7);
      color([134, 224, 191]);
      doc.text(report.type === "turno" ? "REPORTE DE TURNO" : "REPORTE MANUAL", left, 36);
      y = 51;
    } else {
      y = 29;
    }
  }
  function ensure(height) {
    if (y + height > bottom) {
      doc.addPage();
      pageHeader(true);
    }
  }
  function section(title, entries, { warning = false } = {}) {
    const firstEntry = entries[0];
    const firstText = firstEntry && typeof firstEntry === "object" ? firstEntry.text || firstEntry.value || "" : firstEntry;
    const firstTime = firstEntry?.time ? 24 : 4;
    const firstLabel = firstEntry?.label ? 3 : 0;
    const firstResponsible = firstEntry?.responsible ? 3.5 : 0;
    const firstHeight = Math.max(8, split(firstText, 8.5, width - firstTime - 4).length * 4 + firstLabel + firstResponsible + 2);
    ensure(15 + firstHeight);
    let currentPage = doc.getNumberOfPages();
    const fill = warning ? amberBg : mint;
    const accent = warning ? amber : green;
    doc.setFillColor(...fill);
    doc.roundedRect(left, y, width, 9, 2, 2, "F");
    doc.setFillColor(...accent);
    doc.roundedRect(left, y, 2, 9, 1, 1, "F");
    doc.setFont(font, "bold");
    doc.setFontSize(8.5);
    color(warning ? amber : forest);
    doc.text(plain(title).toLocaleUpperCase("es-PE"), left + 7, y + 5.9);
    y += 12;
    for (const entry of entries) {
      const time = entry?.time ? String(entry.time) : "";
      const label = entry?.label ? String(entry.label) : "";
      const text = entry && typeof entry === "object" ? entry.text || entry.value || "" : entry;
      const responsible = entry?.responsible ? `Registrado por ${entry.responsible}` : "";
      const textX = left + (time ? 24 : 4);
      const maxWidth = right - textX - 4;
      const lines = split(text, 8.5, maxWidth, false);
      const noteLines = responsible ? split(responsible, 7, maxWidth, false) : [];
      const rowHeight = Math.max(10.5, lines.length * 4.2 + noteLines.length * 3.5 + (label ? 3.5 : 0) + 3);
      if (rowHeight > bottom - 38) {
        const content = [
          ...(label ? [{ text: label, bold: true, size: 8.5, tint: dark }] : []),
          ...lines.map((textLine) => ({ text: textLine, size: 8.5, tint: dark })),
          ...noteLines.map((textLine) => ({ text: textLine, size: 7, tint: muted })),
        ];
        content.forEach((lineContent, index) => {
          const previousPage = doc.getNumberOfPages();
          ensure(7);
          if (doc.getNumberOfPages() !== previousPage) {
            currentPage = doc.getNumberOfPages();
            doc.setFont(font, "bold");
            doc.setFontSize(7);
            color(muted);
            doc.text(`${plain(title)} - continuación`, left, y - 2);
            y += 4;
          }
          const rowTop = y - 3;
          if (entry?.alert) {
            doc.setFillColor(...amberBg);
            doc.roundedRect(left, rowTop, width, 6, 1.2, 1.2, "F");
          } else {
            doc.setDrawColor(...line);
            doc.setLineWidth(0.18);
            doc.line(left + 3, rowTop + 6, right - 3, rowTop + 6);
          }
          if (index === 0 && time) {
            doc.setFont(font, "bold");
            doc.setFontSize(8);
            color(accent);
            doc.text(plain(time), left + 4, y + 1.5);
          }
          doc.setFont(font, lineContent.bold ? "bold" : "normal");
          doc.setFontSize(lineContent.size);
          color(lineContent.tint);
          doc.text(lineContent.text, textX, y + 1.5);
          y += 6;
        });
        y += 1;
        continue;
      }
      ensure(rowHeight);
      if (doc.getNumberOfPages() !== currentPage) {
        currentPage = doc.getNumberOfPages();
        doc.setFont(font, "bold");
        doc.setFontSize(7);
        color(muted);
        doc.text(`${plain(title)} - continuación`, left, y - 2);
      }
      const rowTop = y - 3;
      if (entry?.alert) {
        doc.setFillColor(...amberBg);
        doc.roundedRect(left, rowTop, width, rowHeight, 1.5, 1.5, "F");
      } else {
        doc.setDrawColor(...line);
        doc.setLineWidth(0.18);
        doc.line(left + 3, rowTop + rowHeight, right - 3, rowTop + rowHeight);
      }
      if (time) {
        doc.setFont(font, "bold");
        doc.setFontSize(8);
        color(accent);
        doc.text(plain(time), left + 4, y + 1.5);
      }
      let baseline = y + (label ? 0 : 1.5);
      if (label) {
        doc.setFont(font, "bold");
        doc.setFontSize(8.5);
        color(dark);
        doc.text(plain(label), textX, baseline);
        baseline += 3.5;
      }
      doc.setFont(font, "normal");
      doc.setFontSize(8.5);
      color(dark);
      for (const textLine of lines) {
        doc.text(textLine, textX, baseline);
        baseline += 4.2;
      }
      if (noteLines.length) {
        doc.setFont(font, "normal");
        doc.setFontSize(7);
        color(muted);
        for (const noteLine of noteLines) {
          doc.text(noteLine, textX, baseline);
          baseline += 3.4;
        }
      }
      y = rowTop + rowHeight + 1;
    }
    y += 3;
  }
  pageHeader();
  const patientName = plain(report.patient) || "Paciente sin nombre";
  const patientCondition = plain(report.patientCondition) || "Sin registrar";
  const patientFamily = plain(report.patientFamily) || "Sin registrar";
  const patientCode = plain(report.patientCode) || "Sin registrar";
  const patientLines = split(patientName, 15, width - 12, true);
  const conditionLines = split(patientCondition, 7.5, width * 0.48 - 8);
  const familyLines = split(patientFamily, 7.5, width * 0.48 - 8);
  const cardHeight = 52 + Math.max(0, patientLines.length - 1) * 7 + Math.max(0, Math.max(conditionLines.length, familyLines.length) - 1) * 4;
  ensure(cardHeight);
  doc.setFillColor(...paper);
  doc.setDrawColor(...line);
  doc.setLineWidth(0.3);
  doc.roundedRect(left, y, width, cardHeight, 3, 3, "FD");
  doc.setFont(font, "bold");
  doc.setFontSize(6.8);
  color(green);
  doc.text("PACIENTE", left + 6, y + 8);
  doc.setFont(font, "bold");
  doc.setFontSize(15);
  color(forest);
  doc.text(patientLines, left + 6, y + 16);
  const metaY = y + 25 + Math.max(0, patientLines.length - 1) * 7;
  const cells = [
    ["DNI", report.patientDni || "Sin registrar"],
    ["CÓDIGO", patientCode],
    ["EDAD", report.patientAge ? `${report.patientAge} años` : "Sin registrar"],
  ];
  const cellWidth = (width - 14) / 3;
  cells.forEach(([label, value], index) => {
    const x = left + 6 + index * (cellWidth + 1);
    doc.setFillColor(239, 246, 241);
    doc.roundedRect(x, metaY, cellWidth - 1, 12, 1.5, 1.5, "F");
    doc.setFont(font, "bold");
    doc.setFontSize(6.2);
    color(muted);
    doc.text(label, x + 3, metaY + 4);
    doc.setFont(font, "bold");
    doc.setFontSize(8);
    color(dark);
    doc.text(split(value, 8, cellWidth - 7, true).slice(0, 1), x + 3, metaY + 9.5);
  });
  const detailY = metaY + 17;
  const detailWidth = (width - 14) / 2;
  for (const [index, [label, value]] of [
    ["CONDICIÓN", patientCondition],
    ["FAMILIAR RESPONSABLE", patientFamily],
  ].entries()) {
    const x = left + 6 + index * (detailWidth + 2);
    doc.setFont(font, "bold");
    doc.setFontSize(6.2);
    color(muted);
    doc.text(label, x, detailY);
    doc.setFont(font, "normal");
    doc.setFontSize(7.5);
    color(dark);
    doc.text(split(value, 7.5, detailWidth - 3), x, detailY + 4);
  }
  y += cardHeight + 6;
  const statusColor = summary.status === "Revisar" ? amber : green;
  const summaryCells = [
    ["FECHA", summary.date],
    ["TÉCNICO", report.technician || "Sin registrar"],
    ["TURNO", summary.schedule],
    ["ESTADO", summary.status],
  ];
  const summaryCellWidth = width / 4;
  summaryCells.forEach(([label, value], index) => {
    const x = left + index * summaryCellWidth;
    doc.setFont(font, "bold");
    doc.setFontSize(6.3);
    color(muted);
    doc.text(label, x + 1, y);
    doc.setFont(font, "normal");
    doc.setFontSize(7.5);
    color(label === "ESTADO" ? statusColor : dark);
    doc.text(split(value || "Sin registrar", 7.5, summaryCellWidth - 4).slice(0, 2), x + 1, y + 4.7);
  });
  y += 14;
  if (report.type === "turno") {
    const schedule = `${report.startTime || "--:--"} a ${report.endTime || "--:--"}`;
    section("Horario del turno", [{ label: "Inicio y cierre", value: schedule }]);
  }
  const review = reportReview(report);
  if (review.length) {
    section(`${review.length} ${review.length === 1 ? "registro para revisar" : "registros para revisar"}`, review.map((entry) => ({ time: entry.time, text: entry.reasons.join(" / "), alert: true })), { warning: true });
    ensure(9);
    doc.setFont(font, "normal");
    doc.setFontSize(7);
    color(muted);
    doc.text("Aviso de la demo: verifica el registro con el responsable. No es un diagnóstico ni envía notificaciones.", left + 2, y);
    y += 8;
  }
  if (report.type === "turno") {
    if (!report.records.length)
      section("Registro de atenciones", [{ text: "Este turno se cerró sin registros de atención." }]);
    for (const [type, title] of Object.entries(labels)) {
      const records = report.records.filter((record) => record.type === type);
      if (records.length)
        section(
          title,
          records.map((record) => ({
            time: record.time,
            text: `${type === "food" ? record.title + ": " : ""}${record.detail}${recordReviewReasons(record).length ? " - Para revisar" : ""}`,
            responsible: record.responsible,
            alert: recordReviewReasons(record).length > 0,
          })),
        );
    }
  } else {
    section("Signos vitales", [
      { label: "Presión arterial", value: (report.pressure || "Sin registrar") + " mmHg" },
      { label: "Frecuencia cardíaca", value: (report.heart || "Sin registrar") + " lpm" },
      { label: "Temperatura", value: (report.temp || "Sin registrar") + " °C" },
    ]);
    for (const [title, key] of [
      ["Medicación", "meds"],
      ["Alimentación", "food"],
      ["Incidentes", "incidents"],
    ])
      section(title, [{ text: report[key] || "Sin registrar" }]);
  }
  section("Observaciones generales", [{ text: report.notes || "Sin observaciones adicionales." }]);
  const total = doc.getNumberOfPages();
  for (let page = 1; page <= total; page++) {
    doc.setPage(page);
    doc.setDrawColor(...line);
    doc.setLineWidth(0.25);
    doc.line(left, 281, right, 281);
    doc.setFont(font, "normal");
    doc.setFontSize(6.8);
    color(muted);
    doc.text(
      "GeriReport - Información confidencial de seguimiento de cuidados.",
      left,
      286,
    );
    doc.setFont(font, "bold");
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
