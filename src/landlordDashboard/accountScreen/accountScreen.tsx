import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signOut, updateProfile } from 'firebase/auth';
import { auth, db } from '../../endUser/config/firebase';
import NavigationBarComponent from '../component/navigationBarComponent';

type Props = {
  navigation: {
    navigate: (screen: string, params?: object) => void;
    reset: (state: object) => void;
  };
};

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  badge?: string;
  color: string;
  onPress: () => void;
};

export default function AccountScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const compact = width < 380;
  const padding = compact ? 16 : width < 600 ? 20 : 32;

  const [name, setName] = useState('Courtney Henry');
  const [email, setEmail] = useState('courtney.henry@inzuhub.com');
  const [phone, setPhone] = useState('+62 812-3456-7890');
  const [location, setLocation] = useState('Jakarta Selatan, Indonesia');
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [biometrics, setBiometrics] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  // Modals state
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editPhotoURL, setEditPhotoURL] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [supportModalVisible, setSupportModalVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English (US) • IDR (Rp)');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    setName(user.displayName || 'Courtney Henry');
    setEmail(user.email || 'courtney.henry@inzuhub.com');
    if (user.photoURL) setPhotoURL(user.photoURL);

    getDoc(doc(db, 'users', user.uid))
      .then((profile: any) => {
        if (profile.exists()) {
          const data = profile.data();
          if (data.fullName) setName(data.fullName);
          if (data.email) setEmail(data.email);
          if (data.phone) setPhone(data.phone);
          if (data.location) setLocation(data.location);
          if (data.photoURL) setPhotoURL(data.photoURL);
        }
      })
      .catch(() => {});
  }, []);

  const openEditModal = () => {
    setEditName(name);
    setEditPhone(phone);
    setEditLocation(location);
    setEditPhotoURL(photoURL);
    setIsEditModalVisible(true);
  };

  const handlePickPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Please grant photo access to update your avatar.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]?.uri) {
        setEditPhotoURL(result.assets[0].uri);
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not pick image.');
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Name Required', 'Please enter your full name.');
      return;
    }
    setSaving(true);
    try {
      const user = auth.currentUser;
      setName(editName.trim());
      setPhone(editPhone.trim());
      setLocation(editLocation.trim());
      setPhotoURL(editPhotoURL);
      setIsEditModalVisible(false);

      if (user) {
        await Promise.all([
          updateProfile(user, {
            displayName: editName.trim(),
            photoURL: editPhotoURL || null,
          }),
          setDoc(
            doc(db, 'users', user.uid),
            {
              fullName: editName.trim(),
              phone: editPhone.trim(),
              location: editLocation.trim(),
              photoURL: editPhotoURL || '',
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          ),
        ]);
      }
      Alert.alert('Profile Updated', 'Your landlord profile details have been saved.');
    } catch (err: any) {
      Alert.alert('Save Failed', err?.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of InzuHub?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
            navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
          } catch (error: any) {
            Alert.alert('Unable to sign out', error?.message || 'Please try again.');
          }
        },
      },
    ]);
  };

  const managementItems: MenuItem[] = [
    {
      icon: 'business-outline',
      title: 'My Properties',
      subtitle: 'Manage active units, leases & availability',
      badge: '6 Listed',
      color: '#2C56C0',
      onPress: () => navigation.navigate('LandlordProperties'),
    },
    {
      icon: 'construct-outline',
      title: 'Maintenance & Tickets',
      subtitle: 'Plumbing, AC & electrical repair requests',
      badge: '1 Pending',
      color: '#D97706',
      onPress: () => navigation.navigate('LandlordProperties', { initialFilter: 'Maintenance' }),
    },
    {
      icon: 'people-outline',
      title: 'Tenants & Contracts',
      subtitle: 'Active lease contracts & tenant directory',
      badge: '4 Active',
      color: '#10B981',
      onPress: () => navigation.navigate('LandlordProperties', { initialFilter: 'Occupied' }),
    },
  ];

  const financeItems: MenuItem[] = [
    {
      icon: 'card-outline',
      title: 'Disbursement Account',
      subtitle: 'Bank BCA •••• 8812 (Instant transfer)',
      badge: 'Default',
      color: '#2C56C0',
      onPress: () => setBankModalVisible(true),
    },
    {
      icon: 'receipt-outline',
      title: 'Financial Statements',
      subtitle: 'Monthly rental payouts and tax receipts',
      color: '#10B981',
      onPress: () => navigation.navigate('LandlordFinance'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#2C56C0" />
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Top Curved Hero Banner ── */}
          <View style={[styles.hero, { paddingHorizontal: padding }]}>
            <Text style={styles.heroTitle}>Account & Settings</Text>

            {/* Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.avatarWrapper}>
                {photoURL ? (
                  <Image source={{ uri: photoURL }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Ionicons name="person" size={32} color="#2C56C0" />
                  </View>
                )}
                <TouchableOpacity
                  style={styles.editAvatarBadge}
                  onPress={openEditModal}
                  activeOpacity={0.8}
                >
                  <Ionicons name="pencil" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.profileInfo}>
                <View style={styles.nameLine}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {name}
                  </Text>
                  <Text style={styles.hostBadge}>HOST</Text>
                </View>
                <Text style={styles.email} numberOfLines={1}>
                  {email}
                </Text>
                <Text style={styles.locationText} numberOfLines={1}>
                  <Ionicons name="location-sharp" size={12} color="#BFD1FF" /> {location}
                </Text>
              </View>
            </View>

            {/* Profile Stats */}
            <View style={styles.profileStats}>
              <TouchableOpacity
                style={styles.stat}
                onPress={() => navigation.navigate('LandlordProperties')}
                activeOpacity={0.85}
              >
                <Text style={styles.statLabel}>Total Units</Text>
                <Text style={styles.statValue}>6 Units</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.stat}
                onPress={() => navigation.navigate('LandlordFinance')}
                activeOpacity={0.85}
              >
                <Text style={styles.statLabel}>Monthly Payout</Text>
                <Text style={styles.statValue}>Rp 28.5M</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Switch to Tenant View Banner ── */}
          <View style={[styles.switchModeSection, { marginHorizontal: padding }]}>
            <View style={styles.switchModeCard}>
              <View style={styles.switchModeIcon}>
                <Ionicons name="eye-outline" size={24} color="#2C56C0" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchModeTitle}>Preview Tenant Experience</Text>
                <Text style={styles.switchModeSub}>
                  Switch to Tenant View to see how prospective renters search, browse, and book properties.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.switchModeBtn}
                onPress={() => navigation.navigate('Home')}
                activeOpacity={0.85}
              >
                <Text style={styles.switchModeBtnText}>Tenant View</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Quick Row ── */}
          <View style={[styles.quickRow, { paddingHorizontal: padding }]}>
            <TouchableOpacity
              style={styles.quickItem}
              onPress={() => setBankModalVisible(true)}
              activeOpacity={0.75}
            >
              <View style={[styles.quickIcon, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="card" size={20} color="#2C56C0" />
              </View>
              <Text style={styles.quickTitle}>Bank BCA</Text>
              <Text style={[styles.quickSubtitle, { color: '#2C56C0' }]}>Connected</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickItem}
              onPress={() => navigation.navigate('LandlordProperties', { initialFilter: 'Occupied' })}
              activeOpacity={0.75}
            >
              <View style={[styles.quickIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="document-text" size={20} color="#D97706" />
              </View>
              <Text style={styles.quickTitle}>Contracts</Text>
              <Text style={[styles.quickSubtitle, { color: '#D97706' }]}>2 Renewal</Text>
              <View style={styles.alertDot} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickItem}
              onPress={() =>
                Alert.alert(
                  'Verified Landlord Tier 3',
                  'Your government ID, business license, and bank account have been fully verified.'
                )
              }
              activeOpacity={0.75}
            >
              <View style={[styles.quickIcon, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              </View>
              <Text style={styles.quickTitle}>KYC Shield</Text>
              <Text style={[styles.quickSubtitle, { color: '#10B981' }]}>100% Level 3</Text>
            </TouchableOpacity>
          </View>

          {/* ── Management Section ── */}
          <MenuSection title="PROPERTY MANAGEMENT" items={managementItems} padding={padding} />

          {/* ── Finance Section ── */}
          <MenuSection title="PAYOUTS & FINANCE" items={financeItems} padding={padding} />

          {/* ── Settings & Security ── */}
          <Text style={[styles.groupTitle, { marginHorizontal: padding }]}>SETTINGS & PREFERENCES</Text>
          <View style={[styles.menuCard, { marginHorizontal: padding }]}>
            <View style={styles.settingRow}>
              <View style={styles.menuIcon}>
                <Ionicons name="finger-print-outline" size={20} color="#2C56C0" />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>Face ID & Biometrics</Text>
                <Text style={styles.menuSubtitle}>Fast login authentication</Text>
              </View>
              <Switch
                value={biometrics}
                onValueChange={setBiometrics}
                trackColor={{ false: '#CBD5E1', true: '#2C56C0' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.menuIcon}>
                <Ionicons name="notifications-outline" size={20} color="#2C56C0" />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>Push Notifications</Text>
                <Text style={styles.menuSubtitle}>Booking alerts, tenant messages</Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: '#CBD5E1', true: '#2C56C0' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <TouchableOpacity
              style={[styles.settingRow, { borderBottomWidth: 0 }]}
              onPress={() => setLangModalVisible(true)}
              activeOpacity={0.75}
            >
              <View style={styles.menuIcon}>
                <Ionicons name="globe-outline" size={20} color="#2C56C0" />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>Language & Currency</Text>
                <Text style={styles.menuSubtitle}>{selectedLang}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* ── Support & Sign Out ── */}
          <TouchableOpacity
            style={[styles.supportButton, { marginHorizontal: padding }]}
            onPress={() => setSupportModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="help-circle-outline" size={20} color="#2C56C0" />
            <Text style={styles.supportText}>Host Support & Knowledge Base</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.logoutButton, { marginHorizontal: padding }]}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <Text style={styles.version}>InzuHub Host Edition • v2.4.1</Text>
        </ScrollView>

        {/* ── Bottom Navigation Bar ── */}
        <NavigationBarComponent
          active="Account"
          navigation={navigation}
          onSelect={(label) => {
            if (label === 'Home') navigation.navigate('LandlordHome');
            else if (label === 'Properties') navigation.navigate('LandlordProperties');
            else if (label === 'Messages') navigation.navigate('LandlordMessages');
            else if (label === 'Finance') navigation.navigate('LandlordFinance');
          }}
        />

        {/* ── Edit Profile Modal ── */}
        <Modal
          visible={isEditModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalOverlay}
          >
            <View style={styles.editModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Landlord Profile</Text>
                <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                  <Ionicons name="close" size={22} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.avatarEditRow}>
                  <TouchableOpacity onPress={handlePickPhoto} style={styles.avatarWrapper}>
                    {editPhotoURL ? (
                      <Image source={{ uri: editPhotoURL }} style={styles.avatarLarge} />
                    ) : (
                      <View style={[styles.avatarLarge, styles.avatarPlaceholder]}>
                        <Ionicons name="person" size={40} color="#2C56C0" />
                      </View>
                    )}
                    <View style={styles.editAvatarBadgeLarge}>
                      <Ionicons name="camera" size={16} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handlePickPhoto} style={{ marginTop: 8 }}>
                    <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.formLabel}>Full Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Your full name"
                  placeholderTextColor="#9CA3AF"
                />

                <Text style={[styles.formLabel, { marginTop: 12 }]}>Phone Number</Text>
                <TextInput
                  style={styles.formInput}
                  value={editPhone}
                  onChangeText={setPhone}
                  placeholder="+62 812-xxxx-xxxx"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />

                <Text style={[styles.formLabel, { marginTop: 12 }]}>Location / City</Text>
                <TextInput
                  style={styles.formInput}
                  value={editLocation}
                  onChangeText={setEditLocation}
                  placeholder="e.g. Jakarta Selatan, Indonesia"
                  placeholderTextColor="#9CA3AF"
                />

                <View style={styles.editModalButtonsRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setIsEditModalVisible(false)}
                    disabled={saving}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.saveBtnText}>Save Profile</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* ── Disbursement Bank Modal ── */}
        <Modal
          visible={bankModalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setBankModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Disbursement Account</Text>
                <TouchableOpacity onPress={() => setBankModalVisible(false)}>
                  <Ionicons name="close" size={22} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.bankCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.bankName}>Bank Central Asia (BCA)</Text>
                  <Text style={styles.bankBadge}>Verified</Text>
                </View>
                <Text style={styles.bankAccNo}>•••• •••• •••• 8812</Text>
                <Text style={styles.bankHolder}>Courtney Henry</Text>
              </View>

              <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 12, lineHeight: 17 }}>
                Rental payments collected via InzuHub SecurePay are automatically disbursed into this account on the 1st and 15th of each month.
              </Text>

              <TouchableOpacity
                style={[styles.modalPrimaryBtn, { marginTop: 18 }]}
                onPress={() => {
                  setBankModalVisible(false);
                  Alert.alert('Change Payout Account', 'Please contact InzuHub Host Support to verify a new bank account.');
                }}
              >
                <Ionicons name="create-outline" size={18} color="#FFFFFF" />
                <Text style={styles.modalPrimaryBtnText}>Change Bank Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ── Language Modal ── */}
        <Modal
          visible={langModalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setLangModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Language & Currency</Text>
                <TouchableOpacity onPress={() => setLangModalVisible(false)}>
                  <Ionicons name="close" size={22} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {[
                'English (US) • IDR (Rp)',
                'Bahasa Indonesia • IDR (Rp)',
                'English (US) • USD ($)',
              ].map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.langOptRow}
                  onPress={() => {
                    setSelectedLang(opt);
                    setLangModalVisible(false);
                  }}
                >
                  <Text style={[styles.langOptText, selectedLang === opt && { color: '#2C56C0', fontWeight: '700' }]}>
                    {opt}
                  </Text>
                  {selectedLang === opt && <Ionicons name="checkmark" size={18} color="#2C56C0" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* ── Support Modal ── */}
        <Modal
          visible={supportModalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setSupportModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>InzuHub Host Support</Text>
                <TouchableOpacity onPress={() => setSupportModalVisible(false)}>
                  <Ionicons name="close" size={22} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <Text style={{ color: '#4B5563', fontSize: 13, lineHeight: 18, marginBottom: 14 }}>
                Our host success team is available 24/7 to assist with listings, contracts, payouts, and tenant disputes.
              </Text>

              <TouchableOpacity
                style={styles.supportContactRow}
                onPress={() => {
                  setSupportModalVisible(false);
                  navigation.navigate('LandlordMessages');
                }}
              >
                <Ionicons name="chatbubbles" size={20} color="#2C56C0" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.supportContactTitle}>Chat with Host Support</Text>
                  <Text style={styles.supportContactSub}>Average reply time: under 5 minutes</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.supportContactRow}
                onPress={() => {
                  setSupportModalVisible(false);
                  Alert.alert('Knowledge Base', 'Opening InzuHub Landlord Guide & FAQ documentation.');
                }}
              >
                <Ionicons name="book-outline" size={20} color="#2C56C0" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.supportContactTitle}>Host Help Center & FAQ</Text>
                  <Text style={styles.supportContactSub}>Guides on rental laws, taxes, contracts</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

function MenuSection({
  title,
  items,
  padding,
}: {
  title: string;
  items: MenuItem[];
  padding: number;
}) {
  return (
    <>
      <Text style={[styles.groupTitle, { marginHorizontal: padding }]}>{title}</Text>
      <View style={[styles.menuCard, { marginHorizontal: padding }]}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.title}
            style={[styles.settingRow, index < items.length - 1 && styles.rowBorder]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon} size={18} color={item.color} />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            {item.badge && (
              <Text style={[styles.itemBadge, { color: item.color, backgroundColor: `${item.color}15` }]}>
                {item.badge}
              </Text>
            )}
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2C56C0',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingBottom: 24,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  hero: {
    backgroundColor: '#2C56C0',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2C56C0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  editAvatarBadgeLarge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2C56C0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  nameLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    flexShrink: 1,
  },
  hostBadge: {
    color: '#78350F',
    backgroundColor: '#FDE68A',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 10,
    fontWeight: '800',
  },
  email: {
    color: '#DCE7FF',
    fontSize: 12,
    marginTop: 3,
  },
  locationText: {
    color: '#BFD1FF',
    fontSize: 11,
    marginTop: 3,
  },
  profileStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  stat: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statLabel: {
    color: '#DCE7FF',
    fontSize: 12,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  switchModeSection: {
    marginTop: 14,
  },
  switchModeCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchModeIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchModeTitle: {
    color: '#1E3A8A',
    fontSize: 13,
    fontWeight: '700',
  },
  switchModeSub: {
    color: '#4B5563',
    fontSize: 11,
    marginTop: 2,
  },
  switchModeBtn: {
    backgroundColor: '#2C56C0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  switchModeBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  quickItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTitle: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
  quickSubtitle: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  alertDot: {
    position: 'absolute',
    top: 8,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  groupTitle: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 20,
    marginBottom: 8,
  },
  menuCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  settingRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    minWidth: 0,
  },
  menuTitle: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '700',
  },
  menuSubtitle: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 2,
  },
  itemBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 11,
    fontWeight: '700',
  },
  supportButton: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  supportText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '700',
  },
  logoutButton: {
    height: 48,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 14,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
  version: {
    color: '#9CA3AF',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  editModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  avatarEditRow: {
    alignItems: 'center',
    marginVertical: 14,
  },
  changePhotoText: {
    color: '#2C56C0',
    fontSize: 12,
    fontWeight: '700',
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  formInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#111827',
  },
  editModalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1.5,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#2C56C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  bankCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
  },
  bankName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bankBadge: {
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: '700',
  },
  bankAccNo: {
    color: '#BFD1FF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    marginVertical: 12,
  },
  bankHolder: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  modalPrimaryBtn: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#2C56C0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  langOptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  langOptText: {
    fontSize: 13,
    color: '#374151',
  },
  supportContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  supportContactTitle: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '700',
  },
  supportContactSub: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 2,
  },
});
