const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Prieiga uždrausta. Reikalingos administratoriaus teisės.' });
  }
  next();
};

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

router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Klaida gaunant užsakymus:', error);
    res.status(500).json({ message: 'Nepavyko gauti užsakymų' });
  }
});

router.patch('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Būtina nurodyti naują statusą' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Užsakymas nerastas' });
    }

    res.json(order);
  } catch (error) {
    console.error('Klaida atnaujinant užsakymo statusą:', error);
    res.status(500).json({ message: 'Nepavyko atnaujinti užsakymo statuso' });
  }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Užsakymas nerastas' });
    }

    res.json({ message: 'Užsakymas sėkmingai ištrintas' });
  } catch (error) {
    console.error('Klaida trinant užsakymą:', error);
    res.status(500).json({ message: 'Nepavyko ištrinti užsakymo' });
  }
});

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