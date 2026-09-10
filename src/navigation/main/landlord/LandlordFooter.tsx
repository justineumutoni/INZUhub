import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LandlordStackParamList } from './landlordTypes';

const BLUE = '#2956C2';

export type LandlordTab = 'Home' | 'Properties' | 'Messages' | 'Finance' | 'Account';

interface LandlordFooterProps {
  activeTab: LandlordTab;
}

export function LandlordFooter({ activeTab }: LandlordFooterProps) {
  const navigation = useNavigation<NativeStackNavigationProp<LandlordStackParamList>>();

  const tabs: {
    id: LandlordTab;
    label: string;
    route: keyof LandlordStackParamList;
    icon: (active: boolean) => React.ReactNode;
  }[] = [
    {
      id: 'Home',
      label: 'Home',
      route: 'LandlordHome',
      icon: (active) => (
        <Ionicons name={active ? 'home' : 'home-outline'} size={22} color={active ? BLUE : '#9CA3AF'} />
      ),
    },
    {
      id: 'Properties',
      label: 'Properties',
      route: 'LandlordProperties',
      icon: (active) => (
        <MaterialCommunityIcons
          name={active ? 'office-building' : 'office-building-outline'}
          size={22}
          color={active ? BLUE : '#9CA3AF'}
        />
      ),
    },
    {
      id: 'Messages',
      label: 'Messages',
      route: 'LandlordMessages',
      icon: (active) => (
        <View>
          <Ionicons
            name={active ? 'chatbubble' : 'chatbubble-outline'}
            size={22}
            color={active ? BLUE : '#9CA3AF'}
          />
          {/* unread dot */}
          <View style={styles.dot} />
        </View>
      ),
    },
    {
      id: 'Finance',
      label: 'Finance',
      route: 'LandlordFinance',
      icon: (active) => (
        <Ionicons
          name={active ? 'bar-chart' : 'bar-chart-outline'}
          size={22}
          color={active ? BLUE : '#9CA3AF'}
        />
      ),
    },
    {
      id: 'Account',
      label: 'Account',
      route: 'LandlordAccount',
      icon: (active) => (
        <Ionicons
          name={active ? 'person' : 'person-outline'}
          size={22}
          color={active ? BLUE : '#9CA3AF'}
        />
      ),
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => {
              if (!isActive) {
                navigation.navigate(tab.route as never);
              }
            }}
          >
            {tab.icon(isActive)}
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 10,
    paddingBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  labelActive: {
    color: BLUE,
    fontWeight: '700',
  },
  dot: {
    position: 'absolute',
    top: 0,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BLUE,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
});
