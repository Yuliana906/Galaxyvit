// Servicio de autenticación para manejo del token JWT en localStorage.

const CLAVE_TOKEN = 'jwt_space_shooter';

// Guarda el token JWT en el almacenamiento local del navegador.
export function guardarToken(token) {
  if (!token) {
    return;
  }
  localStorage.setItem(CLAVE_TOKEN, token);
}

// Recupera el token JWT almacenado.
export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN);
}

// Elimina el token JWT (cierra sesión localmente).
export function eliminarToken() {
  localStorage.removeItem(CLAVE_TOKEN);
}

// Indica si el usuario tiene sesión activa (existe token).
export function estaAutenticado() {
  const token = obtenerToken();
  return Boolean(token && token.trim() !== '');
}

// Redirige a la página de login si no existe token válido.
// Útil para proteger rutas HTML.
export function exigirAutenticacion(rutaLogin = 'index.html') {
  if (!estaAutenticado()) {
    window.location.replace(rutaLogin);
    return false;
  }
  return true;
}

// Limpia la sesión y redirige al login (usado ante 401).
export function cerrarSesion(rutaLogin = 'index.html') {
  eliminarToken();
  window.location.replace(rutaLogin);
}
