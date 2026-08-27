import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function Navbar() {
  const [text, setText] = useState('');

  const handleSearch = () => {
    Alert.alert('Search', text ? `Searching for: "${text}"` : 'Searching all properties');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBanner}>
        <Text style={styles.title}>Room Finder</Text>
      </View>
      <View style={styles.searchCard}>
        <Text style={styles.searchTitle}>Find a property anywhere.</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="location-sharp" size={18} color="#2C56C0" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            onChangeText={setText}
            value={text}
            placeholder="Search address or near you..."
            placeholderTextColor="#999999"
          />
        </View>
        <Pressable 
          onPress={handleSearch}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={styles.buttonText}>Search Now</Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerBanner: {
    backgroundColor: '#2C56C0',
    width: '100%',
    height:212,
    paddingTop: 30,
    paddingBottom: 60,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    maxWidth: 360,
    marginTop: -40,
    padding: 18,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    gap: 12,
  },
  searchTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1F2937',
  },
  button: {
    backgroundColor: '#2C56C0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: '#1E3E8F',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});