import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExploreMeshBackground } from '../../components/ExploreMeshBackground';
import { GlassSurface } from '../../components/GlassSurface';
import { RentalScheduleBlock } from '../../components/RentalScheduleBlock';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useTheme } from '../../context/ThemeContext';
import { formatDisplayDateTime, formatLkr } from '../../lib/rentalFormat';
import { saveQrBase64ToPhotos } from '../../lib/saveQrImage';
import type { BikeFlowParamList } from '../../navigation/bikeFlowParams';
import type { RentalBookingStatus } from '../../types/rental';

type Props = NativeStackScreenProps<BikeFlowParamList, 'RentalSuccess'>;

export function RentalSuccessScreen({ navigation, route }: Props) {
  const { booking } = route.params;
  const { classes, colors, isDark } = useTheme();
  const inv = booking.invoice;
  const shortId = inv.booking_id.slice(0, 8).toUpperCase();
  const [savingQr, setSavingQr] = useState(false);

  async function handleSaveQr() {
    if (!booking.qr_code_base64) return;
    setSavingQr(true);
    try {
      await saveQrBase64ToPhotos(booking.qr_code_base64, booking.booking_id);
    } finally {
      setSavingQr(false);
    }
  }

  return (
    <View className="flex-1">
      <ExploreMeshBackground />
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center pt-4">
            <View
              className="mb-4 h-16 w-16 items-center justify-center rounded-full"
              style={{
                backgroundColor: isDark ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.12)',
                borderWidth: 2,
                borderColor: isDark ? 'rgba(34,197,94,0.5)' : 'rgba(22,163,74,0.35)',
              }}
            >
              <Ionicons name="checkmark" size={36} color="#22C55E" />
            </View>
            <Text className={classes.titleLg}>Booking confirmed</Text>
            <StatusBadge status={booking.status} />
          </View>

          <GlassSurface borderRadius={28} style={{ marginTop: 20 }}>
            <View className="items-center px-5 pb-5 pt-6">
              <Text
                className={classes.bodyXs}
                style={{ letterSpacing: 2.5, fontWeight: '700', color: colors.primary }}
              >
                SHOW AT SHOWROOM
              </Text>
              <Text className={`${classes.textBoldLg} mt-2 text-center`}>
                {inv.showroom_name ?? 'Showroom'}
              </Text>
              <Text className={`${classes.bodySm} mt-3 text-center leading-5`}>
                Owner scans this QR or approves manually — then your live rent timer starts.
              </Text>

              <View
                className="mt-5 rounded-2xl p-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)',
                }}
              >
                {booking.qr_code_base64 ? (
                  <Image
                    source={{ uri: `data:image/png;base64,${booking.qr_code_base64}` }}
                    style={{ width: 200, height: 200 }}
                    accessibilityLabel="Booking QR code"
                  />
                ) : (
                  <View className="h-[200px] w-[200px] items-center justify-center px-3">
                    <Text className="text-center text-sm text-gray-600">QR unavailable</Text>
                    <Text className="mt-2 font-mono text-xs font-bold text-[#E63946]">{inv.booking_id}</Text>
                  </View>
                )}
              </View>

              <View
                className="mt-4 flex-row items-center rounded-full px-4 py-2"
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }}
              >
                <Ionicons name="barcode-outline" size={16} color={colors.textSecondary} />
                <Text className={`${classes.bodySm} ml-2 font-medium`}>Ref {shortId}</Text>
              </View>

              {booking.qr_code_base64 ? (
                <Pressable
                  onPress={handleSaveQr}
                  disabled={savingQr}
                  className="mt-4 flex-row items-center justify-center rounded-xl border border-[#E63946] px-5 py-3 active:opacity-80"
                  style={{ opacity: savingQr ? 0.6 : 1 }}
                >
                  {savingQr ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <>
                      <Ionicons name="download-outline" size={20} color={colors.primary} />
                      <Text className="ml-2 text-base font-semibold text-[#E63946]">
                        Save QR to phone
                      </Text>
                    </>
                  )}
                </Pressable>
              ) : null}
            </View>
          </GlassSurface>

          <View className="mt-5 flex-row gap-2">
            <StepChip number={1} text="Arrive at showroom" />
            <StepChip number={2} text="Show QR" />
            <StepChip number={3} text="Ride" />
          </View>

          <GlassSurface borderRadius={24} style={{ marginTop: 16 }}>
            <View className="p-5">
              <View className="mb-4 flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className={classes.sectionLabel}>Invoice</Text>
                  <Text className={`${classes.heading} mt-1`}>
                    {inv.brand} {inv.bike_name}
                  </Text>
                  {inv.showroom_address ? (
                    <View className="mt-2 flex-row items-center gap-1">
                      <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                      <Text className={classes.bodySm} numberOfLines={2}>
                        {inv.showroom_address}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>

              <RentalScheduleBlock
                pickup={formatDisplayDateTime(inv.pickup_at)}
                returnAt={formatDisplayDateTime(inv.return_at)}
                duration={inv.duration_label}
              />

              <View className="mt-4">
                {inv.lines.map((line) => (
                  <AmountRow key={line.label} label={line.label} amount={formatLkr(line.amount)} />
                ))}
              </View>

              <View
                className="mt-4 flex-row items-center justify-between rounded-xl px-4 py-3"
                style={{
                  backgroundColor: isDark ? 'rgba(230,57,70,0.15)' : 'rgba(230,57,70,0.08)',
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(230,57,70,0.35)' : 'rgba(230,57,70,0.2)',
                }}
              >
                <Text className={classes.textBoldLg}>Total at pickup</Text>
                <Text style={{ fontSize: 22, fontWeight: '800', color: colors.primary }}>
                  {formatLkr(inv.total_amount)}
                </Text>
              </View>

              <Text className={`${classes.bodyXs} mt-3 leading-4`}>{inv.note}</Text>
            </View>
          </GlassSurface>

          <View className="mt-8 gap-3">
            <PrimaryButton
              label="Track this booking"
              onPress={() => {
              navigation.getParent()?.navigate('MyRentals', {
                screen: 'MyRentalDetail',
                params: { bookingId: booking.booking_id },
              });
              }}
            />
            <PrimaryButton label="Done" variant="outline" onPress={() => navigation.popToTop()} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function StatusBadge({ status }: { status: RentalBookingStatus }) {
  const config: Record<RentalBookingStatus, { label: string; bg: string; text: string }> = {
    PENDING_PICKUP: {
      label: 'Awaiting pickup',
      bg: 'rgba(245,158,11,0.18)',
      text: '#D97706',
    },
    ACTIVE: { label: 'Renting now', bg: 'rgba(34,197,94,0.18)', text: '#16A34A' },
    COMPLETED: { label: 'Completed', bg: 'rgba(107,114,128,0.18)', text: '#6B7280' },
    CANCELLED: { label: 'Cancelled', bg: 'rgba(239,68,68,0.15)', text: '#DC2626' },
  };
  const c = config[status];
  return (
    <View className="mt-3 rounded-full px-4 py-1.5" style={{ backgroundColor: c.bg }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: c.text, letterSpacing: 0.5 }}>
        {c.label.toUpperCase()}
      </Text>
    </View>
  );
}

function StepChip({ number, text }: { number: number; text: string }) {
  const { classes, colors, isDark } = useTheme();
  return (
    <View
      className="flex-1 items-center rounded-xl px-2 py-3"
      style={{
        backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.75)',
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
      }}
    >
      <View
        className="mb-1.5 h-6 w-6 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.primary }}
      >
        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '800' }}>{number}</Text>
      </View>
      <Text className={`${classes.bodyXs} text-center`} numberOfLines={2}>
        {text}
      </Text>
    </View>
  );
}

function AmountRow({ label, amount }: { label: string; amount: string }) {
  const { classes } = useTheme();
  return (
    <View className="flex-row items-start justify-between border-b border-gray-100 py-3 dark:border-[#2A2A2E] last:border-0">
      <Text className={`${classes.bodySm} flex-1 pr-3`}>{label}</Text>
      <Text className={classes.specValue}>{amount}</Text>
    </View>
  );
}
