import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0B] px-4">
      <Text className="mt-6 text-3xl font-bold text-white">Owner Dashboard</Text>
      <Text className="mt-2 text-gray-400">
        Manage your showroom profile and inventory. Wire to GET /api/v1/owner/bikes and PATCH
        /api/v1/owner/showroom/me.
      </Text>
    </SafeAreaView>
  );
}
