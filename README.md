# FlowSuite Website (`flowsuite_website`)

Landing page estática de **FlowSuite** — automatización para PYMEs.  
Construida en HTML/CSS/JS puro, desplegada en **Vercel**, con integraciones a Make, Airtable, Snowie y más.

---

## 🚀 Despliegue en Vercel

### Pasos para conectar el nuevo repo `flowsuite_website`

1. **Crear el repositorio en GitHub**  
   → [github.com/new](https://github.com/new)  
   Nombre: `flowsuite_website`  
   Visibilidad: privado o público según prefieras.  
   **No** inicialices con README.

2. **Subir el contenido de este repo**  
   Desde tu máquina local (o usa el botón "Import repository" de GitHub):
   ```bash
   git clone https://github.com/rodrigodiazv/Landing-provisional-
   cd Landing-provisional-
   git remote set-url origin https://github.com/rodrigodiazv/flowsuite_website.git
   git push -u origin main
   ```

3. **Importar en Vercel**  
   → [vercel.com/new](https://vercel.com/new)  
   - Selecciona el repo `flowsuite_website`  
   - Framework: **Other** (HTML estático puro)  
   - Build command: *(vacío)*  
   - Output directory: *(vacío / raíz)*  
   - Haz clic en **Deploy**

4. **Obtener la URL de producción**  
   Vercel te dará una URL tipo `https://flowsuite-website.vercel.app`.  
   Actualiza la constante en `index.html` (busca `landing-provisional-beta.vercel.app`) con la nueva URL.

---

## ⚙️ Configuración del proyecto

### Archivos principales

| Archivo | Descripción |
|---|---|
| `index.html` | Landing page principal (todas las secciones) |
| `translations.js` | Traducciones ES / EN / FR / DE / IT |
| `vercel.json` | Headers de seguridad, redirects y CORS |
| `privacidad.html` | Política de privacidad |
| `terminos.html` | Términos y condiciones |
| `favicon.svg` / `favicon.png` | Favicon |
| `logo.png` | Logo de FlowSuite |

### Variable de URL de la app

En `index.html`, hay una referencia directa a la URL de Vercel en el iframe del demo:

```js
df.src = 'https://landing-provisional-beta.vercel.app';
```

Cuando hagas el deploy en el nuevo repo, cambia ese valor por la nueva URL de Vercel del agente.

---

## 🔗 Integraciones

### Make (Integromat)

El `vercel.json` ya permite llamadas salientes a `https://hook.eu1.make.com`.

Para conectar el formulario de contacto a Make:
1. Crea un escenario en [make.com](https://make.com) con un módulo **Webhooks → Custom Webhook**
2. Copia la URL del webhook (ej. `https://hook.eu1.make.com/xxxxxxxxxxxx`)
3. En `index.html`, localiza el listener del `#contact-form` y añade la llamada fetch:
   ```js
   fetch('https://hook.eu1.make.com/TU_WEBHOOK_ID', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       nombre: document.getElementById('f-name').value,
       email:  document.getElementById('f-email').value,
       sector: document.getElementById('f-sector').value
     })
   });
   ```

### Airtable

Desde Make, añade un módulo **Airtable → Create a Record** después del webhook para guardar los leads directamente en tu base de Airtable.  
No se necesitan cambios en el código HTML/JS.

### Snowie / FlowSuite AI Agent

El `vercel.json` ya incluye en la política CSP los dominios de Snowie:

```
connect-src: https://app.snowie.ai
frame-src: https://app.snowie.ai
```

Para activar el widget del agente:
1. Ve a tu panel de Snowie → obtén el código embed del agente
2. Pégalo antes de `</body>` en `index.html` (sección marcada como `<!-- FLOW AGENT WIDGET -->`)
3. En el panel de Snowie, añade la nueva URL de Vercel como dominio autorizado

### Actualizar CORS en `vercel.json`

Cuando tengas el dominio definitivo de FlowSuite (ej. `https://flowsuite.ch`), el header ya está configurado:

```json
"Access-Control-Allow-Origin": "https://flowsuite.ch"
```

---

## 🌍 Internacionalización (i18n)

La web soporta 5 idiomas: **Español (ES)**, **English (EN)**, **Français (FR)**, **Deutsch (DE)**, **Italiano (IT)**.

- Las traducciones están en `translations.js`
- Los elementos HTML usan atributos `data-i18n="clave"`
- El idioma seleccionado se guarda en `localStorage` con la clave `fs_lang`
- La función `applyLang(lang)` aplica las traducciones dinámicamente

---

## 🔒 Seguridad

El `vercel.json` incluye los siguientes headers de seguridad en todas las rutas:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HSTS)
- `Content-Security-Policy` (CSP) estricta
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 📬 Contacto

**FlowSuite** – Rodrigo A. Díaz Videla  
📧 info@flowsuite.ch  
📍 Ormont-Dessous, CP 1862, Vaud, Suiza
