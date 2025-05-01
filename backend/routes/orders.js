const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Serverio klaida' });
  }
});

router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Serverio klaida' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { items, total } = req.body;
    const order = new Order({
      user: req.user.userId,
      items,
      total
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Serverio klaida' });
  }
});

router.patch('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
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
    res.status(500).json({ message: 'Serverio klaida' });
  }
});

module.exports = router; 