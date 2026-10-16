---
name: Express y API REST con JWT
description: Guía para construir la API REST con Node.js y Express usando jsonwebtoken, bcrypt y manejo de errores. Úsala al crear o modificar rutas, controladores y middlewares en /backend.
---

# Skill: Express y API REST con JWT

## Cuándo usar esta skill

Úsala cuando la tarea implique crear o modificar la API en `/backend`: rutas,
controladores, middlewares, autenticación JWT, hash de contraseñas, validación o
manejo de errores. El contrato a respetar es `docs/contrato-api.md`.

## Estructura esperada

Según `AGENTS.md`, dentro de `/backend/src`:

- `routes/`: define los endpoints y los une a los controladores.
- `controllers/`: lógica de negocio y acceso a datos.
- `middleware/`: autenticación, validación y manejo de errores.
- `config/`: variables de entorno y cliente de Supabase.

## Convenciones de respuesta

- Todas las respuestas son JSON.
- Los errores tienen siempre la forma `{"error": "mensaje descriptivo"}`.
- Códigos usados en este proyecto: `200`, `201`, `400` (datos inválidos),
  `401` (token ausente o inválido), `409` (email repetido).

## Autenticación JWT

Firma del token en el login:

```js
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { id: usuario.id, email: usuario.email }, // payload mínimo
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
);
```

Middleware de autenticación reutilizable:

```js
function auth(req, res, next) {
  const cabecera = req.headers.authorization || '';
  const [tipo, token] = cabecera.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token ausente o inválido' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // disponible en el controlador
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token ausente o inválido' });
  }
}
```

## Contraseñas con bcrypt

```js
const bcrypt = require('bcrypt');

// Registro: nunca guardes la contraseña en texto plano.
const hash = await bcrypt.hash(password, 10);

// Login: compara con el hash almacenado.
const valido = await bcrypt.compare(password, usuario.password_hash);
```

Nunca devuelvas el hash ni la contraseña en las respuestas.

## Controladores asíncronos

Envuelve siempre los controladores async para no dejar errores sin capturar:

```js
// Utilidad para capturar errores de funciones async
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
```

Y define un middleware final de errores:

```js
// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error(err); // Registra el error para depurar
  res.status(500).json({ error: 'Error interno del servidor' });
};
```

## Validación de datos

- Valida presencia y tipo de `nombre`, `email`, `password`, `puntaje`, etc.
- Responde `400` con `{"error": "Datos inválidos"}` cuando falte o sea incorrecto.
- No confíes en los datos del cliente; normaliza el email a minúsculas.

## Buenas prácticas

- Separa rutas de controladores; no mezcles lógica en `routes/`.
- Lee la configuración solo desde variables de entorno (`process.env`).
- No escribas secretos en el código; usa `.env` (ver `.env.example`).
- Reutiliza middlewares en lugar de repetir validaciones.
- Comenta la lógica no evidente en español.

## Errores comunes

- Devolver el objeto completo del usuario incluyendo `password_hash`.
- Olvidar `return` tras enviar una respuesta de error.
- Firmar/verificar con un secreto distinto entre entornos.
- No manejar `email` duplicado y devolver un `500` en vez de `409`.
