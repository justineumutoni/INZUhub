import React, { useMemo, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Alert,
  StatusBar,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NavigationBarComponent from '../component/navigationBarComponent';
import { auth, db } from '../../endUser/config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

type Props = {
  navigation: {
    navigate: (screen: string, params?: object) => void;
    goBack: () => void;
  };
  route?: {
    params?: {
      initialFilter?: Filter;
    };
  };
};

type Filter = 'All' | 'Occupied' | 'Vacant' | 'Maintenance';

export type LandlordProperty = {
  id: string;
  title: string;
  location: string;
  status: 'Occupied' | 'Vacant' | 'Maintenance';
  rent: string;
  tenant?: string;
  tenantPhone?: string;
  detail?: string;
  tag: string;
  tagColor: string;
  tagBackground: string;
  action: string;
  actionIcon: keyof typeof Ionicons.glyphMap;
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: string;
  propertyType?: string;
  amenities?: string[];
};

const BASE_PROPERTIES: LandlordProperty[] = [
  {
    id: 'lalitpur',
    title: '1 Big Hall at Lalitpur',
    location: 'South Jakarta, Jln. Samiri',
    status: 'Occupied',
    rent: 'Rp 8.000k / mo',
    tenant: 'Budi Pratama',
    tenantPhone: '+62 812-3456-7890',
    detail: 'Lease: 5 mos left',
    tag: 'Paid',
    tagColor: '#10B981',
    tagBackground: '#ECFDF5',
    action: 'Message',
    actionIcon: 'chatbubble-ellipses-outline',
    bedrooms: 1,
    bathrooms: 1,
    furnishing: 'Fully Furnished',
    propertyType: 'Apartment',
    amenities: ['High-speed Wi-Fi', '24/7 Security', 'Dedicated Parking'],
  },
  {
    id: 'studio',
    title: '2 Rooms Available - Studio Apt',
    location: 'Kuningan City, Block 4B',
    status: 'Vacant',
    rent: 'Rp 1.000k / mo',
    detail: '3 inquiries',
    tag: '3 Inquiries',
    tagColor: '#D97706',
    tagBackground: '#FEF3C7',
    action: 'View Leads',
    actionIcon: 'people-outline',
    bedrooms: 2,
    bathrooms: 1,
    furnishing: 'Semi-Furnished',
    propertyType: 'Studio',
    amenities: ['Air Conditioning', 'Swimming Pool', 'Gym / Fitness'],
  },
  {
    id: 'kemang',
    title: 'Grand Kemang Suite #4B',
    location: 'Kemang Raya, Jakarta',
    status: 'Occupied',
    rent: 'Rp 4.500k / mo',
    tenant: 'Sarah Jenkins',
    tenantPhone: '+62 813-9876-5432',
    detail: 'Oct rent pending',
    tag: 'Overdue 3d',
    tagColor: '#DC2626',
    tagBackground: '#FEE2E2',
    action: 'Remind',
    actionIcon: 'notifications-outline',
    bedrooms: 2,
    bathrooms: 2,
    furnishing: 'Fully Furnished',
    propertyType: 'Apartment',
    amenities: ['High-speed Wi-Fi', 'Air Conditioning', '24/7 Security'],
  },
  {
    id: 'cilandak',
    title: 'Cilandak Modern House 3BR',
    location: 'Cilandak Barat',
    status: 'Maintenance',
    rent: 'Rp 12.000k / mo',
    tenant: 'Dimas Anggara',
    tenantPhone: '+62 811-2345-6789',
    detail: 'Technician needed',
    tag: 'AC Leaking',
    tagColor: '#DC2626',
    tagBackground: '#FEE2E2',
    action: 'Assign',
    actionIcon: 'construct-outline',
    bedrooms: 3,
    bathrooms: 2,
    furnishing: 'Fully Furnished',
    propertyType: 'House',
    amenities: ['Swimming Pool', 'Dedicated Parking', 'Air Conditioning'],
  },
];

const statusStyles: Record<LandlordProperty['status'], { color: string; background: string }> = {
  Occupied: { color: '#10B981', background: '#ECFDF5' },
  Vacant: { color: '#2C56C0', background: '#EFF6FF' },
  Maintenance: { color: '#DC2626', background: '#FEE2E2' },
};

export default function PropertyScreen({ navigation, route }: Props) {
  const { width } = useWindowDimensions();
  const compact = width < 380;
  const padding = compact ? 16 : width < 600 ? 20 : 32;

  const [filter, setFilter] = useState<Filter>(route?.params?.initialFilter || 'All');
  const [search, setSearch] = useState('');
  const [properties, setProperties] = useState<LandlordProperty[]>(BASE_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<LandlordProperty | null>(null);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route?.params?.initialFilter) {
      setFilter(route.params.initialFilter);
    }
  }, [route?.params?.initialFilter]);

  // Load Firestore properties created by this landlord
  useEffect(() => {
    const fetchFirestoreProperties = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        setLoading(true);
        const q = query(collection(db, 'properties'), where('ownerId', '==', user.uid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const loaded: LandlordProperty[] = [];
          snapshot.forEach((docSnap: any) => {
            const data = docSnap.data();
            const normalizedStatus: LandlordProperty['status'] =
              data.status === 'Draft' || data.status === 'Pending Review' || data.status === 'Vacant'
                ? 'Vacant'
                : data.status === 'Maintenance'
                ? 'Maintenance'
                : 'Occupied';

            loaded.push({
              id: docSnap.id,
              title: data.title || 'Untitled Property',
              location: data.location || data.address || 'Jakarta',
              status: normalizedStatus,
              rent: data.price ? `Rp ${data.price} / mo` : 'Rp 5.000k / mo',
              detail: data.minimumLease ? `Min: ${data.minimumLease}` : 'Ready to rent',
              tag: normalizedStatus === 'Vacant' ? 'New Listing' : 'Active',
              tagColor: normalizedStatus === 'Vacant' ? '#2C56C0' : '#10B981',
              tagBackground: normalizedStatus === 'Vacant' ? '#EFF6FF' : '#ECFDF5',
              action: normalizedStatus === 'Occupied' ? 'Message' : 'Review',
              actionIcon: normalizedStatus === 'Occupied' ? 'chatbubble-ellipses-outline' : 'eye-outline',
              bedrooms: data.bedrooms || 1,
              bathrooms: data.bathrooms || 1,
              furnishing: data.furnishing || 'Fully Furnished',
              propertyType: data.propertyType || 'Apartment',
              amenities: data.facilities || [],
            });
          });

          // Merge loaded with BASE_PROPERTIES, avoiding duplicates
          setProperties((prev) => {
            const existingIds = new Set(loaded.map((l) => l.id));
            const filteredBase = BASE_PROPERTIES.filter((b) => !existingIds.has(b.id));
            return [...loaded, ...filteredBase];
          });
        }
      } catch (err) {
        console.warn('Unable to load properties from Firestore:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFirestoreProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    const queryStr = search.trim().toLowerCase();
    return properties.filter((property) => {
      const matchesFilter = filter === 'All' || property.status === filter;
      const matchesSearch =
        !queryStr ||
        `${property.title} ${property.location} ${property.tenant || ''}`.toLowerCase().includes(queryStr);
      return matchesFilter && matchesSearch;
    });
  }, [filter, search, properties]);

  const countFor = (value: Filter) =>
    value === 'All'
      ? properties.length
      : properties.filter((property) => property.status === value).length;

  const handleActionPress = (property: LandlordProperty) => {
    if (property.action === 'Message') {
      navigation.navigate('LandlordMessages');
    } else if (property.action === 'Remind') {
      Alert.alert(
        'Send Payment Reminder',
        `Send friendly payment reminder to ${property.tenant || 'tenant'} for ${property.title}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Send Reminder',
            onPress: () => {
              Alert.alert('Reminder Sent', `SMS and in-app reminder sent to ${property.tenant}.`);
            },
          },
        ]
      );
    } else if (property.action === 'Assign') {
      setSelectedProperty(property);
      setAssignModalVisible(true);
    } else {
      setSelectedProperty(property);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#2C56C0" />
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Top Curved Hero ── */}
          <View style={[styles.hero, { paddingHorizontal: padding }]}>
            <View style={styles.heroHeader}>
              <Text style={styles.heroTitle}>Properties</Text>
              <TouchableOpacity
                style={styles.addButtonHero}
                onPress={() => navigation.navigate('AddProperty')}
                activeOpacity={0.85}
              >
                <Ionicons name="add" size={18} color="#2C56C0" />
                <Text style={styles.addButtonHeroText}>Add Unit</Text>
              </TouchableOpacity>
            </View>

            {/* Search row inside hero */}
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Ionicons name="search-outline" size={18} color="#2C56C0" />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  style={styles.searchInput}
                  placeholder={compact ? 'Search...' : 'Search units, locations, tenants...'}
                  placeholderTextColor="#9CA3AF"
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Ionicons name="close-circle" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {(['All', 'Occupied', 'Vacant', 'Maintenance'] as Filter[]).map((item) => {
                const isActive = filter === item;
                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.filterChip, isActive && styles.activeFilterChip]}
                    onPress={() => setFilter(item)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
                      {item} ({countFor(item)})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* ── Summary Card ── */}
          <View style={[styles.summaryCard, { marginHorizontal: padding }]}>
            <TouchableOpacity
              style={styles.summaryItem}
              onPress={() => setFilter('All')}
              activeOpacity={0.7}
            >
              <Text style={styles.summaryLabel}>TOTAL UNITS</Text>
              <Text style={[styles.summaryValue, { color: '#111827' }]}>{properties.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.summaryItem}
              onPress={() => setFilter('Occupied')}
              activeOpacity={0.7}
            >
              <Text style={styles.summaryLabel}>OCCUPIED</Text>
              <Text style={[styles.summaryValue, { color: '#10B981' }]}>
                {Math.round((countFor('Occupied') / (properties.length || 1)) * 100)}%
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.summaryItem}
              onPress={() => navigation.navigate('LandlordFinance')}
              activeOpacity={0.7}
            >
              <Text style={styles.summaryLabel}>COLLECTED</Text>
              <Text style={[styles.summaryValue, { color: '#2C56C0' }]}>88%</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.summaryItem, styles.lastSummaryItem]}
              onPress={() => setFilter('Maintenance')}
              activeOpacity={0.7}
            >
              <Text style={styles.summaryLabel}>REPAIRS</Text>
              <Text style={[styles.summaryValue, { color: '#EF4444' }]}>{countFor('Maintenance')}</Text>
            </TouchableOpacity>
          </View>

          {/* ── Action & Export Row ── */}
          <View style={[styles.actionRow, { marginHorizontal: padding }]}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddProperty')}
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle" size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add New Property</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => setExportModalVisible(true)}
              activeOpacity={0.8}
              accessibilityLabel="Export listings"
            >
              <Ionicons name="download-outline" size={20} color="#2C56C0" />
            </TouchableOpacity>
          </View>

          {/* ── List Header ── */}
          <View style={[styles.listHeader, { marginHorizontal: padding }]}>
            <Text style={styles.listCount}>{filteredProperties.length} PROPERTIES</Text>
            <Text style={styles.sortedText}>Sorted by Status</Text>
          </View>

          {/* ── Property Cards ── */}
          {filteredProperties.map((property) => {
            const status = statusStyles[property.status];
            return (
              <TouchableOpacity
                key={property.id}
                style={[
                  styles.propertyCard,
                  { marginHorizontal: padding },
                  property.status === 'Maintenance' && styles.maintenanceCard,
                ]}
                onPress={() => setSelectedProperty(property)}
                activeOpacity={0.85}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.tags}>
                    <View style={[styles.statusChip, { backgroundColor: status.background }]}>
                      <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                      <Text style={[styles.statusText, { color: status.color }]}>
                        {property.status}
                      </Text>
                    </View>
                    <View style={[styles.secondaryChip, { backgroundColor: property.tagBackground }]}>
                      <Text style={[styles.secondaryText, { color: property.tagColor }]}>
                        {property.tag}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rentBox}>
                    <Text style={styles.rentLabel}>
                      {property.status === 'Vacant' ? 'Asking' : 'Rent'}
                    </Text>
                    <Text
                      style={[
                        styles.rentValue,
                        property.status === 'Maintenance' && styles.overdueRent,
                      ]}
                    >
                      {property.rent}
                    </Text>
                  </View>
                </View>

                <Text style={styles.propertyTitle} numberOfLines={1}>
                  {property.title}
                </Text>
                <Text style={styles.location}>{property.location}</Text>

                <View style={styles.cardDivider} />

                <View style={styles.cardBottomRow}>
                  <View
                    style={[
                      styles.avatar,
                      property.status === 'Maintenance' && styles.maintenanceAvatar,
                    ]}
                  >
                    <Ionicons
                      name={property.status === 'Maintenance' ? 'warning' : 'person'}
                      size={18}
                      color={property.status === 'Maintenance' ? '#DC2626' : '#2C56C0'}
                    />
                  </View>
                  <View style={styles.tenantInfo}>
                    <Text style={styles.tenantName}>
                      {property.tenant || 'Available for Rent'}
                    </Text>
                    <Text
                      style={[
                        styles.tenantDetail,
                        property.status === 'Maintenance' && styles.maintenanceDetail,
                      ]}
                    >
                      {property.detail}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.cardAction,
                      property.status === 'Maintenance' && styles.maintenanceAction,
                    ]}
                    onPress={() => handleActionPress(property)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={property.actionIcon}
                      size={16}
                      color={property.status === 'Maintenance' ? '#FFFFFF' : '#2C56C0'}
                    />
                    <Text
                      style={[
                        styles.cardActionText,
                        property.status === 'Maintenance' && styles.maintenanceActionText,
                      ]}
                    >
                      {property.action}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}

          {filteredProperties.length === 0 && (
            <View style={[styles.emptyState, { marginHorizontal: padding }]}>
              <Ionicons name="search-outline" size={36} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No properties found</Text>
              <Text style={styles.emptyText}>Try changing your search term or filter.</Text>
            </View>
          )}
        </ScrollView>

        {/* ── Bottom Navigation Bar ── */}
        <NavigationBarComponent
          active="Properties"
          navigation={navigation}
          onSelect={(label) => {
            if (label === 'Home') navigation.navigate('LandlordHome');
            else if (label === 'Messages') navigation.navigate('LandlordMessages');
            else if (label === 'Finance') navigation.navigate('LandlordFinance');
            else if (label === 'Account') navigation.navigate('LandlordAccount');
          }}
        />

        {/* ── Property Detail Modal ── */}
        <Modal
          visible={!!selectedProperty && !assignModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setSelectedProperty(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {selectedProperty?.title}
                </Text>
                <TouchableOpacity onPress={() => setSelectedProperty(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 12 }}>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Location</Text>
                  <Text style={styles.modalValue}>{selectedProperty?.location}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Monthly Rent</Text>
                  <Text style={[styles.modalValue, { color: '#2C56C0', fontWeight: '800' }]}>
                    {selectedProperty?.rent}
                  </Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Status</Text>
                  <Text style={[styles.modalValue, { color: statusStyles[selectedProperty?.status || 'Vacant'].color, fontWeight: '700' }]}>
                    {selectedProperty?.status}
                  </Text>
                </View>
                {selectedProperty?.tenant && (
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalLabel}>Tenant</Text>
                    <Text style={styles.modalValue}>
                      {selectedProperty.tenant} ({selectedProperty.tenantPhone || 'Phone on file'})
                    </Text>
                  </View>
                )}
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Specifications</Text>
                  <Text style={styles.modalValue}>
                    {selectedProperty?.bedrooms || 1} Bed • {selectedProperty?.bathrooms || 1} Bath • {selectedProperty?.furnishing || 'Furnished'}
                  </Text>
                </View>

                {selectedProperty?.amenities && selectedProperty.amenities.length > 0 && (
                  <View style={{ marginTop: 12 }}>
                    <Text style={styles.modalLabel}>Amenities</Text>
                    <View style={styles.modalAmenities}>
                      {selectedProperty.amenities.map((item) => (
                        <Text key={item} style={styles.modalAmenityPill}>
                          ✓ {item}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.modalActionButtons}>
                  {selectedProperty?.tenant && (
                    <TouchableOpacity
                      style={styles.modalPrimaryBtn}
                      onPress={() => {
                        setSelectedProperty(null);
                        navigation.navigate('LandlordMessages');
                      }}
                    >
                      <Ionicons name="chatbubble-ellipses" size={18} color="#FFFFFF" />
                      <Text style={styles.modalPrimaryBtnText}>Message Tenant</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.modalSecondaryBtn}
                    onPress={() => {
                      const prop = selectedProperty;
                      setSelectedProperty(null);
                      navigation.navigate('ReviewProperty', {
                        title: prop?.title,
                        propertyType: prop?.propertyType,
                        bedrooms: prop?.bedrooms,
                        bathrooms: prop?.bathrooms,
                        furnishing: prop?.furnishing,
                        amenities: prop?.amenities,
                      });
                    }}
                  >
                    <Ionicons name="eye-outline" size={18} color="#2C56C0" />
                    <Text style={styles.modalSecondaryBtnText}>Review Full Listing</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* ── Assign Technician Modal ── */}
        <Modal
          visible={assignModalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setAssignModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Assign Maintenance Tech</Text>
                <TouchableOpacity onPress={() => setAssignModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <Text style={{ color: '#6B7280', fontSize: 13, marginBottom: 14 }}>
                Issue: {selectedProperty?.tag || 'AC Leaking'} at {selectedProperty?.title}
              </Text>

              {[
                { name: 'Pak Joko (HVAC / AC Specialist)', rating: '4.9 ★', avail: 'Available Today' },
                { name: 'Budi Santoso (Plumbing & Water)', rating: '4.8 ★', avail: 'Available Tomorrow' },
                { name: 'Agus Hendra (General Repairs)', rating: '4.7 ★', avail: 'Available Today' },
              ].map((tech) => (
                <TouchableOpacity
                  key={tech.name}
                  style={styles.techRow}
                  onPress={() => {
                    setAssignModalVisible(false);
                    Alert.alert('Technician Assigned', `${tech.name} has been dispatched. Tenant notified.`);
                  }}
                  activeOpacity={0.75}
                >
                  <View style={styles.techAvatar}>
                    <Ionicons name="construct" size={18} color="#2C56C0" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ color: '#111827', fontSize: 13, fontWeight: '700' }}>{tech.name}</Text>
                    <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>{tech.avail} • {tech.rating}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* ── Export Listings Modal ── */}
        <Modal
          visible={exportModalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setExportModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Export Property Portfolio</Text>
                <TouchableOpacity onPress={() => setExportModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <Text style={{ color: '#4B5563', fontSize: 13, lineHeight: 18, marginBottom: 16 }}>
                Exporting {properties.length} property records including occupancy status, tenant names, lease dates, and monthly revenue.
              </Text>

              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setExportModalVisible(false);
                  Alert.alert('Report Exported', 'Property portfolio summary PDF & CSV generated successfully.');
                }}
              >
                <Ionicons name="document-text-outline" size={18} color="#FFFFFF" />
                <Text style={styles.modalPrimaryBtnText}>Export CSV / Excel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
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
    paddingBottom: 20,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  addButtonHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  addButtonHeroText: {
    color: '#2C56C0',
    fontSize: 12,
    fontWeight: '700',
  },
  searchRow: {
    marginBottom: 12,
  },
  searchBox: {
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
  },
  filterRow: {
    gap: 8,
    paddingTop: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  activeFilterChip: {
    backgroundColor: '#FFFFFF',
  },
  filterText: {
    color: '#DCE7FF',
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#2C56C0',
    fontWeight: '700',
  },
  summaryCard: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
  },
  lastSummaryItem: {
    borderRightWidth: 0,
  },
  summaryLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  addButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#2C56C0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  exportButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  listCount: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sortedText: {
    color: '#2C56C0',
    fontSize: 12,
    fontWeight: '600',
  },
  propertyCard: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  maintenanceCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
    paddingRight: 8,
  },
  statusChip: {
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  secondaryChip: {
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: 11,
    fontWeight: '700',
  },
  rentBox: {
    alignItems: 'flex-end',
  },
  rentLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '600',
  },
  rentValue: {
    color: '#2C56C0',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  overdueRent: {
    color: '#DC2626',
  },
  propertyTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
  },
  location: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 3,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintenanceAvatar: {
    backgroundColor: '#FEE2E2',
  },
  tenantInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },
  tenantName: {
    color: '#1F2937',
    fontSize: 13,
    fontWeight: '700',
  },
  tenantDetail: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 2,
  },
  maintenanceDetail: {
    color: '#DC2626',
  },
  cardAction: {
    height: 32,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  cardActionText: {
    color: '#2C56C0',
    fontSize: 12,
    fontWeight: '700',
  },
  maintenanceAction: {
    backgroundColor: '#DC2626',
  },
  maintenanceActionText: {
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 10,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  modalLabel: {
    color: '#6B7280',
    fontSize: 13,
  },
  modalValue: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  modalAmenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  modalAmenityPill: {
    backgroundColor: '#EFF6FF',
    color: '#2C56C0',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modalActionButtons: {
    gap: 10,
    marginTop: 20,
  },
  modalPrimaryBtn: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#2C56C0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  modalSecondaryBtn: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalSecondaryBtnText: {
    color: '#2C56C0',
    fontSize: 14,
    fontWeight: '700',
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  techAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
