import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Global test timeout
jest.setTimeout(10000);

// Global test variables
global.testUser = {
  email: 'test@example.com',
  password: 'password123'
};

// Mock console for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
};