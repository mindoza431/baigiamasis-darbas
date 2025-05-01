const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    console.log('Gauta užklausa:', {
      body: req.body,
      headers: req.headers
    });

    const { items, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Neteisingi items:', items);
      return res.status(400).json({ 
        message: 'Užsakymas turi turėti bent vieną prekę',
        receivedData: { items, total },
        error: 'INVALID_ITEMS'
      });
    }

    if (!total || typeof total !== 'number' || total <= 0) {
      console.log('Neteisingas total:', total);
      return res.status(400).json({ 
        message: 'Neteisinga bendra suma',
        receivedData: { items, total },
        error: 'INVALID_TOTAL'
      });
    }

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        console.log('Neteisingi item duomenys:', item);
        return res.status(400).json({ 
          message: 'Neteisingi prekių duomenys',
          receivedData: { items, total },
          error: 'INVALID_ITEM_DATA'
        });
      }
    }

    const order = new Order({
      userId: req.user._id,
      items,
      total,
      status: 'pending'
    });

    console.log('Sukurtas užsakymo objektas:', order);

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Klaida kuriant užsakymą:', error);
    res.status(500).json({ 
      message: 'Nepavyko sukurti užsakymo',
      error: error.message,
      stack: error.stack
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.productId');
    res.json(orders);
  } catch (error) {
    console.error('Klaida gaunant užsakymus:', error);
    res.status(500).json({ 
      message: 'Nepavyko gauti užsakymų',
      error: error.message 
    });
  }
}; 