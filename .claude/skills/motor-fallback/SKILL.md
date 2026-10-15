---
name: motor-fallback
description: >
  Budget guard + free-engine fallback for paid generation services. Use BEFORE any
  paid generation or automation run (Higgsfield, Monid, ElevenLabs, Make operations,
  OpenAI/Anthropic API calls from project code, image/video/voice generation) and
  whenever a balance, credit, quota or rate limit is low, exhausted, or returns
  "not_enough_credits", 402, 429 or "quota exceeded". Also use when the user says
  "me quedo sin saldo", "sin créditos", "sin datos", "busca un motor gratis",
  "cambia de motor", "fallback", "free tier".
---

# motor-fallback — no quedarse a cero

Objetivo: antes de que un servicio de pago llegue a cero, saltar a un motor
gratuito equivalente para seguir trabajando, y volver al motor principal cuando
haya saldo otra vez. Se repite cada vez que ocurra.

## Límite honesto (decirlo al usuario si pregunta)
Este skill cubre los **motores que Claude usa como herramientas** (imagen, vídeo,
voz, automatización, LLM llamado desde el código del proyecto). **No puede cambiar
el modelo que ejecuta la propia sesión de Claude Code**: si se agota la cuota de
Claude, la sesión se detiene hasta que se renueve. Para eso existe una opción local
del usuario (no en la nube): un router como `claude-code-router` apuntando a un
proveedor con capa gratuita — es configuración del usuario en su máquina, con sus
propias claves, y Claude no lo instala por su cuenta.

## 1. Comprobar saldo ANTES de gastar
Por cada servicio que vaya a usarse, leer el saldo real (nunca suponerlo):

| Servicio | Cómo leer el saldo |
|---|---|
| Higgsfield | `higgsfield workspace list` (créditos) |
| Monid | `monid balance` |
| Make | `organizations_list` → `license.operations` vs uso del equipo (`teams_list`: `consumedOperations`) |
| ElevenLabs | panel de suscripción / error de cuota en la respuesta |
| APIs LLM del proyecto | cabeceras de rate limit y errores 402/429 |

Estimar el gasto de la tarea. **Umbral de salto: si tras la tarea quedaría < 15 %
del saldo, o el saldo no cubre la tarea, avisar y pasar al paso 2 antes de gastar.**
Si una llamada falla con `not_enough_credits`, 402, 429 o "quota", pasar al paso 2
sin reintentar en el mismo motor.

## 2. Elegir el motor gratuito
Las capas gratuitas cambian a menudo: **verificar en el momento** (búsqueda web o
la documentación oficial del proveedor) que la capa gratuita sigue existiendo y qué
límites tiene. No inventar límites ni precios; si no se puede verificar, decirlo.

Candidatos por tipo (orden de preferencia; saltar al siguiente si el anterior falla
o está agotado):

- **Texto / LLM en el código del proyecto:** Google Gemini API (capa gratuita),
  Groq (capa gratuita), modelos `:free` de OpenRouter, Cloudflare Workers AI
  (asignación diaria gratuita), Hugging Face Inference, modelo local con Ollama.
- **Imagen:** suscripción ya pagada del usuario si la hay (p. ej. Codex `image_gen`
  con ChatGPT), Pollinations.ai, Hugging Face Spaces / Inference, Cloudflare Workers AI.
- **Vídeo:** casi no hay capas gratuitas fiables; usar el tier más barato del
  mismo motor (p. ej. 480p / modelo mini) o pausar y avisar. Nunca mezclar motores
  dentro de una misma cadena que deba quedar visualmente uniforme sin avisar.
- **Voz (TTS):** voces del sistema / Web Speech API en el navegador, Piper o
  Coqui en local, capa gratuita de ElevenLabs si queda.
- **Automatización:** si Make se queda sin operaciones del mes, mover el paso
  crítico a una función serverless del propio proyecto (Vercel) o esperar al reset
  mensual; avisar antes.

Requisitos para usar un motor nuevo:
- Necesita clave → pedir al usuario que la cree y la guarde como **variable de
  entorno** (nunca en el código ni en commits; documentar en `.env.example`).
- Respetar los términos de uso del proveedor; no crear cuentas múltiples para
  exprimir capas gratuitas.
- No enviar datos personales de clientes a un motor nuevo sin que el usuario lo
  apruebe (RGPD / nLPD).

## 3. Registrar y volver
- Anotar en la respuesta qué motor se usó, por qué se saltó y qué queda pendiente.
- En la siguiente tarea, volver a comprobar el saldo del motor principal (paso 1);
  si se ha recargado, volver a él. Repetir el ciclo cada vez.
