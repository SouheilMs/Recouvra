const express = require('express');
const router = express.Router();
const { getStatistics } = require('../controllers/statistics.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/statistics:
 */
router.get('/', authenticate, getStatistics);

module.exports = router;
