import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  clearStoredProfile,
  clearTokens,
  getAccessToken,
  setStoredProfile,
} from '../lib/storage';
import { ApiRequestError, apiRequest, setUnauthorizedHandler } from '../services/api';
import { isTokenExpired } from '../lib/jwt';
import type { Profile } from '../types/user';

type AuthContextValue = {
  profile: Profile | null;
  isOwner: boolean;
  isClient: boolean;
  loadProfile: () => Promise<void>;
  setProfile: (profile: Profile | null) => void;
  signOut: () => Promise<void>;
  /** Register a callback after sign-out (e.g. return to login). Not stored in navigation state. */
  setSignOutListener: (listener: (() => void) | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<Profile | null>(null);
  const signOutListenerRef = useRef<(() => void) | null>(null);

  const setSignOutListener = useCallback((listener: (() => void) | null) => {
    signOutListenerRef.current = listener;
  }, []);

  const setProfile = useCallback((p: Profile | null) => {
    setProfileState(p);
    if (p) {
      void setStoredProfile(JSON.stringify(p));
    } else {
      void clearStoredProfile();
    }
  }, []);

  const signOut = useCallback(async () => {
    await clearTokens();
    await clearStoredProfile();
    setProfileState(null);
    signOutListenerRef.current?.();
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void signOut();
    });
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const loadProfile = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) {
      setProfile(null);
      return;
    }
    if (isTokenExpired(token)) {
      await signOut();
      return;
    }
    try {
      const me = await apiRequest<Profile>('/auth/me', { token });
      setProfile(me);
    } catch (e) {
      if (
        e instanceof ApiRequestError &&
        (e.status === 401 || e.code === 'TOKEN_EXPIRED' || e.code === 'UNAUTHORIZED')
      ) {
        await signOut();
        return;
      }
      setProfile(null);
    }
  }, [setProfile, signOut]);

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
      setSignOutListener,
    }),
    [profile, loadProfile, setProfile, signOut, setSignOutListener],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
