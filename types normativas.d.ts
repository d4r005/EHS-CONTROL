// Type definitions for EHS-CONTROL normative data

// Estado de vigencia de una norma
export type VigenciaEstado = "confirmada" | "por_validar";

// Estructura de una norma del catálogo
export interface Norma {
  codigo: string;           // Ej: "NOM-001-STPS-2008"
  tema: string;            // Descripción del tema
  tipo: "seguridad" | "salud" | "organizacion";
  vigencia: {
    estado: VigenciaEstado;
    nota?: string;         // Observaciones sobre su vigencia
  };
  formato: {
    id: string;            // Ej: "EHS-001-F01"
    nombre: string;        // Nombre del formato
    periodicidad: string;  // Frecuencia de revisión
    items: string[];       // Lista de requisitos/items
  };
  r?: string[];            // Requisitos adicionales (opcional, algunos registros no lo tienen)
}

// Estructura de un formato en la biblioteca
export interface Formato {
  c: string;               // Código corto: "EHS-F-001"
  n: string;               // Nombre completo
  nk: string;              // Clave de norma asociada: "NOM-001-STPS-2008"
  tipo: "check" | "tabla" | "acta"; // Tipo de formato
  frec: string;            // Frecuencia: "Mensual", "Anual", "Por evento", etc.
  p: string;               // Propósito/descripción del formato
  sec?: {
    t: string;             // Título de la sección
    ref?: string;          // Referencia a norma
    it: string[];          // Items/lista de verificación
  }[];
  bloques?: {
    t: string;
    rows?: number;
  }[];
  firmas?: string[];       // Nombres de firmas requeridas
}

// Estados de un documento/hallazgo
export type DocumentoEstado = "Abierto" | "Cerrado";
export type Prioridad = "Alta" | "Media" | "Baja";

// Datos de organización por centro de trabajo
export interface DatosOrganizacion {
  nombre: string;          // Razón social
  centro: string;          // Centro de trabajo
  resp: string;            // Responsable EHS
  puesto: string;          // Puesto del responsable
  anio: number;            // Año actual
}

// Estado global del sistema (localStorage)
export interface EHSState {
  org: DatosOrganizacion;
  normas: Record<string, boolean>; // ¿Norma aplicable por centro? (clave: código NOM)
  docs: Documento[];
  hallazgos: Hallazgo[];
  incidentes: Incidente[];
  quimicos: Sustanciaquimica[];
  capacitacion: Capacitacion[];
  comision: IntegranteComision[];
}

// Documento llenado (formato en progreso)
export interface Documento {
  id: string;              // UUID único
  c: string;               // Código formato: "EHS-F-001"
  n: string;               // Nombre formato
  nk: string;              // Norma asociada
  tipo: "check" | "tabla" | "acta";
  fecha: string;           // Fecha ISO YYYY-MM-DD
  estado: DocumentoEstado;
  creado: string;          // Timestamp ISO
  f?: {
    [key: string]: string; // Campos base: fecha, area, resp, turno
  };
  it?: {
    [key: string]: "C" | "NC" | "NA"; // Items de verificación check
  };
  tb?: string[][];         // Datos de tablas
  bl?: string[];           // Bloques de texto (actas)
  ob?: {
    [key: string]: string; // Observaciones por item
  };
}

// Hallazgo generado desde un NC
export interface Hallazgo {
  id: string;              // UUID único
  folio: string;           // "H-001", "H-002", etc.
  desc: string;            // Descripción del hallazgo
  detalle?: string;        // Condición encontrada (observación)
  norma: string;           // Código NOM origen
  origen: string;          // "EHS-F-001 · Inspección de..."
  area: string;            // Área donde se encontró
  resp: string;            // Responsable asignado
  fecha: string;           // Fecha hoy
  fechaComp?: string;      // Fecha compromiso (cuando se cierra)
  prioridad: Prioridad;    // Alta/Media/Baja
  estado: DocumentoEstado; // Abierto/En proceso/Cerrado
  docId: string;           // ID del documento origen
  item?: string;           // ID del item en el formato
}

// Sustancia química en inventario
export interface Sustanciaquimica {
  id: string;
  nom: string;             // Nombre de la sustancia
  prov?: string;           // Proveedor
  area: string;            // Área de uso
  cant?: string;           // Cantidad
  uni?: string;            // Unidad (kg, L, pza, mL, g)
  ghs?: string;            // Pictograma GHS
  sds: "Sí" | "No";        // ¿Tiene SDS en español?
  etiqueta: "Sí" | "No";   // ¿Etiqueta GHS vigente?
  epp?: string;            // EPP requerido
}

// Integrante de la comisión SST
export interface IntegranteComision {
  id: string;
  nombre: string;
  puesto?: string;
  rep: "Patrón" | "Personas trabajadoras";
  periodo?: string;
}

// Registro de capacitación
export interface Capacitacion {
  id: string;
  curso: string;
  norma?: string;          // Código NOM o requisito
  fecha: string;           // Fecha ISO
  hrs: number;             // Horas
  persona: string;         // Persona capacitada
  instructor?: string;     // Instructor / agente capacitador
  dc3: "Sí" | "No";        // ¿Se emitió DC-3?
  calif?: string;          // Calificación o evaluación
}

// Incidente laboral
export interface Incidente {
  id: string;
  fecha: string;           // Fecha ISO
  tipo: string;            // Tipo de evento
  area: string;            // Área involucrada
  desc: string;            // Descripción
  lesion?: string;         // Tipo de lesión/dano
  dias?: number;           // Días de incapacidad
  st7: "Sí" | "No" | "Por determinar"; // Aviso ST-7
  estado: "Abierta" | "En investigación" | "Cerrada";
  causaRaiz?: string;      // Causa raíz (opcional)
}

// Columnas de tablas de formato
export interface ColumnaTabla {
  [key: string]: string;   // Par clave-valor por columna
}