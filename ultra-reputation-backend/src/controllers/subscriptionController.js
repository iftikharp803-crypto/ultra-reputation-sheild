const Subscription = require('../models/Subscription');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

class SubscriptionController {
  static async getPlans(req, res) {
    try {
      const plans = await Subscription.getAllPlans();
      
      sendSuccess(res, { plans });
    } catch (error) {
      logger.error('Plans fetch error', error);
      sendError(res, 'Error fetching subscription plans');
    }
  }

  static async activateTrial(req, res) {
    try {
      const { plan_id } = req.body;
      
      const plan = await Subscription.getPlanById(plan_id);
      if (!plan) {
        return sendError(res, 'Invalid plan selected', 400);
      }
      
      // Check if user already has active trial
      const existingTrial = await Subscription.getUserActiveTrial(req.user.user_id);
      if (existingTrial) {
        return sendError(res, 'You already have an active trial', 400);
      }
      
      // Calculate trial dates
      const trialStartDate = new Date();
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + plan.trial_days);
      
      // Create trial subscription
      const newSubscription = await Subscription.createTrial({
        user_id: req.user.user_id,
        plan_id: plan.plan_id,
        is_trial: true,
        trial_activated: true,
        trial_start_date: trialStartDate,
        trial_end_date: trialEndDate,
        is_active: true
      });
      
      logger.info('Trial activated', { 
        userId: req.user.user_id, 
        planId: plan.plan_id 
      });
      
      sendSuccess(res, {
        message: `🎉 ${plan.trial_days}-day free trial activated for ${plan.plan_name}!`,
        subscription: newSubscription,
        trial_ends: trialEndDate
      });
      
    } catch (error) {
      logger.error('Trial activation error', error);
      sendError(res, 'Error activating free trial');
    }
  }

  static async getUserSubscription(req, res) {
    try {
      const subscription = await Subscription.getUserActiveSubscription(req.user.user_id);
      
      sendSuccess(res, { subscription });
    } catch (error) {
      logger.error('Subscription fetch error', error);
      sendError(res, 'Error fetching subscription details');
    }
  }
}

module.exports = SubscriptionController;