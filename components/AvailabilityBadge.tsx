import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Props = {
  isAvailable: boolean;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AvailabilityBadge({ isAvailable, compact, style }: Props) {
  const { isDark } = useTheme();

  const bg = isAvailable
    ? isDark
      ? 'rgba(34,197,94,0.2)'
      : 'rgba(22,163,74,0.12)'
    : isDark
      ? 'rgba(107,114,128,0.25)'
      : 'rgba(107,114,128,0.15)';

  const border = isAvailable
    ? isDark
      ? 'rgba(74,222,128,0.45)'
      : 'rgba(22,163,74,0.35)'
    : isDark
      ? 'rgba(156,163,175,0.35)'
      : 'rgba(107,114,128,0.3)';

  const textColor = isAvailable ? (isDark ? '#86EFAC' : '#15803D') : isDark ? '#D1D5DB' : '#6B7280';

  const label = isAvailable ? 'Available' : 'Not available';
  const icon = isAvailable ? 'checkmark-circle' : 'close-circle-outline';

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: compact ? 4 : 6,
          paddingHorizontal: compact ? 8 : 10,
          paddingVertical: compact ? 4 : 5,
          borderRadius: 999,
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: border,
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={compact ? 14 : 16} color={textColor} />
      <Text
        style={{
          color: textColor,
          fontSize: compact ? 11 : 12,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </View>
  );
}
