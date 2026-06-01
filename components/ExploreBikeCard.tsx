import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { AvailabilityBadge } from './AvailabilityBadge';
import { BikeShowcaseImage } from './BikeShowcaseImage';
import { GlassSurface } from './GlassSurface';

export type ExploreBikeCardProps = {
  id: string;
  name: string;
  brand: string;
  priceUsd: number;
  imageUrl: string;
  topSpeedMph?: number | null;
  weightLbs?: number | null;
  engineCc?: number | null;
  isAvailable?: boolean;
  onPress?: (id: string) => void;
};

export function ExploreBikeCard({
  id,
  name,
  brand,
  priceUsd,
  imageUrl,
  topSpeedMph,
  weightLbs,
  engineCc,
  isAvailable = true,
  onPress,
}: ExploreBikeCardProps) {
  const { colors, classes, isDark } = useTheme();
  const { formatPrice } = useCurrency();

  return (
    <Pressable onPress={() => onPress?.(id)} className="mb-3 active:opacity-95">
      <GlassSurface
        borderRadius={28}
        intensity={isDark ? 48 : 60}
        style={!isAvailable ? { opacity: 0.88 } : undefined}
      >
        <View className="flex-row items-start justify-between px-4 pb-2 pt-4">
          <View className="flex-1 pr-3">
            <AvailabilityBadge isAvailable={isAvailable} compact style={{ marginBottom: 8 }} />
            <Text className={classes.bodyXs} style={{ letterSpacing: 3.2, fontWeight: '600' }}>
              {brand.toUpperCase()}
            </Text>
            <Text className={classes.heading} style={{ fontSize: 20, marginTop: 2 }} numberOfLines={2}>
              {name}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: isDark ? 'rgba(230,57,70,0.2)' : 'rgba(230,57,70,0.12)',
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(230,57,70,0.35)' : 'rgba(230,57,70,0.25)',
            }}
          >
            <Text style={{ color: colors.primary, fontSize: 18, fontWeight: '700' }}>
              {formatPrice(priceUsd)}
            </Text>
          </View>
        </View>

        <BikeShowcaseImage uri={imageUrl} variant="circle" size={200} glass />

        <View className="flex-row items-center justify-between px-3 pb-4 pt-2">
          <StatRing
            label="Top speed"
            value={topSpeedMph != null ? `${topSpeedMph}` : '—'}
            unit={topSpeedMph != null ? 'mph' : ''}
            colors={colors}
            isDark={isDark}
          />
          <StatRing
            label="Weight"
            value={weightLbs != null ? `${weightLbs}` : '—'}
            unit={weightLbs != null ? 'lbs' : ''}
            colors={colors}
            isDark={isDark}
            highlighted
          />
          <StatRing
            label="Engine"
            value={engineCc != null ? `${engineCc}` : '—'}
            unit={engineCc != null ? 'cc' : ''}
            colors={colors}
            isDark={isDark}
          />
        </View>
      </GlassSurface>
    </Pressable>
  );
}

function StatRing({
  label,
  value,
  unit,
  colors,
  isDark,
  highlighted,
}: {
  label: string;
  value: string;
  unit: string;
  colors: {
    primary: string;
    border: string;
    text: string;
    textSecondary: string;
  };
  isDark: boolean;
  highlighted?: boolean;
}) {
  const ringBorder = highlighted ? colors.primary : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.08)';
  const fill = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.55)';

  return (
    <View className="w-[30%] items-center">
      <View
        className="h-[72px] w-[72px] items-center justify-center rounded-full border"
        style={{ borderColor: ringBorder, backgroundColor: fill, borderWidth: highlighted ? 2 : 1 }}
      >
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>{value}</Text>
        {unit ? (
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 10,
              fontWeight: '500',
              textTransform: 'uppercase',
            }}
          >
            {unit}
          </Text>
        ) : null}
      </View>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 10,
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginTop: 8,
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </View>
  );
}
