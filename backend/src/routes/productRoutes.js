const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const Product = require('../models/Product');

router.post('/:id/reviews', protect, async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Jūs jau palikote atsiliepimą' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.averageRating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Atsiliepimas išsaugotas' });
  } else {
    res.status(404).json({ message: 'Prekė nerasta' });
  }
});

module.exports = router;