const Client = require('../models/Client');
const Invoice = require('../models/Invoice');

/**
 * Get aggregated statistics for the dashboard
 */
const getStatistics = async (req, res) => {
  try {
    const [
      totalClients,
      totalInvoices,
      unpaidInvoicesCount,
      inCollectionCount,
      unpaidAmountResult,
    ] = await Promise.all([
      Client.countDocuments(),
      Invoice.countDocuments(),
      Invoice.countDocuments({ status: 'unpaid' }),
      Invoice.countDocuments({ status: 'in_collection' }),
      Invoice.aggregate([
        { $match: { status: { $in: ['unpaid', 'in_collection'] } } },
        { $group: { _id: null, totalUnpaidAmount: { $sum: '$amount' } } },
      ]),
    ]);

    const totalUnpaidAmount = unpaidAmountResult.length > 0 ? unpaidAmountResult[0].totalUnpaidAmount : 0;

    res.status(200).json({
      success: true,
      data: {
        totalClients,
        totalInvoices,
        unpaidInvoicesCount,
        invoicesInCollection: inCollectionCount,
        totalUnpaidAmount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

module.exports = { getStatistics };
