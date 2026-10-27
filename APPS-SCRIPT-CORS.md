# Apps Script del popup de leads — CORS y respuesta JSON

Este archivo es para el deployment de Apps Script que recibe los leads del popup de
`index.html` (el endpoint `AKfycbxsToo1dgZ...`). No hace falta tocar el otro
deployment (el de entradas / Mercado Pago), que ya funciona con este mismo patrón.

---

## Antes de copiar nada: cómo funciona CORS en Apps Script

Hay una limitación de la plataforma que conviene tener clara, porque cambia lo que
se puede y lo que no se puede arreglar desde el código:

**Apps Script no permite escribir cabeceras de respuesta.** `ContentService` no tiene
`setHeader()` ni `setHeaders()`. No existe forma de agregar `Access-Control-Allow-Origin`
a mano.

Lo que sí pasa es esto:

1. Un Web App publicado con acceso **"Cualquier usuario"** ya devuelve
   `Access-Control-Allow-Origin: *` por sí solo. Google lo agrega en la
   infraestructura, no en tu código.
2. Por eso **un request "simple" funciona sin hacer nada especial**. Un request es
   "simple" si usa `GET`/`POST`, sin cabeceras raras, y con `Content-Type` igual a
   `text/plain`, `application/x-www-form-urlencoded` o `multipart/form-data`.
3. Si el front manda `Content-Type: application/json`, el navegador dispara un
   **preflight `OPTIONS`**. Apps Script no puede responderlo con las cabeceras que el
   navegador exige, y **el request falla siempre**. Eso no se arregla con código:
   se arregla no disparando el preflight.

**Conclusión práctica:** el front tiene que seguir mandando
`Content-Type: 'text/plain;charset=UTF-8'` con el JSON como string en el body — que es
exactamente como quedó `index.html`, y como ya venía `entrada.html`. El `doPost` parsea
ese texto como JSON. `doOptions` va incluido más abajo porque no molesta y cubre el caso
de que Google cambie el comportamiento, pero **hoy prácticamente nunca se ejecuta**.

---

## Código para pegar en el editor de Apps Script

Reemplazá el `doPost` actual por esto (y agregá `doOptions` si no lo tenés).

```javascript
/**
 * Popup de leads de cepatagonia.com
 *
 * El front manda un POST con Content-Type: text/plain;charset=UTF-8 y el JSON
 * en el body. Es a propósito: text/plain evita el preflight CORS, que Apps Script
 * no puede responder. No cambiar a application/json.
 *
 * Devuelve SIEMPRE JSON: { ok: true } o { ok: false, error: "..." }.
 * El front solo muestra "¡Listo!" y dispara los eventos de conversión si
 * recibe ok:true, así que un lead que no se guardó nunca se cuenta como guardado.
 */

var HOJA_LEADS = 'Leads';   // <-- nombre exacto de la pestaña de la planilla

function doPost(e) {
  try {
    // ---- 1) Leer el body ----
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'Request sin body' });
    }

    var datos;
    try {
      datos = JSON.parse(e.postData.contents);
    } catch (errParse) {
      // Fallback: por si alguna vez llega como form-urlencoded
      datos = e.parameter || {};
    }

    // ---- 2) Validar lo mínimo ----
    var nombre   = String(datos.nombre   || '').trim();
    var whatsapp = String(datos.whatsapp || '').trim();

    if (!nombre || !whatsapp) {
      return json({ ok: false, error: 'Faltan nombre o whatsapp' });
    }

    var especialidad = String(datos.especialidad || '').trim();
    var origen       = String(datos.origen || 'Popup Web').trim();
    var fecha        = String(datos.fecha || '').trim() ||
                       Utilities.formatDate(new Date(), 'America/Argentina/Buenos_Aires',
                                            'dd/MM/yyyy HH:mm:ss');

    // ---- 3) Guardar ----
    var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_LEADS);
    if (!hoja) {
      return json({ ok: false, error: 'No existe la hoja ' + HOJA_LEADS });
    }

    // OJO: el orden de esta fila tiene que coincidir con las columnas de tu planilla.
    hoja.appendRow([fecha, nombre, whatsapp, especialidad, origen]);

    return json({ ok: true });

  } catch (err) {
    // Cualquier error se devuelve como ok:false para que el front lo trate
    // como fallo y guarde el lead en localStorage para reintentar.
    return json({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

/**
 * Preflight. Apps Script no deja setear cabeceras, así que esto es poco más que
 * un 200 vacío: sirve si el navegador lo consulta, pero la razón real de que
 * todo funcione es que el front manda un request simple que NO dispara preflight.
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

/** Helper: respuesta JSON. */
function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

## Antes de guardar: revisá dos cosas

1. **`HOJA_LEADS`** — que diga el nombre exacto de la pestaña donde van los leads
   (respetando mayúsculas y acentos).
2. **El orden de `appendRow`** — hoy escribe
   `[fecha, nombre, whatsapp, especialidad, origen]`. Si tu planilla tiene las
   columnas en otro orden, cambiá el orden de ese array (no el de la planilla, así
   no rompés lo que ya está cargado).

---

## Cómo desplegarlo

Un cambio en el código **no tiene efecto** hasta que publicás una versión nueva. Este
es el paso que más se olvida:

1. En el editor: **Implementar → Administrar implementaciones**.
2. Sobre la implementación que ya usa el sitio, clic en el **lápiz** (Editar).
3. En **Versión**, elegir **Versión nueva**.
4. Confirmar que quede:
   - **Ejecutar como:** *Yo* (tu cuenta)
   - **Quién tiene acceso:** *Cualquier usuario*
5. **Implementar**.

> Importante: editando la implementación existente, **la URL `/exec` no cambia** y no
> hay que tocar nada en el sitio. Si en cambio creás una implementación *nueva*, la URL
> cambia y hay que actualizar `ENDPOINT` en `index.html`.

Si "Quién tiene acceso" no está en *Cualquier usuario*, Google responde con una página
de login en vez de tu JSON y el popup lo va a tratar como error (correctamente).

---

## Cómo verificar que quedó bien

Desde una terminal:

```bash
curl -i -L -X POST "https://script.google.com/macros/s/TU_ID/exec" -H "Content-Type: text/plain;charset=UTF-8" -d "{\"nombre\":\"Prueba\",\"whatsapp\":\"1122334455\",\"especialidad\":\"Otro\",\"origen\":\"Test curl\"}"
```

Tiene que terminar en `{"ok":true}` y aparecer una fila nueva en la planilla. El `-L`
es necesario: Apps Script contesta con un `302` hacia `script.googleusercontent.com`, y
es esa segunda respuesta la que trae el JSON y la cabecera
`Access-Control-Allow-Origin: *`. Es normal y el navegador la sigue solo.

Si ves HTML en vez de JSON, casi siempre es el punto 4 del despliegue (acceso restringido).
