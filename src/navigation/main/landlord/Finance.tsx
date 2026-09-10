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
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LandlordFooter } from './LandlordFooter';

const BLUE = '#2956C2';
const BG_COLOR = '#F8FAFC';

interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  type: 'income' | 'expense';
  status: 'Received' | 'Paid';
}

const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'Studio Kuningan',
    subtitle: 'Tenant: Budi Pratama • Today',
    amount: '+Rp 8.000.000',
    type: 'income',
    status: 'Received',
  },
  {
    id: '2',
    title: '1 Big Hall Lalitpur',
    subtitle: 'AC Repair • FixPro Vendor',
    amount: '-Rp 450.000',
    type: 'expense',
    status: 'Paid',
  },
  {
    id: '3',
    title: 'Apartment 4B - Deposit',
    subtitle: 'Tenant: Sarah Jenkins • Oct 24',
    amount: '+Rp 5.000.000',
    type: 'income',
    status: 'Received',
  },
];

const CHART_DATA = [
  { month: 'Jun', height: 28, color: '#E2E8F0', active: false },
  { month: 'Jul', height: 36, color: '#E2E8F0', active: false },
  { month: 'Aug', height: 52, color: '#BFDBFE', active: false },
  { month: 'Sep', height: 44, color: '#93C5FD', active: false },
  { month: 'Oct', height: 48, color: '#60A5FA', active: false },
  { month: 'Nov', height: 68, color: BLUE, active: true, value: '28.5M' },
];

export default function LandlordFinance() {
  const [searchText, setSearchText] = useState('');

  const filteredTransactions = TRANSACTIONS.filter(
    (t) =>
      t.title.toLowerCase().includes(searchText.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance</Text>

        {/* Income & Expenses Pills Row */}
        <View style={styles.statsPillsRow}>
          {/* Income Pill */}
          <View style={styles.statPill}>
            <Text style={styles.statPillLabel}>Income</Text>
            <Text style={styles.statPillValue}>Rp 32.0M</Text>
          </View>

          {/* Expenses Pill */}
          <View style={styles.statPill}>
            <Text style={styles.statPillLabel}>Expenses</Text>
            <Text style={styles.statPillValue}>Rp 3.5M</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarWrap}>
          <Ionicons name="search-outline" size={16} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions, invoices..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.7}>
            <MaterialCommunityIcons name="tune-variant" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── MAIN SCROLL CONTENT ────────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── QUICK ACTION CARDS (Income, Invoices, Analytics) ───────────── */}
        <View style={styles.quickActionsRow}>
          {/* + Income */}
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
            <View style={styles.incomeIconCircle}>
              <Ionicons name="add" size={20} color="#fff" />
            </View>
            <Text style={styles.actionCardLabel}>+ Income</Text>
          </TouchableOpacity>

          {/* Invoices with red dot */}
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
            <View style={styles.invoicesIconWrap}>
              <View style={styles.invoicesIconCircle}>
                <Ionicons name="receipt-outline" size={18} color="#D97706" />
              </View>
              <View style={styles.redBadgeDot} />
            </View>
            <Text style={styles.actionCardLabel}>Invoices</Text>
          </TouchableOpacity>

          {/* Analytics */}
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
            <View style={styles.analyticsIconCircle}>
              <Ionicons name="stats-chart" size={18} color="#7C3AED" />
            </View>
            <Text style={styles.actionCardLabel}>Analytics</Text>
          </TouchableOpacity>
        </View>

        {/* ── NET PROFIT MONTHLY CARD ──────────────────────────────────── */}
        <View style={styles.profitCard}>
          {/* Header */}
          <View style={styles.profitHeaderRow}>
            <Text style={styles.profitSubLabel}>Net Profit (Current Month)</Text>
            <View style={styles.profitPercentBadge}>
              <Feather name="arrow-up" size={12} color="#059669" />
              <Text style={styles.profitPercentText}>+12%</Text>
            </View>
          </View>

          {/* Large Amount */}
          <Text style={styles.profitAmount}>Rp 28.500.000</Text>

          {/* Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View style={styles.progressBarFill} />
          </View>

          {/* Target & Achievement Row */}
          <View style={styles.targetRow}>
            <Text style={styles.targetText}>Target Rp 35.000.000</Text>
            <Text style={styles.targetText}>78% achieved</Text>
          </View>

          {/* Bar Chart */}
          <View style={styles.chartContainer}>
            {CHART_DATA.map((item) => (
              <View key={item.month} style={styles.chartCol}>
                {item.value && (
                  <View style={styles.activeValueBadge}>
                    <Text style={styles.activeValueText}>{item.value}</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.bar,
                    {
                      height: item.height,
                      backgroundColor: item.color,
                    },
                    item.active && styles.activeBar,
                  ]}
                />
                <Text style={[styles.barMonth, item.active && styles.activeBarMonth]}>
                  {item.month}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── UPCOMING PAYOUT BANNER ───────────────────────────────────── */}
        <View style={styles.payoutCard}>
          <View style={styles.payoutIconCircle}>
            <MaterialCommunityIcons name="wallet-outline" size={20} color={BLUE} />
          </View>
          <View style={styles.payoutInfo}>
            <Text style={styles.payoutTitle}>Upcoming Payout</Text>
            <Text style={styles.payoutSubtitle}>Rp 14.200.000 to Bank BCA</Text>
          </View>
          <View style={styles.payoutDateBadge}>
            <Text style={styles.payoutDateText}>Nov 15</Text>
          </View>
        </View>

        {/* ── RECENT TRANSACTIONS ──────────────────────────────────────── */}
        <View style={styles.transactionsHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All (18)</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction Cards List */}
        <View style={styles.transactionsList}>
          {filteredTransactions.map((tx) => {
            const isIncome = tx.type === 'income';
            return (
              <View key={tx.id} style={styles.transactionCard}>
                {/* Arrow Icon */}
                <View
                  style={[
                    styles.txIconWrap,
                    isIncome ? styles.txIconIncome : styles.txIconExpense,
                  ]}
                >
                  <Feather
                    name={isIncome ? 'arrow-down-left' : 'arrow-up-right'}
                    size={16}
                    color={isIncome ? '#059669' : '#DC2626'}
                  />
                </View>

                {/* Details */}
                <View style={styles.txDetails}>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txSubtitle}>{tx.subtitle}</Text>
                </View>

                {/* Amount & Status Badge */}
                <View style={styles.txRight}>
                  <Text
                    style={[
                      styles.txAmount,
                      isIncome ? styles.txAmountIncome : styles.txAmountExpense,
                    ]}
                  >
                    {tx.amount}
                  </Text>
                  <View
                    style={[
                      styles.txStatusBadge,
                      isIncome ? styles.statusReceived : styles.statusPaid,
                    ]}
                  >
                    <Text
                      style={[
                        styles.txStatusText,
                        isIncome ? styles.statusReceivedText : styles.statusPaidText,
                      ]}
                    >
                      {tx.status}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── FOOTER NAVIGATION ────────────────────────────────────────── */}
      <LandlordFooter activeTab="Finance" />
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
    gap: 12,
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
    marginBottom: 10,
  },
  statsPillsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  statPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  statPillLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '500',
  },
  statPillValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  searchBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    paddingVertical: 0,
  },
  filterBtn: {
    paddingLeft: 8,
  },

  // ── Quick Actions Row ───────────────────────────────────────────────────
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  incomeIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  invoicesIconWrap: {
    position: 'relative',
    marginBottom: 6,
  },
  invoicesIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
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
  analyticsIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },

  // ── Net Profit Card ─────────────────────────────────────────────────────
  profitCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  profitHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  profitSubLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  profitPercentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 2,
  },
  profitPercentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  profitAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  progressBarTrack: {
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    width: '78%',
    height: '100%',
    backgroundColor: BLUE,
    borderRadius: 3,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  targetText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 90,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  chartCol: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  activeValueBadge: {
    position: 'absolute',
    top: -18,
    backgroundColor: '#1E293B',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeValueText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '800',
  },
  bar: {
    width: 24,
    borderRadius: 6,
    marginBottom: 6,
  },
  activeBar: {
    backgroundColor: BLUE,
  },
  barMonth: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  activeBarMonth: {
    color: BLUE,
    fontWeight: '800',
  },

  // ── Upcoming Payout Banner ──────────────────────────────────────────────
  payoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  payoutIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  payoutInfo: {
    flex: 1,
  },
  payoutTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  payoutSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  payoutDateBadge: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  payoutDateText: {
    fontSize: 11,
    fontWeight: '700',
    color: BLUE,
  },

  // ── Recent Transactions ─────────────────────────────────────────────────
  transactionsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: BLUE,
  },
  transactionsList: {
    gap: 8,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  txIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  txIconIncome: {
    backgroundColor: '#D1FAE5',
  },
  txIconExpense: {
    backgroundColor: '#FEE2E2',
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  txSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  txAmount: {
    fontSize: 12,
    fontWeight: '700',
  },
  txAmountIncome: {
    color: '#059669',
  },
  txAmountExpense: {
    color: '#DC2626',
  },
  txStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusReceived: {
    backgroundColor: '#ECFDF5',
  },
  statusReceivedText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#059669',
  },
  statusPaid: {
    backgroundColor: '#F1F5F9',
  },
  statusPaidText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
});
