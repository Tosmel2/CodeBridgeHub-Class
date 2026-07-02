function errorHandler(err, req, res, next) {
  console.error('Unexpected error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error. Please try again later.'
  });
}

module.exports = errorHandler;
