const { query } = require('../config/database');

class Inquiry {
  static async create(inquiryData) {
    const { name, email, phone, plan, message, status = 'new' } = inquiryData;
    const result = await query(
      `INSERT INTO inquiries (name, email, phone, plan, message, status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email, phone, plan, message, status]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await query(
      'SELECT * FROM inquiries ORDER BY created_at DESC'
    );
    return result.rows;
  }

  static async updateStatus(inquiryId, status) {
    const result = await query(
      'UPDATE inquiries SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE inquiry_id = $2 RETURNING *',
      [status, inquiryId]
    );
    return result.rows[0];
  }

  static async getById(inquiryId) {
    const result = await query(
      'SELECT * FROM inquiries WHERE inquiry_id = $1',
      [inquiryId]
    );
    return result.rows[0];
  }
}

module.exports = Inquiry;