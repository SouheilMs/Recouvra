const express = require('express');
const router = express.Router();
const { createPayment, getPayments, getPaymentById, getPaymentsByInvoice } = require('../controllers/payment.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/payments:
 */
router.post('/', authenticate, createPayment);

/**
 * @swagger
 * /api/payments:
 */
router.get('/', authenticate, getPayments);

/**
 * @swagger
 * /api/payments/invoice/{invoiceId}:
 */
router.get('/invoice/:invoiceId', authenticate, getPaymentsByInvoice);

/**
 * @swagger
 * /api/payments/{id}:
 */
router.get('/:id', authenticate, getPaymentById);

module.exports = router;
