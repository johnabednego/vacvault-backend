const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

module.exports.authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;  // Attach the decoded token (containing user info) to the request
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};
