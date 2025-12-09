# Nexium Project - Testing Documentation

## Test Structure

This project includes comprehensive unit tests and integration tests using Vitest and React Testing Library.

### Directory Structure

```
src/tests/
├── setup.ts                          # Test setup and global mocks
├── unit/                             # Unit tests
│   ├── authController.test.ts        # Authentication controller tests
│   ├── teamController.test.ts        # Team management tests
│   ├── activitiesController.test.ts  # Activities controller tests
│   ├── meetingsController.test.ts    # Meetings controller tests
│   └── api.test.ts                   # API utilities tests
├── components/                       # Component tests
│   ├── App.test.tsx                  # App component tests
│   ├── SignIn.test.tsx               # SignIn page tests
│   ├── SignUp.test.tsx               # SignUp page tests
│   └── Header.test.tsx               # Header component tests
└── integration/                      # Integration tests
    ├── workflows.test.ts             # End-to-end workflow tests
    └── navigation.test.tsx           # Navigation integration tests
```

## Running Tests

### Run all tests once
```bash
npm test
```

### Run tests in watch mode (recommended during development)
```bash
npm run test:watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Coverage

The test suite covers:

### Unit Tests
- **Authentication Controller** (`authController.test.ts`)
  - User signup with validation
  - User login with credentials
  - Error handling for invalid credentials
  - Role mapping (EMPLOYER → admin)
  - LocalStorage management

- **Team Controller** (`teamController.test.ts`)
  - Fetching employee lists
  - Fetching teammates with/without manager
  - Handling empty team data
  - Error handling

- **Activities Controller** (`activitiesController.test.ts`)
  - Creating new activities
  - Fetching activities with filters
  - Joining activities
  - Error handling

- **Meetings Controller** (`meetingsController.test.ts`)
  - Creating meetings with/without passwords
  - Joining meetings
  - Invitation link generation
  - Error handling

- **API Utilities** (`api.test.ts`)
  - Authorization header generation
  - Token retrieval
  - Authentication status checking
  - Auth data cleanup

### Component Tests
- **SignIn Component** (`SignIn.test.tsx`)
  - Form rendering
  - Successful login flow
  - Error message display
  - Loading states
  - Form validation

- **SignUp Component** (`SignUp.test.tsx`)
  - Form rendering
  - Successful signup flow
  - Error handling
  - Required field validation

- **App Component** (`App.test.tsx`)
  - Basic rendering
  - Router setup

- **Header Component** (`Header.test.tsx`)
  - Rendering verification
  - Navigation links

### Integration Tests
- **Workflows** (`workflows.test.ts`)
  - Complete signup → login flow
  - Authentication error handling
  - Team management after authentication
  - Activity creation and retrieval
  - Full user journey tests

- **Navigation** (`navigation.test.tsx`)
  - SignIn to Dashboard navigation
  - Error display on failed login
  - Route transitions

## Writing New Tests

### Unit Test Example
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { myFunction } from '../path/to/module';

describe('myFunction', () => {
  beforeEach(() => {
    // Setup before each test
    vi.resetAllMocks();
  });

  it('should do something', () => {
    const result = myFunction();
    expect(result).toBe(expectedValue);
  });
});
```

### Component Test Example
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyComponent from '../MyComponent';

it('should render and interact', () => {
  render(
    <BrowserRouter>
      <MyComponent />
    </BrowserRouter>
  );
  
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

## Mocking

### localStorage Mock
Already configured in `setup.ts`:
```typescript
localStorage.setItem('key', 'value');
localStorage.getItem('key');
localStorage.clear();
```

### fetch Mock
```typescript
globalThis.fetch = vi.fn().mockResolvedValueOnce({
  ok: true,
  json: async () => ({ data: 'mock data' }),
} as Response);
```

### Module Mock
```typescript
vi.mock('../path/to/module', () => ({
  functionName: vi.fn(),
}));
```

## Best Practices

1. **Use `beforeEach`** to reset state between tests
2. **Mock external dependencies** (API calls, localStorage, etc.)
3. **Test user interactions** not implementation details
4. **Use descriptive test names** that explain what is being tested
5. **Keep tests focused** - one assertion per test when possible
6. **Use `waitFor`** for async operations
7. **Clean up after tests** to prevent test pollution

## Continuous Integration

To run tests in CI/CD:
```bash
npm test -- --run --reporter=verbose
```

## Troubleshooting

### Tests failing due to localStorage
Make sure `setup.ts` is properly configured in `vitest.config.ts`

### React component not rendering
Wrap components in `<BrowserRouter>` for tests that use routing

### Async tests timing out
Use `waitFor` from `@testing-library/react` for async operations

### Module not found errors
Check import paths are correct relative to test file location


dependencies : cd "c:\Users\yasso\Desktop\projet integration\Nexium_Project" ; npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui happy-dom