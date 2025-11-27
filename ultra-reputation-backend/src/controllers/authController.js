const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, phone_number, first_name, last_name, company_name } = req.body;
      
      // Check if user exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return sendError(res, 'User with this email already exists', 400);
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
      const passwordHash = await bcrypt.hash(password, salt);
      
      // Create user
      const newUser = await User.create({
        email,
        phone_number,
        password_hash: passwordHash
      });
      
      // Create user profile
      await User.createProfile({
        user_id: newUser.user_id,
        first_name,
        last_name,
        company_name
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { user_id: newUser.user_id }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      logger.info('New user registered', { userId: newUser.user_id, email });
      
      sendSuccess(res, {
        message: 'Account created successfully! Welcome to Ultra Reputation Shield.',
        token,
        user: {
          user_id: newUser.user_id,
          email: newUser.email,
          phone_number: newUser.phone_number,
          first_name,
          last_name,
          company_name
        }
      }, 201);
      
    } catch (error) {
      logger.error('Registration error', error);
      sendError(res, 'Server error during registration. Please try again.');
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return sendError(res, 'Invalid email or password', 400);
      }
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return sendError(res, 'Invalid email or password', 400);
      }
      
      // Update last login
      await User.updateLastLogin(user.user_id);
      
      // Generate token
      const token = jwt.sign(
        { user_id: user.user_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      logger.info('User login successful', { userId: user.user_id, email });
      
      sendSuccess(res, {
        message: 'Login successful! Welcome back to Ultra Reputation Shield.',
        token,
        user: {
          user_id: user.user_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          company_name: user.company_name
        }
      });
      
    } catch (error) {
      logger.error('Login error', error);
      sendError(res, 'Server error during login. Please try again.');
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.user_id);
      if (!user) {
        return sendError(res, 'User not found', 404);
      }
      
      sendSuccess(res, { user });
    } catch (error) {
      logger.error('Get profile error', error);
      sendError(res, 'Error fetching user profile');
    }
  }
}

module.exports = AuthController;