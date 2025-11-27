const Business = require('../models/Business');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

class BusinessController {
  static async createBusiness(req, res) {
    try {
      const { business_name, industry, website_url, google_business_url } = req.body;
      
      const newBusiness = await Business.create({
        user_id: req.user.user_id,
        business_name,
        industry,
        website_url,
        google_business_url
      });
      
      logger.info('Business created', { 
        userId: req.user.user_id, 
        businessId: newBusiness.business_id 
      });
      
      sendSuccess(res, {
        message: 'Business profile created successfully!',
        business: newBusiness
      }, 201);
      
    } catch (error) {
      logger.error('Business creation error', error);
      sendError(res, 'Error creating business profile');
    }
  }

  static async getUserBusinesses(req, res) {
    try {
      const businesses = await Business.findByUserId(req.user.user_id);
      
      sendSuccess(res, { businesses });
    } catch (error) {
      logger.error('Businesses fetch error', error);
      sendError(res, 'Error fetching businesses');
    }
  }

  static async getBusiness(req, res) {
    try {
      const { businessId } = req.params;
      const business = await Business.findById(businessId);
      
      if (!business) {
        return sendError(res, 'Business not found', 404);
      }
      
      // Check if business belongs to user
      if (business.user_id !== req.user.user_id) {
        return sendError(res, 'Access denied', 403);
      }
      
      sendSuccess(res, { business });
    } catch (error) {
      logger.error('Business fetch error', error);
      sendError(res, 'Error fetching business');
    }
  }

  static async updateBusiness(req, res) {
    try {
      const { businessId } = req.params;
      const updateData = req.body;
      
      const business = await Business.findById(businessId);
      if (!business) {
        return sendError(res, 'Business not found', 404);
      }
      
      if (business.user_id !== req.user.user_id) {
        return sendError(res, 'Access denied', 403);
      }
      
      const updatedBusiness = await Business.update(businessId, updateData);
      
      logger.info('Business updated', { 
        userId: req.user.user_id, 
        businessId 
      });
      
      sendSuccess(res, {
        message: 'Business updated successfully!',
        business: updatedBusiness
      });
      
    } catch (error) {
      logger.error('Business update error', error);
      sendError(res, 'Error updating business');
    }
  }
}

module.exports = BusinessController;