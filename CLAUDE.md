# EHS Control - Auto Modo

## Configuración automática

Este proyecto tiene el modo automático habilitado mediante `.claude/settings.json`.

### Idioma
- Todos los comentarios y documentación están en español (`language: es`).

### Permisos
- `allowBash`: true — comandos de shell permitidos
- `allowNetwork`: false — llamadas de red bloqueadas por defecto
- `allowFileOps`: true — operaciones de archivo permitidas

### Ganchos
- `onTaskComplete`: notificar al completar tareas
- `onPermissionPrompt`: recordar la decisión para prompts futuros

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm test` | Pruebas del catálogo normativo y de la biblioteca de formatos y documentos |
| `npm run build` | Regenera `data/normas.json` desde `data/normas.js` |

## Estructura del proyecto

```
.
├── index.html          # Aplicación SPA completa (UI, catálogo, formatos, auth, impresión)
├── data/normas.js      # Catálogo de 23 NOM con estados de vigencia
├── data/normas.json    # Versión exportada (generada por build.js)
├── js/formatos.js      # Generador de formatos imprimibles + lógica de hallazgos
├── tests/catalogo.test.js  # 5 pruebas devalidación
├── build.js            # Regenera data/normas.json desde normas.js
├── package.json        # Scripts build y test
├── .github/workflows/ci.yml  # CI: pruebas + validación de service_role
└── supabase/migrations/ # Esquema DB con RLS y vista de cobertura
```

## Módulos de la aplicación

- **Panel** — Resumen de cumplimiento, hallazgos abiertos/vencidos, incidentes, registros
- **Marco normativo** — Catálogo con 35 NOM + ISO 14001/45001 + trámites IMSS, aplicabilidad por centro
- **Formatos** — 69 formatos imprimibles (EHS-F-001 a EHS-F-069), llenables en navegador; tipos: check, tabla, acta, programa, seleccion, cuestionario
- **Brigadas** — organigrama de la brigada de emergencias (integrantes y funciones editables)
- **Documentos** — 9 programas, procedimientos, manuales y planes (EHS-D-001 a 009), lectura e impresión
- **Registros** — Búsqueda, reimpresión, exportación de documentos llenados
- **Hallazgos** — Generación automática desde NC, seguimiento con responsable/fecha compromiso
- **Incidentes** — Registro con días de incapacidad, control de aviso ST-7
- **Comisión SST** — Integrantes, actas, programa anual (NOM-019)
- **Sustancias químicas** — Inventario, SDS, etiquetado GHS (NOM-005 / NOM-018)
- **Capacitación** — DC-3, horas, matriz de necesidades
- **Organización y datos** — Razón social, centro de trabajo, responsable, respaldo y restauración

## Uso

1. Abre `index.html` en Chrome, Edge o Safari (doble clic basta).
2. Inicia sesión con Supabase Auth (correo y contraseña).
3. En **Organización y datos** captura la razón social, centro de trabajo y responsable.
4. En **Marco normativo** marca las normas que aplican a tu centro de trabajo.
5. En **Formatos** abre el formato que necesitas y llénalo.
6. Al marcar **NC** en una lista de verificación, describe la condición y genera hallazgos con un clic.
7. Imprime o guarda en PDF desde cualquier registro: el formato sale en hoja carta con firmas.

## Publicación

### Cloudflare Pages (recomendado)
1. Cloudflare Pages → Create project → Direct Upload.
2. Arrastra esta carpeta o el ZIP.
3. Sin build: es un solo `index.html` autocontenido.

### GitHub Pages (alternativa)
1. Settings → Pages → Source: Deploy from a branch.
2. Branch `main`, carpeta `/ (root)`.
3. El sitio queda en `https://d4r005.github.io/EHS-CONTROL/`.