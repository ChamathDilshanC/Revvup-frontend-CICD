import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { OwnerRentalDetailScreen } from '../screens/owner/OwnerRentalDetailScreen';
import { OwnerRentalsScreen } from '../screens/owner/OwnerRentalsScreen';
import { OwnerScanBookingScreen } from '../screens/owner/OwnerScanBookingScreen';

export type OwnerRentalsStackParamList = {
  OwnerRentalsHome: undefined;
  OwnerRentalDetail: { bookingId: string };
  OwnerScanBooking: undefined;
};

const Stack = createNativeStackNavigator<OwnerRentalsStackParamList>();

export function OwnerRentalsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OwnerRentalsHome" component={OwnerRentalsScreen} />
      <Stack.Screen name="OwnerRentalDetail" component={OwnerRentalDetailScreen} />
      <Stack.Screen name="OwnerScanBooking" component={OwnerScanBookingScreen} />
    </Stack.Navigator>
  );
}
