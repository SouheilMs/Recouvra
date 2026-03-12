const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUserById, deleteUser } = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

/**
 * @swagger
 * /api/users:
 */
router.post('/', authenticate, authorize('admin'), createUser);

/**
 * @swagger
 * /api/users:
 */
router.get('/', authenticate, authorize('admin'), getUsers);

/**
 * @swagger
 * /api/users/{id}:
 */
router.get('/:id', authenticate, authorize('admin'), getUserById);

/**
 * @swagger
 * /api/users/{id}:
 */
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

module.exports = router;
