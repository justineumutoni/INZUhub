import React, {useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FooterIconProps } from '../../types/footer';

const CATEGORIES: FooterIconProps[] = [
  { id: '1', name: 'Home', iconName: 'home' },
  { id: '2', name: 'Search', iconName: 'search' },
  { id: '3', name: 'Settings', iconName: 'settings-outline' },
  { id: '4', name: 'Account', iconName: 'person-outline' },
];

export function Footer() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('1');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {CATEGORIES.map((item) => {
          const isActive = item.id === activeCategoryId;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.tabItem}
              onPress={() => setActiveCategoryId(item.id)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={item.iconName} 
                size={22} 
                color={isActive ? '#2C56C0' : '#9CA3AF'} 
              />
              <Text style={[styles.tabText, isActive ? styles.activeTabText : styles.inactiveTabText]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 5,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    gap: 3,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2C56C0',
    fontWeight: '700',
  },
  inactiveTabText: {
    color: '#9CA3AF',
  },
});