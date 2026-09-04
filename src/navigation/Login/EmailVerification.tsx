import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import type { RootStackParamList } from './Login';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EmailVerification'>;
  route: RouteProp<RootStackParamList, 'EmailVerification'>;
};

export default function EmailVerification({ navigation, route }: Props) {
  const { email } = route.params;
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!auth.currentUser) return;
    setResending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Could not resend email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!auth.currentUser) {
      navigation.replace('SignIn', { registered: true });
      return;
    }
    setChecking(true);
    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        try {
          await setDoc(doc(db, 'users', auth.currentUser.uid), { emailVerified: true }, { merge: true });
        } catch (e) {
          console.warn('Firestore write error:', e);
        }
        navigation.replace('Home');
      } else {
        Alert.alert(
          'Email Not Verified Yet',
          `We checked, but ${email} is not verified yet. Please check your spam folder or tap "Resend Email".`
        );
      }
    } catch (err: any) {
      navigation.replace('SignIn', { registered: true });
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2956C2" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>InzuHub</Text>
      </View>

      {/* Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          {/* Icon */}
          <View style={styles.iconCircle}>
            <Ionicons name="mail-outline" size={40} color="#2956C2" />
          </View>

          <Text style={styles.cardTitle}>Verify Your Email</Text>
          <Text style={styles.description}>
            We've sent a verification link to:
          </Text>
          <Text style={styles.emailText}>{email}</Text>
          <Text style={styles.subDescription}>
            Open your email and tap the link to verify your account, then click below to continue.
          </Text>

          {/* Resent confirmation */}
          {resent && (
            <View style={styles.resentBanner}>
              <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
              <Text style={styles.resentText}>Verification email resent!</Text>
            </View>
          )}

          {/* Check verification & enter */}
          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.85}
            onPress={handleCheckVerification}
            disabled={checking}
          >
            {checking ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.continueButtonText}>I've Verified My Email</Text>
            )}
          </TouchableOpacity>

          {/* Sign In Alternate */}
          <TouchableOpacity
            style={styles.signInButton}
            activeOpacity={0.85}
            onPress={() => navigation.replace('SignIn', { registered: true })}
          >
            <Text style={styles.signInButtonText}>Go to Sign In</Text>
          </TouchableOpacity>

          {/* Resend */}
          <TouchableOpacity
            style={styles.resendButton}
            activeOpacity={0.7}
            onPress={handleResend}
            disabled={resending}
          >
            {resending ? (
              <ActivityIndicator size="small" color="#2956C2" />
            ) : (
              <Text style={styles.resendText}>Didn't receive it? Resend Email</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  header: {
    backgroundColor: '#2956C2',
    paddingTop: Platform.OS === 'ios' ? 64 : 50,
    paddingBottom: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.3 },
  cardContainer: { paddingHorizontal: 24, marginTop: -50 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20,
    paddingHorizontal: 24, paddingTop: 32, paddingBottom: 28,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08, shadowRadius: 14, elevation: 4,
  },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#EEF2FF',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22, fontWeight: '800', color: '#111827',
    textAlign: 'center', marginBottom: 12,
  },
  description: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  emailText: {
    fontSize: 15, fontWeight: '700', color: '#2956C2',
    textAlign: 'center', marginTop: 4, marginBottom: 14,
  },
  subDescription: {
    fontSize: 13, color: '#9CA3AF', textAlign: 'center',
    lineHeight: 20, marginBottom: 20,
  },
  resentBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0',
    borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14,
    marginBottom: 16,
  },
  resentText: { marginLeft: 6, fontSize: 13, color: '#16A34A', fontWeight: '600' },
  continueButton: {
    backgroundColor: '#2956C2', borderRadius: 10, height: 50,
    justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 4,
  },
  continueButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  signInButton: {
    backgroundColor: '#EEF4FF', borderRadius: 10, height: 46,
    justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 10,
  },
  signInButtonText: { color: '#2956C2', fontSize: 14, fontWeight: '600' },
  resendButton: {
    marginTop: 16, paddingVertical: 8,
  },
  resendText: { fontSize: 13, color: '#2956C2', fontWeight: '500' },
});
