module.exports.errorHandler = (err, req, res, next) => {
  // Log the error stack for detailed debugging
  console.error(err.stack);

  // Handle validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: messages,
    });
  }

  // Handle database connection errors
  if (err.message && err.message.includes('Database connection failed')) {
    return res.status(503).json({
      success: false,
      error: 'Service Unavailable: Database connection failed.',
    });
  }

  // Handle model synchronization errors
  if (err.message && err.message.includes('Model synchronization failed')) {
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error: Model synchronization failed.',
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token, authorization denied.',
    });
  }

  // Handle expired tokens
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired, please log in again.',
    });
  }

  // Handle Sequelize database errors
  if (err.name === 'SequelizeDatabaseError' || err.name === 'SequelizeConnectionError') {
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error: Database error occurred.',
    });
  }

  // Handle timeout errors (custom or express timeout errors)
  if (err.message && err.message.includes('timeout')) {
    return res.status(504).json({
      success: false,
      error: 'Request Timeout: The server took too long to respond.',
    });
  }

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(error => error.message);
    return res.status(400).json({
      success: false,
      error: messages,
    });
  }

  // Handle unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map(error => error.message);
    return res.status(400).json({
      success: false,
      error: `Unique constraint error: ${messages.join(', ')}`,
    });
  }

  // Catch syntax errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Bad request: Invalid JSON payload.',
    });
  }

  // Fallback for all other unhandled errors
  res.status(500).json({
    success: false,
    error: 'Server Error: Something went wrong.',
  });
};
