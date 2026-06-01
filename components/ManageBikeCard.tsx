import React from 'react';
import { Text, View } from 'react-native';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { AvailabilityBadge } from './AvailabilityBadge';
import { BikeShowcaseImage } from './BikeShowcaseImage';
import { GlassIconButton } from './GlassIconButton';
import { GlassSurface } from './GlassSurface';

type Props = {
  name: string;
  brand: string;
  priceUsd: number;
  imageUrl: string;
  topSpeedMph?: number | null;
  isAvailable?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function ManageBikeCard({
  name,
  brand,
  priceUsd,
  imageUrl,
  topSpeedMph,
  isAvailable = true,
  onEdit,
  onDelete,
}: Props) {
  const { colors, classes, isDark } = useTheme();
  const { formatPrice } = useCurrency();

  return (
    <GlassSurface borderRadius={24} intensity={isDark ? 44 : 56} style={{ marginBottom: 12 }}>
      <View className="flex-row items-center px-3 pb-3 pt-3">
        <View style={{ width: 96 }}>
          <BikeShowcaseImage uri={imageUrl} variant="circle" size={88} glass />
        </View>

        <View className="min-w-0 flex-1 px-2">
          <AvailabilityBadge isAvailable={isAvailable} compact style={{ marginBottom: 6 }} />
          <Text className={classes.bodyXs} style={{ letterSpacing: 2, fontWeight: '600' }}>
            {brand.toUpperCase()}
          </Text>
          <Text className={classes.textBold} numberOfLines={2} style={{ fontSize: 17, marginTop: 2 }}>
            {name}
          </Text>
          <Text style={{ color: colors.primary, fontSize: 17, fontWeight: '700', marginTop: 6 }}>
            {formatPrice(priceUsd)}
          </Text>
          {topSpeedMph != null ? (
            <Text className={classes.bodyXs} style={{ marginTop: 4 }}>
              {topSpeedMph} mph
            </Text>
          ) : null}
        </View>

        <View className="gap-2">
          <GlassIconButton
            icon="create-outline"
            variant="primary"
            accessibilityLabel="Edit bike"
            onPress={onEdit}
          />
          <GlassIconButton
            icon="trash-outline"
            variant="danger"
            accessibilityLabel="Delete bike"
            onPress={onDelete}
          />
        </View>
      </View>
    </GlassSurface>
  );
}
