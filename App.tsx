import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Navbar } from './src/navigation/navbar/Navbar';
import { Property } from './src/navigation/main/property';
import { Footer } from './src/navigation/footer/footer';
import { PropertyDetail } from './src/navigation/details/PropertyDetail';
import { PropertyDetailData } from './src/types/property';

export default function App() {
  const [selectedProperty, setSelectedProperty] = useState<PropertyDetailData | null>(null);

  if (selectedProperty) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <PropertyDetail 
          property={selectedProperty} 
          onBack={() => setSelectedProperty(null)} 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Navbar />
      <Property onSelectProperty={setSelectedProperty} />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
