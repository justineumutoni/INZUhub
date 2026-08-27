import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Navbar } from './src/navigation/Navbar';
import { Property } from './src/navigation/main/property';

export default function App() {
  return (
    <View style={styles.container}>
      <Navbar />
      <Property />
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
