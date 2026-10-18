const { Router } = require('express');
const { registrar, login } = require('../controllers/auth.controller');
const { validarRegistro, validarLogin } = require('../middleware/validarAuth');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.post('/register', validarRegistro, asyncHandler(registrar));
router.post('/login', validarLogin, asyncHandler(login));

module.exports = router;
