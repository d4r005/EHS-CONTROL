# Biblioteca de formatos y documentos

Genera, desde la carpeta de referencia `Formatos/` (archivos F-SH / D-SH en Excel y Word), los datos que usa `index.html`.

```bash
# desde la raíz del repo, con la carpeta Formatos/ descomprimida en ./Formatos
pip install openpyxl python-docx
export FORMATOS_DIR=Formatos
python3 tools/biblioteca/docs_from_docx.py     # -> data/biblioteca/docs.json     (9 documentos Word)
python3 tools/biblioteca/make_formatos.py      # -> data/biblioteca/formatos.json (formatos Excel)
python3 tools/biblioteca/integrar.py           # reescribe el bloque AUTOGEN de index.html
npm test
```

- `integrar.py` es idempotente: reemplaza el bloque entre `@@AUTOGEN-INICIO@@` y `@@AUTOGEN-FIN@@`.
- No edites a mano ese bloque; cambia los scripts y regenera.
- Los formatos nuevos reciben códigos `EHS-F-045` en adelante. `EHS-F-001` a `044` son los previos.
