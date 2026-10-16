const User = require('../models/User');
const Product = require('../models/Product');

// GET /api/wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      match: { isActive: true },
      select: 'name brand category images lowestPrice',
    });

    res.json({ success: true, data: user.wishlist });
  } catch (err) {
    next(err);
  }
};

// POST /api/wishlist/:productId
exports.addToWishlist = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.productId, isActive: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const user = await User.findById(req.user._id);

    // Prevent duplicates
    if (user.wishlist.includes(req.params.productId)) {
      return res.status(409).json({ success: false, message: 'Product already in wishlist.' });
    }

    user.wishlist.push(req.params.productId);
    await user.save();

    res.status(201).json({ success: true, message: 'Added to wishlist.' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/wishlist/:productId
exports.removeFromWishlist = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { wishlist: req.params.productId },
    });

    res.json({ success: true, message: 'Removed from wishlist.' });
  } catch (err) {
    next(err);
  }
};
