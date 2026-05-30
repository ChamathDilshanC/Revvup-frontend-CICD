import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppImage } from '../components/AppImage';
import { PrimaryButton } from '../components/PrimaryButton';
import { AuthFooter } from '../components/AuthFooter';
import { AUTH_HERO_IMAGE, APP_LOGO } from '../constants/images';

type WelcomeScreenProps = {
  onContinue: () => void;
};

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  return (
    <View style={styles.root}>
      <AppImage source={AUTH_HERO_IMAGE} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <LinearGradient
        colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.75)', '#000000']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <AppImage source={APP_LOGO} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Welcome to RevvUp</Text>
          <Text style={styles.subtitle}>
            Sri Lanka&apos;s premium motorbike marketplace — discover superbikes, compare specs, and
            connect with verified showroom owners.
          </Text>

          <View style={styles.features}>
            {['Curated premium catalog', 'Verified showroom listings', 'Secure owner accounts'].map(
              (item) => (
                <Text key={item} style={styles.feature}>
                  ◆ {item}
                </Text>
              ),
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButton label="Continue" onPress={onContinue} />
          <AuthFooter />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  safe: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 88,
    alignSelf: 'center',
    marginBottom: 28,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 28,
  },
  features: {
    gap: 10,
    paddingHorizontal: 8,
  },
  feature: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    gap: 16,
  },
});
