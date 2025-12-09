import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAuthHeaders,
  getAuthToken,
  isAuthenticated,
  clearAuthData,
} from '../../lib/api';

describe('api utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getAuthHeaders', () => {
    it('should return headers with token when authenticated', () => {
      localStorage.setItem('jwt_token', 'test-token-123');

      const headers = getAuthHeaders();

      expect(headers).toEqual({
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token-123',
      });
    });

    it('should return headers without token when not authenticated', () => {
      const headers = getAuthHeaders();

      expect(headers).toEqual({
        'Content-Type': 'application/json',
        Authorization: '',
      });
    });
  });

  describe('getAuthToken', () => {
    it('should return token when it exists', () => {
      localStorage.setItem('jwt_token', 'test-token-456');

      const token = getAuthToken();

      expect(token).toBe('test-token-456');
    });

    it('should return null when token does not exist', () => {
      const token = getAuthToken();

      expect(token).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('jwt_token', 'test-token');

      const result = isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when token does not exist', () => {
      const result = isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return false when token is empty string', () => {
      localStorage.setItem('jwt_token', '');

      const result = isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('clearAuthData', () => {
    it('should clear all authentication data', () => {
      // Set up auth data
      localStorage.setItem('jwt_token', 'test-token');
      localStorage.setItem('user_id', 'user123');
      localStorage.setItem('user_email', 'user@example.com');
      localStorage.setItem('user_firstname', 'John');
      localStorage.setItem('user_lastname', 'Doe');
      localStorage.setItem('user_role', 'admin');
      localStorage.setItem('token_expires_at', '2025-12-31');
      localStorage.setItem('authToken', 'old-token');

      clearAuthData();

      expect(localStorage.getItem('jwt_token')).toBeNull();
      expect(localStorage.getItem('user_id')).toBeNull();
      expect(localStorage.getItem('user_email')).toBeNull();
      expect(localStorage.getItem('user_firstname')).toBeNull();
      expect(localStorage.getItem('user_lastname')).toBeNull();
      expect(localStorage.getItem('user_role')).toBeNull();
      expect(localStorage.getItem('token_expires_at')).toBeNull();
      expect(localStorage.getItem('authToken')).toBeNull();
    });

    it('should not throw error when called on empty storage', () => {
      expect(() => clearAuthData()).not.toThrow();
    });
  });
});
