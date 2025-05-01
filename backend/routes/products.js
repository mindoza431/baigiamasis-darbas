const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Klaida gaunant produktus:', error);
    res.status(500).json({ message: 'Serverio klaida' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produktas nerastas' });
    }
    res.json(product);
  } catch (error) {
    console.error('Klaida gaunant produktą:', error);
    res.status(500).json({ message: 'Serverio klaida' });
  }
});

router.post('/', auth, adminAuth, async (req, res) => {
  try {
    console.log('Gauti duomenys:', req.body);
    
    const { name, price, description, image, category } = req.body;

    if (!name || !price || !description || !image || !category) {
      return res.status(400).json({ 
        message: 'Visi laukai yra privalomi',
        missingFields: {
          name: !name,
          price: !price,
          description: !description,
          image: !image,
          category: !category
        }
      });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Kaina turi būti teigiamas skaičius' });
    }

    const product = new Product({
      name,
      price: parseFloat(price),
      description,
      image,
      category
    });

    console.log('Kuriamas produktas:', product);
    await product.save();
    console.log('Produktas išsaugotas:', product);
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Klaida kuriant produktą:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validacijos klaida',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Serverio klaida',
      error: error.message 
    });
  }
});

router.patch('/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Produktas nerastas' });
    }
    res.json(product);
  } catch (error) {
    console.error('Klaida atnaujinant produktą:', error);
    res.status(500).json({ message: 'Serverio klaida' });
  }
});

router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produktas nerastas' });
    }
    res.json({ message: 'Produktas ištrintas' });
  } catch (error) {
    console.error('Klaida trinant produktą:', error);
    res.status(500).json({ message: 'Serverio klaida' });
  }
});

module.exports = router; 