import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export async function saveQrBase64ToPhotos(
  base64: string,
  bookingId: string,
): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Photos access',
      'Allow RevvUp to save your booking QR code to your photo library.',
    );
    return false;
  }

  try {
    const safeId = bookingId.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 36);
    const file = new File(Paths.cache, `revvup-qr-${safeId}.png`);
    file.write(base64, { encoding: 'base64' });
    await MediaLibrary.saveToLibraryAsync(file.uri);
    Alert.alert('Saved', 'QR code saved to your photos.');
    return true;
  } catch (e) {
    Alert.alert('Could not save', e instanceof Error ? e.message : 'Try again.');
    return false;
  }
}
