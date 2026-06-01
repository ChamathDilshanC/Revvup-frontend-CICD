import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type IconName = keyof typeof Ionicons.glyphMap;

type Props = {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  variant?: 'default' | 'primary' | 'danger' | 'filled';
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function GlassIconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant = 'default',
  size = 22,
  style,
}: Props) {
  const { colors, isDark } = useTheme();

  const bg =
    variant === 'filled'
      ? colors.primary
      : variant === 'primary'
      ? isDark
        ? 'rgba(230,57,70,0.28)'
        : 'rgba(230,57,70,0.14)'
      : variant === 'danger'
        ? isDark
          ? 'rgba(239,68,68,0.22)'
          : 'rgba(239,68,68,0.12)'
        : isDark
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(255,255,255,0.72)';

  const border =
    variant === 'filled'
      ? colors.primary
      : variant === 'primary'
      ? isDark
        ? 'rgba(230,57,70,0.45)'
        : 'rgba(230,57,70,0.35)'
      : variant === 'danger'
        ? isDark
          ? 'rgba(239,68,68,0.4)'
          : 'rgba(248,113,113,0.45)'
        : isDark
          ? 'rgba(255,255,255,0.14)'
          : 'rgba(255,255,255,0.9)';

  const iconColor =
    variant === 'filled'
      ? '#FFFFFF'
      : variant === 'primary'
      ? colors.primary
      : variant === 'danger'
        ? isDark
          ? '#FCA5A5'
          : '#DC2626'
        : colors.text;

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={6}
      style={[
        {
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: border,
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={size} color={iconColor} />
    </Pressable>
  );
}
