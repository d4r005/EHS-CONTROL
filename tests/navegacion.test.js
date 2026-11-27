// Valida el menú lateral y el despachador de vistas de index.html.
// Sirve de red de seguridad: detecta entradas repetidas o vistas sin ruta,
// que es justo lo que provocó el menú con "Brigadas/Etiquetas" duplicados.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

function bloque(re) {
  const m = html.match(re);
  assert.ok(m, "no se encontró el bloque esperado en index.html");
  return m[0];
}

// VIEWS es un literal JS (sin comillas en las claves): se evalúa aislado.
const viewsSrc = bloque(/const VIEWS=\[[\s\S]*?\n\];/).replace(/^const VIEWS=/, "").replace(/;\s*$/, "");
const VIEWS = new Function("return (" + viewsSrc + ");")();

const TITLES_SRC = bloque(/const TITLES=\{[\s\S]*?\};/);
const dispatchSrc = bloque(/document\.getElementById\('view'\)\.innerHTML=\(\{[\s\S]*?\}\[v\]/);

function clavesDe(fuente) {
  return (fuente.match(/([a-zA-Z]+):(?=\[|v[A-Z])/g) || []).map(s => s.slice(0, -1));
}

const items = VIEWS.flatMap(g => g.items);

test("cada grupo del menú tiene título", () => {
  for (const g of VIEWS) assert.ok(g.g && String(g.g).trim(), "grupo sin nombre");
});

test("no hay entradas de menú repetidas", () => {
  const ids = items.map(i => i.id);
  const repetidos = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepStrictEqual([...new Set(repetidos)], [], "entradas repetidas en VIEWS: " + repetidos.join(", "));
});

test("cada entrada de menú tiene id, texto e icono", () => {
  for (const it of items) {
    assert.match(it.id, /^[a-z]+$/, "id inválido: " + it.id);
    assert.ok(it.t && it.t.trim(), it.id + " sin texto");
    assert.ok(it.ico && it.ico.trim(), it.id + " sin icono");
  }
});

test("cada entrada del menú tiene título de página", () => {
  const titulos = clavesDe(TITLES_SRC);
  const sinTitulo = items.filter(i => !titulos.includes(i.id)).map(i => i.id);
  assert.deepStrictEqual(sinTitulo, [], "sin entrada en TITLES: " + sinTitulo.join(", "));
});

test("cada entrada del menú tiene vista despachada en go()", () => {
  const rutas = clavesDe(dispatchSrc);
  const sinRuta = items.filter(i => !rutas.includes(i.id)).map(i => i.id);
  assert.deepStrictEqual(sinRuta, [], "sin ruta en go(): " + sinRuta.join(", "));
});

test("no hay claves repetidas en TITLES ni en el despachador", () => {
  for (const [nombre, fuente] of [["TITLES", TITLES_SRC], ["go()", dispatchSrc]]) {
    const claves = clavesDe(fuente);
    const repetidas = claves.filter((k, i) => claves.indexOf(k) !== i);
    assert.deepStrictEqual([...new Set(repetidas)], [], "claves repetidas en " + nombre + ": " + repetidas.join(", "));
  }
});

test("las funciones de vista despachadas existen en el archivo", () => {
  const rutas = (dispatchSrc.match(/[a-zA-Z]+:(v[A-Za-z]+)/g) || []).map(s => s.split(":")[1]);
  for (const fn of rutas) {
    assert.ok(new RegExp("function " + fn + "\\s*\\(").test(html), "falta function " + fn);
  }
});
