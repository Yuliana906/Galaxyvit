import Phaser from 'phaser';

/**
 * Escena de menú principal.
 * Permite iniciar una partida y muestra los controles del juego.
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const { width, height } = this.scale;

    // Fondo con estrellas
    this.add.image(400, 300, 'fondo').setAlpha(0.3);

    // Título del juego
    this.add.text(width / 2, height / 3, 'SPACE SHOOTER', {
      fontSize: '48px',
      color: '#00ff00',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Botón para iniciar partida
    const btnIniciar = this.add.text(width / 2, height / 2, 'INICIAR PARTIDA', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#004400',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btnIniciar.on('pointerdown', () => {
      this.scene.start('JuegoScene');
    });

    // Efecto hover sobre el botón
    btnIniciar.on('pointerover', () => btnIniciar.setColor('#ffff00'));
    btnIniciar.on('pointerout', () => btnIniciar.setColor('#ffffff'));

    // Instrucciones de controles
    this.add.text(width / 2, height / 2 + 80, 'Controles:', {
      fontSize: '20px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 110, 'WASD o flechas: mover nave', {
      fontSize: '18px',
      color: '#cccccc',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 140, 'Barra espaciadora: disparar', {
      fontSize: '18px',
      color: '#cccccc',
    }).setOrigin(0.5);

    // Nota de fase provisional
    this.add.text(width / 2, height - 40, 'Fase 2 - Núcleo del juego (sin enemigos ni vidas)', {
      fontSize: '14px',
      color: '#666666',
    }).setOrigin(0.5);
  }
}
