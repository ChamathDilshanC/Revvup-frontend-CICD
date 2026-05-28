import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0B]">
      <ScrollView className="flex-1 px-4">
        <Text className="mt-4 text-3xl font-bold text-white">Explore</Text>
        <Text className="mt-2 text-gray-400">
          Discover premium motorcycles curated for enthusiasts.
        </Text>
        {/* Wire to GET /api/v1/bikes — featured & trending */}
      </ScrollView>
    </SafeAreaView>
  );
}
