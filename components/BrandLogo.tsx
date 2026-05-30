import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { APP_LOGO } from '../constants/images';

/** Auth header logo — left-aligned with titles (expo-image contentPosition). */
export function BrandLogo() {
  return (
    <View style={styles.clip}>
      <Image
        source={APP_LOGO}
        style={styles.image}
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
  },
  image: {
    width: 176,
    height: 50,
  },
});
