import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignIn from '../../pages/SignIn';
import * as authController from '../../controllers/authController';

// Mock the auth controller
vi.mock('../../controllers/authController', () => ({
  signIn: vi.fn(),
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SignIn Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderSignIn = () => {
    return render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );
  };

  it('should render sign in form', () => {
    renderSignIn();

    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
  });

  it('should handle successful login', async () => {
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

    renderSignIn();

    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authController.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('should display error message on failed login', async () => {
    vi.mocked(authController.signIn).mockRejectedValueOnce(
      new Error('Invalid credentials')
    );

    renderSignIn();

    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('should disable submit button while loading', async () => {
    vi.mocked(authController.signIn).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    renderSignIn();

    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
  });

  it('should require email and password fields', () => {
    renderSignIn();

    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });
});
