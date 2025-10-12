import { supabase } from '../lib/supabase';
import type { User } from '../models/User';

const VALID_SECRET_KEY = 'NEXIUM-2025'; // Or fetch from your backend if dynamic

export const signUp = async (
  name: string,
  email: string,
  password: string,
  secretKey: string
): Promise<User | null> => {
  // Step 1: Validate company key
  if (secretKey !== VALID_SECRET_KEY) {
    console.error('Invalid company secret key');
    return null;
  }

  // Step 2: Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }, // Store metadata
    },
  });

  if (error || !data.user) {
    console.error(error?.message || 'Signup failed');
    return null;
  }

  // Step 3: Return your user object shape
  return {
    id: data.user.id,
    email: data.user.email!,
    name,
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
    name: data.user.user_metadata.full_name || 'User',
    role: 'user',
  };
};
