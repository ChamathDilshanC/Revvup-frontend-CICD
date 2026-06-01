import type { RentalBookingResponse, RentalFormParams, RentalQuote } from '../types/rental';

/** Shared stack routes for bike detail + rental flow (Explore & Rent tabs). */
export type BikeFlowParamList = {
  BikeDetail: { bikeId: string };
  RentalBooking: { bikeId: string };
  RentalQuote: { form: RentalFormParams; quote: RentalQuote };
  RentalSuccess: { booking: RentalBookingResponse };
  ShowroomMap: {
    showroomName: string;
    showroomAddress?: string | null;
    latitude: number;
    longitude: number;
  };
};
