// Envoltorio para peticiones HTTP al backend.
// Envía la cabecera Authorization: Bearer <token> cuando existe sesión.

import { obtenerToken, eliminarToken } from './auth.js';

// URL base del backend. Se puede configurar mediante la variable VITE_API_URL.
const URL_BASE_API = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(
  /\/$/,
  ''
);

// Construye una URL absoluta combinando la base y la ruta solicitada.
function construirUrl(ruta) {
  const rutaNormalizada = ruta.startsWith('/') ? ruta : `/${ruta}`;
  return `${URL_BASE_API}${rutaNormalizada}`;
}

// Realiza una petición fetch genérica al backend.
// opciones: objeto compatible con fetch (method, body, headers, etc.).
// Si la respuesta es 401, se elimina el token y se redirige al login.
export async function peticionApi(ruta, opciones = {}) {
  const token = obtenerToken();

  const encabezados = {
    'Content-Type': 'application/json',
    ...(opciones.headers || {}),
  };

  if (token) {
    encabezados.Authorization = `Bearer ${token}`;
  }

  const respuesta = await fetch(construirUrl(ruta), {
    ...opciones,
    headers: encabezados,
  });

  // Guard de autenticación: sin sesión o token inválido.
  if (respuesta.status === 401) {
    eliminarToken();
    window.location.replace('index.html');
    throw new Error('Sesión expirada o no autorizada. Redirigiendo a login.');
  }

  // Intentar parsear JSON; si no es JSON se retorna texto.
  let datos = null;
  const tipoContenido = respuesta.headers.get('content-type') || '';

  if (tipoContenido.includes('application/json')) {
    datos = await respuesta.json();
  } else {
    const texto = await respuesta.text();
    datos = texto ? { mensaje: texto } : null;
  }

  if (!respuesta.ok) {
    const mensajeError = (datos && (datos.error || datos.mensaje)) || 'Error en la petición.';
    throw new Error(mensajeError);
  }

  return datos;
}