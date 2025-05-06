const User = require('../models/User');

exports.getMe = async (req, res) => {
  try {
    console.log('Getting user data for ID:', req.user.id);
    
    if (!req.user || !req.user.id) {
      console.error('No user ID in request');
      return res.status(401).json({ message: 'Neprisijungęs' });
    }

    const user = await User.findById(req.user.id).select('-password');
    console.log('Found user:', user);

    if (!user) {
      console.error('User not found');
      return res.status(404).json({ message: 'Vartotojas nerastas' });
    }

    res.json({ 
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Error getting user data:', err);
    res.status(500).json({ message: 'Serverio klaida' });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Vartotojas nerastas' });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json({ data: user });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Serverio klaida' });
  }
}; 