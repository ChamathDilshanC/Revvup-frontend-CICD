import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BikeCard } from '../components/BikeCard';
import { bikeImageUrl, groupBikesByShowroom } from '../lib/bikes';
import type { ExploreStackParamList } from '../navigation/ExploreStack';
import { fetchCatalog } from '../services/bikes';
import type { BikeSummary } from '../types/bike';

type Nav = NativeStackNavigationProp<ExploreStackParamList, 'ExploreHome'>;

export function ExploreScreen() {
  const navigation = useNavigation<Nav>();
  const [bikes, setBikes] = useState<BikeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await fetchCatalog();
      setBikes(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load bikes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const sections = groupBikesByShowroom(bikes).map((g) => ({
    title: g.showroomName,
    address: g.showroomAddress,
    data: g.bikes,
  }));

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0B]">
      <View className="px-4 pb-3 pt-2">
        <Text className="text-3xl font-bold text-white">Explore</Text>
        <Text className="mt-1 text-gray-400">
          Browse premium bikes from every verified showroom.
        </Text>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#E63946" size="large" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-gray-400">{error}</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#E63946" />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          stickySectionHeadersEnabled={false}
          ListEmptyComponent={
            <Text className="mt-8 text-center text-gray-500">No bikes listed yet. Check back soon.</Text>
          }
          renderSectionHeader={({ section }) => (
            <View className="mb-3 mt-5 rounded-xl border border-[#2A2A2E] bg-[#141416] px-4 py-3">
              <Text className="text-lg font-bold text-white">{section.title}</Text>
              {section.address ? (
                <Text className="mt-1 text-sm text-gray-400">{section.address}</Text>
              ) : null}
              <Text className="mt-1 text-xs text-gray-500">
                {section.data.length} bike{section.data.length === 1 ? '' : 's'}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <BikeCard
              id={item.id}
              name={item.name}
              brand={item.brand}
              price={item.price}
              imageUrl={bikeImageUrl(item.image_url)}
              topSpeed={item.top_speed_mph ?? undefined}
              onPress={(id) => navigation.navigate('BikeDetail', { bikeId: id })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
