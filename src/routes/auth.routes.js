const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/auth/login:
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/me:
 */
router.get('/me', authenticate, getMe);

module.exports = router;
