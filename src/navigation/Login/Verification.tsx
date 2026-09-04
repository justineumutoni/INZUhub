import React, { useState, useEffect, useRef } from 'react';
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
  Modal,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons, Feather, FontAwesome } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInAnonymously,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { signInSchema, resetPasswordSchema, formatZodErrors } from '../../config/validation';
import type { RootStackParamList } from './Login';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
  route: RouteProp<RootStackParamList, 'SignIn'>;
};

export default function SignIn({ navigation, route }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Reset password modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');

  // Popup modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const modalScale = useRef(new Animated.Value(0.7)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  const isEmailValid = email.includes('@') && email.includes('.');

  // ── Show success banner if coming from Registration ─────────────────────
  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);
    }
    if (route.params?.registered === true) {
      setShowSuccessModal(true);
      // Animate popup in
      Animated.parallel([
        Animated.spring(modalScale, { toValue: 1, friction: 6, tension: 90, useNativeDriver: true }),
        Animated.timing(modalOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();

      // Auto-close after 4.5 seconds
      const timer = setTimeout(() => dismissModal(), 4500);
      return () => clearTimeout(timer);
    }
  }, [route.params?.registered, route.params?.email]);

  const dismissModal = () => {
    Animated.parallel([
      Animated.timing(modalScale, { toValue: 0.8, duration: 250, useNativeDriver: true }),
      Animated.timing(modalOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => setShowSuccessModal(false));
  };

  // ── Validation using Zod ──────────────────────────────────────────────────
  const validate = () => {
    const parseResult = signInSchema.safeParse({ email, password });
    if (!parseResult.success) {
      const errMap = formatZodErrors(parseResult.error);
      if (errMap.email) setEmailError(errMap.email);
      else setEmailError('');
      if (errMap.password) setPasswordError(errMap.password);
      else setPasswordError('');
      return false;
    }
    setEmailError('');
    setPasswordError('');
    return true;
  };

  // ── Sign In ─────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.replace('Home');
    } catch (err: any) {
      const code = err?.code ?? '';
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential'
      ) {
        setPasswordError('Incorrect email or password.');
      } else if (code === 'auth/invalid-email') {
        setEmailError('Invalid email address.');
      } else if (code === 'auth/too-many-requests') {
        Alert.alert('Too many attempts', 'Account temporarily locked. Please reset your password or try later.');
      } else {
        Alert.alert('Sign In Failed', err?.message ?? 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Social Sign-In (Google / Facebook - Instant Mock Login) ─────────────────
  const handleSocialSignIn = async (providerType: 'google' | 'facebook') => {
    setSocialLoading(providerType);
    try {
      const mockData = providerType === 'google' ? {
        fullName: 'Alex Morgan',
        email: 'alex.morgan@gmail.com',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        phone: '(+1) 555-0199',
        location: 'New York, USA',
        status: '10 Applied | Archen',
        provider: 'google',
      } : {
        fullName: 'Jordan Smith',
        email: 'jordan.smith@facebook.com',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        phone: '(+1) 555-0144',
        location: 'California, USA',
        status: '5 Applied | Archen',
        provider: 'facebook',
      };

      try {
        const userCred = await signInAnonymously(auth);
        if (userCred.user) {
          await updateProfile(userCred.user, {
            displayName: mockData.fullName,
            photoURL: mockData.photoURL,
          }).catch(() => {});

          await setDoc(doc(db, 'users', userCred.user.uid), {
            uid: userCred.user.uid,
            ...mockData,
            lastLoginAt: serverTimestamp(),
          }, { merge: true }).catch(() => {});
        }
      } catch (authErr) {
        console.warn('Social mock sign-in fallback:', authErr);
      }

      navigation.replace('Home');
    } catch (err: any) {
      navigation.replace('Home');
    } finally {
      setSocialLoading(null);
    }
  };

  // ── Send Password Reset Email ───────────────────────────────────────────────
  const handleSendPasswordReset = async () => {
    const targetEmail = resetEmail.trim() || email.trim();
    const parseResult = resetPasswordSchema.safeParse({ email: targetEmail });
    if (!parseResult.success) {
      const errMap = formatZodErrors(parseResult.error);
      setResetError(errMap.email || 'Please enter a valid email address.');
      return;
    }
    setResetLoading(true);
    setResetError('');
    try {
      await sendPasswordResetEmail(auth, targetEmail);
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        setShowResetModal(false);
      }, 3000);
    } catch (err: any) {
      const code = err?.code;
      if (code === 'auth/user-not-found') {
        setResetError('No account found with this email.');
      } else if (code === 'auth/invalid-email') {
        setResetError('Invalid email format.');
      } else {
        setResetError(err?.message || 'Failed to send reset link.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2956C2" />

      {/* ── Password Reset Modal ───────────────────────────────────────────── */}
      <Modal
        visible={showResetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResetModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowResetModal(false)}
        >
          <View
            style={styles.modalCard}
            onStartShouldSetResponder={() => true}
          >
            <View style={[styles.modalIconCircle, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="key-outline" size={38} color="#2956C2" />
            </View>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <Text style={styles.modalSubtitle}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>

            {resetSuccess ? (
              <View style={styles.resetSuccessBox}>
                <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                <Text style={styles.resetSuccessText}>Reset link sent! Please check your inbox.</Text>
              </View>
            ) : (
              <>
                <View style={[styles.inputWrapper, { width: '100%', marginBottom: 12 }, !!resetError && styles.inputError]}>
                  <Text style={[styles.floatingLabel, !!resetError && styles.labelError]}>Email Address</Text>
                  <TextInput
                    style={styles.textInput}
                    value={resetEmail}
                    onChangeText={(t) => { setResetEmail(t); setResetError(''); }}
                    placeholder="example@mail.com"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {!!resetError && <Text style={[styles.errorText, { alignSelf: 'flex-start' }]}>{resetError}</Text>}

                <TouchableOpacity
                  style={[styles.modalButton, resetLoading && { opacity: 0.7 }]}
                  onPress={handleSendPasswordReset}
                  activeOpacity={0.85}
                  disabled={resetLoading}
                >
                  {resetLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.modalButtonText}>Send Reset Link</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ marginTop: 14 }}
                  onPress={() => setShowResetModal(false)}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '500' }}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

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
            <Text style={styles.headerTitle}>InzuHub</Text>
            {showSuccessModal && (
              <Animated.View
                style={[
                  styles.successBanner,
                  { opacity: modalOpacity, transform: [{ scale: modalScale }] },
                ]}
              >
                <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                <Text style={styles.successBannerText}>Registered Successfully!</Text>
              </Animated.View>
            )}
          </View>

          {/* Card */}
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Sign In to Continue</Text>

              {/* Email */}
              <View style={[styles.inputWrapper, !!emailError && styles.inputError]}>
                <Text style={[styles.floatingLabel, !!emailError && styles.labelError]}>
                  Email Address
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={(t) => { setEmail(t); setEmailError(''); }}
                  placeholder="example@mail.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {isEmailValid && !emailError && (
                  <View style={styles.rightIcon}>
                    <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                  </View>
                )}
              </View>
              {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}

              {/* Password */}
              <View style={[styles.inputWrapper, !!passwordError && styles.inputError]}>
                <Text style={[styles.floatingLabel, !!passwordError && styles.labelError]}>
                  Password
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={(t) => { setPassword(t); setPasswordError(''); }}
                  placeholder="••••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={securePassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.rightIcon}
                  onPress={() => setSecurePassword((s) => !s)}
                  activeOpacity={0.7}
                >
                  <Feather name={securePassword ? 'eye-off' : 'eye'} size={20} color="#8E9AA8" />
                </TouchableOpacity>
              </View>
              {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

              {/* Log In Button */}
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                activeOpacity={0.85}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.loginButtonText}>Log In</Text>
                )}
              </TouchableOpacity>

              {/* Reset Password */}
              <TouchableOpacity
                style={styles.resetRow}
                activeOpacity={0.7}
                onPress={() => {
                  setResetEmail(email);
                  setResetError('');
                  setShowResetModal(true);
                }}
              >
                <Text style={styles.resetText}>Forgot Password? Reset Here</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Social Section */}
          <View style={styles.socialSection}>
            <Text style={styles.socialText}>Sign In with</Text>

            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.75}
              onPress={() => handleSocialSignIn('facebook')}
              disabled={socialLoading !== null}
            >
              {socialLoading === 'facebook' ? (
                <ActivityIndicator size="small" color="#1877F2" />
              ) : (
                <>
                  <FontAwesome name="facebook-square" size={22} color="#1877F2" />
                  <Text style={styles.socialButtonText}>Continue with Facebook</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.75}
              onPress={() => handleSocialSignIn('google')}
              disabled={socialLoading !== null}
            >
              {socialLoading === 'google' ? (
                <ActivityIndicator size="small" color="#4285F4" />
              ) : (
                <>
                  <Svg width={20} height={20} viewBox="0 0 24 24">
                    <Path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                    <Path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z" />
                    <Path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
                    <Path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </Svg>
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerRegular}>New Member? </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Sign up Here</Text>
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
  scrollContent: { flexGrow: 1, paddingBottom: 36 },

  // ── Modal ───────────────────────────────────────────────────────────────────
  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    backgroundColor: '#FFFFFF', borderRadius: 24,
    paddingVertical: 36, paddingHorizontal: 28,
    alignItems: 'center', width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18, shadowRadius: 24, elevation: 12,
  },
  modalIconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#F0FDF4',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22, fontWeight: '800', color: '#111827',
    textAlign: 'center', marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14, color: '#6B7280', textAlign: 'center',
    lineHeight: 22, marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#2956C2', borderRadius: 10,
    height: 48, justifyContent: 'center', alignItems: 'center',
    width: '100%',
  },
  modalButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  resetSuccessBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  resetSuccessText: {
    fontSize: 13,
    color: '#16A34A',
    fontWeight: '600',
    flex: 1,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: '#2956C2',
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingBottom: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 12,
    marginHorizontal: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  successBannerText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#15803D',
    letterSpacing: 0.1,
  },

  // ── Card ────────────────────────────────────────────────────────────────────
  cardContainer: { paddingHorizontal: 24, marginTop: -42 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    paddingHorizontal: 20, paddingTop: 26, paddingBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08, shadowRadius: 14, elevation: 4,
  },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 22 },

  // ── Inputs ──────────────────────────────────────────────────────────────────
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

  // ── Buttons ─────────────────────────────────────────────────────────────────
  loginButton: {
    backgroundColor: '#2956C2', borderRadius: 8, height: 50,
    justifyContent: 'center', alignItems: 'center', marginTop: 8,
  },
  loginButtonDisabled: { backgroundColor: '#7A9AD9' },
  loginButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  resetRow: { alignItems: 'flex-end', marginTop: 12 },
  resetText: { fontSize: 13, color: '#4B5563', fontWeight: '400' },

  // ── Social ──────────────────────────────────────────────────────────────────
  socialSection: { paddingHorizontal: 24, marginTop: 28, alignItems: 'center' },
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