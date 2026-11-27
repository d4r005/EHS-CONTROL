# Tercer lote: estudios de riesgo, diagnostico, quimicos, EPP, residuos, botiquin, minuta
import json, os
OUT = os.environ.get('OUT_DIR', 'data/biblioteca')
nuevos, docs = [], []

nuevos.append(dict(c='EHS-F-070', n='Estudio para analizar el riesgo potencial de la maquinaria y equipo',
 nk='NOM-004-STPS-1999', tipo='tabla', frec='Por equipo / anual', orient='landscape',
 p='Grado de peligrosidad por máquina: peligro, riesgo, consecuencias, exposición, probabilidad y prioridad de atención.',
 campos=[['area','Área'],['maq','Máquina o equipo'],['pers','Número de personas en contacto'],['fecha','Fecha de evaluación','date'],['resp','Responsable de la evaluación']],
 cols=[['peligro','Peligro'],['riesgo','Riesgo'],['cons','Consecuencias'],['exp','Exposición'],['prob','Probabilidad'],
   ['grado','Grado de peligrosidad'],['clas','Clasificación del peligro'],['prio','Prioridad']],
 nFilas=14,
 nota='Grado de peligrosidad: 0 a 84 bajo, 85 a 199 medio, 200 a 249 alto, 250 a 399 muy alto, 400 o más extremo. Prioridad: bajo y medio son riesgo aceptable, alto y muy alto prioridad 1, extremo prioridad 2.',
 firmas=['Responsable de la evaluación','Depto. EHS','Gerencia']))

nuevos.append(dict(c='EHS-F-071', n='Estudio para analizar el riesgo potencial de sustancias químicas peligrosas',
 nk='NOM-005-STPS-1998', tipo='tabla', frec='Anual / por cambio', orient='landscape',
 p='Por sustancia: propiedades físico-químicas y toxicológicas, grado y tipo de riesgo, zonas de riesgo y trabajadores expuestos.',
 campos=[['area','Área o proceso'],['fecha','Fecha de evaluación','date'],['resp','Responsable de la evaluación']],
 cols=[['sust','Sustancia química'],['prop','Propiedades físicas, químicas y toxicológicas'],['grado','Grado y tipo de riesgo'],
   ['zonas','Zonas de riesgo'],['exp','Trabajadores expuestos']],
 nFilas=12,
 nota='Anexar las hojas de datos de seguridad (HDS) de cada sustancia y el croquis de zonas de riesgo.',
 firmas=['Responsable de la evaluación','Depto. EHS','Gerencia']))

nuevos.append(dict(c='EHS-F-072', n='Análisis de riesgos potenciales en actividades de corte y soldadura',
 nk='NOM-027-STPS-2008', tipo='acta', frec='Por evento / por puesto', orient='portrait',
 p='Análisis de riesgo del trabajo por puesto para corte y soldadura: equipos e insumos, condiciones peligrosas, agentes generados y medidas de control.',
 campos=[['area','Área del proceso'],['puesto','Proceso / subproceso'],['resp','Responsable de la evaluación'],['fecha','Fecha de evaluación','date']],
 bloques=[{'t':'1. Datos del puesto (área, proceso, subproceso, tipo de riesgo directo o indirecto, jornada laboral y tiempo de exposición)','rows':4},
   {'t':'2. Relación de los equipos y materiales empleados (tipo de soldadura, identificación del equipo, descripción e insumo)','rows':5},
   {'t':'3. Condiciones peligrosas (peligro y consecuencia)','rows':6},
   {'t':'4. Agentes químicos y físicos que se producen (agente y características)','rows':5},
   {'t':'5. Medidas de control y equipo de protección personal requerido','rows':5},
   {'t':'6. Conclusiones y acciones','rows':4}],
 firmas=['Responsable de la evaluación','Depto. EHS','Gerencia']))

nuevos.append(dict(c='EHS-F-073', n='Diagnóstico de seguridad y salud en el trabajo', nk='NOM-030-STPS-2009', tipo='tabla',
 frec='Anual', orient='landscape',
 p='Condiciones físicas peligrosas o inseguras, agentes del medio ambiente laboral y peligros circundantes, con la acción definida y su responsable.',
 campos=[['fecha','Fecha de última revisión','date'],['fecha2','Fecha de próxima revisión','date'],['resp','Elaboró']],
 cols=[['area','Área'],['cond','Condición física peligrosa o agente'],['cat','Instalación / proceso / maquinaria / equipo'],
   ['desc','Descripción del hallazgo'],['accion','Acción requerida'],['resp2','Responsable'],['fecha3','Fecha compromiso']],
 nFilas=14,
 nota='Peligros circundantes a considerar: epidemias o pandemias, fauna silvestre, incendios en colindancias, incendios internos y fenómenos naturales.',
 firmas=['Elaboró','Depto. EHS','Gerencia']))

nuevos.append(dict(c='EHS-F-074', n='Matriz de cumplimiento de requisitos normativos STPS', nk='NOM-030-STPS-2009', tipo='tabla',
 frec='Anual', orient='landscape',
 p='Cumplimiento por requisito de cada norma aplicable: responsable, periodicidad y fecha programada.',
 campos=[['fecha','Fecha de evaluación','date'],['resp','Coordinación EHS']],
 cols=[['norma','Norma'],['req','Requisito'],['cumple','Cumple (Sí / No / Parcial)'],['resp2','Responsable'],
   ['per','Periodicidad'],['fecha2','Fecha programada'],['evid','Evidencia']],
 nFilas=16,
 firmas=['Coordinación EHS','Gerencia']))

nuevos.append(dict(c='EHS-F-075', n='Listado de sustancias químicas peligrosas', nk='NOM-018-STPS-2015', tipo='tabla',
 frec='Anual / por cambio', orient='landscape',
 p='Inventario de sustancias: nombre, CAS, clasificación de peligros, estado físico, contenedor, consumo mensual y área de uso.',
 campos=[['fecha','Fecha de actualización','date'],['resp','Elaboró']],
 cols=[['q','Químico'],['cas','CAS'],['clas','Clasificación de peligros'],['estado','Estado físico'],
   ['cont','Tipo de contenedor y capacidad'],['cons','Consumo mensual'],['area','Área de uso']],
 nFilas=16,
 firmas=['Elaboró','Depto. EHS','Gerencia']))

nuevos.append(dict(c='EHS-F-076', n='Análisis de riesgo de trabajo por puesto de trabajo', nk='NOM-017-STPS-2008', tipo='tabla',
 frec='Por puesto / por cambio', orient='landscape',
 p='Valoración por riesgo del puesto (0 sin riesgo, 1 muy bajo, 2 bajo, 3 medio, 4 alto), región anatómica a proteger y EPP requerido.',
 campos=[['area','Área de trabajo'],['puesto','Puesto de trabajo'],['pers','Número de trabajadores'],['fecha','Fecha de evaluación','date'],['resp','Responsable de la evaluación']],
 cols=[['riesgo','Riesgo'],['eval','Evaluación (0 a 4)'],['region','Región anatómica a proteger'],['epp','EPP requerido'],
   ['control','Control adicional'],['resp2','Responsable'],['fecha2','Fecha compromiso']],
 nFilas=16,
 nota='0 = sin riesgo, 1 = muy bajo, 2 = bajo, 3 = medio, 4 = alto.',
 firmas=['Responsable de la evaluación','Depto. EHS','Gerencia']))

nuevos.append(dict(c='EHS-F-077', n='Registro de equipo de protección personal por puesto de trabajo', nk='NOM-017-STPS-2008', tipo='tabla',
 frec='Por puesto / por cambio', orient='landscape',
 p='EPP asignado a cada puesto y a cada persona, con talla, fecha de entrega y firma de recibido.',
 campos=[['area','Área'],['fecha','Fecha de elaboración','date'],['resp','Elaboró']],
 cols=[['puesto','Puesto'],['nombre','Nombre de la persona'],['epp','EPP requerido'],['talla','Talla'],
   ['fecha2','Fecha de entrega'],['estado','Estado del EPP'],['firma','Firma de recibido']],
 nFilas=16,
 firmas=['Elaboró','Depto. EHS','Gerencia']))

nuevos.append(dict(c='EHS-F-078', n='Programa de mantenimiento de racks y estanterías', nk='NOM-006-STPS-2014', tipo='tabla',
 frec='Mensual', orient='landscape',
 p='Revisión de racks y estanterías: deformaciones, daños, estiba riesgosa, verticalidad, estabilidad y modificaciones a la estructura.',
 campos=[['area','Almacén o área'],['fecha','Fecha de revisión','date'],['resp','Personal responsable']],
 cols=[['rack','Rack o estantería'],['def','Deformaciones'],['dano','Dañada, desgastada o en condición insegura'],
   ['estiba','Estiba riesgosa'],['mod','Se realizó alguna modificación a la estructura'],
   ['vert','Está totalmente vertical'],['inest','Inestable'],['accion','Acción tomada y fecha']],
 nFilas=14,
 firmas=['Personal responsable','Depto. EHS','Gerencia']))

nuevos.append(dict(c='EHS-F-079', n='Bitácora de entradas y salidas de residuos peligrosos', nk='NOM-052-SEMARNAT-2005', tipo='tabla',
 frec='Continua', orient='landscape',
 p='Almacén temporal de residuos peligrosos: generación, almacenamiento, manejo, manifiesto y prestador de servicio.',
 campos=[['anio','Año'],['reg','Número de registro ambiental'],['resp','Responsable del almacén']],
 cols=[['res','Nombre del residuo peligroso'],['cant','Cantidad generada (kg)'],['area','Área de generación'],
   ['car','Característica de peligrosidad'],['ing','Fecha de ingreso'],['sal','Fecha de salida'],
   ['fase','Fase siguiente a la salida del almacén'],['prest','Prestador de servicio'],['man','Manifiesto']],
 nFilas=16,
 nota='Características de peligrosidad: corrosivo (C), reactivo (R), explosivo (E), tóxico (T), inflamable (I).',
 firmas=['Responsable del almacén','Depto. EHS','Gerencia']))

nuevos.append(dict(c='EHS-F-080', n='Bitácora de entradas y salidas de residuos de manejo especial', nk='LGPGIR', tipo='tabla',
 frec='Continua', orient='landscape',
 p='Residuos de manejo especial: recolección, transportista, etapa siguiente y sitio final con su autorización.',
 campos=[['anio','Año'],['reg','Número de autorización de generador'],['resp','Responsable']],
 cols=[['fecha','Fecha de recolección'],['res','Nombre del residuo'],['cant','Cantidad'],['prov','Proveedor de recolección'],
   ['aut','Número de autorización'],['etapa','Última etapa de manejo'],['emp','Nombre de la empresa y sitio final'],['aut2','Autorización del sitio final']],
 nFilas=16,
 nota='Última etapa de manejo: compra-venta, reciclaje o disposición final.',
 firmas=['Responsable','Depto. EHS','Gerencia']))

nuevos.append(dict(c='EHS-F-081', n='Revisión del botiquín de primeros auxilios', nk='NOM-005-STPS-1998', tipo='check',
 frec='Mensual', orient='portrait',
 p='Check list del botiquín: señalización, estado del gabinete, medicamentos e insumos completos y vigentes.',
 campos=[['area','Ubicación del botiquín'],['fecha','Fecha de revisión','date'],['resp','Evaluador']],
 sec=[{'t':'Botiquín','it':['El botiquín se encuentra señalizado y en su lugar','Libre de daños físicos como grietas, roto, dañado o desgastado en su estructura','Libre de obstrucciones']},
  {'t':'Contenido','it':['Alcohol antiséptico','Guantes de látex en buen estado','Gasas estériles en su paquete','Termómetro de mercurio o digital','Vendas de algodón 5 x 5','Vendas de algodón 3 x 5','Venda elástica 2 x 5','Venda elástica 5 x 5','Bote de yodo','Antisépticos (yodo povidona, agua oxigenada o alcohol)','Desinfectante para manos','Tijeras y/o pinzas','Hisopos (cotonetes)','Cinta adhesiva','Otro contenido (especificar en observaciones)']}],
 firmas=['Evaluador','Depto. EHS']))

nuevos.append(dict(c='EHS-F-082', n='Auditoría mensual de equipo para derrame', nk='ISO 14001:2015', tipo='check',
 frec='Mensual', orient='portrait',
 p='Revisión del kit de atención a derrames por punto: absorbentes, cordones, almohadillas, guantes y contención.',
 campos=[['area','Punto o área'],['fecha','Fecha de auditoría','date'],['resp','Inspeccionado por'],['puesto','Puesto']],
 sec=[{'t':'Equipo de derrames','it':['Láminas absorbentes','Cordones o calcetines absorbentes','Almohadillas absorbentes','Guantes de nitrilo','Bolsas para residuos','Pala y escoba','Contenedor o tambo para residuos','Señalización del punto de derrame','El equipo está completo y en buen estado','El personal del área sabe cómo usarlo']},
  {'t':'Acciones correctivas','it':['Se generaron acciones correctivas (registrar en observaciones)','Se repuso el material faltante','Se actualizó el inventario del kit']}],
 firmas=['Inspeccionado por','Asignado de HSE']))

nuevos.append(dict(c='EHS-F-083', n='Análisis de factores de riesgo ergonómico: levantamiento de cargas',
 nk='NOM-036-1-STPS-2018', tipo='tabla', frec='Por actividad / anual', orient='landscape',
 p='Estimación del riesgo por levantamiento manual de cargas: peso y frecuencia, distancia de la mano a la espalda, torsión, agarre y superficie de trabajo.',
 campos=[['area','Área analizada'],['puesto','Puesto analizado'],['pers','Trabajadores expuestos'],['peso','Peso analizado (kg)'],
   ['dur','Duración de la actividad'],['frec','Frecuencia de la actividad'],['fecha','Fecha','date'],['resp','Realizado por']],
 cols=[['factor','Factor de riesgo'],['valor','Valor (0 a 4)'],['nota','Condición observada'],['accion','Acción requerida']],
 nFilas=12,
 nota='Factores: peso de la carga y frecuencia, distancia de la mano desde la espalda, región de levantamiento vertical, torsión o doblez lateral del tronco, restricciones de postura, agarre de la carga, superficie de trabajo y otros factores ambientales.',
 firmas=['Realizado por','Depto. EHS','Gerencia']))

nuevos.append(dict(c='EHS-F-084', n='Minuta de reunión de la comisión de seguridad e higiene', nk='NOM-019-STPS-2011', tipo='acta',
 frec='Mensual', orient='portrait',
 p='Minuta de la comisión: asistencia, índices de frecuencia, semáforo de seguridad, tema cubierto y acuerdos con responsable y fecha de vencimiento.',
 campos=[['area','Sucursal'],['dom','Domicilio'],['pers','Número de trabajadores'],['tipo','Tipo de recorrido (ordinario o extraordinario)'],
   ['fecha','Fecha y hora de inicio','date'],['fin','Fecha y hora de término'],['resp','Presidente de la comisión']],
 bloques=[{'t':'Áreas de trabajo donde se realizó el recorrido de verificación','rows':2},
   {'t':'Miembros de la comisión e invitados asistentes (nombre, departamento y firma)','rows':6},
   {'t':'Actualización del progreso del site','rows':4},
   {'t':'Índices de seguridad (frecuencia de accidentes mensual y anual, color del semáforo de seguridad, fecha del último incidente registrable, tema de seguridad cubierto)','rows':4},
   {'t':'Puntos tratados y acuerdos (punto, discusión y descripción de la acción, responsable y fecha de vencimiento)','rows':8},
   {'t':'Observaciones y asuntos pendientes','rows':4}],
 firmas=['Presidente de la comisión','Secretario de la comisión','Gerencia']))

docs = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'docs_d.json')))
json.dump({'nuevos': nuevos, 'docs': docs}, open(os.path.join(OUT, 'formatos_d.json'), 'w'), ensure_ascii=False, indent=1)
for f in nuevos:
    print(f['c'], f['tipo'], f['n'][:56])
for d in docs:
    print(d['c'], 'DOC', d['n'][:56])
