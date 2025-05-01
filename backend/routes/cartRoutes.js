const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.get('/', cartController.getCart);

router.post('/add', cartController.addToCart);

router.delete('/remove', cartController.removeFromCart);

module.exports = router; 