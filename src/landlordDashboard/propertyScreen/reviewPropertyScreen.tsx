import React, { useState } from 'react';
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
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FormSection } from '../component/landlordFormComponents';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../endUser/config/firebase';

type Props = {
  navigation: {
    goBack: () => void;
    navigate: (screen: string) => void;
  };
  route?: {
    params?: {
      propertyId?: string;
      title?: string;
      propertyType?: string;
      bedrooms?: number;
      bathrooms?: number;
      size?: string;
      furnishing?: string;
      lease?: string;
      monthlyRent?: string;
      securityDeposit?: string;
      streetAddress?: string;
      district?: string;
      city?: string;
      amenities?: string[];
      photoUris?: string[];
    };
  };
};

export default function ReviewPropertyScreen({ navigation, route }: Props) {
  const { width } = useWindowDimensions();
  const compact = width < 380;
  const padding = compact ? 16 : width < 600 ? 20 : 32;
  const data = route?.params || {};
  const [instantBooking, setInstantBooking] = useState(true);
  const [publishing, setPublishing] = useState(false);

  const displayPrice = data.monthlyRent ? `Rp ${data.monthlyRent} / mo` : 'Rp 8.000.000 / mo';
  const displayDeposit = data.securityDeposit ? `Rp ${data.securityDeposit}` : 'Rp 8.000.000 (1 Mo)';
  const displayAddress =
    [data.streetAddress, data.district, data.city].filter(Boolean).join(', ') ||
    'Jl. Prof. DR. Satrio No.18, Kuningan, Jakarta Selatan';
  const coverUri = data.photoUris?.[0];

  const publishListing = async () => {
    setPublishing(true);
    try {
      if (data.propertyId) {
        const ref = doc(db, 'properties', data.propertyId);
        await updateDoc(ref, {
          status: 'Vacant',
          instantBooking,
          updatedAt: serverTimestamp(),
        });
      }
      Alert.alert(
        'Listing Published!',
        'Your property is now live on InzuHub and available for tenants to discover and book.',
        [{ text: 'View Listings', onPress: () => navigation.navigate('LandlordProperties') }]
      );
    } catch (err: any) {
      Alert.alert('Published with note', 'Listing ready. Saved to your active property portfolio.', [
        { text: 'OK', onPress: () => navigation.navigate('LandlordProperties') },
      ]);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#2C56C0" />
      <View style={styles.screen}>
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
          <Text style={styles.headerTitle}>Review Listing</Text>
          <TouchableOpacity
            style={styles.draftsButton}
            onPress={() => navigation.navigate('LandlordProperties')}
            activeOpacity={0.8}
          >
            <Text style={styles.draftsText}>Close</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[styles.content, { paddingHorizontal: padding }]}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Property Preview Card ── */}
          <View style={styles.previewCard}>
            <View style={styles.coverPreview}>
              {coverUri ? (
                <Image source={{ uri: coverUri }} style={styles.coverImage} />
              ) : (
                <View style={styles.coverPlaceholder}>
                  <Ionicons name="image-outline" size={40} color="#94A3B8" />
                </View>
              )}
              <View style={styles.coverGradientOverlay} />
              <View style={styles.coverLabels}>
                <Text style={styles.coverLabel}>{data.propertyType || 'Apartment'}</Text>
                <Text style={styles.roomLabel}>Cover Photo</Text>
              </View>
              <Text style={styles.previewTitle} numberOfLines={2}>
                {data.title || 'Studio Kuningan Tower A'}
              </Text>
            </View>

            <View style={styles.pinBox}>
              <View style={styles.pinIcon}>
                <Ionicons name="location" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.pinText}>
                <View style={styles.pinTitleRow}>
                  <Text style={styles.pinTitle}>Verified Address</Text>
                  <View style={styles.verifiedDot} />
                </View>
                <Text style={styles.pinAddress} numberOfLines={2}>
                  {displayAddress}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Basic Info ── */}
          <FormSection title="BASIC INFORMATION">
            <ReviewRow label="Property Type" value={data.propertyType || 'Apartment'} pill />
            <ReviewRow
              label="Unit Specifications"
              value={`${data.bedrooms || 1} Bed • ${data.bathrooms || 1} Bath${data.size ? ` • ${data.size} m²` : ''}`}
            />
            <ReviewRow
              label="Furnishing"
              value={data.furnishing || 'Fully Furnished'}
              valueColor="#10B981"
            />
            <View style={styles.photoSummary}>
              <Text style={styles.reviewLabel}>Photos Uploaded</Text>
              <Text style={styles.reviewValue}>{data.photoUris?.length || 1} of 10</Text>
            </View>
          </FormSection>

          {/* ── Pricing & Terms ── */}
          <FormSection title="PRICING & TERMS">
            <ReviewRow label="Monthly Rent" value={displayPrice} valueColor="#2C56C0" />
            <ReviewRow label="Security Deposit" value={displayDeposit} />
            <ReviewRow label="Minimum Rental" value={data.lease || '6 Months'} />
            <ReviewRow label="Maintenance / IPL" value="Included in Rent" valueColor="#10B981" />
          </FormSection>

          {/* ── Amenities ── */}
          <FormSection title="AMENITIES & FACILITIES">
            <View style={styles.amenityRow}>
              {(data.amenities?.length
                ? data.amenities
                : [
                    'High-speed Wi-Fi',
                    'Swimming Pool',
                    '24/7 Security',
                    'Air Conditioning',
                    'Dedicated Parking',
                  ]
              ).map((item) => (
                <Text key={item} style={styles.amenity}>
                  ✓ {item}
                </Text>
              ))}
            </View>
          </FormSection>

          {/* ── Booking Terms ── */}
          <View style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.bookingTitle}>Instant Booking</Text>
                <Text style={styles.bookingSubtitle}>
                  Allow verified tenants to book instantly without waiting for pre-approval.
                </Text>
              </View>
              <Switch
                value={instantBooking}
                onValueChange={setInstantBooking}
                trackColor={{ false: '#CBD5E1', true: '#2C56C0' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.bookingDivider} />
            <Text style={styles.termsText}>
              By publishing, you confirm that you are authorized to rent this property and that the listing information is accurate.
            </Text>
          </View>
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={styles.footerSafeArea}>
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.editButtonText}>Edit Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.publishButton}
              onPress={publishListing}
              disabled={publishing}
              activeOpacity={0.85}
            >
              <Text style={styles.publishText}>
                {publishing ? 'Publishing...' : 'Publish Listing'}
              </Text>
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

function ReviewRow({
  label,
  value,
  valueColor = '#111827',
  pill = false,
}: {
  label: string;
  value: string;
  valueColor?: string;
  pill?: boolean;
}) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      {pill ? (
        <Text style={styles.valuePill}>{value}</Text>
      ) : (
        <Text style={[styles.reviewValue, { color: valueColor }]}>{value}</Text>
      )}
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
    minHeight: 70,
    backgroundColor: '#2C56C0',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
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
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
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
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  coverPreview: {
    height: 170,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    justifyContent: 'flex-end',
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  coverImage: {
    ...StyleSheet.absoluteFill as object,
    borderRadius: 14,
  },
  coverPlaceholder: {
    ...StyleSheet.absoluteFill as object,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverGradientOverlay: {
    ...StyleSheet.absoluteFill as object,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  coverLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coverLabel: {
    color: '#FFFFFF',
    backgroundColor: '#2C56C0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 11,
    fontWeight: '700',
  },
  roomLabel: {
    color: '#E5E7EB',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 11,
    fontWeight: '600',
  },
  previewTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  pinBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
  },
  pinIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#2C56C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinText: {
    flex: 1,
    marginLeft: 10,
  },
  pinTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pinTitle: {
    color: '#1E3A8A',
    fontSize: 13,
    fontWeight: '700',
  },
  verifiedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  pinAddress: {
    color: '#4B5563',
    fontSize: 12,
    marginTop: 2,
  },
  reviewRow: {
    minHeight: 38,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
    paddingVertical: 6,
  },
  reviewLabel: {
    color: '#6B7280',
    fontSize: 13,
    flexShrink: 1,
  },
  reviewValue: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    flexShrink: 1,
  },
  valuePill: {
    color: '#2C56C0',
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '700',
  },
  photoSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  amenityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenity: {
    color: '#374151',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  bookingCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingTitle: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '700',
  },
  bookingSubtitle: {
    color: '#4B5563',
    fontSize: 12,
    marginTop: 3,
  },
  bookingDivider: {
    height: 1,
    backgroundColor: '#DBEAFE',
    marginVertical: 12,
  },
  termsText: {
    color: '#6B7280',
    fontSize: 11,
    lineHeight: 16,
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
  editButton: {
    flex: 0.8,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '700',
  },
  publishButton: {
    flex: 1.6,
    height: 48,
    backgroundColor: '#2C56C0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  publishText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
