import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { AvailabilityBadge } from './AvailabilityBadge';
import { RentalOutBadge } from './RentalOutBadge';
import { isBikeRentedOut } from '../lib/bikes';
import { BikeShowcaseImage } from './BikeShowcaseImage';
import { GlassSurface } from './GlassSurface';

export type RentBikeCardProps = {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  showroomName?: string | null;
  rentLabel: string;
  topSpeedMph?: number | null;
  weightLbs?: number | null;
  engineCc?: number | null;
  isAvailable?: boolean;
  isRentedOut?: boolean;
  rentalStatus?: string | null;
  rentalReturnAt?: string | null;
  onPress?: (id: string) => void;
};

export function RentBikeCard({
  id,
  name,
  brand,
  imageUrl,
  showroomName,
  rentLabel,
  topSpeedMph,
  weightLbs,
  engineCc,
  isAvailable = true,
  isRentedOut = false,
  rentalStatus,
  rentalReturnAt,
  onPress,
}: RentBikeCardProps) {
  const { colors, classes, isDark } = useTheme();
  const dimmed = !isAvailable || isRentedOut;

  return (
    <Pressable onPress={() => onPress?.(id)} className="mb-3 active:opacity-95">
      <GlassSurface
        borderRadius={28}
        intensity={isDark ? 48 : 60}
        style={dimmed ? { opacity: 0.88 } : undefined}
      >
        <View className="flex-row items-start justify-between px-4 pb-2 pt-4">
          <View className="flex-1 pr-3">
            <View className="mb-2 flex-row flex-wrap gap-2">
              <AvailabilityBadge isAvailable={isAvailable} compact />
              {isRentedOut ? (
                <RentalOutBadge
                  rentalStatus={rentalStatus}
                  rentalReturnAt={rentalReturnAt}
                  compact
                />
              ) : null}
            </View>
            <Text className={classes.bodyXs} style={{ letterSpacing: 3.2, fontWeight: '600' }}>
              {brand.toUpperCase()}
            </Text>
            <Text className={classes.heading} style={{ fontSize: 20, marginTop: 2 }} numberOfLines={2}>
              {name}
            </Text>
            {showroomName ? (
              <Text className={`${classes.bodySm} mt-1`} numberOfLines={1}>
                {showroomName}
              </Text>
            ) : null}
          </View>
          <View
            style={{
              backgroundColor: isDark ? 'rgba(230,57,70,0.2)' : 'rgba(230,57,70,0.12)',
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(230,57,70,0.35)' : 'rgba(230,57,70,0.25)',
              maxWidth: 120,
            }}
          >
            <Text
              style={{ color: colors.primary, fontSize: 13, fontWeight: '700', textAlign: 'right' }}
              numberOfLines={2}
            >
              {rentLabel}
            </Text>
          </View>
        </View>

        <BikeShowcaseImage uri={imageUrl} variant="circle" size={200} glass />

        <View className="flex-row items-center justify-between px-3 pb-4 pt-2">
          <MiniStat label="Top speed" value={topSpeedMph != null ? `${topSpeedMph}` : '—'} unit="mph" />
          <MiniStat label="Weight" value={weightLbs != null ? `${weightLbs}` : '—'} unit="lbs" />
          <MiniStat label="Engine" value={engineCc != null ? `${engineCc}` : '—'} unit="cc" />
        </View>
      </GlassSurface>
    </Pressable>
  );
}

function MiniStat({ label, value, unit }: { label: string; value: string; unit: string }) {
  const { colors, classes } = useTheme();
  return (
    <View className="w-[30%] items-center">
      <Text className={classes.bodyXs}>{label}</Text>
      <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>
        {value}
        {value !== '—' ? (
          <Text style={{ color: colors.textSecondary, fontSize: 11 }}> {unit}</Text>
        ) : null}
      </Text>
    </View>
  );
}
