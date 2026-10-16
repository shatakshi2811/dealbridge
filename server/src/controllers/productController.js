const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const MerchantOffer = require('../models/MerchantOffer');

// GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    // Full-text search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Brand filter (case-insensitive)
    if (brand) {
      query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
    }

    // Price range filter (based on cached lowestPrice)
    if (minPrice || maxPrice) {
      query.lowestPrice = {};
      if (minPrice) query.lowestPrice.$gte = Number(minPrice);
      if (maxPrice) query.lowestPrice.$lte = Number(maxPrice);
    }

    // Sorting
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      'price-asc': { lowestPrice: 1 },
      'price-desc': { lowestPrice: -1 },
      popular: { clickCount: -1 }, // virtual via aggregation; fallback to newest
    };
    const sortQuery = sortOptions[sort] || sortOptions.newest;

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNum)
        .select('-specifications'), // Keep listing lean; specs on detail page
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true }).populate({
      path: 'offers',
      select: '-__v',
      options: { sort: { price: 1 } },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// POST /api/products  [Admin only]
exports.createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id  [Admin only]
exports.updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Prevent direct manipulation of lowestPrice (computed field)
    delete req.body.lowestPrice;

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id  [Admin only] — soft delete via isActive flag
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, message: 'Product deactivated successfully.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/categories  — return distinct active categories with counts
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/brands  — return distinct brands, optionally filtered by category
exports.getBrands = async (req, res, next) => {
  try {
    const match = { isActive: true };
    if (req.query.category) match.category = req.query.category;

    const brands = await Product.distinct('brand', match);
    res.json({ success: true, data: brands.sort() });
  } catch (err) {
    next(err);
  }
};
