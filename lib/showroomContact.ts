import { Alert, Linking, Platform } from 'react-native';
import { hasMapCoordinates } from '../constants/map';
import { formatPhoneDisplay, phoneForDialUri } from './phone';

export type ShowroomContact = {
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export async function dialShowroomPhone(phone: string): Promise<void> {
  const dial = phoneForDialUri(phone);
  if (!dial) {
    Alert.alert('Invalid number', 'This showroom phone number cannot be dialed.');
    return;
  }

  // iOS: telprompt shows the number on the keypad before calling.
  // Android: tel opens the dialer with the number filled in.
  const urls =
    Platform.OS === 'ios'
      ? [`telprompt:${dial}`, `tel:${dial}`]
      : [`tel:${dial}`];

  for (const url of urls) {
    try {
      await Linking.openURL(url);
      return;
    } catch {
      /* try next scheme */
    }
  }

  Alert.alert('Cannot call', 'Could not open the phone app. Check that a number is saved for this showroom.');
}

/** Opens Maps with driving directions from the user's current location. */
export async function openDirectionsToShowroom(
  latitude: number,
  longitude: number,
  label?: string,
): Promise<void> {
  const dest = `${latitude},${longitude}`;
  const name = encodeURIComponent(label ?? 'Showroom');
  const url =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?saddr=Current%20Location&daddr=${dest}&dirflg=d`
      : `https://www.google.com/maps/dir/?api=1&origin=my+location&destination=${dest}&travelmode=driving`;

  try {
    await Linking.openURL(url);
    return;
  } catch {
    /* fallback */
  }

  try {
    await Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&origin=my+location&destination=${dest}`,
    );
  } catch {
    Alert.alert('Maps unavailable', 'Could not open directions in Maps.');
  }
}

export function showShowroomContactAlert(contact: ShowroomContact): void {
  const name = contact.name?.trim() || 'Showroom';
  const phoneRaw = contact.phone?.trim();
  const phone = phoneRaw ? formatPhoneDisplay(phoneRaw) : null;
  const address = contact.address?.trim();
  const hasCoords = hasMapCoordinates(contact.latitude, contact.longitude);

  if (!phone && !address && !hasCoords) {
    Alert.alert(
      name,
      'No phone or location is listed yet. The owner can add these under Profile → Showroom settings.',
    );
    return;
  }

  const lines: string[] = [];
  if (phone) {
    lines.push(`Phone\n${phone}`);
  } else {
    lines.push('Phone\nNot listed');
  }
  if (address) {
    lines.push(`\nLocation\n${address}`);
  } else if (hasCoords) {
    lines.push('\nLocation\nPinned on map (use Directions)');
  }

  const buttons: {
    text: string;
    style?: 'cancel' | 'default' | 'destructive';
    onPress?: () => void;
  }[] = [];

  if (phone) {
    buttons.push({
      text: `Call ${phone}`,
      onPress: () => {
        void dialShowroomPhone(phone);
      },
    });
  }
  if (hasCoords) {
    buttons.push({
      text: 'Directions',
      onPress: () => {
        void openDirectionsToShowroom(
          contact.latitude!,
          contact.longitude!,
          name,
        );
      },
    });
  }
  buttons.push({ text: 'Close', style: 'cancel' });

  Alert.alert(name, lines.join(''), buttons);
}
