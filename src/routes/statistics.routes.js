const express = require('express');
const router = express.Router();
const { getStatistics } = require('../controllers/statistics.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Statistics
 *   description: Aggregated statistics
 */

/**
 * @swagger
 * /api/statistics:
 *   get:
 *     summary: Get aggregated debt collection statistics
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalClients:
 *                       type: number
 *                     totalInvoices:
 *                       type: number
 *                     unpaidInvoicesCount:
 *                       type: number
 *                     invoicesInCollection:
 *                       type: number
 *                     totalUnpaidAmount:
 *                       type: number
 */
router.get('/', authenticate, getStatistics);

module.exports = router;