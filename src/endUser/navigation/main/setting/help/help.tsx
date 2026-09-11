import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Footer } from '../../../footer/footer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../Login/Login';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    question: 'What do we get here in this app?',
    answer:
      "That which doesn't kill you makes you stronger, right? Unless it almost kills you, and renders you weaker. Being strong is pretty rad though, so go ahead.",
  },
  {
    id: '2',
    question: 'What is the use of this App?',
    answer:
      "Sometimes, you've just got to say 'the party starts here'. Unless you're not in the place where the aforementioned party is starting. Then, just shut up.",
  },
  {
    id: '3',
    question: 'How to get from location A to B?',
    answer:
      "If you believe in yourself, go double or nothing. Well, depending on how long it takes you to calculate how double is. If you're terrible at maths, don't.",
  },
];

interface FAQCardProps {
  item: FAQItem;
}

function FAQCard({ item }: FAQCardProps) {
  return (
    <View style={styles.faqCard}>
      <View style={styles.faqIconBox}>
        <Feather name="file-text" size={16} color="#2C56C0" />
      </View>
      <View style={styles.faqTextBox}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Text style={styles.faqAnswer}>{item.answer}</Text>
      </View>
    </View>
  );
}

export default function Help() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#2C56C0" />

      {/* ── Top Blue Header ────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Frequent Asked Questions</Text>

        {/* ── FAQ List ──────────────────────────────────────────────────── */}
        <View style={styles.faqList}>
          {FAQ_DATA.map((item) => (
            <FAQCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <Footer activeTab="Settings" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#2C56C0',
    paddingTop: Platform.OS === 'ios' ? 54 : 42,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    height: Platform.OS === 'ios' ? 100 : 150,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: Platform.OS === 'ios' ? 70 : 70,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    textDecorationLine: 'underline',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 14,
  },
  faqList: {
    marginHorizontal: 20,
    gap: 14,
  },
  faqCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  faqIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  faqTextBox: {
    flex: 1,
    gap: 4,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  faqAnswer: {
    fontSize: 12.5,
    color: '#6B7280',
    lineHeight: 18,
  },
});