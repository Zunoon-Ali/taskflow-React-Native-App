// =============================================================================
// FILE: src/context/ThemeContext.tsx
// -----------------------------------------------------------------------------
// Yeh file app ke theme (Light/Dark Mode) ko global state mein manage karti hai.
// =============================================================================

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Local persistence ke liye
import Colors from '../styles/colors'; // Colors definition sheet
import { Theme, ThemeContextType } from '../types'; // Types mapping definitions

// Theme ke liye Context object create kar rahe hain
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component jo poori app ko theme states access dega
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light'); // Default mode 'light' hai

  // App start hote hi check karega ke pehle se koi theme saved hai ya nahi
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('app_theme'); // AsyncStorage se theme fetch
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme); // State load karo
        }
      } catch (e) {
        console.error('Theme load error:', e);
      }
    };
    loadTheme();
  }, []);

  // Theme switch karne ka function jo toggle karega aur save bhi karega
  const toggleTheme = async () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    try {
      await AsyncStorage.setItem('app_theme', nextTheme); // Device memory mein save
    } catch (e) {
      console.error('Theme save error:', e);
    }
  };

  // Jo theme chal rahi ho uske hisaab se colors object pick karna
  const colors = theme === 'dark' ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook banaya taaki har screen easily context variables use kar sake
export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};
