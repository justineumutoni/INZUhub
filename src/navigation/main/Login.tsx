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
} from 'react-native';
import { Ionicons, Feather, FontAwesome } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

export default function Login() {
  const [fullName, setFullName] = useState('Mathew Gallager');
  const [email, setEmail] = useState('contact@gmail.com');
  const [password, setPassword] = useState('••••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••••');

  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  // Validation indicators (as shown in the design)
  const isNameValid = fullName.trim().length > 0;
  const isEmailValid = email.includes('@') && email.includes('.');

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
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Room Finder</Text>
            <Text style={styles.headerSubtitle}>Ultimate property finder</Text>
          </View>

          {/* Main Card */}
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Create an Account</Text>

              {/* Full Name Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.floatingLabel}>Full Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter full name"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="words"
                />
                {isNameValid && (
                  <View style={styles.rightIcon}>
                    <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                  </View>
                )}
              </View>

              {/* Email Address Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.floatingLabel}>Email Address</Text>
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email address"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {isEmailValid && (
                  <View style={styles.rightIcon}>
                    <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                  </View>
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.floatingLabel}>Password</Text>
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={securePassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.rightIcon}
                  onPress={() => setSecurePassword(!securePassword)}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={securePassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#8E9AA8"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.floatingLabel}>Confirm Password</Text>
                <TextInput
                  style={styles.textInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={secureConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.rightIcon}
                  onPress={() => setSecureConfirmPassword(!secureConfirmPassword)}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={secureConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#8E9AA8"
                  />
                </TouchableOpacity>
              </View>

              {/* Create Account Button */}
              <TouchableOpacity style={styles.createButton} activeOpacity={0.85}>
                <Text style={styles.createButtonText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Social Sign Up Section */}
          <View style={styles.socialSection}>
            <Text style={styles.socialText}>or Sign Up with</Text>

            {/* Facebook Button */}
            <TouchableOpacity style={styles.socialButton} activeOpacity={0.75}>
              <FontAwesome name="facebook-square" size={22} color="#1877F2" />
              <Text style={styles.socialButtonText}>Continue with Facebook</Text>
            </TouchableOpacity>

            {/* Google Button */}
            <TouchableOpacity style={styles.socialButton} activeOpacity={0.75}>
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <Path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"
                />
                <Path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                />
                <Path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </Svg>
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footerRow}>
              <Text style={styles.footerRegular}>Have an account? </Text>
              <TouchableOpacity activeOpacity={0.7}>
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
  container: {
    flex: 1,
    backgroundColor: '#FAFAFC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#2956C2',
    paddingTop: Platform.OS === 'ios' ? 64 : 50,
    paddingBottom: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0EAFF',
    marginTop: 6,
    fontWeight: '400',
  },
  cardContainer: {
    paddingHorizontal: 24,
    marginTop: -42,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 24,
    // Elevation & Shadows
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 22,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 18,
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  floatingLabel: {
    position: 'absolute',
    top: -9,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    fontSize: 12,
    color: '#8E9AA8',
    fontWeight: '500',
    zIndex: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 14.5,
    color: '#1E293B',
    fontWeight: '600',
    height: '100%',
    paddingVertical: 0,
  },
  rightIcon: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#2956C2',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  socialSection: {
    paddingHorizontal: 24,
    marginTop: 22,
    alignItems: 'center',
  },
  socialText: {
    fontSize: 13,
    color: '#8E9AA8',
    marginBottom: 16,
    fontWeight: '400',
  },
  socialButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  footerRegular: {
    fontSize: 13.5,
    color: '#374151',
  },
  footerLink: {
    fontSize: 13.5,
    color: '#2956C2',
    fontWeight: '600',
  },
});
