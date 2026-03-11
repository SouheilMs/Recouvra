const Invoice = require('../models/Invoice');
const { createInvoiceSchema, updateInvoiceSchema } = require('../validations/invoice.validation');

/**
 * Create a new invoice
 */
const createInvoice = async (req, res) => {
  try {
    const { error, value } = createInvoiceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const invoice = await Invoice.create(value);
    const populated = await invoice.populate('client', 'name email');
    res.status(201).json({ success: true, message: 'Invoice created successfully.', data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

/**
 * Get all invoices
 */
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('client', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

/**
 * Get an invoice by ID
 */
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('client', 'name email');
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }
    res.status(200).json({ success: true, data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

/**
 * Update an invoice
 */
const updateInvoice = async (req, res) => {
  try {
    const { error, value } = updateInvoiceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const invoice = await Invoice.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true })
      .populate('client', 'name email');
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }
    res.status(200).json({ success: true, message: 'Invoice updated successfully.', data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

/**
 * Delete an invoice
 */
const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }
    res.status(200).json({ success: true, message: 'Invoice deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

module.exports = { createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice };
