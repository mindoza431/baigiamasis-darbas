const Review = require('../models/Review');

exports.getReviews = async (req, res) => {
  try {
    console.log('Getting reviews for product:', req.params.productId);
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    console.log('Found reviews:', reviews);
    res.json({ data: reviews });
  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    console.log('Adding review request body:', req.body);
    console.log('Product ID:', req.params.productId);
    console.log('User from request:', req.user);

    const { rating, comment } = req.body;
    const productId = req.params.productId;
    const userId = req.user.id;

    if (!userId) {
      console.error('No user ID found in request');
      return res.status(401).json({ message: 'Neprisijungęs' });
    }

    const existingReview = await Review.findOne({ product: productId, user: userId });
    console.log('Existing review:', existingReview);

    if (existingReview) {
      console.log('User already has a review for this product');
      return res.status(400).json({ message: 'Jūs jau palikote atsiliepimą šiam produktui' });
    }

    const review = new Review({
      product: productId,
      user: userId,
      rating,
      comment
    });

    console.log('Saving new review:', review);
    await review.save();
    console.log('Review saved successfully');
    
    res.status(201).json({ data: review });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    console.log('Deleting review:', req.params.reviewId);
    console.log('User role:', req.user.role);

    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Atsiliepimas nerastas' });
    }

    if (req.user.role !== 'admin') {
      console.log('User is not admin, access denied');
      return res.status(403).json({ message: 'Neturite teisės ištrinti atsiliepimo' });
    }

    console.log('Deleting review:', review);
    await review.deleteOne();
    console.log('Review deleted successfully');
    
    res.json({ message: 'Atsiliepimas ištrintas' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Atsiliepimas nerastas' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Neturite teisės redaguoti atsiliepimo' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 