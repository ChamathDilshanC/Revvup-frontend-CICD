import { Asset } from 'expo-asset';
import { AUTH_HERO_IMAGE, APP_LOGO } from '../constants/images';

/** Decode and cache auth images before first paint — avoids slow background fade-in. */
export async function preloadAuthAssets(): Promise<void> {
  try {
    const hero = Asset.fromModule(AUTH_HERO_IMAGE as number);
    const logo = Asset.fromModule(APP_LOGO as number);
    await Promise.all([hero.downloadAsync(), logo.downloadAsync()]);
  } catch {
    // Non-fatal — images still load on first render
  }
}
