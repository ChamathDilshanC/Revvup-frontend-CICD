import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { BikeCard } from './BikeCard';

type Bike = {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  topSpeed?: number;
};

type BikeSliderProps = {
  title?: string;
  bikes: Bike[];
};

/** Horizontal featured bikes strip for Explore. */
export function BikeSlider({ title = 'Featured', bikes }: BikeSliderProps) {
  if (!bikes.length) return null;

  return (
    <View className="mb-6">
      <Text className="mb-3 text-lg font-semibold text-white">{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
        {bikes.map((bike) => (
          <View key={bike.id} className="mr-3 w-72">
            <BikeCard {...bike} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
