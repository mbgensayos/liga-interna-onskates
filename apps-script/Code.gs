/**
 * Recibe las inscripciones del formulario web y las guarda en la hoja de cálculo
 * a la que está vinculado este script (Extensiones → Apps Script).
 */
const HOJA = "Inscripciones";
const CABECERAS = [
  "Marca temporal",
  "Nombre y apellidos del patinador/a",
  "Fecha de nacimiento",
  "Federado:",
  "¿Has participado en alguna liga en la temporada 2025?",
  "Modalidad a la que te presentas:",
  "¿Quieres presentarte a la categoria profesional (maxima categoría) o amateur (iniciación)?",
  "Classic",
  "Battle",
  "Derrapes",
  "Speed",
  "Salto",
];
const MODALIDADES = ["Classic", "Battle", "Derrapes", "Speed", "Salto"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = e.parameter;
    const hoja = obtenerHoja_();
    const elegidas = String(p.modalidades || "").split(",").map((m) => m.trim());
    hoja.appendRow([
      new Date(),
      p.nombre || "",
      p.fechaNacimiento || "",
      p.federado || "",
      p.ligaAnterior || "",
      p.modalidades || "",
      p.categoria || "",
      // Una columna por modalidad para filtrar fácilmente cada lista de inscritos.
      ...MODALIDADES.map((m) => (elegidas.includes(m) ? "Sí" : "")),
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function obtenerHoja_() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(HOJA);
    hoja.appendRow(CABECERAS);
    hoja.setFrozenRows(1);
    hoja.getRange(1, 1, 1, CABECERAS.length).setFontWeight("bold");
  }
  return hoja;
}
