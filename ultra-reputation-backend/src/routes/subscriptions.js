const express = require('express');
const SubscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');
const router = express.Router();

// Public routes
router.get('/plans', SubscriptionController.getPlans);

// Protected routes
router.use(auth);
router.post('/activate-trial', SubscriptionController.activateTrial);
router.get('/my-subscription', SubscriptionController.getUserSubscription);

module.exports = router;