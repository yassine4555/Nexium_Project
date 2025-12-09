import { GATEWAY_BASE_URL, getAuthHeaders } from '../lib/api';

export interface ManagerCode {
  code: string;
  expires_at: string;
  manager_email: string;
}

export interface BecomeManagerResponse {
  success: boolean;
  message: string;
  new_role: string;
  user_email: string;
}

export const generateManagerCode = async (): Promise<ManagerCode> => {
  try {
    console.log('Generating manager invitation code...');
    
    const response = await fetch(`${GATEWAY_BASE_URL}/getCodeForManager`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    console.log('Generate manager code response:', { status: response.status, data });

    if (!response.ok) {
      throw new Error(data.error || data.Text || `Failed to generate code: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Generate manager code error:', error);
    throw error;
  }
};

export const becomeManager = async (code: string): Promise<BecomeManagerResponse> => {
  try {
    console.log('Using manager code:', code);
    
    const response = await fetch(`${GATEWAY_BASE_URL}/becamemanager`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    console.log('Become manager response:', { status: response.status, data });

    if (!response.ok) {
      throw new Error(data.error || `Failed to become manager: ${response.status}`);
    }

    // Update user role in localStorage
    if (data.new_role) {
      localStorage.setItem('user_role', data.new_role);
    }

    return data;
  } catch (error) {
    console.error('Become manager error:', error);
    throw error;
  }
};
