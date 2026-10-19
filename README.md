# Liga Interna OnSkates 2026 · Inscripción

Formulario web de inscripción para la liga interna de OnSkates, con todas las modalidades
en una sola inscripción: **Battle, Derrapes, Speed y Salto**.

Día de la liga: lunes 2 de noviembre de 2026.

Inscripción: 5 €, que se cobran por la app de SportMember. Habrá entrega de medallas.
Fecha límite: domingo 25/10/2026. A partir del 26/10 la página muestra "Inscripciones cerradas"
(se cambia en `CIERRE`, dentro de `index.html`).

Campos:

1. Nombre y apellidos del patinador/a
2. Fecha de nacimiento
3. Categoría (desplegable: Mini, Prebenjamín, Benjamín, Alevín, Infantil, Juvenil, Junior y Sénior)
4. Federado/a (Sí / No)
5. ¿Has participado en alguna liga en la temporada 2025? (Ninguna / Autonómica / 3ª División / 1ª División)
6. Modalidad a la que te presentas (varias a la vez)
7. Profesional (máxima categoría) o Amateur (iniciación)
8. Observaciones (opcional)

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
"Sí" por modalidad para filtrar la lista de cada una. Las columnas las crea el propio
formulario: si se añade una pregunta nueva, su columna aparece sola sin tocar el script.

Mientras `ENDPOINT` esté vacío, la página muestra un aviso de "modo prueba" y no guarda nada.
