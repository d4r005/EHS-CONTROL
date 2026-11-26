const test = require("node:test");
const assert = require("node:assert");
const { NORMAS } = require("../data/normas.js");
const { renderFormato, hallazgosDesdeMarcas, esc } = require("../js/formatos.js");

test("codigos y folios únicos", () => {
  const cods = NORMAS.map(n => n.codigo), ids = NORMAS.map(n => n.formato.id);
  assert.strictEqual(new Set(cods).size, cods.length);
  assert.strictEqual(new Set(ids).size, ids.length);
});

test("estructura mínima de cada norma", () => {
  for (const n of NORMAS) {
    assert.match(n.codigo, /^NOM-\d{3}(-\d)?-STPS-\d{4}$/, n.codigo);
    assert.ok(["seguridad", "salud", "organizacion"].includes(n.tipo), n.codigo);
    assert.ok(["confirmada", "por_validar"].includes(n.vigencia.estado), n.codigo);
    assert.ok(n.formato.items.length >= 5, n.codigo + " con pocos requisitos");
  }
});

test("normas sustituidas llevan su nota", () => {
  const por = c => NORMAS.find(n => n.codigo === c);
  assert.ok(por("NOM-017-STPS-2024").vigencia.nota.includes("2008"));
  assert.ok(por("NOM-006-STPS-2023").vigencia.nota.includes("2014"));
  assert.ok(por("NOM-005-STPS-1998").vigencia.nota.includes("2025"));
});

test("el render escapa HTML", () => {
  const html = renderFormato(NORMAS[0], { razonSocial: "<script>x</script>" });
  assert.ok(!html.includes("<script>x"));
  assert.strictEqual(esc("a&b"), "a&amp;b");
});

test("No cumple genera hallazgo", () => {
  const h = hallazgosDesdeMarcas(NORMAS[0], ["c", "nc", "na"], { 1: "charco" });
  assert.strictEqual(h.length, 1);
  assert.strictEqual(h[0].descripcion, "charco");
});
