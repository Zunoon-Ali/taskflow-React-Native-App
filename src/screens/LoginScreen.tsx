import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { useAppTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../types';
import { Typography } from '../styles';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, toggleTheme, colors } = useAppTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Check saved session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('logged_in_user');
        if (savedUser) {
          navigation.replace('Home', { username: savedUser });
        }
      } catch (error) {
        console.error('Failed to read logged_in_user:', error);
      }
    };
    checkSession();
  }, []);

  // Form submit handler
  const handleLogin = async () => {
    if (!username.trim()) {
      setErrorText('Username/Email is required');
      return;
    }
    if (!password.trim()) {
      setErrorText('Password is required');
      return;
    }
    if (password.length < 4) {
      setErrorText('Password must be at least 4 characters');
      return;
    }

    setErrorText('');
    try {
      await AsyncStorage.setItem('logged_in_user', username.trim());
    } catch (error) {
      console.error('Failed to save session:', error);
    }
    navigation.replace('Home', { username: username.trim() });
  };

  const isDark = theme === 'dark';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Theme Toggler */}
        <View style={styles.themeRow}>
          <Text style={[styles.themeLabel, { color: colors.textMuted }]}>
            {isDark ? 'Dark Theme' : 'Light Theme'}
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
            thumbColor={isDark ? '#E8A020' : '#FFFFFF'}
          />
        </View>

        {/* Brand Logo Header */}
        <View style={styles.logoSection}>
          <Text style={[styles.brandTitle, { color: colors.text }]}>TaskFlow</Text>
          <Text style={[styles.brandSubtitle, { color: colors.textMuted }]}>
            Student Task Manager
          </Text>
        </View>

        {/* Form Card */}
        <View style={[styles.formCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
          <Text style={[styles.loginTitle, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.loginSubtitle, { color: colors.textMuted }]}>
            Login to organize your academic tasks
          </Text>

          {/* Username Input */}
          <Text style={[styles.fieldLabel, { color: colors.text }]}>Username / Email</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: isDark ? '#0D1B3E' : '#F0F5FF', 
              borderColor: colors.border,
              color: colors.text 
            }]}
            placeholder="Enter your username or email"
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
          <View style={[styles.passwordContainer, { 
            backgroundColor: isDark ? '#0D1B3E' : '#F0F5FF', 
            borderColor: colors.border 
          }]}>
            <TextInput
              style={[styles.passwordInput, { color: colors.text }]}
              placeholder="Enter password"
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(txt) => {
                setPassword(txt);
                if (errorText) setErrorText('');
              }}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.eyeBtn}
              activeOpacity={0.7}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={[styles.eyeText, { color: colors.textMuted }]}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Validation Error */}
          {errorText ? <Text style={styles.errorLabel}>{errorText}</Text> : null}

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.loginBtn}
            activeOpacity={0.8}
            onPress={handleLogin}
          >
            <Text style={styles.loginBtnText}>LOG IN</Text>
          </TouchableOpacity>

          {/* Autofill Demo Button */}
          <TouchableOpacity
            style={[styles.autofillBtn, { borderColor: colors.border }]}
            activeOpacity={0.8}
            onPress={() => {
              setUsername('student@taskflow.com');
              setPassword('student123');
              if (errorText) setErrorText('');
            }}
          >
            <Text style={[styles.autofillBtnText, { color: colors.text }]}>Autofill Demo Credentials</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          SZABIST Karachi · BSCS - 6D · 2026
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...Typography.body,
  },
  eyeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  eyeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  autofillBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
    borderStyle: 'dashed',
  },
  autofillBtnText: {
    ...Typography.button,
    fontSize: 13,
    fontWeight: '600',
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
