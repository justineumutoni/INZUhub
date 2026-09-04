import React, { useState, useEffect } from 'react';
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
  Linking,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';
import { profileSchema, formatZodErrors } from '../../../config/validation';
import { Footer } from '../../footer/footer';
import { useNavigation, useRoute, useIsFocused, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../Login/Login';
import type { PropertyDetailData } from '../../../types/property';

interface AppliedPropertyItem {
  id: string;
  title: string;
  location: string;
  price: string;
  rating: string;
  distance: string;
  status: string;
  statusColor: string;
  image: any;
  detailData: PropertyDetailData;
}

const APPLIED_PROPERTIES: AppliedPropertyItem[] = [
  {
    id: '1',
    title: '2 Rooms Available',
    location: 'Jalsot, Jln. Samiri',
    price: 'Rp. 1000K',
    rating: '3.5 ★',
    distance: '1.2 km from GBK',
    status: 'Booked',
    statusColor: '#F97316',
    image: require('../../../../assets/propertyImage.jpg'),
    detailData: {
      title: '2 Rooms Available',
      price: 'Rp. 1000K',
      period: '/ per month',
      distanceFrom: '1.2 km from GBK',
      subLocation: 'Jalsot, Jln. Samiri',
      status: 'Booked',
      ownedBy: 'Courtney Henry',
      appliedCount: '10 Applied',
      viewsCount: '24 Views',
      ownerName: 'Courtney Henry',
      ownerRole: 'Landlord',
      ownerAvatar: { uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
      heroImage: require('../../../../assets/propertyImage.jpg'),
      description: '2 rooms available for rent in Jalsot, Jln. Samiri. Equipped with bike parking and clean water.',
    },
  },
  {
    id: '2',
    title: '1 Big Hall at Lalitpur',
    location: 'Jln. Samiri',
    price: 'Rs. 8000',
    rating: '4.2 ★',
    distance: '1.2 km from Hospital',
    status: 'Available',
    statusColor: '#10B981',
    image: require('../../../../assets/Property.png'),
    detailData: {
      title: '1 Big Hall at Lalitpur',
      price: 'Rs. 8000',
      period: '/ per month',
      distanceFrom: '1.2 km from Hospital',
      subLocation: 'Jln. Samiri',
      status: 'Available',
      ownedBy: 'Courtney Henry',
      appliedCount: '4 Applied',
      viewsCount: '19 Views',
      ownerName: 'Courtney Henry',
      ownerRole: 'Landlord',
      ownerAvatar: { uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
      heroImage: require('../../../../assets/Property.png'),
      description: '1 big hall room for rent at lalitpur with the facilities of bike parking and tap water.',
    },
  },
  {
    id: '3',
    title: '4 Room Available',
    location: 'Jln. Samiri',
    price: 'Rp. 2000K',
    rating: '4.0 ★',
    distance: '0.8 km from City Center',
    status: 'Pending',
    statusColor: '#F59E0B',
    image: require('../../../../assets/propertyImage.jpg'),
    detailData: {
      title: '4 Room Available',
      price: 'Rp. 2000K',
      period: '/ per month',
      distanceFrom: '0.8 km from City Center',
      subLocation: 'Jln. Samiri',
      status: 'Pending',
      ownedBy: 'Courtney Henry',
      appliedCount: '9 Applied',
      viewsCount: '32 Views',
      ownerName: 'Courtney Henry',
      ownerRole: 'Landlord',
      ownerAvatar: { uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
      heroImage: require('../../../../assets/propertyImage.jpg'),
      description: 'Spacious 4 rooms suitable for family or shared students.',
    },
  },
  {
    id: '4',
    title: 'Modern Apartment',
    location: 'Downtown, NY',
    price: 'Rp. 1500K',
    rating: '4.8 ★',
    distance: '2.0 km from Metro',
    status: 'Available',
    statusColor: '#10B981',
    image: require('../../../../assets/Property.png'),
    detailData: {
      title: 'Modern Apartment',
      price: 'Rp. 1500K',
      period: '/ per month',
      distanceFrom: '2.0 km from Metro',
      subLocation: 'Downtown, NY',
      status: 'Available',
      ownedBy: 'Courtney Henry',
      appliedCount: '12 Applied',
      viewsCount: '58 Views',
      ownerName: 'Courtney Henry',
      ownerRole: 'Landlord',
      ownerAvatar: { uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
      heroImage: require('../../../../assets/Property.png'),
      description: 'Fully furnished modern apartment with 24/7 security.',
    },
  },
];

const LIKED_PROPERTIES: AppliedPropertyItem[] = [
  {
    id: '5',
    title: 'Cozy Studio Room',
    location: 'Austin, TX',
    price: 'Rp. 850K',
    rating: '4.6 ★',
    distance: '0.5 km from Campus',
    status: 'Available',
    statusColor: '#10B981',
    image: require('../../../../assets/propertyImage.jpg'),
    detailData: {
      title: 'Cozy Studio Room',
      price: 'Rp. 850K',
      period: '/ per month',
      distanceFrom: '0.5 km from Campus',
      subLocation: 'Austin, TX',
      status: 'Available',
      ownedBy: 'Courtney Henry',
      appliedCount: '6 Applied',
      viewsCount: '45 Views',
      ownerName: 'Courtney Henry',
      ownerRole: 'Landlord',
      ownerAvatar: { uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
      heroImage: require('../../../../assets/propertyImage.jpg'),
      description: 'Cozy private studio room near university.',
    },
  },
];

export function Account() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Account'>>();
  const isFocused = useIsFocused();

  // Display State
  const [displayName, setDisplayName] = useState('Courtney Henry');
  const [displayEmail, setDisplayEmail] = useState('henry11@gmail.com');
  const [displayLocation, setDisplayLocation] = useState('Texas');
  const [displayPhone, setDisplayPhone] = useState('(+9) 98125331510');
  const [displayStatus, setDisplayStatus] = useState('10 Applied  |  Archen');
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'applied' | 'liked'>('applied');

  // Edit Modal State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editPhotoURL, setEditPhotoURL] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);
  const [showImageSourcePicker, setShowImageSourcePicker] = useState(false);

  // Load User Profile from Auth & Firestore
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName || 'Courtney Henry');
      setDisplayEmail(user.email || 'henry11@gmail.com');
      if (user.photoURL) {
        setPhotoURL(user.photoURL);
      }

      getDoc(doc(db, 'users', user.uid))
        .then((snapshot: any) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data.fullName) setDisplayName(data.fullName);
            if (data.email) setDisplayEmail(data.email);
            if (data.phone) setDisplayPhone(data.phone);
            if (data.location) setDisplayLocation(data.location);
            if (data.status) setDisplayStatus(data.status);
            if (data.photoURL) setPhotoURL(data.photoURL);
          }
        })
        .catch((err: any) => console.log('Error loading user profile:', err));
    }
  }, [isFocused]);

  // Open edit modal if autoEdit route param is passed
  useEffect(() => {
    if (route.params?.autoEdit) {
      openEditModal();
    }
  }, [route.params?.autoEdit]);

  const openEditModal = () => {
    setEditName(displayName);
    setEditPhone(displayPhone);
    setEditLocation(displayLocation);
    setEditStatus(displayStatus);
    setEditPhotoURL(photoURL);
    setFormErrors({});
    setIsEditModalVisible(true);
  };

  // Pick Image from Gallery
  const handlePickImage = async () => {
    setShowImageSourcePicker(false);
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Permission to access your photos is required to update your profile photo.');
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

  // Take Photo with Camera
  const handleTakePhoto = async () => {
    setShowImageSourcePicker(false);
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Permission to access your camera is required.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setEditPhotoURL(result.assets[0].uri);
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not launch camera.');
    }
  };

  // Save Profile Changes with Zod validation
  const handleSaveProfile = async () => {
    const parseResult = profileSchema.safeParse({
      fullName: editName,
      phone: editPhone,
      location: editLocation,
      status: editStatus,
    });

    if (!parseResult.success) {
      setFormErrors(formatZodErrors(parseResult.error));
      return;
    }

    setFormErrors({});
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        // 1. Update Firebase Auth displayName & photoURL
        await updateProfile(user, {
          displayName: editName.trim(),
          photoURL: editPhotoURL || null,
        }).catch((e) => console.warn('Auth update error:', e));

        // 2. Persist to Firestore
        await setDoc(
          doc(db, 'users', user.uid),
          {
            fullName: editName.trim(),
            phone: editPhone.trim(),
            location: editLocation.trim(),
            status: editStatus.trim(),
            photoURL: editPhotoURL || '',
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        ).catch((e: any) => console.warn('Firestore update error:', e));
      }

      // Update local state
      setDisplayName(editName.trim());
      setDisplayPhone(editPhone.trim());
      setDisplayLocation(editLocation.trim());
      setDisplayStatus(editStatus.trim());
      setPhotoURL(editPhotoURL);
      setIsEditModalVisible(false);

      if (Platform.OS === 'web') {
        window.alert('Profile updated successfully!');
      } else {
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (err: any) {
      Alert.alert('Save Failed', err?.message || 'Could not update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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

  const handleCall = () => {
    const phoneNumber = displayPhone.replace(/[^0-9+]/g, '');
    if (Platform.OS === 'web') {
      window.alert(`Calling ${displayName}: ${displayPhone}`);
    } else {
      Linking.openURL(`tel:${phoneNumber}`).catch(() => {
        Alert.alert('Call', `Calling ${displayName} at ${displayPhone}`);
      });
    }
  };

  const handleMessage = () => {
    if (Platform.OS === 'web') {
      window.alert(`Opening chat with ${displayName}`);
    } else {
      Alert.alert('Message', `Starting a conversation with ${displayName}`);
    }
  };

  const handleSelectProperty = (item: AppliedPropertyItem) => {
    navigation.navigate('PropertyDetail', { property: item.detailData });
  };

  const currentList = activeTab === 'applied' ? APPLIED_PROPERTIES : LIKED_PROPERTIES;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#2C56C0" />

      {/* ── Edit Profile Modal ─────────────────────────────────────────── */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.editModalContainer}
        >
          <View style={styles.editModalContent}>
            {/* Modal Header */}
            <View style={styles.editModalHeader}>
              <Text style={styles.editModalTitle}>Edit Profile</Text>
              <TouchableOpacity
                onPress={() => setIsEditModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* Profile Avatar Change */}
              <View style={styles.editAvatarSection}>
                <TouchableOpacity
                  style={styles.editAvatarWrapper}
                  activeOpacity={0.8}
                  onPress={() => setShowImageSourcePicker(true)}
                >
                  {editPhotoURL ? (
                    <Image source={{ uri: editPhotoURL }} style={styles.editAvatarImage} />
                  ) : (
                    <View style={[styles.editAvatarImage, styles.avatarPlaceholder]}>
                      <Ionicons name="person" size={48} color="#94A3B8" />
                    </View>
                  )}
                  <View style={styles.editAvatarCameraBadge}>
                    <Ionicons name="camera" size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowImageSourcePicker(true)}
                  style={{ marginTop: 8 }}
                >
                  <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                </TouchableOpacity>
              </View>

              {/* Input Fields */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Full Name</Text>
                <TextInput
                  style={[styles.formInput, !!formErrors.fullName && styles.formInputError]}
                  value={editName}
                  onChangeText={(val) => {
                    setEditName(val);
                    if (formErrors.fullName) setFormErrors((prev) => ({ ...prev, fullName: '' }));
                  }}
                  placeholder="Your full name"
                  placeholderTextColor="#9CA3AF"
                />
                {!!formErrors.fullName && (
                  <Text style={styles.formErrorText}>{formErrors.fullName}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number</Text>
                <TextInput
                  style={[styles.formInput, !!formErrors.phone && styles.formInputError]}
                  value={editPhone}
                  onChangeText={(val) => {
                    setEditPhone(val);
                    if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  placeholder="(+1) 555-0199"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
                {!!formErrors.phone && (
                  <Text style={styles.formErrorText}>{formErrors.phone}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Location</Text>
                <TextInput
                  style={[styles.formInput, !!formErrors.location && styles.formInputError]}
                  value={editLocation}
                  onChangeText={(val) => {
                    setEditLocation(val);
                    if (formErrors.location) setFormErrors((prev) => ({ ...prev, location: '' }));
                  }}
                  placeholder="e.g. New York, USA"
                  placeholderTextColor="#9CA3AF"
                />
                {!!formErrors.location && (
                  <Text style={styles.formErrorText}>{formErrors.location}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Status / Bio</Text>
                <TextInput
                  style={styles.formInput}
                  value={editStatus}
                  onChangeText={setEditStatus}
                  placeholder="e.g. 10 Applied | Archen"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Save & Cancel Buttons */}
              <View style={styles.editModalButtonsRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsEditModalVisible(false)}
                  activeOpacity={0.7}
                  disabled={saving}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.saveButton, saving && { opacity: 0.7 }]}
                  onPress={handleSaveProfile}
                  activeOpacity={0.85}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Image Source Selector Modal ────────────────────────────────── */}
      <Modal
        visible={showImageSourcePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageSourcePicker(false)}
      >
        <TouchableOpacity
          style={styles.imagePickerBackdrop}
          activeOpacity={1}
          onPress={() => setShowImageSourcePicker(false)}
        >
          <View style={styles.imagePickerSheet} onStartShouldSetResponder={() => true}>
            <Text style={styles.imagePickerTitle}>Select Profile Photo</Text>

            <TouchableOpacity
              style={styles.imagePickerOption}
              onPress={handleTakePhoto}
              activeOpacity={0.7}
            >
              <Ionicons name="camera-outline" size={22} color="#2C56C0" />
              <Text style={styles.imagePickerOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imagePickerOption}
              onPress={handlePickImage}
              activeOpacity={0.7}
            >
              <Ionicons name="images-outline" size={22} color="#2C56C0" />
              <Text style={styles.imagePickerOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            {editPhotoURL && (
              <TouchableOpacity
                style={styles.imagePickerOption}
                onPress={() => {
                  setEditPhotoURL(null);
                  setShowImageSourcePicker(false);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={22} color="#EF4444" />
                <Text style={[styles.imagePickerOptionText, { color: '#EF4444' }]}>Remove Photo</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.imagePickerOption, { borderBottomWidth: 0, marginTop: 4 }]}
              onPress={() => setShowImageSourcePicker(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.imagePickerOptionText, { color: '#6B7280', fontWeight: '700', textAlign: 'center', width: '100%' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Blue Curved Header Banner ─────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerTopBar}>
            <View style={styles.headerSpacer} />
            <Text style={styles.headerUserName}>{displayName}</Text>
            <TouchableOpacity 
              style={styles.headerLogoutBtn} 
              onPress={handleSignOut}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={20} color="rgba(255,255,255,0.85)" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>Account</Text>
        </View>

        {/* ── Profile Avatar Section (Overlapping) ────────────────────────── */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            {photoURL ? (
              <Image
                source={{ uri: photoURL }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={50} color="#94A3B8" />
              </View>
            )}
            <TouchableOpacity
              style={styles.plusBadge}
              activeOpacity={0.8}
              onPress={openEditModal}
            >
              <Ionicons name="pencil" size={16} color="#2C56C0" />
            </TouchableOpacity>
          </View>

          {/* Subtitle / Status */}
          <Text style={styles.userSubtitle}>{displayStatus}</Text>
        </View>

        {/* ── Action Buttons (Call Me / Message Me) ─────────────────────── */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.callButton}
            activeOpacity={0.8}
            onPress={handleCall}
          >
            <Ionicons name="call-outline" size={17} color="#2C56C0" />
            <Text style={styles.callButtonText}>Call Me</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.messageButton}
            activeOpacity={0.85}
            onPress={handleMessage}
          >
            <Ionicons name="mail-outline" size={17} color="#FFFFFF" />
            <Text style={styles.messageButtonText}>Message Me</Text>
          </TouchableOpacity>
        </View>

        {/* ── User Information Card ─────────────────────────────────────── */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{displayEmail}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{displayLocation}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone No</Text>
            <Text style={styles.infoValue}>{displayPhone}</Text>
          </View>
        </View>

        {/* ── Tab Selector (Applied / Liked) ────────────────────────────── */}
        <View style={styles.tabSelectorRow}>
          <TouchableOpacity
            style={[
              styles.tabPill,
              activeTab === 'applied' && styles.tabPillActive,
            ]}
            onPress={() => setActiveTab('applied')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabPillText,
                activeTab === 'applied' && styles.tabPillTextActive,
              ]}
            >
              Applied ({APPLIED_PROPERTIES.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabPill,
              activeTab === 'liked' && styles.tabPillActive,
            ]}
            onPress={() => setActiveTab('liked')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabPillText,
                activeTab === 'liked' && styles.tabPillTextActive,
              ]}
            >
              Liked
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Property Cards List ───────────────────────────────────────── */}
        <View style={styles.propertiesList}>
          {currentList.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.propertyCard}
              activeOpacity={0.85}
              onPress={() => handleSelectProperty(item)}
            >
              {/* Thumbnail Image */}
              <Image source={item.image} style={styles.propertyImage} />

              {/* Property Info */}
              <View style={styles.propertyInfo}>
                {/* Badges Row: Price & Rating */}
                <View style={styles.badgesRow}>
                  <View style={styles.priceBadge}>
                    <Text style={styles.priceBadgeText}>{item.price}</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingBadgeText}>{item.rating}</Text>
                  </View>
                </View>

                {/* Title & Location */}
                <Text style={styles.propertyTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.propertyLocation} numberOfLines={1}>
                  {item.location}
                </Text>

                {/* Bottom Meta: Distance & Status */}
                <View style={styles.metaRow}>
                  <View style={styles.distanceItem}>
                    <Ionicons
                      name="location-sharp"
                      size={12}
                      color="#2C56C0"
                      style={styles.pinIcon}
                    />
                    <Text style={styles.distanceText}>{item.distance}</Text>
                  </View>
                  <View style={styles.statusItem}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: item.statusColor },
                      ]}
                    />
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* ── Bottom Navigation Footer ────────────────────────────────────── */}
      <Footer activeTab="Account" />
    </View>
  );
}

export default Account;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAFAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  // ── Header Banner ────────────────────────────────────────────────────────
  header: {
    backgroundColor: '#2C56C0',
    paddingTop: Platform.OS === 'ios' ? 48 : 36,
    paddingBottom: 68,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTopBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerSpacer: {
    width: 24,
  },
  headerUserName: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  headerLogoutBtn: {
    padding: 4,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginTop: 2,
  },

  // ── Profile Section ──────────────────────────────────────────────────────
  profileSection: {
    alignItems: 'center',
    marginTop: -52,
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 102,
    height: 102,
    borderRadius: 51,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#E2E8F0',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  plusBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    letterSpacing: 0.2,
  },

  // ── Action Buttons ───────────────────────────────────────────────────────
  actionButtonsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  callButton: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  callButtonText: {
    color: '#2C56C0',
    fontSize: 14,
    fontWeight: '600',
  },
  messageButton: {
    flex: 1,
    height: 44,
    backgroundColor: '#2C56C0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#2C56C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  messageButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Info Card ────────────────────────────────────────────────────────────
  infoCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 4,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  infoValue: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
  },

  // ── Tab Selector ─────────────────────────────────────────────────────────
  tabSelectorRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  tabPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  tabPillActive: {
    backgroundColor: '#EEF4FF',
  },
  tabPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabPillTextActive: {
    color: '#2C56C0',
    fontWeight: '700',
  },

  // ── Property Cards List ──────────────────────────────────────────────────
  propertiesList: {
    paddingBottom: 8,
  },
  propertyCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  propertyImage: {
    width: 96,
    height: 88,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  propertyInfo: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceBadge: {
    backgroundColor: '#2C56C0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priceBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  ratingBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 3,
  },
  propertyLocation: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  distanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIcon: {
    marginRight: 3,
  },
  distanceText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },

  // ── Edit Profile Modal Styles ─────────────────────────────────────────────
  editModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  editModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: '90%',
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  editAvatarSection: {
    alignItems: 'center',
    marginVertical: 18,
  },
  editAvatarWrapper: {
    position: 'relative',
  },
  editAvatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#2C56C0',
    backgroundColor: '#E2E8F0',
  },
  editAvatarCameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2C56C0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  changePhotoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C56C0',
  },
  formGroup: {
    marginBottom: 14,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#FAFAFC',
  },
  formInputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  formErrorText: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 2,
    fontWeight: '500',
  },
  editModalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 2,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#2C56C0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2C56C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── Image Picker Sheet ───────────────────────────────────────────────────
  imagePickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  imagePickerSheet: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  imagePickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 14,
  },
  imagePickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  imagePickerOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});
