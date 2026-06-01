import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { BikeDetailScreen } from '../screens/BikeDetailScreen';
import { RentScreen } from '../screens/RentScreen';
import { RentalBookingScreen } from '../screens/rental/RentalBookingScreen';
import { RentalQuoteScreen } from '../screens/rental/RentalQuoteScreen';
import { RentalSuccessScreen } from '../screens/rental/RentalSuccessScreen';
import { ShowroomMapScreen } from '../screens/ShowroomMapScreen';
import type { BikeFlowParamList } from './bikeFlowParams';

export type RentStackParamList = {
  RentHome: undefined;
} & BikeFlowParamList;

const Stack = createNativeStackNavigator<RentStackParamList>();

export function RentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RentHome" component={RentScreen} />
      <Stack.Screen name="BikeDetail" component={BikeDetailScreen} />
      <Stack.Screen name="RentalBooking" component={RentalBookingScreen} />
      <Stack.Screen name="RentalQuote" component={RentalQuoteScreen} />
      <Stack.Screen name="RentalSuccess" component={RentalSuccessScreen} />
      <Stack.Screen name="ShowroomMap" component={ShowroomMapScreen} />
    </Stack.Navigator>
  );
}
