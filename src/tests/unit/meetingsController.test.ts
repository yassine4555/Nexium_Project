import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMeeting, joinMeeting } from '../../controllers/meetingsController';
import { GATEWAY_BASE_URL } from '../../lib/api';

describe('meetingsController', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('jwt_token', 'test-token');
    localStorage.setItem('user_id', 'user@example.com');
    vi.resetAllMocks();
  });

  describe('createMeeting', () => {
    it('should successfully create a meeting', async () => {
      const meetingData = {
        title: 'Sprint Planning',
        object: 'Planning Session',
        description: 'Q1 Sprint planning meeting',
        invitedEmployeesList: ['user1@example.com', 'user2@example.com'],
      };

      const mockResponse = {
        id: 1,
        meeting_id: 'meet123',
        title: 'Sprint Planning',
        object: 'Planning Session',
        description: 'Q1 Sprint planning meeting',
        invitation_link: 'https://meet.example.com/meet123',
        has_password: false,
        created_by: 'user@example.com',
        is_active: true,
        created_at: '2025-12-09T00:00:00Z',
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await createMeeting(meetingData);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${GATEWAY_BASE_URL}/create-meet`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          }),
        })
      );

      expect(result.meeting_id).toBe('meet123');
      expect(result.title).toBe('Sprint Planning');
      expect(result.invitation_link).toBe('https://meet.example.com/meet123');
    });

    it('should create meeting with password', async () => {
      const meetingData = {
        title: 'Private Meeting',
        password: 'secret123',
      };

      const mockResponse = {
        id: 1,
        meeting_id: 'meet456',
        title: 'Private Meeting',
        invitation_link: 'https://meet.example.com/meet456',
        has_password: true,
        created_by: 'user@example.com',
        is_active: true,
        created_at: '2025-12-09T00:00:00Z',
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await createMeeting(meetingData);

      expect(result.has_password).toBe(true);
    });

    it('should handle create meeting failure', async () => {
      const meetingData = {
        title: 'Meeting',
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid meeting data' }),
      } as Response);

      await expect(createMeeting(meetingData)).rejects.toThrow('Invalid meeting data');
    });
  });

  describe('joinMeeting', () => {
    it('should successfully join a meeting', async () => {
      const mockResponse = {
        redirectUrl: 'https://meet.example.com/join/meet123',
      };

      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await joinMeeting('meet123', 'user@example.com');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${GATEWAY_BASE_URL}/join-meet`,
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('meet123'),
        })
      );

      expect(result).toBe('https://meet.example.com/join/meet123');
    });

    it('should handle join meeting failure', async () => {
      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Meeting not found' }),
      } as Response);

      await expect(joinMeeting('meet999', 'user@example.com')).rejects.toThrow(
        'Meeting not found'
      );
    });
  });
});
