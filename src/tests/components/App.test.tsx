import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';

describe('App Component', () => {
  it('should render without crashing', () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });

  it('should render router', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
});
