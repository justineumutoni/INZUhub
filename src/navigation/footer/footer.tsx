import React from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../login/Login';

export interface FooterProps {
  activeTab?: 'Home' | 'Search' | 'Settings' | 'Message' | 'Account';
  onTabPress?: (tabName: string) => void;
}

interface TabItem {
  id: string;
  name: 'Home' | 'Search' | 'Settings' | 'Message' | 'Account';
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  route?: keyof RootStackParamList;
}

const TABS: TabItem[] = [
  { id: '1', name: 'Home', iconName: 'home', route: 'Home' },
  { id: '2', name: 'Search', iconName: 'search-outline' },
  { id: '3', name: 'Settings', iconName: 'options-outline', route: 'Settings' },
  { id: '4', name: 'Message', iconName: 'mail-outline' },
  { id: '5', name: 'Account', iconName: 'person-outline', route: 'Account' },
];

export function Footer({ activeTab = 'Home', onTabPress }: FooterProps) {
  let navigation: NativeStackNavigationProp<RootStackParamList> | null = null;
  try {
    navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  } catch {
    navigation = null;
  }

  const handlePress = (tab: TabItem) => {
    if (onTabPress) {
      onTabPress(tab.name);
      return;
    }
    if (navigation && tab.route) {
      if (tab.route === 'Home') {
        navigation.navigate('Home');
      } else if (tab.route === 'Settings') {
        navigation.navigate('Settings');
      } else if (tab.route === 'Account') {
        navigation.navigate('Account');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {TABS.map((tab) => {
          const isActive = tab.name === activeTab;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              onPress={() => handlePress(tab)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.iconName}
                size={22}
                color={isActive ? '#2C56C0' : '#9CA3AF'}
              />
              <Text style={[styles.tabText, isActive ? styles.activeTabText : styles.inactiveTabText]}>
                {tab.name}
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
    paddingHorizontal: 8,
    gap: 3,
    minWidth: 50,
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