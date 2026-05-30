import React, { useCallback, useEffect, useState } from 'react';
import { AppSplash } from '../components/AppSplash';
import { getAccessToken, getHasSeenWelcome, getUserRole, setHasSeenWelcome } from '../lib/storage';
import { WelcomeScreen } from '../screens/client/WelcomeScreen';
import { AuthStack } from './AuthStack';
import { OwnerTabs } from './OwnerTabs';
import { RootTabs } from './RootTabs';

export function RootNavigator() {
  const [booting, setBooting] = useState(true);
  const [seenWelcome, setSeenWelcome] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [role, setRole] = useState<'client' | 'showroom_owner' | 'admin' | null>(null);

  useEffect(() => {
    async function boot() {
      const [welcome, token, storedRole] = await Promise.all([
        getHasSeenWelcome(),
        getAccessToken(),
        getUserRole(),
      ]);
      setSeenWelcome(welcome);
      setIsAuthed(Boolean(token));
      setRole(storedRole);
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
    return (
      <AuthStack
        onAuthenticated={async () => {
          setIsAuthed(true);
          setRole(await getUserRole());
        }}
      />
    );
  }

  if (role === 'showroom_owner' || role === 'admin') {
    return <OwnerTabs />;
  }

  return <RootTabs />;
}
