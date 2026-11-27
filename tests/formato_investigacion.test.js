// Verifica que el formato EHS-F-032 replique el formato NAF de investigación de accidentes.
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function cargarModulo() {
  const ini = html.indexOf('/* ============ Investigación de incidentes y accidentes (EHS-F-032) ============ */');
  const marca = 'window.hoja_investigacion=hojaInvestigacion;';
  const fin = html.indexOf(marca) + marca.length;
  assert.ok(ini > 0 && fin > marca.length, 'no se encontró el módulo de investigación en index.html');
  const bloque = html.slice(ini, fin).replace(marca, '');
  const cuerpo = `
    const DB={org:{nombre:'Empresa',centro:'Centro',resp:'R',puesto:'P'}};
    const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    function fdate(v){ if(!v) return ''; const m=/^(\\d{4})-(\\d{2})-(\\d{2})$/.exec(v); return m?(m[3]+'/'+m[2]+'/'+m[1]):v; }
    function logoSrc(){ return 'data:image/png;base64,AA'; }
    function colorEmp(){ return '#0b1a4a'; }
    function rgbDe(h){ h=h.replace('#',''); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; }
    function tinte(h,a){ const [r,g,b]=rgbDe(h); const m=v=>Math.round(255-(255-v)*a); return 'rgb('+m(r)+','+m(g)+','+m(b)+')'; }
    function textoColor(){ return '#111'; }
    function doc_(){ return null; }
    function save(){}
    ${bloque}
    return { hojaInvestigacion, vInv, invTablas, INV_TABLAS };
  `;
  return new Function(cuerpo)();
}

const api = cargarModulo();
const base = () => ({
  id: 'x1', c: 'EHS-F-032', n: 'Investigación de incidentes y accidentes de trabajo', nk: 'ISO 45001:2018',
  f: { folio: 'EHS-F-032-001', fecha: '2026-04-09', fechaHora: '09/04/2026 23:40', sucursal: 'Sucursal Escobedo',
       lesionado: 'Ariana Denisse Palestina Rodríguez', testigos: 'Elideth Gregorio', numEmp: '1008',
       depto: 'Producción', descripcion: 'Atrapamiento con los rodillos de la máquina de pegado trasero.',
       gerente: 'Jinsong Zhao', investigador: 'Dario Robles', fechaGerente: '2026-04-10', fechaInvestigador: '2026-04-10',
       ca_procIgnorado: 'limpieza con la máquina encendida' },
  sel: { 'lugar:habitual': true, 'clas:manual': true, 'fac:humano': true, 'ca:procIgnorado': true },
  tv: api.invTablas()
});

test('la hoja incluye las secciones del formato original', () => {
  const h = api.hojaInvestigacion(base(), {});
  const secciones = [
    'Datos generales', 'Número de control', 'Fecha y hora del accidente', 'Sucursal',
    'Equipo de investigación', 'Detalles', 'Nombre del lesionado', 'Nombre de los testigos',
    'No. de empleado', 'Departamento / área', 'Horario del turno', 'Fecha de contratación y antigüedad',
    'Lugar del accidente', 'Parte del cuerpo afectada', 'prueba de drogas',
    'Descripción detallada del accidente', 'Clasificación de accidentes',
    'Maquinaria involucrada', 'Número de serie', 'Cronología de los eventos',
    'Análisis de causa raíz', 'causas contributivas', 'Metodología 5 porqués',
    'Persona / agencia notificada', 'métodos de trabajo', 'seguimiento y supervisión',
    'Acciones de contención', 'Acciones correctivas y preventivas', 'Fotos, documentos clave',
    'Declaración de la persona empleada', 'Declaración del testigo',
    'Gerente de la sucursal', 'Investigador principal'
  ];
  const faltan = secciones.filter(s => !h.toLowerCase().includes(s.toLowerCase()));
  assert.deepStrictEqual(faltan, [], 'faltan secciones en la hoja: ' + faltan.join(', '));
});

test('la hoja imprime los datos capturados y los checkboxes marcados', () => {
  const d = base();
  const h = api.hojaInvestigacion(d, {});
  assert.match(h, /Ariana Denisse Palestina Rodríguez/);
  assert.match(h, /Atrapamiento con los rodillos/);
  assert.match(h, /09\/04\/2026/);
  assert.match(h, /Procedimiento \/ reglas ignoradas: <b>Sí<\/b>: limpieza con la máquina encendida/);
  assert.match(h, /Jinsong Zhao/);
});

test('la hoja se divide en tres páginas', () => {
  const h = api.hojaInvestigacion(base(), {});
  assert.strictEqual((h.match(/class="inv-p2"/g) || []).length, 2, 'deben existir 2 saltos de página');
});

test('el editor permite capturar cada tabla del formato', () => {
  const e = api.vInv(base(), {});
  const tablas = ['Equipo de investigación', 'Cronología de los eventos', 'Metodología 5 porqués',
    'Acciones de contención', 'Acciones correctivas y preventivas', 'Fotos, documentos y evidencias',
    'Declaración de la persona empleada', 'Declaración del testigo'];
  const faltan = tablas.filter(t => !e.includes(t));
  assert.deepStrictEqual(faltan, [], 'faltan tablas en el editor: ' + faltan.join(', '));
  assert.ok((e.match(/<input/g) || []).length > 100, 'el editor debe tener los campos del formato');
});

test('la definición del formato usa la hoja de investigación', () => {
  const i = html.indexOf("{c:'EHS-F-032'");
  const def = html.slice(i, i + 600);
  assert.match(def, /hoja:'investigacion'/, 'EHS-F-032 debe imprimir con hoja_investigacion');
  assert.match(html, /window\.hoja_investigacion=hojaInvestigacion;/, 'falta registrar la hoja en window');
});
