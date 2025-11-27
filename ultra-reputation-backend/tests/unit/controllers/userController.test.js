import { getUsers, getUserById, createUser } from '../../../src/controllers/userController.js';
import { userService } from '../../../src/services/userService.js';

// Mock the service layer
jest.mock('../../../src/services/userService.js');

describe('User Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {}
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return users successfully', async () => {
      const mockUsers = [{ id: 1, name: 'Test User' }];
      userService.getAllUsers.mockResolvedValue(mockUsers);

      await getUsers(mockReq, mockRes, mockNext);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when service fails', async () => {
      const mockError = new Error('Service failed');
      userService.getAllUsers.mockRejectedValue(mockError);

      await getUsers(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      mockReq.params.id = '1';
      const mockUser = { id: 1, name: 'Test User' };
      userService.getUserById.mockResolvedValue(mockUser);

      await getUserById(mockReq, mockRes, mockNext);

      expect(userService.getUserById).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 when user not found', async () => {
      mockReq.params.id = '999';
      userService.getUserById.mockResolvedValue(null);

      await getUserById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });

  describe('createUser', () => {
    it('should create user and return 201', async () => {
      const userData = { email: 'new@test.com', name: 'New User' };
      mockReq.body = userData;
      const createdUser = { id: 1, ...userData };
      userService.createUser.mockResolvedValue(createdUser);

      await createUser(mockReq, mockRes, mockNext);

      expect(userService.createUser).toHaveBeenCalledWith(userData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdUser);
    });
  });
});