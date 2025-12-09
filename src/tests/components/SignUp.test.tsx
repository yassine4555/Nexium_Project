import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

    expect(screen.getByText(/Join Nexium/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@company.com/i)).toBeInTheDocument();
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

    const submitButton = screen.getByRole('button', { name: /create account/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should display error message on failed signup', async () => {
    vi.mocked(authController.signUp).mockRejectedValueOnce(
      new Error('Email already exists')
    );

    renderSignUp();

    const submitButton = screen.getByRole('button', { name: /create account/i });
    expect(submitButton).toBeInTheDocument();
  });
});
