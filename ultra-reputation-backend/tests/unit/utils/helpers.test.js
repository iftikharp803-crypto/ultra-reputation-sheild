import { validateEmail, formatResponse, generateId } from '../../../src/utils/helpers.js';

describe('Helper Functions', () => {
  describe('validateEmail', () => {
    it('should return true for valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });
  });

  describe('formatResponse', () => {
    it('should format successful response', () => {
      const data = { id: 1, name: 'Test' };
      const result = formatResponse(true, data, null);

      expect(result).toEqual({
        success: true,
        data: data,
        error: null
      });
    });

    it('should format error response', () => {
      const error = 'Something went wrong';
      const result = formatResponse(false, null, error);

      expect(result).toEqual({
        success: false,
        data: null,
        error: error
      });
    });
  });
});