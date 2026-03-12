const express = require('express');
const router = express.Router();
const { createClient, getClients, getClientById, updateClient, deleteClient } = require('../controllers/client.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/clients:
 */
router.post('/', authenticate, createClient);

/**
 * @swagger
 * /api/clients:
 */
router.get('/', authenticate, getClients);

/**
 * @swagger
 * /api/clients/{id}:
 */
router.get('/:id', authenticate, getClientById);

/**
 * @swagger
 * /api/clients/{id}:
 */
router.put('/:id', authenticate, updateClient);

/**
 * @swagger
 * /api/clients/{id}:
 */
router.delete('/:id', authenticate, deleteClient);

module.exports = router;
