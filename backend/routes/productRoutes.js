const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

router.post('/', requireAuth, requireAdmin, productController.createProduct);
router.patch('/:id', requireAuth, requireAdmin, productController.updateProduct);
router.delete('/:id', requireAuth, requireAdmin, productController.deleteProduct);

module.exports = router; 