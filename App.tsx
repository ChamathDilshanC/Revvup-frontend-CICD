import './global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootTabs } from './navigation/RootTabs';

const revvupTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#E63946',
    background: '#0A0A0B',
    card: '#141416',
    text: '#F5F5F7',
    border: '#2A2A2E',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={revvupTheme}>
        <StatusBar style="light" />
        <RootTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
