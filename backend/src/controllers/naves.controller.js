const supabase = require('../config/supabase');

// GET /api/naves -> 200 [{id, nombre, velocidad, vida, cadencia_disparo}]
async function listar(req, res) {
  const { data, error } = await supabase
    .from('naves')
    .select('id, nombre, velocidad, vida, cadencia_disparo')
    .order('id', { ascending: true });

  if (error) throw error;

  return res.status(200).json(data);
}

module.exports = { listar };
