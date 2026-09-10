import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LandlordStackParamList } from './landlordTypes';

const BLUE = '#2956C2';
const BG_COLOR = '#F4F6F9';

type PropertyType = 'Apartment' | 'House' | 'Villa' | 'Kost / Room' | 'Commercial';
type FurnishingType = 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished';
type LeasePeriodType = '3 Months' | '6 Months' | '1 Year';

interface PhotoItem {
  id: string;
  label: string;
  isCover?: boolean;
  color: string;
}

export default function CreateProperty() {
  const navigation = useNavigation<NativeStackNavigationProp<LandlordStackParamList>>();

  // ── Form State ────────────────────────────────────────────────────────────
  const [photos, setPhotos] = useState<PhotoItem[]>([
    { id: '1', label: 'Living Room', isCover: true, color: '#CBD5E1' },
    { id: '2', label: 'Master Bed', color: '#FDE68A' },
  ]);

  const [title, setTitle] = useState('Studio Kuningan Tower A');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [streetAddress, setStreetAddress] = useState('Jl. Prof. DR. Satrio No.18, Kuningan');
  const [district, setDistrict] = useState('Setiabudi');
  const [city, setCity] = useState('Jakarta Selatan');

  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [size, setSize] = useState('36');
  const [floorLevel, setFloorLevel] = useState('15th Floor');
  const [furnishing, setFurnishing] = useState<FurnishingType>('Fully Furnished');

  const [monthlyRent, setMonthlyRent] = useState('6.500.000');
  const [securityDeposit, setSecurityDeposit] = useState('5.000.000');
  const [leasePeriod, setLeasePeriod] = useState<LeasePeriodType>('6 Months');

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'High-speed Wi-Fi',
    'Air Conditioning',
    '24/7 Security',
  ]);

  const allAmenities = [
    'High-speed Wi-Fi',
    'Air Conditioning',
    '24/7 Security',
    'Swimming Pool',
    'Gym / Fitness',
    'Dedicated Parking',
  ];

  const propertyTypes: PropertyType[] = ['Apartment', 'House', 'Villa', 'Kost / Room', 'Commercial'];
  const furnishingOptions: FurnishingType[] = ['Fully Furnished', 'Semi-Furnished', 'Unfurnished'];
  const leaseOptions: LeasePeriodType[] = ['3 Months', '6 Months', '1 Year'];

  // ── Handlers ──────────────────────────────────────────────────────────────
  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const removePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  const addPhoto = () => {
    if (photos.length >= 10) {
      Alert.alert('Limit Reached', 'Maximum 10 photos allowed.');
      return;
    }
    const newId = (photos.length + 1).toString();
    const newPhoto: PhotoItem = {
      id: newId,
      label: `Photo ${newId}`,
      color: '#E2E8F0',
    };
    setPhotos([...photos, newPhoto]);
  };

  const handleSaveDraft = () => {
    Alert.alert('Draft Saved', 'Your listing draft has been saved successfully.');
  };

  const handleContinue = () => {
    Alert.alert('Ready to Review', 'Listing details ready. Proceeding to review summary.');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        {/* Header Content */}
        <View style={styles.headerNav}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerSubtitle}>NEW LISTING</Text>
            <Text style={styles.headerTitle}>Add Property</Text>
          </View>

          <TouchableOpacity style={styles.draftsButton} activeOpacity={0.8}>
            <Text style={styles.draftsText}>Drafts</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── MAIN SCROLL CONTENT ────────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. PROPERTY PHOTOS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Property Photos</Text>
              <Text style={styles.cardSubtitle}>Add at least 3 high quality photos</Text>
            </View>
            <View style={styles.photoCountBadge}>
              <Text style={styles.photoCountText}>{photos.length} / 10 added</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
            {/* Add Photo Button */}
            <TouchableOpacity style={styles.addPhotoBox} onPress={addPhoto} activeOpacity={0.7}>
              <View style={styles.addPhotoIconCircle}>
                <Ionicons name="add" size={18} color={BLUE} />
              </View>
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>

            {/* Photo Previews */}
            {photos.map((photo) => (
              <View
                key={photo.id}
                style={[styles.photoCard, { backgroundColor: photo.color }]}
              >
                {photo.isCover && (
                  <View style={styles.coverBadge}>
                    <Text style={styles.coverBadgeText}>Cover</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.photoCloseBtn}
                  onPress={() => removePhoto(photo.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={12} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.photoLabelText}>{photo.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 2. BASIC INFORMATION CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Basic Information</Text>

          {/* Listing Title */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Listing Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Studio Kuningan Tower A"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Property Type */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Property Type</Text>
            <View style={styles.pillsWrap}>
              {propertyTypes.map((type) => {
                const isSelected = propertyType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.pill, isSelected && styles.pillActive]}
                    onPress={() => setPropertyType(type)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Street Address */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Street Address</Text>
            <TextInput
              style={styles.input}
              value={streetAddress}
              onChangeText={setStreetAddress}
              placeholder="Street address"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* District & City Row */}
          <View style={styles.twoColumnRow}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              value={district}
              onChangeText={setDistrict}
              placeholder="District"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              value={city}
              onChangeText={setCity}
              placeholder="City"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Pin Verified Card */}
          <View style={styles.pinCard}>
            <View style={styles.pinIconCircle}>
              <Ionicons name="location" size={18} color="#fff" />
            </View>
            <View style={styles.pinInfo}>
              <Text style={styles.pinTitle}>Pin Verified</Text>
              <Text style={styles.pinSubtitle}>Jakarta Selatan, DKI Jakarta</Text>
            </View>
            <TouchableOpacity style={styles.editPinBtn} activeOpacity={0.7}>
              <Text style={styles.editPinText}>Edit Pin</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. SPECIFICATIONS CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Specifications</Text>

          {/* Steppers Row: Bedrooms & Bathrooms */}
          <View style={styles.twoColumnRow}>
            {/* Bedrooms */}
            <View style={styles.specBox}>
              <Text style={styles.specBoxLabel}>Bedrooms</Text>
              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setBedrooms(Math.max(1, bedrooms - 1))}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={16} color="#4B5563" />
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{bedrooms}</Text>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setBedrooms(bedrooms + 1)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={16} color="#4B5563" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Bathrooms */}
            <View style={styles.specBox}>
              <Text style={styles.specBoxLabel}>Bathrooms</Text>
              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setBathrooms(Math.max(1, bathrooms - 1))}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={16} color="#4B5563" />
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{bathrooms}</Text>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setBathrooms(bathrooms + 1)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={16} color="#4B5563" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Size & Floor Level Row */}
          <View style={styles.twoColumnRow}>
            {/* Size */}
            <View style={styles.halfInputWrap}>
              <Text style={styles.fieldLabel}>Size (m²)</Text>
              <View style={styles.inputWithSuffix}>
                <TextInput
                  style={styles.inputSuffixField}
                  value={size}
                  onChangeText={setSize}
                  keyboardType="numeric"
                  placeholder="36"
                  placeholderTextColor="#9CA3AF"
                />
                <Text style={styles.inputSuffixText}>m²</Text>
              </View>
            </View>

            {/* Floor Level */}
            <View style={styles.halfInputWrap}>
              <Text style={styles.fieldLabel}>Floor Level</Text>
              <TextInput
                style={styles.input}
                value={floorLevel}
                onChangeText={setFloorLevel}
                placeholder="e.g. 15th Floor"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Furnishing */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Furnishing</Text>
            <View style={styles.pillsWrap}>
              {furnishingOptions.map((opt) => {
                const isSelected = furnishing === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.pill, isSelected && styles.pillActive]}
                    onPress={() => setFurnishing(opt)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* 4. RENTAL TERMS & PRICING CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rental Terms & Pricing</Text>

          {/* Monthly Rent */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Monthly Rent</Text>
            <View style={styles.rentInputWrap}>
              <TextInput
                style={styles.rentInputField}
                value={monthlyRent}
                onChangeText={setMonthlyRent}
                keyboardType="numeric"
                placeholder="6.500.000"
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.rentSuffixText}>/ month</Text>
            </View>
          </View>

          {/* Security Deposit */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Security Deposit</Text>
            <TextInput
              style={styles.input}
              value={securityDeposit}
              onChangeText={setSecurityDeposit}
              keyboardType="numeric"
              placeholder="5.000.000"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Minimum Lease Period */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Minimum Lease Period</Text>
            <View style={styles.leasePillsRow}>
              {leaseOptions.map((period) => {
                const isSelected = leasePeriod === period;
                return (
                  <TouchableOpacity
                    key={period}
                    style={[styles.leasePill, isSelected && styles.leasePillActive]}
                    onPress={() => setLeasePeriod(period)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.leasePillText, isSelected && styles.leasePillTextActive]}>
                      {period}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* 5. AMENITIES & FEATURES CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Amenities & Features</Text>
          <View style={styles.amenitiesWrap}>
            {allAmenities.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity);
              return (
                <TouchableOpacity
                  key={amenity}
                  style={[styles.amenityChip, isSelected && styles.amenityChipSelected]}
                  onPress={() => toggleAmenity(amenity)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.amenityChipText, isSelected && styles.amenityChipTextSelected]}
                  >
                    {isSelected ? `✓  ${amenity}` : `+  ${amenity}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── BOTTOM FIXED ACTION BAR ────────────────────────────────────── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.saveDraftBtn}
          onPress={handleSaveDraft}
          activeOpacity={0.8}
        >
          <Text style={styles.saveDraftText}>Save Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueText}>Continue to Review</Text>
          <Ionicons name="chevron-forward" size={16} color="#fff" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BLUE,
  },
  scrollView: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 16,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    backgroundColor: BLUE,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  draftsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  draftsText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },

  // ── Card Styles ─────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFF2F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  photoCountBadge: {
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  photoCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: BLUE,
  },

  // ── Photo Scroll ────────────────────────────────────────────────────────
  photoScroll: {
    flexDirection: 'row',
    marginTop: 4,
  },
  addPhotoBox: {
    width: 90,
    height: 90,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    borderStyle: 'dashed',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  addPhotoIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  addPhotoText: {
    fontSize: 11,
    fontWeight: '600',
    color: BLUE,
  },
  photoCard: {
    width: 90,
    height: 90,
    borderRadius: 14,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 6,
  },
  coverBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#374151',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  coverBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  photoCloseBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4B5563',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    marginTop: 18,
    textAlign: 'center',
  },

  // ── Fields & Inputs ─────────────────────────────────────────────────────
  fieldGroup: {
    marginTop: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111827',
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  halfInput: {
    flex: 1,
  },
  halfInputWrap: {
    flex: 1,
  },
  inputWithSuffix: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  inputSuffixField: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111827',
  },
  inputSuffixText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },

  // ── Pills (Property Type, Furnishing) ───────────────────────────────────
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pillActive: {
    backgroundColor: BLUE,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  pillTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  // ── Pin Verified Box ────────────────────────────────────────────────────
  pinCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  pinIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  pinInfo: {
    flex: 1,
  },
  pinTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  pinSubtitle: {
    fontSize: 11,
    color: '#60A5FA',
    marginTop: 1,
  },
  editPinBtn: {
    borderWidth: 1,
    borderColor: '#93C5FD',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  editPinText: {
    fontSize: 11,
    fontWeight: '600',
    color: BLUE,
  },

  // ── Steppers (Bedrooms / Bathrooms) ─────────────────────────────────────
  specBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
  },
  specBoxLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  // ── Pricing & Rent ──────────────────────────────────────────────────────
  rentInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  rentInputField: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  rentSuffixText: {
    fontSize: 12,
    color: '#6B7280',
  },
  leasePillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  leasePill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  leasePillActive: {
    backgroundColor: BLUE,
  },
  leasePillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  leasePillTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  // ── Amenities Chips ─────────────────────────────────────────────────────
  amenitiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  amenityChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  amenityChipSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  amenityChipText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
  },
  amenityChipTextSelected: {
    color: BLUE,
    fontWeight: '700',
  },

  // ── Bottom Fixed Bar ────────────────────────────────────────────────────
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  saveDraftBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveDraftText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  continueBtn: {
    flex: 2,
    backgroundColor: BLUE,
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  continueText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
});
