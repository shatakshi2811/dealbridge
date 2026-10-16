const { validationResult } = require('express-validator');
const MerchantOffer = require('../models/MerchantOffer');
const Product = require('../models/Product');

// GET /api/products/:productId/offers
exports.getOffersByProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.productId, isActive: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const offers = await MerchantOffer.find({ product: req.params.productId }).sort({ price: 1 });
    res.json({ success: true, data: offers });
  } catch (err) {
    next(err);
  }
};

// POST /api/products/:productId/offers  [Admin only]
exports.createOffer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const offer = await MerchantOffer.create({
      ...req.body,
      product: req.params.productId,
    });

    res.status(201).json({ success: true, data: offer });
  } catch (err) {
    next(err);
  }
};

// PUT /api/offers/:id  [Admin only]
exports.updateOffer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const offer = await MerchantOffer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found.' });
    }

    res.json({ success: true, data: offer });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/offers/:id  [Admin only]
exports.deleteOffer = async (req, res, next) => {
  try {
    const offer = await MerchantOffer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found.' });
    }

    res.json({ success: true, message: 'Offer deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
