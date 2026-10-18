// Lógica de la página de ranking.
// La guardia de autenticación se ejecuta desde ranking.html.

import { peticionApi } from '../services/api.js';

const cuerpoRanking = document.getElementById('cuerpo-ranking');
const mensajeRanking = document.getElementById('mensaje-ranking');

function mostrarMensaje(texto, tipo = 'error') {
  mensajeRanking.textContent = texto;
  mensajeRanking.className = `mensaje-estado ${tipo}`;
  mensajeRanking.style.display = 'block';
}

function renderizarFilas(datos) {
  cuerpoRanking.innerHTML = '';

  if (!Array.isArray(datos) || datos.length === 0) {
    const fila = document.createElement('tr');
    const celda = document.createElement('td');
    celda.colSpan = 4;
    celda.textContent = 'Sin resultados por ahora.';
    fila.appendChild(celda);
    cuerpoRanking.appendChild(fila);
    return;
  }

  datos.forEach((filaDatos, indice) => {
    const fila = document.createElement('tr');

    const celdaPosicion = document.createElement('td');
    celdaPosicion.className = 'posicion';
    celdaPosicion.textContent = `#${indice + 1}`;

    const celdaJugador = document.createElement('td');
    celdaJugador.textContent = filaDatos.jugador || filaDatos.nombre || 'Jugador';

    const celdaPuntuacion = document.createElement('td');
    celdaPuntuacion.textContent = filaDatos.puntuacion ?? '-';

    const celdaFecha = document.createElement('td');
    celdaFecha.textContent = filaDatos.fecha ? new Date(filaDatos.fecha).toLocaleDateString('es-ES') : '-';

    fila.appendChild(celdaPosicion);
    fila.appendChild(celdaJugador);
    fila.appendChild(celdaPuntuacion);
    fila.appendChild(celdaFecha);
    cuerpoRanking.appendChild(fila);
  });
}

async function cargarRanking() {
  try {
    // Endpoint provisional; ajustar al contrato real del backend.
    const respuesta = await peticionApi('/ranking', { method: 'GET' });
    const lista = Array.isArray(respuesta) ? respuesta : respuesta?.ranking || [];
    renderizarFilas(lista);
  } catch (error) {
    cuerpoRanking.innerHTML = '';
    const fila = document.createElement('tr');
    const celda = document.createElement('td');
    celda.colSpan = 4;
    celda.textContent = 'No fue posible cargar el ranking.';
    fila.appendChild(celda);
    cuerpoRanking.appendChild(fila);
    mostrarMensaje(error.message || 'Error al cargar el ranking.', 'error');
  }
}

cargarRanking();
