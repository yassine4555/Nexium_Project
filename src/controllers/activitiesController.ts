import { GATEWAY_BASE_URL, getAuthHeaders } from '../lib/api';

export interface Activity {
  id: number;
  activity_id: string;
  title: string;
  description?: string;
  type?: string;
  creator: string;
  date?: string;
  location?: string;
  max_participants?: number;
  employees_joined: string[];
  status?: string;
  created_at: string;
  updated_at?: string;
  role?: 'creator' | 'participant';
  // Legacy fields for compatibility
  activity_type?: string;
  scheduled_date?: string;
  participants?: string[];
  participant_count?: number;
}

export interface CreateActivityData {
  title: string;
  description?: string;
  type?: string;
  activity_type?: string;
  date?: string;
  scheduled_date?: string;
  status?: string;
  location?: string;
  max_participants?: number;
}

export const createActivity = async (activityData: CreateActivityData): Promise<Activity> => {
  try {
    console.log('Creating activity with data:', activityData);
    
    const response = await fetch(`${GATEWAY_BASE_URL}/activities`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(activityData),
    });

    const data = await response.json();
    console.log('Create activity response:', { status: response.status, data });

    if (!response.ok) {
      console.error('Create activity failed:', data);
      throw new Error(data.error || data.message || `Failed to create activity: ${response.status}`);
    }

    return data.activity || data;
  } catch (error) {
    console.error('Create activity error:', error);
    throw error;
  }
};

export const getActivities = async (filters?: {
  status?: string;
  type?: string;
  activity_type?: string;
  creator?: string;
  limit?: number;
  offset?: number;
}): Promise<{ activities: Activity[]; total: number }> => {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.activity_type) params.append('activity_type', filters.activity_type);
    if (filters?.creator) params.append('creator', filters.creator);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const url = `${GATEWAY_BASE_URL}/activities${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || `Failed to fetch activities: ${response.status}`);
    }

    console.log('Activities response:', responseData);

    return {
      activities: responseData.data || [],
      total: responseData.count || 0,
    };
  } catch (error) {
    console.error('Get activities error:', error);
    throw error;
  }
};

export const getActivity = async (activityId: number): Promise<Activity> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/activities/${activityId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to fetch activity: ${response.status}`);
    }

    return data.activity;
  } catch (error) {
    console.error('Get activity error:', error);
    throw error;
  }
};

export const updateActivity = async (
  activityId: number,
  updates: Partial<CreateActivityData>
): Promise<Activity> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/activities/${activityId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to update activity: ${response.status}`);
    }

    return data.activity;
  } catch (error) {
    console.error('Update activity error:', error);
    throw error;
  }
};

export const deleteActivity = async (activityId: number): Promise<void> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/activities/${activityId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || `Failed to delete activity: ${response.status}`);
    }
  } catch (error) {
    console.error('Delete activity error:', error);
    throw error;
  }
};

export const joinActivity = async (activityId: number): Promise<void> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/activities/${activityId}/join`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to join activity: ${response.status}`);
    }
  } catch (error) {
    console.error('Join activity error:', error);
    throw error;
  }
};

export const leaveActivity = async (activityId: number): Promise<void> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/activities/${activityId}/leave`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to leave activity: ${response.status}`);
    }
  } catch (error) {
    console.error('Leave activity error:', error);
    throw error;
  }
};

export const addParticipants = async (
  activityId: number,
  emails: string[]
): Promise<void> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/activities/${activityId}/participants`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ emails }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to add participants: ${response.status}`);
    }
  } catch (error) {
    console.error('Add participants error:', error);
    throw error;
  }
};

export const getActivityParticipants = async (activityId: number): Promise<any[]> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/activities/${activityId}/participants`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to fetch participants: ${response.status}`);
    }

    return data.participants || [];
  } catch (error) {
    console.error('Get participants error:', error);
    throw error;
  }
};

export const removeParticipant = async (
  activityId: number,
  participantEmail: string
): Promise<void> => {
  try {
    const encodedEmail = encodeURIComponent(participantEmail);
    const response = await fetch(
      `${GATEWAY_BASE_URL}/activities/${activityId}/participants/${encodedEmail}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || `Failed to remove participant: ${response.status}`);
    }
  } catch (error) {
    console.error('Remove participant error:', error);
    throw error;
  }
};

export const getMyActivities = async (
  filter: 'all' | 'created' | 'joined' | 'upcoming' = 'all'
): Promise<Activity[]> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/my-activities?filter=${filter}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || `Failed to fetch my activities: ${response.status}`);
    }

    console.log('My activities response:', responseData);

    // Handle both response formats: {activities: [...]} and {data: [...]}
    return responseData.data || responseData.activities || [];
  } catch (error) {
    console.error('Get my activities error:', error);
    throw error;
  }
};
