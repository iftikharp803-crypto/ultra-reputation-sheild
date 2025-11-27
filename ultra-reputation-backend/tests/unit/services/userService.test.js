import { userService } from '../../../src/services/userService.js';
import { supabase } from '../../../tests/__mocks__/supabaseClient.js';

// Mock the supabase client
jest.mock('../../../src/utils/supabaseClient.js', () => ({
  supabase: require('../../../tests/__mocks__/supabaseClient.js').supabase
}));

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@test.com', name: 'User One' },
        { id: 2, email: 'user2@test.com', name: 'User Two' }
      ];

      // Mock successful Supabase response
      supabase.from().select().order.mockReturnValue({
        data: mockUsers,
        error: null
      });

      const result = await userService.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(supabase.from).toHaveBeenCalledWith('users');
      expect(supabase.from().select).toHaveBeenCalledWith('*');
    });

    it('should throw error when Supabase fails', async () => {
      const mockError = new Error('Database connection failed');
      
      supabase.from().select().order.mockReturnValue({
        data: null,
        error: mockError
      });

      await expect(userService.getAllUsers()).rejects.toThrow('Database connection failed');
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = { id: 1, email: 'test@test.com', name: 'Test User' };
      
      supabase.from().select().eq().single.mockReturnValue({
        data: mockUser,
        error: null
      });

      const result = await userService.getUserById(1);

      expect(result).toEqual(mockUser);
      expect(supabase.from().select).toHaveBeenCalledWith('*');
      expect(supabase.from().select().eq).toHaveBeenCalledWith('id', 1);
    });

    it('should return null for non-existent user', async () => {
      supabase.from().select().eq().single.mockReturnValue({
        data: null,
        error: { message: 'User not found' }
      });

      const result = await userService.getUserById(999);

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const newUser = { email: 'new@test.com', name: 'New User' };
      const createdUser = { id: 3, ...newUser };
      
      supabase.from().insert().select().single.mockReturnValue({
        data: createdUser,
        error: null
      });

      const result = await userService.createUser(newUser);

      expect(result).toEqual(createdUser);
      expect(supabase.from().insert).toHaveBeenCalledWith([newUser]);
    });
  });
});