import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { BikeDetailScreen } from '../screens/BikeDetailScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { RentalBookingScreen } from '../screens/rental/RentalBookingScreen';
import { RentalQuoteScreen } from '../screens/rental/RentalQuoteScreen';
import { RentalSuccessScreen } from '../screens/rental/RentalSuccessScreen';
import { ShowroomMapScreen } from '../screens/ShowroomMapScreen';
import type { BikeFlowParamList } from './bikeFlowParams';

export type ExploreStackParamList = {
  ExploreHome: undefined;
} & BikeFlowParamList;

const Stack = createNativeStackNavigator<ExploreStackParamList>();

export function ExploreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExploreHome" component={ExploreScreen} />
      <Stack.Screen name="BikeDetail" component={BikeDetailScreen} />
      <Stack.Screen name="RentalBooking" component={RentalBookingScreen} />
      <Stack.Screen name="RentalQuote" component={RentalQuoteScreen} />
      <Stack.Screen name="RentalSuccess" component={RentalSuccessScreen} />
      <Stack.Screen name="ShowroomMap" component={ShowroomMapScreen} />
    </Stack.Navigator>
  );
}
