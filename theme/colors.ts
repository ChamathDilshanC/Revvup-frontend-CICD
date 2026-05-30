import { darkColors } from './tokens';

/** @deprecated Prefer useTheme().colors — kept for components that only need primary. */
export const colors = {
  background: darkColors.background,
  surface: darkColors.surface,
  surfaceElevated: darkColors.surfaceElevated,
  border: darkColors.border,
  primary: darkColors.primary,
  primaryMuted: '#B82D38',
  accent: '#F4A261',
  text: darkColors.text,
  textSecondary: darkColors.textSecondary,
  textMuted: darkColors.textMuted,
  success: '#22C55E',
  warning: '#EAB308',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
