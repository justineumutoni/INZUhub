import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Footer } from '../footer';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('Footer Navigation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all tab titles', async () => {
    await render(<Footer activeTab="Home" />);

    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Search')).toBeTruthy();
    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByText('Message')).toBeTruthy();
    expect(screen.getByText('Account')).toBeTruthy();
  });

  it('calls onTabPress callback when a tab is clicked', async () => {
    const handleTabPress = jest.fn();
    await render(<Footer activeTab="Home" onTabPress={handleTabPress} />);

    fireEvent.press(screen.getByText('Message'));

    expect(handleTabPress).toHaveBeenCalledWith('Message');
  });

  it('navigates to the corresponding route when onTabPress is not provided', async () => {
    await render(<Footer activeTab="Home" />);

    fireEvent.press(screen.getByText('Search'));

    expect(mockNavigate).toHaveBeenCalledWith('SearchDetails');
  });
});
