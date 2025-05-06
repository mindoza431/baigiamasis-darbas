const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.get('/product/:productId', reviewController.getReviews);

router.post('/product/:productId', auth, reviewController.addReview);

router.delete('/:reviewId', auth, reviewController.deleteReview);

router.put('/:reviewId', auth, reviewController.updateReview);

module.exports = router; 