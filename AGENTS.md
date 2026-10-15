# AGENTS.md - Space Shooter Ranking

## Reglas del Proyecto

- Trabajar **ÚNICAMENTE** en la carpeta actual del proyecto. No tocar archivos fuera de ella.
- Seguir estrictamente las fases indicadas. No avanzar a la siguiente fase sin confirmación del usuario.
- No escribir claves o secretos reales. Usar únicamente variables en `.env.example`.
- Toda la documentación debe estar en **español**.
- Código **simple, claro y comentado**.
- Mantener la coherencia con la estructura, nomenclatura, estilo y patrones del código existente.
- Tratar archivos o cambios desconocidos como trabajo del usuario e investigar antes de eliminar o sobrescribir.

## Convenciones de Código

### General
- Comentarios en español para explicar lógica compleja.
- Indentación: 2 espacios.
- Finalizar archivos con salto de línea.
- Nombres descriptivos y en español cuando corresponda al dominio del juego.

### Frontend (HTML/CSS/JS + Phaser 3 + Vite)
- Archivos HTML en raíz de `/game/` para páginas: `index.html`, `registro.html`, `ranking.html`, `juego.html`.
- Lógica del juego organizada en `/game/src/`:
  - `scenes/`: Escenas de Phaser 3 (Preload, Menu, Juego, GameOver, etc.)
  - `entities/`: Entidades del juego (Nave, Enemigo, Meteorito, Bala, etc.)
  - `pages/`: Lógica específica de cada página HTML (login, registro, ranking)
  - `services/`: Servicios (API calls, almacenamiento local, etc.)
  - `styles/`: Estilos CSS
  - `assets/`: Recursos gráficos, sonidos y sprites
- Uso de módulos ES6 (import/export).
- Código JavaScript limpio y orientado a objetos cuando sea apropiado.

### Backend (Node.js + Express)
- Estructura modular en `/backend/src/`:
  - `routes/`: Definición de rutas de la API REST
  - `controllers/`: Lógica de negocio y controladores
  - `middleware/`: Middlewares (autenticación, validación, etc.)
  - `config/`: Configuración (Supabase, variables de entorno, etc.)
- Usar async/await para operaciones asíncronas.
- Manejo adecuado de errores con respuestas HTTP claras.
- Autenticación con JWT (jsonwebtoken) y hash de contraseñas con bcrypt.
- Validación de datos en controlador o middleware según corresponda.

### Base de Datos (Supabase PostgreSQL)
- Scripts SQL organizados en `/database/`:
  - `schema.sql`: Definición de tablas, claves, índices y restricciones
  - `seed.sql`: Datos de prueba iniciales
  - `views.sql`: Vistas para consultas complejas (ranking, estadísticas, etc.)
- Comentarios en SQL explicando cada tabla y campo relevante.
- Usar nombres en español o inglés consistentes (preferir español para dominio del juego).

## Estructura de Carpetas

```
space-shooter-ranking/
├── .opencode/           # Agentes y skills de OpenCode
├── backend/             # API REST (Node.js + Express)
│   └── src/
│       ├── config/      # Configuraciones
│       ├── controllers/ # Controladores
│       ├── middleware/  # Middlewares
│       └── routes/      # Rutas
├── database/            # Scripts SQL (Supabase PostgreSQL)
│   ├── schema.sql       # Esquema de BD
│   ├── seed.sql         # Datos de prueba
│   └── views.sql        # Vistas
├── docs/                # Documentación adicional
├── game/                # Frontend + Juego (Vite + Phaser 3)
│   ├── index.html       # Página de login
│   ├── registro.html    # Página de registro
│   ├── ranking.html     # Página de ranking
│   ├── juego.html        # Página del juego
│   └── src/
│       ├── assets/      # Recursos (sprites, sonidos)
│       ├── entities/    # Entidades del juego
│       ├── pages/       # Lógica de páginas
│       ├── scenes/      # Escenas de Phaser 3
│       ├── services/    # Servicios
│       └── styles/      # Estilos CSS
├── .env.example         # Variables de entorno (ejemplo)
├── .gitignore           # Archivos ignorados por Git
├── AGENTS.md            # Reglas y convenciones
├── opencode.json        # Configuración de OpenCode
└── README.md            # Documentación del proyecto
```

## Estrategia GitFlow

Se utilizará **GitFlow** como flujo de trabajo para el desarrollo colaborativo en 3 días.

### Ramas Principales

- **`main`**: Rama de producción. Contiene únicamente código estable, probado y listo para desplegar. Cada commit en `main` debe ser un release etiquetado (tag).
- **`develop`**: Rama de desarrollo. Integra todas las funcionalidades completadas de la fase actual. Es la base para crear ramas `feature/*`.

### Ramas de Soporte

- **`feature/*`**: Ramas para desarrollo de nuevas funcionalidades. 
  - Se crean desde `develop`.
  - Nomenclatura: `feature/nombre-descriptivo` (ej. `feature/auth-jwt`, `feature/game-core`, `feature/ranking-api`).
  - Al finalizar, se mergean a `develop` mediante Pull Request (recomendado).

- **`release/*`**: Ramas para preparar un release a producción.
  - Se crean desde `develop` cuando se considera que una versión está lista.
  - Nomenclatura: `release/v1.0.0`
  - Permiten ajustes finales (documentación, versionado). Al finalizar, se mergean a `main` y a `develop`.

- **`hotfix/*`**: Ramas para corregir errores críticos en producción.
  - Se crean desde `main`.
  - Nomenclatura: `hotfix/v1.0.1`
  - Al finalizar, se mergean a `main` y a `develop`.

### Reglas de Commits

- Usar **commits atómicos** (un cambio lógico por commit).
- Mensajes en español, claros y descriptivos.
- Formato recomendado: `tipo: descripción breve` (ej. `feat: agregar sistema de movimiento de nave`, `fix: corregir validación de login`, `docs: actualizar README.md`, `chore: crear estructura inicial`).
- Tipos sugeridos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

### Flujo de Trabajo Recomendado

1. Crear rama `develop` desde `main` (si no existe).
2. Para cada nueva funcionalidad: crear `feature/*` desde `develop`.
3. Desarrollar y hacer commits en la rama feature.
4. Al completar la funcionalidad, mergear a `develop`.
5. Cuando todas las funcionalidades de una fase estén en `develop`, crear `release/*` para preparar integración.
6. Tras validación, mergear `release/*` a `main` y taggear la versión.
7. Aplicar hotfixes desde `main` cuando sea necesario.

## Notas Adicionales

- No instalar dependencias en la FASE 1. Solo crear estructura y archivos base.
- Este documento sirve como guía para agentes de IA y desarrolladores humanos.
- Cualquier duda sobre implementación, consultar con el equipo antes de tomar decisiones arquitectónicas importantes.
