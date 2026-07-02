function logger(req, res, next) {
  const now = new Date();
  const formattedTime = now.toISOString();
  console.log(`[${formattedTime}] ${req.method} ${req.originalUrl}`);
  next();
}

module.exports = logger;
