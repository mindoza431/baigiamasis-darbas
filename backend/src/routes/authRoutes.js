const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Vartotojas nerastas' });
    }
    res.json({ 
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Klaida gaunant vartotoją:', error);
    res.status(500).json({ message: 'Serverio klaida' });
  }
});

router.put('/me', auth, authController.updateMe);

module.exports = router; 