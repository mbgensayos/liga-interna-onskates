/**
 * Recibe las inscripciones del formulario web, las guarda en la hoja de cálculo
 * a la que está vinculado este script (Extensiones → Apps Script) y envía un correo
 * de confirmación al patinador/a y otro de aviso a OnSkates.
 *
 * El formulario envía la fila como pares [columna, valor]: si aparece una columna
 * nueva se añade sola, así que cambiar el formulario no obliga a tocar este script.
 */
const HOJA = "Inscripciones";
const CORREO_ONSKATES = "info@escuelaonskates.com";

function doPost(e) {
  const p = e.parameter;
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    guardarFila_(JSON.parse(p.fila));
  } finally {
    lock.releaseLock();
  }
  enviarCorreos_(p);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function guardarFila_(paresFormulario) {
  const fila = [["Marca temporal", new Date()], ...paresFormulario];
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

function enviarCorreos_(p) {
  const email = String(p.email || "").trim();
  const nombre = String(p.nombre || "").trim();
  const resumen = p.resumen ? JSON.parse(p.resumen) : [];
  const tabla = tablaHtml_(resumen);

  // Aviso a OnSkates: si falla, no impide la confirmación al patinador/a.
  try {
    MailApp.sendEmail({
      to: CORREO_ONSKATES,
      subject: "Nueva inscripción Liga Interna: " + nombre,
      htmlBody: "<p>Nueva inscripción en la Liga Interna OnSkates 2026:</p>" + tabla,
      replyTo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : CORREO_ONSKATES,
      name: "Liga Interna OnSkates",
    });
  } catch (err) {
    console.error("Aviso a OnSkates: " + err);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
  MailApp.sendEmail({
    to: email,
    subject: "Inscripción recibida · Liga Interna OnSkates 2026",
    htmlBody:
      '<div style="font-family:Arial,sans-serif;color:#333;max-width:560px">' +
      '<h2 style="color:#000;margin:0 0 12px">¡Inscripción recibida!</h2>' +
      "<p>Hola, hemos recibido la inscripción de <strong>" + escapar_(nombre) +
      "</strong> en la Liga Interna OnSkates 2026.</p>" +
      tabla +
      '<p style="margin-top:20px"><strong>Día de la liga:</strong> lunes 2 de noviembre de 2026.<br>' +
      "<strong>Inscripción:</strong> 5 €, que se cobrarán a través de la app de SportMember.<br>" +
      "Habrá entrega de medallas.</p>" +
      "<p>Si algún dato no es correcto, responde a este correo.</p>" +
      '<p style="color:#004B67"><strong>OnSkates</strong></p></div>',
    replyTo: CORREO_ONSKATES,
    name: "OnSkates",
  });
}

function tablaHtml_(pares) {
  const filas = pares.map(([k, v]) =>
    '<tr><td style="padding:6px 12px 6px 0;color:#666">' + escapar_(k) +
    '</td><td style="padding:6px 0"><strong>' + escapar_(v) + "</strong></td></tr>"
  ).join("");
  return '<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">' + filas + "</table>";
}

function escapar_(texto) {
  return String(texto).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}
