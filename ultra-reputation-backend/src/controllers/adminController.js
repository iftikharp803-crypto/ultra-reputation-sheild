const { query } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

class AdminController {
  static async getUsers(req, res) {
    try {
      const users = await query(
        `SELECT u.user_id, u.email, u.phone_number, u.is_active, u.created_at,
                up.first_name, up.last_name, up.company_name,
                us.plan_id, sp.plan_name as current_plan
         FROM users u
         LEFT JOIN user_profiles up ON u.user_id = up.user_id
         LEFT JOIN user_subscriptions us ON u.user_id = us.user_id AND us.is_active = true
         LEFT JOIN subscription_plans sp ON us.plan_id = sp.plan_id
         ORDER BY u.created_at DESC`
      );
      
      sendSuccess(res, { users: users.rows });
    } catch (error) {
      logger.error('Admin users fetch error', error);
      sendError(res, 'Error fetching users');
    }
  }

  static async getServices(req, res) {
    try {
      const services = await query(
        `SELECT us.*, sp.plan_name, up.company_name as business_name
         FROM user_subscriptions us
         JOIN subscription_plans sp ON us.plan_id = sp.plan_id
         JOIN user_profiles up ON us.user_id = up.user_id
         WHERE us.is_active = true
         ORDER BY us.created_at DESC`
      );
      
      sendSuccess(res, { services: services.rows });
    } catch (error) {
      logger.error('Admin services fetch error', error);
      sendError(res, 'Error fetching services');
    }
  }

  static async getAnalytics(req, res) {
    try {
      // Get total revenue
      const revenueResult = await query(
        `SELECT COALESCE(SUM(sp.price_monthly), 0) as monthly_revenue
         FROM user_subscriptions us
         JOIN subscription_plans sp ON us.plan_id = sp.plan_id
         WHERE us.is_active = true AND us.is_trial = false`
      );
      
      // Get new clients this month
      const clientsResult = await query(
        `SELECT COUNT(*) as new_clients
         FROM users 
         WHERE created_at >= date_trunc('month', CURRENT_DATE)`
      );
      
      // Get conversion rate (inquiries to clients)
      const conversionResult = await query(
        `SELECT 
           (SELECT COUNT(*) FROM users WHERE created_at >= date_trunc('month', CURRENT_DATE)) as new_clients,
           (SELECT COUNT(*) FROM inquiries WHERE created_at >= date_trunc('month', CURRENT_DATE)) as new_inquiries`
      );
      
      const newClients = conversionResult.rows[0].new_clients;
      const newInquiries = conversionResult.rows[0].new_inquiries;
      const conversionRate = newInquiries > 0 ? ((newClients / newInquiries) * 100).toFixed(1) : 0;
      
      sendSuccess(res, {
        analytics: {
          monthly_revenue: revenueResult.rows[0].monthly_revenue,
          new_clients: clientsResult.rows[0].new_clients,
          conversion_rate: conversionRate,
          avg_rating: '4.7'
        }
      });
    } catch (error) {
      logger.error('Admin analytics fetch error', error);
      sendError(res, 'Error fetching analytics');
    }
  }
}

module.exports = AdminController;