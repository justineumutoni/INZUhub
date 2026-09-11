import React, { useState, useMemo, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NavigationBarComponent from '../component/navigationBarComponent';
import { auth, db } from '../../endUser/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

type Props = {
  navigation: {
    navigate: (screen: string, params?: object) => void;
    replace?: (screen: string) => void;
  };
};

interface PropertyItem {
  id: string;
  title: string;
  price: string;
  status: 'Occupied' | 'Vacant' | 'Maintenance';
  location: string;
  tenant?: string;
  action: string;
}

const INITIAL_PROPERTIES: PropertyItem[] = [
  { id: '1', title: '1 Big Hall Lalitpur', price: 'Rp 8,000K / mo', status: 'Occupied', location: 'South Jakarta', tenant: 'Budi Pratama', action: 'Manage' },
  { id: '2', title: 'Studio Kuningan', price: 'Rp 1,000K / mo', status: 'Vacant', location: 'Kuningan City, Block 4B', action: 'Review' },
  { id: '3', title: 'Grand Kemang Suite #4B', price: 'Rp 4,500K / mo', status: 'Occupied', location: 'Kemang Raya, Jakarta', tenant: 'Sarah Jenkins', action: 'Manage' },
];

export default function HomeScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isCompact = width < 380;
  const horizontalPadding = isCompact ? 16 : width < 600 ? 20 : 32;

  const [search, setSearch] = useState('');
  const [landlordName, setLandlordName] = useState('Landlord');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      if (user.displayName) {
        setLandlordName(user.displayName.split(' ')[0]);
      }
      getDoc(doc(db, 'users', user.uid))
        .then((snapshot: any) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data.fullName) {
              setLandlordName(data.fullName.split(' ')[0]);
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  const filteredProperties = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return INITIAL_PROPERTIES;
    return INITIAL_PROPERTIES.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        (p.tenant && p.tenant.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#2C56C0" />
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Top Hero Banner matching InzuHub End-User curved style ── */}
          <View style={[styles.hero, { paddingHorizontal: horizontalPadding }]}>
            <View style={styles.heroTopRow}>
              <View>
                <Text style={styles.greeting}>Welcome back,</Text>
                <Text style={styles.heroTitle}>{landlordName}</Text>
              </View>
            </View>

            {/* Quick Stat Cards */}
            <View style={styles.statsRow}>
              <TouchableOpacity
                style={styles.statCard}
                onPress={() => navigation.navigate('LandlordProperties')}
                activeOpacity={0.85}
              >
                <View style={styles.statHeader}>
                  <Text style={styles.statLabel}>Properties</Text>
                  <Ionicons name="business" size={18} color="rgba(255,255,255,0.7)" />
                </View>
                <Text style={styles.statValue}>6 Units</Text>
                <Text style={styles.statSub}>4 Occupied • 2 Vacant</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statCard}
                onPress={() => navigation.navigate('LandlordFinance')}
                activeOpacity={0.85}
              >
                <View style={styles.statHeader}>
                  <Text style={styles.statLabel}>Occupancy</Text>
                  <Ionicons name="pie-chart" size={18} color="rgba(255,255,255,0.7)" />
                </View>
                <Text style={styles.statValue}>85%</Text>
                <Text style={styles.statSub}>+5% this month</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Search Bar ── */}
          <View style={[styles.searchWrapper, { paddingHorizontal: horizontalPadding }]}>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={20} color="#2C56C0" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search units, tenants, contracts..."
                placeholderTextColor="#9CA3AF"
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ── Quick Actions Row ── */}
          <View style={[styles.quickActions, { paddingHorizontal: horizontalPadding }]}>
            <TouchableOpacity
              style={[styles.quickCard, styles.addCard]}
              onPress={() => navigation.navigate('AddProperty')}
              activeOpacity={0.85}
            >
              <View style={styles.addIcon}>
                <Ionicons name="add" size={24} color="#2C56C0" />
              </View>
              <Text style={styles.addText}>+ Add Unit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate('LandlordProperties', { initialFilter: 'Maintenance' })}
              activeOpacity={0.85}
            >
              <View style={[styles.quickIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="construct" size={20} color="#D97706" />
              </View>
              <Text style={styles.quickTitle}>Repairs (2)</Text>
              <View style={styles.alertDot} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate('LandlordProperties', { initialFilter: 'Occupied' })}
              activeOpacity={0.85}
            >
              <View style={[styles.quickIcon, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="people" size={20} color="#2C56C0" />
              </View>
              <Text style={styles.quickTitle}>Tenants</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate('LandlordFinance')}
              activeOpacity={0.85}
            >
              <View style={[styles.quickIcon, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="wallet-outline" size={20} color="#10B981" />
              </View>
              <Text style={styles.quickTitle}>Finance</Text>
            </TouchableOpacity>
          </View>

          {/* ── Total Revenue Card ── */}
          <TouchableOpacity
            style={[styles.revenueCard, { marginHorizontal: horizontalPadding }]}
            onPress={() => navigation.navigate('LandlordFinance')}
            activeOpacity={0.9}
          >
            <View style={styles.revenueHeader}>
              <View>
                <Text style={styles.sectionLabel}>TOTAL MONTHLY REVENUE</Text>
                <Text style={styles.revenue}>Rp 28.500.000</Text>
              </View>
              <View style={styles.growthBadge}>
                <Ionicons name="trending-up" size={14} color="#10B981" />
                <Text style={styles.growth}>+12%</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
            <View style={styles.revenueFooter}>
              <Text style={styles.revenueSub}>Collected: Rp 23.000.000 (88%)</Text>
              <Text style={styles.viewDetailText}>Details &gt;</Text>
            </View>
          </TouchableOpacity>

          {/* ── Active Properties ── */}
          <View style={[styles.sectionHeader, { marginHorizontal: horizontalPadding }]}>
            <Text style={styles.sectionTitle}>Active Properties</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('LandlordProperties')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.sectionAction}>View All ({filteredProperties.length})</Text>
            </TouchableOpacity>
          </View>

          {filteredProperties.map((property) => (
            <TouchableOpacity
              key={property.id}
              style={[styles.propertyCard, { marginHorizontal: horizontalPadding }]}
              onPress={() => navigation.navigate('LandlordProperties')}
              activeOpacity={0.85}
            >
              <View style={styles.propertyThumb}>
                <Ionicons name="business" size={24} color="#2C56C0" />
              </View>
              <View style={styles.propertyInfo}>
                <View style={styles.propHeaderRow}>
                  <View
                    style={[
                      styles.status,
                      property.status === 'Occupied'
                        ? styles.occupiedStatus
                        : styles.vacantStatus,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        property.status === 'Occupied'
                          ? styles.occupiedStatusText
                          : styles.vacantStatusText,
                      ]}
                    >
                      {property.status}
                    </Text>
                  </View>
                  <Text style={styles.propertyPrice}>{property.price}</Text>
                </View>
                <Text style={styles.propertyTitle} numberOfLines={1}>
                  {property.title}
                </Text>
                <Text style={styles.propertyLocation} numberOfLines={1}>
                  {property.location}
                  {property.tenant ? ` • ${property.tenant}` : ''}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() => navigation.navigate('LandlordProperties')}
                activeOpacity={0.8}
              >
                <Text style={styles.reviewText}>{property.action}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          {/* ── Tenant Inquiries ── */}
          <View style={[styles.sectionHeader, { marginHorizontal: horizontalPadding, marginTop: 24 }]}>
            <Text style={styles.sectionTitle}>Recent Inquiries</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('LandlordMessages')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.sectionAction}>2 Pending</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.inquiryCard, { marginHorizontal: horizontalPadding }]}
            onPress={() => navigation.navigate('LandlordMessages')}
            activeOpacity={0.85}
          >
            <View style={styles.inquiryAvatar}>
              <Ionicons name="person" size={22} color="#2C56C0" />
            </View>
            <View style={styles.inquiryInfo}>
              <View style={styles.inquiryNameRow}>
                <Text style={styles.inquiryName}>Archan</Text>
                <Text style={styles.inquiryTime}>10:42 AM</Text>
              </View>
              <Text style={styles.inquiryDescription} numberOfLines={1}>
                Applied for: Studio Kuningan • Jaksel
              </Text>
            </View>
            <TouchableOpacity
              style={styles.inquiryButton}
              onPress={() => navigation.navigate('LandlordMessages')}
              activeOpacity={0.8}
            >
              <Text style={styles.inquiryButtonText}>Chat</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </ScrollView>

        {/* ── Bottom Navigation Bar ── */}
        <NavigationBarComponent
          active="Home"
          navigation={navigation}
          onSelect={(label) => {
            if (label === 'Properties') navigation.navigate('LandlordProperties');
            else if (label === 'Messages') navigation.navigate('LandlordMessages');
            else if (label === 'Finance') navigation.navigate('LandlordFinance');
            else if (label === 'Account') navigation.navigate('LandlordAccount');
          }}
        />
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
    alignSelf: 'center',
    maxWidth: 720,
  },
  hero: {
    backgroundColor: '#2C56C0',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#DCE7FF',
    fontSize: 13,
    fontWeight: '500',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  tenantSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tenantSwitchText: {
    color: '#2C56C0',
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    color: '#DCE7FF',
    fontSize: 13,
    fontWeight: '500',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 6,
  },
  statSub: {
    color: '#BFD1FF',
    fontSize: 11,
    marginTop: 4,
  },
  searchWrapper: {
    marginTop: -14,
  },
  searchBox: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  quickCard: {
    flex: 1,
    minWidth: 0,
    height: 90,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    position: 'relative',
    padding: 6,
  },
  addCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  addIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    color: '#2C56C0',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickTitle: {
    color: '#374151',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  alertDot: {
    position: 'absolute',
    right: 12,
    top: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  revenueCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sectionLabel: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  revenue: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  growth: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginTop: 14,
    overflow: 'hidden',
  },
  progressFill: {
    width: '88%',
    height: '100%',
    backgroundColor: '#2C56C0',
    borderRadius: 4,
  },
  revenueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  revenueSub: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '500',
  },
  viewDetailText: {
    color: '#2C56C0',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionAction: {
    color: '#2C56C0',
    fontSize: 13,
    fontWeight: '600',
  },
  propertyCard: {
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
    gap: 12,
  },
  propertyThumb: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  propertyInfo: {
    flex: 1,
    minWidth: 0,
  },
  propHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  status: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  occupiedStatus: {
    backgroundColor: '#ECFDF5',
  },
  vacantStatus: {
    backgroundColor: '#EFF6FF',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  occupiedStatusText: {
    color: '#10B981',
  },
  vacantStatusText: {
    color: '#2C56C0',
  },
  propertyPrice: {
    color: '#2C56C0',
    fontSize: 12,
    fontWeight: '700',
  },
  propertyTitle: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  propertyLocation: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 2,
  },
  reviewButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reviewText: {
    color: '#2C56C0',
    fontSize: 12,
    fontWeight: '700',
  },
  inquiryCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
    gap: 12,
  },
  inquiryAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inquiryInfo: {
    flex: 1,
    minWidth: 0,
  },
  inquiryNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inquiryName: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  inquiryTime: {
    color: '#9CA3AF',
    fontSize: 11,
  },
  inquiryDescription: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  inquiryButton: {
    backgroundColor: '#2C56C0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  inquiryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
