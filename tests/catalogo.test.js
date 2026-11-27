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

test("codigos de normas no repetidos", () => {
  const codigos = NORMAS.map(n => n.codigo);
  assert.strictEqual(new Set(codigos).size, codigos.length);
});

test("tipos de norma son validos", () => {
  const validos = ["seguridad", "salud", "organizacion"];
  for (const n of NORMAS) {
    assert.ok(validos.includes(n.tipo), n.codigo + " tipo invalido");
  }
});

test("estados de vigencia son validos", () => {
  const validos = ["confirmada", "por_validar"];
  for (const n of NORMAS) {
    assert.ok(validos.includes(n.vigencia.estado), n.codigo + " estado invalido");
  }
});

test("cada norma tiene codigo que coincide con su tipo", () => {
  const patron = /^NOM-\d{3}-STPS-\d{4}$/;
  for (const n of NORMAS) {
    if (n.codigo.match(patron)) {
      assert.ok(["seguridad", "salud", "organizacion"].includes(n.tipo),
        n.codigo + " tipo no coincide con patron");
    }
  }
});

test("formato de cada norma tiene items minimos", () => {
  for (const n of NORMAS) {
    assert.ok(n.formato && n.formato.items.length >= 5,
      n.codigo + " formato con pocos items");
  }
});

test("renderFormato produce HTML válido", () => {
  const n = NORMAS[0];
  const ctx = { razonSocial: "SOC EJEMPLO", centro: "OFICINA CENTRAL",
    responsable: "Juan Pérez", area: "Producción", fecha: "2026-11-27" };
  const html = renderFormato(n, ctx);
  assert.ok(html.includes("<h1>"));
  assert.ok(html.includes(n.formato.nombre));
  assert.ok(html.includes(n.codigo));
  assert.ok(!html.includes("<script>"));
});

test("hallazgosDesdeMarcas sin observaciones", () => {
  const n = NORMAS[0];
  const h = hallazgosDesdeMarcas(n, ["nc"], undefined);
  assert.strictEqual(h.length, 1);
  assert.strictEqual(h[0].descripcion, "");
});

test("hallazgosDesdeMarcas con observaciones parciales", () => {
  const n = NORMAS[0];
  const h = hallazgosDesdeMarcas(n, ["nc", "c", "nc"], { 0: "obs1" });
  assert.strictEqual(h.length, 2);
  assert.strictEqual(h[0].descripcion, "obs1");
  assert.strictEqual(h[1].descripcion, "");
});

test("hallazgosDesdeMarcas con observaciones explícitas", () => {
  const n = NORMAS[0];
  const h = hallazgosDesdeMarcas(n, ["nc", "c", "na"], { 0: "observación NC", 2: "obs NC3" });
  assert.strictEqual(h.length, 1);
  assert.strictEqual(h[0].descripcion, "observación NC");
  assert.strictEqual(h[0].norma, n.codigo);
});

test("hallazgosDesdeMarcas sin marcas nc", () => {
  const n = NORMAS[0];
  const h = hallazgosDesdeMarcas(n, ["c", "c", "c"], { 0: "sin nc" });
  assert.strictEqual(h.length, 0);
});

test("hallazgosDesdeMarcas con múltiples nc", () => {
  const n = NORMAS[0];
  const h = hallazgosDesdeMarcas(n, ["nc", "c", "nc"], { 0: "primero", 2: "tercero" });
  assert.strictEqual(h.length, 2);
  assert.strictEqual(h[0].descripcion, "primero");
  assert.strictEqual(h[1].descripcion, "tercero");
});
