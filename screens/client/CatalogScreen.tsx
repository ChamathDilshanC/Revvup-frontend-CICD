import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BikeCard } from '../../components/BikeCard';

const PLACEHOLDER_BIKES = [
  {
    id: '1',
    name: 'Panigale V4 S',
    brand: 'Ducati',
    price: 28995,
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800',
    topSpeed: 186,
  },
];

export function CatalogScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0B]">
      <View className="px-4 pt-4">
        <Text className="text-3xl font-bold text-white">Catalog</Text>
        <Text className="mt-2 text-gray-400">Premium bikes, zero compromise.</Text>
      </View>
      <FlatList
        data={PLACEHOLDER_BIKES}
        keyExtractor={(item) => item.id}
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
        renderItem={({ item }) => <BikeCard {...item} />}
      />
    </SafeAreaView>
  );
}
