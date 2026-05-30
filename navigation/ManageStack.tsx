import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { BikeFormScreen } from '../screens/owner/BikeFormScreen';
import { ManageBikesScreen } from '../screens/owner/ManageBikesScreen';

export type ManageStackParamList = {
  ManageList: undefined;
  BikeForm: { bikeId?: string };
};

const Stack = createNativeStackNavigator<ManageStackParamList>();

export function ManageStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ManageList" component={ManageBikesScreen} />
      <Stack.Screen name="BikeForm" component={BikeFormScreen} />
    </Stack.Navigator>
  );
}
