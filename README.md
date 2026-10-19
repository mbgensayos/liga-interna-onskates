# Liga Interna OnSkates 2026 · Inscripción

Formulario web de inscripción para la liga interna de OnSkates, con todas las modalidades
en una sola inscripción: **Classic, Battle, Derrapes, Speed y Salto**.

Recoge los mismos campos que los formularios de Google de la temporada 2026:

1. Nombre y apellidos del patinador/a
2. Fecha de nacimiento
3. Federado/a (Sí / No)
4. ¿Has participado en alguna liga en la temporada 2025? (Ninguna / Autonómica / 3ª División / 1ª División)
5. Modalidad a la que te presentas (varias a la vez)
6. Categoría: Profesional (máxima categoría) o Amateur (iniciación)

## Publicar la página (GitHub Pages)

1. En GitHub: **Settings → Pages**.
2. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
3. Al cabo de un minuto la página estará en
   `https://mbgensayos.github.io/liga-interna-onskates/`.

## Guardar las inscripciones en una hoja de Google

La página es estática, así que las respuestas se envían a una hoja de cálculo mediante Google Apps Script:

1. Crea una hoja de cálculo nueva en Google Drive (p. ej. "Inscripciones Liga Interna 2026").
2. Menú **Extensiones → Apps Script**, borra lo que haya y pega el contenido de
   [`apps-script/Code.gs`](apps-script/Code.gs). Guarda.
3. **Implementar → Nueva implementación → Tipo: Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
4. Autoriza los permisos y copia la URL que termina en `/exec`.
5. En `index.html`, pega esa URL en `const ENDPOINT = "";` y sube el cambio.

Cada inscripción aparece como una fila en la pestaña **Inscripciones**, con una columna
"Sí" por modalidad para filtrar la lista de cada una.

Mientras `ENDPOINT` esté vacío, la página muestra un aviso de "modo prueba" y no guarda nada.
