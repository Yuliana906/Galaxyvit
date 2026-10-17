import Phaser from 'phaser';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { JuegoScene } from './scenes/JuegoScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';

// Configuración del juego Phaser 3
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 600,
  backgroundColor: '#000011',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [PreloadScene, MenuScene, JuegoScene, GameOverScene],
};

// Inicializar la instancia del juego
new Phaser.Game(config);
