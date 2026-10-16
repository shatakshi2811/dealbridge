const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MerchantOffer',
      required: true,
      index: true,
    },
    merchantName: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    // No updatedAt needed — clicks are immutable records
    timestamps: { createdAt: 'timestamp', updatedAt: false },
  }
);

// Compound index for analytics queries
clickSchema.index({ product: 1, timestamp: -1 });
clickSchema.index({ offer: 1, timestamp: -1 });
clickSchema.index({ merchantName: 1, timestamp: -1 });

module.exports = mongoose.model('Click', clickSchema);
