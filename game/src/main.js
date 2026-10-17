// Punto de entrada del videojuego con Phaser 3.

import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import MainScene from './scenes/MainScene.js';
import GameOverScene from './scenes/GameOverScene.js';

const configuracion = {
  type: Phaser.AUTO,
  parent: 'contenedor-juego',
  width: 900,
  height: 600,
  backgroundColor: '#050615',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, MenuScene, MainScene, GameOverScene],
};

// Crea el juego y lo monta en el contenedor del HTML.
const juego = new Phaser.Game(configuracion);

export default juego;
