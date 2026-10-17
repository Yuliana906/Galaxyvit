// ============================================================
// Pruebas básicas del backend de autenticación.
// No requieren Supabase real ni dependencias extra: usan el
// runner integrado de Node (`npm test`) y `fetch` nativo.
//
// Se fijan variables de entorno de prueba ANTES de requerir la app,
// porque `src/config/env.js` valida las variables al cargarse.
// ============================================================
process.env.SUPABASE_URL = 'http://127.0.0.1:9'; // puerto sin servicio -> falla rápido (error de conexión)
process.env.SUPABASE_SERVICE_KEY = 'service_key_de_prueba';
process.env.JWT_SECRET = 'secreto_de_prueba_muy_largo_y_seguro';
process.env.JWT_EXPIRES_IN = '1h';
process.env.FRONTEND_URL = 'http://localhost:5173';

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = require('../src/app');
const auth = require('../src/middleware/auth');

// Levanta un servidor en un puerto libre y resuelve cuando está escuchando.
const escuchar = (servidor) =>
  new Promise((resolve) => servidor.once('listening', resolve));

let servidor;
let baseUrl;

before(async () => {
  servidor = app.listen(0);
  await escuchar(servidor);
  baseUrl = `http://localhost:${servidor.address().port}`;
});

after(() => servidor.close());

const postJson = (ruta, cuerpo) =>
  fetch(`${baseUrl}${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo),
  });

// --- Registro -------------------------------------------------

test('register: cuerpo inválido responde 400 {"error":"Datos inválidos"}', async () => {
  const res = await postJson('/api/auth/register', { email: 'sin-nombre@test.com' });
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: 'Datos inválidos' });
});

test('register: email con formato inválido responde 400', async () => {
  const res = await postJson('/api/auth/register', {
    nombre: 'Ana',
    email: 'no-es-email',
    password: 'Test1234',
  });
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: 'Datos inválidos' });
});

test('register: error de conexión con Supabase responde 500', async () => {
  const res = await postJson('/api/auth/register', {
    nombre: 'Ana',
    email: 'ana@test.com',
    password: 'Test1234',
  });
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { error: 'Error interno del servidor' });
});

// --- Login ----------------------------------------------------

test('login: cuerpo inválido responde 400 {"error":"Datos inválidos"}', async () => {
  const res = await postJson('/api/auth/login', { email: 'ana@test.com' });
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: 'Datos inválidos' });
});

test('login: JSON mal formado responde 400', async () => {
  const res = await postJson('/api/auth/login', '{ email: sin comillas }');
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: 'Datos inválidos' });
});

// --- Errores generales ---------------------------------------

test('ruta inexistente responde 404 JSON', async () => {
  const res = await fetch(`${baseUrl}/api/no-existe`);
  assert.equal(res.status, 404);
  assert.deepEqual(await res.json(), { error: 'Recurso no encontrado' });
});

// --- Middleware de autenticación ------------------------------

test('auth: sin token responde 401', async () => {
  const protegida = express();
  protegida.get('/privada', auth, (req, res) => res.json({ usuario: req.usuario }));
  const s = protegida.listen(0);
  await escuchar(s);
  const url = `http://localhost:${s.address().port}/privada`;

  try {
    const res = await fetch(url);
    assert.equal(res.status, 401);
    assert.deepEqual(await res.json(), { error: 'Token ausente o inválido' });
  } finally {
    s.close();
  }
});

test('auth: token inválido responde 401', async () => {
  const protegida = express();
  protegida.get('/privada', auth, (req, res) => res.json({ usuario: req.usuario }));
  const s = protegida.listen(0);
  await escuchar(s);
  const url = `http://localhost:${s.address().port}/privada`;

  try {
    const res = await fetch(url, { headers: { Authorization: 'Bearer xxx.yyy.zzz' } });
    assert.equal(res.status, 401);
    assert.deepEqual(await res.json(), { error: 'Token ausente o inválido' });
  } finally {
    s.close();
  }
});

test('auth: esquema distinto a Bearer responde 401', async () => {
  const protegida = express();
  protegida.get('/privada', auth, (req, res) => res.json({ usuario: req.usuario }));
  const s = protegida.listen(0);
  await escuchar(s);
  const url = `http://localhost:${s.address().port}/privada`;

  try {
    const res = await fetch(url, { headers: { Authorization: 'Token abc' } });
    assert.equal(res.status, 401);
  } finally {
    s.close();
  }
});

test('auth: token válido deja pasar y expone req.usuario', async () => {
  const protegida = express();
  protegida.get('/privada', auth, (req, res) => res.json({ usuario: req.usuario }));
  const s = protegida.listen(0);
  await escuchar(s);
  const url = `http://localhost:${s.address().port}/privada`;

  try {
    const token = jwt.sign(
      { id: 'uuid-de-prueba', email: 'ana@test.com' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    assert.equal(res.status, 200);

    const { usuario } = await res.json();
    assert.equal(usuario.id, 'uuid-de-prueba');
    assert.equal(usuario.email, 'ana@test.com');
  } finally {
    s.close();
  }
});
