const jwt = require('jsonwebtoken');
const env = require('../config/env');

// Protege rutas privadas: exige "Authorization: Bearer <token>".
function auth(req, res, next) {
  const cabecera = req.headers.authorization || '';
  const [tipo, token] = cabecera.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token ausente o inválido' });
  }

  try {
    req.usuario = jwt.verify(token, env.jwtSecret); // disponible en el controlador
    next();
  } catch {
    return res.status(401).json({ error: 'Token ausente o inválido' });
  }
}

module.exports = auth;
