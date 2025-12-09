import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createActivity,
  getActivities,
  joinActivity,
} from '../../controllers/activitiesController';
import { GATEWAY_BASE_URL } from '../../lib/api';

describe('activitiesController', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('jwt_token', 'test-token');
    vi.resetAllMocks();
  });

  describe('createActivity', () => {
    it('should successfully create an activity', async () => {
      const activityData = {
        title: 'Team Building',
        description: 'Company team building event',
        type: 'team_building',
        date: '2025-12-15',
        location: 'Conference Room A',
        max_participants: 20,
      };

      const mockResponse = {
        activity: {
          id: 1,
          activity_id: 'act123',
          title: 'Team Building',
          description: 'Company team building event',
          type: 'team_building',
          creator: 'user@example.com',
          date: '2025-12-15',
          location: 'Conference Room A',
          max_participants: 20,
          employees_joined: [],
          status: 'active',
          created_at: '2025-12-09T00:00:00Z',
        },
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await createActivity(activityData);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${GATEWAY_BASE_URL}/activities`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          }),
        })
      );

      expect(result.title).toBe('Team Building');
      expect(result.type).toBe('team_building');
    });

    it('should handle create activity failure', async () => {
      const activityData = {
        title: 'Team Building',
        description: 'Event',
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid activity data' }),
      } as Response);

      await expect(createActivity(activityData)).rejects.toThrow('Invalid activity data');
    });
  });

  describe('getActivities', () => {
    it('should fetch all activities', async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            activity_id: 'act123',
            title: 'Team Building',
            description: 'Event',
            type: 'team_building',
            creator: 'user@example.com',
            employees_joined: [],
            created_at: '2025-12-09T00:00:00Z',
          },
          {
            id: 2,
            activity_id: 'act456',
            title: 'Training',
            description: 'Workshop',
            type: 'training',
            creator: 'admin@example.com',
            employees_joined: [],
            created_at: '2025-12-09T00:00:00Z',
          },
        ],
        count: 2,
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await getActivities();

      expect(result.activities).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should fetch activities with filters', async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            activity_id: 'act123',
            title: 'Team Building',
            type: 'team_building',
            creator: 'user@example.com',
            employees_joined: [],
            created_at: '2025-12-09T00:00:00Z',
          },
        ],
        count: 1,
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await getActivities({
        status: 'active',
        type: 'team_building',
        limit: 10,
      });

      const fetchCall = (globalThis.fetch as any).mock.calls[0][0];
      expect(fetchCall).toContain('status=active');
      expect(fetchCall).toContain('type=team_building');
      expect(fetchCall).toContain('limit=10');
      expect(result.activities).toHaveLength(1);
    });

    it('should handle fetch error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' }),
      } as Response);

      await expect(getActivities()).rejects.toThrow('Server error');
    });
  });

  describe('joinActivity', () => {
    it('should successfully join an activity', async () => {
      const mockResponse = {
        message: 'Successfully joined activity',
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await joinActivity(123);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${GATEWAY_BASE_URL}/activities/123/join`,
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should handle join activity failure', async () => {
      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Activity is full' }),
      } as Response);

      await expect(joinActivity(123)).rejects.toThrow('Activity is full');
    });
  });
});
