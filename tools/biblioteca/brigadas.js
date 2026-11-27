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
/* colores del organigrama original: una columna por color */
const BRIG_COL=['#00B050','#00B0F0','#FFCC00','#C00000'];
function brigada(){ if(!DB.brigadas) DB.brigadas=JSON.parse(JSON.stringify(BRIGADA_SEED)); return DB.brigadas; }
function setBrig(i,k,v){ const b=brigada(); b.miembros[i][k]=v; save(); }
function addBrig(){ const b=brigada(); b.miembros.push({n:'',rol:'Brigadista',area:''}); save(); document.getElementById('view').innerHTML=vBrigadas(); }
function delBrig(i){ const b=brigada(); b.miembros.splice(i,1); save(); document.getElementById('view').innerHTML=vBrigadas(); }
function setBrigMeta(k,v){ const b=brigada(); b[k]=v; save(); }

function vBrigadas(){
  const b=brigada(), m=b.miembros||[];
  const jefe=m.filter(x=>/jefe/i.test(x.rol||''));
  const resto=m.filter(x=>!/jefe/i.test(x.rol||''));
  const color=(i)=>BRIG_COL[i%BRIG_COL.length];
  return `<div class="grid g4" style="margin-bottom:14px">
    <div class="card kpi"><div class="lbl">Integrantes</div><div class="val">${m.length}</div><div class="hint">${new Set(m.map(x=>x.rol||'Brigadista')).size} funciones</div></div>
    <div class="card kpi ${jefe.length?'ok':'warn'}"><div class="lbl">Jefe de brigada</div><div class="val" style="font-size:15px;padding-top:8px">${esc(jefe[0]?jefe[0].n:'Sin asignar')}</div></div>
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
    <div class="brig-banner"><div><b>${esc((b.titulo||'Brigada de emergencias').toUpperCase())}</b><span>${esc(DB.org.nombre||'')}</span></div>
      <div class="brig-meta">Fecha: ${esc(fdate(b.fecha)||'—')}<br>Elaborado por: ${esc(b.elaboro||'—')}</div></div>
    ${jefe.length?`<div class="brig-jefe">${jefe.map((x,k)=>`<div class="bcard top" style="--bc:${color(0)}"><span>${esc(x.rol)}</span><b>${esc(x.n)}</b></div>`).join('')}</div>`:''}
    <div class="brig-grid">
      ${resto.map((x,i)=>`<div class="bcard" style="--bc:${color(i%4)}"><span>${esc(x.rol||'Brigadista')}</span><b>${esc(x.n||'(sin nombre)')}</b></div>`).join('')}
    </div>
    <div class="brig-leyenda">${BRIG_COL.map(c=>`<i style="background:${c}"></i>`).join('')} Colores del organigrama original</div>
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

/* Hoja imprimible: replica el organigrama del PPTX (4 columnas de color, banner y logos) */
function brigadaHojaHTML(){
  const b=brigada(), m=b.miembros||[];
  const jefe=m.filter(x=>/jefe/i.test(x.rol||''));
  const resto=m.filter(x=>!/jefe/i.test(x.rol||''));
  const color=i=>BRIG_COL[i%BRIG_COL.length];
  const co=colorEmp();
  const tarj=(x,i,extra)=>`<div class="og-card${extra?' top':''}" style="background:${color(i)}">
    <div class="og-ph"></div><div class="og-tx"><span>${esc(x.rol||'Brigadista')}</span><b>${esc(x.n||'')}</b></div></div>`;
  return `<div class="pdoc ogdoc" style="--co:${co};--co-txt:${textoColor(co)};--co-soft:${tinte(co,.12)}"><div class="sheet">
    <div class="og-top">
      <img class="og-logo" src="${logoSrc()}" alt="">
      <div class="og-banner"><b>${esc((b.titulo||'Brigada de emergencias').toUpperCase())}</b><span>${esc(DB.org.nombre||'')}</span></div>
      <div class="og-meta">Fecha: ${esc(fdate(b.fecha)||'—')}<br>Elaborado por: ${esc(b.elaboro||'—')}</div>
    </div>
    ${jefe.length?`<div class="og-jefe">${jefe.map((x,k)=>tarj(x,0,true)).join('')}</div>`:''}
    <div class="og-grid">${resto.map((x,i)=>tarj(x,i)).join('')}</div>
    <div class="og-pie"><span>${esc(DB.org.centro||'')}</span><span>Brigada de emergencias · NOM-002-STPS-2010</span></div>
  </div></div>`;
}
function imprimirBrigada(){ document.getElementById('printRoot').innerHTML=brigadaHojaHTML(); window.print(); }
