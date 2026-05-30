import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ShowroomSettingsScreen } from '../screens/owner/ShowroomSettingsScreen';

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Settings: undefined;
  ShowroomSettings: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ShowroomSettings" component={ShowroomSettingsScreen} />
    </Stack.Navigator>
  );
}
