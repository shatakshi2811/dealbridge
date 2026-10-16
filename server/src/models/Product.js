const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Watches', 'Smartphones', 'Laptops', 'Headphones', 'Fashion', 'Home Appliances'],
        message: '{VALUE} is not a valid category',
      },
    },
    images: {
      type: [String],
      default: [],
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Cached lowest price from merchant offers — updated on offer create/update
    lowestPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: populate merchant offers
productSchema.virtual('offers', {
  ref: 'MerchantOffer',
  localField: '_id',
  foreignField: 'product',
});

// Indexes for search and filtering
productSchema.index({ name: 'text', brand: 'text', model: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ lowestPrice: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
