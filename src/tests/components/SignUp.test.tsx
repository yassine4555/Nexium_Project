import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from '../../pages/SignUp';
import * as authController from '../../controllers/authController';

// Mock the auth controller
vi.mock('../../controllers/authController', () => ({
  signUp: vi.fn(),
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

describe('SignUp Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderSignUp = () => {
    return render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
  };

  it('should render sign up form', () => {
    renderSignUp();

    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/john@example.com/i)).toBeInTheDocument();
  });

  it('should handle successful signup', async () => {
    const mockUser = {
      id: 'user123',
      email: 'newuser@example.com',
      firstname: 'New',
      lastname: 'User',
      dateOfBirth: '1990-01-01',
      address: '123 Main St',
      role: 'user' as const,
    };

    vi.mocked(authController.signUp).mockResolvedValueOnce(mockUser);

    renderSignUp();

    // Find and fill all required fields
    const firstnameInput = screen.getByPlaceholderText(/John/i);
    const lastnameInput = screen.getByPlaceholderText(/Doe/i);
    const emailInput = screen.getByPlaceholderText(/john@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/At least 8 characters/i);
    const dateInput = screen.getByLabelText(/Date of Birth/i);
    const addressInput = screen.getByPlaceholderText(/123 Main Street/i);

    fireEvent.change(firstnameInput, { target: { value: 'New' } });
    fireEvent.change(lastnameInput, { target: { value: 'User' } });
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(dateInput, { target: { value: '1990-01-01' } });
    fireEvent.change(addressInput, { target: { value: '123 Main St' } });

    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authController.signUp).toHaveBeenCalledWith(
        'New',
        'User',
        'newuser@example.com',
        'password123',
        '1990-01-01',
        '123 Main St',
        undefined
      );
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('should display error message on failed signup', async () => {
    vi.mocked(authController.signUp).mockRejectedValueOnce(
      new Error('Email already exists')
    );

    renderSignUp();

    const firstnameInput = screen.getByPlaceholderText(/John/i);
    const lastnameInput = screen.getByPlaceholderText(/Doe/i);
    const emailInput = screen.getByPlaceholderText(/john@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/At least 8 characters/i);
    const dateInput = screen.getByLabelText(/Date of Birth/i);
    const addressInput = screen.getByPlaceholderText(/123 Main Street/i);

    fireEvent.change(firstnameInput, { target: { value: 'Test' } });
    fireEvent.change(lastnameInput, { target: { value: 'User' } });
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(dateInput, { target: { value: '1990-01-01' } });
    fireEvent.change(addressInput, { target: { value: '123 Main St' } });

    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
    });
  });
});
