export const supabase = {
  auth: {
    getUser: jest.fn(),
    signUp: jest.fn(),
    signIn: jest.fn()
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(),
        order: jest.fn()
      })),
      order: jest.fn(),
      single: jest.fn()
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn()
      }))
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        select: jest.fn()
      }))
    })),
    delete: jest.fn(() => ({
      eq: jest.fn()
    }))
  }))
};

// Reset all mocks between tests
afterEach(() => {
  jest.clearAllMocks();
});