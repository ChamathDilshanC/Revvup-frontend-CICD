import React, { useCallback, useEffect, useState } from 'react';
import { AppSplash } from '../components/AppSplash';
import { getAccessToken, getHasSeenWelcome, setHasSeenWelcome } from '../lib/storage';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { AuthStack } from './AuthStack';
import { RootTabs } from './RootTabs';

export function RootNavigator() {
  const [booting, setBooting] = useState(true);
  const [seenWelcome, setSeenWelcome] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    async function boot() {
      const [welcome, token] = await Promise.all([getHasSeenWelcome(), getAccessToken()]);
      setSeenWelcome(welcome);
      setIsAuthed(Boolean(token));
      setBooting(false);
    }
    boot();
  }, []);

  const handleWelcomeContinue = useCallback(async () => {
    await setHasSeenWelcome();
    setSeenWelcome(true);
  }, []);

  if (booting) {
    return <AppSplash />;
  }

  if (!seenWelcome) {
    return <WelcomeScreen onContinue={handleWelcomeContinue} />;
  }

  if (!isAuthed) {
    return <AuthStack onAuthenticated={() => setIsAuthed(true)} />;
  }

  return <RootTabs />;
}
