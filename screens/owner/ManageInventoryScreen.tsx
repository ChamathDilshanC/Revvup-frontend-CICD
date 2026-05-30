import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ManageInventoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0B] px-4">
      <Text className="mt-6 text-3xl font-bold text-white">Inventory</Text>
      <Text className="mt-2 text-gray-400">
        List bikes for your showroom only — backed by GET /api/v1/owner/bikes.
      </Text>
    </SafeAreaView>
  );
}
