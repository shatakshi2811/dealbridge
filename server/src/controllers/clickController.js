const MerchantOffer = require('../models/MerchantOffer');
const Click = require('../models/Click');

/**
 * GET /api/redirect/:offerId
 *
 * 1. Validates the offer exists and has a valid destination URL
 * 2. Records the click (non-blocking)
 * 3. Increments offer.clickCount
 * 4. Redirects the user to the merchant's product page
 *
 * Security: destination URL is taken from the DB record, NOT from any
 * request parameter — users cannot supply arbitrary redirect targets.
 */
exports.trackAndRedirect = async (req, res, next) => {
  try {
    const offer = await MerchantOffer.findById(req.params.offerId);

    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found.' });
    }

    if (!offer.destinationUrl) {
      return res.status(400).json({ success: false, message: 'No destination URL configured for this offer.' });
    }

    // Validate URL is still an HTTPS URL (double-check even though schema validates on write)
    let parsedUrl;
    try {
      parsedUrl = new URL(offer.destinationUrl);
      if (parsedUrl.protocol !== 'https:') throw new Error('Not HTTPS');
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid redirect destination.' });
    }

    // Record click asynchronously — don't block redirect
    const clickData = {
      product: offer.product,
      offer: offer._id,
      merchantName: offer.merchantName,
      userId: req.user ? req.user._id : null,
      ipAddress: req.ip || req.headers['x-forwarded-for'],
      userAgent: req.headers['user-agent'],
      redirectUrl: offer.destinationUrl,
    };

    // Fire and forget — errors here should not break the redirect
    Click.create(clickData).catch((err) =>
      console.error('Click tracking error:', err.message)
    );

    // Increment offer click count (also fire and forget)
    MerchantOffer.findByIdAndUpdate(offer._id, { $inc: { clickCount: 1 } }).catch((err) =>
      console.error('Click count update error:', err.message)
    );

    // 302 redirect to merchant page
    res.redirect(302, offer.destinationUrl);
  } catch (err) {
    next(err);
  }
};
