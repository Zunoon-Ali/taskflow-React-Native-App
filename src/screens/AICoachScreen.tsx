import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useAppTheme } from '../context/ThemeContext';
import { useAiMotivation } from '../hooks/useAi';
import { RootStackParamList } from '../types';
import { Typography } from '../styles';

type Props = StackScreenProps<RootStackParamList, 'AICoach'>;

export const AICoachScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, toggleTheme, colors } = useAppTheme();
  const { mutate: getMotivation, isPending: isLoading } = useAiMotivation();

  const [feelingText, setFeelingText] = useState('');
  const [mood, setMood] = useState('');
  const [advice, setAdvice] = useState('');

  const isDark = theme === 'dark';

  const handleGetMotivation = () => {
    if (!feelingText.trim()) return;
    getMotivation(feelingText, {
      onSuccess: (data) => {
        setMood(data.mood);
        setAdvice(data.advice);
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header */}
      <View style={[styles.headerRow, { paddingTop: Platform.OS === 'ios' ? 50 : 20 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backText, { color: colors.text }]}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>AI Coach</Text>

        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
          thumbColor={isDark ? '#E8A020' : '#FFFFFF'}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Coach Avatar Section */}
        <View style={styles.coachAvatarSection}>
          <Text style={[styles.coachAvatarTitle, { color: colors.text }]}>AI Coach</Text>
          <Text style={[styles.coachAvatarSubtitle, { color: colors.textMuted }]}>
            Tell me how you are feeling or what challenge you face today
          </Text>
        </View>

        {/* Input */}
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.surface, 
            borderColor: colors.border,
            color: colors.text 
          }]}
          multiline
          placeholder="e.g. I have 3 exams tomorrow and I don't know where to start..."
          placeholderTextColor={colors.textMuted}
          value={feelingText}
          onChangeText={setFeelingText}
        />

        {/* Submit */}
        <TouchableOpacity
          style={styles.motivateBtn}
          activeOpacity={0.8}
          onPress={handleGetMotivation}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.motivateBtnText}>GET AI MOTIVATION</Text>
          )}
        </TouchableOpacity>

        {/* Response */}
        {advice ? (
          <View style={styles.responseCard}>
            <Text style={styles.moodLabel}>Mood: <Text style={styles.moodValue}>{mood}</Text></Text>
            <View style={styles.separator} />
            <Text style={styles.adviceContent}>{advice}</Text>
          </View>
        ) : null}

      </ScrollView>

      <Text style={[styles.footerText, { color: colors.textMuted }]}>Manage your tasks smarter</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: {
    paddingRight: 10,
  },
  backText: {
    fontSize: 26,
    fontWeight: '700',
  },
  headerTitle: {
    ...Typography.h3,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  coachAvatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  coachAvatarTitle: {
    ...Typography.h2,
    fontWeight: '800',
  },
  coachAvatarSubtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    ...Typography.body,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  motivateBtn: {
    backgroundColor: '#581C87',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  motivateBtnText: {
    ...Typography.button,
    color: '#FFFFFF',
  },
  responseCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D8B4FE',
    padding: 20,
    marginTop: 24,
  },
  moodLabel: {
    ...Typography.h4,
    color: '#581C87',
    fontWeight: '700',
  },
  moodValue: {
    fontWeight: '800',
  },
  separator: {
    height: 1,
    backgroundColor: '#E9D5FF',
    marginVertical: 12,
  },
  adviceContent: {
    ...Typography.body,
    color: '#1E293B',
    lineHeight: 22,
  },
  footerText: {
    ...Typography.caption,
    textAlign: 'center',
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
    fontWeight: '500',
  },
});

export default AICoachScreen;
