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

El proyecto utiliza **agentes personalizados de OpenCode** en formato oficial: archivos `.md` con frontmatter ubicados en `.opencode/agents/`.

### Agentes disponibles

| Agente | Propósito | Alcance | Cuándo usarlo |
|---|---|---|---|
| **`architect`** | Arquitecto de software senior. Diseña estructura, modelo de datos y revisa decisiones técnicas. | `/docs/`, `database/schema.sql`, `database/views.sql`, `README.md`, `AGENTS.md`, `opencode.json` | Antes de implementar funcionalidades. Para diseñar ER, contratos API, arquitectura. **NO escribe código de producción.** |
| **`game-dev`** | Desarrollador frontend especializado en Phaser 3, Vite, HTML, CSS, JS. | **ÚNICAMENTE** `/game/` | Para desarrollar escenas, entidades, páginas, estilos y lógica del juego. Integración con API backend. |
| **`backend-dev`** | Desarrollador backend especializado en Node.js, Express, JWT, bcrypt, Supabase. | **ÚNICAMENTE** `/backend/` y `/database/` | Para crear API REST, endpoints auth/ranking, middlewares, configuración Supabase y scripts SQL (`schema.sql`, `seed.sql`, `views.sql`). |
| **`qa-tester`** | QA Tester que revisa código, escribe pruebas y reporta bugs. | Lectura completa. Escritura solo en `/docs/` y archivos de test. **NO modifica código de producción.** | Para revisiones de calidad, detección de bugs, validación de convenciones, reportes antes de merge a `develop`. | 

### Skills

Los skills son instrucciones reutilizables en formato oficial de OpenCode:
`.opencode/skills/<id>/SKILL.md` con frontmatter (`name` y `description`). El
agente los carga cuando la tarea coincide con su descripción.

| Skill | ID | Qué aporta | Cuándo se usa |
|---|---|---|---|
| **Phaser 3 con JavaScript** | `phaser3-js` | Ciclo de vida de escenas, físicas, entrada, generación de enemigos, puntaje e integración con la API. | Al implementar o modificar el juego en `/game`. |
| **Express y API REST con JWT** | `express-rest-jwt` | Estructura de rutas/controladores, firma y verificación de JWT, bcrypt, validación y manejo de errores según `docs/contrato-api.md`. | Al crear o modificar endpoints y middlewares en `/backend`. |
| **Supabase y PostgreSQL** | `supabase-postgres` | Cliente de Supabase, convenciones SQL, vistas de ranking, seguridad y uso del MCP. | Al trabajar con el esquema, consultas y datos en `/database` y `/backend`. |
| **GitFlow** | `gitflow` | Estrategia de ramas, convención de commits y flujo de Pull Requests. | Al crear ramas, commitear, abrir PR o preparar un release. |

### MCP de Supabase

El proyecto configura el **MCP de Supabase** en `opencode.json` (formato V2, bajo
`mcp.servers`). Permite al agente consultar el esquema, lanzar SQL y gestionar
migraciones durante el desarrollo.

- **Justificación:** centraliza el trabajo con la base de datos (explorar tablas,
  aplicar `schema.sql`/`views.sql`, depurar consultas) sin salir del editor y sin
  copiar credenciales en la conversación.
- **Seguridad:** no se escriben claves en el repositorio. La autenticación usa
  **OAuth**, por lo que no hay tokens ni secretos en la configuración.
- **Requisito para cada integrante:** ser **miembro del proyecto de Supabase**
  (que un administrador te invite a la organización y al proyecto). Una vez
  confirmado el acceso, cada integrante debe autenticar el MCP ejecutando:

  ```text
  opencode mcp auth supabase
  ```

  El comando abre el navegador para iniciar sesión y autorizar el acceso. Las
  credenciales se guardan fuera del repositorio (no se versionan).
- **Alcance:** la URL acota el MCP a un único proyecto y en modo solo lectura
  (`read_only=true`). El `project_ref` de la URL del MCP es el del proyecto de
  Supabase del equipo (el mismo que aparece en la URL de Supabase del equipo).

```jsonc
// Fragmento de opencode.json
{
  "mcp": {
    "servers": {
      "supabase": {
        "type": "remote",
        "url": "https://mcp.supabase.com/mcp?project_ref=vzsmbschefzibqiqbeko&read_only=true"
      }
    }
  }
}
```

### Notas

- Los agentes y skills siguen el formato oficial de OpenCode V2.
- Cada agente tiene permisos y límites de carpetas claramente definidos.
- Todos los agentes respetan las reglas de `AGENTS.md` (Windows, español, sin claves reales).

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

El modelo entidad-relación completo, con el diagrama y el diccionario de datos,
está en este documento.

![Diagrama ER](docs/diagrama-er.png)

Entidades: `usuarios`, `naves`, `enemigos`, `partidas` y `eventos_partida`.

Los scripts SQL están en `/database/schema.sql`, `/database/seed.sql` y `/database/views.sql`.

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
