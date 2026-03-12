const express = require('express');
const router = express.Router();
const { createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice } = require('../controllers/invoice.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/invoices:
 */
router.post('/', authenticate, createInvoice);

/**
 * @swagger
 * /api/invoices:
 */
router.get('/', authenticate, getInvoices);

/**
 * @swagger
 * /api/invoices/{id}:
 */
router.get('/:id', authenticate, getInvoiceById);

/**
 * @swagger
 * /api/invoices/{id}:
 */
router.put('/:id', authenticate, updateInvoice);

/**
 * @swagger
 * /api/invoices/{id}:
 */
router.delete('/:id', authenticate, deleteInvoice);

module.exports = router;
