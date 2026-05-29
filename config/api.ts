/**
 * API base URL from Expo public env.
 * Set EXPO_PUBLIC_API_URL in .env (see .env.example).
 */
const raw = process.env.EXPO_PUBLIC_API_URL ?? 'https://revvup-backend.vercel.app';

export const API_BASE_URL = raw.replace(/\/$/, '');

export const API_V1 = `${API_BASE_URL}/api/v1`;
