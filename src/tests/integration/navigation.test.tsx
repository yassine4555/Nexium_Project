import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from '../../pages/SignIn';
import Dashboard from '../../pages/Dashboard';
import * as authController from '../../controllers/authController';

// Mock the auth controller
vi.mock('../../controllers/authController');
vi.mock('../../controllers/teamController');
vi.mock('../../controllers/activitiesController');
vi.mock('../../controllers/meetingsController');

describe('UI Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should navigate from SignIn to Dashboard on successful login', async () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      firstname: 'Test',
      lastname: 'User',
      dateOfBirth: '',
      address: '',
      role: 'user' as const,
    };

    vi.mocked(authController.signIn).mockResolvedValueOnce(mockUser);

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    );

    // Fill in login form
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    // Wait for navigation
    await waitFor(() => {
      expect(authController.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should display error on failed login attempt', async () => {
    vi.mocked(authController.signIn).mockRejectedValueOnce(
      new Error('Invalid credentials')
    );

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});
