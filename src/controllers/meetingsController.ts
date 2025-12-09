import { GATEWAY_BASE_URL, getAuthHeaders } from '../lib/api';

export interface Meeting {
  id: number;
  meeting_id: string;
  title: string;
  object?: string;
  description?: string;
  invitation_link: string;
  has_password: boolean;
  created_by: string;
  is_active: boolean;
  created_at: string;
}

export interface CreateMeetingData {
  title: string;
  object?: string;
  description?: string;
  invitedEmployeesList?: string[];
  password?: string;
  created_by?: string;
}

export const createMeeting = async (meetingData: CreateMeetingData): Promise<Meeting> => {
  try {
    const userEmail = localStorage.getItem('user_id') || '';
    const dataToSend = {
      ...meetingData,
      created_by: meetingData.created_by || userEmail,
    };
    
    const response = await fetch(`${GATEWAY_BASE_URL}/create-meet`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(dataToSend),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to create meeting: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Create meeting error:', error);
    throw error;
  }
};

export const joinMeeting = async (meetingId: string, userEmail: string): Promise<string> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/join-meet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        meeting_id: meetingId,
        user_email: userEmail,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to join meeting: ${response.status}`);
    }

    return data.redirectUrl;
  } catch (error) {
    console.error('Join meeting error:', error);
    throw error;
  }
};

export interface JoinMeetingResponse {
  success: boolean;
  redirectUrl: string;
}

export const joinMeetingWithPassword = async (meetingId: string, password: string): Promise<JoinMeetingResponse> => {
  try {
    const token = localStorage.getItem('jwt_token');
    
    console.log('=== API REQUEST DEBUG ===');
    console.log('URL:', `${GATEWAY_BASE_URL}/join-meet`);
    console.log('Token exists:', !!token);
    console.log('Request body:', { meet_id: meetingId, password: password ? '[REDACTED]' : 'empty' });
    
    const response = await fetch(`${GATEWAY_BASE_URL}/join-meet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({
        meet_id: meetingId,
        password: password,
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const data = await response.json();
    console.log('Response data:', data);
    console.log('Data type:', typeof data);
    console.log('Data keys:', Object.keys(data));

    if (!response.ok) {
      console.error('Response not ok, throwing error');
      throw new Error(data.error || data.message || `Failed to join meeting: ${response.status}`);
    }

    console.log('Returning data:', data);
    return data;
  } catch (error) {
    console.error('=== API ERROR ===');
    console.error('Join meeting with password error:', error);
    throw error;
  }
};

export const getMeetings = async (filters?: {
  user_email?: string;
  is_active?: boolean;
}): Promise<Meeting[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.user_email) params.append('user_email', filters.user_email);
    if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());

    const url = `${GATEWAY_BASE_URL}/meetings${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to fetch meetings: ${response.status}`);
    }

    return data.data || [];
  } catch (error) {
    console.error('Get meetings error:', error);
    throw error;
  }
};

export const getMeeting = async (meetingId: string): Promise<Meeting> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/meetings/${meetingId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to fetch meeting: ${response.status}`);
    }

    return data.meeting;
  } catch (error) {
    console.error('Get meeting error:', error);
    throw error;
  }
};

export const updateMeeting = async (
  meetingId: string,
  updates: { title?: string; description?: string }
): Promise<Meeting> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/meetings/${meetingId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to update meeting: ${response.status}`);
    }

    return data.meeting;
  } catch (error) {
    console.error('Update meeting error:', error);
    throw error;
  }
};

export const deleteMeeting = async (meetingId: string): Promise<{ success: boolean; message: string; meeting_id: string }> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/meetings/${meetingId}/delete`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to delete meeting: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Delete meeting error:', error);
    throw error;
  }
};

export const hardDeleteMeeting = async (meetingId: string): Promise<{ success: boolean; message: string; meeting_id: string }> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/meetings/${meetingId}/hard-delete`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ confirm: true }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to permanently delete meeting: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Hard delete meeting error:', error);
    throw error;
  }
};

export interface MyMeetingsResponse {
  success: boolean;
  user: string;
  filter: string;
  data: Meeting[];
  statistics: {
    created: number;
    invited: number;
    total: number;
  };
}

export const getMyMeetings = async (filters?: {
  filter?: 'all' | 'created' | 'invited';
  is_active?: boolean;
  include_details?: boolean;
}): Promise<MyMeetingsResponse> => {
  try {
    const userEmail = localStorage.getItem('user_id') || '';
    if (!userEmail) {
      throw new Error('User email not found in localStorage');
    }

    const params = new URLSearchParams();
    if (filters?.filter) params.append('filter', filters.filter);
    if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
    if (filters?.include_details !== undefined) params.append('include_details', filters.include_details.toString());

    const url = `${GATEWAY_BASE_URL}/meetings/user${params.toString() ? '?' + params.toString() : ''}`;

    console.log('=== FETCH MEETINGS DEBUG ===');
    console.log('User email:', userEmail);
    console.log('Request URL:', url);
    console.log('Filters:', filters);

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);
    console.log('Meetings array (data):', data.data);
    console.log('Meetings count:', data.data?.length);
    console.log('Statistics:', data.statistics);

    if (!response.ok) {
      console.error('Response not ok, throwing error');
      throw new Error(data.error || `Failed to fetch user meetings: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Get my meetings error:', error);
    throw error;
  }
};

export interface UpcomingMeetingsResponse {
  success: boolean;
  email: string;
  upcoming_meetings: Meeting[];
  total_count: number;
}

export const getMyUpcomingMeetings = async (): Promise<UpcomingMeetingsResponse> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/meetings/my/upcoming`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to fetch upcoming meetings: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Get my upcoming meetings error:', error);
    throw error;
  }
};

export const startMeeting = async (meetingId: string): Promise<void> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/meetings/${meetingId}/start`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to start meeting: ${response.status}`);
    }
  } catch (error) {
    console.error('Start meeting error:', error);
    throw error;
  }
};

export const endMeeting = async (meetingId: string): Promise<void> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/meetings/${meetingId}/end`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to end meeting: ${response.status}`);
    }
  } catch (error) {
    console.error('End meeting error:', error);
    throw error;
  }
};

export const addMeetingLog = async (
  meetingId: string,
  logData: { action: string; user_email: string; details?: string }
): Promise<void> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/meetings/${meetingId}/log`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(logData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to add meeting log: ${response.status}`);
    }
  } catch (error) {
    console.error('Add meeting log error:', error);
    throw error;
  }
};

export const getMeetingLogs = async (
  meetingId: string,
  download: boolean = false
): Promise<any[]> => {
  try {
    const url = `${GATEWAY_BASE_URL}/meetings/${meetingId}/log${download ? '?download=true' : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to fetch meeting logs: ${response.status}`);
    }

    return data.logs || [];
  } catch (error) {
    console.error('Get meeting logs error:', error);
    throw error;
  }
};
