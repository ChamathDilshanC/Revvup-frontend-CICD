import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { formatElapsedSeconds, formatRemainingSeconds } from '../lib/rentalTimer';

type Props = {
  rentStartedAt: string | null | undefined;
  isLive: boolean;
  elapsedSeconds?: number;
  remainingSeconds?: number | null;
  overtimeSeconds?: number;
  large?: boolean;
};

export function RentalLiveTimer({
  rentStartedAt,
  isLive,
  elapsedSeconds: initialElapsed = 0,
  remainingSeconds,
  overtimeSeconds = 0,
  large,
}: Props) {
  const { classes, colors } = useTheme();
  const [elapsed, setElapsed] = useState(initialElapsed);

  useEffect(() => {
    setElapsed(initialElapsed);
  }, [initialElapsed]);

  useEffect(() => {
    if (!isLive || !rentStartedAt) return;
    const startMs = new Date(rentStartedAt).getTime();
    if (Number.isNaN(startMs)) return;

    const tick = () => {
      setElapsed(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isLive, rentStartedAt]);

  if (!isLive && elapsed <= 0) {
    return null;
  }

  const remainingLabel =
    remainingSeconds != null
      ? formatRemainingSeconds(remainingSeconds)
      : null;

  return (
    <View className={`${classes.card} items-center p-5`}>
      <Text className={classes.bodyXs} style={{ letterSpacing: 2, color: colors.textSecondary }}>
        {isLive ? 'RENTING NOW' : 'TOTAL RENT TIME'}
      </Text>
      <Text
        className="mt-2 font-bold text-[#E63946]"
        style={{ fontSize: large ? 48 : 36, fontVariant: ['tabular-nums'] }}
      >
        {formatElapsedSeconds(elapsed)}
      </Text>
      {isLive && remainingLabel ? (
        <Text className={`${classes.bodySm} mt-2`}>
          {overtimeSeconds > 0
            ? `Over scheduled return by ${formatElapsedSeconds(overtimeSeconds)}`
            : `Until return: ${remainingLabel}`}
        </Text>
      ) : null}
    </View>
  );
}
