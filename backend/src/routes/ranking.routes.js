const { Router } = require('express');
const { top10 } = require('../controllers/ranking.controller');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.get('/', asyncHandler(top10));

module.exports = router;
