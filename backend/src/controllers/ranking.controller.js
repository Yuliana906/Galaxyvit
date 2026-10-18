const supabase = require('../config/supabase');
const { aIso } = require('../utils/fechas');

// GET /api/ranking -> 200 top 10 [{posicion, nombre, puntaje, nave, fecha}]
async function top10(req, res) {
  // La vista ya calcula `posicion` y el orden; se repite el orden para que
  // PostgREST devuelva las filas en el mismo orden del ranking.
  const { data, error } = await supabase
    .from('v_ranking_top10')
    .select('posicion, nombre, puntaje, nave, fecha')
    .order('posicion', { ascending: true });

  if (error) throw error;

  // Normaliza la fecha al formato ISO 8601 con sufijo Z exigido por el contrato.
  const ranking = data.map((fila) => ({ ...fila, fecha: aIso(fila.fecha) }));

  return res.status(200).json(ranking);
}

module.exports = { top10 };
