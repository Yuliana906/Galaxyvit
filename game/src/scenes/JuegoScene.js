import Phaser from 'phaser';
import { Nave } from '../entities/Nave.js';
import { Enemigo } from '../entities/Enemigo.js';
import { Meteorito } from '../entities/Meteorito.js';
import { estadoJuego } from '../services/EstadoJuego.js';

/**
 * Escena principal de la partida.
 * Contiene la nave del jugador, enemigos, meteoritos, colisiones, puntuación,
 * sistema de tres vidas y dificultad progresiva.
 *
 * NOTA: Esta fase no incluye integración con backend, Supabase ni ranking global.
 * La puntuación es local por partida.
 */
export class JuegoScene extends Phaser.Scene {
  constructor() {
    super('JuegoScene');
  }

  create() {
    const { width, height } = this.scale;

    // --- Fondo con estrellas ---
    this.add.image(400, 300, 'fondo').setAlpha(0.4);

    // --- Estado del juego ---
    estadoJuego.iniciarPartida();

    // --- Indicadores en pantalla (puntuación y vidas) ---
    this.textoPuntuacion = this.add.text(20, 20, 'Puntuación: 0', {
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    });

    this.textoVidas = this.add.text(20, 50, 'Vidas: 3', {
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    });

    // Mensaje informativo sobre controles
    this.add.text(width / 2, height - 40, 'WASD/Flechas: mover  |  Espacio: disparar  |  Q: rendirse (pruebas)', {
      fontSize: '14px',
      color: '#888888',
    }).setOrigin(0.5);

    // --- Grupo de proyectiles del jugador ---
    this.grupoProyectiles = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      runChildUpdate: true,
    });

    // --- Grupo de enemigos ---
    this.grupoEnemigos = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      runChildUpdate: true,
    });

    // --- Grupo de meteoritos ---
    this.grupoMeteoritos = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      runChildUpdate: true,
    });

    // --- Nave del jugador (centrada al inicio) ---
    this.nave = new Nave(this, width / 2, height - 80);
    this.add.existing(this.nave);
    this.nave.establecerGrupoProyectiles(this.grupoProyectiles);

    // --- Controles de teclado ---
    this.teclas = this.input.keyboard.createCursorKeys();
    this.teclas.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.teclas.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.teclas.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.teclas.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.nave.inicializarControles(this.teclas);

    // Tecla Q para finalizar la partida inmediatamente (solo para pruebas en Fase 3)
    this.teclaQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

    // --- Temporizadores de aparición progresiva ---
    this.intervaloEnemigoBase = 1200;
    this.tiempoUltimoEnemigo = 0;

    this.intervaloMeteoritoBase = 2500;
    this.tiempoUltimoMeteorito = 0;

    // --- Dificultad progresiva ---
    this.intervaloAumentoDificultad = 10000;
    this.tiempoUltimoAumentoDificultad = 0;

    // Velocidad base de enemigos y meteoritos
    this.velocidadBaseEnemigo = 150;
    this.velocidadBaseMeteorito = 180;

    // --- Colisiones (configuradas UNA SOLA VEZ en create) ---
    // Proyectil vs Enemigo: destruye ambos y suma puntuación
    this.physics.add.overlap(
      this.grupoProyectiles,
      this.grupoEnemigos,
      (proyectil, enemigo) => {
        if (!proyectil.active || !enemigo.active) return;

        proyectil.setActive(false);
        proyectil.setVisible(false);

        enemigo.destruir();
        const puntos = enemigo.puntos || 50;
        estadoJuego.sumarPuntuacion(puntos);
        this.textoPuntuacion.setText(`Puntuación: ${estadoJuego.getPuntuacion()}`);
      }
    );

    // Nave vs Enemigo: quita vida a la nave, destruye el enemigo
    this.physics.add.overlap(
      this.nave,
      this.grupoEnemigos,
      (nave, enemigo) => {
        if (!nave.estaVivo || !enemigo.active) return;

        enemigo.destruir();

        const vidaPerdida = nave.recibirDaño();
        if (vidaPerdida) {
          estadoJuego.restarVida();
          this.textoVidas.setText(`Vidas: ${estadoJuego.getVidas()}`);

          if (estadoJuego.getVidas() <= 0) {
            this.finalizarPartida();
          }
        }
      }
    );

    // Nave vs Meteorito: quita vida a la nave, destruye el meteorito
    this.physics.add.overlap(
      this.nave,
      this.grupoMeteoritos,
      (nave, meteorito) => {
        if (!nave.estaVivo || !meteorito.active) return;

        meteorito.destruir();

        const vidaPerdida = nave.recibirDaño();
        if (vidaPerdida) {
          estadoJuego.restarVida();
          this.textoVidas.setText(`Vidas: ${estadoJuego.getVidas()}`);

          if (estadoJuego.getVidas() <= 0) {
            this.finalizarPartida();
          }
        }
      }
    );
  }

  update() {
    // Si la partida ya terminó, no procesar lógica de juego
    if (estadoJuego.getEstado() !== 'jugando') return;

    // Actualizar nave (movimiento y disparo)
    this.nave.actualizar();

    // Actualizar proyectiles: eliminar los que salen del área visible
    this.grupoProyectiles.children.iterate((proyectil) => {
      if (proyectil.active && proyectil.y < 0) {
        proyectil.setActive(false);
        proyectil.setVisible(false);
      }
    });

    // Los enemigos y meteoritos se actualizan automáticamente mediante
    // runChildUpdate: true y su método update() sobrescrito.

    // --- Spawn progresivo de enemigos ---
    this.tiempoUltimoEnemigo += this.game.loop.delta;
    const intervaloEnemigoActual = Math.max(
      400,
      this.intervaloEnemigoBase / estadoJuego.getDificultad()
    );
    if (this.tiempoUltimoEnemigo >= intervaloEnemigoActual) {
      this.spawnEnemigo();
      this.tiempoUltimoEnemigo = 0;
    }

    // --- Spawn progresivo de meteoritos ---
    this.tiempoUltimoMeteorito += this.game.loop.delta;
    const intervaloMeteoritoActual = Math.max(
      800,
      this.intervaloMeteoritoBase / estadoJuego.getDificultad()
    );
    if (this.tiempoUltimoMeteorito >= intervaloMeteoritoActual) {
      this.spawnMeteorito();
      this.tiempoUltimoMeteorito = 0;
    }

    // --- Dificultad progresiva cada 10 segundos ---
    this.tiempoUltimoAumentoDificultad += this.game.loop.delta;
    if (this.tiempoUltimoAumentoDificultad >= this.intervaloAumentoDificultad) {
      estadoJuego.aumentarDificultad();
      this.tiempoUltimoAumentoDificultad = 0;
    }

    // --- Tiempo transcurrido (información interna) ---
    estadoJuego.actualizarTiempo(this.game.loop.delta);

    // --- Tecla Q para rendirse (pruebas rápidas) ---
    if (Phaser.Input.Keyboard.JustDown(this.teclaQ)) {
      this.finalizarPartida();
    }
  }

  /**
   * Crea un nuevo enemigo en posición X aleatoria en la parte superior.
   * Instancia la clase Enemigo y configura su cuerpo de física correctamente.
   */
  spawnEnemigo() {
    const { width } = this.scale;
    const x = Phaser.Math.Between(40, width - 40);
    const y = -30;
    const velocidad = this.velocidadBaseEnemigo * estadoJuego.getDificultad();

    const enemigo = new Enemigo(this, x, y, velocidad);

    // Añadir explícitamente a la escena para asegurar visibilidad
    // (el cuerpo de física ya se crea en el constructor de Enemigo)
    this.add.existing(enemigo);
    this.grupoEnemigos.add(enemigo);
    enemigo.setCollideWorldBounds(false);
  }

  /**
   * Crea un nuevo meteorito en posición X aleatoria en la parte superior.
   * Instancia la clase Meteorito y configura su cuerpo de física correctamente.
   */
  spawnMeteorito() {
    const { width } = this.scale;
    const x = Phaser.Math.Between(40, width - 40);
    const y = -40;
    const velocidad = this.velocidadBaseMeteorito * estadoJuego.getDificultad();

    const meteorito = new Meteorito(this, x, y, velocidad);

    // Añadir explícitamente a la escena para asegurar visibilidad
    // (el cuerpo de física ya se crea en el constructor de Meteorito)
    this.add.existing(meteorito);
    this.grupoMeteoritos.add(meteorito);
    meteorito.setCollideWorldBounds(false);
  }

  /**
   * Finaliza la partida y transiciona a la escena de Game Over.
   */
  finalizarPartida() {
    estadoJuego.finalizarPartida();
    this.scene.start('GameOverScene');
  }
}
