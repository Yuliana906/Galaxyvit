require('dotenv').config();

// Variables obligatorias: si falta alguna, el servidor no debe arrancar.
const requeridas = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'JWT_SECRET'];
const faltantes = requeridas.filter((clave) => !process.env[clave]);

if (faltantes.length > 0) {
  console.error(`Faltan variables de entorno: ${faltantes.join(', ')}`);
  process.exit(1);
}

module.exports = {
  puerto: Number(process.env.PORT) || 3000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
};
