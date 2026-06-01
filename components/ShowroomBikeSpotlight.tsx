import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { SHOWROOM_BIKE_ROTATE_MS } from '../lib/currency';
import { bikeImageUrl, isBikeAvailable } from '../lib/bikes';
import { useTheme } from '../context/ThemeContext';
import { fetchBikeDetail } from '../services/bikes';
import type { BikeSummary } from '../types/bike';
import { ExploreBikeCard } from './ExploreBikeCard';

function needsSpecFetch(bike: BikeSummary): boolean {
  return bike.weight_lbs == null || bike.engine_cc == null;
}

function pickRandomIndex(length: number, current: number): number {
  if (length <= 1) return 0;
  let next = Math.floor(Math.random() * length);
  while (next === current) {
    next = Math.floor(Math.random() * length);
  }
  return next;
}

type Props = {
  bikes: BikeSummary[];
  onPress: (bikeId: string) => void;
};

export function ShowroomBikeSpotlight({ bikes, onPress }: Props) {
  const { classes } = useTheme();
  const bikeIds = useMemo(() => bikes.map((b) => b.id).join(','), [bikes]);
  const [index, setIndex] = useState(0);
  const [specsById, setSpecsById] = useState<
    Record<string, { weight_lbs: number | null; engine_cc: number | null }>
  >({});
  const fetchedSpecsRef = useRef(new Set<string>());

  useEffect(() => {
    setIndex(bikes.length > 1 ? Math.floor(Math.random() * bikes.length) : 0);
    fetchedSpecsRef.current.clear();
    setSpecsById({});
  }, [bikeIds, bikes.length]);

  useEffect(() => {
    if (bikes.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => pickRandomIndex(bikes.length, prev));
    }, SHOWROOM_BIKE_ROTATE_MS);
    return () => clearInterval(timer);
  }, [bikes.length, bikeIds]);

  const bike = bikes[index];

  useEffect(() => {
    if (!bike || !needsSpecFetch(bike) || fetchedSpecsRef.current.has(bike.id)) return;
    fetchedSpecsRef.current.add(bike.id);
    let cancelled = false;
    void fetchBikeDetail(bike.id)
      .then((detail) => {
        if (cancelled) return;
        setSpecsById((prev) => ({
          ...prev,
          [bike.id]: {
            weight_lbs: detail.weight_lbs,
            engine_cc: detail.engine_cc,
          },
        }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [bike?.id, bike?.weight_lbs, bike?.engine_cc]);

  if (!bike) return null;

  const extra = specsById[bike.id];
  const weightLbs = bike.weight_lbs ?? extra?.weight_lbs ?? null;
  const engineCc = bike.engine_cc ?? extra?.engine_cc ?? null;

  return (
    <View>
      <ExploreBikeCard
        id={bike.id}
        name={bike.name}
        brand={bike.brand}
        priceUsd={bike.price}
        imageUrl={bikeImageUrl(bike.image_url)}
        topSpeedMph={bike.top_speed_mph}
        weightLbs={weightLbs}
        engineCc={engineCc}
        isAvailable={isBikeAvailable(bike)}
        onPress={onPress}
      />
      {bikes.length > 1 ? (
        <View className="mt-2 flex-row items-center justify-between px-1">
          <View className="flex-row gap-1.5">
            {bikes.map((b, i) => (
              <View
                key={b.id}
                className={`h-1.5 rounded-full ${i === index ? 'w-5 bg-[#E63946]' : 'w-1.5 bg-gray-400 dark:bg-gray-600'}`}
              />
            ))}
          </View>
          <Text className={classes.bodyXs}>
            {index + 1} of {bikes.length} · changes every 15s
          </Text>
        </View>
      ) : null}
    </View>
  );
}
