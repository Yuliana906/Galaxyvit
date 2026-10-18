const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const env = require('../config/env');

// POST /api/auth/register -> 201 {usuario:{id,nombre,email}}
async function registrar(req, res) {
  const { nombre, email, password } = req.datos;
  const password_hash = await bcrypt.hash(password, 10); // nunca texto plano

  const { data, error } = await supabase
    .from('usuarios')
    .insert({ nombre, email, password_hash })
    .select('id, nombre, email')
    .single();

  if (error) {
    // 23505 = violación del índice único usuarios_email_uk
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email ya registrado' });
    }
    throw error;
  }

  return res.status(201).json({ usuario: data });
}

// POST /api/auth/login -> 200 {token, usuario:{id,nombre,email}}
async function login(req, res) {
  const { email, password } = req.datos;

  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('id, nombre, email, password_hash')
    .eq('email', email)
    .maybeSingle();

  if (error) throw error;
  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const valido = await bcrypt.compare(password, usuario.password_hash);
  if (!valido) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email }, // payload mínimo
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return res.status(200).json({
    token,
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
  });
}

module.exports = { registrar, login };
