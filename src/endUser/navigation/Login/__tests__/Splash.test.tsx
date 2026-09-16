import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import Splash from '../Splash';

describe('Splash Screen', () => {
  const mockNavigation: any = {
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders brand texts and subtitle correctly', async () => {
    await render(<Splash navigation={mockNavigation} />);

    expect(screen.getByText('The simple path to owning your future.')).toBeTruthy();
    expect(screen.getByText('Find your perfect space')).toBeTruthy();
  });

  it('navigates to SignIn screen after 5 seconds', async () => {
    await render(<Splash navigation={mockNavigation} />);

    expect(mockNavigation.replace).not.toHaveBeenCalled();

    // Advance fake timers past the 5-second splash timeout
    await act(async () => {
      jest.advanceTimersByTime(5500);
    });

    // Verify navigation was triggered
    expect(mockNavigation.replace).toHaveBeenCalledWith('SignIn');
  });
});
