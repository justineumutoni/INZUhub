import React from 'react';
import { render, fireEvent, waitFor, cleanup, act } from '@testing-library/react-native';
import EmailVerification from '../EmailVerification';
import { sendEmailVerification } from 'firebase/auth';

// Mock the app's firebase config module directly
jest.mock('../../../config/firebase', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-123',
      emailVerified: false,
      reload: jest.fn().mockResolvedValue(undefined),
    },
  },
  db: {},
}));

jest.mock('firebase/auth', () => ({
  sendEmailVerification: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn().mockResolvedValue({
    data: () => ({ role: 'renter' }),
  }),
  setDoc: jest.fn().mockResolvedValue(undefined),
}));

describe('EmailVerification Screen', () => {
  const mockNavigation: any = {
    replace: jest.fn(),
  };

  const mockRoute: any = {
    params: { email: 'user@inzuhub.com' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders title, descriptions, and user email', async () => {
    const { getByText } = await render(
      <EmailVerification navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Verify Your Email')).toBeTruthy();
    expect(getByText('user@inzuhub.com')).toBeTruthy();
    expect(getByText("I've Verified My Email")).toBeTruthy();
    expect(getByText('Go to Sign In')).toBeTruthy();
  });

  it('navigates to SignIn when "Go to Sign In" button is pressed', async () => {
    const { getByText } = await render(
      <EmailVerification navigation={mockNavigation} route={mockRoute} />
    );

    fireEvent.press(getByText('Go to Sign In'));

    expect(mockNavigation.replace).toHaveBeenCalledWith('SignIn', { registered: true });
  });

  it('triggers sendEmailVerification when "Resend Email" button is pressed', async () => {
    jest.useFakeTimers();

    const { getByText, findByText } = await render(
      <EmailVerification navigation={mockNavigation} route={mockRoute} />
    );

    fireEvent.press(getByText("Didn't receive it? Resend Email"));

    await waitFor(() => {
      expect(sendEmailVerification).toHaveBeenCalled();
    });

    expect(await findByText('Verification email resent!')).toBeTruthy();

    act(() => {
      jest.runAllTimers();
    });
    jest.useRealTimers();
  });
});
