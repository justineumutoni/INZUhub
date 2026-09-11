import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { FormField, FormSection, ChoicePill, Stepper } from '../component/landlordFormComponents';
import { auth, db } from '../../endUser/config/firebase';

type Props = {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: object) => void;
  };
};

const propertyTypes = ['Apartment', 'House', 'Villa', 'Kost / Room', 'Commercial'];
const furnishings = ['Fully Furnished', 'Semi-Furnished', 'Unfurnished'];
const leaseOptions = ['3 Months', '6 Months', '1 Year'];
const amenities = [
  'High-speed Wi-Fi',
  'Air Conditioning',
  '24/7 Security',
  'Swimming Pool',
  'Gym / Fitness',
  'Dedicated Parking',
];

export default function AddPropertyScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const compact = width < 380;
  const [title, setTitle] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [size, setSize] = useState('');
  const [floorLevel, setFloorLevel] = useState('');
  const [furnishing, setFurnishing] = useState('Fully Furnished');
  const [lease, setLease] = useState('6 Months');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'High-speed Wi-Fi',
    'Air Conditioning',
    '24/7 Security',
  ]);
  const [savedAsDraft, setSavedAsDraft] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((current) =>
      current.includes(amenity) ? current.filter((item) => item !== amenity) : [...current, amenity]
    );
  };

  const pickPhotos = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow photo access to add property images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotoUris((current) => [...current, ...result.assets.map((asset) => asset.uri)].slice(0, 10));
    }
  };

  const saveProperty = async (status: 'Draft' | 'Pending Review') => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Sign in required', 'Please sign in before adding a property.');
      return null;
    }
    if (!title.trim()) {
      Alert.alert('Listing title required', 'Add a title before saving this property.');
      return null;
    }

    setSaving(true);
    try {
      const propertyId = `property-${user.uid}-${Date.now()}`;
      const propertyRef = doc(db, 'properties', propertyId);
      await setDoc(propertyRef, {
        id: propertyId,
        ownerId: user.uid,
        ownerName: user.displayName || 'Property Landlord',
        ownerPhone: user.phoneNumber || '',
        ownerRole: 'Landlord',
        title: title.trim(),
        propertyType,
        price: monthlyRent.trim() ? `Rp ${monthlyRent.trim()}` : 'Rp 5.000.000',
        period: '/ per month',
        securityDeposit: securityDeposit.trim() ? `Rp ${securityDeposit.trim()}` : '0',
        location: city.trim() || 'Jakarta Selatan',
        subLocation: district.trim() || streetAddress.trim() || 'Jakarta',
        address: streetAddress.trim(),
        status,
        bedrooms,
        bathrooms,
        size: size.trim(),
        floorLevel: floorLevel.trim(),
        furnishing,
        minimumLease: lease,
        facilities: selectedAmenities,
        heroImageUrl: photoUris[0] || '',
        galleryImageUrls: photoUris,
        extraPhotosCount: Math.max(photoUris.length - 1, 0),
        appliedCount: 0,
        viewsCount: 0,
        description: `${propertyType} for rent with ${bedrooms} bedroom(s) and ${bathrooms} bathroom(s).`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return propertyId;
    } catch (error: any) {
      Alert.alert('Save failed', error?.message || 'Could not save the property to Firestore.');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const saveDraft = async () => {
    const propertyId = await saveProperty('Draft');
    if (propertyId) {
      setSavedAsDraft(true);
      Alert.alert('Draft Saved', 'Your property listing was saved as a draft.');
    }
  };

  const continueToReview = () => {
    if (!title.trim()) {
      Alert.alert('Title Required', 'Please enter a listing title before continuing.');
      return;
    }
    saveProperty('Pending Review').then((propertyId) => {
      if (!propertyId) return;
      navigation.navigate('ReviewProperty', {
        propertyId,
        title: title.trim(),
        propertyType,
        bedrooms,
        bathrooms,
        size: size.trim(),
        furnishing,
        lease,
        monthlyRent: monthlyRent.trim() || '8.000.000',
        securityDeposit: securityDeposit.trim() || '8.000.000',
        streetAddress: streetAddress.trim(),
        district: district.trim(),
        city: city.trim(),
        amenities: selectedAmenities,
        photoUris,
      });
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#2C56C0" />
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* ── Top Curved Hero ── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.eyebrow}>NEW LISTING</Text>
            <Text style={styles.headerTitle}>Add Property</Text>
          </View>
          <TouchableOpacity style={styles.draftsButton} onPress={saveDraft} activeOpacity={0.8}>
            <Text style={styles.draftsText}>{savedAsDraft ? 'Saved' : 'Save Draft'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingHorizontal: compact ? 16 : width < 600 ? 20 : 32 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <FormSection title="Property Photos">
            <Text style={styles.helperText}>Add at least 1 high quality photo (cover image)</Text>
            <View style={styles.photoRow}>
              <TouchableOpacity style={styles.addPhoto} onPress={pickPhotos} activeOpacity={0.8}>
                <View style={styles.plusCircle}>
                  <Ionicons name="camera-outline" size={22} color="#2C56C0" />
                </View>
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
              {photoUris.length > 0 && (
                <PhotoSlot
                  label="Cover"
                  uri={photoUris[0]}
                  cover
                  onRemove={() => setPhotoUris((current) => current.slice(1))}
                />
              )}
              {photoUris.length > 1 && (
                <PhotoSlot
                  label="Photo 2"
                  uri={photoUris[1]}
                  onRemove={() => setPhotoUris((current) => current.filter((_, index) => index !== 1))}
                />
              )}
            </View>
          </FormSection>

          <FormSection title="Basic Information">
            <FormField
              label="Listing Title"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Studio Kuningan Tower A"
            />
            <Text style={[styles.fieldLabel, styles.typeLabel]}>Property Type</Text>
            <View style={styles.pillRow}>
              {propertyTypes.map((type) => (
                <ChoicePill
                  key={type}
                  label={type}
                  selected={propertyType === type}
                  onPress={() => setPropertyType(type)}
                />
              ))}
            </View>
            <FormField
              label="Street Address"
              value={streetAddress}
              onChangeText={setStreetAddress}
              placeholder="e.g. Jl. Prof. DR. Satrio No.18, Kuningan"
            />
            <View style={styles.twoColumns}>
              <FormField
                label="District"
                value={district}
                onChangeText={setDistrict}
                placeholder="Setiabudi"
                style={styles.column}
              />
              <FormField
                label="City"
                value={city}
                onChangeText={setCity}
                placeholder="Jakarta Selatan"
                style={styles.column}
              />
            </View>
          </FormSection>

          <FormSection title="Specifications">
            <View style={styles.twoColumns}>
              <View style={styles.column}>
                <Text style={styles.fieldLabel}>Bedrooms</Text>
                <Stepper
                  value={bedrooms}
                  onMinus={() => setBedrooms(Math.max(0, bedrooms - 1))}
                  onPlus={() => setBedrooms(bedrooms + 1)}
                />
              </View>
              <View style={styles.column}>
                <Text style={styles.fieldLabel}>Bathrooms</Text>
                <Stepper
                  value={bathrooms}
                  onMinus={() => setBathrooms(Math.max(0, bathrooms - 1))}
                  onPlus={() => setBathrooms(bathrooms + 1)}
                />
              </View>
            </View>
            <View style={styles.twoColumns}>
              <FormField
                label="Size (m²)"
                value={size}
                onChangeText={setSize}
                placeholder="36"
                style={styles.column}
                keyboardType="numeric"
              />
              <FormField
                label="Floor Level"
                value={floorLevel}
                onChangeText={setFloorLevel}
                placeholder="15th Floor"
                style={styles.column}
              />
            </View>
            <Text style={styles.fieldLabel}>Furnishing</Text>
            <View style={styles.pillRow}>
              {furnishings.map((item) => (
                <ChoicePill
                  key={item}
                  label={item}
                  selected={furnishing === item}
                  onPress={() => setFurnishing(item)}
                />
              ))}
            </View>
          </FormSection>

          <FormSection title="Rental Terms & Pricing">
            <FormField
              label="Monthly Rent (Rp)"
              value={monthlyRent}
              onChangeText={setMonthlyRent}
              placeholder="6.500.000"
              keyboardType="numeric"
            />
            <FormField
              label="Security Deposit (Rp)"
              value={securityDeposit}
              onChangeText={setSecurityDeposit}
              placeholder="5.000.000"
              keyboardType="numeric"
            />
            <Text style={styles.fieldLabel}>Minimum Lease Period</Text>
            <View style={styles.pillRow}>
              {leaseOptions.map((item) => (
                <ChoicePill
                  key={item}
                  label={item}
                  selected={lease === item}
                  onPress={() => setLease(item)}
                />
              ))}
            </View>
          </FormSection>

          <FormSection title="Amenities & Facilities">
            <View style={styles.pillRow}>
              {amenities.map((item) => (
                <ChoicePill
                  key={item}
                  label={`${selectedAmenities.includes(item) ? '✓ ' : '+ '}${item}`}
                  selected={selectedAmenities.includes(item)}
                  onPress={() => toggleAmenity(item)}
                />
              ))}
            </View>
          </FormSection>
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={styles.footerSafeArea}>
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.saveDraftButton}
              onPress={saveDraft}
              disabled={saving}
              activeOpacity={0.8}
            >
              <Text style={styles.saveDraftText}>{saving ? 'Saving...' : 'Draft'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={continueToReview}
              disabled={saving}
              activeOpacity={0.85}
            >
              <Text style={styles.continueText}>{saving ? 'Saving...' : 'Review Listing'}</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function PhotoSlot({
  label,
  uri,
  cover = false,
  onRemove,
}: {
  label: string;
  uri: string;
  cover?: boolean;
  onRemove: () => void;
}) {
  return (
    <View style={styles.photoSlot}>
      <Image source={{ uri }} style={styles.photoImage} />
      {cover && <Text style={styles.coverBadge}>Cover</Text>}
      <TouchableOpacity style={styles.removePhoto} onPress={onRemove} activeOpacity={0.8}>
        <Ionicons name="close" size={14} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.photoLabel}>{label}</Text>
    </View>
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
  header: {
    minHeight: 80,
    backgroundColor: '#2C56C0',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  eyebrow: {
    color: '#DCE7FF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  draftsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
  },
  draftsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    paddingTop: 16,
    paddingBottom: 24,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  helperText: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 14,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  addPhoto: {
    flex: 1,
    minWidth: 0,
    height: 100,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: {
    color: '#2C56C0',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
  },
  photoSlot: {
    flex: 1,
    minWidth: 0,
    height: 100,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    justifyContent: 'flex-end',
    padding: 8,
    position: 'relative',
  },
  photoImage: {
    ...StyleSheet.absoluteFill as object,
    borderRadius: 14,
  },
  photoLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  coverBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    color: '#FFFFFF',
    backgroundColor: '#2C56C0',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 10,
    fontWeight: '700',
  },
  removePhoto: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  typeLabel: {
    marginTop: 14,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  twoColumns: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  column: {
    flex: 1,
    minWidth: 0,
  },
  footerSafeArea: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    gap: 12,
  },
  saveDraftButton: {
    flex: 0.8,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveDraftText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '700',
  },
  continueButton: {
    flex: 1.6,
    height: 48,
    backgroundColor: '#2C56C0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
