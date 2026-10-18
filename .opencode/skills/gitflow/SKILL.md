---
name: GitFlow
description: Guía del flujo GitFlow del proyecto (ramas main/develop/feature/release/hotfix, convención de commits y Pull Requests). Úsala al crear ramas, preparar commits, abrir Pull Requests o preparar un release.
---

# Skill: GitFlow (ramas, commits y Pull Requests)

## Cuándo usar esta skill

Úsala cuando la tarea implique trabajo con Git: crear ramas, preparar commits,
abrir o revisar Pull Requests, preparar un release o aplicar un hotfix.

## Entorno

El equipo trabaja en **Windows**. Usa comandos compatibles con PowerShell o CMD;
nunca sintaxis bash.

## Ramas

- `main`: producción. Solo código estable y etiquetado.
- `develop`: integración de funcionalidades terminadas. Base de las ramas `feature/*`.
- `feature/<nombre-descriptivo>`: se crea desde `develop`.
- `release/vX.Y.Z`: se crea desde `develop` para preparar un release.
- `hotfix/vX.Y.Z`: se crea desde `main` para corregir producción.

Ejemplos: `feature/auth-jwt`, `feature/game-core`, `feature/ranking-api`,
`release/v1.0.0`, `hotfix/v1.0.1`.

## Flujo de trabajo

1. Actualiza `develop` y crea la rama feature:

   ```powershell
   git checkout develop
   git pull
   git checkout -b feature/auth-jwt
   ```

2. Desarrolla con commits pequeños y atómicos.

3. Publica la rama y abre un Pull Request hacia `develop`:

   ```powershell
   git push -u origin feature/auth-jwt
   ```

4. Tras la revisión y aprobación, integra a `develop`.

5. Cuando `develop` reúne las funcionalidades de una fase, crea `release/vX.Y.Z`,
   valida y mergea a `main` (con tag) y de vuelta a `develop`.

6. Los hotfix se crean desde `main`, se mergean a `main` (con tag) y a `develop`.

## Convención de commits

Formato: `tipo: descripción breve` (imperativo, en español).

- `feat`: nueva funcionalidad.
- `fix`: corrección de errores.
- `docs`: documentación.
- `style`: formato (sin cambios de lógica).
- `refactor`: reestructuración sin cambiar comportamiento.
- `test`: pruebas.
- `chore`: tareas de mantenimiento (estructura, configuración).

Ejemplos: `feat: agregar autenticacion con JWT`, `fix: corregir ranking duplicado`,
`docs: documentar contrato de API`, `chore: crear estructura inicial`.

## Pull Requests

- Título claro y con la misma convención que los commits.
- Descripción con: qué cambia, por qué y cómo probarlo.
- PR pequeño y enfocado en un solo tema; facilita la revisión.
- No mergear sin revisión (usa `qa-tester` antes de integrar).
- Resuelve conflictos contra la rama destino antes de pedir la revisión.

## Buenas prácticas

- Nunca hagas commits directamente a `main` ni a `develop`.
- Un cambio lógico por commit; evita mezclar refactors con funcionalidad.
- No subas secretos: verifica que `.env` esté en `.gitignore`.
- Sincroniza tu rama con `develop` con frecuencia para evitar conflictos grandes.
- Etiqueta los releases en `main` (por ejemplo `git tag -a v1.0.0 -m "..."`).
