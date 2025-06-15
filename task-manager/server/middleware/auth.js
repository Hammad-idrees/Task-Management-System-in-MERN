const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = { id: user._id };
    console.log('Set req.user.id to:', req.user.id);
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
