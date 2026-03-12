class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.isOperational = true;
  }
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';
  res.status(status).json({ status: 'error', message });
}

module.exports = { AppError, errorHandler };
