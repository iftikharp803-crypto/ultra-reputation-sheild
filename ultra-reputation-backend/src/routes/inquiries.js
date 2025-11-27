const express = require('express');
const InquiryController = require('../controllers/inquiryController');
const { validateInquiry } = require('../middleware/validation');
const auth = require('../middleware/auth');
const router = express.Router();

// Public routes
router.post('/', validateInquiry, InquiryController.createInquiry);

// Protected routes (admin only)
router.get('/', auth, InquiryController.getAllInquiries);
router.put('/:inquiryId/status', auth, InquiryController.updateInquiryStatus);

module.exports = router;