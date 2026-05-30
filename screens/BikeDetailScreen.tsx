import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppImage } from '../components/AppImage';
import { PrimaryButton } from '../components/PrimaryButton';
import { bikeImageUrl } from '../lib/bikes';
import type { ExploreStackParamList } from '../navigation/ExploreStack';
import { fetchBikeDetail } from '../services/bikes';
import type { BikeDetail } from '../types/bike';

type Props = NativeStackScreenProps<ExploreStackParamList, 'BikeDetail'>;

export function BikeDetailScreen({ navigation, route }: Props) {
  const { bikeId } = route.params;
  const [bike, setBike] = useState<BikeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBikeDetail(bikeId);
        setBike(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load bike');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [bikeId]);

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0B]">
      <View className="flex-row items-center px-4 py-2">
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} className="flex-row items-center gap-1">
          <Ionicons name="chevron-back" size={24} color="#F5F5F7" />
          <Text className="text-base text-white">Back</Text>
        </Pressable>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#E63946" size="large" />
        </View>
      ) : error || !bike ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-gray-400">{error ?? 'Bike not found'}</Text>
        </View>
      ) : (
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
          <AppImage
            source={{ uri: bikeImageUrl(bike.image_url) }}
            className="h-56 w-full"
            resizeMode="cover"
          />
          <View className="px-4 pt-5">
            <Text className="text-xs uppercase tracking-widest text-[#E63946]">{bike.brand}</Text>
            <Text className="mt-1 text-3xl font-bold text-white">{bike.name}</Text>
            <Text className="mt-2 text-2xl font-bold text-[#E63946]">${bike.price.toLocaleString()}</Text>

            <View className="mt-6 rounded-2xl border border-[#2A2A2E] bg-[#141416] p-4">
              <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">Showroom</Text>
              <Text className="text-lg font-semibold text-white">
                {bike.showroom_name ?? 'Verified dealer'}
              </Text>
              {bike.showroom_address ? (
                <Text className="mt-1 text-sm text-gray-400">{bike.showroom_address}</Text>
              ) : null}
            </View>

            <View className="mt-4 rounded-2xl border border-[#2A2A2E] bg-[#141416] p-4">
              <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Full specifications
              </Text>
              <SpecRow label="Year" value={bike.year != null ? String(bike.year) : '—'} />
              <SpecRow label="Top speed" value={bike.top_speed_mph != null ? `${bike.top_speed_mph} mph` : '—'} />
              <SpecRow label="Weight" value={bike.weight_lbs != null ? `${bike.weight_lbs} lbs` : '—'} />
              <SpecRow label="Engine" value={bike.engine_cc != null ? `${bike.engine_cc} cc` : '—'} />
              <SpecRow label="Horsepower" value={bike.horsepower != null ? `${bike.horsepower} hp` : '—'} />
            </View>

            <View className="mt-8">
              <PrimaryButton
                label="Contact showroom"
                onPress={() => {}}
                variant="outline"
              />
            </View>
          </View>
        </ScrollView>
      )}
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
