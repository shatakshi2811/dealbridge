const mongoose = require('mongoose');
const Product = require('./Product');

// Allowed external merchant domains for redirect validation
const ALLOWED_DOMAINS = [
  'amazon.in',
  'amazon.com',
  'flipkart.com',
  'croma.com',
  'vijaysales.com',
  'reliancedigital.in',
  'tatacliq.com',
  'myntra.com',
  'nykaa.com',
  'snapdeal.com',
  'meesho.com',
  'ajio.com',
];

const merchantOfferSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
      index: true,
    },
    merchantName: {
      type: String,
      required: [true, 'Merchant name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    destinationUrl: {
      type: String,
      required: [true, 'Destination URL is required'],
      validate: {
        validator: function (url) {
          try {
            const parsed = new URL(url);
            // Must be https
            if (parsed.protocol !== 'https:') return false;
            // Must be from an allowed merchant domain
            const hostname = parsed.hostname.replace(/^www\./, '');
            return ALLOWED_DOMAINS.some(
              (domain) => hostname === domain || hostname.endsWith('.' + domain)
            );
          } catch {
            return false;
          }
        },
        message: 'Destination URL must be a valid HTTPS URL from an approved merchant',
      },
    },
    availability: {
      type: String,
      enum: {
        values: ['In Stock', 'Out of Stock', 'Limited'],
        message: '{VALUE} is not a valid availability status',
      },
      default: 'In Stock',
    },
    clickCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// After saving an offer, update the product's lowestPrice cache
async function updateProductLowestPrice(productId) {
  const result = await mongoose.model('MerchantOffer').aggregate([
    { $match: { product: productId, availability: { $ne: 'Out of Stock' } } },
    { $group: { _id: '$product', minPrice: { $min: '$price' } } },
  ]);

  const lowestPrice = result.length > 0 ? result[0].minPrice : 0;
  await Product.findByIdAndUpdate(productId, { lowestPrice });
}

merchantOfferSchema.post('save', async function () {
  await updateProductLowestPrice(this.product);
});

merchantOfferSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) await updateProductLowestPrice(doc.product);
});

merchantOfferSchema.post('findOneAndDelete', async function (doc) {
  if (doc) await updateProductLowestPrice(doc.product);
});

merchantOfferSchema.index({ product: 1, merchantName: 1 });
merchantOfferSchema.index({ price: 1 });

module.exports = mongoose.model('MerchantOffer', merchantOfferSchema);
module.exports.ALLOWED_DOMAINS = ALLOWED_DOMAINS;
