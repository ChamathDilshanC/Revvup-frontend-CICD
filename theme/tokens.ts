export type ThemePreference = 'dark' | 'light';

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  primary: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  tabBar: string;
  tabBarBorder: string;
  tabInactive: string;
  inputBg: string;
  inputBorder: string;
  placeholder: string;
};

export const darkColors: ThemeColors = {
  background: '#0A0A0B',
  surface: '#141416',
  surfaceElevated: '#1C1C1F',
  border: '#2A2A2E',
  primary: '#E63946',
  text: '#F5F5F7',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  tabBar: '#141416',
  tabBarBorder: '#2A2A2E',
  tabInactive: '#6B7280',
  inputBg: '#141416',
  inputBorder: '#2A2A2E',
  placeholder: '#6B7280',
};

export const lightColors: ThemeColors = {
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#E5E7EB',
  primary: '#E63946',
  text: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#6B7280',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E5E7EB',
  tabInactive: '#9CA3AF',
  inputBg: '#FFFFFF',
  inputBorder: '#D1D5DB',
  placeholder: '#9CA3AF',
};
