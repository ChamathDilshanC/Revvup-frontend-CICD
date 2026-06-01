import React, { useCallback, useEffect, useState } from 'react';
import { AppSplash } from '../components/AppSplash';
import { useAuth } from '../context/AuthContext';
import { isTokenExpired } from '../lib/jwt';
import { getAccessToken, getHasSeenWelcome, setHasSeenWelcome } from '../lib/storage';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { AuthStack } from './AuthStack';
import { RootTabs } from './RootTabs';

export function RootNavigator() {
  const { loadProfile, signOut, setSignOutListener } = useAuth();
  const [booting, setBooting] = useState(true);
  const [seenWelcome, setSeenWelcome] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    async function boot() {
      const [welcome, token] = await Promise.all([getHasSeenWelcome(), getAccessToken()]);
      setSeenWelcome(welcome);
      if (token) {
        if (isTokenExpired(token)) {
          await signOut();
        } else {
          setIsAuthed(true);
          await loadProfile();
        }
      }
      setBooting(false);
    }
    void boot();
  }, [loadProfile, signOut]);

  const handleWelcomeContinue = useCallback(async () => {
    await setHasSeenWelcome();
    setSeenWelcome(true);
  }, []);

  const handleAuthenticated = useCallback(async () => {
    setIsAuthed(true);
    await loadProfile();
  }, [loadProfile]);

  const handleSignedOut = useCallback(() => {
    setIsAuthed(false);
  }, []);

  useEffect(() => {
    setSignOutListener(handleSignedOut);
    return () => setSignOutListener(null);
  }, [handleSignedOut, setSignOutListener]);

  if (booting) {
    return <AppSplash />;
  }

  if (!seenWelcome) {
    return <WelcomeScreen onContinue={handleWelcomeContinue} />;
  }

  if (!isAuthed) {
    return <AuthStack onAuthenticated={handleAuthenticated} />;
  }

  return <RootTabs />;
}
