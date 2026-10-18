// Cualquier ruta no definida responde JSON (nunca HTML).
module.exports = (req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
};
