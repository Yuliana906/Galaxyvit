import Phaser from 'phaser';

// Escena inicial: precarga de activos reales y genera texturas auxiliares.

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  // Precarga las imágenes reales usadas por el juego.
  preload() {
    this.load.image('fondo', 'src/assets/fondo.jpg');
    this.load.image('nave', 'src/assets/nave.png');
    this.load.image('enemigo', 'src/assets/enemigo.png');
    this.load.image('asteroide', 'src/assets/asteroide.png');
  }

  create() {
    // Textura de disparo: láser delgado con borde neón y centro blanco.
    const bala = this.add.graphics();
    bala.fillStyle(0xb9ffff, 0.35);
    bala.fillRoundedRect(0, 0, 6, 18, 3);
    bala.lineStyle(1.2, 0x7df9ff, 1);
    bala.strokeRoundedRect(0, 0, 6, 18, 3);
    bala.fillStyle(0x7df9ff, 1);
    bala.fillRoundedRect(1, 1, 4, 16, 2);
    bala.fillStyle(0xffffff, 1);
    bala.fillRoundedRect(2, 2, 2, 14, 1.5);
    bala.generateTexture('bala', 6, 18);
    bala.destroy();

    // Textura de partícula.
    const particula = this.add.graphics();
    particula.fillStyle(0xffffff, 1);
    particula.fillCircle(6, 6, 6);
    particula.generateTexture('particula', 12, 12);
    particula.destroy();

    // Textura de estrella.
    const estrella = this.add.graphics();
    estrella.fillStyle(0xffffff, 1);
    estrella.fillCircle(2, 2, 2);
    estrella.fillStyle(0x7df9ff, 0.45);
    estrella.fillCircle(2, 2, 4);
    estrella.generateTexture('estrella', 8, 8);
    estrella.destroy();

    // Textura de llama de neón para la estela del motor.
    const llama = this.add.graphics();
    llama.fillStyle(0xffffff, 1);
    llama.fillCircle(16, 16, 16);
    llama.fillStyle(0xff4fd8, 0.55);
    llama.fillCircle(16, 16, 11);
    llama.fillStyle(0x7df9ff, 0.85);
    llama.fillCircle(16, 16, 6);
    llama.fillStyle(0xffffff, 1);
    llama.fillCircle(16, 16, 2.5);
    llama.generateTexture('llama', 32, 32);
    llama.destroy();

    // Los activos principales ('fondo', 'nave', 'enemigo', 'asteroide')
    // se cargan desde /game/src/assets/ en preload().

    this.scene.start('MenuScene');
  }
}