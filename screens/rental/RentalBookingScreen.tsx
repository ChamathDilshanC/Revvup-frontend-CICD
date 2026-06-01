import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateTimeField } from '../../components/DateTimeField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { RentalOutBadge } from '../../components/RentalOutBadge';
import { ScreenBackButton } from '../../components/ScreenBackButton';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { canBookBikeRental, isBikeRentedOut } from '../../lib/bikes';
import { formatLkr, toIsoUtc } from '../../lib/rentalFormat';
import { normalizeNic, validateRentalIdentity } from '../../lib/sriLankaId';
import type { BikeFlowParamList } from '../../navigation/bikeFlowParams';
import { fetchBikeDetail } from '../../services/bikes';
import { fetchRentalQuote } from '../../services/rentals';
import type { BikeDetail } from '../../types/bike';

type Props = NativeStackScreenProps<BikeFlowParamList, 'RentalBooking'>;

function defaultPickup(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  return d;
}

function defaultReturn(pickup: Date): Date {
  const d = new Date(pickup);
  d.setHours(18, 0, 0, 0);
  if (d <= pickup) {
    d.setTime(pickup.getTime() + 8 * 60 * 60 * 1000);
  }
  return d;
}

export function RentalBookingScreen({ navigation, route }: Props) {
  const { bikeId } = route.params;
  const { classes, colors } = useTheme();
  const { profile } = useAuth();
  const [bike, setBike] = useState<BikeDetail | null>(null);
  const [loadingBike, setLoadingBike] = useState(true);
  const [pickupAt, setPickupAt] = useState(defaultPickup);
  const [returnAt, setReturnAt] = useState(() => defaultReturn(defaultPickup()));
  const [customerName, setCustomerName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [nicNo, setNicNo] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 25);
    d.setHours(12, 0, 0, 0);
    return d;
  });
  const [licenseNo, setLicenseNo] = useState('');
  const [quoting, setQuoting] = useState(false);

  const minPickup = useMemo(() => new Date(), []);
  const maxDob = useMemo(() => new Date(), []);
  const minDob = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 100);
    return d;
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const b = await fetchBikeDetail(bikeId);
        setBike(b);
      } catch (e) {
        Alert.alert('Error', e instanceof Error ? e.message : 'Could not load bike', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } finally {
        setLoadingBike(false);
      }
    }
    void load();
  }, [bikeId, navigation]);

  const canBook = bike ? canBookBikeRental(bike, profile?.id) : false;

  useEffect(() => {
    if (profile?.full_name && !customerName) setCustomerName(profile.full_name);
    if (profile?.phone && !phone) setPhone(profile.phone);
  }, [profile, customerName, phone]);

  function handlePickupChange(date: Date) {
    setPickupAt(date);
    if (returnAt <= date) {
      setReturnAt(defaultReturn(date));
    }
  }

  async function handleGetQuote() {
    if (!customerName.trim() || !phone.trim() || !nicNo.trim() || !licenseNo.trim()) {
      Alert.alert('Required', 'Enter your name, phone, NIC, date of birth, and driving licence.');
      return;
    }
    if (returnAt <= pickupAt) {
      Alert.alert('Invalid dates', 'Return must be after pickup.');
      return;
    }

    const identity = validateRentalIdentity({
      nicNo,
      licenseNo,
      dateOfBirth,
    });
    if (!identity.ok) {
      Alert.alert('Invalid details', identity.message);
      return;
    }

    setQuoting(true);
    try {
      const pickupIso = toIsoUtc(pickupAt);
      const returnIso = toIsoUtc(returnAt);
      const quote = await fetchRentalQuote(bikeId, pickupIso, returnIso);
      navigation.navigate('RentalQuote', {
        form: {
          bikeId,
          pickupAt: pickupIso,
          returnAt: returnIso,
          customerName: customerName.trim(),
          phone: phone.trim(),
          nicNo: identity.nicNo,
          dateOfBirth: identity.dateOfBirth,
          licenseNo: identity.licenseNo,
        },
        quote,
      });
    } catch (e) {
      Alert.alert('Quote failed', e instanceof Error ? e.message : 'Could not get rental quote');
    } finally {
      setQuoting(false);
    }
  }

  return (
    <SafeAreaView className={classes.screen}>
      <View className="px-4 py-2">
        <ScreenBackButton onPress={() => navigation.goBack()} />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
          <Text className={classes.titleLg}>Rent this bike</Text>
          {bike ? (
            <View className="mt-1">
              <Text className={classes.subtitle}>
                {bike.brand} {bike.name}
              </Text>
              {bike.rent_per_hour != null || bike.rent_per_day != null ? (
                <Text className={`${classes.bodySm} mt-1`}>
                  {bike.rent_per_hour != null ? `${formatLkr(bike.rent_per_hour)}/hr` : ''}
                  {bike.rent_per_hour != null && bike.rent_per_day != null ? ' · ' : ''}
                  {bike.rent_per_day != null ? `${formatLkr(bike.rent_per_day)}/day` : ''}
                </Text>
              ) : null}
              {bike && isBikeRentedOut(bike) ? (
                <RentalOutBadge
                  rentalStatus={bike.rental_status}
                  rentalReturnAt={bike.rental_return_at}
                  style={{ marginTop: 12 }}
                />
              ) : null}
            </View>
          ) : null}

          {loadingBike ? (
            <Text className={`${classes.body} mt-8`}>Loading…</Text>
          ) : (
            <View className="mt-6 pb-10">
              <DateTimeField
                label="Pickup date & time"
                value={pickupAt}
                onChange={handlePickupChange}
                minimumDate={minPickup}
              />
              <DateTimeField
                label="Return date & time"
                value={returnAt}
                onChange={setReturnAt}
                minimumDate={pickupAt}
              />

              <Field
                classes={classes}
                colors={colors}
                label="Your full name"
                value={customerName}
                onChangeText={setCustomerName}
              />
              <Field
                classes={classes}
                colors={colors}
                label="Phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
              <Field
                classes={classes}
                colors={colors}
                label="National Identity Card (NIC) number"
                value={nicNo}
                onChangeText={(t) => setNicNo(normalizeNic(t))}
                autoCapitalize="characters"
                placeholder="e.g. 123456789V or 199912345678"
              />
              <DateTimeField
                label="Date of birth (as on NIC)"
                value={dateOfBirth}
                onChange={setDateOfBirth}
                mode="date"
                minimumDate={minDob}
                maximumDate={maxDob}
              />
              <Field
                classes={classes}
                colors={colors}
                label="Driving licence number"
                value={licenseNo}
                onChangeText={setLicenseNo}
                autoCapitalize="characters"
                placeholder="e.g. B1234567"
              />

              <Text className={`${classes.bodySm} mb-4`}>
                NIC and licence use Sri Lankan format checks. Show your NIC, licence, and booking QR at pickup.
              </Text>

              <PrimaryButton
                label={canBook ? 'See price quote' : 'Bike not available to rent'}
                onPress={canBook ? handleGetQuote : undefined}
                loading={quoting}
                disabled={!canBook}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  placeholder,
  classes,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: 'default' | 'phone-pad';
  autoCapitalize?: 'none' | 'characters' | 'sentences';
  placeholder?: string;
  classes: { inputLabel: string; inputMb: string };
  colors: { placeholder: string };
}) {
  return (
    <View className="mb-1">
      <Text className={classes.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        className={classes.inputMb}
        placeholder={placeholder ?? label}
      />
    </View>
  );
}
