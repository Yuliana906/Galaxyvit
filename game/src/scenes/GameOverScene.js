import Phaser from 'phaser';

// Escena de Game Over: muestra puntuación y opciones de reinicio o ranking.

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(datos) {
    this.puntuacionFinal = datos?.puntuacion || 0;
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, 150, 'GAME OVER', {
        fontSize: '48px',
        color: '#ff4fd8',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 230, `Puntuación final: ${this.puntuacionFinal}`, {
        fontSize: '24px',
        color: '#7df9ff',
      })
      .setOrigin(0.5);

    const botonReiniciar = this.add
      .text(width / 2, 330, 'REINTENTAR', {
        fontSize: '24px',
        color: '#0a0f22',
        backgroundColor: '#7df9ff',
        padding: { x: 16, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    botonReiniciar.on('pointerover', () => botonReiniciar.setStyle({ backgroundColor: '#ff4fd8' }));
    botonReiniciar.on('pointerout', () => botonReiniciar.setStyle({ backgroundColor: '#7df9ff' }));
    botonReiniciar.on('pointerdown', () => this.scene.start('MainScene'));

    const botonRanking = this.add
      .text(width / 2, 410, 'ENVIAR / VER RANKING', {
        fontSize: '20px',
        color: '#7df9ff',
        backgroundColor: 'rgba(16,24,58,0.6)',
        padding: { x: 14, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    botonRanking.on('pointerdown', () => {
      window.location.href = 'ranking.html';
    });

    const botonMenu = this.add
      .text(width / 2, 490, 'MENÚ', {
        fontSize: '18px',
        color: '#a8b3e8',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    botonMenu.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
