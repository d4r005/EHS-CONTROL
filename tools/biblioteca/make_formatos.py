import sys,os,json,re; sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from formatos_from_xlsx import *
FIRM=['Realizó — Coordinación EHS','Revisó — Jefe de área','Vo. Bo. — Gerencia']
CAMPOS_REV=[['fecha','Fecha de revisión','date'],['area','Áreas revisadas'],['resp','Responsable de la revisión'],['puesto','Puesto']]
CAMPOS_PROG=[['anio','Año del programa'],['area','Área / ubicación'],['resp','Responsable del programa']]
out=[]
def add(**k): out.append(k)

# ---------- NOM-001 ----------
P1='001/F-SH-001-00-'
add(c='EHS-F-045',n='Programa de mantenimiento de las instalaciones del centro de trabajo',nk='NOM-001-STPS-2008',tipo='programa',frec='Anual',orient='landscape',
    p='Programa anual (ene-dic) de mantenimiento de puertas, escaleras, techos, desagües, aire acondicionado, pisos, plafones, sanitarios y estructuras.',
    campos=CAMPOS_PROG,filas=programa(P1+'Programa de mantenimiento de las instalaciones del centro de trabajo.xlsx',''))
add(c='EHS-F-046',n='Registro de resultados de mantenimiento de las instalaciones del centro de trabajo',nk='NOM-001-STPS-2008',tipo='check',frec='Según programa',
    p='Resultados de cada revisión del programa de mantenimiento de las instalaciones, con acción correctiva y responsable.',
    campos=CAMPOS_REV,sec=secciones_check(P1+'Registro de resultados mantenimiento de las instalaciones del centro de trabajo.xlsx',r'^Descripción de los puntos',r'^Observaciones'))
add(c='EHS-F-047',n='Programa de mantenimiento a los sistemas de ventilación artificial',nk='NOM-001-STPS-2008',tipo='programa',frec='Anual',orient='landscape',
    p='Programa anual de mantenimiento a los sistemas de ventilación artificial (NOM-001-STPS-2008, numeral 8.3).',
    campos=CAMPOS_PROG,filas=programa(P1+'Programa de mantenimiento a los sistemas de ventilación artificial.xlsx',''))
add(c='EHS-F-048',n='Registro de resultados de mantenimiento a los sistemas de ventilación artificial',nk='NOM-001-STPS-2008',tipo='check',frec='Según programa',
    p='Resultados de la revisión a ventiladores, conductos, guardas, filtros y componentes eléctricos.',
    campos=CAMPOS_REV,sec=secciones_check(P1+'Registro de resultados mantenimiento a los sistemas de ventilacion artificial.xlsx',r'^Descripción de los puntos',r'^Observaciones'))

# ---------- NOM-002 ----------
P2='002/F-SH-002-00-'
add(c='EHS-F-049',n='Programa anual de revisión a las instalaciones eléctricas',nk='NOM-002-STPS-2010',tipo='programa',frec='Anual',orient='landscape',
    p='Programa anual de revisión de tableros, conductores, contactos, interruptores, luminarias y puesta a tierra (numeral 7.5).',
    campos=CAMPOS_PROG,filas=programa(P2+'Programa anual de revisión a las instalaciones eléctricas.xlsx',''))
add(c='EHS-F-050',n='Registro de resultados de la revisión a las instalaciones eléctricas',nk='NOM-002-STPS-2010',tipo='check',frec='Según programa',
    p='Resultados de la revisión eléctrica: aspectos generales, instalaciones temporales y puesta a tierra (numeral 7.7).',
    campos=CAMPOS_REV,sec=secciones_check(P2+'Registro de resultados revisión a las instalaciones eléctricas.xlsx',r'^Descripción de los puntos',r'^Observaciones'))
add(c='EHS-F-051',n='Programa anual de revisión a las instalaciones de gas L.P. y/o natural',nk='NOM-002-STPS-2010',tipo='programa',frec='Anual',orient='landscape',
    p='Programa anual de revisión a tuberías, tanque y componentes de la instalación de gas (numeral 7.6).',
    campos=CAMPOS_PROG,filas=programa(P2+'Programa anual de revisión a las instalaciones de gas licuado de petróleo y,o natural.xlsx',''))
add(c='EHS-F-052',n='Registro de resultados de la revisión a las instalaciones de gas L.P. y/o natural',nk='NOM-002-STPS-2010',tipo='check',frec='Según programa',
    p='Resultados de la revisión de tuberías interiores y exteriores, tanque y componentes. Si hay olor a gas, avisar de inmediato al responsable de seguridad e higiene.',
    campos=CAMPOS_REV,sec=secciones_check('002/F-SH-002-01-Registro de resultados revison de instalaciones de gas licuado de petroleo y,o natural.xlsx',r'^Descripción de los puntos',r'^Nota|^Observaciones'))
# bombeo (reemplaza la version generica en seccion check)
UPD={}
UPD['EHS-F-041']=dict(n='Bitácora de inspección a sistema de bombeo para incendios',tipo='check',frec='Semanal / mensual',
    p='Revisiones semanales, bombas, motor a explosión y pruebas semanales y mensuales del sistema de bombeo (NOM-002-STPS-2010, numeral 7.4). Al terminar las pruebas verificar que el equipo queda en AUTOMÁTICO y las válvulas abiertas y precintadas.',
    campos=[['fecha','Fecha','date'],['resp','Nombre de quien revisa'],['area','Casa de bombas']],
    sec=filas_codigo('002/F-SH-002-00_Bitacora de inspeccion a sistema de bombeo para incendios.xlsx'),
    firmas=['Responsable de Mantenimiento','Coordinación EHS','Gerencia'])

# ---------- NOM-009 ----------
add(c='EHS-F-054',n='Análisis de condiciones para trabajos en altura',nk='NOM-009-STPS-2011',tipo='check',frec='Por evento',
    p='Lista de verificación previa a trabajos a más de 1.80 m: trabajos en altura, andamios, escaleras y plataformas de elevación (numeral 5.1).',
    campos=[['fecha','Fecha y hora de la actividad'],['area','Lugar y área'],['pers','Nombre del personal'],['resp','Responsable del personal'],['act','Tipo de actividad a realizar']],
    sec=numerado('009/F-SH-009-00_Analisis de condiciones para trabajos en altura.xlsx'),
    firmas=['Responsable del personal','Coordinación EHS','Gerencia'])

# ---------- NOM-025 ----------
add(c='EHS-F-055',n='Programa específico de mantenimiento a luminarias y lámparas de emergencia',nk='NOM-025-STPS-2008',tipo='programa',frec='Anual',orient='landscape',
    p='Programa anual de limpieza, ventilación y reemplazo de luminarias y lámparas de emergencia (numeral 5.10).',
    campos=CAMPOS_PROG,filas=programa('025/F-SH-025-00-Programa de mantenimiento a luminarias y lamparas de emergencia.xlsx',''))
add(c='EHS-F-056',n='Registro de resultados del programa de mantenimiento a luminarias',nk='NOM-025-STPS-2008',tipo='check',frec='Según programa',
    p='Resultados de la revisión a luminarias y lámparas de emergencia (numeral 5.10).',
    campos=CAMPOS_REV,sec=secciones_check('025/F-SH-025-00-Registro de resultados del programa especifico de mantenimiento a luminarias.xlsx',r'^Descripción de los puntos',r'^Observaciones'))

exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'make_formatos_b.py')).read())
# codigos secuenciales sin choques (EHS-F-001..044 ya existen en la app)
for _i,_f in enumerate(out): _f['c']='EHS-F-%03d'%(45+_i)
json.dump({'nuevos':out,'upd':UPD},open(os.environ.get('OUT_DIR','data/biblioteca')+'/formatos.json','w'),ensure_ascii=False,indent=1)
print('UPD',list(UPD))
for f in out:
    n=sum(len(s['it']) for s in f['sec']) if f.get('sec') else len(f.get('filas',[]))
    print(f['c'],f['tipo'],n,f['n'][:70])
