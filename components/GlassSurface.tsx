import { BlurView } from 'expo-blur';
import React, { type ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  borderRadius?: number;
};

export function GlassSurface({ children, style, intensity, borderRadius = 24 }: Props) {
  const { isDark } = useTheme();
  const blurIntensity = intensity ?? (isDark ? 42 : 55);
  const tint = isDark ? 'dark' : 'light';
  const overlay = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.62)';
  const borderColor = isDark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.9)';
  const highlight = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.35)';

  return (
    <View
      style={[
        styles.shell,
        {
          borderRadius,
          borderColor,
          ...Platform.select({
            ios: {
              shadowColor: isDark ? '#000' : '#64748B',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: isDark ? 0.45 : 0.12,
              shadowRadius: 24,
            },
            android: { elevation: isDark ? 6 : 3 },
            default: {},
          }),
        },
        style,
      ]}
    >
      <BlurView
        intensity={blurIntensity}
        tint={tint}
        experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius, backgroundColor: overlay },
        ]}
      />
      <View
        style={[
          styles.topHighlight,
          {
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
            backgroundColor: highlight,
          },
        ]}
        pointerEvents="none"
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: 'hidden',
    borderWidth: 1,
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
