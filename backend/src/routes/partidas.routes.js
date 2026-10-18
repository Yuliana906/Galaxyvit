const { Router } = require('express');
const { crear, mias } = require('../controllers/partidas.controller');
const auth = require('../middleware/auth');
const { validarPartida } = require('../middleware/validarPartida');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

// Rutas privadas: el middleware `auth` valida el JWT antes de continuar.
router.get('/mias', auth, asyncHandler(mias));
router.post('/', auth, validarPartida, asyncHandler(crear));

module.exports = router;
