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

## Segundo lote (PTR, simulacro, IPER, brigadas)

```bash
python3 tools/biblioteca/make_formatos_c.py   # -> data/biblioteca/formatos_c.json
python3 tools/biblioteca/parche_tipos.py      # tipos "seleccion" y "cuestionario" + vista Brigadas
python3 tools/biblioteca/integrar.py          # reescribe el bloque AUTOGEN
npm test
```

`parche_tipos.py` también es idempotente: reemplaza sus bloques `@@TIPOS-*@@`.

## Tercer lote (estudios de riesgo, residuos, etiquetas)

```bash
python3 tools/biblioteca/make_formatos_d.py   # -> data/biblioteca/formatos_d.json (+ docs_d.json)
python3 tools/biblioteca/integrar.py
python3 tools/biblioteca/parche_tipos.py
npm test
```

`docs_d.json` guarda los documentos largos del lote para no pelear con comillas en Python.
