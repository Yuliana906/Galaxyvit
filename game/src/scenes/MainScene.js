import Phaser from 'phaser';

// Escena principal con estética AAA: nebulosa cinematográfica y HUD de cabina.

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  init() {
    this.puntuacion = 0;
    this.vidas = 3;
    this.oleada = 1;
    // Escalas de fácil edición para ajuste visual.
    this.ESCALA_JUGADOR = 0.25;
    this.ESCALA_ENEMIGO = 0.20;
    this.ESCALA_ASTEROIDE = 0.22;
  }

  create() {
    const { width, height } = this.scale;

    // ---------- Fondo de imagen (espacio/nebulosa) cargada en BootScene ----------
    const fondoBase = this.add.graphics();
    fondoBase.fillStyle(0x05061a, 1);
    fondoBase.fillRect(0, 0, width, height);
    fondoBase.setDepth(-100);

    this.fondo = this.add
      .tileSprite(0, 0, width, height, 'fondo')
      .setOrigin(0, 0)
      .setAlpha(0.92)
      .setDepth(-99);

    

// ---------- Nave del jugador ----------
    this.nave = this.physics.add.sprite(width / 2, height - 100, 'nave');
    this.nave.setCollideWorldBounds(true);
    // Las imágenes reales pueden ser muy grandes; se reduce su escala.
    this.nave.setScale(this.ESCALA_JUGADOR);

    this.brilloNave = this.add
      .ellipse(this.nave.x, this.nave.y, 88, 88, 0x7df9ff, 0.18)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(-1);

    this.estela = this.add.particles(0, 0, 'llama', {
      speed: { min: 5, max: 20 },
      angle: { min: 85, max: 95 },
      scale: { start: 0.45, end: 0.02 },
      alpha: { start: 1, end: 0 },
      lifespan: 120,
      tint: [0x7df9ff, 0x00ffff, 0xff4fd8],
      blendMode: Phaser.BlendModes.ADD,
      follow: this.nave,
      followOffset: { x: 0, y: 24 },
      frequency: 10,
      quantity: 1,
    });
    this.estela.setDepth(-2);

    // ---------- Grupos de juego ----------
    this.balas = this.physics.add.group();
    this.enemigos = this.physics.add.group();

    // ---------- Controles ----------
    this.teclas = this.input.keyboard.addKeys({
      izquierda: 'A',
      derecha: 'D',
      arriba: 'W',
      abajo: 'S',
    });
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', () => this.disparar());

    // ---------- Colisiones ----------
    this.physics.add.overlap(this.balas, this.enemigos, (bala, enemigo) => this.destruirEnemigo(bala, enemigo));
    this.physics.add.overlap(this.nave, this.enemigos, (nave, enemigo) => this.colisionNave(enemigo));

    // ---------- Generación de enemigos ----------
    this.temporizadorSpawn = this.time.addEvent({
      delay: 880,
      loop: true,
      callback: () => this.crearEnemigo(),
    });

    // ---------- HUD ----------
    this.createHud(width, height);
    this.actualizarHud();
  }

  update(_tiempo, delta) {
    const velocidad = 325;

    if (this.cursors.left.isDown || this.teclas.izquierda.isDown) {
      this.nave.setVelocityX(-velocidad);
    } else if (this.cursors.right.isDown || this.teclas.derecha.isDown) {
      this.nave.setVelocityX(velocidad);
    } else {
      this.nave.setVelocityX(0);
    }

    if (this.cursors.up.isDown || this.teclas.arriba.isDown) {
      this.nave.setVelocityY(-velocidad);
    } else if (this.cursors.down.isDown || this.teclas.abajo.isDown) {
      this.nave.setVelocityY(velocidad);
    } else {
      this.nave.setVelocityY(0);
    }

    this.brilloNave.setPosition(this.nave.x, this.nave.y + 12);
    if (this.fondo) {
      this.fondo.tilePositionY += delta * 0.03;
    }




    this.balas.getChildren().forEach((bala) => {
      if (bala.y < -35 || bala.y > this.scale.height + 35) {
        bala.destroy();
      }
    });

    this.enemigos.getChildren().forEach((enemigo) => {
      if (enemigo.y > this.scale.height + 55) {
        enemigo.destroy();
        this.puntuacion = Math.max(0, this.puntuacion - 5);
        this.actualizarHud();
      }
    });

    const nuevaOleada = 1 + Math.floor(this.puntuacion / 140);
    if (nuevaOleada !== this.oleada) {
      this.oleada = nuevaOleada;
      this.actualizarHud();
      if (this.temporizadorSpawn) {
        this.temporizadorSpawn.delay = Math.max(400, 880 - (this.oleada - 1) * 75);
      }
    }
  }


  // Crea HUD futurista con energías, puntuación y oleada.
  createHud(width, height) {
    const panelSuperior = this.add.graphics().setDepth(20);
    panelSuperior.fillStyle(0x05091a, 0.72);
    panelSuperior.fillRoundedRect(12, 10, width - 24, 70, 16);
    panelSuperior.lineStyle(1.4, 0x7df9ff, 0.55);
    panelSuperior.strokeRoundedRect(12, 10, width - 24, 70, 16);
    panelSuperior.fillStyle(0xff4fd8, 0.08);
    panelSuperior.fillRoundedRect(12, 10, width - 24, 70, 16);

    this.textoPuntuacion = this.add.text(30, 18, 'PUNTUACIÓN\n0', {
      fontFamily: 'Consolas, Courier New, monospace',
      fontSize: '21px',
      color: '#7df9ff',
      align: 'left',
      shadow: { offsetX: 0, offsetY: 0, blur: 14, color: '#7df9ff', fill: true },
    }).setDepth(21);

    this.corazones = [];
    for (let i = 0; i < 3; i += 1) {
      const corazon = this.add.graphics().setDepth(21);
      this.corazones.push(corazon);
    }
    this.dibujarCorazones(width);

    const panelInferior = this.add.graphics().setDepth(20);
    panelInferior.fillStyle(0x05091a, 0.68);
    panelInferior.fillRoundedRect(width / 2 - 135, height - 52, 270, 40, 14);
    panelInferior.lineStyle(1.4, 0xff4fd8, 0.55);
    panelInferior.strokeRoundedRect(width / 2 - 135, height - 52, 270, 40, 14);

    this.textoOleada = this.add.text(width / 2, height - 32, 'OLEADA 1', {
      fontFamily: 'Consolas, Courier New, monospace',
      fontSize: '20px',
      color: '#ff4fd8',
      shadow: { offsetX: 0, offsetY: 0, blur: 12, color: '#ff4fd8', fill: true },
    }).setOrigin(0.5).setDepth(21);

    this.add.text(30, height - 32, 'WASD/Flechas mover | Espacio disparar', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '13px',
      color: '#a8b3e8',
    }).setDepth(21);
  }

  dibujarCorazones(width) {
    const baseX = width - 118;
    const baseY = 18;
    this.corazones.forEach((corazon, indice) => {
      corazon.clear();
      const x = baseX + indice * 32;
      const y = baseY;

      corazon.fillStyle(0xff4fd8, 1);
      corazon.fillCircle(x + 5, y + 5, 5);
      corazon.fillCircle(x + 13, y + 5, 5);
      corazon.fillTriangle(x - 1, y + 6, x + 19, y + 6, x + 9, y + 17);

      corazon.lineStyle(1, 0xffffff, 0.35);
      corazon.strokeCircle(x + 5, y + 5, 5);
      corazon.strokeCircle(x + 13, y + 5, 5);
    });
  }

  actualizarHud() {
    this.textoPuntuacion.setText(`PUNTUACIÓN\n${this.puntuacion}`);

    this.corazones.forEach((corazon, indice) => {
      corazon.setAlpha(indice < this.vidas ? 1 : 0.18);
      corazon.setBlendMode(indice < this.vidas ? Phaser.BlendModes.ADD : Phaser.BlendModes.NORMAL);
    });

    this.textoOleada.setText(`OLEADA ${this.oleada}`);
  }

  crearEnemigo() {
    const esAsteroide = Phaser.Math.Between(0, 1) === 1;
    const clave = esAsteroide ? 'asteroide' : 'enemigo';

    const enemigo = this.enemigos.create(
      Phaser.Math.Between(44, this.scale.width - 44),
      -58,
      clave
    );

    const velocidadY = Phaser.Math.Between(105, 240) + Math.floor(this.puntuacion / 50) * 12;
    const velocidadX = Phaser.Math.Between(-75, 75);

    enemigo.setVelocity(velocidadX, velocidadY);
    enemigo.setRotation(Phaser.Math.FloatBetween(0, Math.PI * 2));

    if (esAsteroide) {
      enemigo.setAngularVelocity(Phaser.Math.Between(-100, 100));
      enemigo.setScale(this.ESCALA_ASTEROIDE);
    } else {
      enemigo.setScale(this.ESCALA_ENEMIGO);
    }
  }

  disparar() {
    const bala = this.balas.create(this.nave.x, this.nave.y - 34, 'bala');
    if (!bala) return;
    bala.setVelocityY(-530);
    bala.setBlendMode(Phaser.BlendModes.ADD);
  }

  destruirEnemigo(bala, enemigo) {
    bala.destroy();
    enemigo.destroy();

    const explosion = this.add.particles(enemigo.x, enemigo.y, 'particula', {
      speed: { min: 75, max: 205 },
      scale: { start: 0.85, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 440,
      tint: [0xff4fd8, 0xffa6f3, 0x7df9ff, 0xffffff, 0xff8a2a],
      blendMode: Phaser.BlendModes.ADD,
      emitting: false,
    });
    explosion.explode(24);
    this.time.delayedCall(560, () => explosion.destroy());

    this.puntuacion += enemigo.texture.key === 'asteroide' ? 15 : 10;
    this.actualizarHud();
  }

  colisionNave(enemigo) {
    enemigo.destroy();

    this.nave.setTint(0xff4fd8);
    this.time.delayedCall(260, () => this.nave.clearTint());

    this.vidas -= 1;
    this.actualizarHud();

    if (this.vidas <= 0) {
      if (this.temporizadorSpawn) {
        this.temporizadorSpawn.remove(false);
      }
      this.scene.start('GameOverScene', { puntuacion: this.puntuacion });
    }
  }
}
