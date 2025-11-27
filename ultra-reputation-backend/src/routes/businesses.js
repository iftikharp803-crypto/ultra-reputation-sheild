const express = require('express');
const BusinessController = require('../controllers/businessController');
const { validateBusiness } = require('../middleware/validation');
const auth = require('../middleware/auth');
const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/', validateBusiness, BusinessController.createBusiness);
router.get('/my-businesses', BusinessController.getUserBusinesses);
router.get('/:businessId', BusinessController.getBusiness);
router.put('/:businessId', validateBusiness, BusinessController.updateBusiness);

module.exports = router;