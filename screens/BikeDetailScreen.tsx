import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AvailabilityBadge } from '../components/AvailabilityBadge';
import { BikeShowcaseImage } from '../components/BikeShowcaseImage';
import { PrimaryButton } from '../components/PrimaryButton';
import { ShowroomMap } from '../components/ShowroomMap';
import { hasMapCoordinates } from '../constants/map';
import { useAuth } from '../context/AuthContext';
import { RentalOutBadge } from '../components/RentalOutBadge';
import { getBikeProvince } from '../lib/bikeProvince';
import { bikeImageUrl, canBookBikeRental, isBikeAvailable, isBikeRentedOut } from '../lib/bikes';
import { formatLkr } from '../lib/rentalFormat';
import { dialShowroomPhone, openDirectionsToShowroom, showShowroomContactAlert } from '../lib/showroomContact';
import { formatPhoneDisplay } from '../lib/phone';
import type { BikeFlowParamList } from '../navigation/bikeFlowParams';
import { ScreenBackButton } from '../components/ScreenBackButton';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { fetchBikeDetail } from '../services/bikes';
import type { BikeDetail } from '../types/bike';

type Props = NativeStackScreenProps<BikeFlowParamList, 'BikeDetail'>;

export function BikeDetailScreen({ navigation, route }: Props) {
  const { bikeId } = route.params;
  const { classes } = useTheme();
  const { formatPrice } = useCurrency();
  const { profile } = useAuth();
  const [bike, setBike] = useState<BikeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const data = await fetchBikeDetail(bikeId);
      setBike(data);
    } catch (e) {
      if (!silent) setError(e instanceof Error ? e.message : 'Could not load bike');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [bikeId]);

  useFocusEffect(
    useCallback(() => {
      void load();
      const id = setInterval(() => void load(true), 20000);
      return () => clearInterval(id);
    }, [load]),
  );

  const canRent = bike ? canBookBikeRental(bike, profile?.id) : false;
  const province = bike ? getBikeProvince(bike) : null;

  return (
    <SafeAreaView className={classes.screen}>
      <View className="px-4 py-2">
        <ScreenBackButton onPress={() => navigation.goBack()} />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#E63946" size="large" />
        </View>
      ) : error || !bike ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className={classes.bodyCenter}>{error ?? 'Bike not found'}</Text>
        </View>
      ) : (
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
          <BikeShowcaseImage uri={bikeImageUrl(bike.image_url)} variant="circle" size={240} />
          <View className="px-4 pt-5">
            <View className="mb-3 flex-row flex-wrap gap-2">
              <AvailabilityBadge isAvailable={isBikeAvailable(bike)} compact />
              {isBikeRentedOut(bike) ? (
                <RentalOutBadge
                  rentalStatus={bike.rental_status}
                  rentalReturnAt={bike.rental_return_at}
                  compact
                />
              ) : null}
            </View>
            <Text className="text-xs uppercase tracking-widest text-[#E63946]">{bike.brand}</Text>
            <Text className={classes.titleXl}>{bike.name}</Text>
            <Text className="mt-2 text-2xl font-bold text-[#E63946]">{formatPrice(bike.price)}</Text>

            <View className={`${classes.card} mt-6 p-4`}>
              <Text className={classes.sectionLabelMb3}>Showroom</Text>
              <Text className={classes.textBoldLg}>
                {bike.showroom_name ?? 'Verified dealer'}
              </Text>
              {province ? (
                <Text className={`${classes.bodySm} mt-1`}>{province} Province</Text>
              ) : null}
              {bike.showroom_address ? (
                <Text className={`${classes.bodySm} mt-1`}>{bike.showroom_address}</Text>
              ) : null}
              {bike.showroom_phone?.trim() ? (
                <Pressable
                  className="mt-3 flex-row items-center gap-2"
                  onPress={() => void dialShowroomPhone(bike.showroom_phone!)}
                >
                  <Text className="text-sm font-semibold text-[#E63946]">
                    {formatPhoneDisplay(bike.showroom_phone)}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">· Tap to call</Text>
                </Pressable>
              ) : (
                <Text className={`${classes.bodySm} mt-2`}>Phone not listed</Text>
              )}
              {hasMapCoordinates(bike.showroom_latitude, bike.showroom_longitude) ? (
                <View className="mt-4">
                  <ShowroomMap
                    latitude={bike.showroom_latitude}
                    longitude={bike.showroom_longitude}
                    title={bike.showroom_name ?? undefined}
                    height={180}
                  />
                </View>
              ) : null}
            </View>

            <View className={`${classes.card} mt-4 p-4`}>
              <Text className={classes.sectionLabelMb3}>Full specifications</Text>
              <SpecRow classes={classes} label="Year" value={bike.year != null ? String(bike.year) : '—'} />
              <SpecRow classes={classes} label="Top speed" value={bike.top_speed_mph != null ? `${bike.top_speed_mph} mph` : '—'} />
              <SpecRow classes={classes} label="Weight" value={bike.weight_lbs != null ? `${bike.weight_lbs} lbs` : '—'} />
              <SpecRow classes={classes} label="Engine" value={bike.engine_cc != null ? `${bike.engine_cc} cc` : '—'} />
              <SpecRow classes={classes} label="Horsepower" value={bike.horsepower != null ? `${bike.horsepower} hp` : '—'} />
            </View>

            {bike.is_rentable ? (
              <View className={`${classes.card} mt-4 p-4`}>
                <Text className={classes.sectionLabelMb3}>Rent this bike</Text>
                {bike.rent_per_hour != null || bike.rent_per_day != null ? (
                  <Text className={classes.bodySm}>
                    {bike.rent_per_hour != null ? `${formatLkr(bike.rent_per_hour)} per hour` : ''}
                    {bike.rent_per_hour != null && bike.rent_per_day != null ? ' · ' : ''}
                    {bike.rent_per_day != null ? `${formatLkr(bike.rent_per_day)} per day` : ''}
                    {bike.security_deposit != null
                      ? `\nDeposit: ${formatLkr(bike.security_deposit)}`
                      : ''}
                  </Text>
                ) : (
                  <Text className={classes.bodySm}>Hourly or daily rates apply at checkout.</Text>
                )}
              </View>
            ) : null}

            <View className="mt-8 gap-3">
              {bike.is_rentable && isBikeAvailable(bike) && profile?.id !== bike.owner_id ? (
                canRent ? (
                  <PrimaryButton
                    label="Rent this bike"
                    onPress={() => navigation.navigate('RentalBooking', { bikeId: bike.id })}
                  />
                ) : isBikeRentedOut(bike) ? (
                  <PrimaryButton
                    label="Currently rented out"
                    disabled
                    onPress={undefined}
                  />
                ) : null
              ) : null}
              {hasMapCoordinates(bike.showroom_latitude, bike.showroom_longitude) ? (
                <PrimaryButton
                  label="Directions to showroom"
                  onPress={() =>
                    void openDirectionsToShowroom(
                      bike.showroom_latitude!,
                      bike.showroom_longitude!,
                      bike.showroom_name ?? undefined,
                    )
                  }
                />
              ) : null}
              <PrimaryButton
                label="Contact showroom"
                onPress={() =>
                  showShowroomContactAlert({
                    name: bike.showroom_name,
                    phone: bike.showroom_phone,
                    address: bike.showroom_address,
                    latitude: bike.showroom_latitude,
                    longitude: bike.showroom_longitude,
                  })
                }
                variant="outline"
              />
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function SpecRow({
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
