/**
 * Firebase configuration — Expo / React Native compatible (Firebase v12+).
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
// @ts-ignore - Exported by @firebase/auth React Native bundle
import { getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyCFPSBrYg0WnwN85NGyRzHKktEHVJz6Ugc',
  authDomain: 'inzuhub-61ca8.firebaseapp.com',
  projectId: 'inzuhub-61ca8',
  storageBucket: 'inzuhub-61ca8.firebasestorage.app',
  messagingSenderId: '744106105206',
  appId: '1:744106105206:web:47cff618220a5e53840257',
  measurementId: 'G-6N6ZVKXP6X',
};

// Prevent re-initializing on Expo Fast Refresh hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase v12 Auth instance with AsyncStorage persistence for React Native
export const auth = (() => {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }

  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch {
    // Return existing instance if already initialized during Fast Refresh
    return getAuth(app);
  }
})();

export const db = getFirestore(app);

export default app;

