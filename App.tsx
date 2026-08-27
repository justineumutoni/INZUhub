import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-view';
// import { Navbar } from './src/navigation/Navbar';
// import { Property } from './src/navigation/main/property';
import { Splash } from './src/navigation/main/Splash';
import { Navbar } from './src/navigation/Navbar';
import Login from './src/navigation/main/Login';
export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Login />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C56C0',
    display: 'flex',
    flexDirection: 'column',
    
  },
});
