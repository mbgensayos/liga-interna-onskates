/**
 * Recibe las inscripciones del formulario web y las guarda en la hoja de cálculo
 * a la que está vinculado este script (Extensiones → Apps Script).
 *
 * El formulario envía la fila como pares [columna, valor]: si aparece una columna
 * nueva se añade sola, así que cambiar el formulario no obliga a tocar este script.
 */
const HOJA = "Inscripciones";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const fila = [["Marca temporal", new Date()], ...JSON.parse(e.parameter.fila)];
    const hoja = obtenerHoja_();
    const cabeceras = hoja.getLastColumn()
      ? hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0]
      : [];
    const valores = new Array(cabeceras.length).fill("");
    fila.forEach(([columna, valor]) => {
      let i = cabeceras.indexOf(columna);
      if (i === -1) {
        cabeceras.push(columna);
        i = cabeceras.length - 1;
        hoja.getRange(1, i + 1).setValue(columna).setFontWeight("bold");
      }
      // Un texto que empiece por = + - @ se guarda como texto, no como fórmula.
      valores[i] = typeof valor === "string" && /^[=+\-@]/.test(valor) ? "'" + valor : valor;
    });
    hoja.appendRow(valores);
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
    hoja.setFrozenRows(1);
  }
  return hoja;
}
