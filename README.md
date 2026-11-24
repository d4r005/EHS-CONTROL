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
| Formatos | 37 formatos imprimibles (EHS-F-001 a EHS-F-037) en hoja carta con firmas |
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

## Acceso

La app pide iniciar sesión con Supabase Auth (correo y contraseña). Los usuarios se administran en Supabase → Authentication → Users. Sin sesión no se puede ver ni editar nada.

## Datos

Los registros se guardan en Supabase y se sincronizan entre equipos al iniciar sesión. `localStorage` queda solo como caché local para arrancar rápido.

- **Respaldo:** Organización y datos → *Descargar respaldo (.json)*.
- **Restauración:** *Cargar respaldo* en el mismo apartado.
- Los cambios se empujan solos ~0.7 s después de cada edición; el indicador junto al correo muestra *Guardado* / *Guardando…* / *Sin guardar*.
- Conflicto: gana la última escritura. Si dos coordinadores editan el mismo centro al mismo tiempo, se pierde la versión anterior del que guardó primero.

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

## Notas de vigencia

- **NOM-017-STPS-2024** sustituye a la NOM-017-STPS-2008 (EPP).
- **NOM-006-STPS-2023** sustituye a la NOM-006-STPS-2000 (manejo de materiales con maquinaria).
- **NOM-005-STPS-2025** está publicada como proyecto y sustituirá a la NOM-005-STPS-1998. Confirma la publicación definitiva en el DOF antes de ajustar formatos.

## Estructura

```
.
├── index.html                      # aplicación completa (UI, catálogo normativo, formatos, auth y sincronización)
├── supabase/migrations/
│   ├── 0001_init.sql               # tablas, RLS y vista de cobertura
│   └── 0002_grants.sql             # permisos del rol authenticated
└── README.md
```
