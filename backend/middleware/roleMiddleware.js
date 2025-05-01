const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Nėra autentifikuoto vartotojo' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Neturite teisių atlikti šį veiksmą' });
    }

    next();
  };
};

module.exports = roleMiddleware; 