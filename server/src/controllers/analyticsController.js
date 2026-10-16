const Product = require('../models/Product');
const MerchantOffer = require('../models/MerchantOffer');
const Click = require('../models/Click');

// GET /api/analytics  [Admin only]
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProducts,
      totalOffers,
      totalClicks,
      mostClickedProducts,
      mostClickedMerchants,
    ] = await Promise.all([
      // Total active products
      Product.countDocuments({ isActive: true }),

      // Total merchant offers
      MerchantOffer.countDocuments(),

      // Total outbound clicks
      Click.countDocuments(),

      // Top 5 most-clicked products
      Click.aggregate([
        { $group: { _id: '$product', clickCount: { $sum: 1 } } },
        { $sort: { clickCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        { $unwind: '$product' },
        {
          $project: {
            _id: 0,
            productId: '$_id',
            name: '$product.name',
            brand: '$product.brand',
            category: '$product.category',
            clickCount: 1,
          },
        },
      ]),

      // Top 5 most-clicked merchants
      Click.aggregate([
        { $group: { _id: '$merchantName', clickCount: { $sum: 1 } } },
        { $sort: { clickCount: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            merchantName: '$_id',
            clickCount: 1,
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOffers,
        totalClicks,
        mostClickedProducts,
        mostClickedMerchants,
      },
    });
  } catch (err) {
    next(err);
  }
};
