import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExploreMeshBackground } from '../components/ExploreMeshBackground';
import { RentBikeCard } from '../components/RentBikeCard';
import { ProvinceFilterBar } from '../components/ProvinceFilterBar';
import { SearchField } from '../components/SearchField';
import { useClientProvinceFilter } from '../hooks/useClientProvinceFilter';
import { bikeImageUrl, filterRentableBikes, formatRentRateLabel } from '../lib/bikes';
import { getBikeProvince } from '../lib/bikeProvince';
import type { RentStackParamList } from '../navigation/RentStack';
import { useTheme } from '../context/ThemeContext';
import { fetchCatalog } from '../services/bikes';
import type { BikeSummary } from '../types/bike';

type Nav = NativeStackNavigationProp<RentStackParamList, 'RentHome'>;

function matchesSearch(bike: BikeSummary, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    bike.name,
    bike.brand,
    bike.showroom_name,
    bike.showroom_address,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

export function RentScreen() {
  const navigation = useNavigation<Nav>();
  const { classes, colors, isDark } = useTheme();
  const [bikes, setBikes] = useState<BikeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    selectedProvince,
    setSelectedProvince,
    provinceCounts,
    filteredBikes,
    detectFromGps,
    locating,
  } = useClientProvinceFilter(bikes);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const catalog = await fetchCatalog();
      setBikes(filterRentableBikes(catalog));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load rentals');
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

  const visible = useMemo(
    () => filteredBikes.filter((b) => matchesSearch(b, searchQuery)),
    [filteredBikes, searchQuery],
  );

  return (
    <View className="flex-1">
      <ExploreMeshBackground />
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="px-4 pb-2 pt-2">
          <Text className={classes.titleLg}>Rent</Text>
          <Text className={`${classes.subtitle} mt-1`}>
            {selectedProvince
              ? `Rentals from showrooms in ${selectedProvince} Province`
              : 'Bikes available to rent from verified showrooms'}
          </Text>
          <View className="mt-4">
            <ProvinceFilterBar
              selectedProvince={selectedProvince}
              onSelectProvince={setSelectedProvince}
              provinceCounts={provinceCounts}
              onUseMyLocation={() => void detectFromGps()}
              locating={locating}
            />
            <SearchField
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search bike, brand, or showroom…"
            />
          </View>
        </View>

        {loading && !refreshing ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text className={classes.bodyCenter}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={visible}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => void load(true)}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={
              <View className="mt-12 items-center px-4">
                <Text className={classes.bodyCenter}>
                  {searchQuery.trim()
                    ? 'No matching rental bikes.'
                    : selectedProvince
                      ? `No rental bikes in ${selectedProvince} Province. Try All or Near me.`
                      : 'No bikes for rent yet. Check back soon.'}
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              const province = getBikeProvince(item);
              const showroomLabel = item.showroom_name
                ? province
                  ? `${item.showroom_name} · ${province}`
                  : item.showroom_name
                : province ?? undefined;
              return (
              <RentBikeCard
                id={item.id}
                name={item.name}
                brand={item.brand}
                imageUrl={bikeImageUrl(item.image_url)}
                showroomName={showroomLabel}
                rentLabel={formatRentRateLabel(item)}
                topSpeedMph={item.top_speed_mph}
                weightLbs={item.weight_lbs}
                engineCc={item.engine_cc}
                isAvailable={item.is_available !== false}
                isRentedOut={item.is_rented_out === true}
                rentalStatus={item.rental_status}
                rentalReturnAt={item.rental_return_at}
                onPress={(id) => navigation.navigate('BikeDetail', { bikeId: id })}
              />
            );
            }}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
