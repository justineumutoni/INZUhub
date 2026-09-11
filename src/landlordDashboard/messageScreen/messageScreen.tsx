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
  Alert,
  Linking,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NavigationBarComponent from '../component/navigationBarComponent';

type Props = {
  navigation: {
    navigate: (screen: string, params?: object) => void;
  };
};

type Filter = 'All' | 'Tenants' | 'Maintenance' | 'Support';

type Conversation = {
  id: string;
  name: string;
  tag?: string;
  title: string;
  preview: string;
  date: string;
  unread?: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  phone?: string;
  messages?: { id: string; sender: 'me' | 'them'; text: string; time: string }[];
};

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'archan',
    name: 'Archan',
    tag: 'Applicant',
    title: '2 Rooms Available • Jaksel',
    preview: 'Hello Courtney, is the studio still available for next month?',
    date: '10:42 AM',
    unread: 2,
    icon: 'sparkles-outline',
    color: '#F59E0B',
    phone: '+62 812-4567-8901',
    messages: [
      { id: '1', sender: 'them', text: 'Hi! I submitted my application for the 2 Rooms Available.', time: '10:30 AM' },
      { id: '2', sender: 'them', text: 'Hello Courtney, is the studio still available for next month?', time: '10:42 AM' },
    ],
  },
  {
    id: 'sarah',
    name: 'Sarah Jenkins',
    tag: 'Tenant',
    title: 'Grand Kemang Suite #4B',
    preview: 'The lease agreement draft is ready for review.',
    date: 'Yesterday',
    icon: 'person',
    color: '#2C56C0',
    phone: '+62 813-9876-5432',
    messages: [
      { id: '1', sender: 'them', text: 'The lease agreement draft is ready for review.', time: 'Yesterday' },
      { id: '2', sender: 'me', text: 'Thank you Sarah, I will look over it this evening.', time: 'Yesterday' },
    ],
  },
  {
    id: 'budi',
    name: 'Budi Pratama',
    tag: 'Tenant',
    title: 'Studio Apt Kuningan City',
    preview: 'Deposit received. Looking forward to moving in!',
    date: 'Oct 24',
    icon: 'person',
    color: '#10B981',
    phone: '+62 812-3456-7890',
    messages: [
      { id: '1', sender: 'them', text: 'Deposit received. Looking forward to moving in!', time: 'Oct 24' },
      { id: '2', sender: 'me', text: 'Welcome Budi! The keys will be ready on Friday.', time: 'Oct 24' },
    ],
  },
  {
    id: 'support',
    name: 'InzuHub Support Team',
    tag: 'Support',
    title: 'Landlord Verification Center',
    preview: 'Your verification documents have been successfully verified.',
    date: 'Oct 20',
    icon: 'shield-checkmark',
    color: '#2C56C0',
    messages: [
      { id: '1', sender: 'them', text: 'Your verification documents have been successfully verified. Welcome to InzuHub Host!', time: 'Oct 20' },
    ],
  },
];

export default function MessageScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const compact = width < 380;
  const padding = compact ? 16 : width < 600 ? 20 : 32;

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [filter, setFilter] = useState<Filter>('All');
  const [search, setSearch] = useState('');
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newMessageModal, setNewMessageModal] = useState(false);
  const [newRecipient, setNewRecipient] = useState('');
  const [newMsgContent, setNewMsgContent] = useState('');

  const visibleConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return conversations.filter((conversation) => {
      const matchesSearch =
        !query ||
        `${conversation.name} ${conversation.title} ${conversation.preview}`
          .toLowerCase()
          .includes(query);
      const matchesFilter =
        filter === 'All' ||
        (filter === 'Maintenance' && conversation.title.toLowerCase().includes('maintenance')) ||
        (filter === 'Support' && conversation.id === 'support') ||
        (filter === 'Tenants' && conversation.id !== 'support');
      return matchesSearch && matchesFilter;
    });
  }, [filter, search, conversations]);

  const handleCallHotline = () => {
    const supportPhone = '+628001234567';
    Linking.openURL(`tel:${supportPhone}`).catch(() => {
      Alert.alert('InzuHub Hotline', 'Call InzuHub Host Support at +62 800-1234-567');
    });
  };

  const handleSendMessage = () => {
    if (!replyText.trim() || !activeChat) return;
    const newMsg = {
      id: String(Date.now()),
      sender: 'me' as const,
      text: replyText.trim(),
      time: 'Just now',
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChat.id
          ? {
              ...c,
              unread: 0,
              preview: `You: ${replyText.trim()}`,
              messages: [...(c.messages || []), newMsg],
            }
          : c
      )
    );

    setActiveChat((prev) =>
      prev ? { ...prev, unread: 0, messages: [...(prev.messages || []), newMsg] } : null
    );
    setReplyText('');
  };

  const handleStartNewMessage = () => {
    if (!newRecipient.trim() || !newMsgContent.trim()) {
      Alert.alert('Required Fields', 'Please select a recipient and enter a message.');
      return;
    }

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      name: newRecipient.trim(),
      tag: 'Tenant',
      title: 'InzuHub Property Inquiry',
      preview: `You: ${newMsgContent.trim()}`,
      date: 'Just now',
      icon: 'person',
      color: '#2C56C0',
      messages: [
        { id: String(Date.now()), sender: 'me', text: newMsgContent.trim(), time: 'Just now' },
      ],
    };

    setConversations([newConv, ...conversations]);
    setNewMessageModal(false);
    setNewRecipient('');
    setNewMsgContent('');
    setActiveChat(newConv);
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
            <Text style={styles.heroTitle}>Messages</Text>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color="#2C56C0" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                placeholder={compact ? 'Search...' : 'Search tenants, applicants, messages...'}
                placeholderTextColor="#9CA3AF"
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ── Active Application Card (Overlapping Hero) ── */}
          <View style={[styles.applicationCard, { marginHorizontal: padding }]}>
            <View style={styles.applicationHeader}>
              <Text style={styles.applicationLabel}>FEATURED APPLICATION</Text>
              <Text style={styles.priceBadge}>Rp 1.000K / mo</Text>
            </View>
            <View style={styles.applicationBody}>
              <View style={styles.applicationImage}>
                <Ionicons name="home" size={26} color="#2C56C0" />
              </View>
              <View style={styles.applicationInfo}>
                <Text style={styles.applicationTitle} numberOfLines={1}>
                  2 Rooms Available
                </Text>
                <Text style={styles.applicationLocation}>Jaksel, Jln. Samiri</Text>
                <Text style={styles.distance}>
                  <Ionicons name="location" size={12} color="#2C56C0" /> 1.2 km from GBK
                </Text>
              </View>
              <TouchableOpacity
                style={styles.chatHostButton}
                onPress={() => {
                  const archanConv = conversations.find((c) => c.id === 'archan');
                  if (archanConv) setActiveChat(archanConv);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.chatHostText}>Chat Applicant</Text>
                <Ionicons name="arrow-forward" size={14} color="#2C56C0" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Filter Tabs ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.filterRow, { paddingHorizontal: padding }]}
          >
            {(['All', 'Tenants', 'Maintenance', 'Support'] as Filter[]).map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.filterTab, filter === item && styles.activeFilterTab]}
                onPress={() => setFilter(item)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, filter === item && styles.activeFilterText]}>
                  {item}
                  {item === 'All' ? ` (${conversations.length})` : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ── Action Buttons Row ── */}
          <View style={[styles.actionRow, { paddingHorizontal: padding }]}>
            <TouchableOpacity
              style={styles.hotlineButton}
              onPress={handleCallHotline}
              activeOpacity={0.8}
            >
              <Ionicons name="call-outline" size={18} color="#2C56C0" />
              <Text style={styles.hotlineText}>Call Hotline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.newMessageButton}
              onPress={() => setNewMessageModal(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="create-outline" size={18} color="#FFFFFF" />
              <Text style={styles.newMessageText}>New Message</Text>
            </TouchableOpacity>
          </View>

          {/* ── Conversation List ── */}
          <View style={[styles.conversationCard, { marginHorizontal: padding }]}>
            {visibleConversations.map((conversation, index) => (
              <TouchableOpacity
                key={conversation.id}
                style={[
                  styles.conversationRow,
                  index < visibleConversations.length - 1 && styles.conversationDivider,
                ]}
                onPress={() => setActiveChat(conversation)}
                activeOpacity={0.75}
              >
                <View style={[styles.avatar, { backgroundColor: `${conversation.color}15` }]}>
                  <Ionicons name={conversation.icon} size={20} color={conversation.color} />
                  <View style={styles.onlineDot} />
                </View>

                <View style={styles.conversationInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>
                      {conversation.name}
                    </Text>
                    {conversation.tag && (
                      <Text
                        style={[
                          styles.tag,
                          conversation.tag === 'Applicant' && styles.applicantTag,
                          conversation.tag === 'Support' && styles.supportTag,
                        ]}
                      >
                        {conversation.tag}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.conversationTitle} numberOfLines={1}>
                    {conversation.title}
                  </Text>
                  <Text style={styles.preview} numberOfLines={1}>
                    {conversation.preview}
                  </Text>
                </View>

                <View style={styles.meta}>
                  <Text style={styles.date}>{conversation.date}</Text>
                  {conversation.unread ? (
                    <View style={styles.unread}>
                      <Text style={styles.unreadText}>{conversation.unread}</Text>
                    </View>
                  ) : (
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {visibleConversations.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="chatbubbles-outline" size={36} color="#9CA3AF" />
                <Text style={styles.emptyText}>No messages found.</Text>
              </View>
            )}
          </View>

          {/* ── Safety Card ── */}
          <View style={[styles.safetyCard, { marginHorizontal: padding }]}>
            <View style={styles.safetyIcon}>
              <Ionicons name="shield-checkmark" size={20} color="#2C56C0" />
            </View>
            <View style={styles.safetyText}>
              <Text style={styles.safetyTitle}>InzuHub Host Protection</Text>
              <Text style={styles.safetySubtitle}>
                Keep agreements and payment records inside the chat for 100% verified lease protection.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* ── Bottom Navigation Bar ── */}
        <NavigationBarComponent
          active="Messages"
          navigation={navigation}
          unreadMessagesCount={visibleConversations.reduce((acc, c) => acc + (c.unread || 0), 0)}
          onSelect={(label) => {
            if (label === 'Home') navigation.navigate('LandlordHome');
            else if (label === 'Properties') navigation.navigate('LandlordProperties');
            else if (label === 'Finance') navigation.navigate('LandlordFinance');
            else if (label === 'Account') navigation.navigate('LandlordAccount');
          }}
        />

        {/* ── Interactive Chat Modal ── */}
        <Modal
          visible={!!activeChat}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setActiveChat(null)}
        >
          <SafeAreaView style={styles.chatSafeArea} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
              style={styles.chatContainer}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              {/* Chat Header */}
              <View style={styles.chatHeader}>
                <TouchableOpacity onPress={() => setActiveChat(null)} style={styles.chatBackBtn}>
                  <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.chatHeaderName}>{activeChat?.name}</Text>
                  <Text style={styles.chatHeaderSub} numberOfLines={1}>
                    {activeChat?.title}
                  </Text>
                </View>
                {activeChat?.phone && (
                  <TouchableOpacity
                    style={styles.chatCallBtn}
                    onPress={() => Linking.openURL(`tel:${activeChat.phone}`)}
                  >
                    <Ionicons name="call" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Chat Messages */}
              <ScrollView
                style={styles.chatScroll}
                contentContainerStyle={{ padding: 16, gap: 10 }}
                showsVerticalScrollIndicator={false}
              >
                {activeChat?.messages?.map((msg) => {
                  const isMe = msg.sender === 'me';
                  return (
                    <View
                      key={msg.id}
                      style={[styles.chatBubble, isMe ? styles.chatBubbleMe : styles.chatBubbleThem]}
                    >
                      <Text style={[styles.chatBubbleText, isMe ? styles.chatTextMe : styles.chatTextThem]}>
                        {msg.text}
                      </Text>
                      <Text style={[styles.chatBubbleTime, isMe ? styles.chatTimeMe : styles.chatTimeThem]}>
                        {msg.time}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>

              {/* Chat Input */}
              <View style={styles.chatInputBar}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Type your message..."
                  placeholderTextColor="#9CA3AF"
                  value={replyText}
                  onChangeText={setReplyText}
                />
                <TouchableOpacity
                  style={[styles.chatSendBtn, !replyText.trim() && { opacity: 0.5 }]}
                  onPress={handleSendMessage}
                  disabled={!replyText.trim()}
                >
                  <Ionicons name="send" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>

        {/* ── New Message Modal ── */}
        <Modal
          visible={newMessageModal}
          animationType="fade"
          transparent
          onRequestClose={() => setNewMessageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>New Conversation</Text>
                <TouchableOpacity onPress={() => setNewMessageModal(false)}>
                  <Ionicons name="close" size={22} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <Text style={styles.formLabel}>Recipient (Tenant / Applicant)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Budi Pratama, Sarah Jenkins"
                placeholderTextColor="#9CA3AF"
                value={newRecipient}
                onChangeText={setNewRecipient}
              />

              <Text style={[styles.formLabel, { marginTop: 12 }]}>Initial Message</Text>
              <TextInput
                style={[styles.formInput, { height: 80, textAlignVertical: 'top', paddingTop: 10 }]}
                placeholder="Write your message here..."
                placeholderTextColor="#9CA3AF"
                multiline
                value={newMsgContent}
                onChangeText={setNewMsgContent}
              />

              <TouchableOpacity
                style={[styles.modalPrimaryBtn, { marginTop: 16 }]}
                onPress={handleStartNewMessage}
              >
                <Ionicons name="send" size={18} color="#FFFFFF" />
                <Text style={styles.modalPrimaryBtnText}>Start Conversation</Text>
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
    marginBottom: 12,
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
  applicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: -22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  applicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  applicationLabel: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  priceBadge: {
    backgroundColor: '#2C56C0',
    color: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '700',
  },
  applicationBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  applicationImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applicationInfo: {
    flex: 1,
    minWidth: 0,
  },
  applicationTitle: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  applicationLocation: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 2,
  },
  distance: {
    color: '#2C56C0',
    fontSize: 11,
    marginTop: 2,
  },
  chatHostButton: {
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chatHostText: {
    color: '#2C56C0',
    fontSize: 11,
    fontWeight: '700',
  },
  filterRow: {
    gap: 8,
    paddingTop: 16,
    paddingBottom: 12,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  activeFilterTab: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2C56C0',
  },
  filterText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#2C56C0',
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  hotlineButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  hotlineText: {
    color: '#2C56C0',
    fontSize: 13,
    fontWeight: '700',
  },
  newMessageButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#2C56C0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  newMessageText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  conversationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  conversationRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  conversationDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  conversationInfo: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
  },
  tag: {
    color: '#10B981',
    backgroundColor: '#ECFDF5',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 10,
    fontWeight: '700',
  },
  applicantTag: {
    color: '#D97706',
    backgroundColor: '#FEF3C7',
  },
  supportTag: {
    color: '#2C56C0',
    backgroundColor: '#EFF6FF',
  },
  conversationTitle: {
    color: '#4B5563',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  preview: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  meta: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 6,
  },
  date: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '500',
  },
  unread: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2C56C0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  emptyState: {
    paddingVertical: 36,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  safetyCard: {
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
  safetyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyText: {
    flex: 1,
  },
  safetyTitle: {
    color: '#1E3A8A',
    fontSize: 13,
    fontWeight: '700',
  },
  safetySubtitle: {
    color: '#4B5563',
    fontSize: 11,
    marginTop: 2,
  },
  chatSafeArea: {
    flex: 1,
    backgroundColor: '#2C56C0',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  chatHeader: {
    backgroundColor: '#2C56C0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeaderName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  chatHeaderSub: {
    color: '#DCE7FF',
    fontSize: 11,
  },
  chatCallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatScroll: {
    flex: 1,
  },
  chatBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  chatBubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: '#2C56C0',
    borderBottomRightRadius: 4,
  },
  chatBubbleThem: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderBottomLeftRadius: 4,
  },
  chatBubbleText: {
    fontSize: 13,
    lineHeight: 18,
  },
  chatTextMe: {
    color: '#FFFFFF',
  },
  chatTextThem: {
    color: '#111827',
  },
  chatBubbleTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  chatTimeMe: {
    color: '#BFD1FF',
  },
  chatTimeThem: {
    color: '#9CA3AF',
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#111827',
  },
  chatSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2C56C0',
    alignItems: 'center',
    justifyContent: 'center',
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
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  formInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#111827',
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
});
