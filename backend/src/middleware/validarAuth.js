const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const esTexto = (valor) => typeof valor === 'string' && valor.trim().length > 0;

// Valida y normaliza el cuerpo de POST /api/auth/register.
function validarRegistro(req, res, next) {
  const { nombre, email, password } = req.body || {};

  if (!esTexto(nombre) || !esTexto(email) || !EMAIL_RE.test(email.trim()) || !esTexto(password)) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  req.datos = { nombre: nombre.trim(), email: email.trim().toLowerCase(), password };
  next();
}

// Valida y normaliza el cuerpo de POST /api/auth/login.
function validarLogin(req, res, next) {
  const { email, password } = req.body || {};

  if (!esTexto(email) || !esTexto(password)) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  req.datos = { email: email.trim().toLowerCase(), password };
  next();
}

module.exports = { validarRegistro, validarLogin };
