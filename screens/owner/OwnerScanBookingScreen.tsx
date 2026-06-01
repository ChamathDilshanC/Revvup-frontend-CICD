import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useCallback, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ScreenBackButton } from '../../components/ScreenBackButton';
import { parseBookingIdFromQr } from '../../lib/parseBookingQr';
import type { OwnerRentalsStackParamList } from '../../navigation/OwnerRentalsStack';
import { useTheme } from '../../context/ThemeContext';

type Props = NativeStackScreenProps<OwnerRentalsStackParamList, 'OwnerScanBooking'>;

export function OwnerScanBookingScreen({ navigation }: Props) {
  const { classes } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const onBarcode = useCallback(
    ({ data }: { data: string }) => {
      if (scanned) return;
      const bookingId = parseBookingIdFromQr(data);
      if (!bookingId) {
        Alert.alert('Invalid QR', 'This is not a RevvUp rental booking code.');
        return;
      }
      setScanned(true);
      navigation.replace('OwnerRentalDetail', { bookingId });
    },
    [navigation, scanned],
  );

  if (!permission) {
    return (
      <SafeAreaView className={`${classes.screen} flex-1 items-center justify-center px-6`}>
        <Text className={classes.bodyCenter}>Checking camera…</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className={`${classes.screen} flex-1 px-4`}>
        <ScreenBackButton onPress={() => navigation.goBack()} />
        <View className="flex-1 items-center justify-center">
          <Text className={`${classes.bodyCenter} mb-6`}>
            Camera access is needed to scan the client&apos;s booking QR at pickup.
          </Text>
          <PrimaryButton label="Allow camera" onPress={() => void requestPermission()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : onBarcode}
      />
      <SafeAreaView className="absolute left-0 right-0 top-0 px-4 py-2">
        <ScreenBackButton onPress={() => navigation.goBack()} />
      </SafeAreaView>
      <View className="absolute bottom-0 left-0 right-0 bg-black/70 px-6 pb-10 pt-4">
        <Text className="text-center text-base font-semibold text-white">
          Scan the client&apos;s booking QR
        </Text>
        <Text className="mt-2 text-center text-sm text-white/80">
          Then confirm pickup on the next screen
        </Text>
      </View>
    </View>
  );
}
