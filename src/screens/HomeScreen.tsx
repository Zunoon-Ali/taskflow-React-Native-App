// =============================================================================
// FILE: src/screens/HomeScreen.tsx
// -----------------------------------------------------------------------------
// Main Home page jahan saare tasks list hote hain aur CRUD perform hota hai.
// =============================================================================

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack'; // Navigation types
import { useAppTheme } from '../context/ThemeContext'; // Theme context
import { useTasks } from '../hooks/useTasks'; // Tasks global state context hook
import useFlaskStatus from '../hooks/useFlaskApi'; // Flask connection status hook
import { RootStackParamList, Task } from '../types'; // TypeScript interfaces
import { Colors, Typography } from '../styles'; // Visual styling configurations

// Screen props typings setup
type Props = StackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ route, navigation }) => {
  const username = route.params?.username || 'waqar'; // Login se pass kiya hua username
  const { theme, toggleTheme, colors } = useAppTheme(); // Theme colors list
  const { tasks, loading, addTask, deleteTask, toggleTaskCompleted } = useTasks(); // Tasks actions
  const { data: flaskData, refetch: refetchFlask, isFetching: isFlaskLoading } = useFlaskStatus(); // Flask live status hook

  // Search input aur new task input local states
  const [searchQuery, setSearchQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const isDark = theme === 'dark'; // Check dark mode active

  // Search filter query logic
  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // New task addition validator
  const handleAddTask = () => {
    if (!newTitle.trim()) return;
    addTask(newTitle);
    setNewTitle(''); // Input state clear
  };

  // Priority chip ke colors decide karne ka logic
  const getPriorityStyle = (priority: 'LOW' | 'MEDIUM' | 'HIGH') => {
    switch (priority) {
      case 'HIGH':
        return { bg: '#FEE2E2', text: '#DC2626', label: 'HIGH' };
      case 'MEDIUM':
        return { bg: '#DBEAFE', text: '#2563EB', label: 'MEDIUM' };
      case 'LOW':
        return { bg: '#DCFCE7', text: '#16A34A', label: 'LOW' };
    }
  };

  // Flask server status badge background picker
  const getFlaskBadgeColor = () => {
    if (flaskData?.status === 'Standby') return '#E8A020'; // Standby yellow
    return '#16A34A'; // Connected green
  };

  // Individual task row item layout render helper
  const renderTaskItem = ({ item }: { item: Task }) => {
    const prio = getPriorityStyle(item.priority);

    return (
      <View style={[styles.taskCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
        
        {/* Left side: Checkbox + Title click to navigate to Details */}
        <View style={styles.taskLeftSection}>
          {/* Custom Checkbox toggle action */}
          <TouchableOpacity
            style={[styles.checkbox, { borderColor: colors.border }]}
            activeOpacity={0.7}
            onPress={() => toggleTaskCompleted(item.id)}
          >
            {item.completed && <Text style={styles.checkMark}>✓</Text>}
          </TouchableOpacity>

          {/* Pressable task title container to open editor */}
          <TouchableOpacity
            style={styles.textClickable}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}
          >
            <Text
              style={[
                styles.taskTitle,
                { color: colors.text },
                item.completed && [styles.completedText, { color: colors.textMuted }]
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Right side: Priority chip + Delete button */}
        <View style={styles.taskRightSection}>
          <View style={[styles.priorityBadge, { backgroundColor: prio.bg }]}>
            <Text style={[styles.priorityText, { color: prio.text }]}>{prio.label}</Text>
          </View>

          {/* Delete trash button */}
          <TouchableOpacity
            style={styles.deleteBtn}
            activeOpacity={0.6}
            onPress={() => deleteTask(item.id)}
          >
            <Text style={styles.deleteEmoji}>🗑️</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* HEADER SECTION */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.welcomeText, { color: colors.text }]}>Hello, {username}! 👋</Text>
          <Text style={[styles.subtitleText, { color: colors.textMuted }]}>Your tasks for today</Text>
        </View>

        {/* Top Right Theme Toggler Switch */}
        <View style={styles.headerRight}>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
            thumbColor={isDark ? '#E8A020' : '#FFFFFF'}
          />
        </View>
      </View>

      {/* SUB-HEADER ROW: Flask indicator + AI Coach badge button */}
      <View style={styles.subHeaderRow}>
        {/* Flask connection status badge (Pressable to retry network status) */}
        <TouchableOpacity
          style={[styles.flaskBadge, { borderColor: colors.border }]}
          activeOpacity={0.8}
          onPress={() => refetchFlask()}
          disabled={isFlaskLoading}
        >
          {isFlaskLoading ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : (
            <>
              <View style={[styles.statusDot, { backgroundColor: getFlaskBadgeColor() }]} />
              <Text style={[styles.flaskBadgeText, { color: colors.textMuted }]}>
                Flask: {flaskData?.status === 'Standby' ? 'Offline' : 'Online'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Navigation button to AI Coach screen */}
        <TouchableOpacity
          style={styles.aiCoachBadge}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AICoach')}
        >
          <Text style={styles.aiCoachText}>🤖 AI Coach</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH TASKS INPUT BAR */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Text style={styles.searchEmoji}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search tasks..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* TASKS LIST AREA */}
      {loading ? (
        <View style={styles.loaderArea}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={{ color: colors.textMuted, marginTop: 10 }}>Loading sample tasks...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTaskItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyArea}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No tasks found! Add one below.</Text>
            </View>
          }
        />
      )}

      {/* ADD TASK BOTTOM CONTAINER */}
      <View style={[styles.addTaskCard, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.addTaskInput, { color: colors.text }]}
          placeholder="New task title..."
          placeholderTextColor={colors.textMuted}
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TouchableOpacity
          style={styles.addTaskBtn}
          activeOpacity={0.8}
          onPress={handleAddTask}
        >
          <Text style={styles.addTaskBtnText}>+ ADD TASK</Text>
        </TouchableOpacity>
      </View>

      {/* BOTTOM BRANDING */}
      <Text style={[styles.brandingText, { color: colors.textMuted }]}>Manage your tasks smarter</Text>
    </KeyboardAvoidingView>
  );
};

// Styles configuration sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '800',
  },
  subtitleText: {
    ...Typography.body,
    fontWeight: '500',
    marginTop: -2,
  },
  subHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  flaskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  flaskBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  aiCoachBadge: {
    backgroundColor: '#6366F1',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  aiCoachText: {
    ...Typography.label,
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 48,
  },
  searchEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    paddingVertical: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  taskLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkMark: {
    color: '#16A34A',
    fontWeight: '900',
    fontSize: 14,
    marginTop: -2,
  },
  textClickable: {
    flex: 1,
  },
  taskTitle: {
    ...Typography.h4,
    fontWeight: '600',
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  taskRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priorityBadge: {
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  priorityText: {
    ...Typography.label,
    fontSize: 9,
  },
  deleteBtn: {
    padding: 2,
  },
  deleteEmoji: {
    fontSize: 16,
  },
  loaderArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyArea: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    ...Typography.body,
  },
  addTaskCard: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  addTaskInput: {
    ...Typography.body,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  addTaskBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    alignItems: 'center',
  },
  addTaskBtnText: {
    ...Typography.button,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  brandingText: {
    ...Typography.caption,
    textAlign: 'center',
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
    fontWeight: '500',
  },
});

export default HomeScreen;
