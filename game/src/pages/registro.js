// Lógica de la página de registro.

import { peticionApi } from '../services/api.js';

const formulario = document.getElementById('formulario-registro');
const mensaje = document.getElementById('mensaje-registro');

function mostrarMensaje(texto, tipo = 'error') {
  mensaje.textContent = texto;
  mensaje.className = `mensaje-estado ${tipo}`;
  mensaje.style.display = 'block';
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!nombre || !email || !password) {
    mostrarMensaje('Completa todos los campos.', 'error');
    return;
  }

  mostrarMensaje('Creando cuenta...', 'exito');

  try {
    // Endpoint provisional; ajustar al contrato real del backend.
    await peticionApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nombre, email, password }),
    });

    mostrarMensaje('Cuenta creada. Redirigiendo al login...', 'exito');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1200);
  } catch (error) {
    mostrarMensaje(error.message || 'No fue posible registrarse.', 'error');
  }
});
