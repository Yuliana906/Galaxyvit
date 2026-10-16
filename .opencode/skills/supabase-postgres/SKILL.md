---
name: Supabase y PostgreSQL
description: Guía para trabajar con Supabase y PostgreSQL en este proyecto (cliente JS, esquema, vistas de ranking, seguridad y uso del MCP). Úsala al crear tablas, consultas, vistas o acceso a datos.
---

# Skill: Supabase y PostgreSQL

## Cuándo usar esta skill

Úsala cuando la tarea implique base de datos: diseñar o modificar el esquema en
`/database`, escribir consultas, crear vistas para el ranking, configurar el
cliente de Supabase en `/backend/src/config` o usar el MCP de Supabase.

## Estructura esperada

- `/database/schema.sql`: tablas, claves, restricciones e índices.
- `/database/seed.sql`: datos de prueba (naves, enemigos, ejemplo de usuarios).
- `database/views.sql`: vistas para el ranking y estadísticas.
- `/backend/src/config/`: inicialización del cliente de Supabase.

## Cliente de Supabase (backend)

```js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Cliente con la service key: uso exclusivo del backend (omite RLS).
// NUNCA exponer esta clave en el frontend.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = supabase;
```

## Convenciones SQL

- Comenta cada tabla y campo relevante en español.
- Usa `IF NOT EXISTS` al crear tablas y `CREATE OR REPLACE` en las vistas.
- Define claves primarias, claves foráneas y `NOT NULL` explícitos.
- Añade índices en las columnas de filtrado y orden (por ejemplo `puntaje DESC`).
- Usa tipos adecuados: `serial`/`bigserial`, `text`, `integer`, `timestamptz`.

Ejemplo de tabla:

```sql
-- Partidas jugadas por los usuarios
CREATE TABLE IF NOT EXISTS partidas (
  id            bigserial PRIMARY KEY,
  usuario_id    bigint NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nave_id       bigint NOT NULL REFERENCES naves(id),
  puntaje       integer NOT NULL DEFAULT 0,
  duracion_seg  integer NOT NULL DEFAULT 0,
  disparos      integer NOT NULL DEFAULT 0,
  aciertos      integer NOT NULL DEFAULT 0,
  fecha         timestamptz NOT NULL DEFAULT now()
);

-- Acelera el orden del ranking
CREATE INDEX IF NOT EXISTS idx_partidas_puntaje ON partidas (puntaje DESC);
```

## Vistas para el ranking

El ranking expone el top 10 con: `posicion`, `nombre`, `puntaje`, `nave`, `fecha`.

```sql
-- Vista del ranking global (mejor partida por usuario)
CREATE OR REPLACE VIEW ranking_global AS
SELECT
  ROW_NUMBER() OVER (ORDER BY p.puntaje DESC, p.fecha ASC) AS posicion,
  u.nombre AS nombre,
  p.puntaje AS puntaje,
  n.nombre AS nave,
  p.fecha AS fecha
FROM partidas p
JOIN usuarios u ON u.id = p.usuario_id
JOIN naves n ON n.id = p.nave_id
ORDER BY p.puntaje DESC, p.fecha ASC
LIMIT 10;
```

## Uso del cliente desde el backend

- Inserta con `.from('partidas').insert({...}).select().single()`.
- Consulta el ranking con la vista: `.from('ranking_global').select('*')`.
- Filtra las partidas del usuario: `.eq('usuario_id', req.usuario.id)`.
- Revisa siempre `error` en la respuesta antes de usar `data`.

## Seguridad

- `SUPABASE_SERVICE_KEY` es un secreto: solo en el backend y en `.env`.
- Si el frontend accediera a Supabase directamente, usa la clave anónima y
  **Row Level Security (RLS)**; en este proyecto la API es la única puerta de acceso.
- No incluyas claves reales en el repositorio; usa `.env.example`.

## MCP de Supabase

El proyecto configura el MCP de Supabase en `opencode.json` mediante **OAuth**,
con el project ref fijado en la URL del MCP (el de la URL de Supabase del equipo).
Cada integrante debe ser miembro del proyecto y autenticar con
`opencode mcp auth supabase`. Úsalo para:

- Listar tablas y aplicar migraciones.
- Ejecutar SQL de consulta durante el desarrollo.
- Buscar documentación de Supabase.

Prefiere `read_only` cuando solo vayas a consultar datos.

## Errores comunes

- Usar la clave de servicio en el frontend (fuga de seguridad).
- Olvidar índices y provocar consultas lentas en el ranking.
- No revisar el campo `error` de la respuesta de Supabase.
- Devolver filas duplicadas por usuario en el ranking (define bien la vista).
