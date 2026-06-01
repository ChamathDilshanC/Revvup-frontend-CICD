import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { AppImage } from './AppImage';

type Props = {
  uri: string;
  /** Used when variant is `banner` */
  height?: number;
  variant?: 'circle' | 'banner';
  /** Diameter for circle variant */
  size?: number;
  /** Transparent stage (for glass cards) */
  glass?: boolean;
};

export function BikeShowcaseImage({
  uri,
  height = 220,
  variant = 'circle',
  size = 200,
  glass = false,
}: Props) {
  const { colors, isDark } = useTheme();

  if (variant === 'circle') {
    return <BikeCircleImage uri={uri} size={size} colors={colors} glass={glass} isDark={isDark} />;
  }

  const gradientColors = isDark
    ? (['#1C1C22', '#0A0A0B', '#121218'] as const)
    : (['#F9FAFB', '#F2F2F7', '#E5E7EB'] as const);
  const fadeColors = isDark
    ? (['transparent', 'rgba(10,10,11,0.7)'] as const)
    : (['transparent', 'rgba(242,242,247,0.85)'] as const);

  return (
    <View style={[styles.bannerStage, { height, backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[...gradientColors]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      <AppImage source={{ uri }} style={styles.bannerImage} resizeMode="contain" />
      <LinearGradient colors={[...fadeColors]} style={styles.bottomFade} pointerEvents="none" />
    </View>
  );
}

function BikeCircleImage({
  uri,
  size,
  colors,
  glass,
  isDark,
}: {
  uri: string;
  size: number;
  colors: { background: string; surface: string; primary: string };
  glass: boolean;
  isDark: boolean;
}) {
  const circleStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const stageBg = glass ? 'transparent' : colors.background;
  const ringBg = glass
    ? isDark
      ? 'rgba(255,255,255,0.08)'
      : 'rgba(255,255,255,0.75)'
    : colors.surface;

  return (
    <View style={[styles.circleStage, { backgroundColor: stageBg }]}>
      <View
        style={[
          styles.circleRing,
          circleStyle,
          {
            borderColor: colors.primary,
            backgroundColor: ringBg,
            shadowColor: isDark ? '#000' : '#94A3B8',
            shadowOpacity: glass ? 0.25 : 0,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
            elevation: glass ? 4 : 0,
          },
        ]}
      >
        <AppImage source={{ uri }} style={styles.circleImage} resizeMode="cover" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circleStage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  circleRing: {
    borderWidth: 3,
    overflow: 'hidden',
  },
  circleImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  bannerStage: {
    width: '100%',
    overflow: 'hidden',
  },
  bannerImage: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 48,
  },
});
