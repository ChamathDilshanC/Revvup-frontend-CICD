import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  clearStoredProfile,
  clearTokens,
  getAccessToken,
  getStoredProfile,
  setStoredProfile,
} from '../lib/storage';
import { apiRequest } from '../services/api';
import type { Profile } from '../types/user';

type AuthContextValue = {
  profile: Profile | null;
  isOwner: boolean;
  isClient: boolean;
  loadProfile: () => Promise<void>;
  setProfile: (profile: Profile | null) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<Profile | null>(null);

  const setProfile = useCallback((p: Profile | null) => {
    setProfileState(p);
    if (p) {
      void setStoredProfile(JSON.stringify(p));
    } else {
      void clearStoredProfile();
    }
  }, []);

  const loadProfile = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) {
      setProfile(null);
      return;
    }
    try {
      const me = await apiRequest<Profile>('/auth/me', { token });
      setProfile(me);
    } catch {
      const cached = await getStoredProfile();
      if (cached) {
        try {
          setProfileState(JSON.parse(cached) as Profile);
          return;
        } catch {
          /* ignore */
        }
      }
      setProfile(null);
    }
  }, [setProfile]);

  const signOut = useCallback(async () => {
    await clearTokens();
    await clearStoredProfile();
    setProfileState(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      profile,
      isOwner:
        (profile?.role === 'showroom_owner' || profile?.role === 'admin') &&
        profile?.status === 'active',
      isClient: profile?.role === 'client',
      loadProfile,
      setProfile,
      signOut,
    }),
    [profile, loadProfile, setProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
