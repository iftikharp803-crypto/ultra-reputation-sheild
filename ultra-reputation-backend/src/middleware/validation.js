const { sendError } = require('../utils/response');

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 8;
};

const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
};

const validateRegistration = (req, res, next) => {
  const { email, password, phone_number, first_name, last_name } = req.body;
  
  const errors = [];
  
  if (!email || !validateEmail(email)) {
    errors.push('Valid email is required');
  }
  
  if (!password || !validatePassword(password)) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!phone_number || !validatePhone(phone_number)) {
    errors.push('Valid phone number is required');
  }
  
  if (!first_name || first_name.length < 2) {
    errors.push('First name is required and must be at least 2 characters');
  }
  
  if (!last_name || last_name.length < 2) {
    errors.push('Last name is required and must be at least 2 characters');
  }
  
  if (errors.length > 0) {
    return sendError(res, errors.join(', '), 400);
  }
  
  next();
};

const validateBusiness = (req, res, next) => {
  const { business_name, industry } = req.body;
  
  const errors = [];
  
  if (!business_name || business_name.length < 2) {
    errors.push('Business name is required and must be at least 2 characters');
  }
  
  if (!industry || industry.length < 2) {
    errors.push('Industry is required and must be at least 2 characters');
  }
  
  if (errors.length > 0) {
    return sendError(res, errors.join(', '), 400);
  }
  
  next();
};

const validateInquiry = (req, res, next) => {
  const { name, email, phone, plan } = req.body;
  
  const errors = [];
  
  if (!name || name.length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }
  
  if (!email || !validateEmail(email)) {
    errors.push('Valid email is required');
  }
  
  if (!phone || !validatePhone(phone)) {
    errors.push('Valid phone number is required');
  }
  
  if (!plan) {
    errors.push('Plan selection is required');
  }
  
  if (errors.length > 0) {
    return sendError(res, errors.join(', '), 400);
  }
  
  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRegistration,
  validateBusiness,
  validateInquiry
};