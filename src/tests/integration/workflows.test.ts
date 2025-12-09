import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signUp, signIn } from '../../controllers/authController';
import { getMyEmployees } from '../../controllers/teamController';
import { createActivity, getActivities } from '../../controllers/activitiesController';

describe('Authentication Flow Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });

  it('should complete full signup and login flow', async () => {
    // Step 1: Sign up a new user
    const signUpResponse = {
      id: 'user123',
      AuthToken: 'signup-token',
      firstname: 'John',
      lastname: 'Doe',
      role: 'user',
    };

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => signUpResponse,
    } as Response);

    const newUser = await signUp(
      'John',
      'Doe',
      'john@example.com',
      'password123',
      '1990-01-01',
      '123 Main St'
    );

    expect(newUser).toBeTruthy();
    expect(localStorage.getItem('jwt_token')).toBe('signup-token');
    expect(localStorage.getItem('user_id')).toBe('user123');

    // Clear auth for login test
    localStorage.clear();

    // Step 2: Sign in with the same user
    const signInResponse = {
      id: 'user123',
      Token: 'login-token',
      email: 'john@example.com',
      firstname: 'John',
      lastname: 'Doe',
      role: 'user',
    };

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => signInResponse,
    } as Response);

    const loggedInUser = await signIn('john@example.com', 'password123');

    expect(loggedInUser).toBeTruthy();
    expect(localStorage.getItem('jwt_token')).toBe('login-token');
    expect(loggedInUser?.email).toBe('john@example.com');
  });

  it('should handle authentication errors gracefully', async () => {
    // Test invalid credentials
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Invalid credentials' }),
    } as Response);

    await expect(signIn('wrong@example.com', 'wrongpassword')).rejects.toThrow(
      'Invalid credentials'
    );

    // Ensure no token is stored on failed login
    expect(localStorage.getItem('jwt_token')).toBeNull();
  });
});

describe('Team Management Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('jwt_token', 'test-token');
    localStorage.setItem('user_id', 'manager123');
    vi.resetAllMocks();
  });

  it('should fetch team data after authentication', async () => {
    // Step 1: User is authenticated
    expect(localStorage.getItem('jwt_token')).toBeTruthy();

    // Step 2: Fetch employees
    const employeesResponse = {
      employees: [
        {
          id: 'emp1',
          email: 'emp1@example.com',
          first_name: 'Employee',
          last_name: 'One',
          role: 'developer',
          department: 'Engineering',
        },
        {
          id: 'emp2',
          email: 'emp2@example.com',
          first_name: 'Employee',
          last_name: 'Two',
          role: 'designer',
          department: 'Design',
        },
      ],
      manager: {
        id: 'manager123',
        email: 'manager@example.com',
        first_name: 'Manager',
        last_name: 'User',
        role: 'manager',
        department: 'Management',
      },
      employees_count: 2,
    };

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => employeesResponse,
    } as Response);

    const teamData = await getMyEmployees(true);

    expect(teamData.employees).toHaveLength(2);
    expect(teamData.manager).toBeTruthy();
    expect(teamData.employees_count).toBe(2);

    // Verify the request included auth token
    const fetchCall = (globalThis.fetch as any).mock.calls[0];
    expect(fetchCall[1].headers.Authorization).toBe('Bearer test-token');
  });
});

describe('Activity Management Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('jwt_token', 'test-token');
    localStorage.setItem('user_id', 'user@example.com');
    vi.resetAllMocks();
  });

  it('should create and fetch activities in sequence', async () => {
    // Step 1: Create a new activity
    const createResponse = {
      activity: {
        id: 1,
        activity_id: 'act123',
        title: 'Team Building',
        description: 'Company event',
        type: 'team_building',
        creator: 'user@example.com',
        employees_joined: [],
        status: 'active',
        created_at: '2025-12-09T00:00:00Z',
      },
    };

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => createResponse,
    } as Response);

    const newActivity = await createActivity({
      title: 'Team Building',
      description: 'Company event',
      type: 'team_building',
    });

    expect(newActivity.title).toBe('Team Building');
    expect(newActivity.activity_id).toBe('act123');

    // Step 2: Fetch all activities (should include the new one)
    const fetchResponse = {
      data: [
        {
          id: 1,
          activity_id: 'act123',
          title: 'Team Building',
          description: 'Company event',
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
      json: async () => fetchResponse,
      } as Response);

    const activities = await getActivities();

    expect(activities.activities).toHaveLength(1);
    expect(activities.activities[0].activity_id).toBe('act123');
    expect(activities.total).toBe(1);
  });

  it('should handle activity creation failure and not show in list', async () => {
    // Attempt to create activity with invalid data
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Invalid activity data' }),
    } as Response);

    await expect(
      createActivity({ title: '', description: '' })
    ).rejects.toThrow('Invalid activity data');

    // Fetch activities - should be empty or not include failed creation
    const fetchResponse = {
      data: [],
      count: 0,
    };

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => fetchResponse,
    } as Response);

    const activities = await getActivities();
    expect(activities.activities).toHaveLength(0);
  });
});

describe('Full Application Flow Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });

  it('should complete full user journey: signup -> login -> create activity -> view activities', async () => {
    // Step 1: User signs up
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 'user123',
        AuthToken: 'token123',
        firstname: 'Test',
        lastname: 'User',
        role: 'user',
      }),
    } as Response);

    await signUp('Test', 'User', 'test@example.com', 'pass123', '1990-01-01', '123 St');
    
    expect(localStorage.getItem('jwt_token')).toBe('token123');

    // Step 2: User creates an activity
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        activity: {
          id: 1,
          activity_id: 'act123',
          title: 'My Activity',
          creator: 'test@example.com',
          employees_joined: [],
          created_at: '2025-12-09T00:00:00Z',
        },
      }),
    } as Response);

    const activity = await createActivity({ title: 'My Activity' });
    expect(activity.title).toBe('My Activity');

    // Step 3: User views their activities
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          {
            id: 1,
            activity_id: 'act123',
            title: 'My Activity',
            creator: 'test@example.com',
            employees_joined: [],
            created_at: '2025-12-09T00:00:00Z',
          },
        ],
        count: 1,
      }),
    } as Response);

    const activities = await getActivities();
    expect(activities.activities).toHaveLength(1);
    expect(activities.activities[0].title).toBe('My Activity');
  });
});
