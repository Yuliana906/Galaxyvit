const { Router } = require('express');
const authRoutes = require('./auth.routes');
const navesRoutes = require('./naves.routes');
const rankingRoutes = require('./ranking.routes');
const partidasRoutes = require('./partidas.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/naves', navesRoutes);
router.use('/ranking', rankingRoutes);
router.use('/partidas', partidasRoutes); // privadas: aplican middleware `auth`

module.exports = router;
