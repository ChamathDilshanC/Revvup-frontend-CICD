import { Alert } from 'react-native';
import { apiRequest } from '../services/api';
import { clearPendingOwnerEmail } from './storage';

export type OwnerApplicationStatus = 'none' | 'pending' | 'active' | 'rejected';

export async function fetchOwnerApplicationStatus(email: string): Promise<OwnerApplicationStatus> {
  const trimmed = email.trim();
  if (!trimmed) return 'none';
  const data = await apiRequest<{ status: OwnerApplicationStatus }>(
    `/auth/owner-application-status?email=${encodeURIComponent(trimmed)}`,
  );
  return data.status;
}

type NotifyOptions = {
  onApproved?: () => void;
  navigateToLogin?: () => void;
};

export async function notifyIfOwnerApproved(
  email: string,
  options: NotifyOptions = {},
): Promise<OwnerApplicationStatus> {
  const status = await fetchOwnerApplicationStatus(email);
  if (status === 'active') {
    await clearPendingOwnerEmail();
    Alert.alert(
      'Account approved',
      'Your showroom owner account has been approved. You can now sign in with your email and password.',
      options.navigateToLogin
        ? [{ text: 'Sign in', onPress: options.navigateToLogin }]
        : [{ text: 'OK' }],
    );
    options.onApproved?.();
  } else if (status === 'rejected') {
    await clearPendingOwnerEmail();
    Alert.alert(
      'Application rejected',
      'Your showroom owner application was not approved. You may register as a client or contact support.',
      [{ text: 'OK' }],
    );
    options.onApproved?.();
  }
  return status;
}
