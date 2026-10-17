// Lógica de la página de login.

import { peticionApi } from '../services/api.js';
import { guardarToken } from '../services/auth.js';

const formulario = document.getElementById('formulario-login');
const mensaje = document.getElementById('mensaje-login');

function mostrarMensaje(texto, tipo = 'error') {
  mensaje.textContent = texto;
  mensaje.className = `mensaje-estado ${tipo}`;
  mensaje.style.display = 'block';
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    mostrarMensaje('Completa todos los campos.', 'error');
    return;
  }

  mostrarMensaje('Verificando credenciales...', 'exito');

  try {
    // Endpoint provisional; ajustar al contrato real del backend.
    const respuesta = await peticionApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!respuesta || !respuesta.token) {
      throw new Error('Respuesta inválida del servidor.');
    }

    guardarToken(respuesta.token);
    mostrarMensaje('Sesión iniciada. Redirigiendo...', 'exito');
    window.location.href = 'juego.html';
  } catch (error) {
    mostrarMensaje(error.message || 'No fue posible iniciar sesión.', 'error');
  }
});
