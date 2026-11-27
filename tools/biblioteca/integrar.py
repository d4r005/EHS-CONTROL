import json,re,sys
import os
HERE=os.path.dirname(os.path.abspath(__file__)); R=''; DAT='data/biblioteca/'
s=open(R+'index.html').read()
F=json.load(open(DAT+'formatos.json')); D=json.load(open(DAT+'docs.json'))
C=json.load(open(DAT+'formatos_c.json'))
def js(o): return json.dumps(o,ensure_ascii=False,separators=(',',':'))
# limpiar bloque previo (idempotente)
s=re.sub(r'<script>\n/\* @@AUTOGEN-INICIO@@ \*/.*?/\* @@AUTOGEN-FIN@@ \*/\n</script>\n','',s,flags=re.S)
s=re.sub(r'/\* @@CSS-DOC-INICIO@@ \*/.*?/\* @@CSS-DOC-FIN@@ \*/\n','',s,flags=re.S)
view=open(HERE+'/documentos_view.js').read(); css=open(HERE+'/documentos_css.css').read()
bloque=f"""<script>
/* @@AUTOGEN-INICIO@@ */
/* Generado desde la carpeta Formatos (build/*.py). No editar a mano: regenerar. */
const FORMATOS_REF = {js(F['nuevos'])};
const FORMATOS_REF_UPD = {js(F['upd'])};
FORMATOS_REF.forEach(n=>{{ if(!FORMATOS.some(f=>f.c===n.c)) FORMATOS.push(n); }});
Object.keys(FORMATOS_REF_UPD).forEach(c=>{{ const f=FORMATOS.find(x=>x.c===c); if(f) Object.assign(f,FORMATOS_REF_UPD[c]); }});
(function(){{
  const porNorma={{}};
  FORMATOS_REF.forEach(f=>{{ (porNorma[f.nk]=porNorma[f.nk]||[]).push(f.c); }});
  Object.keys(porNorma).forEach(k=>{{ const n=(typeof NORMAS!=='undefined')&&NORMAS.find(x=>x.k===k); if(n){{ n.f=n.f||[]; porNorma[k].forEach(c=>{{ if(!n.f.includes(c)) n.f.push(c); }}); }} }});
}})();
const FORMATOS_C = {js(C['nuevos'])};
const FORMATOS_C_UPD = {js(C['upd'])};
FORMATOS_C.forEach(n=>{{ if(!FORMATOS.some(f=>f.c===n.c)) FORMATOS.push(n); }});
Object.keys(FORMATOS_C_UPD).forEach(c=>{{ const f=FORMATOS.find(x=>x.c===c); if(f) Object.assign(f,FORMATOS_C_UPD[c]); }});
(function(){{
  const porNorma={{}};
  FORMATOS_C.forEach(f=>{{ (porNorma[f.nk]=porNorma[f.nk]||[]).push(f.c); }});
  Object.keys(porNorma).forEach(k=>{{ const n=(typeof NORMAS!=='undefined')&&NORMAS.find(x=>x.k===k); if(n){{ n.f=n.f||[]; porNorma[k].forEach(c=>{{ if(!n.f.includes(c)) n.f.push(c); }}); }} }});
}})();
const DOCUMENTOS = {js(D)};
{view}
{open(HERE+'/brigadas.js').read()}
/* @@AUTOGEN-FIN@@ */
</script>
"""
# insertar antes del script del editor (el que define vFormatos): justo antes de la 1a '<script>' posterior a REF_NORMAS
marca="Object.keys(REF_NORMAS).forEach(k=>{"
i=s.index(marca); j=s.index('</script>',i)+len('</script>\n')
s=s[:j]+bloque+s[j:]
# CSS
s=s.replace(".pdoc .txt{","/* @@CSS-DOC-INICIO@@ */\n"+css+"/* @@CSS-DOC-FIN@@ */\n.pdoc .txt{",1)
# ruta, titulo, menu
if "documentos:vDocumentos" not in s:
    s=s.replace("formatos:vFormatos,","formatos:vFormatos,documentos:vDocumentos,",1)
if "documentos:['Documentos'" not in s:
    s=s.replace("formatos:['Formatos','Biblioteca de formatos por norma'],","formatos:['Formatos','Biblioteca de formatos por norma'],documentos:['Documentos','Programas, procedimientos, manuales y planes'],documento:['Documento','Lectura e impresión'],",1)
if "id:'documentos'" not in s:
    s=s.replace("{id:'formatos',t:'Formatos',ico:'▤'},","{id:'formatos',t:'Formatos',ico:'▤'},\n    {id:'documentos',t:'Documentos',ico:'❏'},",1)
open(R+'index.html','w').write(s)
print('index.html',len(s))
