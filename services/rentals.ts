import { getAccessToken } from '../lib/storage';
import type {
  RentalBookPayload,
  RentalBookingDetail,
  RentalBookingListItem,
  RentalBookingResponse,
  RentalQuote,
} from '../types/rental';
import { apiRequest } from './api';

async function authHeaders(): Promise<{ token: string } | Record<string, never>> {
  const token = await getAccessToken();
  return token ? { token } : {};
}

export async function fetchRentalQuote(
  bikeId: string,
  pickupAt: string,
  returnAt: string,
): Promise<RentalQuote> {
  return apiRequest<RentalQuote>('/rentals/quote', {
    method: 'POST',
    body: JSON.stringify({
      bike_id: bikeId,
      pickup_at: pickupAt,
      return_at: returnAt,
    }),
  });
}

export async function bookRental(payload: RentalBookPayload): Promise<RentalBookingResponse> {
  return apiRequest<RentalBookingResponse>('/rentals/book', {
    method: 'POST',
    body: JSON.stringify(payload),
    ...(await authHeaders()),
  });
}

export async function fetchMyRentalBookings(): Promise<RentalBookingListItem[]> {
  return apiRequest<RentalBookingListItem[]>('/rentals/mine', await authHeaders());
}

export async function fetchShowroomRentalBookings(): Promise<RentalBookingListItem[]> {
  return apiRequest<RentalBookingListItem[]>('/rentals/showroom', await authHeaders());
}

export async function fetchRentalBooking(bookingId: string): Promise<RentalBookingDetail> {
  return apiRequest<RentalBookingDetail>(`/rentals/${bookingId}`, await authHeaders());
}

export async function confirmRentalPickup(bookingId: string): Promise<RentalBookingDetail> {
  return apiRequest<RentalBookingDetail>(`/rentals/${bookingId}/confirm-pickup`, {
    method: 'POST',
    ...(await authHeaders()),
  });
}

export async function confirmRentalReturn(bookingId: string): Promise<RentalBookingDetail> {
  return apiRequest<RentalBookingDetail>(`/rentals/${bookingId}/confirm-return`, {
    method: 'POST',
    ...(await authHeaders()),
  });
}
