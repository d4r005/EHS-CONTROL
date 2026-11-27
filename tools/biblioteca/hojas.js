/* ============================ HOJAS CON DISEÑO DEL ORIGINAL ============================ */
/* Permiso para realizar trabajos peligrosos: replica el formato NAF de 2 paginas */
function _secIdx(f,pref){ return (f.sec||[]).findIndex(s=>(s.t||'').toLowerCase().startsWith(pref.toLowerCase())); }
function _items(f,pref){ const i=_secIdx(f,pref); return i<0?[]:(f.sec[i].it||[]).map((t,ii)=>({t,on:!!((d_sel||{})[`s${i}i${ii}`])})); }
let d_sel=null;
function _lista(f,d,pref,cols){
  d_sel=d.sel||{};
  const its=_items(f,pref);
  const html=its.map(x=>`<div class="it"><i class="ck${x.on?' on':''}"></i><span class="t">${esc(x.t)}</span></div>`).join('');
  return cols===2?`<div class="col2">${html}</div>`:html;
}
function hojaPTR(d,f){
  d_sel=d.sel||{};
  const cam=k=>esc((d.f||{})[k]||'');
  const F=k=>esc(fdate((d.f||{})[k])||'');
  const co=colorEmp();
  const tip=_items(f,'Tipo de trabajo');
  const chipCol=['#00B0F0','#FFC000','#FF66CC','#92D050','#FFFF00','#FF0000'];
  const chips=tip.map((x,i)=>`<div class="chip6" style="background:${chipCol[i]||'#eee'}"><i class="ck${x.on?' on':''}"></i>${esc(x.t.replace(' (1.8 m)','').replace('Trabajos en ','').replace('Trabajos ',''))}</div>`).join('');
  const conf=_items(f,'Confirmaciones previas');
  const cap=_items(f,'Capacitación y requisitos');
  const doc=_items(f,'Documentación revisada');
  const bloqueo=Array.from({length:10},(_,i)=>`<tr><td style="height:13px">${i+1}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`).join('');
  const ins=Array.from({length:11},(_,i)=>`<tr><td>${i+1}</td><td></td><td style="width:26px"></td><td style="width:26px"></td><td>${i+12}</td><td></td><td style="width:26px"></td><td style="width:26px"></td></tr>`).join('');
  return `<div class="pdoc ptrdoc" style="--co:${co};--co-txt:${textoColor(co)};--co-soft:${tinte(co,.12)}"><div class="sheet">
  <div class="hdr"><img src="${logoSrc()}" alt=""><div class="co"><div class="n">${esc(DB.org.nombre||'')}</div><div class="s">Seguridad y Salud en el Trabajo</div><div class="c">${esc(DB.org.centro||'')}</div></div><div class="rev"><b>PTR</b>Permiso de trabajo</div></div>
  <div class="title"><h1>Permiso para realizar trabajos peligrosos</h1><div class="n">Permiso N°: ${cam('folio')||'________'} &nbsp;·&nbsp; Página 1 de 2</div></div>

  <table class="fm" style="margin-bottom:3px"><tr>
    <td style="width:22%"><span class="lbl-in">Fecha (de trámite)</span>${F('fecha')}</td>
    <td style="width:16%"><span class="lbl-in">Hora (de trámite)</span>${cam('hora')}</td>
    <td style="width:31%"><span class="lbl-in">Responsable del área</span>${cam('resp')}</td>
    <td style="width:31%"><span class="lbl-in">Sitio y área de realización del trabajo</span>${cam('sitio')}</td></tr></table>
  <table class="fm" style="margin-bottom:3px"><tr>
    <td style="width:38%"><span class="lbl-in">Trabajo a realizar por</span><i class="ck${/interno/i.test(cam('ejec'))?' on':''}"></i>NAF interno &nbsp;&nbsp;<i class="ck${/contratista/i.test(cam('ejec'))?' on':''}"></i>Contratista</td>
    <td style="width:26%"><span class="lbl-in">Nombre de la compañía contratista</span>${cam('cia')}</td>
    <td style="width:36%"><span class="lbl-in">Descripción de los trabajos</span>${cam('desc')||'&nbsp;'}</td></tr></table>
  <table class="fm" style="margin-bottom:4px"><tr>
    <td style="width:30%"><span class="lbl-in">Fecha de ejecución del trabajo</span>${F('fEjec')}</td>
    <td style="width:30%"><span class="lbl-in">Duración estimada</span>De: ${cam('dur')||'&nbsp;&nbsp;&nbsp;h'} &nbsp; A: &nbsp;&nbsp;h</td>
    <td style="width:40%"><span class="lbl-in">Listado del personal ejecutor</span>&nbsp;</td></tr></table>

  <div class="sec-ptr">Tipo de trabajo a realizar (marcar con una X)</div>
  <div class="chips">${chips}</div>

  <div class="ptr-2col">
    <div class="box"><div class="h-sec">Evaluación de riesgos (seleccione los riesgos adecuados)</div>
      ${['Evaluación de riesgos — trabajos en alturas','Evaluación de riesgos — trabajos de elevación','Evaluación de riesgos — trabajos en caliente','Evaluación de riesgos — trabajos eléctricos','Evaluación de riesgos — LOTO']
        .map(pref=>`<div style="margin-bottom:2px"><b style="font-size:7pt">${esc(pref.replace('Evaluación de riesgos — ','').toUpperCase())}</b>${_lista(f,d,pref,2)}</div>`).join('')}
    </div>
    <div>
      <div class="box" style="margin-bottom:4px"><div class="h-sec">Precauciones a tomarse previo al comienzo y durante el trabajo</div>
        ${['Precauciones previas y durante el trabajo — alturas','Precauciones — trabajos en caliente','Precauciones — trabajos de elevación','Precauciones — trabajos eléctricos']
          .map(pref=>`<div style="margin-bottom:2px"><b style="font-size:7pt">${esc(pref.split('—').pop().trim().toUpperCase())}</b>${_lista(f,d,pref,2)}</div>`).join('')}
      </div>
      <div class="box"><div class="h-sec">EPP específicos</div>
        ${['EPP específico — trabajos en caliente','EPP específico — trabajos eléctricos','EPP específico — Hazmat','EPP específico — LOTO']
          .map(pref=>`<div style="margin-bottom:2px"><b style="font-size:7pt">${esc(pref.split('—').pop().trim().toUpperCase())}</b>${_lista(f,d,pref,2)}</div>`).join('')}
      </div>
    </div>
  </div>

  <div class="box" style="margin-top:4px"><div class="h-sec">¿Confirma que los siguientes elementos están totalmente disponibles o implementados?</div>
    <div class="col2">${conf.map(x=>`<div class="it"><i class="ck${x.on?' on':''}"></i><span class="t">${esc(x.t)}</span><b style="margin-left:auto;font-size:6.6pt">Sí</b></div>`).join('')}</div></div>

  <div class="ptr-2col" style="margin-top:4px">
    <table class="fm"><tr><th colspan="3">Capacitación</th><th style="width:22%">¿Se necesita?</th></tr>
      ${cap.map(x=>`<tr><td colspan="3" style="font-size:7pt">${esc(x.t)}</td><td style="text-align:center"><i class="ck${x.on?' on':''}"></i>Sí &nbsp;<i class="ck${!x.on?' on':''}"></i>No</td></tr>`).join('')}
    </table>
    <table class="fm"><tr><th colspan="2">Documentación</th></tr>
      ${doc.map(x=>`<tr><td style="font-size:7pt">${esc(x.t)}</td><td style="width:34px;text-align:center"><i class="ck${x.on?' on':''}"></i>Revisada</td></tr>`).join('')}
    </table>
  </div>

  <div class="sec-ptr" style="margin-top:4px">Dispositivos de bloqueo aplicados / retirados (LOTO)</div>
  <table class="fm"><tr><th style="width:6%">#</th><th style="width:34%">Identificación del equipo aislante de energía</th>
    <th>Eléctrico</th><th>Hidráulico</th><th>Neumático</th><th>Mecánico</th><th>Químico</th>
    <th style="width:14%">Tipo de dispositivo</th><th style="width:12%">Código</th><th style="width:10%">Retirado</th></tr>
    ${Array.from({length:10},(_,i)=>`<tr><td>${i+1}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`).join('')}</table>
  <div class="note">Colocar el permiso visiblemente en el lugar de trabajo. Validez máxima: un día.</div>
  </div>

  <div class="sheet ptr-p2">
  <div class="hdr"><img src="${logoSrc()}" alt=""><div class="co"><div class="n">${esc(DB.org.nombre||'')}</div><div class="s">Seguridad y Salud en el Trabajo</div><div class="c">${esc(DB.org.centro||'')}</div></div><div class="rev"><b>PTR</b>Permiso de trabajo</div></div>
  <div class="title"><h1>Permiso para realizar trabajos peligrosos</h1><div class="n">Permiso N°: ${cam('folio')||'________'} &nbsp;·&nbsp; Página 2 de 2</div></div>

  <div class="box"><div class="h-sec">Contenido de la sesión informativa para este permiso</div>
    <div style="font-size:7.2pt;line-height:1.4">A) Aplicación del permiso &nbsp;·&nbsp; B) Evaluación de riesgos &nbsp;·&nbsp; C) Esquema de aislamiento de energías &nbsp;·&nbsp; D) EPP requerido &nbsp;·&nbsp; E) Rutas de evacuación y punto de reunión</div></div>

  <table class="fm" style="margin-top:5px"><tr><th style="width:34%">Nombre y apellidos</th><th style="width:26%">Fecha y hora</th><th>Firma</th></tr>
    <tr><td style="height:22px">Responsable del área de trabajo</td><td></td><td></td></tr>
    <tr><td style="height:22px">Gerente / supervisor del contratista</td><td></td><td></td></tr>
    <tr><td style="height:22px">Coordinador EHS de NAF</td><td></td><td></td></tr></table>

  <div class="sec-ptr">Inspección de equipos a utilizar</div>
  <table class="fm"><tr><th style="width:4%">#</th><th style="width:32%">Elemento a revisar</th><th>Aplicable</th><th>#1</th><th style="width:4%">#</th><th style="width:32%">Elemento a revisar</th><th>Aplicable</th><th>#2</th></tr>
    ${ins}</table>
  <div class="note">Marcar con ✓ si el equipo cumple con el requerimiento. CN canastilla · ES escalera simple · ED escalera doble · EE escalera extensible · EA escalera articulada · EM equipo móvil · SL soldadura · EMG equipo contra incendio.</div>

  <div class="sec-ptr">Vigilancia y supervisión contra incendios (trabajos en caliente)</div>
  <table class="fm"><tr><th style="width:14%">Revisión</th><th style="width:34%">Nombre</th><th style="width:18%">Hora</th><th>Firma</th></tr>
    ${[1,2,3].map(n=>`<tr><td>Revisión ${n}</td><td></td><td></td><td></td></tr>`).join('')}</table>

  <div class="ptr-2col" style="margin-top:5px">
    <div class="box"><div class="h-sec">Emisión del permiso</div>
      <div style="font-size:7pt;line-height:1.35">Se otorga el permiso de trabajo con las condiciones especificadas anteriormente.</div>
      <table class="fm" style="margin-top:3px"><tr><td style="width:40%"><span class="lbl-in">Validez (1 día máx.)</span></td><td><span class="lbl-in">De</span> &nbsp;h <span class="lbl-in">A</span> &nbsp;h</td></tr>
      <tr><td style="height:20px">Responsable del área NAF</td><td></td></tr>
      <tr><td style="height:20px">Coordinador EHS de NAF</td><td></td></tr></table></div>
    <div class="box"><div class="h-sec">Finalización del permiso</div>
      <div style="font-size:7pt;line-height:1.35">Certifico que este permiso de trabajo se ha detenido y que los trabajos quedaron concluidos en el área.</div>
      <div style="font-size:7pt;margin-top:4px"><i class="ck"></i> Terminado correctamente<br><i class="ck"></i> Detenidos o suspendidos a las ____:____ horas del día ____________<br><i class="ck"></i> Todo el personal se retiró y el área quedó limpia y segura</div>
      <table class="fm" style="margin-top:4px"><tr><td style="width:34%"><span class="lbl-in">Nombre</span></td><td style="width:26%"><span class="lbl-in">Fecha y hora</span></td><td><span class="lbl-in">Firma</span></td></tr>
      <tr><td style="height:18px"></td><td></td><td></td></tr></table></div>
  </div>
  </div></div>`;
}

/* Evaluacion del simulacro: replica la tabla del formato NAF */
function hojaSimulacro(d,f){
  const cam=k=>esc((d.f||{})[k]||'');
  const F=k=>esc(fdate((d.f||{})[k])||'');
  const q=(d.q||{}), qx=(d.qx||{});
  const preg=f.preguntas||[];
  const fila=(p,i)=>{
    const v=q[i]||'';
    const ex=(qx[i]||'')||(v==='NA'?'N/A':'');
    return `<tr><td>${esc(p)}</td><td class="c" style="width:7%">${v==='Si'?'X':''}</td>
      <td class="c" style="width:7%">${v==='No'?'X':''}</td><td style="width:31%">${esc(ex)}</td></tr>`;
  };
  const prim=preg.slice(0,15).map((p,i)=>fila(p,i)).join('');
  const seg=preg.slice(15).map((p,i)=>fila(p,i+15)).join('');
  const co=colorEmp();
  return `<div class="pdoc" style="--co:${co};--co-txt:${textoColor(co)};--co-soft:${tinte(co,.12)}"><div class="sheet">
  <div class="hdr"><img src="${logoSrc()}" alt=""><div class="co"><div class="n">${esc(DB.org.nombre||'')}</div><div class="s">Seguridad y Salud en el Trabajo</div><div class="c">${esc(DB.org.centro||'')}</div></div><div class="rev"><b>SIM</b>Simulacro</div></div>
  <div class="title"><h1>Evaluación del simulacro</h1><div class="n">${esc(f.nk)} · ${esc(f.c)}</div></div>

  <table class="fm" style="margin-bottom:4px">
    <tr><td style="width:20%"><b>Fecha del simulacro:</b></td><td style="width:30%">${F('fecha')}</td>
        <td style="width:16%"><b>Sucursal:</b></td><td>${cam('area')}</td></tr>
    <tr><td><b>Emergencia simulada:</b></td><td>${cam('emerg')}</td>
        <td><b>Hora de activación:</b></td><td>${cam('hora')}</td></tr>
    <tr><td><b>Coordinador (a) de respuesta:</b></td><td>${cam('resp')}</td>
        <td><b>Duración del simulacro:</b></td><td>${cam('dur')}</td></tr>
  </table>

  <table class="fm">
    <tr><th style="width:52%">Observaciones</th><th style="width:7%">Sí</th><th style="width:7%">No</th><th>Explique</th></tr>
    ${prim}
  </table>

  <table class="fm" style="margin-top:4px">
    <tr><td style="width:52%"><b>Tiempo de evacuación (esperado):</b></td><td>${cam('tEsp')}</td></tr>
    <tr><td><b>Tiempo de evacuación (real):</b></td><td>${cam('tReal')}</td></tr>
  </table>

  <table class="fm" style="margin-top:4px">
    ${seg}
    <tr><td><b>¿Qué cambios se necesitan hacer al plan de emergencias?</b></td><td colspan="3">${esc((d.bl||{})[0]||'')}</td></tr>
    <tr><td><b>Fecha programada para actualizar el plan de emergencias</b></td><td colspan="3">${esc((d.bl||{})[1]||'')}</td></tr>
  </table>

  <table class="fm" style="margin-top:4px"><tr><th colspan="4">Fotografías del simulacro</th></tr>
    <tr><td style="width:25%">Foto 1</td><td style="width:25%">Foto 2</td><td style="width:25%">Foto 3</td><td>Foto 4</td></tr>
    <tr><td style="height:52px"></td><td></td><td></td><td></td></tr></table>

  <table class="fm" style="margin-top:6px">
    <tr><td style="width:50%"><b>Fecha:</b> ${F('fecha')}</td><td><b>Firma del Gerente de Planta:</b></td></tr>
    <tr><td><b>Fecha:</b> ${F('fecha')}</td><td><b>Firma del asignado EHS:</b></td></tr>
    <tr><td colspan="2" style="height:26px"></td></tr></table>
  </div></div>`;
}

window.hoja_ptr=hojaPTR; window.hoja_simulacro=hojaSimulacro;
