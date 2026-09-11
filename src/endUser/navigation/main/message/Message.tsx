import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../Login/Login';
import { auth } from '../../../config/firebase';
import {
  ChatMessage,
  Conversation,
  createOrOpenConversation,
  sendMessage,
  subscribeToConversations,
  subscribeToMessages,
} from '../../../services/messages';

type MessageProps = NativeStackScreenProps<RootStackParamList, 'Messages'>;

export default function Message({ route, navigation }: MessageProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const landlordName = activeConversation?.ownerName || route.params?.ownerName || 'Property Landlord';
  const propertyTitle = activeConversation?.propertyTitle || route.params?.propertyTitle || 'Selected property';

  useEffect(() => {
    return subscribeToConversations(setConversations, (conversationError) => {
      setError(conversationError.message);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const openConversationFromRoute = async () => {
      if (!route.params?.propertyTitle || activeConversation) return;

      try {
        const conversationId = await createOrOpenConversation({
          propertyId: route.params.propertyId,
          propertyTitle: route.params.propertyTitle,
          ownerName: route.params.ownerName || 'Property Landlord',
        });
        if (!cancelled) {
          setActiveConversation({
            id: conversationId,
            ownerName: route.params.ownerName || 'Property Landlord',
            propertyTitle: route.params.propertyTitle,
            propertyId: route.params.propertyId,
            lastMessage: '',
          });
        }
      } catch (conversationError) {
        if (!cancelled) {
          setError(conversationError instanceof Error ? conversationError.message : 'Unable to open chat.');
        }
      }
    };

    openConversationFromRoute();
    return () => {
      cancelled = true;
    };
  }, [route.params, activeConversation]);

  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }

    return subscribeToMessages(activeConversation.id, setMessages, (messageError) => {
      setError(messageError.message);
    });
  }, [activeConversation]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !activeConversation) return;

    // Clear the controlled input immediately; Firestore persistence can take longer.
    setMessage('');

    try {
      await sendMessage({
        conversationId: activeConversation.id,
        text: trimmedMessage,
        propertyId: activeConversation.propertyId,
        propertyTitle: activeConversation.propertyTitle,
        ownerName: activeConversation.ownerName,
      });
      setError('');
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Unable to send message.');
    }
  };

  const handleOpenConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
  };

  const handleBack = () => {
    if (activeConversation && !route.params?.propertyTitle) {
      setActiveConversation(null);
      return;
    }
    navigation.goBack();
  };

  if (!activeConversation) {
    return (
      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.listHeaderTitle}>Messages</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView contentContainerStyle={styles.conversationList}>
          <Text style={styles.listIntro}>Your conversations with property landlords</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {conversations.length === 0 && !error ? (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={42} color="#A7B8E8" />
              <Text style={styles.emptyTitle}>No conversations yet</Text>
              <Text style={styles.emptyText}>Open a property and message the landlord to start a chat.</Text>
            </View>
          ) : conversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              style={styles.conversationCard}
              onPress={() => handleOpenConversation(conversation)}
              activeOpacity={0.8}
            >
              <View style={styles.listAvatar}><Ionicons name="person" size={18} color="#2C56C0" /></View>
              <View style={styles.conversationDetails}>
                <Text style={styles.conversationName}>{conversation.ownerName}</Text>
                <Text style={styles.conversationProperty} numberOfLines={1}>{conversation.propertyTitle}</Text>
                <Text style={styles.conversationPreview} numberOfLines={1}>{conversation.lastMessage || 'Start a conversation'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerIdentity}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={18} color="#2C56C0" />
          </View>
          <View>
            <Text style={styles.headerName}>{landlordName}</Text>
            <Text style={styles.headerSubtitle}>Property landlord</Text>
          </View>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.propertyContext}>
        <Ionicons name="home-outline" size={18} color="#2C56C0" />
        <Text style={styles.propertyContextText} numberOfLines={1}>
          {propertyTitle}
        </Text>
      </View>

      <ScrollView
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dateLabel}>Today</Text>
        {messages.map((item) => (
          <View
            key={item.id}
            style={[styles.messageRow, item.senderId === auth.currentUser?.uid && styles.messageRowUser]}
          >
            <View style={[styles.bubble, item.senderId === auth.currentUser?.uid ? styles.userBubble : styles.landlordBubble]}>
              <Text style={item.senderId === auth.currentUser?.uid ? styles.userMessageText : styles.landlordMessageText}>
                {item.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.composerArea}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Write a message..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            activeOpacity={0.8}
            disabled={!message.trim()}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 38,
    paddingBottom: 16,
    backgroundColor: '#2C56C0',
  },
  backButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIdentity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  headerName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 11,
    marginTop: 2,
  },
  headerSpacer: {
    width: 34,
  },
  listHeaderTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  conversationList: {
    padding: 16,
    paddingBottom: 28,
  },
  listIntro: {
    color: '#64748B',
    fontSize: 13,
    marginBottom: 14,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  listAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF0FF',
  },
  conversationDetails: {
    flex: 1,
    marginHorizontal: 12,
    gap: 3,
  },
  conversationName: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '700',
  },
  conversationProperty: {
    color: '#2C56C0',
    fontSize: 11,
    fontWeight: '600',
  },
  conversationPreview: {
    color: '#94A3B8',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 100,
  },
  emptyTitle: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 6,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginBottom: 10,
  },
  propertyContext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#EAF0FF',
  },
  propertyContextText: {
    flex: 1,
    color: '#1E3E8F',
    fontSize: 12,
    fontWeight: '600',
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
  },
  dateLabel: {
    alignSelf: 'center',
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: 16,
  },
  messageRow: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  messageRowUser: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  landlordBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#2C56C0',
    borderBottomRightRadius: 4,
  },
  landlordMessageText: {
    color: '#334155',
    fontSize: 13,
    lineHeight: 19,
  },
  userMessageText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 19,
  },
  composerArea: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 22 : 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    maxHeight: 92,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    color: '#1E293B',
    fontSize: 13,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C56C0',
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
});
