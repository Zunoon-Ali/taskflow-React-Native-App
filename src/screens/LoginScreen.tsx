// =============================================================================
// FILE: src/screens/LoginScreen.tsx
// -----------------------------------------------------------------------------
// Yeh login page hai jahan credentials validate hote hain.
// =============================================================================

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack'; // React Navigation type
import { useAppTheme } from '../context/ThemeContext'; // Theme context custom hook
import { RootStackParamList } from '../types'; // Navigation type map
import { Typography } from '../styles'; // Typography tokens

// Screen props typings setup
type Props = StackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, toggleTheme, colors } = useAppTheme(); // Get current active theme colors

  // Login form state hook
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  // Form input validation aur navigation logic
  const handleLogin = () => {
    if (!username.trim()) {
      setErrorText('Username/Email is required!');
      return;
    }
    if (!password.trim()) {
      setErrorText('Password is required!');
      return;
    }
    if (password.length < 4) {
      setErrorText('Password must be at least 4 characters!');
      return;
    }

    setErrorText(''); // Error message clear
    navigation.replace('Home', { username: username.trim() }); // Navigate to Home screen
  };

  const isDark = theme === 'dark'; // Check dark mode active

  return (
    // KeyboardAvoidingView: Keyboard open hone pe inputs adjust hone ke liye
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top theme toggler switch row */}
        <View style={styles.themeRow}>
          <Text style={[styles.themeLabel, { color: colors.textMuted }]}>
            {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
            thumbColor={isDark ? '#E8A020' : '#FFFFFF'}
          />
        </View>

        {/* Center brand logo header area */}
        <View style={styles.logoSection}>
          <Text style={styles.logoEmoji}>🎓</Text>
          <Text style={[styles.brandTitle, { color: colors.text }]}>TaskFlow</Text>
          <Text style={[styles.brandSubtitle, { color: colors.textMuted }]}>
            Student Task Manager App
          </Text>
        </View>

        {/* Form Inputs card container */}
        <View style={[styles.formCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
          <Text style={[styles.loginTitle, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.loginSubtitle, { color: colors.textMuted }]}>
            Login to organize your academic tasks
          </Text>

          {/* Email / Username Input */}
          <Text style={[styles.fieldLabel, { color: colors.text }]}>Username / Email</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: isDark ? '#0D1B3E' : '#F0F5FF', 
              borderColor: colors.border,
              color: colors.text 
            }]}
            placeholder="Enter your name or email"
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            value={username}
            onChangeText={(txt) => {
              setUsername(txt);
              if (errorText) setErrorText('');
            }}
            autoCapitalize="none"
          />

          {/* Password Input */}
          <Text style={[styles.fieldLabel, { color: colors.text }]}>Password</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: isDark ? '#0D1B3E' : '#F0F5FF', 
              borderColor: colors.border,
              color: colors.text 
            }]}
            placeholder="Enter password"
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            secureTextEntry
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              if (errorText) setErrorText('');
            }}
            autoCapitalize="none"
          />

          {/* Validation error display label */}
          {errorText ? <Text style={styles.errorLabel}>{errorText}</Text> : null}

          {/* Submit/Login Button */}
          <TouchableOpacity
            style={styles.loginBtn}
            activeOpacity={0.8}
            onPress={handleLogin}
          >
            <Text style={styles.loginBtnText}>LOG IN</Text>
          </TouchableOpacity>
        </View>

        {/* Footer brand branding */}
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          SZABIST Karachi · BSCS - 6D · 2026
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// StyleSheet definitions
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  themeLabel: {
    ...Typography.bodySmall,
    fontWeight: '600',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoEmoji: {
    fontSize: 54,
    marginBottom: 8,
  },
  brandTitle: {
    ...Typography.h1,
    fontFamily: 'System',
    fontWeight: '800',
  },
  brandSubtitle: {
    ...Typography.bodySmall,
    marginTop: 4,
  },
  formCard: {
    borderRadius: 20,
    padding: 24,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 36,
  },
  loginTitle: {
    ...Typography.h2,
    fontWeight: '700',
  },
  loginSubtitle: {
    ...Typography.bodySmall,
    marginBottom: 20,
  },
  fieldLabel: {
    ...Typography.bodySmall,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...Typography.body,
    marginBottom: 16,
  },
  errorLabel: {
    color: '#DC2626',
    ...Typography.bodySmall,
    fontWeight: '700',
    marginBottom: 16,
  },
  loginBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  loginBtnText: {
    ...Typography.button,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  footerText: {
    ...Typography.caption,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default LoginScreen;
