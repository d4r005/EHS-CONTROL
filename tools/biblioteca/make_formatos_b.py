# ---------- NOM-002: analisis, simulacros, croquis ----------
add(c='EHS-F-053',n='Análisis para la clasificación del riesgo de incendio',nk='NOM-002-STPS-2010',tipo='acta',frec='Anual / por cambio',
    p='Datos del centro de trabajo, inventarios máximos y cálculo del grado de riesgo de incendio (ordinario o alto) por sección (numeral 5.1).',
    campos=[['fecha','Fecha de la determinación final','date'],['area','Sección analizada'],['resp','Responsable de la clasificación']],
    bloques=[{'t':x,'rows':r} for x,r in [
     ('a) Razón social y b) domicilio completo del centro de trabajo',3),
     ('c) Descripción general del proceso productivo, materiales y cantidades que se emplean',5),
     ('d) Número máximo de trabajadores por turno y e) personas externas (contratistas y visitantes)',3),
     ('f) Superficie construida en metros cuadrados',2),
     ('g) Inventario máximo del año: gases inflamables (L, umbral 3000), líquidos inflamables (L, 1400), líquidos combustibles (L, 2000), sólidos combustibles (kg, 15000), pirofóricos y explosivos (cualquier cantidad = alto)',6),
     ('h) Cálculo: suma de (inventario ÷ umbral). Resultado menor a 1 = riesgo ORDINARIO; igual o mayor a 1 = riesgo ALTO',4),
     ('j) Tipo de riesgo de incendio por sección del centro de trabajo (ordinario / alto)',4)]],
    firmas=['Responsable de la clasificación','Coordinación EHS','Gerencia'])
add(c='EHS-F-054',n='Planeación de simulacros de emergencias de incendio',nk='NOM-002-STPS-2010',tipo='acta',frec='Anual',
    p='Planeación del simulacro: coordinación, medidas de seguridad, fecha, alcance, escenario, funciones, cronología y apoyo externo (numeral 10.2).',
    campos=[['fecha','Fecha y hora del simulacro','date'],['area','Alcance del simulacro'],['resp','Coordinador del simulacro'],['hipo','Escenario / hipótesis']],
    bloques=[{'t':x,'rows':r} for x,r in [
     ('1. Coordinación del simulacro (nombre, puesto y área de seguridad responsable)',3),
     ('2. Medidas de seguridad durante el simulacro (guion, horarios, objetivos, participantes, rutas y puntos de reunión)',5),
     ('3. Fecha y hora de ejecución',2),
     ('4. Alcance del simulacro (áreas administrativas y operativas)',3),
     ('5. Tipo de escenario del simulacro',4),
     ('Funciones: coordinación operativa, jefe de piso, brigadistas, observadores y evaluadores',6),
     ('6. Cronología: detección, evaluación, alarma, atención del conato, desalojo, corte de energía, conteo en punto de reunión, abatimiento y reincorporación (con tiempos)',8),
     ('7. Participación de cuerpos especializados de auxilio (interno o externo)',3)]],
    firmas=['Coordinador del simulacro','Coordinación EHS','Gerencia'])
add(c='EHS-F-055',n='Registro de los resultados de los simulacros de emergencias de incendio',nk='NOM-002-STPS-2010',tipo='acta',frec='Anual',
    p='Resultados del simulacro: áreas, personas participantes, recursos, desviaciones, recomendaciones, duración y encargados (numeral 10.3).',
    campos=[['fecha','Fecha del simulacro','date'],['area','Áreas donde se realizó'],['resp','Coordinador'],['pers','Personas que intervinieron (operadores / administrativos)']],
    bloques=[{'t':x,'rows':r} for x,r in [
     ('1. Razón social y 2. domicilio completo del centro de trabajo',3),
     ('3. Áreas del centro de trabajo en las que se realizó el simulacro',3),
     ('5. Recursos utilizados (rutas y salidas señalizadas, alarma audible y visible, extintores, brigadas, otros)',5),
     ('6. Detección de desviaciones en las acciones planeadas',6),
     ('7. Recomendaciones para actualizar el plan de atención a emergencias de incendio',6),
     ('8. Duración del simulacro (evacuación total desde la activación de alarmas: minutos y segundos)',2),
     ('9. Encargados de coordinarlo: coordinador, jefes de piso, brigadistas, observadores y evaluadores',6)]],
    firmas=['Coordinador del simulacro','Coordinación EHS','Gerencia'])
add(c='EHS-F-056',n='Requisitos para elaborar el croquis, plano o mapa de áreas con riesgo de incendio',nk='NOM-002-STPS-2010',tipo='check',frec='Anual / por cambio',
    p='Verificación del contenido mínimo del croquis contra incendio (numeral 5.2).',
    campos=[['fecha','Fecha','date'],['area','Centro de trabajo'],['resp','Elaboró']],
    sec=[{'t':'Contenido del croquis, plano o mapa','it':['a) Nombre, denominación o razón social del centro de trabajo y su domicilio',
     'b) Identificación de los predios colindantes',
     'c) Identificación de las principales áreas o zonas con riesgo de incendio (material inflamable, combustible, pirofórico o explosivo)',
     'd) Ubicación de los medios de detección de incendio, equipos y sistemas contra incendio',
     'e) Rutas de evacuación (ruta de salida y descarga), salidas de emergencia, escaleras de emergencia y lugares seguros',
     'f) Ubicación del equipo de protección personal de las brigadas contra incendio',
     'g) Ubicación de materiales y equipo para prestar los primeros auxilios']}],
    firmas=['Elaboró','Coordinación EHS','Gerencia'])

# ---------- NOM-006 ----------
M=filas=None
import openpyxl as _o
_ws=ws_of('006/F-SH-006-06 Bitácora de revisión del montacargas.xlsx')
_mont=[re.sub(r'^\d+\.-\s*','',t) for t,b,r in rows_first(_ws,6,45) if re.match(r'^\d+\.-',t)]
UPD['EHS-F-006']=dict(sec=[{'t':'Revisión diaria (SAT = satisfactorio, INS = insatisfactorio, N/A = no aplica)','it':_mont}],
    campos=[['fecha','Fecha','date'],['maq','Identificación del montacargas'],['resp','Nombre del operador'],['turno','Turno','sel:Matutino|Vespertino|Nocturno|Mixto']])

# ---------- NOM-009 / alto riesgo ----------
_ws=ws_of('Formato para autorización de trabajos de alto riesgo.xlsx')
def _marcas(r0,r1):
    o=[]
    for r in range(r0,r1+1):
        for c in _ws[r]:
            if c.value not in (None,'') and txt(c.value) not in ('□',) and not txt(c.value).startswith('_'):
                v=txt(c.value)
                if v.lower().startswith('otro'): v='Otro (especifique)'
                o.append(v)
    return o
add(c='EHS-F-057',n='Autorización para trabajos de alto riesgo',nk='NOM-009-STPS-2011',tipo='check',frec='Por evento',
    p='Autorización previa para trabajos con energías, espacios confinados, caídas, izaje, techos y corte y soldadura, con EPP, maquinaria, documentación y bloqueo.',
    campos=[['fecha','Fecha','date'],['folio','Folio'],['area','Compañía / depto. / área'],['ubi','Ubicación de la actividad'],['pers','Cantidad de personal'],['act','Descripción de la actividad']],
    sec=[{'t':'Tipo de trabajo','it':['Trabajo con energías','Espacios confinados','Riesgos de caída','Trabajos de izaje','Trabajos en techos','Corte y soldadura','Otro (especifique)']},
         {'t':'Equipo de protección personal requerido','it':_marcas(30,33) if False else [
          'Casco de seguridad','Barbiquejo','Lentes de seguridad','Goggles','Careta de acrílico','Careta de soldador','Anteojos para soldar','Protección auditiva','Protección respiratoria','Mascarilla',
          'Equipo de respiración autónomo','Guante de algodón','Guante Kevlar','Guante de carnaza','Guante dieléctrico','Guante de nitrilo','Guante de látex','Mangas Kevlar','Calzado dieléctrico','Calzado con casquillo',
          'Botas de hule','Camisola','Traje retardante de fuego','Chaleco reflejante','Tyvek','Línea de vida doble','Arnés pullover','Puntos de anclaje','Línea de vida horizontal','Línea de vida vertical','Otro (especifique)']},
         {'t':'Maquinaria','it':['Montacargas','Grúa','Equipo para izar','Carro eléctrico','Plataforma de elevación','Máquina de soldar','Equipo de oxicorte','Esmeril / cortador / sierra','Barredora','Fregadora','Maquinaria pesada','Herramientas de poder','Otro (especifique)']},
         {'t':'Documentación adicional requerida','it':['Licencia multihabilidades','Licencia para equipo móvil','Permiso de corte y soldadura','Examen médico','Permiso de espacios confinados','Permiso de fin de semana','Formato de libranza','MSDS (materiales químicos)','DC-3 (STPS)','Otro (especifique)']},
         {'t':'Energías a controlar (bloqueo)','it':['Eléctrica','Neumática','Hidráulica','Química','Gravedad','Residual','Otro (especifique)']}],
    firmas=['Elaboró (contratista)','Aprobación EHS','Jefe de área'])
add(c='EHS-F-058',n='Análisis de riesgo de la actividad (trabajos de alto riesgo)',nk='NOM-009-STPS-2011',tipo='tabla',frec='Por evento',
    p='Desglose por actividad: riesgos identificados, medidas de seguridad y responsable. Anexo a la autorización de trabajos de alto riesgo.',
    campos=[['fecha','Fecha','date'],['folio','Folio de la autorización'],['area','Compañía / depto. / área']],
    cols=[['n','No.'],['act','Actividad a realizar'],['rie','Riesgos identificados'],['med','Medidas de seguridad'],['resp','Responsable']],nFilas=12,
    firmas=['Elaboró (contratista)','Aprobación EHS','Jefe de área'])

# ---------- NOM-019 ----------
add(c='EHS-F-059',n='Calendario anual de recorridos de la comisión de seguridad e higiene',nk='NOM-019-STPS-2011',tipo='programa',frec='Anual',orient='landscape',
    p='Programación mensual de los recorridos de verificación de la comisión.',
    campos=[['anio','Año del calendario'],['area','Centro de trabajo'],['resp','Coordinador de la comisión']],
    filas=[{'e':'Recorrido de verificación (ordinario)'},{'e':'Recorrido extraordinario'},{'e':'Reunión de la comisión'},{'e':'Seguimiento a acuerdos de recorridos anteriores'}],
    firmas=['Coordinador de la comisión','Secretario de la comisión','Gerencia'])

# ---------- NOM-030 ----------
add(c='EHS-F-060',n='Programa de seguridad y salud en el trabajo: relación de acciones preventivas o correctivas',nk='NOM-030-STPS-2009',tipo='tabla',frec='Anual',orient='landscape',
    p='Relación de acciones preventivas o correctivas con estatus, fechas y responsables (numerales 4.4 y 7.1 inciso a).',
    campos=[['fecha','Fecha de última revisión','date'],['prox','Fecha de próxima revisión','date'],['resp','Responsable del programa']],
    cols=[['acc','Acción preventiva o correctiva necesaria para el cumplimiento'],['tipo','Preventiva / Correctiva / No aplica'],['ini','Fecha de inicio'],['fin','Fecha de conclusión'],['resp','Responsable']],nFilas=12,
    firmas=['Responsable de SST','Coordinación EHS','Gerencia'])

# ---------- NOM-036 ----------
add(c='EHS-F-061',n='Análisis de factores de riesgo ergonómico: empuje y arrastre de cargas',nk='NOM-036-1-STPS-2018',tipo='tabla',frec='Anual / por cambio',
    p='Evaluación por color y valor de empuje y arrastre de cargas, sin equipo auxiliar (numeral 7.3). Complementa EHS-F-025.',
    campos=[['fecha','Fecha','date'],['area','Área de trabajo'],['puesto','Puesto de trabajo'],['resp','Evaluó']],
    cols=[['f','Factor de riesgo'],['rod','Rodando (color / valor)'],['gir','Girando sobre su base (color / valor)'],['arr','Arrastrando, jalando o deslizando (color / valor)']],
    filasFijas=['Peso de la carga','Postura','Agarre de la mano','Patrón de trabajo','Distancia por viaje','Superficie de trabajo','Obstáculos a lo largo de la ruta','Otros factores','Puntuación total','Nivel de riesgo (0-4 bajo · 5-12 medio · 13-20 alto · 21-32 muy alto)'],
    firmas=['Evaluó','Coordinación EHS','Gerencia'])

# ---------- Accidentes ----------
add(c='EHS-F-062',n='Investigación de accidentes de trabajo (informe del trabajador, testigos y supervisor)',nk='ISO 45001:2018',tipo='acta',frec='Por evento',
    p='Informe médico, relato del trabajador, testigos y análisis de causa raíz del supervisor (por qué 1 al 5), tipo de riesgo y acto inseguro. Complementa EHS-F-032.',
    campos=[['fecha','Fecha del accidente','date'],['area','Departamento / área'],['resp','Supervisor'],['emp','Nombre y número del empleado']],
    bloques=[{'t':x,'rows':r} for x,r in [
     ('Datos generales: puesto, antigüedad, horario, turno, hora del riesgo, aviso inmediato, hora de atención y a quién avisó',4),
     ('I. Informe del servicio médico: diagnóstico, tipo de lesión, parte afectada, antecedentes, acción tomada y gravedad',6),
     ('II. Informe del trabajador: instrucciones de seguridad que recibe, cómo sucedió el riesgo (lugar, máquina, equipo, material) y medida sugerida para evitar la reocurrencia',7),
     ('III. Informe de testigos: nombres, números de empleado y descripción',4),
     ('IV. Informe del supervisor: qué ocurrió y por qué (1 al 5) hasta la causa raíz',8),
     ('Tipo de riesgo: golpeado por/contra, prensado, caída (mismo o diferente nivel), resbalón, tropezón, quemadura física/química, inhalación, ingestión, choque eléctrico, cortadura, esfuerzo excesivo, otro',3),
     ('Causa raíz y acto inseguro',4)]],
    firmas=['Trabajador','Supervisor','Coordinación EHS'])
