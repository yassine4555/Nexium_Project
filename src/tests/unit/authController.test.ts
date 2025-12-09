import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signUp, signIn } from '../../controllers/authController';
import { GATEWAY_BASE_URL, clearAuthData } from '../../lib/api';

describe('authController', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset fetch mock
    vi.resetAllMocks();
  });

  describe('signUp', () => {
    it('should successfully sign up a new user', async () => {
      const mockResponse = {
        id: 'user123',
        AuthToken: 'test-token',
        firstname: 'John',
        lastname: 'Doe',
        role: 'user',
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await signUp(
        'John',
        'Doe',
        'john@example.com',
        'password123',
        '1990-01-01',
        '123 Main St'
      );

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${GATEWAY_BASE_URL}/signup`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('john@example.com'),
        })
      );

      expect(result).toEqual({
        id: 'user123',
        email: 'john@example.com',
        firstname: 'John',
        lastname: 'Doe',
        dateOfBirth: '1990-01-01',
        address: '123 Main St',
        role: 'user',
      });

      expect(localStorage.getItem('jwt_token')).toBe('test-token');
      expect(localStorage.getItem('user_id')).toBe('user123');
      expect(localStorage.getItem('user_email')).toBe('john@example.com');
    });

    it('should handle signup failure', async () => {
      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Email already exists' }),
      } as Response);

      await expect(
        signUp('John', 'Doe', 'john@example.com', 'password123', '1990-01-01', '123 Main St')
      ).rejects.toThrow('Email already exists');
    });

    it('should include manager code when provided', async () => {
      const mockResponse = {
        id: 'user123',
        AuthToken: 'test-token',
        firstname: 'Jane',
        lastname: 'Smith',
        role: 'user',
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await signUp(
        'Jane',
        'Smith',
        'jane@example.com',
        'password123',
        '1990-01-01',
        '123 Main St',
        'MANAGER123'
      );

      const fetchCall = (globalThis.fetch as any).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody.managercode).toBe('MANAGER123');
    });
  });

  describe('signIn', () => {
    it('should successfully sign in a user', async () => {
      const mockResponse = {
        id: 'user123',
        Token: 'test-token',
        email: 'john@example.com',
        firstname: 'John',
        lastname: 'Doe',
        role: 'user',
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await signIn('john@example.com', 'password123');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${GATEWAY_BASE_URL}/login`,
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('john@example.com'),
        })
      );

      expect(result).toEqual({
        id: 'user123',
        email: 'john@example.com',
        firstname: 'John',
        lastname: 'Doe',
        dateOfBirth: '',
        address: '',
        role: 'user',
      });

      expect(localStorage.getItem('jwt_token')).toBe('test-token');
    });

    it('should handle login failure', async () => {
      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid credentials' }),
      } as Response);

      await expect(signIn('john@example.com', 'wrong-password')).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should map EMPLOYER role to admin', async () => {
      const mockResponse = {
        id: 'user123',
        Token: 'test-token',
        email: 'admin@example.com',
        firstname: 'Admin',
        lastname: 'User',
        role: 'EMPLOYER',
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await signIn('admin@example.com', 'password123');

      expect(result?.role).toBe('admin');
    });
  });

  describe('clearAuthData', () => {
    it('should clear all authentication data', () => {
      // Set up some auth data
      localStorage.setItem('jwt_token', 'test-token');
      localStorage.setItem('user_id', 'user123');
      localStorage.setItem('user_email', 'john@example.com');

      clearAuthData();

      expect(localStorage.getItem('jwt_token')).toBeNull();
      expect(localStorage.getItem('user_id')).toBeNull();
      expect(localStorage.getItem('user_email')).toBeNull();
    });
  });
});
