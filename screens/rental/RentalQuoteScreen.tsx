import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ScreenBackButton } from '../../components/ScreenBackButton';
import { useTheme } from '../../context/ThemeContext';
import { formatDisplayDateTime, formatLkr } from '../../lib/rentalFormat';
import { formatDobDisplay } from '../../lib/sriLankaId';
import type { BikeFlowParamList } from '../../navigation/bikeFlowParams';
import { bookRental } from '../../services/rentals';

type Props = NativeStackScreenProps<BikeFlowParamList, 'RentalQuote'>;

export function RentalQuoteScreen({ navigation, route }: Props) {
  const { form, quote } = route.params;
  const { classes } = useTheme();
  const [booking, setBooking] = useState(false);

  async function handleConfirm() {
    setBooking(true);
    try {
      const result = await bookRental({
        bike_id: form.bikeId,
        pickup_at: form.pickupAt,
        return_at: form.returnAt,
        customer_name: form.customerName,
        phone: form.phone,
        nic_no: form.nicNo,
        date_of_birth: form.dateOfBirth,
        license_no: form.licenseNo,
      });
      navigation.replace('RentalSuccess', { booking: result });
    } catch (e) {
      Alert.alert('Booking failed', e instanceof Error ? e.message : 'Could not complete booking');
    } finally {
      setBooking(false);
    }
  }

  return (
    <SafeAreaView className={classes.screen}>
      <View className="px-4 py-2">
        <ScreenBackButton onPress={() => navigation.goBack()} />
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className={classes.titleLg}>Rental quote</Text>
        <Text className={`${classes.subtitle} mt-1`}>
          {quote.brand} {quote.bike_name}
        </Text>

        <View className={`${classes.card} mt-6 p-4`}>
          <Text className={classes.sectionLabelMb3}>Schedule</Text>
          <Line label="Pickup" value={formatDisplayDateTime(quote.pickup_at)} classes={classes} />
          <Line label="Return" value={formatDisplayDateTime(quote.return_at)} classes={classes} />
          <Line label="Duration" value={quote.duration_label} classes={classes} />
          <Line label="Rate" value={quote.rate_label} classes={classes} />
        </View>

        <View className={`${classes.card} mt-4 p-4`}>
          <Text className={classes.sectionLabelMb3}>Price (LKR)</Text>
          <Line label="Rental fee" value={formatLkr(quote.rental_fee)} classes={classes} />
          <Line label="Security deposit" value={formatLkr(quote.deposit_amount)} classes={classes} />
          <View className={`${classes.specRow} mt-2 border-t border-gray-200 pt-3 dark:border-gray-700`}>
            <Text className={classes.textBoldLg}>Total due at pickup</Text>
            <Text className="text-lg font-bold text-[#E63946]">{formatLkr(quote.total_amount)}</Text>
          </View>
        </View>

        <View className={`${classes.card} mt-4 p-4`}>
          <Text className={classes.sectionLabelMb3}>Your details</Text>
          <Line label="Name" value={form.customerName} classes={classes} />
          <Line label="Phone" value={form.phone} classes={classes} />
          <Line label="NIC" value={form.nicNo} classes={classes} />
          <Line label="Date of birth" value={formatDobDisplay(form.dateOfBirth)} classes={classes} />
          <Line label="Driving licence" value={form.licenseNo} classes={classes} />
        </View>

        <View className="mt-8 gap-3">
          <PrimaryButton label="Confirm booking" onPress={handleConfirm} loading={booking} />
          <PrimaryButton
            label="Change dates or details"
            variant="outline"
            onPress={() => navigation.goBack()}
            disabled={booking}
          />
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
