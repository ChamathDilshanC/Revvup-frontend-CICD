import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';
import { openLocationSettings } from './openLocationSettings';

/** Ask for foreground location; if denied, offer to open location settings. */
export async function requestLocationWithSettingsPrompt(): Promise<boolean> {
  const current = await Location.getForegroundPermissionsAsync();

  if (current.status === 'granted') {
    return true;
  }

  if (current.status === 'undetermined') {
    const requested = await Location.requestForegroundPermissionsAsync();
    if (requested.status === 'granted') {
      return true;
    }
    if (requested.status === 'undetermined') {
      return false;
    }
    showLocationDeniedAlert();
    return false;
  }

  showLocationDeniedAlert();
  return false;
}

function showLocationDeniedAlert() {
  const message =
    Platform.OS === 'ios'
      ? 'Turn on Location Services under Privacy & Security, then set RevvUp to "While Using the App".'
      : 'Turn on Location in your device settings, then allow location for RevvUp if asked.';

  Alert.alert('Location access needed', message, [
    { text: 'Not now', style: 'cancel' },
    {
      text: 'Open Settings',
      onPress: () => {
        void openLocationSettings();
      },
    },
  ]);
}
