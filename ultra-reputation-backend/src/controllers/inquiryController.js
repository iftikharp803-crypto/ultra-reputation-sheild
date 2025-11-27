const Inquiry = require('../models/Inquiry');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

class InquiryController {
  static async createInquiry(req, res) {
    try {
      const { name, email, phone, plan, message } = req.body;
      
      const newInquiry = await Inquiry.create({
        name,
        email,
        phone,
        plan,
        message
      });
      
      logger.info('New inquiry created', { 
        inquiryId: newInquiry.inquiry_id,
        email 
      });
      
      sendSuccess(res, {
        message: 'Inquiry submitted successfully! We will contact you soon.',
        inquiry: newInquiry
      }, 201);
      
    } catch (error) {
      logger.error('Inquiry creation error', error);
      sendError(res, 'Error submitting inquiry');
    }
  }

  static async getAllInquiries(req, res) {
    try {
      const inquiries = await Inquiry.getAll();
      
      sendSuccess(res, { inquiries });
    } catch (error) {
      logger.error('Inquiries fetch error', error);
      sendError(res, 'Error fetching inquiries');
    }
  }

  static async updateInquiryStatus(req, res) {
    try {
      const { inquiryId } = req.params;
      const { status } = req.body;
      
      const inquiry = await Inquiry.getById(inquiryId);
      if (!inquiry) {
        return sendError(res, 'Inquiry not found', 404);
      }
      
      const updatedInquiry = await Inquiry.updateStatus(inquiryId, status);
      
      logger.info('Inquiry status updated', { 
        inquiryId, 
        status 
      });
      
      sendSuccess(res, {
        message: 'Inquiry status updated successfully!',
        inquiry: updatedInquiry
      });
      
    } catch (error) {
      logger.error('Inquiry status update error', error);
      sendError(res, 'Error updating inquiry status');
    }
  }
}

module.exports = InquiryController;