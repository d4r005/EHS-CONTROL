# EHS Control

Sistema de gestión de Seguridad, Higiene y Medio Ambiente enfocado en los formatos aplicados a las normas vigentes en México.

Aplicación web de un solo archivo (`index.html`), sin dependencias externas ni paso de build. Funciona abriendo el archivo en el navegador o publicada como sitio estático.

## Alcance normativo

- **35 NOM de seguridad y salud en el trabajo de la STPS** (de las 41 vigentes; las de producto no se incluyen), con aplicabilidad configurable por centro de trabajo.
- **ISO 14001:2015** e **ISO 45001:2018**.
- **Trámites IMSS/STPS:** ST-7, ST-2/ST-3, DC-3, DC-5, comisión de seguridad e higiene.

## Módulos

| Módulo | Qué resuelve |
|---|---|
| Panel | Cobertura de evidencia por norma, hallazgos abiertos/vencidos, incidentes del año, registros y capacitación |
| Marco normativo | Catálogo completo con aplicabilidad por centro de trabajo, requisitos clave, evidencias y formatos ligados |
| Formatos | 99 formatos imprimibles (EHS-F-001 a EHS-F-099): listas de verificación, tablas, actas, programas anuales con matriz de 12 meses, permisos de trabajo con selección múltiple y cuestionarios Sí/No con el diseño F-SH: encabezado con logo, barra dorada de título, bloque de control (código, revisión, fecha, página), tabla de verificación C/NC/N/A y firmas. Tres hojas conservan el diseño del documento original: el organigrama de brigada (tarjetas verde, azul, amarillo y rojo en cuatro columnas), el permiso de trabajo (recuadros de color por tipo de trabajo, evaluación y precauciones en dos columnas, dos páginas) y la evaluación del simulacro (tabla Observaciones / Sí / No / Explique) |
| Etiquetas | Etiquetas de sustancias químicas y de residuos peligrosos, con vista previa e impresión de 4 por hoja |
| Brigadas | Organigrama de la brigada de emergencias, con integrantes y funciones editables e impresión |
| Documentos | 11 programas, procedimientos, manuales, planes e instructivos (EHS-D-001 a 009) con el texto íntegro de los documentos F-SH / D-SH, imprimibles con el encabezado de la empresa |
| Registros | Documentos llenados, búsqueda, reimpresión y exportación |
| Hallazgos | Generación automática desde NC en listas de verificación, responsable, fecha compromiso, cierre |
| Incidentes | Registro, días de incapacidad, control de aviso ST-7 |
| Comisión SST | Integrantes, actas de constitución y recorrido, programa anual (NOM-019) |
| Sustancias químicas | Inventario, SDS, etiquetado GHS (NOM-005 / NOM-018) |
| Capacitación | DC-3, horas, matriz de necesidades |
| Organización y datos | Razón social, centro de trabajo, responsable, respaldo y restauración |

## Uso

1. Abre `index.html` en Chrome, Edge o Safari (doble clic basta).
2. En **Organización y datos** captura la razón social, el centro de trabajo y el responsable EHS. Esos datos alimentan el encabezado y pie de todos los formatos impresos.
3. En **Marco normativo** marca las normas que aplican a tu centro de trabajo.
4. En **Formatos** abre el formato que necesitas y llénalo.
5. Al marcar **NC** en una lista de verificación, describe la condición y genera hallazgos con un clic.
6. Imprime o guarda en PDF desde cualquier registro: el formato sale en hoja carta con firmas.

## Publicación

### Cloudflare Pages (recomendado)

1. Cloudflare Pages → Create project → Direct Upload.
2. Arrastra esta carpeta o el ZIP.
3. Sin build: es un solo `index.html` autocontenido.
4. Opcional: conecta este repositorio para que cada commit publique.

### Cloudflare Pages (sitio en producción)

- URL: https://ehs-control.pages.dev
- Proyecto de tipo *Direct Upload*: se sube el contenido de esta carpeta.
- Opcional recomendado: en Cloudflare, *Connect to Git* apuntando a este repositorio (`main`), para que cada push publique solo.

### GitHub Pages (alternativa)

1. Settings → Pages → Source: *Deploy from a branch*.
2. Branch `main`, carpeta `/ (root)`.
3. El sitio queda en `https://d4r005.github.io/EHS-CONTROL/`.

## Multiempresa y marca

Cada empresa (o centro de trabajo) es un renglón de `ehs_centros` con sus propios datos en `ehs_estado`. En la barra lateral, el selector bajo el logo permite cambiar de empresa y el botón **+** crea una nueva con su espacio de datos independiente.

Cada empresa guarda su logo (`logo`, data URI PNG de hasta 320 px) y su color (`color`, hexadecimal). Se editan en **Organización y datos → Marca de la empresa**; el logo se redimensiona en el navegador antes de guardarse.

El logo de la empresa y su color se usan en los formatos impresos: encabezado, barra de título, filete superior y encabezados de tabla. El logo de EHS Control aparece en la barra lateral y en la pantalla de acceso.

## Diseño de los formatos

La hoja impresa sigue el patrón de los formatos F-SH de la empresa: logo en el encabezado, nombre de la razón social y "Seguridad y Salud en el Trabajo", barra dorada (#ECB324) con el nombre del formato y la norma, bloque de control documental, tabla con encabezado dorado claro, bloque de firmas y pie con código y revisión. El logo va embebido como data URI para que el archivo siga siendo autocontenido.

En **Formatos → Ver** se muestra la hoja tal como se imprime, a escala.

## Acceso

La app pide iniciar sesión con Supabase Auth (correo y contraseña). Los usuarios se administran en Supabase → Authentication → Users. Sin sesión no se puede ver ni editar nada.

## Datos

Los registros se guardan en Supabase y se sincronizan entre equipos al iniciar sesión. `localStorage` queda solo como caché local para arrancar rápido.

- **Respaldo:** Organización y datos → *Descargar respaldo (.json)*.
- **Restauración:** *Cargar respaldo* en el mismo apartado.
- Los cambios se empujan solos ~0.7 s después de cada edición; el indicador junto al correo muestra *Guardado* / *Guardando…* / *Sin guardar*.
- **Control de versión:** el guardado pasa por `ehs_guardar_estado(centro, data, version)`. Si alguien más guardó antes, la app avisa del conflicto y ofrece recargar en lugar de pisar el cambio. Cada guardado deja renglón en `ehs_auditoria`.

## Supabase

Proyecto: `brhnoixerulcdpvtoxra` (us-west-2). Esquema versionado en `supabase/migrations/`.

| Tabla | Contenido |
|---|---|
| `ehs_centros` | Razón social, centro de trabajo, responsable, año |
| `ehs_estado` | Estado completo del sistema por centro (`data` jsonb: org, normas, docs, hallazgos, incidentes, químicos, capacitación, comisión) |
| `ehs_respaldos` | Historial de respaldos JSON |
| `ehs_cobertura` (vista) | Conteo de registros, hallazgos, incidentes y capacitaciones por centro |

Las tres tablas tienen RLS activo y solo permiten acceso a usuarios autenticados; con la clave anónima la API responde `permission denied`. La app ya está conectada: inicia sesión, lee y escribe en `ehs_estado` del centro correspondiente.

La clave publicable (`sb_publishable_…`) va embebida en `index.html` porque es pública por diseño; la seguridad depende de RLS y del login, nunca de esa clave. La `service_role` **no** debe aparecer en el repo.

## Ergonomía y manejo de materiales (actualización)

Los formatos de la NOM-036-1-STPS-2018 y la NOM-006-STPS-2023 se alinearon con el texto vigente del DOF y sus numerales:

| Formato | Contenido | Numerales |
|---|---|---|
| EHS-F-064 | Empuje, arrastre y jalado de cargas (Apéndice II) | 7.3 b) |
| EHS-F-083 | Levantamiento, descenso y transporte (Apéndice I) | 7.3 a) |
| EHS-F-089 | Informe del análisis de factores de riesgo ergonómico | 7.1 a 7.7 |
| EHS-F-090 | Programa de ergonomía para el manejo manual de cargas | 8.5, 8.6, 8.7 |
| EHS-F-091 | Vigilancia a la salud y aptitud física | 9.1 a 9.5, 8.1 |
| EHS-F-092 | Programa de revisión y mantenimiento de la maquinaria | 5.1, 7.1 |
| EHS-F-093 | Registro de revisión y mantenimiento de la maquinaria | 5.10, 7.1 |
| EHS-F-094 | Revisión visual y prueba funcional por jornada | 8.1 |
| EHS-F-095 | Autorización del patrón a operadores | 7.4 k), 10.2, 10.3 |
| EHS-F-096 | Condiciones de seguridad en áreas de almacenamiento | 9.2 a 9.4 |
| EHS-F-097 | Elementos estructurales, estantes y plataformas | 9.4 a) a l) |

Pendiente en el catálogo: EHS-F-076 y EHS-F-077 todavía citan NOM-017-STPS-2008; la vigente es la NOM-017-STPS-2024.

## Notas de vigencia

- **NOM-017-STPS-2024** sustituye a la NOM-017-STPS-2008 (EPP).
- **NOM-017-STPS-2024** toma la estructura de los formatos F-SH-017 de la empresa: análisis de riesgos por puesto y área con determinación de EPP (5.1 y 5.2), matriz de EPP por región anatómica (5.2) y registro de revisión, reposición, limpieza, mantenimiento, resguardo y disposición final (5.12).
- **NOM-006-STPS-2023** sustituye a la NOM-006-STPS-2000 (almacenamiento y manejo de materiales mediante maquinaria). No existe una NOM-006-STPS-2014.
- **NOM-036-1-STPS-2018** es la clave correcta de la Parte 1 (manejo manual de cargas); el catálogo la tenía abreviada como NOM-036-STPS-2018. No hay Parte 2 publicada en el DOF.
- **NOM-005-STPS-2025** está publicada como proyecto y sustituirá a la NOM-005-STPS-1998. Confirma la publicación definitiva en el DOF antes de ajustar formatos.

## Estructura

```
.
├── index.html                      # aplicación completa (UI, catálogo normativo, formatos, auth y sincronización)
├── _headers                        # cabeceras de seguridad para Cloudflare Pages
├── data/normas.js                  # catálogo de verificación por norma (fuente única; genera normas.json)
├── data/normas.json                # catálogo exportado (build.js)
├── js/formatos.js                  # generador de formato imprimible + conversión NC → hallazgo
├── tests/catalogo.test.js          # 5 pruebas del catálogo y del generador
├── tests/biblioteca.test.js        # integridad de formatos y documentos incrustados en index.html
├── data/biblioteca/                # formatos.json y docs.json generados desde la carpeta Formatos
├── tools/biblioteca/               # scripts que regeneran el bloque AUTOGEN y los tipos nuevos de index.html
├── build.js                        # regenera data/normas.json
├── package.json                    # scripts build y test
├── .github/workflows/ci.yml        # CI: pruebas + revisión de que no haya llaves service_role
├── supabase/migrations/
│   ├── 0001_init.sql               # tablas, RLS y vista de cobertura
│   ├── 0002_grants.sql             # permisos del rol authenticated
│   ├── 0003_version_auditoria_respaldos.sql   # versionado optimista, auditoría y respaldo diario
│   ├── 0004_roles_por_centro.sql   # plantilla de roles (no aplicada)
│   └── 0005_marca_empresa.sql      # logo y color por empresa
└── README.md
```

## Catálogo de verificación (`data/normas.js`)

Módulo independiente con las 35 NOM, cada una con su lista de verificación y su estado de vigencia. Cubre exactamente las mismas NOM que el catálogo de `index.html`; la prueba `tests/catalogo_drift.test.js` falla si se desfasan. ISO 14001, ISO 45001 y los trámites IMSS/STPS solo existen en la app, porque no son NOM.

Pendientes antes de usarlo en auditoría:

- Solo NOM-017-STPS-2024 y NOM-006-STPS-2023 están con vigencia confirmada; el resto está como `por_validar` y hay que contrastarlo con el DOF.
- Los requisitos están en lenguaje sencillo y falta el numeral de cada uno.
- Los requisitos de las 12 normas agregadas el 2026-11-27 (003, 008, 012, 013, 014, 016, 023, 028, 031, 032, 034 y 037) se tomaron del texto publicado en el DOF y cada `nota` de vigencia cita su fecha de publicación y los numerales usados; conviene una revisión de fondo antes de usarlas en auditoría.
- La NOM-003-STPS-2023 abroga la NOM-007-STPS-2000, por eso 007 no aparece en el catálogo.

```bash
npm test          # corre las pruebas del catálogo y de la biblioteca
npm run build     # regenera data/normas.json desde normas.js
```
