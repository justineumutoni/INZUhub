import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './src/config/firebase';

// Screens — in display order
import { Splash } from './src/navigation/Login/Splash';
import Register from './src/navigation/Login/Login';
import EmailVerification from './src/navigation/Login/EmailVerification';
import SignIn from './src/navigation/Login/Verification';
import { Property } from './src/navigation/main/property';

import type { RootStackParamList } from './src/navigation/Login/Login';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);

  // Show a loading spinner while Firebase checks the saved session
  if (initializing) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#2956C2" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
        // Logged-in users skip auth flow and go straight to Home
        initialRouteName={user ? 'Home' : 'Splash'}
      >
        {/* ── Auth Flow ──────────────────────────────────────────────────── */}
        {/* 1. Splash — auto-advances to Login after 2.8s */}
        <Stack.Screen name="Splash" component={Splash} />

        {/* 2. Login — Register / Create Account */}
        <Stack.Screen name="Login" component={Register} />

        {/* 3. EmailVerification — shown after account creation */}
        <Stack.Screen name="EmailVerification" component={EmailVerification} />

        {/* 4. SignIn — Sign In to Continue (shows "Registered Successfully!" popup) */}
        <Stack.Screen name="SignIn" component={SignIn} />

        {/* ── App ─────────────────────────────────────────────────────────── */}
        {/* 5. Home — Property listing screen (post-login) */}
        <Stack.Screen name="Home" component={Property} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
