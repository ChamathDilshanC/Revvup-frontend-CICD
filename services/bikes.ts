import { getAccessToken } from '../lib/storage';
import type { BikeCreatePayload, BikeDetail, BikeSummary, BikeUpdatePayload } from '../types/bike';
import { apiRequest } from './api';

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
