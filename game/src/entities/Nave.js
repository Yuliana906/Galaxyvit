import Phaser from 'phaser';

/**
 * Entidad Nave del jugador.
 * Gestiona su propio movimiento, disparo, cooldown, vidas y protección tras daño.
 */
export class Nave extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'nave');

    // Asegurar que el cuerpo de física está habilitado (Phaser 3.60 no lo hace automáticamente
    // en el constructor de Arcade.Sprite en todas las configuraciones)
    this.scene.physics.add.existing(this);

    this.body.setCollideWorldBounds(true);
    this.setDepth(1);

    // Velocidad de movimiento en píxeles por segundo
    this.velocidad = 300;

    // Contador de cooldown de disparo en milisegundos
    this.cooldownDisparo = 0;
    this.tiempoEntreDisparos = 400; // 400 ms entre disparos

    // Referencia al grupo de proyectiles (inyectado desde la escena)
    this.grupoProyectiles = null;

    // Teclas de control (inyectadas desde la escena)
    this.teclas = null;

    // --- Sistema de vidas ---
    this.vidas = 3;
    this.estaVivo = true;

    // --- Protección tras recibir daño (invencibilidad temporal) ---
    this.tiempoProteccion = 0; // milisegundos restantes de protección
    this.duracionProteccion = 2000; // 2 segundos de invencibilidad tras daño
  }

  /**
   * Inyecta las teclas de cursor para el movimiento.
   * @param {Phaser.Types.Input.Keyboard.CursorKeys} teclas
   */
  inicializarControles(teclas) {
    this.teclas = teclas;
  }

  /**
   * Inyecta el grupo de proyectiles para poder disparar.
   * @param {Phaser.Physics.Arcade.Group} grupoProyectiles
   */
  establecerGrupoProyectiles(grupoProyectiles) {
    this.grupoProyectiles = grupoProyectiles;
  }

  /**
   * Resta una vida si la nave no está bajo protección.
   * @returns {boolean} true si se aplicó daño efectivo, false si la nave estaba protegida o ya estaba muerta
   */
  recibirDaño() {
    if (!this.estaVivo) return false;
    if (this.tiempoProteccion > 0) return false;

    this.vidas -= 1;

    if (this.vidas <= 0) {
      this.vidas = 0;
      this.estaVivo = false;
      this.setActive(false);
      this.setVisible(false);
      return true;
    }

    // Todavía quedan vidas — activar protección temporal
    this.tiempoProteccion = this.duracionProteccion;
    return true;
  }

  /**
   * Reinicia la nave a su estado inicial (nueva partida).
   */
  reiniciar() {
    this.vidas = 3;
    this.estaVivo = true;
    this.tiempoProteccion = 0;
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(this.scene.scale.width / 2, this.scene.scale.height - 80);
    this.setVelocity(0);
  }

  /**
   * Actualiza la nave cada frame: movimiento, disparo y temporizador de protección.
   */
  actualizar() {
    if (!this.teclas || !this.estaVivo) return;

    // Movimiento con WASD o flechas
    this.setVelocity(0);

    if (this.teclas.left.isDown || this.teclas.A.isDown) {
      this.setVelocityX(-this.velocidad);
    } else if (this.teclas.right.isDown || this.teclas.D.isDown) {
      this.setVelocityX(this.velocidad);
    }

    if (this.teclas.up.isDown || this.teclas.W.isDown) {
      this.setVelocityY(-this.velocidad);
    } else if (this.teclas.down.isDown || this.teclas.S.isDown) {
      this.setVelocityY(this.velocidad);
    }

    // Disparo con barra espaciadora (con cooldown)
    if (this.teclas.space.isDown && this.cooldownDisparo <= 0) {
      this.disparar();
      this.cooldownDisparo = this.tiempoEntreDisparos;
    }

    // Decrementar cooldown de disparo
    if (this.cooldownDisparo > 0) {
      this.cooldownDisparo -= this.scene.game.loop.delta;
    }

    // Decrementar temporizador de protección y aplicar parpadeo visual
    if (this.tiempoProteccion > 0) {
      this.tiempoProteccion -= this.scene.game.loop.delta;

      // Parpadeo: alternar visibilidad cada 100 ms mientras hay protección
      const parpadeo = Math.floor(this.scene.time.now / 100) % 2 === 0;
      this.setVisible(parpadeo);

      if (this.tiempoProteccion <= 0) {
        this.setVisible(true);
      }
    }
  }

  /**
   * Crea un proyectil y lo añade al grupo activo.
   */
  disparar() {
    if (!this.grupoProyectiles) return;

    const proyectil = this.grupoProyectiles.get(this.x, this.y - 20, 'proyectil');

    if (proyectil) {
      proyectil.setActive(true);
      proyectil.setVisible(true);
      proyectil.setVelocityY(-500);
    }
  }
}
