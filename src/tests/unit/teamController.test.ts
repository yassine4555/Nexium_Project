import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getMyEmployees,
  getTeammatesForDisplay,
  getTeammates,
} from '../../controllers/teamController';
import { GATEWAY_BASE_URL } from '../../lib/api';

describe('teamController', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('jwt_token', 'test-token');
    vi.resetAllMocks();
  });

  describe('getMyEmployees', () => {
    it('should fetch employees successfully', async () => {
      const mockData = {
        employees: [
          {
            id: 'emp1',
            email: 'emp1@example.com',
            first_name: 'Employee',
            last_name: 'One',
            role: 'developer',
            department: 'Engineering',
          },
        ],
        manager: {
          id: 'mgr1',
          email: 'manager@example.com',
          first_name: 'Manager',
          last_name: 'One',
          role: 'manager',
          department: 'Management',
        },
        employees_count: 1,
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await getMyEmployees(true);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${GATEWAY_BASE_URL}/my-employees?include_details=true`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );

      expect(result.employees).toHaveLength(1);
      expect(result.employees[0].email).toBe('emp1@example.com');
      expect(result.manager?.email).toBe('manager@example.com');
      expect(result.employees_count).toBe(1);
    });

    it('should handle empty employee list', async () => {
      const mockData = {
        employees: [],
        manager: null,
        employees_count: 0,
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await getMyEmployees();

      expect(result.employees).toHaveLength(0);
      expect(result.manager).toBeNull();
      expect(result.employees_count).toBe(0);
    });

    it('should handle fetch error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' }),
      } as Response);

      await expect(getMyEmployees()).rejects.toThrow('Server error');
    });
  });

  describe('getTeammatesForDisplay', () => {
    it('should fetch teammates with manager', async () => {
      const mockData = {
        teammates: [
          {
            id: 'teammate1',
            email: 'teammate1@example.com',
            first_name: 'Teammate',
            last_name: 'One',
            role: 'developer',
            department: 'Engineering',
          },
        ],
        manager: {
          id: 'mgr1',
          email: 'manager@example.com',
          first_name: 'Manager',
          last_name: 'One',
          role: 'manager',
          department: 'Management',
        },
        teammates_count: 1,
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await getTeammatesForDisplay(true, true);

      expect(result.teammates).toHaveLength(1);
      expect(result.manager).not.toBeNull();
      expect(result.teammates_count).toBe(1);
    });

    it('should fetch teammates without manager', async () => {
      const mockData = {
        teammates: [
          {
            id: 'teammate1',
            email: 'teammate1@example.com',
            first_name: 'Teammate',
            last_name: 'One',
            role: 'developer',
            department: 'Engineering',
          },
        ],
        manager: null,
        teammates_count: 1,
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await getTeammatesForDisplay(true, false);

      const fetchCall = (globalThis.fetch as any).mock.calls[0][0];
      expect(fetchCall).toContain('include_manager=false');
      expect(result.teammates).toHaveLength(1);
      expect(result.manager).toBeNull();
    });
  });

  describe('getTeammates', () => {
    it('should fetch teammates with all details', async () => {
      const mockData = {
        teammates: [
          {
            id: 'teammate1',
            email: 'teammate1@example.com',
            first_name: 'Teammate',
            last_name: 'One',
            role: 'developer',
            department: 'Engineering',
          },
        ],
        manager: {
          id: 'mgr1',
          email: 'manager@example.com',
          first_name: 'Manager',
          last_name: 'One',
          role: 'manager',
          department: 'Management',
        },
        teammates_count: 1,
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await getTeammates(true, true);

      expect(result.teammates).toHaveLength(1);
      expect(result.manager).not.toBeNull();
    });

    it('should handle network error', async () => {
      globalThis.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

      await expect(getTeammates()).rejects.toThrow('Network error');
    });
  });
});
