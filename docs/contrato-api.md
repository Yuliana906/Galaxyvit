# Contrato de la API - Space Shooter Ranking

Este documento define el contrato de la API REST para el proyecto **Space Shooter Ranking**. Todas las respuestas son en formato **JSON**.

## Convenciones generales

- **Formato de respuesta:** Todas las respuestas se devuelven en JSON.
- **Formato de errores:** `{"error": "mensaje descriptivo"}`
- **Autenticación:** Para rutas protegidas se utiliza JWT mediante el header `Authorization: Bearer <token>`.
- **Códigos de error comunes:**
  - `400` - Datos inválidos o faltantes
  - `401` - Token ausente o inválido
  - `409` - Email repetido (registro)

## 1. Autenticación

### POST `/api/auth/register`

Registra un nuevo usuario en el sistema.

**Método:** `POST`  
**Ruta:** `/api/auth/register`  
**Público:** Sí

**Cuerpo de la petición:**
```json
{
  "nombre": "string",
  "email": "string",
  "password": "string"
}
```

**Validaciones esperadas:**
- `nombre`: obligatorio
- `email`: obligatorio, formato válido
- `password`: obligatorio

**Respuesta exitosa (201 Created):**
```json
{
  "usuario": {
    "id": 1,
    "nombre": "Jugador",
    "email": "jugador@example.com"
  }
}
```

**Respuestas de error:**
- `400` - `{"error": "Datos inválidos"}`
- `409` - `{"error": "Email ya registrado"}`

### POST `/api/auth/login`

Autentica a un usuario y devuelve un token JWT.

**Método:** `POST`  
**Ruta:** `/api/auth/login`  
**Público:** Sí

**Cuerpo de la petición:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Respuesta exitosa (200 OK):**
```json
{
  "token": "jwt_token_ejemplo",
  "usuario": {
    "id": 1,
    "nombre": "Jugador",
    "email": "jugador@example.com"
  }
}
```

**Respuestas de error:**
- `400` - `{"error": "Datos inválidos"}`
- `401` - `{"error": "Credenciales inválidas"}`

## 2. Naves

### GET `/api/naves`

Obtiene el listado de naves disponibles para jugar.

**Método:** `GET`  
**Ruta:** `/api/naves`  
**Público:** Sí

**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Interceptor",
    "velocidad": 250,
    "vida": 100,
    "cadencia_disparo": 300
  },
  {
    "id": 2,
    "nombre": "Destructor",
    "velocidad": 180,
    "vida": 150,
    "cadencia_disparo": 200
  }
]
```

## 3. Ranking

### GET `/api/ranking`

Obtiene el top 10 de mejores puntuaciones globales.

**Método:** `GET`  
**Ruta:** `/api/ranking`  
**Público:** Sí  
**Límite:** Top 10

**Respuesta exitosa (200 OK):**
```json
[
  {
    "posicion": 1,
    "nombre": "Jugador1",
    "puntaje": 5000,
    "nave": "Interceptor",
    "fecha": "2026-10-16T10:30:00.000Z"
  },
  {
    "posicion": 2,
    "nombre": "Jugador2",
    "puntaje": 4500,
    "nave": "Destructor",
    "fecha": "2026-10-16T09:15:00.000Z"
  }
]
```

## 4. Partidas

### POST `/api/partidas`

Registra una partida finalizada. Requiere autenticación JWT.

**Método:** `POST`  
**Ruta:** `/api/partidas`  
**Protegido:** Sí  
**Headers:** `Authorization: Bearer <token>`

**Cuerpo de la petición:**
```json
{
  "nave_id": 1,
  "puntaje": 3500,
  "duracion_seg": 120,
  "disparos": 85,
  "aciertos": 42,
  "eventos": [
    {
      "tipo_evento": "enemigo_destruido",
      "enemigo_id": 1,
      "momento_seg": 15
    },
    {
      "tipo_evento": "impacto_meteorito",
      "enemigo_id": null,
      "momento_seg": 30
    },
    {
      "tipo_evento": "muerte",
      "enemigo_id": null,
      "momento_seg": 120
    }
  ]
}
```

**Campos obligatorios:**
- `nave_id`: número entero (ID de la nave utilizada)
- `puntaje`: número entero
- `duracion_seg`: número entero (duración en segundos)
- `disparos`: número entero (total de disparos realizados)
- `aciertos`: número entero (disparos acertados)
- `eventos`: array de eventos (puede estar vacío según lógica de negocio)

**Valores válidos para `tipo_evento`:**
- `enemigo_destruido`
- `impacto_meteorito`
- `impacto_bala`
- `muerte`

**Respuesta exitosa (201 Created):**
```json
{
  "id": 1
}
```

**Respuestas de error:**
- `400` - `{"error": "Datos inválidos"}`
- `401` - `{"error": "Token ausente o inválido"}`

### GET `/api/partidas/mias`

Obtiene el historial de partidas del usuario autenticado.

**Método:** `GET`  
**Ruta:** `/api/partidas/mias`  
**Protegido:** Sí  
**Headers:** `Authorization: Bearer <token>`

**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": 1,
    "nave": "Interceptor",
    "puntaje": 3500,
    "duracion_seg": 120,
    "disparos": 85,
    "aciertos": 42,
    "fecha": "2026-10-16T10:35:00.000Z"
  },
  {
    "id": 2,
    "nave": "Destructor",
    "puntaje": 2800,
    "duracion_seg": 95,
    "disparos": 65,
    "aciertos": 38,
    "fecha": "2026-10-16T11:00:00.000Z"
  }
]
```

**Respuestas de error:**
- `401` - `{"error": "Token ausente o inválido"}`

## Notas

- Todas las fechas se devuelven en formato ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- Los IDs son numéricos (enteros).
- El ranking muestra siempre las **10 mejores posiciones** (`top 10`).
- Para el campo `enemigo_id` en eventos, cuando no aplica (ej. `impacto_meteorito`, `muerte`), se usa `null`.
- Este contrato sirve de base para el desarrollo del backend (`backend-dev`) y para la integración con frontend (`game-dev`).