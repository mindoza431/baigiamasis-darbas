const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// Sukuria naują užsakymą
router.post('/', auth, async (req, res) => {
  try {
    const { items, total } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Krepšelis tuščias' });
    }

    const order = new Order({
      user: req.user.userId,
      items,
      total
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Klaida kuriant užsakymą:', error);
    res.status(500).json({ message: 'Serverio klaida' });
  }
});

// Grąžina visus prisijungusio vartotojo užsakymus
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });
    
    console.log('Užsakymai su produktais:', orders);
    res.json(orders);
  } catch (error) {
    console.error('Klaida gaunant užsakymus:', error);
    res.status(500).json({ message: 'Nepavyko gauti užsakymų' });
  }
});

module.exports = router;