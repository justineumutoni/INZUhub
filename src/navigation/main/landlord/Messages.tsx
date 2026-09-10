import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LandlordFooter } from './LandlordFooter';

const BLUE = '#2956C2';
const BG_COLOR = '#F8FAFC';

interface Conversation {
  id: string;
  name: string;
  badge?: string;
  badgeType?: 'host' | 'verified';
  time: string;
  property: string;
  preview: string;
  hasCheck?: boolean;
  unreadCount?: number;
  isOnline?: boolean;
  avatarType?: 'user' | 'support';
  avatarInitials?: string;
  avatarColor?: string;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Archan',
    badge: 'HOST',
    badgeType: 'host',
    time: '10:42 AM',
    property: '2 Rooms Available • Jaksel',
    preview: 'Hello Courtney, your application for...',
    unreadCount: 2,
    isOnline: true,
    avatarInitials: 'AR',
    avatarColor: '#F59E0B',
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    badge: 'Verified',
    badgeType: 'verified',
    time: 'Yesterday',
    property: 'Grand Kemang Suite #4B',
    preview: 'The lease agreement draft is ready...',
    hasCheck: true,
    isOnline: true,
    avatarInitials: 'SJ',
    avatarColor: '#8B5CF6',
  },
  {
    id: '3',
    name: 'Budi Pratama',
    time: 'Oct 24',
    property: 'Studio Apt Kuningan City',
    preview: 'Deposit received. Looking forward...',
    hasCheck: true,
    isOnline: false,
    avatarInitials: 'BP',
    avatarColor: '#3B82F6',
  },
  {
    id: '4',
    name: 'Property Care Support',
    time: 'Oct 20',
    property: 'Tenant Verification Center',
    preview: 'Your verification documents have bee...',
    avatarType: 'support',
    isOnline: false,
    avatarInitials: 'PC',
    avatarColor: '#6366F1',
  },
];

const FILTER_TABS = ['All (4)', 'Tenants', 'Maintenance', 'Support'];

export default function LandlordMessages() {
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('All (4)');

  const filteredConversations = CONVERSATIONS.filter((conv) => {
    const matchesSearch =
      conv.name.toLowerCase().includes(searchText.toLowerCase()) ||
      conv.property.toLowerCase().includes(searchText.toLowerCase()) ||
      conv.preview.toLowerCase().includes(searchText.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'Tenants') return conv.name === 'Sarah Jenkins' || conv.name === 'Budi Pratama';
    if (activeFilter === 'Maintenance') return conv.name === 'Archan';
    if (activeFilter === 'Support') return conv.avatarType === 'support';
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>

        {/* Search Bar with Filter Icon */}
        <View style={styles.searchBarWrap}>
          <Ionicons name="search-outline" size={16} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search hosts, listings, messages..."
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
        {/* ── ACTIVE APPLICATION CARD ──────────────────────────────────── */}
        <View style={styles.activeAppCard}>
          <View style={styles.activeAppHeaderRow}>
            <Text style={styles.activeAppTag}>ACTIVE APPLICATION</Text>
            <View style={styles.priceBadge}>
              <Text style={styles.priceBadgeText}>Rp. 1000K</Text>
            </View>
          </View>

          <View style={styles.activeAppBodyRow}>
            {/* Thumbnail */}
            <View style={styles.appThumb}>
              <Ionicons name="business" size={24} color="#60A5FA" />
            </View>

            {/* Details */}
            <View style={styles.appInfo}>
              <Text style={styles.appTitle} numberOfLines={1}>
                2 Rooms Availa...
              </Text>
              <Text style={styles.appLocation}>Jaksel, Jln. Samiri •</Text>
              <View style={styles.appDistanceRow}>
                <Ionicons name="location-sharp" size={12} color={BLUE} />
                <Text style={styles.appDistanceText}>1.2 km from GBK</Text>
              </View>
            </View>

            {/* Chat Host Button */}
            <TouchableOpacity style={styles.chatHostBtn} activeOpacity={0.8}>
              <Text style={styles.chatHostText}>Chat Host</Text>
              <Ionicons name="arrow-forward" size={12} color={BLUE} style={{ marginLeft: 3 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── FILTER PILLS ─────────────────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setActiveFilter(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── QUICK ACTION BUTTONS ROW ─────────────────────────────────── */}
        <View style={styles.quickActionRow}>
          <TouchableOpacity style={styles.callHotlineBtn} activeOpacity={0.7}>
            <Ionicons name="call-outline" size={16} color={BLUE} style={{ marginRight: 6 }} />
            <Text style={styles.callHotlineText}>Call Hotline</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.newMessageBtn} activeOpacity={0.8}>
            <Ionicons name="create-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.newMessageText}>New Message</Text>
          </TouchableOpacity>
        </View>

        {/* ── CONVERSATION LIST ────────────────────────────────────────── */}
        <View style={styles.conversationList}>
          {filteredConversations.map((conv, index) => (
            <TouchableOpacity
              key={conv.id}
              style={[
                styles.conversationItem,
                index === filteredConversations.length - 1 && { borderBottomWidth: 0 },
              ]}
              activeOpacity={0.7}
            >
              {/* Avatar with status dot */}
              <View style={styles.avatarWrap}>
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: conv.avatarColor || '#3B82F6' },
                  ]}
                >
                  {conv.avatarType === 'support' ? (
                    <Ionicons name="headset" size={20} color="#fff" />
                  ) : (
                    <Text style={styles.avatarInitials}>{conv.avatarInitials}</Text>
                  )}
                </View>
                {conv.isOnline && <View style={styles.onlineDot} />}
              </View>

              {/* Message Info */}
              <View style={styles.convMain}>
                <View style={styles.convNameRow}>
                  <View style={styles.nameWithBadge}>
                    <Text style={styles.convName}>{conv.name}</Text>
                    {conv.badge && (
                      <View
                        style={[
                          styles.roleBadge,
                          conv.badgeType === 'host'
                            ? styles.hostBadge
                            : styles.verifiedBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.roleBadgeText,
                            conv.badgeType === 'host'
                              ? styles.hostBadgeText
                              : styles.verifiedBadgeText,
                          ]}
                        >
                          {conv.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.convTime,
                      conv.unreadCount ? { color: BLUE, fontWeight: '600' } : null,
                    ]}
                  >
                    {conv.time}
                  </Text>
                </View>

                <Text style={styles.convProperty} numberOfLines={1}>
                  {conv.property}
                </Text>

                <View style={styles.convPreviewRow}>
                  {conv.hasCheck && (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color="#3B82F6"
                      style={{ marginRight: 4 }}
                    />
                  )}
                  <Text style={styles.convPreviewText} numberOfLines={1}>
                    {conv.preview}
                  </Text>
                </View>
              </View>

              {/* Right Side: Unread Count or Chevron */}
              <View style={styles.convRight}>
                {conv.unreadCount ? (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{conv.unreadCount}</Text>
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── SECURITY NOTICE BANNER ───────────────────────────────────── */}
        <View style={styles.securityBanner}>
          <View style={styles.shieldIconWrap}>
            <Ionicons name="shield-checkmark" size={20} color={BLUE} />
          </View>
          <View style={styles.securityTextWrap}>
            <Text style={styles.securityTitle}>Stay protected with SecurePay</Text>
            <Text style={styles.securitySubtitle}>
              Never wire funds outside the verified booking chat.
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.tipsText}>Tips</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── FOOTER NAVIGATION ────────────────────────────────────────── */}
      <LandlordFooter activeTab="Messages" />
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

  // ── Active Application Card ─────────────────────────────────────────────
  activeAppCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  activeAppHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  activeAppTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 0.6,
  },
  priceBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  priceBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  activeAppBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appThumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  appInfo: {
    flex: 1,
  },
  appTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  appLocation: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  appDistanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 2,
  },
  appDistanceText: {
    fontSize: 10,
    color: BLUE,
    fontWeight: '600',
  },
  chatHostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chatHostText: {
    fontSize: 11,
    fontWeight: '700',
    color: BLUE,
  },

  // ── Filter Pills ────────────────────────────────────────────────────────
  filterScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#93C5FD',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: BLUE,
    fontWeight: '700',
  },

  // ── Quick Action Row ────────────────────────────────────────────────────
  quickActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  callHotlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    borderRadius: 12,
  },
  callHotlineText: {
    fontSize: 12,
    fontWeight: '700',
    color: BLUE,
  },
  newMessageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BLUE,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  newMessageText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },

  // ── Conversation List ───────────────────────────────────────────────────
  conversationList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#fff',
  },
  convMain: {
    flex: 1,
  },
  convNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  convName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  hostBadge: {
    backgroundColor: '#047857',
  },
  hostBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '800',
  },
  verifiedBadge: {
    backgroundColor: '#D1FAE5',
  },
  verifiedBadgeText: {
    color: '#059669',
    fontSize: 8,
    fontWeight: '700',
  },
  convTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  convProperty: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
  },
  convPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  convPreviewText: {
    fontSize: 11,
    color: '#94A3B8',
    flex: 1,
  },
  convRight: {
    marginLeft: 8,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  unreadBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  // ── Security Notice Banner ──────────────────────────────────────────────
  securityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  shieldIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  securityTextWrap: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  securitySubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  tipsText: {
    fontSize: 11,
    fontWeight: '700',
    color: BLUE,
    paddingLeft: 6,
  },
});
