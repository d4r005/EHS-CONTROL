import json,os,re,glob
from docx import Document
from docx.table import Table
from docx.text.paragraph import Paragraph
W='{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
import os
SRC=os.environ.get('FORMATOS_DIR','Formatos').rstrip('/')+'/'
DOCS=[
 ('EHS-D-001','D-SH-002-00_Instrucciones de Seguridad para la Prevención y Protección contra Incendios.docx','002','Instrucciones de seguridad para la prevención y protección contra incendios','NOM-002-STPS-2010','Instructivo','Reglas y acciones para prevenir y combatir incendios en el centro de trabajo.','D-SH-002-00'),
 ('EHS-D-002','F-SH-004-00_Programa específico para revisión y mantenimiento de la maquinaria, equipo y herramientas.docx','004','Programa específico para revisión y mantenimiento de la maquinaria, equipo y herramientas','NOM-004-STPS-1999','Programa','Procedimientos de operación, ajuste, limpieza y mantenimiento seguro de maquinaria y equipo.','F-SH-004-00'),
 ('EHS-D-003','F-SH-004-01_Manual de Primeros Auxilios.docx','004','Manual de primeros auxilios','NOM-030-STPS-2009','Manual','Guía de actuación inmediata ante lesiones y urgencias médicas en el centro de trabajo.','F-SH-004-01'),
 ('EHS-D-004','F-SH-005-00_Procedimiento para el manejo, transporte y almacenamiento de sustancias quimicas peligrosas.docx','005','Procedimiento para el manejo, transporte y almacenamiento de sustancias químicas peligrosas','NOM-005-STPS-1998','Procedimiento','Reglas de manejo, transporte y almacenamiento seguro de sustancias químicas peligrosas.','F-SH-005-00'),
 ('EHS-D-005','F-SH-005-00_Programa específico de seguridad e higiene para el manejo, transporte y almacenamiento de sustancias quimicas peligrosas.docx','005','Programa específico de seguridad e higiene para el manejo, transporte y almacenamiento de sustancias químicas peligrosas','NOM-005-STPS-1998','Programa','Programa específico con hojas de datos, orden y limpieza, EPP y plan de emergencias.','F-SH-005-00'),
 ('EHS-D-006','F-SH-009-00_Plan de atencion a emergencias en la ejecucion de trabajos en altura.docx','009','Plan de atención a emergencias en la ejecución de trabajos en altura','NOM-009-STPS-2011','Plan','Activación del plan de emergencias y rescate para trabajos en altura.','F-SH-009-00'),
 ('EHS-D-007','F-SH-011-00_Programa específico de conservación de la audición del Personal Ocupacionalmente Expuesto a ruido.docx','011','Programa específico de conservación de la audición','NOM-011-STPS-2001','Programa','Evaluación de ruido, protección auditiva, capacitación y vigilancia a la salud del personal expuesto.','F-SH-011-00'),
 ('EHS-D-008','F-SH-019-0_Acta comisión de seguridad e higiene.docx','019','Acta de integración de la comisión de seguridad e higiene','NOM-019-STPS-2011','Acta','Integración de la comisión, funciones de sus miembros y causas de sustitución.','F-SH-019-0'),
 ('EHS-D-009','F-SH-030-00_Responsable deseguridad y salud en el trabajo.docx','030','Nombramiento del responsable de seguridad y salud en el trabajo','NOM-030-STPS-2009','Nombramiento','Designación formal del responsable de seguridad y salud en el trabajo.','F-SH-030-00'),
]
def clean(t):
    t=t.replace('\u00a0',' ').replace('\t',' ')
    return re.sub(r'[ ]{2,}',' ',t).strip()
def conv(path):
    d=Document(path); out=[]
    for el in d.element.body.iterchildren():
        tag=el.tag.split('}')[1]
        if tag=='p':
            p=Paragraph(el,d); t=clean(p.text)
            if not t: continue
            st=p.style.name if p.style is not None else ''
            li=el.find('.//'+W+'numPr') is not None
            runs=[r for r in p.runs if r.text.strip()]
            bold=bool(runs) and all(r.bold for r in runs)
            m=re.match(r'^[•·▪●○\-–]\s*(.+)$',t)
            if m and not (bold and len(t)<=140 and not li and t.isupper()):
                out.append({'li':m.group(1).strip()}); continue
            if st.startswith('Heading') or (bold and len(t)<=140 and (not li or t.isupper())):
                out.append({'h':t})
            elif li:
                out.append({'li':t})
            else:
                out.append({'p':t})
        elif tag=='tbl':
            tb=Table(el,d); rows=[]
            for r in tb.rows:
                cells=[];prev=None
                for c in r.cells:
                    if c._tc is prev: continue
                    prev=c._tc; cells.append(clean(c.text))
                if any(cells): rows.append(cells)
            if rows: out.append({'t':rows})
    return out
res=[]
for code,fn,car,name,nk,kind,desc,orig in DOCS:
    b=conv(SRC+car+'/'+fn)
    res.append({'c':code,'n':name,'nk':nk,'k':kind,'p':desc,'o':orig,'b':b})
    print(code,len(b),sum(len(json.dumps(x,ensure_ascii=False)) for x in b))
OUT=os.environ.get('OUT_DIR','data/biblioteca')
json.dump(res,open(OUT+'/docs.json','w'),ensure_ascii=False)
