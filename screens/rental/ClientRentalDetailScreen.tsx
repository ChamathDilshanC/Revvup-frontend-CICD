import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RentalScheduleBlock } from '../../components/RentalScheduleBlock';
import { ScreenBackButton } from '../../components/ScreenBackButton';
import { RentalLiveTimer } from '../../components/RentalLiveTimer';
import { formatDisplayDateTime, formatLkr } from '../../lib/rentalFormat';
import { saveQrBase64ToPhotos } from '../../lib/saveQrImage';
import type { ClientRentalsStackParamList } from '../../navigation/ClientRentalsStack';
import { useTheme } from '../../context/ThemeContext';
import { fetchRentalBooking } from '../../services/rentals';
import type { RentalBookingDetail } from '../../types/rental';

type Props = NativeStackScreenProps<ClientRentalsStackParamList, 'MyRentalDetail'>;

export function ClientRentalDetailScreen({ navigation, route }: Props) {
  const { bookingId } = route.params;
  const { classes, colors } = useTheme();
  const [booking, setBooking] = useState<RentalBookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingQr, setSavingQr] = useState(false);

  const load = useCallback(async () => {
    try {
      setBooking(await fetchRentalBooking(bookingId));
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useFocusEffect(
    useCallback(() => {
      void load();
      const id = setInterval(() => void load(), 5000);
      return () => clearInterval(id);
    }, [load]),
  );

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
        <Text className={classes.subtitle}>{booking.showroom_name ?? 'Showroom'}</Text>

        {booking.status === 'PENDING_PICKUP' ? (
          <Text className={`${classes.bodySm} mt-2`}>
            Show this QR at the showroom. The owner will scan or approve manually to start your
            timer.
          </Text>
        ) : null}

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
          <View className="mt-4">
            <RentalScheduleBlock
              pickup={formatDisplayDateTime(booking.pickup_at)}
              returnAt={formatDisplayDateTime(booking.return_at)}
              duration={booking.duration_label}
            />
          </View>
          <Line label="Total" value={formatLkr(booking.total_amount)} classes={classes} />
        </View>

        {booking.status === 'PENDING_PICKUP' ? (
          <View className={`${classes.card} mt-4 items-center p-4`}>
            <Text className={classes.sectionLabelMb3}>Show at showroom</Text>
            {booking.qr_code_base64 ? (
              <>
                <Image
                  source={{ uri: `data:image/png;base64,${booking.qr_code_base64}` }}
                  style={{ width: 200, height: 200 }}
                  accessibilityLabel="Booking QR"
                />
                <Pressable
                  onPress={async () => {
                    if (!booking.qr_code_base64) return;
                    setSavingQr(true);
                    try {
                      await saveQrBase64ToPhotos(booking.qr_code_base64, booking.booking_id);
                    } finally {
                      setSavingQr(false);
                    }
                  }}
                  disabled={savingQr}
                  className="mt-4 flex-row items-center justify-center rounded-xl border border-[#E63946] px-4 py-2.5"
                >
                  {savingQr ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <>
                      <Ionicons name="download-outline" size={18} color={colors.primary} />
                      <Text className="ml-2 font-semibold text-[#E63946]">Save QR to phone</Text>
                    </>
                  )}
                </Pressable>
              </>
            ) : (
              <Text className="font-mono text-sm">{booking.booking_id}</Text>
            )}
          </View>
        ) : null}
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
