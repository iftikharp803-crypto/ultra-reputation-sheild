const { query } = require('../config/database');

class Subscription {
  static async getAllPlans() {
    const result = await query(
      'SELECT * FROM subscription_plans WHERE is_active = true ORDER BY price_monthly'
    );
    return result.rows;
  }

  static async getPlanById(planId) {
    const result = await query(
      'SELECT * FROM subscription_plans WHERE plan_id = $1',
      [planId]
    );
    return result.rows[0];
  }

  static async createTrial(subscriptionData) {
    const { user_id, plan_id, is_trial, trial_activated, trial_start_date, trial_end_date, is_active } = subscriptionData;
    const result = await query(
      `INSERT INTO user_subscriptions 
       (user_id, plan_id, is_trial, trial_activated, trial_start_date, trial_end_date, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [user_id, plan_id, is_trial, trial_activated, trial_start_date, trial_end_date, is_active]
    );
    return result.rows[0];
  }

  static async getUserActiveSubscription(userId) {
    const result = await query(
      `SELECT us.*, sp.plan_name, sp.features, sp.price_monthly
       FROM user_subscriptions us
       JOIN subscription_plans sp ON us.plan_id = sp.plan_id
       WHERE us.user_id = $1 AND us.is_active = true
       ORDER BY us.created_at DESC LIMIT 1`,
      [userId]
    );
    return result.rows[0];
  }

  static async getUserActiveTrial(userId) {
    const result = await query(
      `SELECT * FROM user_subscriptions 
       WHERE user_id = $1 AND is_trial = true AND trial_end_date > CURRENT_TIMESTAMP`,
      [userId]
    );
    return result.rows[0];
  }
}

module.exports = Subscription;