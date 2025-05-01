const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');


exports.createOrder = async (req, res) => {
  try {

    const cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Krepšelis tuščias' });
    }

    let total = 0;
    const orderProducts = await Promise.all(cart.items.map(async (item) => {
      const product = await Product.findById(item.productId);
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      
      return {
        productId: item.productId._id,
        quantity: item.quantity,
        price: product.price
      };
    }));

    const order = new Order({
      userId: req.user._id,
      products: orderProducts,
      total
    });

    await order.save();

    await Cart.findOneAndDelete({ userId: req.user._id });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Serverio klaida', error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('products.productId', 'title image')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Serverio klaida', error: error.message });
  }
};

// tik admino uzsakymai
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('products.productId', 'title image')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Serverio klaida', error: error.message });
  }
}; 