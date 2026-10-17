import Phaser from 'phaser';
import { estadoJuego } from '../services/EstadoJuego.js';

/**
 * Escena de fin de partida (Game Over).
 * Muestra la puntuación obtenida, las vidas restantes y opciones para reiniciar o volver al menú.
 */
export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    const { width, height } = this.scale;

    // Fondo oscuro
    this.add.rectangle(0, 0, width, height, 0x000000, 0.85).setOrigin(0);

    // Título Game Over
    this.add.text(width / 2, height / 3 - 20, 'GAME OVER', {
      fontSize: '48px',
      color: '#ff0000',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Puntuación obtenida en la partida
    this.add.text(width / 2, height / 2 - 40, `Puntuación: ${estadoJuego.getPuntuacion()}`, {
      fontSize: '32px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Vidas restantes (siempre 0 si llegó por daño, pero se muestra por claridad)
    this.add.text(width / 2, height / 2, `Vidas restantes: ${estadoJuego.getVidas()}`, {
      fontSize: '24px',
      color: '#ffaaaa',
    }).setOrigin(0.5);

    // Botón para volver al menú
    const btnMenu = this.add.text(width / 2, height / 2 + 70, 'VOLVER AL MENÚ', {
      fontSize: '28px',
      color: '#ffffff',
      backgroundColor: '#004400',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btnMenu.on('pointerdown', () => {
      estadoJuego.volverMenu();
      this.scene.start('MenuScene');
    });

    btnMenu.on('pointerover', () => btnMenu.setColor('#ffff00'));
    btnMenu.on('pointerout', () => btnMenu.setColor('#ffffff'));

    // Botón para reiniciar partida
    const btnReiniciar = this.add.text(width / 2, height / 2 + 130, 'REINICIAR PARTIDA', {
      fontSize: '28px',
      color: '#ffffff',
      backgroundColor: '#440000',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btnReiniciar.on('pointerdown', () => {
      this.scene.start('JuegoScene');
    });

    btnReiniciar.on('pointerover', () => btnReiniciar.setColor('#ffff00'));
    btnReiniciar.on('pointerout', () => btnReiniciar.setColor('#ffffff'));

    // Nota de fase
    this.add.text(width / 2, height - 40, 'Fase 3 - Mecánicas de combate (sin backend ni ranking)', {
      fontSize: '14px',
      color: '#666666',
    }).setOrigin(0.5);
  }
}
