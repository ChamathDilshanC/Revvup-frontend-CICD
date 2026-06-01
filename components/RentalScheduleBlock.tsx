import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Props = {
  pickup: string;
  returnAt: string;
  duration: string;
};

export function RentalScheduleBlock({ pickup, returnAt, duration }: Props) {
  const { colors, isDark } = useTheme();
  const lineColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)';

  return (
    <View
      className="rounded-xl px-4 py-5"
      style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
    >
      <View className="pb-1">
        <Row icon="log-in-outline" label="Pickup" value={pickup} />
      </View>

      <View className="my-5 flex-row items-stretch">
        <View className="ml-[8px] w-[2px] flex-1 rounded-full" style={{ backgroundColor: lineColor }} />
        <View
          className="mx-4 min-w-[120px] flex-row items-center justify-center gap-2 rounded-full px-4 py-2"
          style={{
            backgroundColor: isDark ? 'rgba(230,57,70,0.2)' : 'rgba(230,57,70,0.1)',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(230,57,70,0.35)' : 'rgba(230,57,70,0.2)',
          }}
        >
          <Ionicons name="time-outline" size={16} color={colors.primary} />
          <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>{duration}</Text>
        </View>
        <View className="w-[2px] flex-1 rounded-full" style={{ backgroundColor: lineColor }} />
      </View>

      <View className="pt-1">
        <Row icon="log-out-outline" label="Return" value={returnAt} />
      </View>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-start gap-3">
      <Ionicons name={icon} size={18} color={colors.textSecondary} style={{ marginTop: 2 }} />
      <View className="flex-1">
        <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textSecondary, letterSpacing: 1 }}>
          {label.toUpperCase()}
        </Text>
        <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginTop: 2 }}>{value}</Text>
      </View>
    </View>
  );
}
