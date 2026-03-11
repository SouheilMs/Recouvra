const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const { createPaymentSchema } = require('../validations/payment.validation');

/**
 * Record a manual payment for an invoice
 */
const createPayment = async (req, res) => {
  try {
    const { error, value } = createPaymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    // Ensure the invoice exists
    const invoice = await Invoice.findById(value.invoice);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    // Record the payment, attaching the authenticated user
    const payment = await Payment.create({ ...value, recordedBy: req.user._id });

    // Calculate total payments for this invoice
    const payments = await Payment.find({ invoice: value.invoice });
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    // Auto-mark invoice as paid if fully covered
    if (totalPaid >= invoice.amount) {
      await Invoice.findByIdAndUpdate(value.invoice, { status: 'paid' });
    }

    const populated = await payment.populate([
      { path: 'invoice', select: 'amount status dueDate' },
      { path: 'recordedBy', select: 'name email' },
    ]);

    res.status(201).json({ success: true, message: 'Payment recorded successfully.', data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

/**
 * Get all payments
 */
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('invoice', 'amount status dueDate')
      .populate('recordedBy', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

/**
 * Get a payment by ID
 */
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('invoice', 'amount status dueDate')
      .populate('recordedBy', 'name email');
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found.' });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

/**
 * Get all payments for a specific invoice
 */
const getPaymentsByInvoice = async (req, res) => {
  try {
    const payments = await Payment.find({ invoice: req.params.invoiceId })
      .populate('recordedBy', 'name email')
      .sort({ paymentDate: -1 });
    res.status(200).json({ success: true, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

module.exports = { createPayment, getPayments, getPaymentById, getPaymentsByInvoice };
