export const GATEWAY_BASE_URL = 'https://192.168.0.95:7050';

export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('jwt_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('jwt_token');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('jwt_token');
};

export const clearAuthData = (): void => {
  // Clear all authentication related data
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_firstname');
  localStorage.removeItem('user_lastname');
  localStorage.removeItem('user_role');
  localStorage.removeItem('token_expires_at');
  localStorage.removeItem('authToken');
  
  // Clear any session storage
  sessionStorage.clear();
};
