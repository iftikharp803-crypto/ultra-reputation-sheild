import request from 'supertest';
import app from '../../../src/app.js';
import { supabase } from '../../../src/utils/supabaseClient.js';

jest.mock('../../../src/utils/supabaseClient.js');

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'password123',
        name: 'New User'
      };

      supabase.auth.signUp.mockResolvedValue({
        data: { user: { id: '1', email: userData.email } },
        error: null
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password
      });
    });
  });
});