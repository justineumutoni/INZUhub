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
import { LandlordFooter } from './LandlordFooter';


// ─── Types ────────────────────────────────────────────────────────────────────

interface Property {
  id: string;
  name: string;
  price: string;
  status: 'Occupied' | 'Vacant';
}

interface Inquiry {
  id: string;
  name: string;
  appliedFor: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const ACTIVE_PROPERTIES: Property[] = [
  {
    id: '1',
    name: '1 Big Hall Lalitpur',
    price: 'Rp 8,000 / mo',
    status: 'Occupied',
  },
  {
    id: '2',
    name: 'Studio Kuningan',
    price: 'Rp 1,000K / mo',
    status: 'Vacant',
  },
];

const INQUIRIES: Inquiry[] = [
  {
    id: '1',
    name: 'Archan',
    appliedFor: 'Applied: Studio Kuningan',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function LandlordHomepage() {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState('');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#2956C2" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── HEADER / HERO ─────────────────────────────────────────────── */}
        <View style={styles.header}>
          {/* Stats cards */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Properties</Text>
              <Text style={styles.statValue}>6 Units</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Occupancy</Text>
              <Text style={styles.statValue}>85%</Text>
            </View>
          </View>

          {/* Search bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={16} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search units, tenant requests, contracts..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* ── QUICK ACTIONS ─────────────────────────────────────────────── */}
        <View style={styles.quickActionsRow}>
          {/* + Add button */}
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CreateProperty')}
          >
            <Ionicons name="add" size={28} color="#fff" />
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>

          {/* Repairs */}
          <TouchableOpacity style={styles.quickActionItem} activeOpacity={0.7}>
            <View style={styles.quickActionIconWrap}>
              <MaterialCommunityIcons name="tools" size={24} color="#F59E0B" />
              {/* Red dot badge */}
              <View style={styles.badge} />
            </View>
            <Text style={styles.quickActionLabel}>Repairs (2)</Text>
          </TouchableOpacity>

          {/* Tenants */}
          <TouchableOpacity style={styles.quickActionItem} activeOpacity={0.7}>
            <View style={styles.quickActionIconWrap}>
              <Ionicons name="people-outline" size={24} color="#2956C2" />
            </View>
            <Text style={styles.quickActionLabel}>Tenants</Text>
          </TouchableOpacity>
        </View>

        {/* ── TOTAL REVENUE ─────────────────────────────────────────────── */}
        <View style={styles.revenueCard}>
          <View style={styles.revenueHeader}>
            <Text style={styles.revenueLabel}>Total Revenue</Text>
            <View style={styles.revenueBadge}>
              <Text style={styles.revenueBadgeText}>+12%</Text>
            </View>
          </View>
          <Text style={styles.revenueAmount}>Rp 28.500.000</Text>
          {/* Progress bar */}
          <View style={styles.progressBarTrack}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        {/* ── ACTIVE PROPERTIES ─────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Properties</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('LandlordProperties')}
            >
              <Text style={styles.viewAllText}>View All (6)</Text>
            </TouchableOpacity>
          </View>

          {ACTIVE_PROPERTIES.map((property) => (
            <View key={property.id} style={styles.propertyCard}>
              {/* Thumbnail with status badge */}
              <View style={styles.propertyThumb}>
                <View style={styles.propertyImagePlaceholder}>
                  <Ionicons name="business-outline" size={22} color="#6B7280" />
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    property.status === 'Occupied'
                      ? styles.statusOccupied
                      : styles.statusVacant,
                  ]}
                >
                  <Text style={styles.statusBadgeText}>{property.status}</Text>
                </View>
              </View>

              {/* Info */}
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyName}>{property.name}</Text>
                <Text style={styles.propertyPrice}>{property.price}</Text>
              </View>

              {/* Action button */}
              <TouchableOpacity style={styles.propertyActionBtn} activeOpacity={0.8}>
                <Text style={styles.propertyActionBtnText}>
                  {property.status === 'Occupied' ? 'Manage' : 'Review'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* ── INQUIRIES ─────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Inquiries</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.pendingText}>2 Pending</Text>
            </TouchableOpacity>
          </View>

          {INQUIRIES.map((inquiry) => (
            <View key={inquiry.id} style={styles.inquiryCard}>
              {/* Avatar placeholder */}
              <View style={styles.inquiryAvatar}>
                <Ionicons name="person-outline" size={22} color="#6B7280" />
              </View>

              {/* Info */}
              <View style={styles.inquiryInfo}>
                <Text style={styles.inquiryName}>{inquiry.name}</Text>
                <Text style={styles.inquiryApplied}>{inquiry.appliedFor}</Text>
              </View>

              {/* Review button */}
              <TouchableOpacity style={styles.reviewBtn} activeOpacity={0.8}>
                <Text style={styles.reviewBtnText}>Review</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── FOOTER NAVIGATION ────────────────────────────────────────── */}
      <LandlordFooter activeTab="Home" />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    backgroundColor: BLUE,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
  },

  // ── Quick Actions ────────────────────────────────────────────────────────
  quickActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 24,
  },
  addButton: {
    backgroundColor: BLUE,
    borderRadius: 16,
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },

  // ── Revenue card ────────────────────────────────────────────────────────
  revenueCard: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 4,
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  revenueLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  revenueBadge: {
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  revenueBadgeText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
  },
  revenueAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
  },
  progressBarFill: {
    height: 6,
    width: '72%',
    backgroundColor: BLUE,
    borderRadius: 10,
  },

  // ── Section ─────────────────────────────────────────────────────────────
  section: {
    marginHorizontal: 20,
    marginTop: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 13,
    color: BLUE,
    fontWeight: '600',
  },
  pendingText: {
    fontSize: 13,
    color: '#F59E0B',
    fontWeight: '600',
  },

  // ── Property card ────────────────────────────────────────────────────────
  propertyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  propertyThumb: {
    width: 62,
    height: 62,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 12,
  },
  propertyImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 4,
    left: 2,
    zIndex: 1,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  statusOccupied: {
    backgroundColor: '#059669',
  },
  statusVacant: {
    backgroundColor: '#2956C2',
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  propertyInfo: {
    flex: 1,
  },
  propertyName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  propertyPrice: {
    fontSize: 12,
    color: '#2956C2',
    fontWeight: '600',
  },
  propertyActionBtn: {
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  propertyActionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: BLUE,
  },

  // ── Inquiry card ─────────────────────────────────────────────────────────
  inquiryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inquiryAvatar: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  inquiryInfo: {
    flex: 1,
  },
  inquiryName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  inquiryApplied: {
    fontSize: 12,
    color: '#6B7280',
  },
  reviewBtn: {
    backgroundColor: BLUE,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  reviewBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

});
