import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../Login/Login';
import { Footer } from '../../footer/footer';

const FooterWithTab = Footer as React.ComponentType<{ activeTab?: string }>;

interface FAQItem {
  id: string;
  category: 'General' | 'Account' | 'Booking' | 'Payments';
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    category: 'General',
    question: 'What do we get here in this app?',
    answer:
      'INZUhub is a modern property and room finder application that connects you directly with verified landlords and available rental properties in your desired location.',
  },
  {
    id: '2',
    category: 'General',
    question: 'How to use this app?',
    answer:
      'You simply create an account, log in, browse the available properties or rooms that fit your desire, and apply or contact the property owner directly.',
  },
  {
    id: '3',
    category: 'Booking',
    question: 'How do I apply for a property or room?',
    answer:
      'Click on any property card to view the full details. From the property details screen, tap "Apply Now" or use "Call Me" / "Message Me" to reach out to the landlord.',
  },
  {
    id: '4',
    category: 'Account',
    question: 'How can I update my profile details?',
    answer:
      'Go to the Settings or Account tab in the bottom bar, and tap on "Edit Profile" to update your photo, name, email, or contact information.',
  },
  {
    id: '5',
    category: 'Payments',
    question: 'Are there any hidden fees or charges?',
    answer:
      'No, browsing properties and sending inquiries on INZUhub is completely transparent. Rental terms and deposit details are clearly listed by each property owner.',
  },
  {
    id: '6',
    category: 'Booking',
    question: 'How do I track my applied properties?',
    answer:
      'Navigate to the Account tab from the bottom navigation. Under the "Applied" section, you can see all the properties you have requested along with their current status.',
  },
  {
    id: '7',
    category: 'Account',
    question: 'How do I reset my password if I forgot it?',
    answer:
      'On the Sign In screen, you can use the password recovery option or contact our support team to receive a password reset link to your registered email.',
  },
];

const CATEGORIES = ['All', 'General', 'Booking', 'Account', 'Payments'] as const;

export default function Help() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filtered FAQ items based on search query and category
  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleContactSupport = (type: 'email' | 'call' | 'chat') => {
    if (type === 'email') {
      const emailUrl = 'mailto:support@inzuhub.com?subject=InzuHub%20Support%20Request';
      if (Platform.OS === 'web') {
        window.location.href = emailUrl;
      } else {
        Linking.openURL(emailUrl).catch(() => {
          Alert.alert('Support Email', 'Please email us at support@inzuhub.com');
        });
      }
    } else if (type === 'call') {
      const phoneUrl = 'tel:+998125331510';
      if (Platform.OS === 'web') {
        window.alert('Call Support: (+9) 98125331510');
      } else {
        Linking.openURL(phoneUrl).catch(() => {
          Alert.alert('Call Support', 'Support Helpline: (+9) 98125331510');
        });
      }
    } else {
      if (Platform.OS === 'web') {
        window.alert('Live chat support is currently open (9am - 6pm). A support agent will connect with you.');
      } else {
        Alert.alert('Live Chat', 'Support chat will connect with an agent shortly.');
      }
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C56C0" />

      {/* ── Header Container ────────────────────────────────────────── */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* ── Search Bar in Header Area ─────────────────────────────── */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#2C56C0" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search questions, topics, keywords..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* ── Main Scrollable Content ─────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Category Filter Pills ──────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── FAQ Section Header ────────────────────────────────────── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Frequent Asked Questions</Text>
          <Text style={styles.resultCountText}>
            {filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'}
          </Text>
        </View>

        {/* ── FAQ List ──────────────────────────────────────────────── */}
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.faqCard}
                activeOpacity={0.88}
                onPress={() => toggleExpand(item.id)}
              >
                <View style={styles.faqHeaderRow}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="document-text-outline" size={20} color="#2C56C0" />
                  </View>
                  <View style={styles.textContainer}>
                    <View style={styles.faqTopLine}>
                      <Text style={styles.faqCategoryBadge}>{item.category}</Text>
                    </View>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <Text style={styles.faqAnswer}>{item.answer}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="search-outline" size={36} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyStateTitle}>No results found</Text>
            <Text style={styles.emptyStateText}>
              We couldn't find any questions matching "{searchQuery}". Try different keywords or browse categories.
            </Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.resetButtonText}>Reset Search</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Still Need Help? / Contact Card ───────────────────────── */}
        <View style={styles.supportCard}>
          <View style={styles.supportCardHeader}>
            <View style={styles.supportIconBox}>
              <Ionicons name="headset-outline" size={22} color="#2C56C0" />
            </View>
            <View style={styles.supportHeaderText}>
              <Text style={styles.supportTitle}>Still need help?</Text>
              <Text style={styles.supportSubtitle}>
                Our customer support team is available 24/7 to assist you.
              </Text>
            </View>
          </View>

          <View style={styles.supportActionsRow}>
            <TouchableOpacity
              style={styles.supportBtn}
              activeOpacity={0.8}
              onPress={() => handleContactSupport('chat')}
            >
              <Ionicons name="chatbubbles-outline" size={16} color="#2C56C0" />
              <Text style={styles.supportBtnText}>Live Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.supportBtn}
              activeOpacity={0.8}
              onPress={() => handleContactSupport('email')}
            >
              <Ionicons name="mail-outline" size={16} color="#2C56C0" />
              <Text style={styles.supportBtnText}>Email Us</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.supportBtn, styles.supportBtnPrimary]}
              activeOpacity={0.8}
              onPress={() => handleContactSupport('call')}
            >
              <Ionicons name="call-outline" size={16} color="#FFFFFF" />
              <Text style={styles.supportBtnPrimaryText}>Call Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <FooterWithTab activeTab="Settings" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerSafeArea: {
    backgroundColor: '#2C56C0',
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 8 : 0,
  },
  backButton: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerSpacer: {
    width: 36,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    height: '100%',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 28,
  },
  categoryScroll: {
    paddingBottom: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 6,
  },
  categoryPillActive: {
    backgroundColor: '#2C56C0',
    borderColor: '#2C56C0',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  resultCountText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  faqHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 38,
    height: 38,
    backgroundColor: '#EEF4FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  faqTopLine: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  faqCategoryBadge: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2C56C0',
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 21,
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 19,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  emptyStateText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#2C56C0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  supportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  supportCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  supportIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportHeaderText: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  supportSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  supportActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  supportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#EEF4FF',
    borderWidth: 1,
    borderColor: '#D4E2FF',
  },
  supportBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C56C0',
  },
  supportBtnPrimary: {
    backgroundColor: '#2C56C0',
    borderColor: '#2C56C0',
  },
  supportBtnPrimaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
