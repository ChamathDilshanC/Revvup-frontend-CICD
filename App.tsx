import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { CatalogScreen } from './screens/CatalogScreen';

/**
 * Root entry — wire React Navigation / Expo Router for Explore, Catalog, Details, Profile tabs.
 */
export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <CatalogScreen />
    </>
  );
}
