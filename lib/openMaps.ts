import { Linking, Platform } from 'react-native';

/** Open native Maps app for directions to a showroom pin. */
export async function openInMaps(
  latitude: number,
  longitude: number,
  label?: string,
): Promise<void> {
  const name = encodeURIComponent(label ?? 'Showroom');
  const url =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?ll=${latitude},${longitude}&q=${name}`
      : `geo:${latitude},${longitude}?q=${latitude},${longitude}(${name})`;
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
    return;
  }
  await Linking.openURL(
    `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
  );
}
