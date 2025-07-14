import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme types
export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'light' | 'dark';

// Enhanced color palette for both themes
export const Colors = {
  light: {
    // Primary colors
    primary: '#2563EB',
    primaryLight: '#DBEAFE',
    primaryDark: '#1E40AF',
    
    // Background colors
    background: '#F9FAFB',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    
    // Text colors
    text: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    
    // Border colors
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    
    // Status colors
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    
    // Tab bar colors
    tabBackground: '#FFFFFF',
    tabActive: '#2563EB',
    tabInactive: '#6B7280',
    
    // Icon colors
    icon: '#6B7280',
    iconActive: '#2563EB',
    
    // Input colors
    inputBackground: '#FFFFFF',
    inputBorder: '#E5E7EB',
    placeholder: '#9CA3AF',
    
    // Shadow
    shadow: 'rgba(0, 0, 0, 0.05)',
  },
  dark: {
    // Primary colors
    primary: '#3B82F6',
    primaryLight: '#1E3A8A',
    primaryDark: '#60A5FA',
    
    // Background colors
    background: '#0F172A',
    surface: '#1E293B',
    card: '#334155',
    
    // Text colors
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    
    // Border colors
    border: '#475569',
    borderLight: '#374151',
    
    // Status colors
    success: '#22C55E',
    successLight: '#166534',
    warning: '#EAB308',
    warningLight: '#CA8A04',
    error: '#F87171',
    errorLight: '#DC2626',
    
    // Tab bar colors
    tabBackground: '#1E293B',
    tabActive: '#3B82F6',
    tabInactive: '#94A3B8',
    
    // Icon colors
    icon: '#94A3B8',
    iconActive: '#3B82F6',
    
    // Input colors
    inputBackground: '#334155',
    inputBorder: '#475569',
    placeholder: '#64748B',
    
    // Shadow
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

// Theme context interface
interface ThemeContextType {
  colorScheme: ColorScheme;
  themeMode: ThemeMode;
  colors: typeof Colors.light;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = useState(true);
  
  // Load theme preference on app start
  useEffect(() => {
    loadThemePreference();
  }, []);
  
  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_mode');
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save theme preference
  const saveThemePreference = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('theme_mode', mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };
  
  // Calculate current color scheme based on theme mode
  const colorScheme: ColorScheme = 
    themeMode === 'system' 
      ? (systemColorScheme ?? 'light') 
      : themeMode;
  
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  // Set theme mode
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    saveThemePreference(mode);
  };

  // Don't render children while loading theme preference
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        themeMode,
        colors,
        setThemeMode,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Helper hook for easier access to colors
export function useThemeColors() {
  const { colors } = useTheme();
  return colors;
}
