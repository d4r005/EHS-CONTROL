// Valida la biblioteca de formatos y documentos incrustada en index.html
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

function extraer(nombre) {
  const m = html.match(new RegExp("const " + nombre + " = (\\[[\\s\\S]*?\\]);\\n"));
  assert.ok(m, "no se encontró " + nombre);
  return JSON.parse(m[1]);
}
const REF = extraer("FORMATOS_REF");
const DOCS = extraer("DOCUMENTOS");

test("formatos nuevos: códigos únicos y con la forma EHS-F-###", () => {
  const cods = REF.map(f => f.c);
  assert.strictEqual(new Set(cods).size, cods.length);
  cods.forEach(c => assert.match(c, /^EHS-F-\d{3}$/));
  const nuevos = cods.map(c => +c.slice(6));
  assert.ok(Math.min(...nuevos) >= 45, "no deben pisar EHS-F-001..044");
});

test("cada formato nuevo trae su contenido según el tipo", () => {
  for (const f of REF) {
    assert.ok(["check", "tabla", "acta", "programa"].includes(f.tipo), f.c);
    assert.ok(f.n && f.nk && f.p && f.frec, f.c + " sin metadatos");
    if (f.tipo === "check") assert.ok(f.sec && f.sec.every(s => s.t && s.it.length), f.c + " check sin puntos");
    if (f.tipo === "programa") assert.ok(f.filas && f.filas.some(r => r.e), f.c + " programa sin filas");
    if (f.tipo === "tabla") assert.ok(f.cols && f.cols.length >= 3, f.c + " tabla sin columnas");
    if (f.tipo === "acta") assert.ok(f.bloques && f.bloques.length, f.c + " acta sin bloques");
  }
});

test("los puntos de cada lista de verificación son únicos dentro de su sección", () => {
  for (const f of REF.filter(x => x.tipo === "check")) {
    for (const s of f.sec) assert.strictEqual(new Set(s.it).size, s.it.length, f.c + " / " + s.t);
  }
});

test("documentos: códigos EHS-D-### únicos, con cuerpo y sin texto vacío", () => {
  const cods = DOCS.map(d => d.c);
  assert.strictEqual(new Set(cods).size, cods.length);
  for (const d of DOCS) {
    assert.match(d.c, /^EHS-D-\d{3}$/);
    assert.ok(d.n && d.nk && d.k && d.o, d.c + " sin metadatos");
    assert.ok(d.b.length >= 5, d.c + " con muy poco contenido");
    for (const b of d.b) {
      const t = b.h ?? b.p ?? b.li;
      if (t !== undefined) assert.ok(String(t).trim().length > 0, d.c + " bloque vacío");
      else assert.ok(Array.isArray(b.t) && b.t.length, d.c + " tabla vacía");
    }
  }
});

test("el manual de primeros auxilios conserva su extensión", () => {
  const d = DOCS.find(x => x.c === "EHS-D-003");
  const palabras = d.b.map(b => b.h ?? b.p ?? b.li ?? "").join(" ").split(/\s+/).length;
  assert.ok(palabras > 9000, "palabras: " + palabras);
});

const C = extraer("FORMATOS_C");
const D = extraer("FORMATOS_D");

test("segundo lote: códigos únicos desde EHS-F-066 y estructura por tipo", () => {
  const cods = C.map(f => f.c);
  assert.strictEqual(new Set(cods).size, cods.length);
  cods.forEach(c => assert.ok(+c.slice(6) >= 66, c));
  for (const f of C) {
    assert.ok(["seleccion", "cuestionario", "tabla"].includes(f.tipo), f.c);
    if (f.tipo === "seleccion") assert.ok(f.sec.length >= 10 && f.sec.every(s => s.it.length), f.c);
    if (f.tipo === "cuestionario") assert.ok(f.preguntas.length >= 15, f.c);
    if (f.tipo === "tabla") assert.ok(f.cols.length >= 8, f.c);
  }
});

test("tercer lote: estudios, diagnóstico, químicos, residuos y EPP", () => {
  const cods = D.map(f => f.c);
  assert.strictEqual(new Set(cods).size, cods.length);
  cods.forEach(c => assert.ok(+c.slice(6) >= 70, c));
  const tipos = new Set(D.map(f => f.tipo));
  ["tabla", "acta", "check"].forEach(t => assert.ok(tipos.has(t), "falta tipo " + t));
  for (const f of D) {
    assert.ok(f.n && f.nk && f.p && f.frec, f.c + " sin metadatos");
    if (f.tipo === "tabla") assert.ok(f.cols.length >= 4, f.c + " tabla corta");
    if (f.tipo === "acta") assert.ok(f.bloques.length >= 5, f.c + " acta sin bloques");
    if (f.tipo === "check") assert.ok(f.sec.every(s => s.it.length >= 3), f.c + " check corto");
  }
  assert.ok(D.some(f => f.c === "EHS-F-073"), "falta el diagnóstico de seguridad y salud");
  assert.ok(D.some(f => f.c === "EHS-F-084"), "falta la minuta de la comisión");
});

test("documentos nuevos: acta UIPC y guía de fluidos", () => {
  const cods = DOCS.map(d => d.c);
  assert.strictEqual(new Set(cods).size, cods.length);
  assert.strictEqual(DOCS.length, 11);
  for (const d of DOCS) {
    assert.ok(d.n && d.nk && d.k && d.p, d.c + " sin metadatos");
    assert.ok(Array.isArray(d.b) && d.b.length >= 4, d.c + " sin contenido");
  }
  assert.ok(cods.includes("EHS-D-010") && cods.includes("EHS-D-011"));
});

test("brigada de emergencias: integrantes sin duplicados", () => {
  const m = html.match(/const BRIGADA_SEED=\{[\s\S]*?\n  miembros:\[([\s\S]*?)\]\};/);
  assert.ok(m, "no se encontró BRIGADA_SEED");
  const nombres = [...m[1].matchAll(/n:'([^']+)'/g)].map(x => x[1]);
  assert.ok(nombres.length >= 13, "integrantes: " + nombres.length);
  assert.strictEqual(new Set(nombres).size, nombres.length);
});

test("no se publican datos personales del reporte de accidente", () => {
  // El reporte real se usó solo como modelo de estructura: no debe viajar con nombres ni lesiones
  for (const dato of ["Palestina", "Ariana", "1008", "antebrazo y mano izquierda"]) {
    assert.ok(!html.includes(dato), "dato personal publicado: " + dato);
  }
});

test("la app registra la vista Documentos, Brigadas y los tipos nuevos", () => {
  assert.match(html, /documentos:vDocumentos/);
  assert.match(html, /id:'documentos'/);
  assert.match(html, /tipo==='programa'/);
  assert.match(html, /brigadas:vBrigadas/);
  assert.match(html, /id:'brigadas'/);
  assert.match(html, /tipo==='seleccion'/);
  assert.match(html, /tipo==='cuestionario'/);
  assert.match(html, /etiquetas:vEtiquetas/);
  assert.match(html, /id:'etiquetas'/);
});

test("no se filtran secretos ni la llave de servicio de Supabase", () => {
  // la palabra de la llave se arma por partes: el grep del CI revisa este mismo archivo
  assert.ok(!new RegExp("service" + "_" + "role").test(html));
  assert.ok(!/ghp_[A-Za-z0-9]{20,}|github_pat_/.test(html));
});
