---
name: Phaser 3 con JavaScript
description: Guía para desarrollar el juego con Phaser 3 y JavaScript sobre Vite (escenas, entidades, físicas, entrada del jugador y buenas prácticas). Úsala al implementar o modificar el juego en /game.
---

# Skill: Phaser 3 con JavaScript (Vite)

## Cuándo usar esta skill

Úsala cuando la tarea consista en crear o modificar el juego en `/game`: escenas,
entidades (nave, enemigos, meteoritos, balas), físicas, entrada del jugador,
puntaje, generación de oleadas o la integración del juego con la API del backend.

## Estructura esperada

Organiza el código dentro de `/game/src` según `AGENTS.md`:

- `scenes/`: escenas de Phaser (`PreloadScene`, `MenuScene`, `GameScene`, `GameOverScene`).
- `entities/`: clases de entidades (`Nave`, `Enemigo`, `Meteorito`, `Bala`).
- `services/`: comunicación con la API (`ApiService`, `AuthService`).
- `styles/`: CSS de las páginas HTML.
- `assets/`: imágenes, sprites y sonidos.

Las páginas HTML viven en la raíz de `/game/` (`index.html`, `registro.html`,
`ranking.html`, `juego.html`).

## Ciclo de vida de una escena

Toda escena de Phaser implementa tres métodos clave:

```js
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  // 1. Cargar recursos (solo en la primera escena que los use)
  preload() {
    this.load.image('nave', 'src/assets/nave.png');
  }

  // 2. Crear objetos y estado inicial
  create() {
    this.jugador = this.physics.add.sprite(400, 500, 'nave');
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  // 3. Se ejecuta en cada frame (~60 fps)
  update(time, delta) {
    if (this.cursors.left.isDown) {
      this.jugador.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.jugador.setVelocityX(200);
    } else {
      this.jugador.setVelocityX(0);
    }
  }
}
```

## Físicas y colisiones

- Usa `this.physics.add.sprite(...)` para entidades con movimiento.
- Usa **grupos** (`this.physics.add.group()`) para enemigos y balas; mejora el rendimiento.
- Detecta choques con `this.physics.add.overlap(a, b, callback, undefined, this)`.
- Ajusta el cuerpo físico si el sprite tiene transparencia: `sprite.body.setSize(...)`.

## Entrada del jugador

- Cursores: `this.input.keyboard.createCursorKeys()`.
- Teclas sueltas: `this.input.keyboard.addKeys('SPACE,A,D,W')`.
- Disparo: comprueba `Phaser.Input.Keyboard.JustDown(this.teclas.SPACE)` para disparar una sola vez por pulsación.

## Generación de enemigos y meteoritos

- Usa temporizadores: `this.time.addEvent({ delay: 1000, loop: true, callback: ... })`.
- Usa `Phaser.Math.Between(min, max)` para posiciones aleatorias.
- Recicla objetos con `grupo.get(x, y)` y `objeto.setActive(true).setVisible(true)`.

## Puntaje y fin de partida

- Lleva el puntaje en un estado de la escena (`this.puntaje`).
- Registra métricas que necesita la API: `disparos`, `aciertos` y `eventos`
  (`enemigo_destruido`, `impacto_meteorito`, `impacto_bala`, `muerte`).
- Al morir, guarda la partida con `ApiService` (ver `docs/contrato-api.md`) y pasa a `GameOverScene`.

## Integración con el backend

- No hardcodees URLs: usa una constante configurable (por ejemplo, `FRONTEND_URL`/base de API).
- Envía el JWT en `Authorization: Bearer <token>` para `POST /api/partidas`.
- Envía el arreglo `eventos` con `tipo_evento`, `enemigo_id` (o `null`) y `momento_seg`.

## Buenas prácticas

- Un archivo por clase; usa `export default`.
- Nombra las claves de escena y de texturas de forma consistente.
- Evita lógica pesada en `update()`; delega en métodos o temporizadores.
- Cierra temporizadores y listeners en `shutdown` si la escena se reinicia.

## Errores comunes

- Olvidar `this.physics.add` y por eso no hay colisiones.
- Repetir la carga de assets en cada escena (carga una sola vez en `PreloadScene`).
- Usar `this.add.sprite` cuando se necesita física (debe ser `this.physics.add.sprite`).
- No reutilizar el grupo de balas y crear cientos de objetos nuevos.
