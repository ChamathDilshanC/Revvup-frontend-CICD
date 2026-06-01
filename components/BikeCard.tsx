import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { AppImage } from './AppImage';

export interface BikeCardProps {
  id: string;
  name: string;
  brand: string;
  priceUsd: number;
  imageUrl: string;
  topSpeed?: number;
  onPress?: (id: string) => void;
}

export function BikeCard({ id, name, brand, priceUsd, imageUrl, topSpeed, onPress }: BikeCardProps) {
  const { classes, colors } = useTheme();
  const { formatPrice } = useCurrency();

  return (
    <Pressable onPress={() => onPress?.(id)} className={classes.bikeCard}>
      <AppImage source={{ uri: imageUrl }} className="h-44 w-full" resizeMode="cover" />
      <View className="p-4">
        <Text className={classes.brand}>{brand}</Text>
        <Text className={classes.bikeName}>{name}</Text>
        <View className="mt-3 flex-row items-center justify-between">
          <Text style={{ color: colors.primary }} className="text-base font-bold">
            {formatPrice(priceUsd)}
          </Text>
          {topSpeed != null && <Text className={classes.bodySm}>{topSpeed} mph</Text>}
        </View>
      </View>
    </Pressable>
  );
}
