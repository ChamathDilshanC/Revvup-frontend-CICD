import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  hasSeenWelcome: '@revvup/has_seen_welcome',
  accessToken: '@revvup/access_token',
  refreshToken: '@revvup/refresh_token',
  pendingOwnerEmail: '@revvup/pending_owner_email',
} as const;

export async function getHasSeenWelcome(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEYS.hasSeenWelcome);
  return v === 'true';
}

export async function setHasSeenWelcome(): Promise<void> {
  await AsyncStorage.setItem(KEYS.hasSeenWelcome, 'true');
}

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.accessToken);
}

export async function setTokens(access: string, refresh?: string | null): Promise<void> {
  await AsyncStorage.setItem(KEYS.accessToken, access);
  if (refresh) {
    await AsyncStorage.setItem(KEYS.refreshToken, refresh);
  }
}

export async function clearTokens(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.accessToken, KEYS.refreshToken]);
}

export async function getPendingOwnerEmail(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.pendingOwnerEmail);
}

export async function setPendingOwnerEmail(email: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.pendingOwnerEmail, email.trim().toLowerCase());
}

export async function clearPendingOwnerEmail(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.pendingOwnerEmail);
}
