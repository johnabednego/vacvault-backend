const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports.isAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    // Verify token and extract payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ success: false, msg: 'Access denied. Admins only.' });
    }
  };
  