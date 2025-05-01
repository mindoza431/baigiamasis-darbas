const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId', 'title price image');
    
    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Serverio klaida', error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produktas nerastas' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: []
      });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Serverio klaida', error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Krepšelis nerastas' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Serverio klaida', error: error.message });
  }
}; 