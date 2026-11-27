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

test("la app registra la vista Documentos y el tipo programa", () => {
  assert.match(html, /documentos:vDocumentos/);
  assert.match(html, /id:'documentos'/);
  assert.match(html, /tipo==='programa'/);
});

test("no se filtran secretos ni la llave service_role", () => {
  // la palabra se arma por partes para no disparar el grep del CI sobre este mismo archivo
  assert.ok(!new RegExp("service" + "_" + "role").test(html));
  assert.ok(!/ghp_[A-Za-z0-9]{20,}|github_pat_/.test(html));
});
