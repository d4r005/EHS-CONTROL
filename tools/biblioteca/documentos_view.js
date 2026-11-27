/* =====================================================================
   DOCUMENTOS: programas, procedimientos, manuales, planes e instructivos
   Texto íntegro de los documentos de la carpeta de referencia (F-SH / D-SH).
   Bloques: {h:título} {p:párrafo} {li:viñeta} {t:[[celdas]]}
   ===================================================================== */
function vDocumentos(){
  const q=(window.__qd||'').trim().toLowerCase();
  const tipo=window.__docTipo||'';
  const list=DOCUMENTOS.filter(d=>{
    if(tipo&&d.k!==tipo) return false;
    if(!q) return true;
    return (d.n+' '+d.c+' '+d.nk+' '+d.k+' '+d.o).toLowerCase().includes(q);
  });
  const tipos=[...new Set(DOCUMENTOS.map(d=>d.k))];
  const chip=(val,label,on)=>`<span class="pill ${on?'ok':'mute'}" style="cursor:pointer" onclick="setDocTipo('${val}')">${label}</span>`;
  const grupos=[...new Set(list.map(d=>d.nk))];
  return `<div class="card pad" style="margin-bottom:14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <input type="text" placeholder="Buscar documento por nombre, código o norma…" value="${esc(window.__qd||'')}" oninput="window.__qd=this.value;document.getElementById('view').innerHTML=vDocumentos()" style="max-width:420px">
      <span class="small muted">${list.length} documentos</span>
      <div style="white-space:nowrap">${chip('','Todos',!tipo)} ${tipos.map(t=>chip(t,t+'s',tipo===t)).join(' ')}</div>
    </div>`+
  (list.length?grupos.map(g=>`<div style="margin-bottom:18px">
      <div style="display:flex;align-items:baseline;gap:9px;margin-bottom:8px"><h3 class="sec" style="margin:0">${esc(g)}</h3><span class="tag">${list.filter(d=>d.nk===g).length}</span></div>
      <div class="grid g3">${list.filter(d=>d.nk===g).map(d=>`<div class="card pad" style="display:flex;flex-direction:column;gap:6px">
        <div style="display:flex;align-items:center;gap:8px"><span class="mono" style="color:var(--accent);font-weight:700;font-size:12px">${esc(d.c)}</span><span class="tag">${esc(d.k)}</span></div>
        <div style="font-weight:600;font-size:13.5px;line-height:1.35">${esc(d.n)}</div>
        <div class="small muted" style="flex:1">${esc(d.p)}</div>
        <div class="small muted">Origen: ${esc(d.o)} · ${docPalabras(d)} palabras</div>
        <div style="display:flex;gap:6px;margin-top:4px"><button class="btn sm primary" onclick="verDocumento('${d.c}')">Leer</button><button class="btn sm" onclick="imprimirDocumento('${d.c}')">Imprimir / PDF</button></div>
      </div>`).join('')}</div></div>`).join(''):'<div class="empty">Sin resultados.</div>');
}
function setDocTipo(t){ window.__docTipo=t; document.getElementById('view').innerHTML=vDocumentos(); }
function docPalabras(d){ let n=0; d.b.forEach(b=>{ const t=b.h||b.p||b.li; if(t) n+=t.split(/\s+/).length; else if(b.t) b.t.forEach(r=>r.forEach(c=>n+=c.split(/\s+/).filter(Boolean).length)); }); return n.toLocaleString('es-MX'); }
function docCuerpoHTML(d){
  let html='',inUl=false;
  const cierra=()=>{ if(inUl){ html+='</ul>'; inUl=false; } };
  d.b.forEach(b=>{
    if(b.li!==undefined){ if(!inUl){ html+='<ul>'; inUl=true; } html+=`<li>${esc(b.li)}</li>`; return; }
    cierra();
    if(b.h!==undefined) html+=`<h2>${esc(b.h)}</h2>`;
    else if(b.p!==undefined) html+=`<p>${esc(b.p)}</p>`;
    else if(b.t){ html+=`<table class="tb"><tbody>${b.t.map((r,i)=>`<tr>${r.map(c=>i===0?`<th>${esc(c)}</th>`:`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`; }
  });
  cierra(); return html;
}
function docHojaHTML(d){
  const co=colorEmp();
  return `<div class="pdoc pdoc-long" style="--co:${co};--co-txt:${textoColor(co)};--co-soft:${tinte(co,.12)}"><div class="sheet">
    <div class="hdr"><img src="${logoSrc()}" alt=""><div class="co"><div class="n">${esc(DB.org.nombre||'')}</div><div class="s">Seguridad y Salud en el Trabajo</div><div class="c">${esc(DB.org.centro||'')}</div></div><div class="rev"><b>${esc(d.c)}</b>Rev. 00</div></div>
    <div class="ctrl"><div><b>Código</b>${esc(d.c)}</div><div><b>Revisión</b>00</div><div><b>Fecha</b>${esc(fdate(hoy()))}</div><div><b>Referencia</b>${esc(d.o)}</div></div>
    <div class="title"><h1>${esc(d.n)}</h1><div class="n">${esc(d.nk)} · ${esc(d.k)}</div></div>
    <div class="dbody">${docCuerpoHTML(d)}</div>
    <div class="sig">${['Elaboró — Coordinación EHS','Revisó — Jefe de área','Autorizó — Gerencia'].map(x=>`<div class="sg"><span class="l"></span><div class="nm"></div><div>${esc(x)}</div></div>`).join('')}</div>
    <div class="foot"><span>Documento controlado · ${esc(d.c)} · Rev. 00</span><span>${esc(DB.org.resp||'')} · ${esc(DB.org.puesto||'')}</span></div>
  </div></div>`;
}
function verDocumento(c){
  const d=DOCUMENTOS.find(x=>x.c===c); if(!d) return;
  VIEW='documento'; renderNav();
  document.getElementById('pageTitle').textContent=d.c;
  document.getElementById('pageSub').textContent=d.n+' · '+d.nk;
  document.getElementById('topActions').innerHTML=`<button class="btn sm" onclick="go('documentos')">← Documentos</button> <button class="btn sm primary" onclick="imprimirDocumento('${d.c}')">Imprimir / PDF</button>`;
  document.getElementById('view').innerHTML=`<div class="sheet-wrap" style="max-height:none"><div class="sheet-zoom" style="zoom:.9">${docHojaHTML(d)}</div></div>`;
  window.scrollTo(0,0);
}
function imprimirDocumento(c){
  const d=DOCUMENTOS.find(x=>x.c===c); if(!d) return;
  document.getElementById('printRoot').innerHTML=docHojaHTML(d);
  window.print();
}
