/* ============================ ETIQUETAS ============================ */
const PICTOS=[['corrosivo','Corrosivo'],['toxico','Tóxico'],['inflamable','Inflamable'],['oxidante','Oxidante'],
  ['irritante','Irritante'],['nocivo','Nocivo'],['presion','Gas a presión'],['salud','Peligro para la salud'],['ambiente','Peligroso para el ambiente']];
const RESID=['C','R','E','T','I'];
function etiqueta(){
  if(!DB.etiqueta) DB.etiqueta={tipo:'sustancia',nombre:'',cas:'',senal:'',h:'',p:'',fab:'',pictos:{},
    res:'',car:{},area:'',cant:'',fecha:'',control:'',empresa:''};
  return DB.etiqueta;
}
function setEt(k,v){ const e=etiqueta(); e[k]=v; save(); pintarEtiqueta(); }
function setEtCar(k){ const e=etiqueta(); e.car=e.car||{}; e.car[k]=!e.car[k]; save(); pintarEtiqueta(); }
function setEtPicto(k){ const e=etiqueta(); e.pictos=e.pictos||{}; e.pictos[k]=!e.pictos[k]; save(); pintarEtiqueta(); }
function vEtiquetas(){
  const e=etiqueta(), esSus=e.tipo!=='residuo';
  return `<div class="grid g2" style="align-items:start">
  <div class="card pad">
    <div style="display:flex;gap:6px;margin-bottom:12px">
      <button class="btn sm ${esSus?'primary':''}" onclick="setEt('tipo','sustancia')">Sustancia química</button>
      <button class="btn sm ${!esSus?'primary':''}" onclick="setEt('tipo','residuo')">Residuo peligroso</button>
    </div>
    ${esSus?`
      <label class="fld"><span>Nombre del químico</span><input type="text" value="${esc(e.nombre||'')}" oninput="setEt('nombre',this.value)"></label>
      <label class="fld"><span>CAS</span><input type="text" value="${esc(e.cas||'')}" oninput="setEt('cas',this.value)"></label>
      <label class="fld"><span>Palabra señal</span><input type="text" value="${esc(e.senal||'')}" oninput="setEt('senal',this.value)"></label>
      <label class="fld"><span>Códigos H (peligros)</span><textarea rows="2" oninput="setEt('h',this.value)">${esc(e.h||'')}</textarea></label>
      <label class="fld"><span>Códigos P (consejos de prudencia)</span><textarea rows="3" oninput="setEt('p',this.value)">${esc(e.p||'')}</textarea></label>
      <label class="fld"><span>Fabricante y dirección</span><textarea rows="2" oninput="setEt('fab',this.value)">${esc(e.fab||'')}</textarea></label>
      <div class="fld"><span>Pictogramas</span>
        <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:4px">
          ${PICTOS.map(([k,l])=>`<button class="btn sm" onclick="setEtPicto('${k}')" style="${(e.pictos||{})[k]?'background:var(--danger-bg);border-color:#fecaca;font-weight:600':''}">${(e.pictos||{})[k]?'☑':'☐'} ${esc(l)}</button>`).join('')}
        </div>
      </div>`:`
      <label class="fld"><span>Nombre del residuo peligroso</span><input type="text" value="${esc(e.res||'')}" oninput="setEt('res',this.value)"></label>
      <div class="fld"><span>Característica de peligrosidad</span>
        <div style="display:flex;gap:5px;margin-top:4px">
          ${RESID.map(c=>`<button class="btn sm" onclick="setEtCar('${c}')" style="${(e.car||{})[c]?'background:var(--danger-bg);border-color:#fecaca;font-weight:700':''}">${c}</button>`).join('')}
        </div>
      </div>
      <label class="fld"><span>Área de generación</span><input type="text" value="${esc(e.area||'')}" oninput="setEt('area',this.value)"></label>
      <label class="fld"><span>Cantidad (toneladas)</span><input type="text" value="${esc(e.cant||'')}" oninput="setEt('cant',this.value)"></label>
      <label class="fld"><span>Fecha de ingreso al almacén</span><input type="date" value="${esc(e.fecha||'')}" oninput="setEt('fecha',this.value)"></label>
      <label class="fld"><span>Número de control del contenedor</span><input type="text" value="${esc(e.control||'')}" oninput="setEt('control',this.value)"></label>
      <label class="fld"><span>Empresa</span><input type="text" value="${esc(e.empresa||'')}" oninput="setEt('empresa',this.value)"></label>`}
    <div style="display:flex;gap:8px;margin-top:6px">
      <button class="btn primary sm" onclick="imprimirEtiqueta(4)">Imprimir 4 etiquetas</button>
      <button class="btn sm" onclick="imprimirEtiqueta(1)">Imprimir 1</button>
    </div>
    <p class="small muted" style="margin:10px 0 0">Se imprimen en hoja carta, cuatro por hoja, para recortar.</p>
  </div>
  <div class="card pad"><h3 class="sec">Vista previa</h3><div id="etPrev">${etiquetaHTML()}</div></div>
  </div>`;
}
function pintarEtiqueta(){ const p=document.getElementById('etPrev'); if(p) p.innerHTML=etiquetaHTML(); }
function etiquetaHTML(){
  const e=etiqueta();
  if(e.tipo==='residuo'){
    return `<div class="lbl"><div class="lb-co">${esc(e.empresa||DB.org.nombre||'')}</div>
      <div class="lb-t">RESIDUO PELIGROSO</div>
      <div class="lb-n">${esc(e.res||'NOMBRE DEL RESIDUO PELIGROSO')}</div>
      <div class="lb-car">${RESID.map(c=>`<span class="${(e.car||{})[c]?'on':''}">${c}</span>`).join('')}</div>
      <table class="lb-f"><tr><td>Área de generación:</td><td>${esc(e.area||'')}</td></tr>
        <tr><td>Cantidad:</td><td>${esc(e.cant||'')} toneladas</td></tr>
        <tr><td>Fecha de ingreso al almacén:</td><td>${esc(fdate(e.fecha)||'')}</td></tr>
        <tr><td>No. de control del contenedor:</td><td>${esc(e.control||'')}</td></tr></table></div>`;
  }
  const on=PICTOS.filter(([k])=>(e.pictos||{})[k]).map(([,l])=>l);
  return `<div class="lbl"><div class="lb-t">SUSTANCIA QUÍMICA PELIGROSA</div>
    <div class="lb-n">${esc(e.nombre||'NOMBRE DEL QUÍMICO')}</div>
    <div class="lb-cas">CAS: ${esc(e.cas||'')} · ${esc(e.senal||'')}</div>
    ${on.length?`<div class="lb-pic">${on.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:''}
    ${e.h?`<div class="lb-h"><b>H:</b> ${esc(e.h)}</div>`:''}
    ${e.p?`<div class="lb-h"><b>P:</b> ${esc(e.p)}</div>`:''}
    <div class="lb-fab">${esc(e.fab||'')}</div></div>`;
}
function imprimirEtiqueta(n){
  const uno=etiquetaHTML();
  const hojas=Math.ceil(n/4);
  let html='';
  for(let i=0;i<hojas;i++) html+=`<div class="lbl-sheet">${Array.from({length:4},()=>uno).join('')}</div>`;
  document.getElementById('printRoot').innerHTML=html; window.print();
}
