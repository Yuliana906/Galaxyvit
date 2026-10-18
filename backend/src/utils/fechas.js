// Convierte un timestamptz de Supabase a ISO 8601 con sufijo Z (formato del contrato).
const aIso = (fecha) => (fecha ? new Date(fecha).toISOString() : null);

module.exports = { aIso };
