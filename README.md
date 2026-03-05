# Interfaz estilo Mac para Android + Google Drive

UI web responsive (estética macOS) con **3 botones** para navegar carpetas compartidas de Google Drive.

## Configuración

1. Edita `app.js`.
2. Reemplaza `GOOGLE_API_KEY` por tu API key de Google Drive API.
3. Reemplaza los `FOLDER_ID_1..3` por IDs reales de carpetas compartidas.
4. Asegúrate de que el contenido sea público o accesible con la API key.

## Uso

Abre `index.html` en navegador (o levanta un servidor local).

- Toca un botón de carpeta.
- Se listan archivos disponibles.
- Toca un archivo para:
  - ver vista previa embebida,
  - abrir en pestaña nueva,
  - descargar directamente.
