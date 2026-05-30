import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { BikeDetailScreen } from '../screens/BikeDetailScreen';
import { ExploreScreen } from '../screens/ExploreScreen';

export type ExploreStackParamList = {
  ExploreHome: undefined;
  BikeDetail: { bikeId: string };
};

const Stack = createNativeStackNavigator<ExploreStackParamList>();

export function ExploreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExploreHome" component={ExploreScreen} />
      <Stack.Screen name="BikeDetail" component={BikeDetailScreen} />
    </Stack.Navigator>
  );
}
