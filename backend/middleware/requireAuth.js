const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Nėra autentifikacijos žymės' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Neteisinga autentifikacijos žymė' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Neteisinga autentifikacijos žymė' });
  }
};

module.exports = requireAuth; 