import Phaser from 'phaser';

/**
 * Escena de precarga.
 * Genera recursos gráficos provisionales con Phaser (sin depender de archivos de sprites).
 * Al terminar, transiciona a la escena de menú.
 */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  create() {
    // --- Textura provisional de la nave (triángulo verde) ---
    const graphicsNave = this.make.graphics({ x: 0, y: 0, add: false });
    graphicsNave.fillStyle(0x00ff00, 1);
    graphicsNave.beginPath();
    graphicsNave.moveTo(0, -22);
    graphicsNave.lineTo(12, 22);
    graphicsNave.lineTo(-12, 22);
    graphicsNave.closePath();
    graphicsNave.fillPath();
    graphicsNave.generateTexture('nave', 24, 48);

    // --- Textura provisional del proyectil (círculo amarillo) ---
    const graphicsProyectil = this.make.graphics({ x: 0, y: 0, add: false });
    graphicsProyectil.fillStyle(0xffff00, 1);
    graphicsProyectil.fillCircle(4, 4, 4);
    graphicsProyectil.generateTexture('proyectil', 8, 8);

    // --- Textura provisional del enemigo (cuadrado rojo) ---
    const graphicsEnemigo = this.make.graphics({ x: 0, y: 0, add: false });
    graphicsEnemigo.fillStyle(0xff0000, 1);
    graphicsEnemigo.fillRect(0, 0, 30, 30);
    // Detalle: ojos del enemigo
    graphicsEnemigo.fillStyle(0xffffff, 1);
    graphicsEnemigo.fillRect(8, 10, 4, 4);
    graphicsEnemigo.fillRect(18, 10, 4, 4);
    graphicsEnemigo.generateTexture('enemigo', 30, 30);

    // --- Textura provisional del meteorito (círculo gris con cráteres) ---
    const graphicsMeteorito = this.make.graphics({ x: 0, y: 0, add: false });
    graphicsMeteorito.fillStyle(0x888888, 1);
    graphicsMeteorito.fillCircle(20, 20, 20);
    // Detalle: cráteres
    graphicsMeteorito.fillStyle(0x666666, 1);
    graphicsMeteorito.fillCircle(12, 14, 5);
    graphicsMeteorito.fillCircle(28, 26, 6);
    graphicsMeteorito.fillCircle(16, 30, 4);
    graphicsMeteorito.generateTexture('meteorito', 40, 40);

    // --- Textura provisional del fondo (estrellas simples) ---
    const graphicsFondo = this.make.graphics({ x: 0, y: 0, add: false });
    graphicsFondo.fillStyle(0xffffff, 0.5);
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, 800);
      const y = Phaser.Math.Between(0, 600);
      const r = Phaser.Math.Between(1, 3);
      graphicsFondo.fillCircle(x, y, r);
    }
    graphicsFondo.generateTexture('fondo', 800, 600);

    // Transicionar al menú principal
    this.scene.start('MenuScene');
  }
}
