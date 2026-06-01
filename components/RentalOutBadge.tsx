import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { formatDisplayDateTime } from '../lib/rentalFormat';

type Props = {
  rentalStatus?: string | null;
  rentalReturnAt?: string | null;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function RentalOutBadge({ rentalStatus, rentalReturnAt, compact, style }: Props) {
  const { isDark } = useTheme();

  const isActive = rentalStatus === 'ACTIVE';
  const label = isActive ? 'Rented out' : 'Reserved for pickup';
  const sub =
    isActive && rentalReturnAt
      ? `Until ${formatDisplayDateTime(rentalReturnAt)}`
      : !isActive
        ? 'Awaiting showroom pickup'
        : null;

  const bg = isDark ? 'rgba(245,158,11,0.22)' : 'rgba(245,158,11,0.14)';
  const border = isDark ? 'rgba(251,191,36,0.45)' : 'rgba(217,119,6,0.35)';
  const textColor = isDark ? '#FCD34D' : '#B45309';

  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          paddingHorizontal: compact ? 8 : 10,
          paddingVertical: compact ? 4 : 6,
          borderRadius: 999,
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: border,
          maxWidth: '100%',
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Ionicons name="time-outline" size={compact ? 14 : 16} color={textColor} />
        <Text style={{ color: textColor, fontSize: compact ? 11 : 12, fontWeight: '700' }}>{label}</Text>
      </View>
      {sub && !compact ? (
        <Text style={{ color: textColor, fontSize: 11, marginTop: 4, opacity: 0.9 }}>{sub}</Text>
      ) : null}
    </View>
  );
}
