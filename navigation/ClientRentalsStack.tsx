import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ClientRentalDetailScreen } from '../screens/rental/ClientRentalDetailScreen';
import { ClientRentalsScreen } from '../screens/rental/ClientRentalsScreen';

export type ClientRentalsStackParamList = {
  MyRentalsHome: undefined;
  MyRentalDetail: { bookingId: string };
};

const Stack = createNativeStackNavigator<ClientRentalsStackParamList>();

export function ClientRentalsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyRentalsHome" component={ClientRentalsScreen} />
      <Stack.Screen name="MyRentalDetail" component={ClientRentalDetailScreen} />
    </Stack.Navigator>
  );
}
