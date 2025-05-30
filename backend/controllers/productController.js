const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('creator', 'name email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Serverio klaida', error: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('creator', 'name email');
    
    if (!product) {
      return res.status(404).json({ message: 'Produktas nerastas' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Serverio klaida', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, discount } = req.body;
    
    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      discount,
      creator: req.user._id
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Serverio klaida', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, discount } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produktas nerastas' });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (image) product.image = image;
    if (category) product.category = category;
    if (discount !== undefined) product.discount = discount;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Serverio klaida', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produktas nerastas' });
    }

    await product.deleteOne();
    res.json({ message: 'Produktas sėkmingai ištrintas' });
  } catch (error) {
    res.status(500).json({ message: 'Serverio klaida', error: error.message });
  }
}; 