/* ============================ BRIGADAS ============================ */
/* Brigada de emergencias 2026 (organigrama NAFL / NAF Escobedo) */
const BRIGADA_SEED={fecha:'2026-05-20',elaboro:'Dario Robles',titulo:'Brigada de emergencias',
  miembros:[
  {n:'Eduardo Díaz Oviedo',rol:'Brigadista',area:''},
  {n:'Adelaida Hernández Ciriaco',rol:'Brigadista',area:''},
  {n:'Carlos José Canizales Hernández',rol:'Brigadista',area:''},
  {n:'Salvador Vázquez Madrigal',rol:'Brigadista',area:''},
  {n:'Huynh Le Phuoc Thien',rol:'Brigadista',area:''},
  {n:'Pham Khac Nhu',rol:'Brigadista',area:''},
  {n:'Perla Morales',rol:'Brigadista',area:''},
  {n:'Jorge',rol:'Brigadista',area:''},
  {n:'Andrea Georgina Cortés Cavazos',rol:'Brigadista',area:''},
  {n:'Dong Bin Bin',rol:'Brigadista',area:''},
  {n:'Abraham González De la O',rol:'Brigadista',area:''},
  {n:'Miguel Ángel Duarte Orozco',rol:'Brigadista',area:''},
  {n:'Gregorio Cruz',rol:'Brigadista',area:''}]};
const ROLES=['Jefe de brigada','Coordinador de evacuación','Brigadista','Brigada de primeros auxilios','Brigada contra incendio','Brigada de comunicación','Brigada de búsqueda y rescate'];
function brigada(){ if(!DB.brigadas) DB.brigadas=JSON.parse(JSON.stringify(BRIGADA_SEED)); return DB.brigadas; }
function setBrig(i,k,v){ const b=brigada(); b.miembros[i][k]=v; save(); }
function addBrig(){ const b=brigada(); b.miembros.push({n:'',rol:'Brigadista',area:''}); save(); document.getElementById('view').innerHTML=vBrigadas(); }
function delBrig(i){ const b=brigada(); b.miembros.splice(i,1); save(); document.getElementById('view').innerHTML=vBrigadas(); }
function setBrigMeta(k,v){ const b=brigada(); b[k]=v; save(); }

function vBrigadas(){
  const b=brigada(), m=b.miembros||[];
  const roles=[...new Set(m.map(x=>x.rol||'Brigadista'))];
  const porRol=r=>m.filter(x=>(x.rol||'Brigadista')===r);
  const jefe=m.find(x=>/jefe/i.test(x.rol||''));
  return `<div class="grid g4" style="margin-bottom:14px">
    <div class="card kpi"><div class="lbl">Integrantes</div><div class="val">${m.length}</div><div class="hint">${roles.length} funciones</div></div>
    <div class="card kpi ${jefe?'ok':'warn'}"><div class="lbl">Jefe de brigada</div><div class="val" style="font-size:15px;padding-top:8px">${esc(jefe?jefe.n:'Sin asignar')}</div></div>
    <div class="card kpi"><div class="lbl">Fecha del organigrama</div><div class="val" style="font-size:15px;padding-top:8px">${esc(fdate(b.fecha)||'—')}</div></div>
    <div class="card kpi"><div class="lbl">Elaboró</div><div class="val" style="font-size:15px;padding-top:8px">${esc(b.elaboro||'—')}</div></div>
  </div>
  <div class="card pad" style="margin-bottom:14px">
    <div style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap">
      <label class="fld" style="max-width:260px"><span>Título del organigrama</span><input type="text" value="${esc(b.titulo||'')}" oninput="setBrigMeta('titulo',this.value)"></label>
      <label class="fld" style="max-width:180px"><span>Fecha</span><input type="date" value="${esc(b.fecha||'')}" oninput="setBrigMeta('fecha',this.value)"></label>
      <label class="fld" style="max-width:220px"><span>Elaboró</span><input type="text" value="${esc(b.elaboro||'')}" oninput="setBrigMeta('elaboro',this.value)"></label>
      <button class="btn sm" onclick="imprimirBrigada()" style="margin-left:auto">Imprimir / PDF</button>
    </div>
  </div>
  <div class="card pad" style="margin-bottom:14px">
    <h3 class="sec">Organigrama</h3>
    ${jefe?`<div style="display:flex;justify-content:center;margin:4px 0 14px"><div class="bcard top"><b>${esc(jefe.n)}</b><span>${esc(jefe.rol)}</span></div></div>
      <div style="height:1px;background:var(--line);margin:0 10% 14px"></div>`:''}
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px">
      ${m.filter(x=>x!==jefe).map(x=>`<div class="bcard"><b>${esc(x.n||'(sin nombre)')}</b><span>${esc(x.rol||'Brigadista')}${x.area?' · '+esc(x.area):''}</span></div>`).join('')}
    </div>
  </div>
  <div class="card" style="overflow:auto">
    <div class="subhead" style="padding:10px 14px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:8px">
      <b style="font-size:13px">Integrantes</b><span class="small muted" style="margin-left:auto">Los cambios se guardan solos</span>
    </div>
    <table><thead><tr><th style="min-width:220px">Nombre</th><th style="min-width:190px">Función</th><th style="min-width:150px">Área / puesto</th><th style="width:40px"></th></tr></thead>
    <tbody>${m.map((x,i)=>`<tr>
      <td style="padding:4px"><input type="text" value="${esc(x.n||'')}" oninput="setBrig(${i},'n',this.value)" style="border:0;background:transparent;padding:4px;width:100%"></td>
      <td style="padding:4px"><select onchange="setBrig(${i},'rol',this.value);document.getElementById('view').innerHTML=vBrigadas()" style="width:100%">${ROLES.map(r=>`<option ${x.rol===r?'selected':''}>${esc(r)}</option>`).join('')}</select></td>
      <td style="padding:4px"><input type="text" value="${esc(x.area||'')}" oninput="setBrig(${i},'area',this.value)" style="border:0;background:transparent;padding:4px;width:100%"></td>
      <td style="padding:4px"><button class="btn sm ghost" onclick="delBrig(${i})" title="Quitar">✕</button></td></tr>`).join('')}</tbody></table>
    <div style="padding:10px 14px;border-top:1px solid var(--line)"><button class="btn sm" onclick="addBrig()">+ Agregar integrante</button></div>
  </div>`;
}
function brigadaHojaHTML(){
  const b=brigada(), m=b.miembros||[]; const jefe=m.find(x=>/jefe/i.test(x.rol||''));
  const co=colorEmp();
  return `<div class="pdoc" style="--co:${co};--co-txt:${textoColor(co)};--co-soft:${tinte(co,.12)}"><div class="sheet">
    <div class="hdr"><img src="${logoSrc()}" alt=""><div class="co"><div class="n">${esc(DB.org.nombre||'')}</div><div class="s">Seguridad y Salud en el Trabajo</div><div class="c">${esc(DB.org.centro||'')}</div></div><div class="rev"><b>${esc(b.fecha?b.fecha.slice(0,4):'')}</b>Organigrama</div></div>
    <div class="title"><h1>${esc(b.titulo||'Brigada de emergencias')}</h1><div class="n">Fecha: ${esc(fdate(b.fecha)||'—')} · Elaboró: ${esc(b.elaboro||'—')}</div></div>
    ${jefe?`<div style="display:flex;justify-content:center;margin:14px 0 10px"><div class="bcard top"><b>${esc(jefe.n)}</b><span>${esc(jefe.rol)}</span></div></div><div style="height:1px;background:#111;margin:0 18% 12px"></div>`:''}
    <div class="bgrid">${m.filter(x=>x!==jefe).map(x=>`<div class="bcard"><b>${esc(x.n)}</b><span>${esc(x.rol||'Brigadista')}${x.area?' · '+esc(x.area):''}</span></div>`).join('')}</div>
    <div class="sig" style="margin-top:26px">${['Elaboró — Coordinación EHS','Revisó — Gerencia de planta'].map(x=>`<div class="sg"><span class="l"></span><div class="nm"></div><div>${esc(x)}</div></div>`).join('')}</div>
  </div></div>`;
}
function imprimirBrigada(){ document.getElementById('printRoot').innerHTML=brigadaHojaHTML(); window.print(); }
