import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LandlordStackParamList } from './landlordTypes';
import { LandlordFooter } from './LandlordFooter';

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusType = 'Occupied' | 'Vacant' | 'Overdue';
type ActionType = 'Message' | 'View Leads' | 'Remind' | 'Assign';

interface Tenant {
  initials: string;
  name: string;
  sub: string;
  color: string;
}

interface PropertyItem {
  id: string;
  name: string;
  location: string;
  status: StatusType;
  extraBadge?: string;
  extraBadgeColor?: string;
  rentLabel: string;
  rentAmount: string;
  tenant: Tenant;
  action: ActionType;
  actionColor: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const PROPERTIES: PropertyItem[] = [
  {
    id: '1',
    name: '1 Big Hall at Lalitpur',
    location: 'South Jakarta',
    status: 'Occupied',
    extraBadge: 'Paid',
    extraBadgeColor: '#059669',
    rentLabel: 'Rent',
    rentAmount: 'Rp 8.000k',
    tenant: { initials: 'BP', name: 'Budi Pratama', sub: 'Lease: 5 mo left', color: '#6366F1' },
    action: 'Message',
    actionColor: '#6B7280',
  },
  {
    id: '2',
    name: '2 Rooms Available - Studio Apt',
    location: 'Kuningan City, Block 4B',
    status: 'Vacant',
    extraBadge: '3 Inquiries',
    extraBadgeColor: '#D97706',
    rentLabel: 'Asking',
    rentAmount: 'Rp 1.000k',
    tenant: { initials: 'AI', name: 'AI D  +1', sub: '', color: '#2956C2' },
    action: 'View Leads',
    actionColor: '#2956C2',
  },
  {
    id: '3',
    name: 'Grand Kemang Suite #4B',
    location: 'Kemang Raya, Jakarta',
    status: 'Overdue',
    extraBadge: 'Occupied',
    extraBadgeColor: '#059669',
    rentLabel: 'Due',
    rentAmount: 'Rp 4.500k',
    tenant: { initials: 'SJ', name: 'Sarah Jenkins', sub: 'Oct rent pending', color: '#F59E0B' },
    action: 'Remind',
    actionColor: '#F59E0B',
  },
  {
    id: '4',
    name: 'Cilandak Modern House 3BR',
    location: 'Cilandak Barat',
    status: 'Occupied',
    extraBadge: 'AC Leaking',
    extraBadgeColor: '#EF4444',
    rentLabel: 'Rent',
    rentAmount: 'Rp 12.000k',
    tenant: { initials: 'DA', name: 'Dimas Anggara', sub: 'Technician needed', color: '#8B5CF6' },
    action: 'Assign',
    actionColor: '#EF4444',
  },
];

const FILTER_TABS = ['All (6)', 'Occupied (4)', 'Vacant (2)', 'Maintenance'];

const STATS = [
  { label: 'UNITS', value: '6', color: '#111827' },
  { label: 'OCCUPIED', value: '85%', color: '#111827' },
  { label: 'COLLECTED', value: '88%', color: '#059669' },
  { label: 'REPAIRS', value: '2', color: '#EF4444' },
];

// ─── Helper: badge style by status ────────────────────────────────────────────

function getStatusStyle(status: StatusType) {
  switch (status) {
    case 'Occupied':
      return { bg: '#D1FAE5', text: '#059669' };
    case 'Vacant':
      return { bg: '#DBEAFE', text: '#2956C2' };
    case 'Overdue':
      return { bg: '#FEE2E2', text: '#DC2626' };
  }
}

function getActionIcon(action: ActionType) {
  switch (action) {
    case 'Message':
      return 'chatbubble-outline';
    case 'View Leads':
      return 'people-outline';
    case 'Remind':
      return 'notifications-outline';
    case 'Assign':
      return 'construct-outline';
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddProperty() {
  const navigation = useNavigation<NativeStackNavigationProp<LandlordStackParamList>>();
  const [activeFilter, setActiveFilter] = useState('All (6)');
  const [searchText, setSearchText] = useState('');

  const filteredProperties = PROPERTIES.filter((p) => {
    if (activeFilter.startsWith('Occupied')) return p.status === 'Occupied';
    if (activeFilter.startsWith('Vacant')) return p.status === 'Vacant';
    if (activeFilter.startsWith('Maintenance')) return p.extraBadge === 'AC Leaking';
    return true;
  }).filter((p) =>
    searchText === '' ||
    p.name.toLowerCase().includes(searchText.toLowerCase()) ||
    p.location.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#2956C2" />

      {/* ── BLUE HEADER ─────────────────────────────────────────────────── */}
      <View style={styles.header}>
        {/* Title & Add Button */}
        <View style={styles.titleRow}>
          <Text style={styles.headerTitle}>Properties</Text>
          <TouchableOpacity
            style={styles.addPropertyHeaderBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CreateProperty')}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addPropertyHeaderText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search properties..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity style={styles.filterIconBtn} activeOpacity={0.7}>
            <Ionicons name="options-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── SCROLLABLE BODY ─────────────────────────────────────────────── */}
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bodyContent}
      >
        {/* Stats row */}
        <View style={styles.statsCard}>
          {STATS.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              </View>
              {i < STATS.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Add Property button row */}
        <View style={styles.addRow}>
          <TouchableOpacity style={styles.addPropertyBtn} activeOpacity={0.85}>
            <Ionicons name="add-circle-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.addPropertyBtnText}>Add Property</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.7}>
            <Ionicons name="download-outline" size={20} color="#2956C2" />
          </TouchableOpacity>
        </View>

        {/* List header */}
        <View style={styles.listHeader}>
          <Text style={styles.listCount}>{filteredProperties.length} PROPERTIES</Text>
          <TouchableOpacity style={styles.sortBtn} activeOpacity={0.7}>
            <Text style={styles.sortText}>Sorted by Date</Text>
            <MaterialCommunityIcons name="swap-vertical" size={16} color="#6B7280" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* Property cards */}
        {filteredProperties.map((property) => {
          const statusStyle = getStatusStyle(property.status);
          const isOverdue = property.status === 'Overdue';
          const isVacant = property.status === 'Vacant';

          return (
            <View
              key={property.id}
              style={[
                styles.propertyCard,
                isOverdue && styles.propertyCardOverdue,
              ]}
            >
              {/* Top badge row */}
              <View style={styles.badgeRow}>
                {/* Left: status + extra badge */}
                <View style={styles.badgeLeft}>
                  {isOverdue && (
                    <View style={[styles.badge, { backgroundColor: '#FEE2E2' }]}>
                      <Text style={[styles.badgeText, { color: '#DC2626' }]}>Overdue 3d</Text>
                    </View>
                  )}
                  <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.badgeText, { color: statusStyle.text }]}>
                      {property.status === 'Overdue' ? 'Occupied' : property.status}
                    </Text>
                  </View>
                  {property.extraBadge && !isOverdue && (
                    <View style={[styles.badge, { backgroundColor: property.extraBadgeColor + '22' }]}>
                      <Text style={[styles.badgeText, { color: property.extraBadgeColor }]}>
                        {property.extraBadge}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Right: rent */}
                <View style={styles.rentBlock}>
                  <Text style={styles.rentLabel}>{property.rentLabel}</Text>
                  <Text style={[styles.rentAmount, isOverdue && { color: '#DC2626' }]}>
                    {property.rentAmount}
                  </Text>
                </View>
              </View>

              {/* Property name */}
              <Text style={styles.propertyName}>{property.name}</Text>
              <Text style={styles.propertyLocation}>{property.location}</Text>

              {/* Divider */}
              <View style={styles.cardDivider} />

              {/* Tenant row */}
              <View style={styles.tenantRow}>
                {/* Avatar */}
                <View style={[styles.avatar, { backgroundColor: property.tenant.color }]}>
                  <Text style={styles.avatarText}>{property.tenant.initials}</Text>
                </View>

                {/* Tenant info */}
                <View style={styles.tenantInfo}>
                  <Text style={styles.tenantName}>{property.tenant.name}</Text>
                  {property.tenant.sub !== '' && (
                    <Text style={[
                      styles.tenantSub,
                      (property.tenant.sub.includes('pending') || property.tenant.sub.includes('needed')) && { color: '#EF4444' },
                    ]}>
                      {property.tenant.sub}
                    </Text>
                  )}
                </View>

                {/* Action button */}
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    isVacant
                      ? { backgroundColor: property.actionColor, borderColor: property.actionColor }
                      : { backgroundColor: 'transparent', borderColor: property.actionColor },
                  ]}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={getActionIcon(property.action) as any}
                    size={14}
                    color={isVacant ? '#fff' : property.actionColor}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.actionBtnText,
                      { color: isVacant ? '#fff' : property.actionColor },
                    ]}
                  >
                    {property.action}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── FOOTER NAVIGATION ────────────────────────────────────────── */}
      <LandlordFooter activeTab="Properties" />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const BLUE = '#2956C2';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    backgroundColor: BLUE,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  addPropertyHeaderBtn: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  addPropertyHeaderText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#fff',
  },
  filterIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 0,
  },
  filterChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginBottom: 12,
  },
  filterChipActive: {
    backgroundColor: '#fff',
  },
  filterChipText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: BLUE,
  },

  // ── Body ────────────────────────────────────────────────────────────────
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },

  // Stats card
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },

  // Add button row
  addRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  addPropertyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BLUE,
    borderRadius: 12,
    paddingVertical: 13,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  addPropertyBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  downloadBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },

  // List header
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.5,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  // ── Property card ────────────────────────────────────────────────────────
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  propertyCardOverdue: {
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },

  // Badges
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  badgeLeft: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  rentBlock: {
    alignItems: 'flex-end',
  },
  rentLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 2,
  },
  rentAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },

  // Name & location
  propertyName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 3,
  },
  propertyLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 10,
  },

  // Tenant row
  tenantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  tenantInfo: {
    flex: 1,
  },
  tenantName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  tenantSub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
