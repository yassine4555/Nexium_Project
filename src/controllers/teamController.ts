import { GATEWAY_BASE_URL, getAuthHeaders } from '../lib/api';

export interface Teammate {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  department: string | null;
  address?: string;
  date_of_birth?: string;
  employeesList?: any[];
}

export interface TeamInfo {
  employee: Teammate;
  manager: Teammate | null;
  teammates: Teammate[];
}

export const getMyEmployees = async (
  includeDetails: boolean = true
): Promise<{ employees: Teammate[]; manager: Teammate | null; employees_count: number }> => {
  try {
    const params = new URLSearchParams();
    params.append('include_details', includeDetails.toString());

    const response = await fetch(`${GATEWAY_BASE_URL}/my-employees?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to fetch employees: ${response.status}`);
    }

    console.log('My employees response:', data);

    return {
      employees: data.employees || [],
      manager: data.manager || null,
      employees_count: data.employees_count || 0,
    };
  } catch (error) {
    console.error('Get my employees error:', error);
    throw error;
  }
};

export const getTeammatesForDisplay = async (
  includeDetails: boolean = true,
  includeManager: boolean = true
): Promise<{ teammates: Teammate[]; manager: Teammate | null; teammates_count: number }> => {
  try {
    const params = new URLSearchParams();
    params.append('include_details', includeDetails.toString());
    params.append('include_manager', includeManager.toString());

    const response = await fetch(`${GATEWAY_BASE_URL}/teammates?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to fetch teammates: ${response.status}`);
    }

    console.log('Teammates response:', data);

    return {
      teammates: data.teammates || [],
      manager: data.manager || null,
      teammates_count: data.teammates_count || 0,
    };
  } catch (error) {
    console.error('Get teammates error:', error);
    throw error;
  }
};

export const getTeammates = async (
  includeDetails: boolean = true,
  includeManager: boolean = true
): Promise<{ teammates: Teammate[]; manager: Teammate | null; employee?: string; teammates_count?: number }> => {
  try {
    const params = new URLSearchParams();
    params.append('include_details', includeDetails.toString());
    params.append('include_manager', includeManager.toString());

    const response = await fetch(`${GATEWAY_BASE_URL}/teammates?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to fetch teammates: ${response.status}`);
    }

    return {
      teammates: data.teammates || [],
      manager: data.manager || null,
      employee: data.employee,
      teammates_count: data.teammates_count || 0,
    };
  } catch (error) {
    console.error('Get teammates error:', error);
    throw error;
  }
};

export const getTeam = async (): Promise<TeamInfo> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/team`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to fetch team: ${response.status}`);
    }

    return {
      employee: data.employee,
      manager: data.manager || null,
      teammates: data.teammates || [],
    };
  } catch (error) {
    console.error('Get team error:', error);
    throw error;
  }
};

export const getManagerCode = async (): Promise<{ code: string; expires_at?: string }> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/getCodeForManager`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to get manager code: ${response.status}`);
    }

    return {
      code: data.code,
      expires_at: data.expires_at,
    };
  } catch (error) {
    console.error('Get manager code error:', error);
    throw error;
  }
};

export const becomeManager = async (code: string): Promise<void> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/becamemanager`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to become manager: ${response.status}`);
    }
  } catch (error) {
    console.error('Become manager error:', error);
    throw error;
  }
};

export const generateBecomeManagerCode = async (): Promise<string> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/generateBecameManagerCode`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to generate manager code: ${response.status}`);
    }

    return data.code;
  } catch (error) {
    console.error('Generate manager code error:', error);
    throw error;
  }
};

export const getUserIdentity = async (): Promise<{ user_id: string; email: string }> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/user/identity`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to get user identity: ${response.status}`);
    }

    return {
      user_id: data.user_id,
      email: data.email,
    };
  } catch (error) {
    console.error('Get user identity error:', error);
    throw error;
  }
};
