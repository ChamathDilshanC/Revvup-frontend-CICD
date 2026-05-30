import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import type { RootTabParamList } from '../navigation/RootTabs';

type DetailsScreenProps = BottomTabScreenProps<RootTabParamList, 'Details'>;

export function DetailsScreen({ route }: DetailsScreenProps) {
  const bikeId = route.params?.bikeId;
  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0B]">
      <ScrollView className="flex-1 px-4">
        <Text className="mt-4 text-2xl font-bold text-white">Bike Details</Text>
        <Text className="mt-2 text-gray-400">ID: {bikeId ?? '—'}</Text>
        {/* Specs from GET /api/v1/bikes/{id}: top speed, weight, engine cc */}
        <View className="mt-6 rounded-2xl border border-[#2A2A2E] bg-[#141416] p-4">
          <SpecRow label="Top Speed" value="186 mph" />
          <SpecRow label="Weight" value="430 lbs" />
          <SpecRow label="Engine" value="1103 cc" />
        </View>
        <View className="mt-8">
          <PrimaryButton label="Contact Dealer" onPress={() => {}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between border-b border-[#2A2A2E] py-3 last:border-0">
      <Text className="text-gray-400">{label}</Text>
      <Text className="font-medium text-white">{value}</Text>
    </View>
  );
}
