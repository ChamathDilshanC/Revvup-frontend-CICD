import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { GlassSurface } from './GlassSurface';
import { useTheme } from '../context/ThemeContext';
import { SRI_LANKA_PROVINCES, type SriLankaProvince } from '../lib/sriLankaProvinces';

type Props = {
  selectedProvince: SriLankaProvince | null;
  onSelectProvince: (province: SriLankaProvince | null) => void;
  provinceCounts: { province: SriLankaProvince; count: number }[];
  onUseMyLocation: () => void;
  locating?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ProvinceFilterBar({
  selectedProvince,
  onSelectProvince,
  provinceCounts,
  onUseMyLocation,
  locating,
  style,
}: Props) {
  const { classes, colors, isDark } = useTheme();

  const countMap = new Map(provinceCounts.map((c) => [c.province, c.count]));

  return (
    <GlassSurface borderRadius={20} style={[{ marginBottom: 12 }, style]}>
      <View className="px-3 pb-3 pt-3">
        <View className="mb-2 flex-row items-center justify-between gap-2">
          <View className="flex-1">
            <Text className={classes.sectionLabel}>Your area</Text>
            <Text className={`${classes.bodySm} mt-0.5`}>
              {selectedProvince
                ? `Showing showrooms in ${selectedProvince} Province`
                : 'All provinces — pick one or use your location'}
            </Text>
          </View>
          <Pressable
            onPress={onUseMyLocation}
            disabled={locating}
            className="flex-row items-center gap-1 rounded-full px-3 py-2 active:opacity-80"
            style={{
              backgroundColor: isDark ? 'rgba(230,57,70,0.2)' : 'rgba(230,57,70,0.12)',
            }}
          >
            {locating ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="locate" size={16} color={colors.primary} />
            )}
            <Text className="text-xs font-semibold" style={{ color: colors.primary }}>
              Near me
            </Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingRight: 4 }}
        >
          <ProvinceChip
            label="All"
            active={!selectedProvince}
            onPress={() => onSelectProvince(null)}
            isDark={isDark}
            colors={colors}
          />
          {SRI_LANKA_PROVINCES.filter((p) => (countMap.get(p) ?? 0) > 0).map((province) => (
            <ProvinceChip
              key={province}
              label={province}
              count={countMap.get(province)}
              active={selectedProvince === province}
              onPress={() => onSelectProvince(province)}
              isDark={isDark}
              colors={colors}
            />
          ))}
        </ScrollView>
      </View>
    </GlassSurface>
  );
}

function ProvinceChip({
  label,
  count,
  active,
  onPress,
  isDark,
  colors,
}: {
  label: string;
  count?: number;
  active: boolean;
  onPress: () => void;
  isDark: boolean;
  colors: { primary: string; text: string; textSecondary: string };
}) {
  const bg = active
    ? colors.primary
    : isDark
      ? 'rgba(255,255,255,0.08)'
      : 'rgba(0,0,0,0.06)';
  const textColor = active ? '#fff' : colors.text;

  return (
    <Pressable
      onPress={onPress}
      className="rounded-full px-3 py-2 active:opacity-85"
      style={{ backgroundColor: bg }}
    >
      <Text className="text-xs font-semibold" style={{ color: textColor }}>
        {label}
        {count != null ? ` (${count})` : ''}
      </Text>
    </Pressable>
  );
}
