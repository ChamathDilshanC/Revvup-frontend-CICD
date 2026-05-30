import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppImage } from '../components/AppImage';
import { PrimaryButton } from '../components/PrimaryButton';
import { ShowroomMap } from '../components/ShowroomMap';
import { hasMapCoordinates } from '../constants/map';
import { bikeImageUrl } from '../lib/bikes';
import { openInMaps } from '../lib/openMaps';
import type { ExploreStackParamList } from '../navigation/ExploreStack';
import { ScreenBackButton } from '../components/ScreenBackButton';
import { useTheme } from '../context/ThemeContext';
import { fetchBikeDetail } from '../services/bikes';
import type { BikeDetail } from '../types/bike';

type Props = NativeStackScreenProps<ExploreStackParamList, 'BikeDetail'>;

export function BikeDetailScreen({ navigation, route }: Props) {
  const { bikeId } = route.params;
  const { classes } = useTheme();
  const [bike, setBike] = useState<BikeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBikeDetail(bikeId);
        setBike(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load bike');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [bikeId]);

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
          <AppImage
            source={{ uri: bikeImageUrl(bike.image_url) }}
            className="h-56 w-full"
            resizeMode="cover"
          />
          <View className="px-4 pt-5">
            <Text className="text-xs uppercase tracking-widest text-[#E63946]">{bike.brand}</Text>
            <Text className={classes.titleXl}>{bike.name}</Text>
            <Text className="mt-2 text-2xl font-bold text-[#E63946]">${bike.price.toLocaleString()}</Text>

            <View className={`${classes.card} mt-6 p-4`}>
              <Text className={classes.sectionLabelMb3}>Showroom</Text>
              <Text className={classes.textBoldLg}>
                {bike.showroom_name ?? 'Verified dealer'}
              </Text>
              {bike.showroom_address ? (
                <Text className={`${classes.bodySm} mt-1`}>{bike.showroom_address}</Text>
              ) : null}
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

            <View className="mt-8 gap-3">
              {hasMapCoordinates(bike.showroom_latitude, bike.showroom_longitude) ? (
                <PrimaryButton
                  label="Open showroom in Maps"
                  onPress={() =>
                    openInMaps(
                      bike.showroom_latitude!,
                      bike.showroom_longitude!,
                      bike.showroom_name ?? undefined,
                    )
                  }
                />
              ) : null}
              <PrimaryButton label="Contact showroom" onPress={() => {}} variant="outline" />
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
