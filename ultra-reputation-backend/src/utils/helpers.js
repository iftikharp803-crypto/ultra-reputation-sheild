const generateSecureId = () => {
  return `SECURE_${Date.now()}_${Math.random().toString(36).substr(2, 12)}_${process.pid}`;
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const calculateTrialEndDate = (trialDays) => {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + trialDays);
  return endDate;
};

const isTrialActive = (trialEndDate) => {
  return new Date(trialEndDate) > new Date();
};

module.exports = {
  generateSecureId,
  sanitizeInput,
  validateEmail,
  formatCurrency,
  calculateTrialEndDate,
  isTrialActive
};