/**
 * Servicio de gestión del estado del juego.
 * Controla el flujo entre menú, partida y pantalla de Game Over.
 * Lleva el registro de puntuación, vidas y dificultad de la partida actual.
 */
export class EstadoJuego {
  constructor() {
    this.estadoActual = 'menu'; // 'menu' | 'jugando' | 'gameOver'
    this.puntuacionActual = 0;
    this.vidasActuales = 3;
    this.vidasMaximas = 3;
    this.nivelDificultad = 1;
    this.tiempoPartida = 0;
  }

  /**
   * Inicia una nueva partida.
   */
  iniciarPartida() {
    this.estadoActual = 'jugando';
    this.puntuacionActual = 0;
    this.vidasActuales = this.vidasMaximas;
    this.nivelDificultad = 1;
    this.tiempoPartida = 0;
  }

  /**
   * Finaliza la partida actual y pasa a estado de Game Over.
   */
  finalizarPartida() {
    this.estadoActual = 'gameOver';
  }

  /**
   * Vuelve al menú principal.
   */
  volverMenu() {
    this.estadoActual = 'menu';
  }

  /**
   * Incrementa la puntuación de la partida actual.
   * @param {number} puntos - Puntos a sumar
   */
  sumarPuntuacion(puntos) {
    this.puntuacionActual += puntos;
  }

  /**
   * Resta una vida al jugador.
   * @returns {boolean} true si se restó vida, false si ya no quedan vidas
   */
  restarVida() {
    if (this.vidasActuales > 0) {
      this.vidasActuales -= 1;
    }
    return this.vidasActuales > 0;
  }

  /**
   * Devuelve si el jugador aún tiene vidas disponibles.
   * @returns {boolean}
   */
  tieneVidas() {
    return this.vidasActuales > 0;
  }

  /**
   * Incrementa el nivel de dificultad (llamado periódicamente durante la partida).
   */
  aumentarDificultad() {
    this.nivelDificultad += 0.5;
  }

  /**
   * Devuelve el estado actual.
   * @returns {string}
   */
  getEstado() {
    return this.estadoActual;
  }

  /**
   * Devuelve la puntuación actual.
   * @returns {number}
   */
  getPuntuacion() {
    return this.puntuacionActual;
  }

  /**
   * Devuelve las vidas actuales.
   * @returns {number}
   */
  getVidas() {
    return this.vidasActuales;
  }

  /**
   * Devuelve el nivel de dificultad actual.
   * @returns {number}
   */
  getDificultad() {
    return this.nivelDificultad;
  }

  /**
   * Devuelve el tiempo transcurrido en la partida.
   * @returns {number}
   */
  getTiempoPartida() {
    return this.tiempoPartida;
  }

  /**
   * Actualiza el tiempo transcurrido en la partida.
   * @param {number} delta - Milisegundos transcurridos desde el último frame
   */
  actualizarTiempo(delta) {
    this.tiempoPartida += delta;
  }
}

// Instancia singleton compartida entre escenas
export const estadoJuego = new EstadoJuego();
