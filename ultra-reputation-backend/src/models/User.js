const { query } = require('../config/database');

class User {
  static async create(userData) {
    const { email, phone_number, password_hash } = userData;
    const result = await query(
      `INSERT INTO users (email, phone_number, password_hash) 
       VALUES ($1, $2, $3) RETURNING user_id, email, phone_number, created_at`,
      [email, phone_number, password_hash]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await query(
      `SELECT u.user_id, u.email, u.password_hash, u.is_active, u.email_verified,
              up.first_name, up.last_name, up.company_name
       FROM users u 
       LEFT JOIN user_profiles up ON u.user_id = up.user_id 
       WHERE u.email = $1`,
      [email]
    );
    return result.rows[0];
  }

  static async findById(userId) {
    const result = await query(
      `SELECT u.user_id, u.email, u.phone_number, u.is_active, u.created_at,
              up.first_name, up.last_name, up.company_name
       FROM users u 
       LEFT JOIN user_profiles up ON u.user_id = up.user_id 
       WHERE u.user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }

  static async createProfile(profileData) {
    const { user_id, first_name, last_name, company_name } = profileData;
    const result = await query(
      `INSERT INTO user_profiles (user_id, first_name, last_name, company_name) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, first_name, last_name, company_name]
    );
    return result.rows[0];
  }

  static async updateLastLogin(userId) {
    await query(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE user_id = $1',
      [userId]
    );
  }
}

module.exports = User;