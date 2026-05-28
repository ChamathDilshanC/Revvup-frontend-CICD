import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { colors } from '../theme/colors';

export interface BikeCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  topSpeed?: number;
  onPress?: (id: string) => void;
}

export function BikeCard({ id, name, brand, price, imageUrl, topSpeed, onPress }: BikeCardProps) {
  return (
    <Pressable
      onPress={() => onPress?.(id)}
      className="mb-4 overflow-hidden rounded-2xl bg-[#141416] border border-[#2A2A2E]"
    >
      <Image source={{ uri: imageUrl }} className="h-44 w-full" resizeMode="cover" />
      <View className="p-4">
        <Text className="text-xs uppercase tracking-widest text-gray-400">{brand}</Text>
        <Text className="mt-1 text-lg font-semibold text-white">{name}</Text>
        <View className="mt-3 flex-row items-center justify-between">
          <Text style={{ color: colors.primary }} className="text-base font-bold">
            ${price.toLocaleString()}
          </Text>
          {topSpeed != null && (
            <Text className="text-sm text-gray-400">{topSpeed} mph</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
