// =============================================================================
// FILE: src/screens/TaskDetailsScreen.tsx
// -----------------------------------------------------------------------------
// Task ki details edit karne, priority set karne aur AI suggestion lene ka page.
// =============================================================================

import React, { useState, useEffect } from 'react';
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
import { StackScreenProps } from '@react-navigation/stack'; // React Navigation routing
import { useAppTheme } from '../context/ThemeContext'; // Light/dark mode themes
import { useTasks } from '../hooks/useTasks'; // Tasks global state hook
import { useAiDescription } from '../hooks/useAi'; // Flask AI hook for tasks description
import { RootStackParamList, Task } from '../types'; // TypeScript interfaces
import { Typography } from '../styles'; // Font typography definitions

// Navigation props types setup
type Props = StackScreenProps<RootStackParamList, 'TaskDetails'>;

export const TaskDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskId } = route.params; // Get taskId parameter passed from list
  const { theme, toggleTheme, colors } = useAppTheme(); // Theme colors mapping
  const { tasks, updateTask } = useTasks(); // Tasks update handler function
  const { mutate: generateDesc, isPending: isAiLoading } = useAiDescription(); // TanStack Query AI hook

  const isDark = theme === 'dark'; // Check dark mode active

  // Local state hooks to edit task fields
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [completed, setCompleted] = useState(false);
  const [aiSays, setAiSays] = useState('');

  // Find task on load and populate fields
  useEffect(() => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setTitle(task.title);
      setPriority(task.priority);
      setCompleted(task.completed);
      setAiSays(task.aiSuggestion || '');
    }
  }, [taskId, tasks]);

  // AI Description generate command handler
  const handleAiGenerate = () => {
    if (!title.trim()) return;
    generateDesc(title, {
      onSuccess: (description) => {
        setAiSays(description); // AI response set in state
      },
    });
  };

  // State save changes and go back
  const handleSaveChanges = () => {
    updateTask(taskId, {
      title: title.trim(),
      priority,
      completed,
      aiSuggestion: aiSays,
    });
    navigation.goBack(); // Return to previous screen
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* HEADER SECTION */}
      <View style={[styles.headerRow, { paddingTop: Platform.OS === 'ios' ? 50 : 20 }]}>
        {/* Back navigation button */}
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backText, { color: colors.text }]}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Task Details</Text>

        {/* Theme switcher toggle */}
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
          thumbColor={isDark ? '#E8A020' : '#FFFFFF'}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* AI Coach top shortcut link button */}
        <View style={styles.coachLinkRow}>
          <TouchableOpacity
            style={styles.coachBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AICoach')}
          >
            <Text style={styles.coachBtnText}>🤖 AI Coach</Text>
          </TouchableOpacity>
        </View>

        {/* TASK TITLE TEXTFIELD */}
        <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Task Title:</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.surface, 
            borderColor: colors.border,
            color: colors.text 
          }]}
          multiline
          placeholder="Type task title here"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        {/* PRIORITY SELECTION BUTTON GROUP */}
        <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Priority:</Text>
        <View style={[styles.priorityGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* LOW Priority Option */}
          <TouchableOpacity
            style={[
              styles.prioOption,
              priority === 'LOW' && { backgroundColor: '#2563EB' }
            ]}
            onPress={() => setPriority('LOW')}
          >
            <Text style={[
              styles.prioText,
              priority === 'LOW' ? { color: '#FFFFFF' } : { color: '#16A34A' }
            ]}>LOW</Text>
          </TouchableOpacity>

          {/* MEDIUM Priority Option */}
          <TouchableOpacity
            style={[
              styles.prioOption,
              styles.prioOptionBorder,
              priority === 'MEDIUM' && { backgroundColor: '#2563EB' }
            ]}
            onPress={() => setPriority('MEDIUM')}
          >
            <Text style={[
              styles.prioText,
              priority === 'MEDIUM' ? { color: '#FFFFFF' } : { color: '#2563EB' }
            ]}>MEDIUM</Text>
          </TouchableOpacity>

          {/* HIGH Priority Option */}
          <TouchableOpacity
            style={[
              styles.prioOption,
              priority === 'HIGH' && { backgroundColor: '#2563EB' }
            ]}
            onPress={() => setPriority('HIGH')}
          >
            <Text style={[
              styles.prioText,
              priority === 'HIGH' ? { color: '#FFFFFF' } : { color: '#DC2626' }
            ]}>HIGH</Text>
          </TouchableOpacity>
        </View>

        {/* STATUS TOGGLE BUTTON GROUP */}
        <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Status:</Text>
        <View style={[styles.statusGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Pending Button */}
          <TouchableOpacity
            style={[
              styles.statusOption,
              !completed && { backgroundColor: '#EBF2FC', borderColor: '#2563EB', borderRightWidth: 1 }
            ]}
            onPress={() => setCompleted(false)}
          >
            <Text style={styles.checkboxLabel}>
              {!completed ? '☑' : '☐'} Pending
            </Text>
          </TouchableOpacity>

          {/* Complete Button */}
          <TouchableOpacity
            style={[
              styles.statusOption,
              completed && { backgroundColor: '#DCFCE7', borderColor: '#16A34A', borderLeftWidth: 1 }
            ]}
            onPress={() => setCompleted(true)}
          >
            <Text style={[styles.checkboxLabel, completed && { color: '#16A34A' }]}>
              {completed ? '✓' : '☐'} Complete
            </Text>
          </TouchableOpacity>
        </View>

        {/* GENERATE AI MOTIVATION/DESCRIPTION BUTTON */}
        <TouchableOpacity
          style={styles.generateBtn}
          activeOpacity={0.8}
          onPress={handleAiGenerate}
          disabled={isAiLoading}
        >
          {isAiLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.generateBtnText}>✨ Generate AI Description</Text>
          )}
        </TouchableOpacity>

        {/* AI SAYS SUGGESTION DISPLAY CARD */}
        {aiSays ? (
          <View style={styles.aiSaysCard}>
            <Text style={styles.aiSaysTitle}>🤖 AI Says:</Text>
            <Text style={styles.aiSaysContent}>{aiSays}</Text>
          </View>
        ) : null}

        {/* SAVE CHANGES BUTTON */}
        <TouchableOpacity
          style={styles.saveBtn}
          activeOpacity={0.8}
          onPress={handleSaveChanges}
        >
          <Text style={styles.saveBtnText}>SAVE CHANGES</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* FOOTER BRAND */}
      <Text style={[styles.footerText, { color: colors.textMuted }]}>Manage your tasks smarter</Text>
    </View>
  );
};

// Layout styling sheet
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
  coachLinkRow: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  coachBtn: {
    backgroundColor: '#6366F1',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  coachBtnText: {
    ...Typography.label,
    color: '#FFFFFF',
  },
  fieldLabel: {
    ...Typography.bodySmall,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    ...Typography.body,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  priorityGroup: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  prioOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prioOptionBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },
  prioText: {
    ...Typography.button,
    fontSize: 12,
  },
  statusGroup: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  statusOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    ...Typography.button,
    fontSize: 12,
    color: '#64748B',
  },
  generateBtn: {
    backgroundColor: '#581C87',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  generateBtnText: {
    ...Typography.button,
    color: '#FFFFFF',
  },
  aiSaysCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D8B4FE',
    padding: 16,
    marginTop: 20,
  },
  aiSaysTitle: {
    ...Typography.h4,
    color: '#581C87',
    marginBottom: 4,
  },
  aiSaysContent: {
    ...Typography.body,
    color: '#1E293B',
    lineHeight: 20,
  },
  saveBtn: {
    backgroundColor: '#581C87',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  saveBtnText: {
    ...Typography.button,
    color: '#FFFFFF',
    letterSpacing: 1,
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

export default TaskDetailsScreen;
