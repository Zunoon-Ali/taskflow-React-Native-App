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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { useAppTheme } from '../context/ThemeContext';
import { useTasks } from '../hooks/useTasks';
import { useAiDescription } from '../hooks/useAi';
import { RootStackParamList, Task } from '../types';
import { Typography } from '../styles';

type Props = StackScreenProps<RootStackParamList, 'TaskDetails'>;

export const TaskDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { taskId } = route.params;
  const { theme, toggleTheme, colors } = useAppTheme();
  const { tasks, updateTask } = useTasks();
  const { mutate: generateDesc, isPending: isAiLoading } = useAiDescription();

  const isDark = theme === 'dark';

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [completed, setCompleted] = useState(false);
  const [aiSays, setAiSays] = useState('');

  // Populate data on mount/update
  useEffect(() => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setTitle(task.title);
      setPriority(task.priority);
      setCompleted(task.completed);
      setAiSays(task.aiSuggestion || '');
    }
  }, [taskId, tasks]);

  const handleAiGenerate = () => {
    if (!title.trim()) return;
    generateDesc(title, {
      onSuccess: (description) => {
        setAiSays(description);
      },
    });
  };

  const handleSaveChanges = () => {
    updateTask(taskId, {
      title: title.trim(),
      priority,
      completed,
      aiSuggestion: aiSays,
    });
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header */}
      <View style={[styles.headerRow, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backText, { color: colors.text }]}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Task Details</Text>

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
      >
        
        {/* AI Coach Link */}
        <View style={styles.coachLinkRow}>
          <TouchableOpacity
            style={styles.coachBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AICoach')}
          >
            <Text style={styles.coachBtnText}>AI Coach</Text>
          </TouchableOpacity>
        </View>

        {/* Title input */}
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

        {/* Priority buttons */}
        <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Priority:</Text>
        <View style={[styles.priorityGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
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

        {/* Status buttons */}
        <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Status:</Text>
        <View style={[styles.statusGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
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

        {/* Generate AI description */}
        <TouchableOpacity
          style={styles.generateBtn}
          activeOpacity={0.8}
          onPress={handleAiGenerate}
          disabled={isAiLoading}
        >
          {isAiLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.generateBtnText}>Generate AI Description</Text>
          )}
        </TouchableOpacity>

        {/* AI Suggestion output */}
        {aiSays ? (
          <View style={styles.aiSaysCard}>
            <Text style={styles.aiSaysTitle}>AI Says:</Text>
            <Text style={styles.aiSaysContent}>{aiSays}</Text>
          </View>
        ) : null}

        {/* Save button */}
        <TouchableOpacity
          style={styles.saveBtn}
          activeOpacity={0.8}
          onPress={handleSaveChanges}
        >
          <Text style={styles.saveBtnText}>SAVE CHANGES</Text>
        </TouchableOpacity>

      </ScrollView>

      <Text style={[styles.footerText, { color: colors.textMuted, bottom: insets.bottom + 6 }]}>Manage your tasks smarter</Text>
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
    fontSize: 14,
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
    fontSize: 14,
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
    bottom: 6, // overridden per-render with insets
    left: 0,
    right: 0,
    fontWeight: '500',
  },
});

export default TaskDetailsScreen;
