const { Router } = require('express');
const authRoutes = require('./auth.routes');

const router = Router();

router.use('/auth', authRoutes);
// Las rutas privadas (/api/partidas) montarán el middleware `auth` en su fase.

module.exports = router;
