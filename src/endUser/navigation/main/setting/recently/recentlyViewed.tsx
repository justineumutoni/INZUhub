import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Footer } from '../../../footer/footer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../Login/Login';
import { getProperties } from '../../../../services/properties';
import type { PropertyDetailData } from '../../../../types/property';

interface Listing {
  id: string;
  price: string;
  bhk: string;
  location: string;
  address: string;
  available: boolean;
  status: string;
  imageUri?: string;
  detailData: PropertyDetailData;
}

interface ListingCardProps {
  item: Listing;
  onPress?: () => void;
  onDelete?: () => void;
}

function ListingCard({ item, onPress, onDelete }: ListingCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Image
        source={item.imageUri ? { uri: item.imageUri } : {}}
        style={styles.cardImage}
      />
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardPrice}>{item.price}</Text>
          <View style={styles.availableRow}>
            <View style={[styles.availableDot, !item.available && styles.unavailableDot]} />
            <Text style={[styles.availableText, !item.available && styles.unavailableText]}>
              {item.status}
            </Text>
          </View>
        </View>
        <Text style={styles.cardTitle}>{item.bhk}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color="#9CA3AF" />
          <Text style={styles.cardLocation}>{item.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function RecentlyViewed() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadListings = async () => {
      try {
        const properties = await getProperties('All');
        if (isMounted) {
          setListings(properties.map((property, index) => {
            const status = property.status || 'Available';
            return {
              id: property.id || `property-${index}`,
              price: property.price,
              bhk: property.title,
              location: property.location || 'Kigali, Rwanda',
              address: property.subLocation || property.location || 'Kigali, Rwanda',
              available: status.toLowerCase() === 'available',
              status,
              imageUri: property.heroImage && typeof property.heroImage === 'object' && 'uri' in property.heroImage
                ? property.heroImage.uri
                : undefined,
              detailData: property,
            };
          }));
        }
      } catch (error) {
        console.warn('Error loading recently viewed properties:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadListings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = (id: string) => {
    setListings((currentListings) => currentListings.filter((listing) => listing.id !== id));
  };

  const handleUpgrade = () => {
    // TODO: navigate to premium/upgrade screen
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#2C56C0" />

      {/* ── Top Blue Header ────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recently Viewed</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.hintText}>
          hold and swipe on an item to delete
        </Text>

        {/* ── Listings ──────────────────────────────────────────────────── */}
        <View style={styles.listingList}>
          {loading ? (
            <ActivityIndicator size="large" color="#2C56C0" />
          ) : (
            listings.map((item) => (
              <ListingCard
                key={item.id}
                item={item}
                onPress={() => navigation.navigate('PropertyDetail', { property: item.detailData })}
                onDelete={() => handleDelete(item.id)}
              />
            ))
          )}
        </View>

        {/* ── Premium Upsell Card ───────────────────────────────────────── */}
        <View style={styles.upsellCard}>
          <View style={styles.upsellIconBox}>
            <Feather name="zap" size={18} color="#2C56C0" />
          </View>
          <View style={styles.upsellTextBox}>
            <Text style={styles.upsellTitle}>Get ready to get Featured?</Text>
            <Text style={styles.upsellSubtitle}>Go for Premium Service</Text>
          </View>
          <TouchableOpacity
            style={styles.upgradeButton}
            activeOpacity={0.85}
            onPress={handleUpgrade}
          >
            <Text style={styles.upgradeButtonText}>Upgrade</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#2C56C0',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 42,
    paddingBottom: 16,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    height: Platform.OS === 'ios' ? 100 : 150,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  hintText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  listingList: {
    marginHorizontal: 20,
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  availableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  unavailableDot: {
    backgroundColor: '#F97316',
  },
  availableText: {
    fontSize: 11,
    color: '#22C55E',
    fontWeight: '600',
  },
  unavailableText: {
    color: '#F97316',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardLocation: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  upsellCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    gap: 10,
  },
  upsellIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E0EBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upsellTextBox: {
    flex: 1,
    gap: 2,
  },
  upsellTitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  upsellSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2C56C0',
  },
  upgradeButton: {
    backgroundColor: '#2C56C0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});