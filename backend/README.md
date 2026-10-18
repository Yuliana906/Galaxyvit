# Backend — Space Shooter Ranking

API REST de autenticación construida con **Node.js + Express 5 + Supabase**,
usando **bcrypt** para las contraseñas y **JWT** para la sesión.

Sigue el contrato de `docs/contrato-api.md` y las convenciones de `AGENTS.md`
(código comentado en español, 2 espacios de indentación, sin claves reales).

## Estructura

```
backend/
├── package.json
├── .env.example              # Plantilla de variables de entorno
└── src/
    ├── index.js              # Arranque del servidor
    ├── app.js                # App Express (CORS, JSON, rutas, errores)
    ├── config/
    │   ├── env.js            # Carga y valida variables de entorno
    │   └── supabase.js       # Cliente Supabase (service key)
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── naves.controller.js
    │   ├── ranking.controller.js
    │   └── partidas.controller.js
    ├── middleware/
    │   ├── auth.js           # Valida JWT y protege rutas privadas
    │   ├── validarAuth.js    # Validación de register/login
    │   ├── validarPartida.js # Validación de POST /api/partidas
    │   ├── notFound.js       # 404 en JSON
    │   └── errorHandler.js   # Manejo centralizado de errores (500)
    ├── routes/
    │   ├── index.js          # Router principal montado en /api
    │   ├── auth.routes.js
    │   ├── naves.routes.js
    │   ├── ranking.routes.js
    │   └── partidas.routes.js
    └── utils/
        ├── asyncHandler.js
        └── fechas.js         # Normaliza fechas a ISO 8601 con sufijo Z
└── pruebas/
    ├── auth.test.js          # Pruebas automáticas (sin Supabase real)
    └── partidas.test.js
```

## Configuración

1. Instalar dependencias:

   ```powershell
   cd backend
   npm install
   ```

2. Crear el archivo de entorno a partir de la plantilla y completar los valores
   reales del proyecto de Supabase:

   ```powershell
   Copy-Item .env.example .env
   ```

   Variables usadas:

   | Variable | Descripción |
   |---|---|
   | `SUPABASE_URL` | URL del proyecto Supabase. |
   | `SUPABASE_SERVICE_KEY` | Service key (solo backend, omite RLS). **Secreto.** |
   | `JWT_SECRET` | Secreto para firmar/verificar los JWT. **Secreto.** |
   | `JWT_EXPIRES_IN` | Vigencia del token (por defecto `24h`). |
   | `PORT` | Puerto del servidor (por defecto `3000`). |
   | `FRONTEND_URL` | Origen permitido por CORS (por defecto `http://localhost:5173`). |

   > `.env` está en `.gitignore`; nunca se sube al repositorio.

3. Ejecutar el servidor:

   ```powershell
   npm run dev     # con recarga automática (node --watch)
   npm start       # sin recarga
   ```

   Salida esperada: `API escuchando en http://localhost:3000`

## Endpoints implementados

| Método | Ruta | Protegido | Éxito | Errores |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | `201 {usuario:{id,nombre,email}}` | `400`, `409` |
| POST | `/api/auth/login` | No | `200 {token,usuario:{...}}` | `400`, `401` |
| GET | `/api/naves` | No | `200 [{id,nombre,velocidad,vida,cadencia_disparo}]` | `500` |
| GET | `/api/ranking` | No | `200` top 10 `[{posicion,nombre,puntaje,nave,fecha}]` | `500` |
| POST | `/api/partidas` | Sí | `201 {id}` | `400`, `401` |
| GET | `/api/partidas/mias` | Sí | `200 [{id,nave,puntaje,duracion_seg,disparos,aciertos,fecha}]` | `401` |

Todas las respuestas son JSON. Los errores usan la forma `{"error": "mensaje"}`.
Las rutas privadas esperan el header `Authorization: Bearer <token>`.

> **Nota sobre `id`:** el esquema de Supabase define `usuarios.id` como `uuid`,
> por lo que el `id` de usuario se devuelve como **string UUID** (no como entero).
> El resto de identificadores (`naves.id`, `partidas.id`, `posicion`) sí son numéricos.

### Detalles de `POST /api/partidas`

- `eventos` se guarda en la tabla `eventos_partida` mediante la función SQL
  `registrar_partida` (una sola transacción).
- `tipo_evento` válidos: `enemigo_destruido`, `impacto_meteorito`, `impacto_bala`, `muerte`.
- `enemigo_id` es entero o `null`; `momento_seg` es numérico ≥ 0.
- Se valida que `nave_id` exista y que `aciertos <= disparos` antes de llamar a la BD.

## Pruebas

### Automáticas

No necesitan Supabase real (simulan error de conexión) y usan el runner
integrado de Node:

```powershell
npm test
```

Cubren: validación `400`, error de conexión `500`, JSON mal formado `400`,
ruta inexistente `404`, y el middleware JWT (`401` sin token, `401` token
inválido, `401` esquema incorrecto, `200` con token válido). Las de partidas
añaden la validación del cuerpo y la protección de las rutas privadas.

### Manuales (PowerShell)

Con el servidor en marcha y credenciales reales de Supabase en `.env`:

```powershell
# 1) Registro correcto -> 201
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/register `
  -ContentType 'application/json' `
  -Body '{"nombre":"Ana","email":"ana@test.com","password":"Test1234"}'

# 2) Email repetido -> 409
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/register `
  -ContentType 'application/json' `
  -Body '{"nombre":"Ana","email":"ana@test.com","password":"Test1234"}'

# 3) Datos inválidos (sin password) -> 400
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/register `
  -ContentType 'application/json' -Body '{"nombre":"Ana","email":"ana@test.com"}'

# 4) Login correcto -> 200 (guarda el token)
$resp = Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/login `
  -ContentType 'application/json' `
  -Body '{"email":"ana@test.com","password":"Test1234"}'
$resp.token

# 5) Contraseña incorrecta -> 401
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/login `
  -ContentType 'application/json' `
  -Body '{"email":"ana@test.com","password":"incorrecta"}'
```

Para ver el **código HTTP** de las respuestas de error, usa `Invoke-WebRequest`
con `try/catch` o `curl.exe -i`.

> Para probar los usuarios de prueba de `database/seed.sql`, el login es
> `ana.torres@test.com` con contraseña `Test1234`.

## Estado

- **Implementado:** register/login + middleware JWT, `GET /api/naves`,
  `GET /api/ranking`, `POST /api/partidas` y `GET /api/partidas/mias`.
- **Pendiente:** probar los endpoints de partidas/ranking contra un Supabase
  real (requiere credenciales en `.env`) y conectar el frontend (`game-dev`).
