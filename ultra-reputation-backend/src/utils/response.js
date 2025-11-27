const sendSuccess = (res, data, statusCode = 200) => {
  const response = {
    success: true,
    ...data
  };
  res.status(statusCode).json(response);
};

const sendError = (res, message, statusCode = 500) => {
  const response = {
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  };

  // Include error details in development
  if (process.env.NODE_ENV === 'development' && message instanceof Error) {
    response.details = message.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError
};