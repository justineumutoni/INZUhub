import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, Feather, FontAwesome } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import type { PropertyDetailData } from '../../types/property';

// ─── Navigation Types (shared across all screens) ─────────────────────────────
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  EmailVerification: { email: string };
  SignIn: { registered?: boolean } | undefined;
  Home: undefined;
  Settings: undefined;
  Account: undefined;
  PropertyDetail?: { property?: PropertyDetailData };
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

// ─── Register Screen ───────────────────────────────────────────────────────────
export default function Register({ navigation }: Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ── Validation ──────────────────────────────────────────────────────────────
  const isNameValid = fullName.trim().length > 0;
  const isEmailValid = email.includes('@') && email.includes('.');
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!isEmailValid) newErrors.email = 'Enter a valid email address.';
    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords don't match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Create Account ──────────────────────────────────────────────────────────
  const handleCreateAccount = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // 1. Create Firebase Auth user (must be first — needed for uid)
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);

      // 2. Run the remaining 3 calls in parallel — cuts wait time by ~3x
      await Promise.all([
        // Update display name in Firebase Auth
        updateProfile(cred.user, { displayName: fullName.trim() }),
        // Send verification email
        sendEmailVerification(cred.user),
        // Save user profile to Firestore
        setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          emailVerified: false,
          createdAt: serverTimestamp(),
        }),
      ]);

      // 3. Navigate immediately — don't block on background tasks
      navigation.navigate('EmailVerification', { email: email.trim() });
    } catch (err: any) {
      const code = err?.code ?? '';
      if (code === 'auth/email-already-in-use') {
        setErrors({ email: 'This email is already registered.' });
      } else if (code === 'auth/invalid-email') {
        setErrors({ email: 'Invalid email address.' });
      } else if (code === 'auth/weak-password') {
        setErrors({ password: 'Password must be at least 6 characters.' });
      } else {
        Alert.alert('Registration Failed', err?.message ?? 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── UI ───────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2956C2" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Room Finder</Text>
            <Text style={styles.headerSubtitle}>Ultimate property finder</Text>
          </View>

          {/* Card */}
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Create an Account</Text>

              {/* Full Name */}
              <View style={[styles.inputWrapper, !!errors.fullName && styles.inputError]}>
                <Text style={[styles.floatingLabel, !!errors.fullName && styles.labelError]}>
                  Full Name
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={fullName}
                  onChangeText={(t) => { setFullName(t); setErrors((e) => ({ ...e, fullName: '' })); }}
                  placeholder="Enter full name"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="words"
                />
                {isNameValid && !errors.fullName && (
                  <View style={styles.rightIcon}>
                    <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                  </View>
                )}
              </View>
              {!!errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

              {/* Email */}
              <View style={[styles.inputWrapper, !!errors.email && styles.inputError]}>
                <Text style={[styles.floatingLabel, !!errors.email && styles.labelError]}>
                  Email Address
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: '' })); }}
                  placeholder="Enter email address"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {isEmailValid && !errors.email && (
                  <View style={styles.rightIcon}>
                    <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                  </View>
                )}
              </View>
              {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              {/* Password */}
              <View style={[styles.inputWrapper, !!errors.password && styles.inputError]}>
                <Text style={[styles.floatingLabel, !!errors.password && styles.labelError]}>
                  Password
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: '' })); }}
                  placeholder="Enter password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={securePassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.rightIcon}
                  onPress={() => setSecurePassword(s => !s)}
                  activeOpacity={0.7}
                >
                  <Feather name={securePassword ? 'eye-off' : 'eye'} size={20} color="#8E9AA8" />
                </TouchableOpacity>
              </View>
              {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              {/* Confirm Password */}
              <View style={[styles.inputWrapper, !!errors.confirmPassword && styles.inputError]}>
                <Text style={[styles.floatingLabel, !!errors.confirmPassword && styles.labelError]}>
                  Confirm Password
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={confirmPassword}
                  onChangeText={(t) => { setConfirmPassword(t); setErrors((e) => ({ ...e, confirmPassword: '' })); }}
                  placeholder="Confirm password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={secureConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.rightIcon}
                  onPress={() => setSecureConfirmPassword(s => !s)}
                  activeOpacity={0.7}
                >
                  <Feather name={secureConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#8E9AA8" />
                </TouchableOpacity>
              </View>
              {!!errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
              {passwordsMatch && !errors.confirmPassword && (
                <Text style={styles.matchText}>✓ Passwords match</Text>
              )}

              {/* Create Account Button */}
              <TouchableOpacity
                style={[styles.createButton, loading && styles.createButtonDisabled]}
                activeOpacity={0.85}
                onPress={handleCreateAccount}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.createButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Social Section */}
          <View style={styles.socialSection}>
            <Text style={styles.socialText}>or Sign Up with</Text>

            <TouchableOpacity style={styles.socialButton} activeOpacity={0.75}>
              <FontAwesome name="facebook-square" size={22} color="#1877F2" />
              <Text style={styles.socialButtonText}>Continue with Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} activeOpacity={0.75}>
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <Path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z" />
                <Path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
                <Path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </Svg>
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerRegular}>Have an account? </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('SignIn', {})}>
                <Text style={styles.footerLink}>Sign In Here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  scrollContent: { flexGrow: 1, paddingBottom: 30 },
  header: {
    backgroundColor: '#2956C2',
    paddingTop: Platform.OS === 'ios' ? 64 : 50,
    paddingBottom: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 14, color: '#E0EAFF', marginTop: 6, fontWeight: '400' },
  cardContainer: { paddingHorizontal: 24, marginTop: -42 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    paddingHorizontal: 20, paddingTop: 26, paddingBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08, shadowRadius: 14, elevation: 4,
  },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 22 },
  inputWrapper: {
    borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, height: 52,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14,
    marginBottom: 6, position: 'relative', backgroundColor: '#FFFFFF',
  },
  inputError: { borderColor: '#EF4444' },
  floatingLabel: {
    position: 'absolute', top: -9, left: 12, backgroundColor: '#FFFFFF',
    paddingHorizontal: 6, fontSize: 12, color: '#8E9AA8', fontWeight: '500', zIndex: 1,
  },
  labelError: { color: '#EF4444' },
  textInput: { flex: 1, fontSize: 14.5, color: '#1E293B', fontWeight: '600', height: '100%', paddingVertical: 0 },
  rightIcon: { marginLeft: 8, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 12, color: '#EF4444', marginBottom: 12, marginLeft: 2 },
  matchText: { fontSize: 12, color: '#22C55E', marginBottom: 12, marginLeft: 2 },
  createButton: {
    backgroundColor: '#2956C2', borderRadius: 8, height: 50,
    justifyContent: 'center', alignItems: 'center', marginTop: 8,
  },
  createButtonDisabled: { backgroundColor: '#7A9AD9' },
  createButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  socialSection: { paddingHorizontal: 24, marginTop: 22, alignItems: 'center' },
  socialText: { fontSize: 13, color: '#8E9AA8', marginBottom: 16, fontWeight: '400' },
  socialButton: {
    width: '100%', height: 48, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginBottom: 12, elevation: 1,
  },
  socialButtonText: { marginLeft: 10, fontSize: 14, color: '#4B5563', fontWeight: '500' },
  footerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18 },
  footerRegular: { fontSize: 13.5, color: '#374151' },
  footerLink: { fontSize: 13.5, color: '#2956C2', fontWeight: '600' },
});
