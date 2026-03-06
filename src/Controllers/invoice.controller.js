const Invoice = require('../models/Invoice');

// Create Invoice
const createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);

    const populatedInvoice = await invoice.populate('client', 'name email');

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully.',
      data: populatedInvoice,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: err.message,
    });
  }
};

// Get All Invoices
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('client', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: err.message,
    });
  }
};

// Get Invoice By ID
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('client', 'name email');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: err.message,
    });
  }
};

// Update Invoice
const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('client', 'name email');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Invoice updated successfully.',
      data: invoice,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: err.message,
    });
  }
};

// Delete Invoice
const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully.',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: err.message,
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};