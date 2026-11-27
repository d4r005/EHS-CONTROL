// Evita que el catálogo de data/normas.js se vuelva a desfasar del que usa la app.
// El CI y build.js se apoyan en data/normas.js: si una NOM existe en index.html
// pero no aquí, queda fuera de toda validación.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const raiz = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(raiz, "index.html"), "utf8");
const { NORMAS } = require(path.join(raiz, "data", "normas.js"));

const RE_NOM = /^NOM-\d{3}(-\d)?-STPS-\d{4}$/;

function catalogoDeLaApp() {
  const m = html.match(/const NORMAS = \[[\s\S]*?\n\];/);
  assert.ok(m, "no se encontró el catálogo NORMAS en index.html");
  const src = m[0].replace(/^const NORMAS = /, "").replace(/;\s*$/, "");
  return new Function("return (" + src + ");")();
}

const APP = catalogoDeLaApp();
const appNom = APP.map(n => n.k).filter(k => RE_NOM.test(k));
const dataNom = NORMAS.map(n => n.codigo);

test("toda NOM de la app está en data/normas.js", () => {
  const faltan = appNom.filter(k => !dataNom.includes(k));
  assert.deepStrictEqual(faltan, [], "faltan en data/normas.js: " + faltan.join(", "));
});

test("data/normas.js no tiene NOM que la app no muestre", () => {
  const sobran = dataNom.filter(k => !appNom.includes(k));
  assert.deepStrictEqual(sobran, [], "sobran en data/normas.js: " + sobran.join(", "));
});

test("cada NOM de data/normas.js cumple la forma y trae al menos 5 requisitos", () => {
  for (const n of NORMAS) {
    assert.match(n.codigo, RE_NOM, n.codigo);
    assert.ok(n.formato && n.formato.id && n.formato.nombre, n.codigo + " sin formato");
    assert.ok(n.formato.items.length >= 5, n.codigo + " con menos de 5 requisitos");
  }
});

test("data/normas.json está regenerado (corre node build.js)", () => {
  const json = JSON.parse(fs.readFileSync(path.join(raiz, "data", "normas.json"), "utf8"));
  assert.strictEqual(json.length, NORMAS.length, "normas.json desfasado en número de normas");
  assert.deepStrictEqual(json.map(n => n.codigo), dataNom, "normas.json desfasado en contenido; corre node build.js");
});
