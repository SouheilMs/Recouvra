const mongoose = require('mongoose');

const collectionActionSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client reference is required'],
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
    },
    actionType: {
      type: String,
      enum: ['call', 'email', 'visit', 'reminder'],
      required: [true, 'Action type is required'],
    },
    comment: {
      type: String,
      trim: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Performing agent is required'],
    },
    actionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CollectionAction', collectionActionSchema);
