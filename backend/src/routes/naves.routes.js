const { Router } = require('express');
const { listar } = require('../controllers/naves.controller');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.get('/', asyncHandler(listar));

module.exports = router;
