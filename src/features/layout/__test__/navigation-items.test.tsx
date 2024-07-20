import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import NavigationItems from '../navigation-items/navigation-items';

describe('NavigationItems', () => {
  const mockProps = {
    todo: vi.fn(),
    logout: vi.fn(),
    signin: vi.fn(),
    localDB: false,
    branch: false,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    const { container } = render(<NavigationItems {...mockProps} />);
    expect(container.querySelector('ul')).toBeTruthy();
  });

  it('renders the Delete button when branch is true', () => {
    render(<NavigationItems {...mockProps} branch={true} />);
    expect(screen.getByText('Delete')).toBeTruthy();
  });

  it('does not render the Delete button when branch is false', () => {
    render(<NavigationItems {...mockProps} branch={false} />);
    expect(screen.queryByText('Delete')).toBeNull();
  });

  it('renders "Sign in" button when localDB is true', () => {
    render(<NavigationItems {...mockProps} localDB={true} />);
    expect(screen.getByText('Sign in')).toBeTruthy();
  });

  it('renders "Log out" button when localDB is false', () => {
    render(<NavigationItems {...mockProps} localDB={false} />);
    expect(screen.getByText('Log out')).toBeTruthy();
  });

  it('calls todo function when Delete button is clicked', () => {
    render(<NavigationItems {...mockProps} branch={true} />);
    screen.getByText('Delete').click();
    expect(mockProps.todo).toHaveBeenCalledTimes(1);
  });

  it('calls signin function when Sign in button is clicked', () => {
    render(<NavigationItems {...mockProps} localDB={true} />);
    screen.getByText('Sign in').click();
    expect(mockProps.signin).toHaveBeenCalledTimes(1);
  });

  it('calls logout function when Log out button is clicked', () => {
    render(<NavigationItems {...mockProps} localDB={false} />);
    screen.getByText('Log out').click();
    expect(mockProps.logout).toHaveBeenCalledTimes(1);
  });
});
