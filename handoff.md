# Handoff

## Objetivo
Construir y desplegar en Vercel la web de FlowSuite, una landing multilingüe para sus servicios de automatización para PYMEs.

## Estado actual
Implementados la landing, páginas legales, demo, panel de administración y APIs para login y solicitudes beta. Pendiente configurar las variables de entorno en Vercel y sustituir el almacenamiento beta en `localStorage` por base de datos y autenticación de servidor para producción.

## Archivos y cambios
En esta sesión se crearon `handoff.md` y `AGENTS.md` para documentar el estado y el protocolo de continuidad.

## Intentos fallidos
Ninguno registrado aún

## Próximos pasos
1. Configurar en Vercel `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `MAKE_WEBHOOK_URL` y `MAKE_WEBHOOK_SECRET`.
2. Verificar en el despliegue el login administrativo y el envío del formulario beta a Make.
3. Definir e implementar almacenamiento persistente y autenticación de servidor para el área cliente beta.
