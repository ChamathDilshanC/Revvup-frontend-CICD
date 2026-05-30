import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ExploreStack } from './ExploreStack';
import { ManageStack } from './ManageStack';
import { ProfileScreen } from '../screens/ProfileScreen';

export type RootTabParamList = {
  Explore: undefined;
  Manage: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

type RootTabsProps = {
  onSignedOut?: () => void;
};

export function RootTabs({ onSignedOut }: RootTabsProps) {
  const { isOwner } = useAuth();

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
      <Tab.Screen
        name="Explore"
        component={ExploreStack}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="compass-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      >
        {() => <ProfileScreen onSignedOut={onSignedOut} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
