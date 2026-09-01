/**
 * Firebase configuration — Expo / React Native compatible (Firebase v12+).
 *
 * Firebase v12+ uses the new modular SDK, which automatically detects React Native
 * and applies the correct persistence strategy when using getAuth().
 */
import { initializeApp } from 'firebase/app';
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

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Firebase Auth instance. React Native persistence is handled automatically by the SDK.
export const auth = getAuth(app);

// Firestore database instance
export const db = getFirestore(app);

export default app;
