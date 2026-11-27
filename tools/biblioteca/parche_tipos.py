# Inserta el soporte de los tipos "seleccion" y "cuestionario" y la vista Brigadas.
# Idempotente: el código vive entre los marcadores @@TIPOS-INICIO@@ / @@TIPOS-FIN@@.
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
s = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()

# quitar bloque previo
s = re.sub(r'/\* @@TIPOS-INICIO@@ \*/.*?/\* @@TIPOS-FIN@@ \*/\n', '', s, flags=re.S)
s = re.sub(r'/\* @@TIPOSCSS-INICIO@@ \*/.*?/\* @@TIPOSCSS-FIN@@ \*/\n', '', s, flags=re.S)

def rep(old, new, cnt=1):
    global s
    if new in s and old not in s:   # ya aplicado en una corrida anterior
        return
    assert old in s, 'NO ENCONTRADO: ' + old[:90]
    s = s.replace(old, new, cnt)

# --- 1. inicializar estructuras en preview y alta
rep("  if(f.tipo==='programa'){ demo.pm={}; demo.pf={}; }",
    "  if(f.tipo==='programa'){ demo.pm={}; demo.pf={}; }\n  if(f.tipo==='seleccion') demo.sel={};\n  if(f.tipo==='cuestionario'){ demo.q={}; demo.qx={}; (f.bloques||[]).forEach((b,i)=>demo.bl[i]=''); }")
rep("  if(f.tipo==='programa'){ d.pm={}; d.pf={}; }",
    "  if(f.tipo==='programa'){ d.pm={}; d.pf={}; }\n  if(f.tipo==='seleccion'){ d.sel={}; }\n  if(f.tipo==='cuestionario'){ d.q={}; d.qx={}; (f.bloques||[]).forEach((b,i)=>d.bl[i]=''); }")

# --- 2. editor
rep("  } else if(d.tipo==='programa'){",
"""  } else if(d.tipo==='seleccion'){
    cuerpo=(f.sec||[]).map((s,si)=>{
      const marc=(s.it||[]).filter((_,ii)=>(d.sel||{})[`s${si}i${ii}`]).length;
      return `<div class="card" style="margin-bottom:12px;overflow:hidden">
        <div class="subhead" style="padding:10px 14px;border-bottom:1px solid var(--line);display:flex;gap:8px;align-items:center">
          <b style="font-size:13px">${esc(s.t)}</b>
          <span class="small muted" style="margin-left:auto">${marc} de ${(s.it||[]).length} marcados</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:6px;padding:10px 14px">
          ${(s.it||[]).map((t,ii)=>{const k=`s${si}i${ii}`;const on=(d.sel||{})[k];
            return `<button class="btn sm" onclick="setSel('${d.id}','${k}')" style="justify-content:flex-start;text-align:left;${on?'background:var(--ok-bg);border-color:#86efac;font-weight:600':''}"><span style="font-weight:700;margin-right:6px">${on?'☑':'☐'}</span>${esc(t)}</button>`}).join('')}
        </div>
      </div>`}).join('');
  } else if(d.tipo==='cuestionario'){
    cuerpo=`<div class="card" style="overflow:hidden;margin-bottom:12px">
      <div class="subhead" style="padding:10px 14px;border-bottom:1px solid var(--line)"><b style="font-size:13px">Cuestionario</b>
        <span class="small muted" style="margin-left:8px">Sí / No / N/A y explicación</span></div>
      ${(f.preguntas||[]).map((p,i)=>{const v=(d.q||{})[i]||'';
        return `<div style="padding:10px 14px;border-bottom:1px solid #eef2f6">
          <div style="display:grid;grid-template-columns:1fr 150px;gap:10px;align-items:start">
            <div style="font-size:13px">${i+1}. ${esc(p)}</div>
            <div style="display:flex;gap:4px;justify-content:flex-end">
              ${[['Si','Sí'],['No','No'],['NA','N/A']].map(([o,l])=>`<button class="btn sm" onclick="setQ('${d.id}',${i},'${o}')" style="min-width:44px;justify-content:center;${v===o?`background:${o==='Si'?'var(--ok-bg)':o==='No'?'var(--danger-bg)':'#eef2f6'};border-color:${o==='Si'?'#86efac':o==='No'?'#fecaca':'#cbd5e1'};font-weight:700`:''}">${l}</button>`).join('')}
            </div>
          </div>
          <input type="text" placeholder="Explique (opcional)" value="${esc((d.qx||{})[i]||'')}" oninput="setQx('${d.id}',${i},this.value)" style="margin-top:7px;font-size:12.5px">
        </div>`}).join('')}
    </div>
    <div class="card pad">${(f.bloques||[]).map((b,i)=>`
      <label class="fld"><span>${esc(b.t)}</span>
        <textarea rows="${b.rows||4}" oninput="setBl('${d.id}',${i},this.value)">${esc((d.bl||{})[i]||'')}</textarea>
      </label>`).join('')}</div>`;
  } else if(d.tipo==='programa'){""")

# --- 2b. despacho a hojas con diseno propio (PTR, simulacro)
rep("function sheetHTML(d,f){" + chr(10) + "  const campos=",
    "function sheetHTML(d,f){" + chr(10) + "  if(f.hoja&&typeof window['hoja_'+f.hoja]==='function') return window['hoja_'+f.hoja](d,f);" + chr(10) + "  const campos=")

# --- 3. hoja impresa
rep("  } else if(d.tipo==='programa'){\n    cuerpo=`<table class=\"tb prg\">",
"""  } else if(d.tipo==='seleccion'){
    cuerpo=(f.sec||[]).map((s,si)=>`<div class="avoid"><h2>${esc(s.t)}</h2>
      <table class="sel"><tbody>${(s.it||[]).map((t,ii)=>{const on=(d.sel||{})[`s${si}i${ii}`];
        return `<tr><td class="bx">${on?'X':''}</td><td>${esc(t)}</td></tr>`}).join('')}</tbody></table></div>`).join('')
      +(f.nota?`<div class="note">${esc(f.nota)}</div>`:'');
  } else if(d.tipo==='cuestionario'){
    cuerpo=`<table class="tb"><thead><tr><th style="text-align:left">Pregunta</th><th style="width:8%">Sí</th><th style="width:8%">No</th><th style="width:8%">N/A</th><th style="width:30%">Explique</th></tr></thead>
      <tbody>${(f.preguntas||[]).map((p,i)=>{const v=(d.q||{})[i]||'';
        return `<tr><td>${esc(p)}</td><td class="c">${v==='Si'?'X':''}</td><td class="c">${v==='No'?'X':''}</td><td class="c">${v==='NA'?'X':''}</td><td>${esc((d.qx||{})[i]||'')}</td></tr>`}).join('')}</tbody></table>`
      +(f.bloques||[]).map((b,i)=>{const txt=(d.bl||{})[i]||'';
        return `<div class="avoid"><h2>${esc(b.t)}</h2>${txt?`<div class="txt">${esc(txt)}</div>`:`<div class="blank" style="min-height:${(b.rows||3)*20}px"></div>`}</div>`}).join('');
  } else if(d.tipo==='programa'){
    cuerpo=`<table class="tb prg">""")

# --- 4. helpers de edición
rep("function setPm(id,r,m){",
"""function setSel(id,k){ const d=doc_(id); d.sel=d.sel||{}; d.sel[k]=!d.sel[k]; save(); document.getElementById('view').innerHTML=vDoc(); }
function setQ(id,i,v){ const d=doc_(id); d.q=d.q||{}; d.q[i]=(d.q[i]===v?'':v); save(); document.getElementById('view').innerHTML=vDoc(); }
function setQx(id,i,v){ const d=doc_(id); d.qx=d.qx||{}; d.qx[i]=v; save(); }
function setPm(id,r,m){""")

# --- 5. filtros
rep("chip('programa','Programas',tipo==='programa')].join(' ');",
    "chip('programa','Programas',tipo==='programa'),chip('seleccion','Selección',tipo==='seleccion'),chip('cuestionario','Cuestionarios',tipo==='cuestionario')].join(' ');")

# --- 6. vista Brigadas en navegación, títulos y rutas
rep("{id:'documentos',t:'Documentos',ico:'❏'},", "{id:'documentos',t:'Documentos',ico:'❏'},\n    {id:'brigadas',t:'Brigadas',ico:'⚑'},")
rep("documentos:vDocumentos,", "documentos:vDocumentos,brigadas:vBrigadas,etiquetas:vEtiquetas,")
rep("{id:'brigadas',t:'Brigadas',ico:'⚑'},", "{id:'brigadas',t:'Brigadas',ico:'⚑'},\n    {id:'etiquetas',t:'Etiquetas',ico:'⌘'},")
rep("documento:['Documento','Lectura e impresión'],",
    "documento:['Documento','Lectura e impresión'],brigadas:['Brigadas','Organigrama y funciones de la brigada de emergencias'],etiquetas:['Etiquetas','Etiquetas de sustancias químicas y residuos peligrosos'],")

# --- 7. CSS
css = open(os.path.join(HERE,'brigadas.css'), encoding='utf-8').read()
css += open(os.path.join(HERE,'etiquetas.css'), encoding='utf-8').read()
css += open(os.path.join(HERE,'hojas.css'), encoding='utf-8').read()
css += """.pdoc table.sel{width:100%;border-collapse:collapse;font-size:7.8pt;margin-top:2px}
.pdoc table.sel td{border:1px solid #111;padding:2px 5px}
.pdoc table.sel td.bx{width:16px;text-align:center;font-weight:700}
"""
rep(".pdoc .txt{", "/* @@TIPOSCSS-INICIO@@ */\n" + css + "/* @@TIPOSCSS-FIN@@ */\n.pdoc .txt{")

open(os.path.join(ROOT,'index.html'),'w',encoding='utf-8').write(s)
print('parche aplicado', len(s))
