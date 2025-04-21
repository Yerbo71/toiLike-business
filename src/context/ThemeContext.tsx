import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from 'react';
import { useColorScheme, Platform } from 'react-native';
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
} from '@/src/core/theme/createTheming';
import * as NavigationBar from 'expo-navigation-bar';

type ThemeMode = 'System' | 'Light' | 'Dark';

interface ThemeContextType {
  theme: 'Light' | 'Dark';
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  paperTheme: typeof CombinedDarkTheme | typeof CombinedDefaultTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProviderApp({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme() as 'Light' | 'Dark';
  const [themeMode, setThemeMode] = useState<ThemeMode>('System');
  const theme = themeMode === 'System' ? systemColorScheme : themeMode;

  const paperTheme =
    theme === 'Dark' ? CombinedDarkTheme : CombinedDefaultTheme;

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(
        theme === 'Dark' ? '#2b2732' : '#f3edf6',
      );
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, themeMode, setThemeMode, paperTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
