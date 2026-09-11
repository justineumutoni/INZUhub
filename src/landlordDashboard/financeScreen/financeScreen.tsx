import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Modal,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NavigationBarComponent from '../component/navigationBarComponent';

type Props = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

type Filter = 'Overview' | 'Income' | 'Expenses';

type Payment = {
  id: string;
  name: string;
  property: string;
  amount: string;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  paymentMethod: string;
  refNumber: string;
};

const PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    name: 'Budi Pratama',
    property: '1 Big Hall at Lalitpur',
    amount: 'Rp 8.000.000',
    date: 'Today, 10:42 AM',
    status: 'Paid',
    icon: 'checkmark-circle',
    color: '#10B981',
    paymentMethod: 'Bank BCA Direct Payout',
    refNumber: 'INV-2026-09101',
  },
  {
    id: 'pay-2',
    name: 'Sarah Jenkins',
    property: 'Grand Kemang Suite #4B',
    amount: 'Rp 4.500.000',
    date: 'Yesterday',
    status: 'Pending',
    icon: 'time',
    color: '#D97706',
    paymentMethod: 'Bank Mandiri Virtual Account',
    refNumber: 'INV-2026-09094',
  },
  {
    id: 'pay-3',
    name: 'Dimas Anggara',
    property: 'Cilandak Modern House 3BR',
    amount: 'Rp 12.000.000',
    date: 'Oct 24',
    status: 'Overdue',
    icon: 'alert-circle',
    color: '#DC2626',
    paymentMethod: 'Bank Central Asia (Transfer)',
    refNumber: 'INV-2026-08249',
  },
  {
    id: 'pay-4',
    name: 'Technician Fee (AC Repair)',
    property: 'Cilandak Modern House 3BR',
    amount: 'Rp 450.000',
    date: 'Oct 22',
    status: 'Paid',
    icon: 'construct',
    color: '#2C56C0',
    paymentMethod: 'PropertyCare Maintenance Fund',
    refNumber: 'EXP-2026-10221',
  },
];

export default function FinanceScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const compact = width < 380;
  const padding = compact ? 16 : width < 600 ? 20 : 32;

  const [filter, setFilter] = useState<Filter>('Overview');
  const [search, setSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const visiblePayments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return PAYMENTS.filter((payment) => {
      const matchesSearch =
        !query ||
        `${payment.name} ${payment.property} ${payment.refNumber}`.toLowerCase().includes(query);
      const matchesFilter =
        filter === 'Overview' ||
        (filter === 'Income' && payment.status === 'Paid') ||
        (filter === 'Expenses' && (payment.status === 'Pending' || payment.status === 'Overdue'));
      return matchesSearch && matchesFilter;
    });
  }, [filter, search]);

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
            <Text style={styles.heroTitle}>Finance & Payouts</Text>
            <Text style={styles.heroSubtitle}>Track rental revenue, disbursements & maintenance</Text>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color="#2C56C0" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                placeholder={compact ? 'Search...' : 'Search invoices, tenants, properties...'}
                placeholderTextColor="#9CA3AF"
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ── Revenue Balance Card ── */}
          <View style={[styles.balanceCard, { marginHorizontal: padding }]}>
            <View style={styles.balanceTop}>
              <View>
                <Text style={styles.balanceLabel}>TOTAL MONTHLY REVENUE</Text>
                <Text style={styles.balanceValue}>Rp 28.500.000</Text>
              </View>
              <View style={styles.growth}>
                <Ionicons name="trending-up" size={14} color="#10B981" />
                <Text style={styles.growthText}>+12%</Text>
              </View>
            </View>

            {/* Simple Bar Chart */}
            <View style={styles.chart}>
              {[
                { height: 35, month: 'May' },
                { height: 48, month: 'Jun' },
                { height: 40, month: 'Jul' },
                { height: 65, month: 'Aug' },
                { height: 55, month: 'Sep' },
                { height: 85, month: 'Oct', active: true },
                { height: 72, month: 'Nov' },
              ].map((bar, idx) => (
                <View key={idx} style={styles.chartCol}>
                  <View style={[styles.bar, { height: bar.height }, bar.active && styles.activeBar]} />
                  <Text style={[styles.monthLabel, bar.active && styles.activeMonthLabel]}>
                    {bar.month}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Financial Metrics Row ── */}
          <View style={[styles.metricsRow, { marginHorizontal: padding }]}>
            <TouchableOpacity
              style={styles.metric}
              onPress={() => setFilter('Income')}
              activeOpacity={0.7}
            >
              <View style={[styles.metricIconWrap, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              </View>
              <Text style={styles.metricLabel}>Collected</Text>
              <Text style={[styles.metricValue, { color: '#10B981' }]}>88%</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.metric}
              onPress={() => setFilter('Expenses')}
              activeOpacity={0.7}
            >
              <View style={[styles.metricIconWrap, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="time" size={18} color="#D97706" />
              </View>
              <Text style={styles.metricLabel}>Pending</Text>
              <Text style={[styles.metricValue, { color: '#D97706' }]}>Rp 4.5M</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.metric}
              onPress={() => setFilter('Expenses')}
              activeOpacity={0.7}
            >
              <View style={[styles.metricIconWrap, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="construct" size={18} color="#DC2626" />
              </View>
              <Text style={styles.metricLabel}>Maintenance</Text>
              <Text style={[styles.metricValue, { color: '#DC2626' }]}>Rp 450K</Text>
            </TouchableOpacity>
          </View>

          {/* ── Filter Tabs ── */}
          <View style={[styles.tabRow, { paddingHorizontal: padding }]}>
            {(['Overview', 'Income', 'Expenses'] as Filter[]).map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.tab, filter === item && styles.activeTab]}
                onPress={() => setFilter(item)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, filter === item && styles.activeTabText]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Transactions Section Header ── */}
          <View style={[styles.sectionHeader, { marginHorizontal: padding }]}>
            <Text style={styles.sectionTitle}>
              {filter === 'Income'
                ? 'Received Payments'
                : filter === 'Expenses'
                ? 'Pending & Outflow'
                : 'Recent Transactions'}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setFilter('Overview');
                setSearch('');
              }}
            >
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* ── Transactions Card ── */}
          <View style={[styles.transactionsCard, { marginHorizontal: padding }]}>
            {visiblePayments.map((payment, index) => (
              <TouchableOpacity
                key={payment.id}
                style={[styles.paymentRow, index < visiblePayments.length - 1 && styles.rowDivider]}
                onPress={() => setSelectedPayment(payment)}
                activeOpacity={0.75}
              >
                <View style={[styles.paymentAvatar, { backgroundColor: `${payment.color}15` }]}>
                  <Ionicons name={payment.icon} size={20} color={payment.color} />
                </View>

                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentName} numberOfLines={1}>
                    {payment.name}
                  </Text>
                  <Text style={styles.paymentProperty} numberOfLines={1}>
                    {payment.property}
                  </Text>
                  <Text style={styles.paymentDate}>{payment.date}</Text>
                </View>

                <View style={styles.paymentRight}>
                  <Text style={styles.paymentAmount}>{payment.amount}</Text>
                  <Text
                    style={[
                      styles.status,
                      payment.status === 'Paid' && styles.paid,
                      payment.status === 'Pending' && styles.pending,
                      payment.status === 'Overdue' && styles.overdue,
                    ]}
                  >
                    {payment.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {visiblePayments.length === 0 && (
              <View style={styles.empty}>
                <Ionicons name="receipt-outline" size={36} color="#9CA3AF" />
                <Text style={styles.emptyText}>No transactions found.</Text>
              </View>
            )}
          </View>

          {/* ── Reminder Card ── */}
          <View style={[styles.reminderCard, { marginHorizontal: padding }]}>
            <View style={styles.reminderIcon}>
              <Ionicons name="notifications-outline" size={20} color="#2C56C0" />
            </View>
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderTitle}>Rent collection reminder</Text>
              <Text style={styles.reminderText}>1 pending payment requires your follow up</Text>
            </View>
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => {
                setFilter('Expenses');
                Alert.alert(
                  'Pending Collections',
                  'Filtering to pending & overdue payments. You can send payment reminders directly.'
                );
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.reviewText}>Review</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* ── Bottom Navigation Bar ── */}
        <NavigationBarComponent
          active="Finance"
          navigation={navigation}
          onSelect={(label) => {
            if (label === 'Home') navigation.navigate('LandlordHome');
            else if (label === 'Properties') navigation.navigate('LandlordProperties');
            else if (label === 'Messages') navigation.navigate('LandlordMessages');
            else if (label === 'Account') navigation.navigate('LandlordAccount');
          }}
        />

        {/* ── Transaction Receipt Modal ── */}
        <Modal
          visible={!!selectedPayment}
          animationType="fade"
          transparent
          onRequestClose={() => setSelectedPayment(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Transaction Receipt</Text>
                <TouchableOpacity onPress={() => setSelectedPayment(null)}>
                  <Ionicons name="close" size={22} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.receiptBox}>
                <Text style={styles.receiptAmount}>{selectedPayment?.amount}</Text>
                <Text
                  style={[
                    styles.receiptStatus,
                    selectedPayment?.status === 'Paid' && styles.paid,
                    selectedPayment?.status === 'Pending' && styles.pending,
                    selectedPayment?.status === 'Overdue' && styles.overdue,
                  ]}
                >
                  {selectedPayment?.status}
                </Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Reference No</Text>
                <Text style={styles.receiptValue}>{selectedPayment?.refNumber}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Tenant / Payee</Text>
                <Text style={styles.receiptValue}>{selectedPayment?.name}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Property</Text>
                <Text style={styles.receiptValue}>{selectedPayment?.property}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Payment Method</Text>
                <Text style={styles.receiptValue}>{selectedPayment?.paymentMethod}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Date & Time</Text>
                <Text style={styles.receiptValue}>{selectedPayment?.date}</Text>
              </View>

              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setSelectedPayment(null);
                  Alert.alert('Receipt Downloaded', `Receipt ${selectedPayment?.refNumber} saved as PDF.`);
                }}
              >
                <Ionicons name="download-outline" size={18} color="#FFFFFF" />
                <Text style={styles.modalPrimaryBtnText}>Download Receipt PDF</Text>
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
    paddingBottom: 36,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: '#DCE7FF',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  searchBox: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#111827',
    fontSize: 13,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: -20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceLabel: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  balanceValue: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  growth: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  growthText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  chartCol: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 14,
    borderRadius: 7,
    backgroundColor: '#DBEAFE',
  },
  activeBar: {
    backgroundColor: '#2C56C0',
  },
  monthLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 6,
  },
  activeMonthLabel: {
    color: '#2C56C0',
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  metric: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  metricIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 8,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeTab: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2C56C0',
  },
  tabText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#2C56C0',
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
  },
  viewAll: {
    color: '#2C56C0',
    fontSize: 12,
    fontWeight: '700',
  },
  transactionsCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  paymentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfo: {
    flex: 1,
    minWidth: 0,
  },
  paymentName: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  paymentProperty: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 2,
  },
  paymentDate: {
    color: '#9CA3AF',
    fontSize: 10,
    marginTop: 2,
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '700',
  },
  status: {
    marginTop: 4,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 10,
    fontWeight: '700',
  },
  paid: {
    color: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  pending: {
    color: '#D97706',
    backgroundColor: '#FEF3C7',
  },
  overdue: {
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
  },
  empty: {
    paddingVertical: 36,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  reminderCard: {
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginTop: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reminderIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderInfo: {
    flex: 1,
    minWidth: 0,
  },
  reminderTitle: {
    color: '#1E3A8A',
    fontSize: 13,
    fontWeight: '700',
  },
  reminderText: {
    color: '#4B5563',
    fontSize: 11,
    marginTop: 2,
  },
  reviewButton: {
    backgroundColor: '#2C56C0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  reviewText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  receiptBox: {
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 14,
  },
  receiptAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  receiptStatus: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  receiptLabel: {
    color: '#6B7280',
    fontSize: 12,
  },
  receiptValue: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '600',
  },
  modalPrimaryBtn: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#2C56C0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
  },
  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
