import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ExploreScreen } from '../screens/ExploreScreen';
import { CatalogScreen } from '../screens/CatalogScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export type RootTabParamList = {
  Explore: undefined;
  Catalog: undefined;
  Details: { bikeId?: string } | undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootTabs() {
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
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="compass-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Catalog"
        component={CatalogScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="bicycle-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Details"
        component={DetailsScreen}
        initialParams={{ bikeId: '1' }}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="information-circle-outline" size={size} color={color} />,
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
