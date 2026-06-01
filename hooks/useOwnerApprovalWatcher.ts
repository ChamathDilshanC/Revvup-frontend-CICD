import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { notifyIfOwnerApproved } from '../lib/ownerApproval';
import { getPendingOwnerEmail } from '../lib/storage';

type Options = {
  email?: string;
  onApproved?: () => void;
  navigateToLogin?: () => void;
};

export function useOwnerApprovalWatcher({ email, onApproved, navigateToLogin }: Options) {
  const checkingRef = useRef(false);
  const notifiedRef = useRef(false);

  const runCheck = useCallback(async () => {
    if (checkingRef.current || notifiedRef.current) return;
    checkingRef.current = true;
    try {
      const target = email?.trim() || (await getPendingOwnerEmail());
      if (!target) return;
      const status = await notifyIfOwnerApproved(target, { onApproved, navigateToLogin });
      if (status === 'active' || status === 'rejected') {
        notifiedRef.current = true;
      }
    } catch {
      // Ignore background status check failures.
    } finally {
      checkingRef.current = false;
    }
  }, [email, navigateToLogin, onApproved]);

  useFocusEffect(
    useCallback(() => {
      notifiedRef.current = false;
      void runCheck();
    }, [runCheck]),
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void runCheck();
    });
    const interval = setInterval(() => void runCheck(), 45000);
    return () => {
      sub.remove();
      clearInterval(interval);
    };
  }, [runCheck]);
}
