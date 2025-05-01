const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const auth = require('../middleware/auth'); // <- ŠITAS REIKALINGAS
const User = require('../models/User'); // Pridėtas User modelis

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Vartotojas nerastas' });
    }
    res.json(user);
  } catch (error) {
    console.error('Klaida gaunant vartotoją:', error);
    res.status(500).json({ message: 'Serverio klaida' });
  }
});

router.patch('/me', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Vartotojas nerastas' });
    }

    // Patikriname, ar naujas el. paštas jau nėra užimtas
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Vartotojas su tokiu el. paštu jau egzistuoja' });
      }
    }

    user.name = name;
    user.email = email;
    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Klaida atnaujinant vartotoją:', error);
    res.status(500).json({ message: 'Serverio klaida' });
  }
});

module.exports = router;
