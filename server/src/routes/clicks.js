const express = require('express');
const { trackAndRedirect } = require('../controllers/clickController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// optionalAuth attaches req.user if logged in — click records user ID when available
router.get('/:offerId', optionalAuth, trackAndRedirect);

module.exports = router;
