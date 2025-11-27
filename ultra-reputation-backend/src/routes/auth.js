const express = require('express');
const AuthController = require('../controllers/authController');
const { validateRegistration } = require('../middleware/validation');
const auth = require('../middleware/auth');
const router = express.Router();

// Public routes
router.post('/register', validateRegistration, AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/profile', auth, AuthController.getProfile);

module.exports = router;