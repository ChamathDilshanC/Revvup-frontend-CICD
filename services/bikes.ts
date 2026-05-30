import { API_V1 } from '../config/api';
import { getAccessToken } from '../lib/storage';
import type { BikeCreatePayload, BikeDetail, BikeSummary, BikeUpdatePayload } from '../types/bike';
import { ApiRequestError, apiRequest } from './api';

async function authHeaders(): Promise<{ token: string } | Record<string, never>> {
  const token = await getAccessToken();
  return token ? { token } : {};
}

export async function fetchCatalog(): Promise<BikeSummary[]> {
  return apiRequest<BikeSummary[]>('/bikes');
}

export async function fetchBikeDetail(bikeId: string): Promise<BikeDetail> {
  return apiRequest<BikeDetail>(`/bikes/${bikeId}`);
}

export async function fetchMyBikes(): Promise<BikeSummary[]> {
  return apiRequest<BikeSummary[]>('/bikes/mine', await authHeaders());
}

export async function createBike(payload: BikeCreatePayload): Promise<BikeDetail> {
  return apiRequest<BikeDetail>('/bikes', {
    method: 'POST',
    body: JSON.stringify(payload),
    ...(await authHeaders()),
  });
}

export async function updateBike(bikeId: string, payload: BikeUpdatePayload): Promise<BikeDetail> {
  return apiRequest<BikeDetail>(`/bikes/${bikeId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    ...(await authHeaders()),
  });
}

export async function deleteBike(bikeId: string): Promise<void> {
  await apiRequest<void>(`/bikes/${bikeId}`, {
    method: 'DELETE',
    ...(await authHeaders()),
  });
}

export type BikeImageUpload = {
  uri: string;
  mimeType: string;
  fileName?: string;
};

export async function uploadBikeImage(bikeId: string, image: BikeImageUpload): Promise<BikeDetail> {
  const token = await getAccessToken();
  if (!token) {
    throw new ApiRequestError('UNAUTHORIZED', 'Sign in to upload images');
  }

  const mimeType = normalizeBikeImageMime(image.mimeType);
  const name = image.fileName?.trim() || `bike-${bikeId}.${mimeToExtension(mimeType)}`;

  const form = new FormData();
  form.append('file', { uri: image.uri, name, type: mimeType } as unknown as Blob);

  const res = await fetch(`${API_V1}/bikes/${bikeId}/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    const err = data?.error as { code?: string; message?: string } | undefined;
    throw new ApiRequestError(
      err?.code ?? 'UPLOAD_FAILED',
      err?.message ?? data?.detail ?? data?.message ?? 'Image upload failed',
    );
  }

  return data as BikeDetail;
}

function normalizeBikeImageMime(mime: string | undefined): string {
  const m = (mime ?? 'image/jpeg').toLowerCase();
  if (m === 'image/jpg') return 'image/jpeg';
  if (m === 'image/jpeg' || m === 'image/png' || m === 'image/webp') return m;
  return 'image/jpeg';
}

function mimeToExtension(mime: string): string {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  return 'jpg';
}
