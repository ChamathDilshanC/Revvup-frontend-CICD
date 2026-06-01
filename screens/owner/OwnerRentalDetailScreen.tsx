import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { PrimaryButton } from '../../components/PrimaryButton';
import { RentalLiveTimer } from '../../components/RentalLiveTimer';
import { ScreenBackButton } from '../../components/ScreenBackButton';
import { formatDisplayDateTime, formatLkr } from '../../lib/rentalFormat';
import { formatDobDisplay } from '../../lib/sriLankaId';
import type { OwnerRentalsStackParamList } from '../../navigation/OwnerRentalsStack';
import { useTheme } from '../../context/ThemeContext';
import {
  confirmRentalPickup,
  confirmRentalReturn,
  fetchRentalBooking,
} from '../../services/rentals';
import type { RentalBookingDetail } from '../../types/rental';

type Props = NativeStackScreenProps<OwnerRentalsStackParamList, 'OwnerRentalDetail'>;

export function OwnerRentalDetailScreen({ navigation, route }: Props) {
  const { bookingId } = route.params;
  const { classes, colors } = useTheme();
  const [booking, setBooking] = useState<RentalBookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    try {
      setBooking(await fetchRentalBooking(bookingId));
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not load booking');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [bookingId, navigation]);

  useFocusEffect(
    useCallback(() => {
      void load();
      const id = setInterval(() => void load(), 5000);
      return () => clearInterval(id);
    }, [load]),
  );

  async function handleConfirmPickup() {
    Alert.alert(
      'Confirm pickup',
      'Client is at the showroom with ID and licence? This starts the live rent timer.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm pickup',
          onPress: async () => {
            setActing(true);
            try {
              setBooking(await confirmRentalPickup(bookingId));
              Alert.alert('Started', 'Rental is now active. Timer is running for client and you.');
            } catch (e) {
              Alert.alert('Failed', e instanceof Error ? e.message : 'Could not confirm');
            } finally {
              setActing(false);
            }
          },
        },
      ],
    );
  }

  async function handleConfirmReturn() {
    Alert.alert('Confirm return', 'Bike returned in good condition?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm return',
        onPress: async () => {
          setActing(true);
          try {
            setBooking(await confirmRentalReturn(bookingId));
            Alert.alert('Completed', 'Rental ended. Deposit handled per your showroom policy.');
          } catch (e) {
            Alert.alert('Failed', e instanceof Error ? e.message : 'Could not confirm');
          } finally {
            setActing(false);
          }
        },
      },
    ]);
  }

  if (loading || !booking) {
    return (
      <SafeAreaView className={`${classes.screen} flex-1 items-center justify-center`}>
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={classes.screen}>
      <View className="px-4 py-2">
        <ScreenBackButton onPress={() => navigation.goBack()} />
      </View>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className={classes.titleLg}>
          {booking.brand} {booking.bike_name}
        </Text>
        <Text className={`${classes.subtitle} mt-1`}>{booking.customer_name}</Text>

        {booking.status === 'ACTIVE' ? (
          <View className="mt-4">
            <RentalLiveTimer
              rentStartedAt={booking.rent_started_at}
              isLive
              elapsedSeconds={booking.elapsed_seconds}
              remainingSeconds={booking.remaining_seconds}
              overtimeSeconds={booking.overtime_seconds}
              large
            />
          </View>
        ) : null}

        <View className={`${classes.card} mt-4 p-4`}>
          <Line label="Status" value={booking.status.replace('_', ' ')} classes={classes} />
          <Line label="Phone" value={booking.phone} classes={classes} />
          {booking.nic_no ? <Line label="NIC" value={booking.nic_no} classes={classes} /> : null}
          {booking.date_of_birth ? (
            <Line label="DOB" value={formatDobDisplay(booking.date_of_birth)} classes={classes} />
          ) : null}
          <Line label="Licence" value={booking.license_no} classes={classes} />
          <Line label="Pickup slot" value={formatDisplayDateTime(booking.pickup_at)} classes={classes} />
          <Line label="Return by" value={formatDisplayDateTime(booking.return_at)} classes={classes} />
          <Line label="Total" value={formatLkr(booking.total_amount)} classes={classes} />
        </View>

        <View className="mt-6 gap-3">
          {booking.status === 'PENDING_PICKUP' ? (
            <PrimaryButton
              label="Confirm pickup (start timer)"
              onPress={handleConfirmPickup}
              loading={acting}
            />
          ) : null}
          {booking.status === 'ACTIVE' ? (
            <PrimaryButton
              label="Confirm return (end timer)"
              onPress={handleConfirmReturn}
              loading={acting}
            />
          ) : null}
          {booking.status === 'PENDING_PICKUP' ? (
            <PrimaryButton
              label="Scan QR instead"
              variant="outline"
              onPress={() => navigation.navigate('OwnerScanBooking')}
              disabled={acting}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Line({
  label,
  value,
  classes,
}: {
  label: string;
  value: string;
  classes: { specRow: string; specLabel: string; specValue: string };
}) {
  return (
    <View className={classes.specRow}>
      <Text className={classes.specLabel}>{label}</Text>
      <Text className={classes.specValue}>{value}</Text>
    </View>
  );
}
