import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '../screens/owner/DashboardScreen';
import { ManageInventoryScreen } from '../screens/owner/ManageInventoryScreen';
import { AddEditBikeScreen } from '../screens/owner/AddEditBikeScreen';
import { ProfileScreen } from '../screens/client/ProfileScreen';

export type OwnerTabParamList = {
  Dashboard: undefined;
  Inventory: undefined;
  AddBike: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<OwnerTabParamList>();

export function OwnerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#141416',
          borderTopColor: '#2A2A2E',
        },
        tabBarActiveTintColor: '#E63946',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={ManageInventoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AddBike"
        component={AddEditBikeScreen}
        options={{
          title: 'Add',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
