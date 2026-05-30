import { colorScheme } from 'nativewind';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getThemePreference, setThemePreference } from '../lib/storage';
import { c } from '../theme/classNames';
import { darkColors, lightColors, type ThemeColors, type ThemePreference } from '../theme/tokens';

type ThemeContextValue = {
  preference: ThemePreference;
  isDark: boolean;
  colors: ThemeColors;
  classes: typeof c;
  setPreference: (next: ThemePreference) => Promise<void>;
  ready: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function load() {
      const saved = await getThemePreference();
      const pref = saved ?? 'dark';
      setPreferenceState(pref);
      colorScheme.set(pref);
      setReady(true);
    }
    void load();
  }, []);

  const setPreference = useCallback(async (next: ThemePreference) => {
    setPreferenceState(next);
    colorScheme.set(next);
    await setThemePreference(next);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      isDark: preference === 'dark',
      colors: preference === 'dark' ? darkColors : lightColors,
      classes: c,
      setPreference,
      ready,
    }),
    [preference, setPreference, ready],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
