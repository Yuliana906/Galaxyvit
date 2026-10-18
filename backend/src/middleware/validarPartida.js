// Valores válidos de `tipo_evento` según el contrato.
const TIPOS_EVENTO = ['enemigo_destruido', 'impacto_meteorito', 'impacto_bala', 'muerte'];

const esEntero = (valor) => Number.isInteger(valor);
const esEnteroNoNegativo = (valor) => esEntero(valor) && valor >= 0;
const esEnteroPositivo = (valor) => esEntero(valor) && valor > 0;

// Valida un evento individual: tipo permitido, enemigo_id entero o null y
// momento_seg numérico no negativo.
function esEventoValido(evento) {
  if (!evento || typeof evento !== 'object') return false;

  const { tipo_evento, enemigo_id, momento_seg } = evento;

  if (!TIPOS_EVENTO.includes(tipo_evento)) return false;
  if (enemigo_id !== null && !esEnteroPositivo(enemigo_id)) return false;
  if (!Number.isFinite(momento_seg) || momento_seg < 0) return false;

  return true;
}

// Valida y normaliza el cuerpo de POST /api/partidas.
function validarPartida(req, res, next) {
  const { nave_id, puntaje, duracion_seg, disparos, aciertos, eventos } = req.body || {};

  const valido =
    esEnteroPositivo(nave_id) &&
    esEnteroNoNegativo(puntaje) &&
    esEnteroNoNegativo(duracion_seg) &&
    esEnteroNoNegativo(disparos) &&
    esEnteroNoNegativo(aciertos) &&
    aciertos <= disparos && // restricción `partidas_aciertos_le_disparos`
    Array.isArray(eventos) &&
    eventos.every(esEventoValido);

  if (!valido) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  req.datos = { nave_id, puntaje, duracion_seg, disparos, aciertos, eventos };
  next();
}

module.exports = { validarPartida, TIPOS_EVENTO };
