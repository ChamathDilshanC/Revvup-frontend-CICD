import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppImage } from './AppImage';
import { APP_LOGO } from '../constants/images';

/** Full-screen splash — logo only, no extra title text. */
export function AppSplash() {
  return (
    <View style={styles.container}>
      <AppImage
        source={APP_LOGO}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="RevvUp logo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 288,
    height: 128,
  },
});
