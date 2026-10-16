const express = require('express');
const { getDashboardStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

router.get('/', protect, adminOnly, getDashboardStats);

module.exports = router;
