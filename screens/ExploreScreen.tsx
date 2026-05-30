import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SectionList,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { hasMapCoordinates } from '../constants/map';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BikeCard } from '../components/BikeCard';
import { bikeImageUrl, groupBikesByShowroom } from '../lib/bikes';
import type { ExploreStackParamList } from '../navigation/ExploreStack';
import { useTheme } from '../context/ThemeContext';
import { fetchCatalog } from '../services/bikes';
import type { BikeSummary } from '../types/bike';

type Nav = NativeStackNavigationProp<ExploreStackParamList, 'ExploreHome'>;

export function ExploreScreen() {
  const navigation = useNavigation<Nav>();
  const { classes } = useTheme();
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
    latitude: g.showroomLatitude,
    longitude: g.showroomLongitude,
    data: g.bikes,
  }));

  return (
    <SafeAreaView className={classes.screen}>
      <View className="px-4 pb-3 pt-2">
        <Text className={classes.title}>Explore</Text>
        <Text className={classes.subtitle}>
          Browse premium bikes from every verified showroom.
        </Text>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#E63946" size="large" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className={classes.bodyCenter}>{error}</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#E63946" />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          stickySectionHeadersEnabled={false}
          ListEmptyComponent={
            <Text className={classes.empty}>No bikes listed yet. Check back soon.</Text>
          }
          renderSectionHeader={({ section }) => {
            const canMap = hasMapCoordinates(section.latitude, section.longitude);
            return (
              <Pressable
                disabled={!canMap}
                onPress={() =>
                  canMap &&
                  navigation.navigate('ShowroomMap', {
                    showroomName: section.title,
                    showroomAddress: section.address,
                    latitude: section.latitude!,
                    longitude: section.longitude!,
                  })
                }
                className={classes.sectionHeader}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-2">
                    <Text className={classes.heading}>{section.title}</Text>
                    {section.address ? (
                      <Text className={`${classes.bodySm} mt-1`}>{section.address}</Text>
                    ) : null}
                    <Text className={`${classes.bodyXs} mt-1`}>
                      {section.data.length} bike{section.data.length === 1 ? '' : 's'}
                    </Text>
                  </View>
                  {canMap ? (
                    <View className="flex-row items-center gap-1 pt-1">
                      <Ionicons name="map-outline" size={18} color="#E63946" />
                      <Text className="text-xs font-semibold text-[#E63946]">Map</Text>
                    </View>
                  ) : null}
                </View>
              </Pressable>
            );
          }}
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
