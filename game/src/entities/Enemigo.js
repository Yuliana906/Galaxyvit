import Phaser from 'phaser';

/**
 * Entidad Enemigo.
 * Enemigo que cae desde la parte superior de la pantalla.
 * Puede ser destruido por los disparos del jugador.
 */
export class Enemigo extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, velocidad) {
    super(scene, x, y, 'enemigo');

    // Velocidad de caída en píxeles por segundo
    this.velocidad = velocidad || 150;

    // Puntuación otorgada al destruirlo
    this.puntos = 50;

    // Estado activo
    this.estaActivo = true;

    this.setDepth(1);
  }

  /**
   * Actualiza el movimiento del enemigo cada frame.
   * Llamado automáticamente por Phaser a través de runChildUpdate del grupo.
   */
  update() {
    if (!this.active || !this.estaActivo || !this.body) return;

    this.setVelocityY(this.velocidad);

    // Desactivar si sale de la pantalla
    if (this.y > this.scene.scale.height + 40) {
      this.destruir();
    }
  }

  /**
   * Desactiva el enemigo y su cuerpo de física.
   */
  destruir() {
    this.estaActivo = false;

    if (this.body) {
      this.body.enable = false;
    }

    this.setActive(false);
    this.setVisible(false);
  }
}
