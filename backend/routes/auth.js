const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.delete('/users/delete', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await User.deleteOne({ email });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Vartotojas nerastas' });
    }
    res.json({ message: 'Vartotojas ištrintas' });
  } catch (error) {
    console.error('Vartotojo ištrynimo klaida:', error);
    res.status(500).json({ message: 'Serverio klaida' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Serverio klaida' });
  }
});

router.delete('/users/delete-all', async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: 'Visi vartotojai ištrinti' });
  } catch (error) {
    console.error('Vartotojų ištrynimo klaida:', error);
    res.status(500).json({ message: 'Serverio klaida' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    console.log('Registracija:', { email, name, role });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Vartotojas su tokiu el. paštu jau egzistuoja' });
    }

    const user = new User({
      email,
      password,
      name,
      role: role || 'user'
    });

    await user.save();
    console.log('Vartotojas sukurtas:', user);

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      token, 
      user: { 
        _id: user._id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Registracijos klaida:', error);
    res.status(500).json({ message: 'Serverio klaida', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Prisijungimo bandymas:', { email });

    if (!email || !password) {
      return res.status(400).json({ message: 'El. paštas ir slaptažodis yra privalomi' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('Vartotojas nerastas:', email);
      return res.status(400).json({ message: 'Neteisingas el. paštas arba slaptažodis' });
    }

    console.log('Rastas vartotojas:', user.email);
    const isMatch = await user.comparePassword(password);
    console.log('Slaptažodžio palyginimo rezultatas:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Neteisingas el. paštas arba slaptažodis' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Prisijungimo klaida:', error);
    res.status(500).json({ message: 'Serverio klaida', error: error.message });
  }
});

module.exports = router; 