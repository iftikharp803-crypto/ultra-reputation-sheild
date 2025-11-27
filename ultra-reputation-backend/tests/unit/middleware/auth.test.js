import { authenticate } from '../../../src/middleware/auth.js';
import { supabase } from '../../../src/utils/supabaseClient.js';

jest.mock('../../../src/utils/supabaseClient.js');

describe('Auth Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  it('should call next with user data when token is valid', async () => {
    const mockUser = { id: '1', email: 'test@test.com' };
    const mockToken = 'valid-token';
    
    mockReq.headers.authorization = `Bearer ${mockToken}`;
    supabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null
    });

    await authenticate(mockReq, mockRes, mockNext);

    expect(supabase.auth.getUser).toHaveBeenCalledWith(mockToken);
    expect(mockReq.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 401 when no token provided', async () => {
    await authenticate(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 when token is invalid', async () => {
    mockReq.headers.authorization = 'Bearer invalid-token';
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error('Invalid token')
    });

    await authenticate(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });
});