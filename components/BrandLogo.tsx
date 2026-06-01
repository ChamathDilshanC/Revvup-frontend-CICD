import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { APP_LOGO } from '../constants/images';

const LOGO_ON_DARK = '#F5F5F7';

/** Auth header logo — left-aligned with titles (expo-image contentPosition). */
export function BrandLogo() {
  return (
    <View style={styles.clip}>
      <Image
        source={APP_LOGO}
        style={styles.image}
        tintColor={LOGO_ON_DARK}
        contentFit="contain"
        contentPosition="left center"
        transition={0}
        accessibilityLabel="RevvUp"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    width: '100%',
    height: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  image: {
    width: 176,
    height: 50,
  },
});
