import { getAccessToken } from '../lib/storage';
import type { Profile } from '../types/user';
import { apiRequest } from './api';

export type ProfileUpdatePayload = {
  full_name?: string;
  showroom_name?: string;
  showroom_address?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
};

export async function updateMyProfile(payload: ProfileUpdatePayload): Promise<Profile> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not signed in');
  return apiRequest<Profile>('/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
    token,
  });
}
