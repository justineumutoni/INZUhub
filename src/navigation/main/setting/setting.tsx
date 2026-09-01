import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { Footer } from '../../footer/footer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../Login/Login';

interface MenuItemProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  onPress?: () => void;
  isDestructive?: boolean;
}

function MenuItem({ icon, title, onPress, isDestructive }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuIconContainer}>
        <Ionicons
          name={icon}
          size={22}
          color={isDestructive ? '#EF4444' : '#2C56C0'}
        />
      </View>
      <Text
        style={[
          styles.menuTitle,
          isDestructive && { color: '#EF4444' },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default function Setting() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const currentUser = auth.currentUser;

  const displayName = currentUser?.displayName || 'Courtney Henry';
  const displayEmail = currentUser?.email || '10 Applied  |  Archen';

  const handleSignOut = () => {
    const performSignOut = async () => {
      try {
        await signOut(auth);
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      } catch (err: any) {
        const errorMsg = err?.message || 'Failed to sign out';
        if (Platform.OS === 'web') {
          window.alert(errorMsg);
        } else {
          Alert.alert('Error', errorMsg);
        }
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined' && typeof window.confirm === 'function'
        ? window.confirm('Are you sure you want to sign out of InzuHub?')
        : true;
      if (confirmed) {
        performSignOut();
      }
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out of InzuHub?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: performSignOut,
          },
        ]
      );
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing options will be available soon.');
  };

  const handleFeaturePress = (featureName: string) => {
    Alert.alert(featureName, `${featureName} details will be available soon.`);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#2C56C0" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Blue Header ────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account</Text>
        </View>

        {/* ── Profile Section (Overlapping Avatar) ────────────────────────── */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{}}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.plusBadge}
              activeOpacity={0.8}
              onPress={handleEditProfile}
            >
              <Ionicons name="add" size={18} color="#2C56C0" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userSubtitle}>{displayEmail}</Text>
        </View>

        {/* ── Edit Profile Highlight Card ───────────────────────────────── */}
        <TouchableOpacity
          style={styles.editProfileCard}
          activeOpacity={0.85}
          onPress={handleEditProfile}
        >
          <View style={styles.editProfileIconBox}>
            <Feather name="user" size={20} color="#2C56C0" />
          </View>
          <View style={styles.editProfileTextBox}>
            <Text style={styles.editProfileTitle}>Edit Profile</Text>
            <Text style={styles.editProfileSubtitle}>
              Edit all the basic profile information associated with your profile
            </Text>
          </View>
        </TouchableOpacity>

        {/* ── Menu Items List ───────────────────────────────────────────── */}
        <View style={styles.menuList}>
          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            onPress={() => handleFeaturePress('Notifications')}
          />
          <MenuItem
            icon="trending-up-outline"
            title="Recent Viewed"
            onPress={() => handleFeaturePress('Recent Viewed')}
          />
          <MenuItem
            icon="help-buoy-outline"
            title="Get Help"
            onPress={() => handleFeaturePress('Get Help')}
          />
          <MenuItem
            icon="help-circle-outline"
            title="About us"
            onPress={() => handleFeaturePress('About Us')}
          />
          <MenuItem
            icon="log-out-outline"
            title="Sign Out"
            onPress={handleSignOut}
            isDestructive
          />
        </View>
      </ScrollView>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <Footer activeTab="Settings" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#2C56C0',
    paddingTop: Platform.OS === 'ios' ? 54 : 42,
    paddingBottom: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: -52,
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#E5E7EB',
  },
  plusBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  editProfileCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EEF4FF',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    gap: 14,
  },
  editProfileIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E0EBFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  editProfileTextBox: {
    flex: 1,
    gap: 3,
  },
  editProfileTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C56C0',
  },
  editProfileSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
  },
  menuList: {
    marginHorizontal: 20,
    gap: 18,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 14,
  },
  menuIconContainer: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
});
