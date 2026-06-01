import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/** Soft mesh gradient behind Explore (liquid-glass depth). */
export function ExploreMeshBackground() {
  const { isDark, colors } = useTheme();

  if (isDark) {
    return (
      <View
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]}
        pointerEvents="none"
      />
    );
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
      <LinearGradient
        colors={['rgba(230,57,70,0.12)', 'rgba(255,255,255,0)', 'rgba(241,245,249,1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(242,242,247,0.4)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.blob, { top: '40%', height: '50%', opacity: 0.8 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTopLeft: {
    top: -80,
    left: -60,
    width: 280,
    height: 280,
  },
  blobCenter: {
    top: '28%',
    right: -40,
    width: 220,
    height: 220,
  },
  blobBottomRight: {
    bottom: -60,
    right: -30,
    width: 260,
    height: 260,
  },
});
