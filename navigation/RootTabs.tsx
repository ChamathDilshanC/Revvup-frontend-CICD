import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ExploreStack } from './ExploreStack';
import { ManageStack } from './ManageStack';
import { ProfileStack } from './ProfileStack';
import { ClientRentalsStack } from './ClientRentalsStack';
import { OwnerRentalsStack } from './OwnerRentalsStack';
import { RentStack } from './RentStack';

export type RootTabParamList = {
  Explore: undefined;
  Rent: undefined;
  MyRentals: undefined;
  OwnerRentals: undefined;
  Manage: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootTabs() {
  const { isOwner, isClient } = useAuth();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
      }}
    >
      {isOwner ? (
        <Tab.Screen
          name="Manage"
          component={ManageStack}
          options={{
            title: 'My bikes',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="construct-outline" size={size} color={color} />
            ),
          }}
        />
      ) : null}
      {isOwner ? (
        <Tab.Screen
          name="OwnerRentals"
          component={OwnerRentalsStack}
          options={{
            title: 'Rentals',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="clipboard-outline" size={size} color={color} />
            ),
          }}
        />
      ) : null}
      <Tab.Screen
        name="Explore"
        component={ExploreStack}
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Ionicons name="compass-outline" size={size} color={color} />,
        }}
      />
      {isClient ? (
        <Tab.Screen
          name="Rent"
          component={RentStack}
          options={{
            title: 'Rent',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bicycle-outline" size={size} color={color} />
            ),
          }}
        />
      ) : null}
      {isClient ? (
        <Tab.Screen
          name="MyRentals"
          component={ClientRentalsStack}
          options={{
            title: 'My rentals',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="time-outline" size={size} color={color} />
            ),
          }}
        />
      ) : null}
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
