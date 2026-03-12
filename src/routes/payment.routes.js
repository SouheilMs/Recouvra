const express = require('express');
const router = express.Router();
const { createPayment, getPayments, getPaymentById, getPaymentsByInvoice } = require('../controllers/payment.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Manual payment management
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Record a manual payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoice
 *               - amount
 *             properties:
 *               invoice:
 *                 type: string
 *               amount:
 *                 type: number
 *               paymentDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Payment recorded
 *       400:
 *         description: Validation error
 *       404:
 *         description: Invoice not found
 */
router.post('/', authenticate, createPayment);

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments
 */
router.get('/', authenticate, getPayments);

/**
 * @swagger
 * /api/payments/invoice/{invoiceId}:
 *   get:
 *     summary: Get all payments for a specific invoice
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payments for invoice
 */
router.get('/invoice/:invoiceId', authenticate, getPaymentsByInvoice);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get a payment by ID
 *     tags: [Payments]
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
 *         description: Payment found
 *       404:
 *         description: Payment not found
 */
router.get('/:id', authenticate, getPaymentById);

module.exports = router;