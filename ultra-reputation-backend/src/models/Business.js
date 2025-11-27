const { query } = require('../config/database');

class Business {
  static async create(businessData) {
    const { user_id, business_name, industry, website_url, google_business_url } = businessData;
    const result = await query(
      `INSERT INTO businesses (user_id, business_name, industry, website_url, google_business_url) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, business_name, industry, website_url, google_business_url]
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await query(
      'SELECT * FROM businesses WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  static async findById(businessId) {
    const result = await query(
      'SELECT * FROM businesses WHERE business_id = $1',
      [businessId]
    );
    return result.rows[0];
  }

  static async update(businessId, updateData) {
    const { business_name, industry, website_url, google_business_url } = updateData;
    const result = await query(
      `UPDATE businesses 
       SET business_name = $1, industry = $2, website_url = $3, google_business_url = $4, updated_at = CURRENT_TIMESTAMP
       WHERE business_id = $5 RETURNING *`,
      [business_name, industry, website_url, google_business_url, businessId]
    );
    return result.rows[0];
  }

  static async delete(businessId) {
    await query('DELETE FROM businesses WHERE business_id = $1', [businessId]);
  }
}

module.exports = Business;