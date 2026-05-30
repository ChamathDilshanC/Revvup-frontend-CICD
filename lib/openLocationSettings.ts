import * as IntentLauncher from 'expo-intent-launcher';
import { Linking, Platform } from 'react-native';

/** Android: system Location settings. iOS: Privacy → Location Services (fallback: app settings). */
export async function openLocationSettings(): Promise<void> {
  if (Platform.OS === 'android') {
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS,
    );
    return;
  }

  if (Platform.OS === 'ios') {
    const candidates = [
      'App-Prefs:Privacy&path=LOCATION',
      'prefs:root=Privacy&path=LOCATION',
      'app-settings:',
    ];
    for (const url of candidates) {
      try {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
          return;
        }
      } catch {
        /* try next */
      }
    }
    await Linking.openSettings();
    return;
  }

  await Linking.openSettings();
}
