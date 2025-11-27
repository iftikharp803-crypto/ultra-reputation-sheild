import request from 'supertest';
import app from '../../../src/app.js';
import { supabase } from '../../../src/utils/supabaseClient.js';

jest.mock('../../../src/utils/supabaseClient.js');

describe('User Routes Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@test.com', name: 'User One' },
        { id: 2, email: 'user2@test.com', name: 'User Two' }
      ];

      // Mock authenticated user
      supabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '1', email: 'test@test.com' } },
        error: null
      });

      // Mock database response
      supabase.from().select().order.mockReturnValue({
        data: mockUsers,
        error: null
      });

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body).toEqual(mockUsers);
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .get('/api/users')
        .expect(401);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = { email: 'new@test.com', name: 'New User' };
      const createdUser = { id: 3, ...newUser };

      supabase.from().insert().select().single.mockReturnValue({
        data: createdUser,
        error: null
      });

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      expect(response.body).toEqual(createdUser);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});