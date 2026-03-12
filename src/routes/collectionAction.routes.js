const express = require('express');
const router = express.Router();
const { createAction, getActions, getActionById, updateAction, deleteAction } = require('../controllers/collectionAction.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: CollectionActions
 *   description: Debt collection actions tracking
 */

/**
 * @swagger
 * /api/actions:
 *   post:
 *     summary: Record a new collection action
 *     tags: [CollectionActions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client
 *               - actionType
 *             properties:
 *               client:
 *                 type: string
 *               invoice:
 *                 type: string
 *               actionType:
 *                 type: string
 *                 enum: [call, email, visit, reminder]
 *               comment:
 *                 type: string
 *               actionDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Action recorded
 *       400:
 *         description: Validation error
 */
router.post('/', authenticate, createAction);

/**
 * @swagger
 * /api/actions:
 *   get:
 *     summary: Get all collection actions
 *     tags: [CollectionActions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of collection actions
 */
router.get('/', authenticate, getActions);

/**
 * @swagger
 * /api/actions/{id}:
 *   get:
 *     summary: Get a collection action by ID
 *     tags: [CollectionActions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Action found
 *       404:
 *         description: Action not found
 */
router.get('/:id', authenticate, getActionById);

/**
 * @swagger
 * /api/actions/{id}:
 *   put:
 *     summary: Update a collection action
 *     tags: [CollectionActions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actionType:
 *                 type: string
 *                 enum: [call, email, visit, reminder]
 *               comment:
 *                 type: string
 *               actionDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Action updated
 *       404:
 *         description: Action not found
 */
router.put('/:id', authenticate, updateAction);

/**
 * @swagger
 * /api/actions/{id}:
 *   delete:
 *     summary: Delete a collection action
 *     tags: [CollectionActions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Action deleted
 *       404:
 *         description: Action not found
 */
router.delete('/:id', authenticate, deleteAction);

module.exports = router;