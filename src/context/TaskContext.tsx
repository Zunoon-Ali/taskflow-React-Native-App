// =============================================================================
// FILE: src/context/TaskContext.tsx
// -----------------------------------------------------------------------------
// Yeh file tasks ki global state manage karti hai — adding, deleting, completing.
// =============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Device local storage
import axios from 'axios'; // API calls ke liye axios
import { Task } from '../types'; // Task structure model

// Context interface defining state and handlers
interface TaskContextType {
  tasks: Task[]; // Tasks list
  loading: boolean; // Data loading indicator
  addTask: (title: string) => Promise<void>; // Naya task add karne ka function
  deleteTask: (id: string) => Promise<void>; // Task delete karne ka function
  toggleTaskCompleted: (id: string) => Promise<void>; // Complete/Pending toggle
  updateTask: (id: string, updatedFields: Partial<Task>) => Promise<void>; // Task edit save
  refreshTasks: () => Promise<void>; // API reload/refresh handler
}

// Global context variable
const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Tasks load karne ka function (Pehle storage check karega, agar empty ho toh API)
  const loadTasks = async () => {
    try {
      setLoading(true);
      const savedTasks = await AsyncStorage.getItem('app_tasks');
      
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks)); // Purana data load ho gaya
      } else {
        // Pehli baar launch pe JSONPlaceholder se 5 task fetch karega
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5');
        const priorities: ('LOW' | 'MEDIUM' | 'HIGH')[] = ['MEDIUM', 'HIGH', 'LOW', 'MEDIUM', 'LOW'];
        
        // Response ko Task object ke format mein map karna
        const initialTasks: Task[] = response.data.map((item: any, index: number) => ({
          id: item.id.toString(),
          title: item.title.charAt(0).toUpperCase() + item.title.slice(1),
          completed: item.completed,
          priority: priorities[index % priorities.length],
          description: `This is a sample description for "${item.title}".`,
          aiSuggestion: '',
        }));

        setTasks(initialTasks);
        await AsyncStorage.setItem('app_tasks', JSON.stringify(initialTasks)); // Storage mein save
      }
    } catch (error) {
      console.error('API / storage task loading failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // App load hote hi state initialization run karega
  useEffect(() => {
    loadTasks();
  }, []);

  // State update ke sath local storage sync karne ka helper
  const saveTasksToStorage = async (newTasks: Task[]) => {
    setTasks(newTasks);
    try {
      await AsyncStorage.setItem('app_tasks', JSON.stringify(newTasks)); // Persistent update
    } catch (error) {
      console.error('AsyncStorage sync failed:', error);
    }
  };

  // Naya task list ke top pe add karne ka helper
  const addTask = async (title: string) => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(), // Dynamic unique timestamp-based ID
      title: title.trim(),
      priority: 'MEDIUM', // Default priority medium hai
      completed: false,
      description: '',
      aiSuggestion: '',
    };
    await saveTasksToStorage([newTask, ...tasks]);
  };

  // Task remove karne ka helper
  const deleteTask = async (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    await saveTasksToStorage(updated);
  };

  // Checkbox toggle handler
  const toggleTaskCompleted = async (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    await saveTasksToStorage(updated);
  };

  // Task details save update handler
  const updateTask = async (id: string, updatedFields: Partial<Task>) => {
    const updated = tasks.map(t => t.id === id ? { ...t, ...updatedFields } : t);
    await saveTasksToStorage(updated);
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, addTask, deleteTask, toggleTaskCompleted, updateTask, refreshTasks: loadTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

// Global consumer hook for state usage in screens
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
