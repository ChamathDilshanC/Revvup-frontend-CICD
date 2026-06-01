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
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExploreMeshBackground } from '../../components/ExploreMeshBackground';
import { GlassSurface } from '../../components/GlassSurface';
import { RentalLiveTimer } from '../../components/RentalLiveTimer';
import { formatDisplayDateTime, formatLkr } from '../../lib/rentalFormat';
import type { ClientRentalsStackParamList } from '../../navigation/ClientRentalsStack';
import { useTheme } from '../../context/ThemeContext';
import { fetchMyRentalBookings } from '../../services/rentals';
import type { RentalBookingListItem } from '../../types/rental';

type Nav = NativeStackNavigationProp<ClientRentalsStackParamList, 'MyRentalsHome'>;

export function ClientRentalsScreen() {
  const navigation = useNavigation<Nav>();
  const { classes, colors } = useTheme();
  const [items, setItems] = useState<RentalBookingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      setItems(await fetchMyRentalBookings());
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
      const id = setInterval(() => void load(true), 15000);
      return () => clearInterval(id);
    }, [load]),
  );

  const active = items.filter((b) => b.status === 'ACTIVE');
  const pending = items.filter((b) => b.status === 'PENDING_PICKUP');
  const rest = items.filter((b) => b.status !== 'ACTIVE' && b.status !== 'PENDING_PICKUP');
  const sections = [
    ...(active.length ? [{ title: 'Renting now', data: active }] : []),
    ...(pending.length ? [{ title: 'Awaiting showroom', data: pending }] : []),
    ...(rest.length ? [{ title: 'Past bookings', data: rest }] : []),
  ];

  return (
    <View className="flex-1">
      <ExploreMeshBackground />
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="px-4 pb-2 pt-2">
          <Text className={classes.titleLg}>My rentals</Text>
          <Text className={classes.subtitle}>Live timer runs after showroom confirms pickup</Text>
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator className="mt-12" color={colors.primary} />
        ) : sections.length === 0 ? (
          <Text className={`${classes.bodyCenter} mt-12 px-6`}>No bookings yet. Rent a bike from the Rent tab.</Text>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.booking_id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} />
            }
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
            renderSectionHeader={({ section }) => (
              <Text className={`${classes.sectionLabelMb3} mt-4`}>{section.title}</Text>
            )}
            renderItem={({ item }) => (
              <Pressable
                className="mb-3"
                onPress={() =>
                  navigation.navigate('MyRentalDetail', { bookingId: item.booking_id })
                }
              >
                <GlassSurface borderRadius={20}>
                  <View className="p-4">
                    <Text className={classes.textBoldLg}>
                      {item.brand} {item.bike_name}
                    </Text>
                    <Text className={classes.bodySm}>{item.status.replace('_', ' ')}</Text>
                    {item.is_live && item.rent_started_at ? (
                      <View className="mt-3">
                        <RentalLiveTimer
                          rentStartedAt={item.rent_started_at}
                          isLive
                          elapsedSeconds={item.elapsed_seconds}
                        />
                      </View>
                    ) : (
                      <Text className={`${classes.bodySm} mt-2`}>
                        {formatDisplayDateTime(item.return_at)} · {formatLkr(item.total_amount)}
                      </Text>
                    )}
                  </View>
                </GlassSurface>
              </Pressable>
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
