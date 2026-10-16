const express = require('express');
const { body, query } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
} = require('../controllers/productController');
const {
  getOffersByProduct,
  createOffer,
} = require('../controllers/offerController');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

const VALID_CATEGORIES = ['Watches', 'Smartphones', 'Laptops', 'Headphones', 'Fashion', 'Home Appliances'];

const productValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(VALID_CATEGORIES).withMessage('Invalid category'),
];

const offerValidation = [
  body('merchantName').trim().notEmpty().withMessage('Merchant name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('destinationUrl').isURL({ protocols: ['https'] }).withMessage('Valid HTTPS URL is required'),
  body('availability')
    .optional()
    .isIn(['In Stock', 'Out of Stock', 'Limited'])
    .withMessage('Invalid availability status'),
];

// Public routes
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/:productId/offers', getOffersByProduct);

// Admin-only routes
router.post('/', protect, adminOnly, productValidation, createProduct);
router.put('/:id', protect, adminOnly, productValidation, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/:productId/offers', protect, adminOnly, offerValidation, createOffer);

module.exports = router;
