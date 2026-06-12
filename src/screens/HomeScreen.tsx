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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { useAppTheme } from '../context/ThemeContext';
import { useTasks } from '../hooks/useTasks';
import useFlaskStatus from '../hooks/useFlaskApi';
import { RootStackParamList, Task } from '../types';
import { Typography } from '../styles';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  // Extract clean username from email or input
  const rawUsername = route.params?.username || 'Waqar';
  const cleanUsername = rawUsername.includes('@') ? rawUsername.split('@')[0] : rawUsername;
  const username = cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1);

  const { theme, toggleTheme, colors } = useAppTheme();
  const { tasks, loading, addTask, deleteTask, toggleTaskCompleted } = useTasks();
  const { data: flaskData, refetch: refetchFlask, isFetching: isFlaskLoading } = useFlaskStatus();

  const [searchQuery, setSearchQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const isDark = theme === 'dark';

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTask = () => {
    if (!newTitle.trim()) return;
    addTask(newTitle);
    setNewTitle('');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('logged_in_user');
      navigation.replace('Login');
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  };

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

  const getFlaskBadgeColor = () => {
    if (flaskData?.status === 'Standby') return '#E8A020';
    return '#16A34A';
  };

  const renderTaskItem = ({ item }: { item: Task }) => {
    const prio = getPriorityStyle(item.priority);

    return (
      <View style={[styles.taskCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
        
        {/* Left: Checkbox and Title */}
        <View style={styles.taskLeftSection}>
          <TouchableOpacity
            style={[styles.checkbox, { borderColor: colors.border }]}
            activeOpacity={0.7}
            onPress={() => toggleTaskCompleted(item.id)}
          >
            {item.completed && <Text style={styles.checkMark}>✓</Text>}
          </TouchableOpacity>

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

        {/* Right: Priority and Delete */}
        <View style={styles.taskRightSection}>
          <View style={[styles.priorityBadge, { backgroundColor: prio.bg }]}>
            <Text style={[styles.priorityText, { color: prio.text }]}>{prio.label}</Text>
          </View>

          <TouchableOpacity
            style={styles.deleteBtn}
            activeOpacity={0.6}
            onPress={() => deleteTask(item.id)}
          >
            <Text style={[styles.deleteText, { color: colors.textMuted }]}>Delete</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.welcomeText, { color: colors.text }]}>Hello, {username}</Text>
          <Text style={[styles.subtitleText, { color: colors.textMuted }]}>Your tasks for today</Text>
        </View>

        {/* Actions */}
        <View style={styles.headerRight}>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
            thumbColor={isDark ? '#E8A020' : '#FFFFFF'}
          />
          <TouchableOpacity
            style={[styles.logoutBtn, { borderColor: colors.border }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={[styles.logoutText, { color: colors.text }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sub-header */}
      <View style={styles.subHeaderRow}>
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

        <TouchableOpacity
          style={styles.aiCoachBadge}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AICoach')}
        >
          <Text style={styles.aiCoachText}>AI Coach</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search tasks..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tasks List */}
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
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 145 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyArea}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No tasks found! Add one below.</Text>
            </View>
          }
        />
      )}

      {/* Add Task */}
      <View style={[styles.addTaskCard, { backgroundColor: colors.surface, borderTopColor: colors.border, bottom: insets.bottom + 36 }]}>
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

      <Text style={[styles.brandingText, { color: colors.textMuted, bottom: insets.bottom + 6 }]}>Manage your tasks smarter</Text>
    </KeyboardAvoidingView>
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
    marginBottom: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  searchInput: {
    flex: 1,
    ...Typography.body,
    paddingVertical: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 135, // overridden per-render with insets
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
    fontSize: 11,
  },
  deleteBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
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
    bottom: 50, // overridden per-render with insets
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
  logoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
  },
  brandingText: {
    ...Typography.caption,
    textAlign: 'center',
    position: 'absolute',
    bottom: 6, // overridden per-render with insets
    left: 0,
    right: 0,
    fontWeight: '500',
  },
});

export default HomeScreen;
