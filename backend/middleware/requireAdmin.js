const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Nėra autentifikuoto vartotojo' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Neturite teisių atlikti šį veiksmą' });
  }

  next();
};

module.exports = requireAdmin; 