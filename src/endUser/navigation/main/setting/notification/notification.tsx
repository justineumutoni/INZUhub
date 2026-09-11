import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../Login/Login';
import { Footer } from '../../../footer/footer';

// ---- Types -----------------------------------------------------------

type NotificationType = 'info' | 'property';
type NotificationSection = 'Today' | 'Yesterday';

interface NotificationItem {
  id: string;
  section: NotificationSection;
  type: NotificationType;
  message: string;
  read: boolean;
}

interface NotificationCardProps {
  item: NotificationItem;
  onPress?: (item: NotificationItem) => void;
}

// ---- Static data -------------------------------------------------------

const ICON_CONFIG: Record<
  NotificationType,
  { name: React.ComponentProps<typeof Ionicons>['name']; bg: string; color: string }
> = {
  info: {
    name: 'notifications-outline',
    bg: '#F3F4F6',
    color: '#6B7280',
  },
  property: {
    name: 'notifications-outline',
    bg: '#FFEDD5',
    color: '#F97316',
  },
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    section: 'Today',
    type: 'info',
    message: "Welcome, Don't forget to complete your personal info.",
    read: false,
  },
  {
    id: '2',
    section: 'Today',
    type: 'property',
    message: 'There are 4 available properties, you recently selected. Click here for more details.',
    read: false,
  },
  {
    id: '3',
    section: 'Yesterday',
    type: 'property',
    message: 'There are 4 available properties, you recently selected. Click here for more details.',
    read: true,
  },
  {
    id: '4',
    section: 'Yesterday',
    type: 'property',
    message: 'There are 4 available properties, you recently selected. Click here for more details.',
    read: true,
  },
  {
    id: '5',
    section: 'Yesterday',
    type: 'property',
    message: 'There are 4 available properties, you recently selected. Click here for more details.',
    read: true,
  },
];

// ---- Notification Card -----------------------------------------------

function NotificationCard({ item, onPress }: NotificationCardProps) {
  const config = ICON_CONFIG[item.type];

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPress?.(item)}
    >
      <View style={[styles.cardIconWrap, { backgroundColor: config.bg }]}>
        <Ionicons name={config.name} size={20} color={config.color} />
      </View>
      <Text style={styles.cardMessage}>{item.message}</Text>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

// ---- Component -----------------------------------------------------------

export default function Notifications() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const todayItems = notifications.filter((n) => n.section === 'Today');
  const yesterdayItems = notifications.filter((n) => n.section === 'Yesterday');

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationPress = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    // TODO: navigate to the relevant property list / detail screen here
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#2C56C0" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.backButtonSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Today */}
        {todayItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Today</Text>
              <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.7}>
                <Text style={styles.markAllRead}>Mark all read</Text>
              </TouchableOpacity>
            </View>

            {todayItems.map((item) => (
              <NotificationCard key={item.id} item={item} onPress={handleNotificationPress} />
            ))}
          </View>
        )}

        {/* Yesterday */}
        {yesterdayItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Yesterday</Text>
            </View>

            {yesterdayItems.map((item) => (
              <NotificationCard key={item.id} item={item} onPress={handleNotificationPress} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <Footer activeTab="Settings" />
    </View>
  );
}

// ---- Styles ----------------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2C56C0',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 42,
    paddingBottom: 16,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    height: Platform.OS === 'ios' ? 100 : 150,
  },
  backButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonSpacer: {
    width: 34,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  markAllRead: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  cardIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMessage: {
    flex: 1,
    fontSize: 12.5,
    color: '#374151',
    lineHeight: 18,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#2C56C0',
    marginLeft: 4,
  },
});