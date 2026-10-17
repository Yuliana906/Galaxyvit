const supabase = require('../config/supabase');
const { aIso } = require('../utils/fechas');

// POST /api/partidas -> 201 {id}
// Requiere autenticación: el usuario sale del token (`req.usuario.id`).
async function crear(req, res) {
  const { nave_id, puntaje, duracion_seg, disparos, aciertos, eventos } = req.datos;

  // Verifica que la nave exista; así un id inexistente es 400 y no un 500 por FK.
  const { data: nave, error: errorNave } = await supabase
    .from('naves')
    .select('id')
    .eq('id', nave_id)
    .maybeSingle();

  if (errorNave) throw errorNave;
  if (!nave) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  // Guarda la partida y sus eventos en una sola transacción (función SQL).
  const { data: id, error } = await supabase.rpc('registrar_partida', {
    p_usuario_id: req.usuario.id,
    p_nave_id: nave_id,
    p_puntaje: puntaje,
    p_duracion_seg: duracion_seg,
    p_disparos: disparos,
    p_aciertos: aciertos,
    p_eventos: eventos,
  });

  if (error) {
    // 23503 = FK inexistente (enemigo_id), 23514 = CHECK incumplido en la BD.
    if (error.code === '23503' || error.code === '23514') {
      return res.status(400).json({ error: 'Datos inválidos' });
    }
    throw error;
  }

  // La función devuelve un bigint; se fuerza a número entero en la respuesta.
  return res.status(201).json({ id: Number(id) });
}

// GET /api/partidas/mias -> 200 historial del usuario autenticado
async function mias(req, res) {
  const { data, error } = await supabase
    .from('partidas')
    .select('id, puntaje, duracion_seg, disparos, aciertos, fecha, naves(nombre)')
    .eq('usuario_id', req.usuario.id)
    .order('fecha', { ascending: false });

  if (error) throw error;

  // Aplana la relación con `naves` a un campo `nave` (nombre) según el contrato.
  const historial = data.map((partida) => ({
    id: Number(partida.id),
    nave: partida.naves ? partida.naves.nombre : null,
    puntaje: partida.puntaje,
    duracion_seg: partida.duracion_seg,
    disparos: partida.disparos,
    aciertos: partida.aciertos,
    fecha: aIso(partida.fecha),
  }));

  return res.status(200).json(historial);
}

module.exports = { crear, mias };
