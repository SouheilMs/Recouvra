const express = require('express');
const router = express.Router();
const { createAction, getActions, getActionById, updateAction, deleteAction } = require('../controllers/collectionAction.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/actions:
 */
router.post('/', authenticate, createAction);

/**
 * @swagger
 * /api/actions:
 */
router.get('/', authenticate, getActions);

/**
 * @swagger
 * /api/actions/{id}:
 */
router.get('/:id', authenticate, getActionById);

/**
 * @swagger
 * /api/actions/{id}:
 */
router.put('/:id', authenticate, updateAction);

/**
 * @swagger
 * /api/actions/{id}:
 */
router.delete('/:id', authenticate, deleteAction);

module.exports = router;
