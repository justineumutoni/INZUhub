/**
 * Firebase configuration — Expo / React Native compatible (Firebase v12+).
 *
 * Firebase v11+ removed getReactNativePersistence. The new modular SDK
 * automatically detects React Native and uses the correct persistence strategy.
 * We simply call getAuth() — no extra setup needed.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

// Firebase v12 auto-handles React Native persistence — getAuth() is all you need
export const auth = getAuth(app);

// Firestore database instance
export const db = getFirestore(app);

export default app;
