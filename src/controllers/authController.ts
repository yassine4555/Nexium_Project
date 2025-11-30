import { supabase } from '../lib/supabase';
import type { User } from '../models/User';

export const signUp = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  dateOfBirth: string,
  address: string,
): Promise<User | null> => {
 
  // Step 1: Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { 
        firstname,
        lastname,
        dateOfBirth,
        address,
        full_name: `${firstname} ${lastname}`
      }, // Store metadata
    },
  });

  if (error || !data.user) {
    console.error(error?.message || 'Signup failed');
    return null;
  }

  // Step 2: Return your user object shape
  return {
    id: data.user.id,
    email: data.user.email!,
    firstname,
    lastname,
    dateOfBirth,
    address,
    role: 'user',
  };
};

export const signIn = async (
  email: string,
  password: string
): Promise<User | null> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    console.error(error?.message || 'Login failed');
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email!,
    firstname: data.user.user_metadata.firstname || 'First',
    lastname: data.user.user_metadata.lastname || 'Last',
    dateOfBirth: data.user.user_metadata.dateOfBirth || '',
    address: data.user.user_metadata.address || '',
    role: 'user',
  };
};
