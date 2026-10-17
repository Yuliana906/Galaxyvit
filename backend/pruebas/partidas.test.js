// ============================================================
// Pruebas de los endpoints de naves, ranking y partidas.
// No requieren Supabase real: se fuerza un error de conexión y se
// comprueba la validación y la protección con JWT.
// ============================================================
process.env.SUPABASE_URL = 'http://127.0.0.1:9'; // puerto sin servicio -> falla rápido
process.env.SUPABASE_SERVICE_KEY = 'service_key_de_prueba';
process.env.JWT_SECRET = 'secreto_de_prueba_muy_largo_y_seguro';
process.env.JWT_EXPIRES_IN = '1h';
process.env.FRONTEND_URL = 'http://localhost:5173';

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const jwt = require('jsonwebtoken');

const app = require('../src/app');

let servidor;
let baseUrl;
let token;

before(async () => {
  servidor = app.listen(0);
  await new Promise((resolve) => servidor.once('listening', resolve));
  baseUrl = `http://localhost:${servidor.address().port}`;
  // Token válido que usarán las pruebas de rutas privadas.
  token = jwt.sign({ id: 'uuid-de-prueba', email: 'ana@test.com' }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
});

after(() => servidor.close());

const autorizado = (extra = {}) => ({ Authorization: `Bearer ${token}`, ...extra });

const postPartida = (body, headers = {}) =>
  fetch(`${baseUrl}/api/partidas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });

// Cuerpo de partida válido según el contrato, reutilizable en varias pruebas.
const partidaValida = {
  nave_id: 1,
  puntaje: 3500,
  duracion_seg: 120,
  disparos: 85,
  aciertos: 42,
  eventos: [
    { tipo_evento: 'enemigo_destruido', enemigo_id: 1, momento_seg: 15 },
    { tipo_evento: 'impacto_meteorito', enemigo_id: null, momento_seg: 30 },
    { tipo_evento: 'muerte', enemigo_id: null, momento_seg: 120 },
  ],
};

// --- Endpoints públicos --------------------------------------

test('GET /api/naves: sin conexión a Supabase responde 500', async () => {
  const res = await fetch(`${baseUrl}/api/naves`);
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { error: 'Error interno del servidor' });
});

test('GET /api/ranking: sin conexión a Supabase responde 500', async () => {
  const res = await fetch(`${baseUrl}/api/ranking`);
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { error: 'Error interno del servidor' });
});

// --- Protección de rutas privadas ----------------------------

test('POST /api/partidas: sin token responde 401', async () => {
  const res = await postPartida(partidaValida);
  assert.equal(res.status, 401);
  assert.deepEqual(await res.json(), { error: 'Token ausente o inválido' });
});

test('POST /api/partidas: token inválido responde 401', async () => {
  const res = await postPartida(partidaValida, { Authorization: 'Bearer xxx.yyy.zzz' });
  assert.equal(res.status, 401);
  assert.deepEqual(await res.json(), { error: 'Token ausente o inválido' });
});

test('GET /api/partidas/mias: sin token responde 401', async () => {
  const res = await fetch(`${baseUrl}/api/partidas/mias`);
  assert.equal(res.status, 401);
  assert.deepEqual(await res.json(), { error: 'Token ausente o inválido' });
});

test('GET /api/partidas/mias: token válido llega al controlador (500 por conexión)', async () => {
  const res = await fetch(`${baseUrl}/api/partidas/mias`, { headers: autorizado() });
  assert.equal(res.status, 500);
});

// --- Validación de POST /api/partidas ------------------------

test('POST /api/partidas: falta `eventos` responde 400', async () => {
  const { eventos, ...sinEventos } = partidaValida;
  const res = await postPartida(sinEventos, autorizado());
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: 'Datos inválidos' });
});

test('POST /api/partidas: tipo_evento inválido responde 400', async () => {
  const body = { ...partidaValida, eventos: [{ tipo_evento: 'explosion', enemigo_id: null, momento_seg: 5 }] };
  const res = await postPartida(body, autorizado());
  assert.equal(res.status, 400);
});

test('POST /api/partidas: aciertos > disparos responde 400', async () => {
  const body = { ...partidaValida, disparos: 10, aciertos: 11 };
  const res = await postPartida(body, autorizado());
  assert.equal(res.status, 400);
});

test('POST /api/partidas: nave_id no entero responde 400', async () => {
  const body = { ...partidaValida, nave_id: 'uno' };
  const res = await postPartida(body, autorizado());
  assert.equal(res.status, 400);
});

test('POST /api/partidas: cuerpo válido pasa la validación (500 por conexión)', async () => {
  const res = await postPartida(partidaValida, autorizado());
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { error: 'Error interno del servidor' });
});
