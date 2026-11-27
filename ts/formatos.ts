/* Generador de formatos EHS-CONTROL.
 * Uso: import { esc, renderFormato, hallazgosDesdeMarcas, ESTILO, FIRMAS_BASE } from './formatos';
 * Devuelve HTML listo para imprimir en hoja carta. Todo texto se escapa (sin riesgo de XSS).
 */

import { Norma, VigenciaEstado, Formato, DocumentoEstado, Prioridad, Hallazgo } from './types normativas.d.ts';

// --- FIRMAS_BASE: Etiquetas cortas para firmas en los formatos ---
export const FIRMAS_BASE = ['Realizó — Coordinación EHS', 'Revisó — Jefe de área', 'Vo. Bo. — Gerencia'];

// --- ESTILO: Estilos CSS para impresión (tamaño carta, fuente, tabla, firmas) ---
export const ESTILO = `@page{size:letter;margin:14mm}` +
  `.f{font:11px/1.35 Arial,sans-serif;color:#000}` +
  `.f h1{font-size:15px;margin:0}.f h2{font-size:12px;margin:10px 0 4px}` +
  `.f table{width:100%;border-collapse:collapse}` +
  `.f th,.f td{border:1px solid #444;padding:4px;vertical-align:top}` +
  `.f th{background:#eee}.f .c{text-align:center;width:34px}` +
  `.f .firmas{display:flex;gap:24px;margin-top:36px}` +
  `.f .firmas div{flex:1;border-top:1px solid #000;text-align:center;padding-top:4px}` +
  `.f .pie{margin-top:12px;font-size:9px;color:#444}`;

// --- esc: Escape HTML de una cadena (previene XSS) ---
export function esc(s: string | null | undefined): string {
  return String(s == null ? "" : s)
    .replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">")
    .replace(/"/g, """).replace(/'/g, "'");
}

// --- nota: Devuelve un texto de vigencia basado en el estado de la norma ---
function nota(norma: Norma): string {
  const v = norma.vigencia || {};
  const base = v.estado === "confirmada"
    ? "Vigencia confirmada en fuentes consultadas."
    : "Vigencia pendiente de validar en el DOF.";
  return base + (v.nota ? " " + v.nota : "");
}

// --- renderFormato: Renderiza un formato HTML dado una norma y un contexto ---
export function renderFormato(norma: Norma, ctx: {
  razonSocial: string;
  centro: string;
  responsable: string;
  area: string;
  fecha: string;
}): string {
  const f = norma.formato;
  const filas = f.items.map((it, i) =>
    `<tr><td class='c'>${i + 1}</td><td>${esc(it)}</td>` +
    `<td class='c'>☐</td><td class='c'>☐</td><td class='c'>☐</td>` +
    `<td></td><td></td></tr>`
  ).join("");

  return `<style>${ESTILO}</style><div class='f'>` +
    `<table><tr><td><h1>${esc(f.nombre)}</h1>${esc(norma.codigo)} · ${esc(norma.tema)}</td>` +
    `<td style='width:150px'>Folio: ${esc(f.id)}<br>Fecha: ${esc(ctx.fecha)}</td></tr>` +
    `<tr><td>${esc(ctx.razonSocial)} — ${esc(ctx.centro)}</td><td>Área: ${esc(ctx.area)}</td></tr></table>` +
    `<h2>Periodicidad: ${esc(f.periodicidad)}</h2>` +
    `<table><tr><th class='c'>#</th><th>Requisito</th><th class='c'>Cumple</th><th class='c'>No cumple</th>` +
    `<th class='c'>N/A</th><th>Evidencia / referencia</th><th>Observaciones y acción</th></tr>` + filas + "</table>" +
    `<div class='firmas'><div>Elaboró<br>${esc(ctx.responsable)}</div><div>Revisó</div><div>Comisión SST / Representante</div></div>` +
    `<div class='pie'>${esc(nota(norma))} Este formato es una guía; el texto oficial de la norma prevalece.</div></div>`;
}

// --- hallazgosDesdeMarcas: Convierte las marcas "nc" en hallazgos ---
export function hallazgosDesdeMarcas(norma: Norma, marcas: string[], observaciones: { [i: number]: string }): Hallazgo[] {
  const out: Hallazgo[] = [];
  norma.formato.items.forEach((it, i) => {
    if (marcas[i] === "nc") {
      out.push({
        norma: norma.codigo,
        formato: norma.formato.id,
        requisito: it,
        descripcion: (observaciones && observaciones[i]) || "",
        estado: "abierto" as const
      });
    }
  });
  return out;
}