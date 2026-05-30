import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { BikeDetailScreen } from '../screens/BikeDetailScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { ShowroomMapScreen } from '../screens/ShowroomMapScreen';

export type ExploreStackParamList = {
  ExploreHome: undefined;
  BikeDetail: { bikeId: string };
  ShowroomMap: {
    showroomName: string;
    showroomAddress?: string | null;
    latitude: number;
    longitude: number;
  };
};

const Stack = createNativeStackNavigator<ExploreStackParamList>();

export function ExploreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExploreHome" component={ExploreScreen} />
      <Stack.Screen name="BikeDetail" component={BikeDetailScreen} />
      <Stack.Screen name="ShowroomMap" component={ShowroomMapScreen} />
    </Stack.Navigator>
  );
}
