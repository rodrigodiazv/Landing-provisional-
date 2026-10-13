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

4. **Variables de entorno**  
   Añade en Vercel las variables de `.env.example` y vuelve a desplegar.

---

## ⚙️ Configuración del proyecto

### Archivos principales

| Archivo | Descripción |
|---|---|
| `index.html` | Landing (todas las secciones), área cliente beta y panel de administración (incluye el **Builder**) |
| `translations.js` | Textos de la landing en ES / FR / DE / IT / EN |
| `legal.js` | Textos legales (aviso legal, privacidad, condiciones, DPA, cookies) en los 5 idiomas |
| `assets/js/site.js` | Lógica de la web: idiomas, formulario, área cliente, panel admin y Builder |
| `privacidad.html` · `terminos.html` · `aviso-legal.html` | Páginas legales independientes (usan `legal.js`) |
| `demo/index.html` | Demo personalizada que genera el Builder (`/demo#…`) |
| `api/` | Funciones serverless de Vercel: login de admin y envío del formulario a Make |
| `assets/fonts`, `assets/vendor` | Fuentes y `lz-string` alojados localmente (sin peticiones a Google ni a CDNs) |
| `vercel.json` | Cabeceras de seguridad (CSP, HSTS…) y redirecciones |

### Variables de entorno (Vercel → Settings → Environment Variables)

Ver `.env.example`. Sin ellas, el login de admin y el formulario devuelven 503 (fallan cerrados).

| Variable | Uso |
|---|---|
| `ADMIN_PASSWORD` | Contraseña del panel de administración (solo en el servidor) |
| `ADMIN_SESSION_SECRET` | Cadena aleatoria larga para firmar la cookie de sesión (`openssl rand -hex 32`) |
| `MAKE_WEBHOOK_URL` | URL del webhook de Make que recibe los leads |
| `MAKE_WEBHOOK_SECRET` | Secreto enviado en la cabecera `X-FlowSuite-Secret`; compruébalo en Make con un filtro |

---

## 🔗 Integraciones

### Make (formulario beta)

El formulario envía a `/api/webhook`, que valida los datos, aplica límite de envíos por IP y reenvía a Make con el secreto. La URL de Make **no** aparece en el código público.

En Make: módulo **Webhooks → Custom Webhook**, y después un filtro que solo continúe si la cabecera `X-FlowSuite-Secret` coincide con `MAKE_WEBHOOK_SECRET`. Desde ahí puedes añadir **Airtable → Create a Record**.

### Snowie / agente FlowSuite

La CSP ya permite `https://app.snowie.ai` (connect/frame). Para activar el widget, pega el código embed antes de `</body>` en `index.html` y autoriza el dominio en Snowie.

### Builder

El Builder solo está dentro del **panel de administración** (🔐 → Builder). Genera el enlace `/demo#…` y el mensaje de WhatsApp para el prospecto. Las antiguas rutas `/builder` y `/admin` redirigen a la portada.

---

## 🌍 Internacionalización (i18n)

5 idiomas: **FR, DE, IT, EN, ES**. El idioma se elige por: preferencia guardada (`fs_lang`) → idioma del navegador → francés.

- Textos de la landing: `translations.js`. Atributos `data-i18n` (texto), `data-i18n-html` (HTML de confianza) y `data-i18n-ph` (placeholder).
- Textos legales: `legal.js`.
- En móvil, el selector de idioma es un desplegable.
- El área cliente y el panel de administración siguen en español.

---

## 🔒 Seguridad

- Contraseña de admin verificada en el servidor, con cookie `HttpOnly; Secure; SameSite=Strict` de 1 hora y límite de 5 intentos / 15 min por IP.
- El formulario se valida en el servidor (límite de 10 envíos / 15 min por IP y campo trampa anti-spam).
- Escapado de HTML en todo lo que muestra datos de usuarios; la demo solo acepta URLs `https://`.
- Cabeceras: CSP sin dominios externos de scripts, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`.
- Nada de secretos en el repositorio: `.env` está en `.gitignore`.

> El área cliente beta guarda sus datos en el `localStorage` del navegador de cada usuario. Para un servicio en producción hace falta una base de datos y autenticación en el servidor.

---

## 📬 Contacto

**FlowSuite** – Rodrigo A. Díaz Videla  
📧 info@flowsuite.ch  
📍 Vaud, Suiza
