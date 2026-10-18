// Manejo centralizado: registra el error real y responde JSON genérico.
// Errores de parseo de JSON (body mal formado) se responden como 400.
module.exports = (err, req, res, next) => {
  if (err && (err.type === 'entity.parse.failed' || err instanceof SyntaxError)) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
};
