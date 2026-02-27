const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client reference is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Invoice amount is required'],
      min: [0, 'Amount must be positive'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    status: {
      type: String,
      enum: ['paid', 'unpaid', 'in_collection'],
      default: 'unpaid',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
