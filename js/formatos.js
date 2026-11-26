/* Generador de formatos EHS-CONTROL.
 * Uso: const html = EHS.renderFormato(norma, { razonSocial, centro, responsable, area, fecha });
 * Devuelve HTML listo para imprimir en hoja carta. Todo texto se escapa (sin riesgo de XSS).
 */
(function (root) {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  var ESTILO = "@page{size:letter;margin:14mm}" +
    ".f{font:11px/1.35 Arial,sans-serif;color:#000}" +
    ".f h1{font-size:15px;margin:0}.f h2{font-size:12px;margin:10px 0 4px}" +
    ".f table{width:100%;border-collapse:collapse}" +
    ".f th,.f td{border:1px solid #444;padding:4px;vertical-align:top}" +
    ".f th{background:#eee}.f .c{text-align:center;width:34px}" +
    ".f .firmas{display:flex;gap:24px;margin-top:36px}" +
    ".f .firmas div{flex:1;border-top:1px solid #000;text-align:center;padding-top:4px}" +
    ".f .pie{margin-top:12px;font-size:9px;color:#444}";

  function nota(norma) {
    var v = norma.vigencia || {};
    var base = v.estado === "confirmada"
      ? "Vigencia confirmada en fuentes consultadas."
      : "Vigencia pendiente de validar en el DOF.";
    return base + (v.nota ? " " + v.nota : "");
  }

  function renderFormato(norma, ctx) {
    ctx = ctx || {};
    var f = norma.formato;
    var filas = f.items.map(function (it, i) {
      return "<tr><td class='c'>" + (i + 1) + "</td><td>" + esc(it) + "</td>" +
        "<td class='c'>☐</td><td class='c'>☐</td><td class='c'>☐</td>" +
        "<td></td><td></td></tr>";
    }).join("");

    return "<style>" + ESTILO + "</style><div class='f'>" +
      "<table><tr><td><h1>" + esc(f.nombre) + "</h1>" + esc(norma.codigo) + " · " + esc(norma.tema) + "</td>" +
      "<td style='width:150px'>Folio: " + esc(f.id) + "<br>Fecha: " + esc(ctx.fecha) + "</td></tr>" +
      "<tr><td>" + esc(ctx.razonSocial) + " — " + esc(ctx.centro) + "</td><td>Área: " + esc(ctx.area) + "</td></tr></table>" +
      "<h2>Periodicidad: " + esc(f.periodicidad) + "</h2>" +
      "<table><tr><th class='c'>#</th><th>Requisito</th><th class='c'>Cumple</th><th class='c'>No cumple</th>" +
      "<th class='c'>N/A</th><th>Evidencia / referencia</th><th>Observaciones y acción</th></tr>" + filas + "</table>" +
      "<div class='firmas'><div>Elaboró<br>" + esc(ctx.responsable) + "</div><div>Revisó</div><div>Comisión SST / Representante</div></div>" +
      "<div class='pie'>" + esc(nota(norma)) + " Este formato es una guía; el texto oficial de la norma prevalece.</div></div>";
  }

  /* Cada "No cumple" debe convertirse en hallazgo. Recibe marcas por índice: "c" | "nc" | "na". */
  function hallazgosDesdeMarcas(norma, marcas, observaciones) {
    var out = [];
    norma.formato.items.forEach(function (it, i) {
      if (marcas[i] === "nc") {
        out.push({ norma: norma.codigo, formato: norma.formato.id, requisito: it,
          descripcion: (observaciones && observaciones[i]) || "", estado: "abierto" });
      }
    });
    return out;
  }

  var api = { esc: esc, renderFormato: renderFormato, hallazgosDesdeMarcas: hallazgosDesdeMarcas };
  if (typeof module !== "undefined") module.exports = api;
  root.EHS = Object.assign(root.EHS || {}, api);
})(typeof window !== "undefined" ? window : globalThis);
