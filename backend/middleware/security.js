const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'fail', message: 'Too many requests, please try again later.' }
});

module.exports = {
  helmet,
  limiter
};
