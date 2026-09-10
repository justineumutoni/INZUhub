import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ── PREVIEW: Landlord Screens ───────────────────────────────────────────────
import LandlordHomepage from './src/navigation/main/landlord/Homepage';
import PropertiesList from './src/navigation/main/landlord/Propertypage';
import CreateProperty from './src/navigation/main/landlord/CreateProperty';
import LandlordMessages from './src/navigation/main/landlord/Messages';
import LandlordFinance from './src/navigation/main/landlord/Finance';
import LandlordAccount from './src/navigation/main/landlord/Account';
import { LandlordStackParamList } from './src/navigation/main/landlord/landlordTypes';

// Commented out while previewing Landlord Screens
// import { onAuthStateChanged, User } from 'firebase/auth';
// import { auth } from './src/config/firebase';
// import { Splash } from './src/navigation/Login/Splash';
// import Register from './src/navigation/Login/Login';
// import EmailVerification from './src/navigation/Login/EmailVerification';
// import SignIn from './src/navigation/Login/Verification';
// import { Property } from './src/navigation/main/home/property';
// import { PropertyDetail } from './src/navigation/main/home/details/PropertyDetail';
// import Setting from './src/navigation/main/setting/setting';
// import Account from './src/navigation/main/account/account';
// import { ConfirmBooking } from './src/navigation/main/home/booking/ConfirmBooking';
// import { SearchDetails } from './src/navigation/main/home/searchProperty/searchProperty';
// import Notifications from './src/navigation/main/setting/notification/notification';
// import RecentlyViewed from './src/navigation/main/setting/recently/recentlyViewed';
// import Help from './src/navigation/main/setting/help/help';
// import About from './src/navigation/main/setting/about/about';
// import Message from './src/navigation/main/message/Message';

const Stack = createNativeStackNavigator<LandlordStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
        initialRouteName="LandlordHome"
      >
        {/* ── PREVIEW: Landlord Screens ─────────────────────────────── */}
        <Stack.Screen
          name="LandlordHome"
          component={LandlordHomepage as React.ComponentType<any>}
        />
        <Stack.Screen
          name="LandlordProperties"
          component={PropertiesList as React.ComponentType<any>}
        />
        <Stack.Screen
          name="CreateProperty"
          component={CreateProperty as React.ComponentType<any>}
        />
        <Stack.Screen
          name="LandlordMessages"
          component={LandlordMessages as React.ComponentType<any>}
        />
        <Stack.Screen
          name="LandlordFinance"
          component={LandlordFinance as React.ComponentType<any>}
        />
        <Stack.Screen
          name="LandlordAccount"
          component={LandlordAccount as React.ComponentType<any>}
        />

        {/*
          ── All other screens commented out for preview ─────────────────
          Restore by:
          1. Uncommenting all imports at the top of this file
          2. Replacing this block with the original Stack.Screen list
          3. Restoring the original AppStackParamList type
          4. Restoring the Firebase auth useEffect and initializing logic

          <Stack.Screen name="Splash" component={Splash as React.ComponentType<any>} />
          <Stack.Screen name="Login" component={Register as React.ComponentType<any>} />
          <Stack.Screen name="EmailVerification" component={EmailVerification as React.ComponentType<any>} />
          <Stack.Screen name="SignIn" component={SignIn as React.ComponentType<any>} />
          <Stack.Screen name="Home" component={Property as React.ComponentType<any>} />
          <Stack.Screen name="Settings" component={Setting as React.ComponentType<any>} />
          <Stack.Screen name="Account" component={Account as React.ComponentType<any>} />
          <Stack.Screen name="PropertyDetail" component={PropertyDetail as React.ComponentType<any>} />
          <Stack.Screen name="ConfirmBooking" component={ConfirmBooking as React.ComponentType<any>} />
          <Stack.Screen name="SearchDetails" component={SearchDetails} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="RecentlyViewed" component={RecentlyViewed} />
          <Stack.Screen name="Help" component={Help} />
          <Stack.Screen name="About" component={About} />
          <Stack.Screen name="Messages" component={Message as React.ComponentType<any>} />
        */}
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
