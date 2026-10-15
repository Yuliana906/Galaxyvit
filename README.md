# Space Shooter Ranking

## 1) Descripción

**Space Shooter Ranking** es un videojuego web 2D en el que una nave debe moverse, disparar a enemigos y esquivar meteoritos. El juego cuenta con registro e inicio de sesión mediante JWT, un ranking global con las mejores puntuaciones, persistencia de datos en Supabase (PostgreSQL) y un dashboard visual en Looker Studio.

**Objetivo:** Desarrollar el proyecto en equipo durante 3 días, siguiendo una metodología estructurada por fases y utilizando agentes/skills de OpenCode para automatizar tareas.

## 2) Stack tecnológico

| Componente | Tecnologías | Propósito |
|---|---|---|
| **Frontend** | HTML, CSS, JavaScript, Vite, Phaser 3 | Interfaz web y motor del juego 2D |
| **Backend** | Node.js, Express, jsonwebtoken, bcrypt, @supabase/supabase-js | API REST para autenticación, puntuaciones y ranking |
| **Base de datos** | Supabase (PostgreSQL) | Persistencia de usuarios, partidas y puntuaciones |
| **Dashboard** | Looker Studio | Visualización del ranking global y estadísticas |
| **DevOps/IA** | OpenCode (agentes + skills) | Automatización, organización y desarrollo asistido |

## 3) Agentes y Skills

**TODO:** Definir los agentes y skills específicos para este proyecto en `.opencode/` (agentes.json, skills.json). 

Se recomienda incluir agentes para:
- Arquitectura y estructura del proyecto
- Desarrollo frontend (Vite + Phaser 3)
- Desarrollo backend (Express + JWT + Supabase)
- Base de datos (SQL + Supabase)
- Documentación y revisión de código
- Pruebas y validación

**TODO:** Documentar el uso de cada agente y skill con ejemplos de invocación.

## 4) Instalación

**TODO:** Incluir instrucciones detalladas para instalar y ejecutar el proyecto localmente.

Pasos previstos:
1. Clonar el repositorio
2. Configurar variables de entorno (`.env`) basadas en `.env.example`
3. Instalar dependencias (frontend y backend) - *No aplica en FASE 1*
4. Ejecutar migraciones de base de datos (`database/schema.sql`)
5. Iniciar backend (Express)
6. Iniciar frontend (Vite)
7. Acceder al juego en `http://localhost:5173`

**Nota:** En FASE 1 no se instalan dependencias. Solo se crea la estructura.

## 5) Modelo ER / Diccionario de datos

**TODO:** Diseñar y documentar el modelo entidad-relación (ER) completo.

**Entidades previstas (provisional):**
- `usuarios` - Usuarios registrados con autenticación JWT
- `partidas` - Registro de partidas jugadas
- `puntuaciones` - Puntuaciones obtenidas por partida/usuario

**Diccionario de datos (provisional):**
- **TODO:** Definir campos, tipos de datos, restricciones (PK, FK, UNIQUE, NOT NULL), índices y relaciones.
- **TODO:** Especificar campos para ranking (usuario, puntuación máxima, total partidas, fecha última partida).
- **TODO:** Incluir diagrama ER (texto o imagen) en `/docs/`.

**Ubicación:** Los scripts SQL correspondientes se encuentran en `/database/schema.sql`, `/database/seed.sql` y `/database/views.sql`.

## 6) Enlace al dashboard

**TODO:** Agregar el enlace público al dashboard de Looker Studio una vez creado.

**Formato sugerido:**
```
[Dashboard de Space Shooter Ranking](URL_PENDIENTE)
```

**Notas:**
- El dashboard debe mostrar el ranking global de mejores puntuaciones.
- Se recomienda conectar directamente a las vistas creadas en Supabase (`views.sql`).
- Actualizar este enlace cuando esté disponible.

## Estado del Proyecto

- **FASE 1:** Estructura del repositorio - ✅ Completada
- **FASES 2-6:** Por definir - ⏳ Pendientes

**Última actualización:** Octubre 2026
