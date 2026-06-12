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
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { useAppTheme } from '../context/ThemeContext';
import { useAiMotivation } from '../hooks/useAi';
import { RootStackParamList } from '../types';
import { Typography } from '../styles';

type Props = StackScreenProps<RootStackParamList, 'AICoach'>;

// ─── Preset Feeling Options ───────────────────────────────────────────────────
type FeelingOption = {
  id: string;
  emoji: string;
  label: string;
  description: string;
  keywords: string; // sent to AI / fallback
};

const FEELING_OPTIONS: FeelingOption[] = [
  {
    id: 'exam',
    emoji: '📚',
    label: 'Exam / Paper ki tension',
    description: 'Kal exam hai, bilkul taiyari nahi',
    keywords: 'exam paper tension pareshan fikar preparation',
  },
  {
    id: 'stressed',
    emoji: '😰',
    label: 'Pareshan / Stressed',
    description: 'Bohot zyada fikar ho rahi hai',
    keywords: 'pareshan stressed anxious dar mushkil worried',
  },
  {
    id: 'tired',
    emoji: '😴',
    label: 'Thaka / Tired',
    description: 'Bilkul energy nahi, thaka hua hun',
    keywords: 'thaka tired exhausted thak gaya',
  },
  {
    id: 'lazy',
    emoji: '🛋️',
    label: 'Susti / Dil Nahi Kar Raha',
    description: 'Kuch karne ka mann nahi',
    keywords: 'susti lazy dil nahi man nahi boring bored',
  },
  {
    id: 'sleepy',
    emoji: '😪',
    label: 'Neend / Sleepy',
    description: 'Neend aa rahi hai, focus nahi ho raha',
    keywords: 'neend sleepy tired thaka',
  },
  {
    id: 'happy',
    emoji: '😊',
    label: 'Khush / Happy',
    description: 'Aaj acha feel ho raha hai',
    keywords: 'khush happy acha sukoon great',
  },
  {
    id: 'motivated',
    emoji: '🚀',
    label: 'Motivated / Excited',
    description: 'Kuch bada karne ka dil hai',
    keywords: 'motivated excited amazing great',
  },
  {
    id: 'confused',
    emoji: '🤔',
    label: 'Confused / Samajh Nahi',
    description: 'Kahan se start karun samajh nahi',
    keywords: 'confused mushkil pareshan fail worried stress',
  },
];

// Mood badge colors
const MOOD_COLORS: Record<string, { bg: string; text: string }> = {
  Stressed: { bg: '#FEE2E2', text: '#DC2626' },
  Happy:    { bg: '#DCFCE7', text: '#16A34A' },
  Tired:    { bg: '#FEF9C3', text: '#CA8A04' },
  Neutral:  { bg: '#F1F5F9', text: '#64748B' },
};

// ─────────────────────────────────────────────────────────────────────────────

export const AICoachScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme, toggleTheme, colors } = useAppTheme();
  const { mutate: getMotivation, isPending: isLoading } = useAiMotivation();

  // Input mode: 'preset' = dropdown chip selected | 'custom' = user typed text
  const [inputMode, setInputMode] = useState<'preset' | 'custom'>('preset');
  const [selectedOption, setSelectedOption] = useState<FeelingOption | null>(null);
  const [customText, setCustomText] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [mood, setMood] = useState('');
  const [advice, setAdvice] = useState('');

  const isDark = theme === 'dark';

  // Build the final query string depending on mode
  const getFeelingQuery = (): string => {
    if (inputMode === 'preset' && selectedOption) return selectedOption.keywords;
    if (inputMode === 'custom') return customText.trim();
    return '';
  };

  const canSubmit = inputMode === 'preset' ? !!selectedOption : customText.trim().length > 2;

  const handleGetMotivation = () => {
    const query = getFeelingQuery();
    if (!query) return;
    setMood('');
    setAdvice('');
    getMotivation(query, {
      onSuccess: (data) => {
        setMood(data.mood);
        setAdvice(data.advice);
      },
    });
  };

  const handleSelectOption = (option: FeelingOption) => {
    setSelectedOption(option);
    setDropdownVisible(false);
    setMood('');
    setAdvice('');
  };

  const moodColor = mood ? (MOOD_COLORS[mood] ?? MOOD_COLORS.Neutral) : null;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Header ────────────────────────────────────── */}
      <View style={[styles.headerRow, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={() => navigation.goBack()}>
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

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 60 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Coach Hero ────────────────────────────────── */}
        <View style={styles.coachAvatarSection}>
          <Text style={styles.coachEmoji}>🤖</Text>
          <Text style={[styles.coachAvatarTitle, { color: colors.text }]}>AI Coach</Text>
          <Text style={[styles.coachAvatarSubtitle, { color: colors.textMuted }]}>
            Preset select karo ya apni feeling khud likho
          </Text>
        </View>

        {/* ── Mode Toggle Tabs ──────────────────────────── */}
        <View style={[styles.modeTabRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.modeTab, inputMode === 'preset' && styles.modeTabActive]}
            onPress={() => { setInputMode('preset'); setMood(''); setAdvice(''); }}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeTabText, inputMode === 'preset' && styles.modeTabTextActive]}>
              🎯  Quick Select
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeTab, inputMode === 'custom' && styles.modeTabActive]}
            onPress={() => { setInputMode('custom'); setMood(''); setAdvice(''); }}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeTabText, inputMode === 'custom' && styles.modeTabTextActive]}>
              ✏️  Apna Likho
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── PRESET MODE ───────────────────────────────── */}
        {inputMode === 'preset' && (
          <>
            <Text style={[styles.stepLabel, { color: colors.textMuted }]}>
              Feeling select karein
            </Text>

            {/* Dropdown trigger */}
            <TouchableOpacity
              style={[
                styles.dropdownBtn,
                {
                  backgroundColor: colors.surface,
                  borderColor: selectedOption ? '#6366F1' : colors.border,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => setDropdownVisible(true)}
            >
              {selectedOption ? (
                <View style={styles.dropdownSelectedRow}>
                  <Text style={styles.dropdownSelectedEmoji}>{selectedOption.emoji}</Text>
                  <View style={styles.dropdownSelectedText}>
                    <Text style={[styles.dropdownSelectedLabel, { color: colors.text }]}>
                      {selectedOption.label}
                    </Text>
                    <Text style={[styles.dropdownSelectedDesc, { color: colors.textMuted }]}>
                      {selectedOption.description}
                    </Text>
                  </View>
                  <Text style={{ color: '#6366F1', fontSize: 18 }}>▾</Text>
                </View>
              ) : (
                <View style={styles.dropdownSelectedRow}>
                  <Text style={[styles.dropdownPlaceholder, { color: colors.textMuted }]}>
                    Tap karein — feeling select karein...
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 18 }}>▾</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Quick chips row */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsScroll}
              contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
            >
              {FEELING_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.chip,
                    {
                      backgroundColor:
                        selectedOption?.id === opt.id ? '#6366F1' : colors.surface,
                      borderColor:
                        selectedOption?.id === opt.id ? '#6366F1' : colors.border,
                    },
                  ]}
                  onPress={() => handleSelectOption(opt)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.chipEmoji}>{opt.emoji}</Text>
                  <Text
                    style={[
                      styles.chipText,
                      { color: selectedOption?.id === opt.id ? '#FFFFFF' : colors.text },
                    ]}
                  >
                    {opt.label.split('/')[0].trim()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* ── CUSTOM TEXT MODE ──────────────────────────── */}
        {inputMode === 'custom' && (
          <>
            <Text style={[styles.stepLabel, { color: colors.textMuted }]}>
              Apni feeling English / Roman Urdu mein likho
            </Text>
            <TextInput
              style={[
                styles.customInput,
                {
                  backgroundColor: colors.surface,
                  borderColor: customText.trim().length > 2 ? '#6366F1' : colors.border,
                  color: colors.text,
                },
              ]}
              multiline
              placeholder={
                'Misal:\n• "Bohot thaka hua hun, kuch karne ka mann nahi"\n• "Kal exam hai, pareshan hun"\n• "Khush hun aaj, motivated feel ho raha hai"'
              }
              placeholderTextColor={colors.textMuted}
              value={customText}
              onChangeText={(t) => {
                setCustomText(t);
                setMood('');
                setAdvice('');
              }}
              textAlignVertical="top"
            />
            {customText.trim().length > 0 && customText.trim().length <= 2 && (
              <Text style={styles.inputHint}>Thoda aur detail mein likho...</Text>
            )}
          </>
        )}

        {/* ── Submit Button ─────────────────────────────── */}
        <TouchableOpacity
          style={[styles.motivateBtn, !canSubmit && styles.motivateBtnDisabled]}
          activeOpacity={0.8}
          onPress={handleGetMotivation}
          disabled={isLoading || !canSubmit}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.motivateBtnText}>
              {canSubmit ? 'GET AI COACHING 🚀' : 'Pehle Feeling Batao'}
            </Text>
          )}
        </TouchableOpacity>

        {/* ── Response Card ─────────────────────────────── */}
        {advice ? (
          <View style={styles.responseCard}>
            <View style={styles.moodBadgeRow}>
              <View style={[styles.moodBadge, { backgroundColor: moodColor?.bg ?? '#F1F5F9' }]}>
                <Text style={[styles.moodBadgeText, { color: moodColor?.text ?? '#64748B' }]}>
                  {mood}
                </Text>
              </View>
            </View>
            <View style={styles.separator} />
            <Text style={styles.adviceContent}>{advice}</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* ── Dropdown Modal ────────────────────────────────── */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Aaj aap kaisa feel kar rahe hain?
            </Text>
            <FlatList
              data={FEELING_OPTIONS}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionRow,
                    {
                      backgroundColor:
                        selectedOption?.id === item.id ? '#EEF2FF' : 'transparent',
                      borderColor:
                        selectedOption?.id === item.id ? '#6366F1' : colors.border,
                    },
                  ]}
                  activeOpacity={0.75}
                  onPress={() => handleSelectOption(item)}
                >
                  <Text style={styles.optionEmoji}>{item.emoji}</Text>
                  <View style={styles.optionTextCol}>
                    <Text style={[styles.optionLabel, { color: colors.text }]}>{item.label}</Text>
                    <Text style={[styles.optionDesc, { color: colors.textMuted }]}>{item.description}</Text>
                  </View>
                  {selectedOption?.id === item.id && (
                    <Text style={styles.optionCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Text style={[styles.footerText, { color: colors.textMuted, bottom: insets.bottom + 6 }]}>
        Manage your tasks smarter
      </Text>
    </KeyboardAvoidingView>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: { paddingRight: 10 },
  backText: { fontSize: 26, fontWeight: '700' },
  headerTitle: { ...Typography.h3, fontWeight: '800' },

  scrollContent: { padding: 20, paddingBottom: 60 },

  // Coach hero
  coachAvatarSection: { alignItems: 'center', marginBottom: 22, marginTop: 6 },
  coachEmoji: { fontSize: 48, marginBottom: 8 },
  coachAvatarTitle: { ...Typography.h2, fontWeight: '800' },
  coachAvatarSubtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 10,
  },

  // Mode toggle tabs
  modeTabRow: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTabActive: {
    backgroundColor: '#6366F1',
  },
  modeTabText: {
    ...Typography.button,
    color: '#64748B',
    fontSize: 13,
  },
  modeTabTextActive: {
    color: '#FFFFFF',
  },

  // Step label
  stepLabel: { ...Typography.label, marginBottom: 10, letterSpacing: 0.5 },

  // Dropdown button
  dropdownBtn: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  dropdownSelectedRow: { flexDirection: 'row', alignItems: 'center' },
  dropdownSelectedEmoji: { fontSize: 24, marginRight: 12 },
  dropdownSelectedText: { flex: 1 },
  dropdownSelectedLabel: { ...Typography.h4, fontWeight: '700' },
  dropdownSelectedDesc: { ...Typography.bodySmall, marginTop: 2 },
  dropdownPlaceholder: { ...Typography.body, flex: 1 },

  // Horizontal chips
  chipsScroll: { marginBottom: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1.5,
    paddingVertical: 7,
    paddingHorizontal: 13,
    gap: 6,
  },
  chipEmoji: { fontSize: 16 },
  chipText: { ...Typography.bodySmall, fontWeight: '600' },

  // Custom text input
  customInput: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    ...Typography.body,
    minHeight: 130,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  inputHint: {
    ...Typography.caption,
    color: '#F59E0B',
    marginTop: 6,
    marginLeft: 4,
  },

  // Submit button
  motivateBtn: {
    backgroundColor: '#581C87',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  motivateBtnDisabled: { backgroundColor: '#9CA3AF' },
  motivateBtnText: { ...Typography.button, color: '#FFFFFF', letterSpacing: 0.5 },

  // Response
  responseCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D8B4FE',
    padding: 20,
    marginTop: 24,
  },
  moodBadgeRow: { flexDirection: 'row' },
  moodBadge: { borderRadius: 20, paddingVertical: 5, paddingHorizontal: 14 },
  moodBadgeText: { ...Typography.button, fontSize: 13 },
  separator: { height: 1, backgroundColor: '#E9D5FF', marginVertical: 12 },
  adviceContent: { ...Typography.body, color: '#1E293B', lineHeight: 24 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    maxHeight: '78%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: { ...Typography.h3, fontWeight: '800', marginBottom: 16 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 6,
    borderWidth: 1.5,
  },
  optionEmoji: { fontSize: 26, marginRight: 14 },
  optionTextCol: { flex: 1 },
  optionLabel: { ...Typography.h4, fontWeight: '700' },
  optionDesc: { ...Typography.bodySmall, marginTop: 2 },
  optionCheck: { fontSize: 18, fontWeight: '900', color: '#6366F1', marginLeft: 8 },

  // Footer
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
