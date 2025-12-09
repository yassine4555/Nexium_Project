import type { User } from '../models/User';
import { GATEWAY_BASE_URL } from '../lib/api';

export const signUp = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  dateOfBirth: string,
  address: string,
  managercode?: string,
): Promise<User | null> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        Password: password,
        FirstName: firstname,
        LastName: lastname,
        DateOfBirth: dateOfBirth,
        Address: address,
        managercode,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Signup failed:', data);
      throw new Error(data.message || `Signup failed with status ${response.status}`);
    }

    // Store the JWT token and user info
    localStorage.setItem('jwt_token', data.AuthToken);
    localStorage.setItem('user_id', data.id);
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_firstname', data.firstname || firstname);
    localStorage.setItem('user_lastname', data.lastname || lastname);
    localStorage.setItem('user_role', data.role || 'user');

    return {
      id: data.id,
      email,
      firstname: data.firstname || firstname,
      lastname: data.lastname || lastname,
      dateOfBirth,
      address,
      role: data.role || 'user',
    };
  } catch (error) {
    console.error('Signup error:', error);
    throw error; // Re-throw to let the UI handle it
  }
};

export const signIn = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Login failed:', data);
      throw new Error(data.message || `Login failed with status ${response.status}`);
    }

    // Store the JWT token and user info
    localStorage.setItem('jwt_token', data.Token);
    localStorage.setItem('user_id', data.id);
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_firstname', data.firstname || '');
    localStorage.setItem('user_lastname', data.lastname || '');
    localStorage.setItem('user_role', data.role || 'user');

    return {
      id: data.id,
      email: data.email,
      firstname: data.firstname || '',
      lastname: data.lastname || '',
      dateOfBirth: '',
      address: '',
      role: data.role === 'EMPLOYER' ? 'admin' : 'user',
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error; // Re-throw to let the UI handle it
  }
};
