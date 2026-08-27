import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Navbar } from './src/navigation/Navbar';
import { Rentalproperty } from './src/navigation/main/Rentalproperty';

export default function App() {
  return (
    <View style={styles.container}>
      <Navbar />
      {/* <Rentalproperty /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    gap: 50,
  },
});
