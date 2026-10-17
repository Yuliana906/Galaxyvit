import Phaser from 'phaser';

// Escena de menú principal dentro del canvas.

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, 120, 'SPACE SHOOTER RANKING', {
        fontSize: '40px',
        color: '#7df9ff',
        fontFamily: 'system-ui, sans-serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 170, 'Destruye enemigos y consigue la mejor puntuación.', {
        fontSize: '16px',
        color: '#a8b3e8',
      })
      .setOrigin(0.5);

    const instrucciones = [
      'Controles:',
      'Flechas / WASD: mover la nave',
      'Espacio: disparar',
      'Evita colisionar con enemigos',
    ];

    this.add
      .text(width / 2, 230, instrucciones.join('\n'), {
        fontSize: '16px',
        color: '#e8ecff',
        align: 'center',
        lineSpacing: 6,
      })
      .setOrigin(0.5);

    const botonJugar = this.add
      .text(width / 2, 390, 'JUGAR', {
        fontSize: '28px',
        color: '#0a0f22',
        backgroundColor: '#7df9ff',
        padding: { x: 18, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    botonJugar.on('pointerover', () => botonJugar.setStyle({ backgroundColor: '#ff4fd8' }));
    botonJugar.on('pointerout', () => botonJugar.setStyle({ backgroundColor: '#7df9ff' }));
    botonJugar.on('pointerdown', () => this.scene.start('MainScene'));

    const botonRanking = this.add
      .text(width / 2, 460, 'VER RANKING', {
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
  }
}