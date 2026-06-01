import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
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
import { PrimaryButton } from '../../components/PrimaryButton';
import { formatDisplayDateTime, formatLkr } from '../../lib/rentalFormat';
import type { OwnerRentalsStackParamList } from '../../navigation/OwnerRentalsStack';
import { useTheme } from '../../context/ThemeContext';
import { fetchShowroomRentalBookings } from '../../services/rentals';
import type { RentalBookingListItem, RentalBookingStatus } from '../../types/rental';

type Nav = NativeStackNavigationProp<OwnerRentalsStackParamList, 'OwnerRentalsHome'>;

const STATUS_LABEL: Record<RentalBookingStatus, string> = {
  PENDING_PICKUP: 'Awaiting pickup',
  ACTIVE: 'Renting now',
  COMPLETED: 'Returned',
  CANCELLED: 'Cancelled',
};

export function OwnerRentalsScreen() {
  const navigation = useNavigation<Nav>();
  const { classes, colors } = useTheme();
  const [items, setItems] = useState<RentalBookingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      setItems(await fetchShowroomRentalBookings());
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

  const sections = useMemo(() => {
    const pending = items.filter((b) => b.status === 'PENDING_PICKUP');
    const active = items.filter((b) => b.status === 'ACTIVE');
    const other = items.filter((b) => b.status !== 'PENDING_PICKUP' && b.status !== 'ACTIVE');
    const out: { title: string; data: RentalBookingListItem[] }[] = [];
    if (pending.length) out.push({ title: `Awaiting confirm (${pending.length})`, data: pending });
    if (active.length) out.push({ title: `Active rentals (${active.length})`, data: active });
    if (other.length) out.push({ title: 'Recent', data: other.slice(0, 20) });
    return out;
  }, [items]);

  const pendingCount = items.filter((b) => b.status === 'PENDING_PICKUP').length;

  return (
    <View className="flex-1">
      <ExploreMeshBackground />
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-center justify-between px-4 pb-2 pt-2">
          <View className="flex-1">
            <Text className={classes.titleLg}>Rentals</Text>
            <Text className={classes.subtitle}>Confirm pickup & return for your showroom</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('OwnerScanBooking')}
            className="h-12 w-12 items-center justify-center rounded-full bg-[#E63946]"
          >
            <Ionicons name="qr-code-outline" size={26} color="#fff" />
          </Pressable>
        </View>

        {pendingCount > 0 ? (
          <View className="mx-4 mb-2">
            <PrimaryButton
              label={`Scan client QR (${pendingCount} waiting)`}
              onPress={() => navigation.navigate('OwnerScanBooking')}
            />
          </View>
        ) : null}

        {loading && !refreshing ? (
          <ActivityIndicator className="mt-12" color={colors.primary} />
        ) : sections.length === 0 ? (
          <Text className={`${classes.bodyCenter} mt-12 px-6`}>No rental bookings yet.</Text>
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
              <BookingRow
                item={item}
                classes={classes}
                onPress={() =>
                  navigation.navigate('OwnerRentalDetail', { bookingId: item.booking_id })
                }
              />
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

function BookingRow({
  item,
  classes,
  onPress,
}: {
  item: RentalBookingListItem;
  classes: ReturnType<typeof useTheme>['classes'];
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="mb-3 active:opacity-90">
      <GlassSurface borderRadius={20}>
        <View className="p-4">
          <Text className={classes.textBoldLg}>
            {item.brand} {item.bike_name}
          </Text>
          <Text className={classes.bodySm}>{item.customer_name} · {item.phone}</Text>
          <Text className={`${classes.bodyXs} mt-1 text-[#E63946]`}>
            {STATUS_LABEL[item.status]}
          </Text>
          {item.status === 'ACTIVE' && item.rent_started_at ? (
            <View className="mt-3">
              <RentalLiveTimer
                rentStartedAt={item.rent_started_at}
                isLive
                elapsedSeconds={item.elapsed_seconds}
              />
            </View>
          ) : (
            <Text className={`${classes.bodySm} mt-2`}>
              Return by {formatDisplayDateTime(item.return_at)} · {formatLkr(item.total_amount)}
            </Text>
          )}
        </View>
      </GlassSurface>
    </Pressable>
  );
}
