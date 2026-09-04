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
import { Property } from './src/navigation/main/home/property';
import { PropertyDetail } from './src/navigation/main/home/details/PropertyDetail';
import Setting from './src/navigation/main/setting/setting';
import Account from './src/navigation/main/account/account';
import { ConfirmBooking } from './src/navigation/main/home/booking/ConfirmBooking';
import { SearchDetails } from './src/navigation/main/home/searchProperty/searchProperty';
import Notifications from './src/navigation/main/setting/notification/notification';
import RecentlyViewed from './src/navigation/main/setting/recently/recentlyViewed';
import Help from './src/navigation/main/setting/help/help';
import About from './src/navigation/main/setting/about/about';

type AppStackParamList = {
  Splash: undefined;
  Login: undefined;
  EmailVerification: undefined;
  SignIn: undefined;
  Home: undefined;
  Settings: undefined;
  Account: undefined;
  PropertyDetail: undefined;
  ConfirmBooking: undefined;
  SearchDetails: undefined;
  Notifications: undefined;
  RecentlyViewed: undefined;
  Help: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

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
        <Stack.Screen name="Splash" component={Splash as React.ComponentType<any>} />

        {/* 2. Login — Register / Create Account */}
        <Stack.Screen name="Login" component={Register as React.ComponentType<any>} />

        {/* 3. EmailVerification — shown after account creation */}
        <Stack.Screen
          name="EmailVerification"
          component={EmailVerification as React.ComponentType<any>}
        />

        {/* 4. SignIn — Sign In to Continue (shows "Registered Successfully!" popup) */}
        <Stack.Screen name="SignIn" component={SignIn as React.ComponentType<any>} />

        {/* ── App ─────────────────────────────────────────────────────────── */}
        {/* 5. Home — Property listing screen (post-login) */}
        <Stack.Screen name="Home" component={Property as React.ComponentType<any>} />

        {/* 6. Settings Screen */}
        <Stack.Screen name="Settings" component={Setting as React.ComponentType<any>} />

        {/* 7. Account Screen */}
        <Stack.Screen name="Account" component={Account as React.ComponentType<any>} />

        {/* 8. PropertyDetail — Property details screen */}
        <Stack.Screen
          name="PropertyDetail"
          component={PropertyDetail as React.ComponentType<any>}
        />

        {/* 9. ConfirmBooking — Booking confirmation screen */}
        <Stack.Screen
          name="ConfirmBooking"
          component={ConfirmBooking as React.ComponentType<any>}
        />
        {/* 10. SearchDetails — Search results screen */}
        <Stack.Screen name="SearchDetails" component={SearchDetails} />
        {/* 11. Notifications — Notification screen */}
        <Stack.Screen name="Notifications" component={Notifications} />
        {/* 12. RecentlyViewed — Recently viewed screen */}
        <Stack.Screen name="RecentlyViewed" component={RecentlyViewed} />
        {/* 13. Help — Help screen */}
        <Stack.Screen name="Help" component={Help} />
        {/* 14. About — About screen */}
        <Stack.Screen name="About" component={About} />
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
