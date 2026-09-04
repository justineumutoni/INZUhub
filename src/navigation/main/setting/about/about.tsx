import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
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

export default function About() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleUpgrade = () => {
    // TODO: navigate to premium/upgrade screen
  };

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
        <Text style={styles.headerTitle}>About us</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Banner Image ──────────────────────────────────────────────── */}
        <View style={styles.bannerWrapper}>
          <Image
            // TODO: replace with real banner asset, e.g. require('../../assets/about-banner.png')
            source={require('../../../../../assets/icon.png')}
            style={styles.bannerImage}
          />
        </View>

        {/* ── About the Company ────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Company</Text>
          <Text style={styles.sectionBody}>
            Lorem ipsum is placeholder text commonly used in the graphic,
            print, and publishing industries for previewing layouts and
            visual mockups.
          </Text>
        </View>

        {/* ── About the Members ────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Members</Text>
          <Text style={styles.sectionBody}>
            Lorem ipsum is placeholder text commonly used in the graphic,
            print, and publishing industries for previewing layouts and
            visual mockups.{'\n\n'}
            Lorem ipsum is placeholder text commonly used in the graphic,
            print, and publishing industries for previewing layouts and
            visual mockups. Lorem ipsum is placeholder text commonly used
            in the graphic, print.
          </Text>
        </View>

        {/* ── Premium Upsell Card ───────────────────────────────────────── */}
        <View style={styles.upsellCard}>
          <View style={styles.upsellIconBox}>
            <Feather name="help-circle" size={18} color="#2C56C0" />
          </View>
          <View style={styles.upsellTextBox}>
            <Text style={styles.upsellTitle}>Get ready to get Featured?</Text>
            <Text style={styles.upsellSubtitle}>Go for Premium Service</Text>
          </View>
          <TouchableOpacity
            style={styles.upgradeButton}
            activeOpacity={0.85}
            onPress={handleUpgrade}
          >
            <Text style={styles.upgradeButtonText}>Upgrade</Text>
          </TouchableOpacity>
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
  bannerWrapper: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#E5E7EB',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
  },
  upsellCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FF',
    marginHorizontal: 20,
    marginTop: 8,
    padding: 14,
    borderRadius: 14,
    gap: 10,
  },
  upsellIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E0EBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upsellTextBox: {
    flex: 1,
    gap: 2,
  },
  upsellTitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  upsellSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2C56C0',
  },
  upgradeButton: {
    backgroundColor: '#2C56C0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});