import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from './src/endUser/config/firebase';
import { db } from './src/endUser/config/firebase';

// Screens — in display order
import { Splash } from './src/endUser/navigation/Login/Splash';
import Register from './src/endUser/navigation/Login/Login';
import EmailVerification from './src/endUser/navigation/Login/EmailVerification';
import SignIn from './src/endUser/navigation/Login/Verification';
import { Property } from './src/endUser/navigation/main/home/property';
import { PropertyDetail } from './src/endUser/navigation/main/home/details/PropertyDetail';
import Setting from './src/endUser/navigation/main/setting/setting';
import Account from './src/endUser/navigation/main/account/account';
import { ConfirmBooking } from './src/endUser/navigation/main/home/booking/ConfirmBooking';
import { SearchDetails } from './src/endUser/navigation/main/home/searchProperty/searchProperty';
import Notifications from './src/endUser/navigation/main/setting/notification/notification';
import RecentlyViewed from './src/endUser/navigation/main/setting/recently/recentlyViewed';
import Help from './src/endUser/navigation/main/setting/help/help';
import About from './src/endUser/navigation/main/setting/about/about';
import Message from './src/endUser/navigation/main/message/Message';
import LandlordHome from './src/landlordDashboard/homeScreen/homeScreen';
import LandlordProperties from './src/landlordDashboard/propertyScreen/propertyScreen';
import AddProperty from './src/landlordDashboard/propertyScreen/addPropertyScreen';
import ReviewProperty from './src/landlordDashboard/propertyScreen/reviewPropertyScreen';
import LandlordMessages from './src/landlordDashboard/messageScreen/messageScreen';
import LandlordFinance from './src/landlordDashboard/financeScreen/financeScreen';
import LandlordAccount from './src/landlordDashboard/accountScreen/accountScreen';

type AppStackParamList = {
  Splash: undefined;
  Login: undefined;
  EmailVerification: undefined;
  SignIn: undefined;
  Home: undefined;
  LandlordHome: undefined;
  LandlordProperties: undefined;
  AddProperty: undefined;
  ReviewProperty: undefined;
  LandlordMessages: undefined;
  LandlordFinance: undefined;
  LandlordAccount: undefined;
  Settings: undefined;
  Account: undefined;
  PropertyDetail: undefined;
  ConfirmBooking: undefined;
  SearchDetails: undefined;
  Notifications: undefined;
  RecentlyViewed: undefined;
  Help: undefined;
  About: undefined;
  Messages: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [accountRole, setAccountRole] = useState<'tenant' | 'landlord' | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const profile = await getDoc(doc(db, 'users', firebaseUser.uid));
          const profileData = profile.data();
          const role = String(profileData?.role || '').toLowerCase();
          setAccountRole(role === 'landlord' || Boolean(profileData?.businessName) ? 'landlord' : 'tenant');
        } catch (error) {
          console.warn('Unable to load the account role from Firestore:', error);
          setAccountRole('tenant');
        }
      } else {
        setAccountRole(null);
      }
      setInitializing(false);
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
        // Logged-in users skip auth flow; new users open on the login form.
        initialRouteName={user && accountRole === 'landlord' ? 'LandlordHome' : user ? 'Home' : 'SignIn'}
      >
        {/* ── Auth Flow ──────────────────────────────────────────────────── */}
        {/* 1. Splash — available when explicitly opened */}
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
        <Stack.Screen name="LandlordHome" component={LandlordHome as React.ComponentType<any>} />
        <Stack.Screen name="LandlordProperties" component={LandlordProperties as React.ComponentType<any>} />
        <Stack.Screen name="AddProperty" component={AddProperty as React.ComponentType<any>} />
        <Stack.Screen name="ReviewProperty" component={ReviewProperty as React.ComponentType<any>} />
        <Stack.Screen name="LandlordMessages" component={LandlordMessages as React.ComponentType<any>} />
        <Stack.Screen name="LandlordFinance" component={LandlordFinance as React.ComponentType<any>} />
        <Stack.Screen name="LandlordAccount" component={LandlordAccount as React.ComponentType<any>} />

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
        {/* 15. Messages — landlord conversation screen */}
        <Stack.Screen name="Messages" component={Message as React.ComponentType<any>} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
