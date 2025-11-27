const express = require('express');
const AdminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const router = express.Router();

// All admin routes require authentication
router.use(auth);

router.get('/users', AdminController.getUsers);
router.get('/services', AdminController.getServices);
router.get('/analytics', AdminController.getAnalytics);

module.exports = router;