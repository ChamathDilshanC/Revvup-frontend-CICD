import './global.css';
import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer, DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppSplash } from './components/AppSplash';
import { preloadAuthAssets } from './lib/preloadAssets';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { RootNavigator } from './navigation/RootNavigator';

SplashScreen.preventAutoHideAsync();

function buildNavTheme(isDark: boolean): Theme {
  const base = isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: '#E63946',
      background: isDark ? '#0A0A0B' : '#F2F2F7',
      card: isDark ? '#141416' : '#FFFFFF',
      text: isDark ? '#F5F5F7' : '#111827',
      border: isDark ? '#2A2A2E' : '#E5E7EB',
    },
  };
}

function AppNavigation() {
  const { isDark, ready } = useTheme();
  const navTheme = buildNavTheme(isDark);

  if (!ready) {
    return (
      <>
        <StatusBar style="light" />
        <AppSplash />
      </>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await preloadAuthAssets();
      await SplashScreen.hideAsync();
      setAppReady(true);
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return (
      <>
        <StatusBar style="light" />
        <AppSplash />
      </>
    );
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <ThemeProvider>
        <CurrencyProvider>
          <AuthProvider>
            <AppNavigation />
          </AuthProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
