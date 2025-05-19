import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../Navigation';
import '@testing-library/jest-dom';

describe('Navigation Component', () => {
  const renderNavigation = () => {
    return render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
  };

  it('renders navigation component', () => {
    renderNavigation();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('contains all navigation links', () => {
    renderNavigation();
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
  });
}); 