import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  hasSeenWelcome: '@revvup/has_seen_welcome',
  accessToken: '@revvup/access_token',
  refreshToken: '@revvup/refresh_token',
  pendingOwnerEmail: '@revvup/pending_owner_email',
  profile: '@revvup/profile',
  themePreference: '@revvup/theme_preference',
  currencyPreference: '@revvup/currency_preference',
  clientProvince: '@revvup/client_province',
} as const;

export type StoredThemePreference = 'dark' | 'light';
export type CurrencyCode = 'USD' | 'LKR';

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

export async function getStoredProfile(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.profile);
}

export async function setStoredProfile(json: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.profile, json);
}

export async function clearStoredProfile(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.profile);
}

export async function getThemePreference(): Promise<StoredThemePreference | null> {
  const v = await AsyncStorage.getItem(KEYS.themePreference);
  return v === 'light' || v === 'dark' ? v : null;
}

export async function setThemePreference(value: StoredThemePreference): Promise<void> {
  await AsyncStorage.setItem(KEYS.themePreference, value);
}

export async function getCurrencyPreference(): Promise<CurrencyCode | null> {
  const v = await AsyncStorage.getItem(KEYS.currencyPreference);
  return v === 'USD' || v === 'LKR' ? v : null;
}

export async function setCurrencyPreference(value: CurrencyCode): Promise<void> {
  await AsyncStorage.setItem(KEYS.currencyPreference, value);
}

export async function getClientProvince(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.clientProvince);
}

export async function setClientProvince(value: string | null): Promise<void> {
  if (!value) {
    await AsyncStorage.removeItem(KEYS.clientProvince);
    return;
  }
  await AsyncStorage.setItem(KEYS.clientProvince, value);
}
