import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export type LandlordNavTab = 'Home' | 'Properties' | 'Messages' | 'Finance' | 'Account';

type NavigationItem = {
  label: LandlordNavTab;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
  route: string;
};

type Props = {
  active?: LandlordNavTab | string;
  onSelect?: (label: LandlordNavTab) => void;
  navigation?: { navigate: (screen: string) => void };
  unreadMessagesCount?: number;
};

const items: NavigationItem[] = [
  { label: 'Home', activeIcon: 'home', inactiveIcon: 'home-outline', route: 'LandlordHome' },
  { label: 'Properties', activeIcon: 'business', inactiveIcon: 'business-outline', route: 'LandlordProperties' },
  { label: 'Messages', activeIcon: 'chatbubble-ellipses', inactiveIcon: 'chatbubble-ellipses-outline', route: 'LandlordMessages' },
  { label: 'Finance', activeIcon: 'bar-chart', inactiveIcon: 'bar-chart-outline', route: 'LandlordFinance' },
  { label: 'Account', activeIcon: 'person', inactiveIcon: 'person-outline', route: 'LandlordAccount' },
];

export default function NavigationBarComponent({
  active = 'Home',
  onSelect,
  navigation,
  unreadMessagesCount = 2,
}: Props) {
  const handlePress = (item: NavigationItem) => {
    if (onSelect) {
      onSelect(item.label);
    } else if (navigation) {
      navigation.navigate(item.route);
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        {items.map((item) => {
          const isActive = item.label === active;
          return (
            <TouchableOpacity
              key={item.label}
              style={styles.item}
              activeOpacity={0.7}
              onPress={() => handlePress(item)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <View style={styles.iconWrapper}>
                <Ionicons
                  name={isActive ? item.activeIcon : item.inactiveIcon}
                  size={23}
                  color={isActive ? '#2C56C0' : '#9CA3AF'}
                />
                {item.label === 'Messages' && unreadMessagesCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>
                {item.label}
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
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 3,
    minWidth: 56,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  activeLabel: {
    color: '#2C56C0',
    fontWeight: '700',
  },
  inactiveLabel: {
    color: '#9CA3AF',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
