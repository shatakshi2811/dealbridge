const express = require('express');
const { body } = require('express-validator');
const { updateOffer, deleteOffer } = require('../controllers/offerController');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

const offerValidation = [
  body('merchantName').optional().trim().notEmpty().withMessage('Merchant name cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('destinationUrl')
    .optional()
    .isURL({ protocols: ['https'] })
    .withMessage('Valid HTTPS URL is required'),
  body('availability')
    .optional()
    .isIn(['In Stock', 'Out of Stock', 'Limited'])
    .withMessage('Invalid availability status'),
];

router.put('/:id', protect, adminOnly, offerValidation, updateOffer);
router.delete('/:id', protect, adminOnly, deleteOffer);

module.exports = router;
