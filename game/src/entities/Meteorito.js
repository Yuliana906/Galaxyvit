import Phaser from 'phaser';

/**
 * Entidad Meteorito.
 * Obstáculo que cae de arriba hacia abajo con rotación.
 * Al colisionar con la nave, quita una vida.
 */
export class Meteorito extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, velocidad) {
    super(scene, x, y, 'meteorito');

    // Velocidad de caída en píxeles por segundo
    this.velocidad = velocidad || 180;

    // Velocidad de rotación en grados por segundo
    this.velocidadRotacion = 60;

    // Estado activo
    this.estaActivo = true;

    this.setDepth(1);
  }

  /**
   * Actualiza el movimiento y la rotación del meteorito cada frame.
   * Llamado automáticamente por Phaser a través de runChildUpdate del grupo.
   */
  update() {
    if (!this.active || !this.estaActivo || !this.body) return;

    this.setVelocityY(this.velocidad);
    this.setAngularVelocity(this.velocidadRotacion);

    // Desactivar si sale de la pantalla
    if (this.y > this.scene.scale.height + 60) {
      this.destruir();
    }
  }

  /**
   * Desactiva el meteorito y su cuerpo de física.
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
