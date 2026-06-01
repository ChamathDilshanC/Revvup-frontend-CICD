import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';
import { inferProvinceFromGeocode, type SriLankaProvince } from './sriLankaProvinces';

export async function detectProvinceFromDeviceLocation(): Promise<SriLankaProvince | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Location permission',
      'Allow location access to find showrooms in your province, or pick a province manually.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open settings',
          onPress: () => void Linking.openSettings(),
        },
      ],
    );
    return null;
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const results = await Location.reverseGeocodeAsync({
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  });

  const place = results[0];
  if (!place) {
    Alert.alert(
      'Could not detect area',
      Platform.OS === 'web'
        ? 'Pick your province from the list below.'
        : 'We could not determine your province. Please select one manually.',
    );
    return null;
  }

  const province = inferProvinceFromGeocode([
    place.region,
    place.subregion,
    place.city,
    place.district,
    place.name,
    place.street,
  ]);

  if (!province) {
    Alert.alert(
      'Province not recognized',
      'Your location is outside our Sri Lanka province map, or geocoding was unclear. Please pick a province from the list.',
    );
  }

  return province;
}
