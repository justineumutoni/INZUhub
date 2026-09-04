import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Matches the screen params used by this screen and avoids depending on a global
// RootStackParamList type that may not exist in this file's scope.
type RootStackParamList = {
  ConfirmBooking: {
    booking?: ConfirmBookingData;
  } | undefined;
};

// ---- Types -----------------------------------------------------------

export type ConfirmBookingData = {
  propertyId: string;
  title: string;
  subLocation: string;
  heroImage: any;
  rent: number;
  serviceFee: number;
  // total is derived, but can be overridden if you have custom pricing rules
  total?: number;
};

type PaymentMethodId = 'mtn' | 'card';

type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  subLabel: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  // Optional image (e.g. a logo) shown instead of the Ionicons icon.
  // Can be a remote URL string or a local require(...) asset.
  imageUrl?: string;
  imageSource?: any;
};

type ConfirmBookingProps = Partial<
  NativeStackScreenProps<RootStackParamList, 'ConfirmBooking'>
> & {
  booking?: ConfirmBookingData;
  onBack?: () => void;
};

// ---- Static data -------------------------------------------------------

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'mtn',
    label: 'MTN Mobile Money',
    subLabel: 'Pay via mobile wallet',
    icon: 'wallet',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    // Put your MTN logo URL here (or use imageSource with a local require)
    imageUrl: '../../../../../assets/payment/MTN Logo.png', // e.g. 'https://your-cdn.com/mtn-logo.png'
  },
  {
    id: 'card',
    label: 'Credit Card',
    subLabel: 'Visa, Mastercard',
    icon: 'card',
    iconBg: '#DBEAFE',
    iconColor: '#2C56C0',
    // Put your card logo URL here (or use imageSource with a local require)
    imageUrl: '../../../../assets/payment/Credit Card Logo.png', // e.g. 'https://your-cdn.com/card-logo.png'
  },
];

const DEFAULT_BOOKING: ConfirmBookingData = {
  propertyId: '1',
  title: '1 Big Hall at Lalitpur',
  subLocation: 'Jln. Samiri',
  heroImage: require('../../../../../assets/propertyImage.jpg'),
  rent: 8000,
  serviceFee: 200,
};

// ---- Helpers -------------------------------------------------------------

function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-IN')}`;
}

// ---- Component -----------------------------------------------------------

export function ConfirmBooking({ booking, onBack, route, navigation }: ConfirmBookingProps) {
  const activeBooking = booking || route?.params?.booking;
  const data = { ...DEFAULT_BOOKING, ...activeBooking };
  const total = data.total ?? data.rent + data.serviceFee;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>('mtn');
  // Tracks which payment method images failed to load, so we can gracefully
  // fall back to the Ionicons icon instead of showing a broken image.
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  };

  const handlePayNow = () => {
    Alert.alert(
      'Confirm Payment',
      `Pay ${formatCurrency(total)} for property #${data.propertyId} using ${
        PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label
      }?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: () => {
            // TODO: call your booking/payment API here, passing data.propertyId
            Alert.alert('Success', 'Your payment was processed and booking confirmed!');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="chevron-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        <View style={styles.backButtonSpacer} />
      </View>
      <View style={styles.headerDivider} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Property Summary Card */}
        <View style={styles.card}>
          <View style={styles.propertyRow}>
            <Image source={data.heroImage} style={styles.propertyImage} resizeMode="cover" />
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyTitle} numberOfLines={2}>
                {data.title}
              </Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={13} color="#9CA3AF" style={styles.locationIcon} />
                <Text style={styles.locationText}>{data.subLocation}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Price Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Price Details</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Rent (1 Month)</Text>
            <Text style={styles.priceValue}>{formatCurrency(data.rent)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.priceValue}>{formatCurrency(data.serviceFee)}</Text>
          </View>

          <View style={styles.priceDivider} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <Text style={styles.sectionHeading}>Payment Method</Text>

        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;

          // Prefer a local asset (imageSource) over a remote URL (imageUrl).
          // Fall back to the Ionicons icon if no image is provided, or if
          // the remote image failed to load.
          const hasImage =
            (method.imageSource || (method.imageUrl && method.imageUrl.length > 0)) &&
            !failedImages[method.id];

          return (
            <TouchableOpacity
              key={method.id}
              style={[styles.paymentCard, isSelected && styles.paymentCardSelected]}
              onPress={() => setSelectedMethod(method.id)}
              activeOpacity={0.8}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${method.label}, ${method.subLabel}`}
            >
              <View style={[styles.paymentIconWrap, { backgroundColor: method.iconBg }]}>
                {hasImage ? (
                  <Image
                    source={
                      method.imageSource ? method.imageSource : { uri: method.imageUrl }
                    }
                    style={styles.paymentIconImage}
                    resizeMode="contain"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [method.id]: true }))
                    }
                  />
                ) : (
                  <Ionicons name={method.icon} size={18} color={method.iconColor} />
                )}
              </View>

              <View style={styles.paymentTextWrap}>
                <Text style={styles.paymentLabel}>{method.label}</Text>
                <Text style={styles.paymentSubLabel}>{method.subLabel}</Text>
              </View>

              <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Pay Now Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayNow}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Text style={styles.payButtonText}>Pay Now - {formatCurrency(total)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ---- Styles ----------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 4,
    paddingBottom: 12,
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
    color: '#1E293B',
  },
  headerDivider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: '#D1D5DB',
    marginHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 16,
  },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  propertyImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  propertyInfo: {
    flex: 1,
    gap: 4,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 3,
  },
  locationText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  cardHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  priceLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2C56C0',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  paymentCardSelected: {
    borderColor: '#2C56C0',
    backgroundColor: '#F5F7FF',
  },
  paymentIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  paymentIconImage: {
    width: 22,
    height: 22,
    borderRadius: 4,
  },
  paymentTextWrap: {
    flex: 1,
    gap: 2,
  },
  paymentLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  paymentSubLabel: {
    fontSize: 11.5,
    color: '#9CA3AF',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#2C56C0',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2C56C0',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderTopColor: '#D1D5DB',
  },
  payButton: {
    backgroundColor: '#2C56C0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2C56C0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});