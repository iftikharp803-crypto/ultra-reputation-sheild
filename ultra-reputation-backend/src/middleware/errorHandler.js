const logger = require('../utils/logger');
const { sendError } = require('../utils/response');

const errorHandler = (error, req, res, next) => {
  logger.error('Global Error Handler:', error);

  // Database connection errors
  if (error.code === 'ECONNREFUSED') {
    return sendError(res, 'Database connection failed. Please check if PostgreSQL is running.', 503);
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return sendError(res, 'Authentication token is invalid or expired', 401);
  }

  if (error.name === 'TokenExpiredError') {
    return sendError(res, 'Authentication token has expired', 401);
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return sendError(res, error.message, 400);
  }

  // Database constraint errors
  if (error.code === '23505') { // Unique violation
    return sendError(res, 'A record with this information already exists', 400);
  }

  // Default error response
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong. Please try again later.' 
    : error.message;

  sendError(res, message, error.status || 500);
};

module.exports = errorHandler;