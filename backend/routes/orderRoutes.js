const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

router.post('/', auth, async (req, res) => {
  try {
    console.log('Gauta užklausa:', req.body);
    console.log('Items:', req.body.items);
    console.log('Pirmas item:', req.body.items?.[0]);

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

module.exports = router;