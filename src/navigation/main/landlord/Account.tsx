import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LandlordStackParamList } from './landlordTypes';
import { LandlordFooter } from './LandlordFooter';

const BLUE = '#2956C2';
const BG_COLOR = '#F8FAFC';

export default function LandlordAccount() {
  const navigation = useNavigation<NativeStackNavigationProp<LandlordStackParamList>>();
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => console.log('Logged out') },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          {/* Avatar with status dot */}
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>CH</Text>
            </View>
            <View style={styles.onlineDot} />
          </View>

          {/* Profile Details */}
          <View style={styles.profileDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>Courtney Henry</Text>
              <View style={styles.hostBadge}>
                <Text style={styles.hostBadgeText}>HOST</Text>
              </View>
            </View>
            <Text style={styles.userEmail}>courtney.henry@estate.id</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#FBBF24" />
              <Text style={styles.ratingText}>4.98 (64 reviews)</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.verifiedPartnerText}>Verified Partner</Text>
            </View>
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity style={styles.editProfileBtn} activeOpacity={0.7}>
            <Feather name="edit-2" size={15} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Owned Units & Monthly Payout Summary Pills */}
        <View style={styles.summaryPillsRow}>
          <View style={styles.summaryPill}>
            <Text style={styles.summaryPillLabel}>Owned Units</Text>
            <Text style={styles.summaryPillValue}>6 Units</Text>
          </View>

          <View style={styles.summaryPill}>
            <Text style={styles.summaryPillLabel}>Monthly Payout</Text>
            <Text style={styles.summaryPillValue}>Rp 28.5M</Text>
          </View>
        </View>
      </View>

      {/* ── MAIN SCROLL CONTENT ────────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── QUICK ACTION CARDS (Bank BCA, Contracts, KYC Shield) ───────── */}
        <View style={styles.quickActionsRow}>
          {/* Bank BCA */}
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="card-outline" size={18} color={BLUE} />
            </View>
            <Text style={styles.actionCardTitle}>Bank BCA</Text>
            <Text style={styles.actionCardConnected}>Connected</Text>
          </TouchableOpacity>

          {/* Contracts with red dot */}
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
            <View style={styles.contractIconWrap}>
              <View style={[styles.actionIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="document-text-outline" size={18} color="#D97706" />
              </View>
              <View style={styles.redBadgeDot} />
            </View>
            <Text style={styles.actionCardTitle}>Contracts</Text>
            <Text style={styles.actionCardSub}>2 Renewal</Text>
          </TouchableOpacity>

          {/* KYC Shield */}
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#EDE9FE' }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#7C3AED" />
            </View>
            <Text style={styles.actionCardTitle}>KYC Shield</Text>
            <Text style={styles.actionCardKyc}>100% Level 3</Text>
          </TouchableOpacity>
        </View>

        {/* ── 1. MANAGEMENT & LISTING ──────────────────────────────────── */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeaderTitle}>MANAGEMENT & LISTING</Text>
          <View style={styles.menuCard}>
            {/* My Properties */}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('LandlordProperties')}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: '#EFF6FF' }]}>
                <MaterialCommunityIcons name="office-building-outline" size={20} color={BLUE} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>My Properties</Text>
                <Text style={styles.menuSub}>6 active units across South Jakarta</Text>
              </View>
              <View style={styles.badgePillBlue}>
                <Text style={styles.badgePillBlueText}>6 Listed</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" style={{ marginLeft: 6 }} />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Maintenance & Tickets */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#FEF3C7' }]}>
                <MaterialCommunityIcons name="tools" size={18} color="#D97706" />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>Maintenance & Tickets</Text>
                <Text style={styles.menuSub}>Manage plumbing, AC & repairs</Text>
              </View>
              <View style={styles.badgePillOrange}>
                <Text style={styles.badgePillOrangeText}>2 Pending</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" style={{ marginLeft: 6 }} />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Co-hosts & Staff */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#F3E8FF' }]}>
                <Ionicons name="people-outline" size={18} color="#9333EA" />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>Co-hosts & Staff</Text>
                <Text style={styles.menuSub}>2 managers assigned</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 2. PAYOUTS & FINANCE ─────────────────────────────────────── */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeaderTitle}>PAYOUTS & FINANCE</Text>
          <View style={styles.menuCard}>
            {/* Disbursement Account */}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('LandlordFinance')}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: '#ECFDF5' }]}>
                <MaterialCommunityIcons name="bank-outline" size={18} color="#059669" />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>Disbursement Account</Text>
                <Text style={styles.menuSub}>Bank BCA •••• 8812</Text>
              </View>
              <View style={styles.badgePillGreen}>
                <Text style={styles.badgePillGreenText}>Default</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" style={{ marginLeft: 6 }} />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Tax Documents & NPWP */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="receipt-outline" size={18} color={BLUE} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>Tax Documents & NPWP</Text>
                <Text style={styles.menuSub}>Monthly fiscal receipts and reports</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 3. SETTINGS & SECURITY ───────────────────────────────────── */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeaderTitle}>SETTINGS & SECURITY</Text>
          <View style={styles.menuCard}>
            {/* Face ID & Biometrics */}
            <View style={styles.menuItem}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#F1F5F9' }]}>
                <MaterialCommunityIcons name="fingerprint" size={20} color="#475569" />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>Face ID & Biometrics</Text>
                <Text style={styles.menuSub}>Fast authentication enabled</Text>
              </View>
              <Switch
                value={biometricsEnabled}
                onValueChange={setBiometricsEnabled}
                trackColor={{ false: '#CBD5E1', true: BLUE }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.menuDivider} />

            {/* Push Notifications */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="notifications-outline" size={18} color="#475569" />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>Push Notifications</Text>
                <Text style={styles.menuSub}>Tenant inquiries, bookings & alerts</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* Language & Currency */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="globe-outline" size={18} color="#475569" />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>Language & Currency</Text>
                <Text style={styles.menuSub}>English (US) • IDR (Rp)</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── SUPPORT & LOGOUT BUTTONS ─────────────────────────────────── */}
        <TouchableOpacity style={styles.supportButton} activeOpacity={0.8}>
          <Ionicons name="headset-outline" size={18} color="#334155" style={{ marginRight: 8 }} />
          <Text style={styles.supportButtonText}>Host Support & Knowledge Base</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Feather name="log-out" size={16} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

        {/* Version Footer */}
        <Text style={styles.versionText}>
          Version 2.4.1 (Build 1084) • PropertyCare Host
        </Text>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── FOOTER NAVIGATION ────────────────────────────────────────── */}
      <LandlordFooter activeTab="Account" />
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
    paddingTop: 12,
    paddingBottom: 8,
    gap: 14,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    backgroundColor: BLUE,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  avatarInitials: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  hostBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 5,
  },
  hostBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '800',
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  ratingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  dotSeparator: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
  },
  verifiedPartnerText: {
    color: '#67E8F9',
    fontSize: 10,
    fontWeight: '600',
  },
  editProfileBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Summary Pills Row ───────────────────────────────────────────────────
  summaryPillsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  summaryPillLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '500',
  },
  summaryPillValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Quick Action Cards ──────────────────────────────────────────────────
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  contractIconWrap: {
    position: 'relative',
  },
  redBadgeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  actionCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  actionCardConnected: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
    marginTop: 1,
  },
  actionCardSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  actionCardKyc: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
    marginTop: 1,
  },

  // ── Section & Menu Cards ────────────────────────────────────────────────
  sectionWrap: {
    gap: 6,
  },
  sectionHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  menuSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },

  // ── Badge Pills ─────────────────────────────────────────────────────────
  badgePillBlue: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgePillBlueText: {
    color: BLUE,
    fontSize: 10,
    fontWeight: '700',
  },
  badgePillOrange: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgePillOrangeText: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: '700',
  },
  badgePillGreen: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgePillGreenText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '700',
  },

  // ── Action Buttons ──────────────────────────────────────────────────────
  supportButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  supportButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  versionText: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
});
