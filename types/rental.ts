export type RentalBookingStatus = 'PENDING_PICKUP' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type RentalQuote = {
  bike_id: string;
  bike_name: string;
  brand: string;
  showroom_name: string | null;
  owner_id: string | null;
  pickup_at: string;
  return_at: string;
  duration_hours: number;
  duration_label: string;
  rate_label: string;
  rental_fee: number;
  deposit_amount: number;
  total_amount: number;
  currency: string;
};

export type RentalInvoiceLine = {
  label: string;
  amount: number;
};

export type RentalInvoice = {
  booking_id: string;
  issued_at: string;
  customer_name: string;
  phone: string;
  nic_no?: string | null;
  date_of_birth?: string | null;
  license_no: string;
  bike_name: string;
  brand: string;
  showroom_name: string | null;
  showroom_address: string | null;
  pickup_at: string;
  return_at: string;
  duration_label: string;
  lines: RentalInvoiceLine[];
  rental_fee: number;
  deposit_amount: number;
  total_amount: number;
  currency: string;
  status: RentalBookingStatus;
  note: string;
};

export type RentalBookingResponse = {
  booking_id: string;
  status: RentalBookingStatus;
  invoice: RentalInvoice;
  qr_payload: {
    bookingId: string;
    status: string;
    bikeId: string;
    showroomId: string;
    v?: number;
  };
  qr_code_base64: string | null;
};

export type RentalBookPayload = {
  bike_id: string;
  pickup_at: string;
  return_at: string;
  customer_name: string;
  phone: string;
  nic_no: string;
  date_of_birth: string;
  license_no: string;
  license_image_url?: string | null;
};

export type RentalBookingListItem = {
  booking_id: string;
  bike_id: string;
  bike_name: string | null;
  brand: string | null;
  customer_name: string;
  phone: string;
  pickup_at: string;
  return_at: string;
  status: RentalBookingStatus;
  total_amount: number;
  currency: string;
  rent_started_at: string | null;
  elapsed_seconds: number;
  is_live: boolean;
};

export type RentalBookingDetail = RentalBookingListItem & {
  user_id: string;
  owner_id: string;
  nic_no?: string | null;
  date_of_birth?: string | null;
  license_no: string;
  license_image_url?: string | null;
  duration_hours: number;
  duration_label: string;
  rate_label: string;
  rental_fee: number;
  deposit_amount: number;
  qr_payload: Record<string, unknown>;
  showroom_name: string | null;
  invoice?: RentalInvoice | null;
  rent_ended_at?: string | null;
  overtime_seconds?: number;
  remaining_seconds?: number | null;
  created_at?: string | null;
  qr_code_base64?: string | null;
};

export type RentalFormParams = {
  bikeId: string;
  pickupAt: string;
  returnAt: string;
  customerName: string;
  phone: string;
  nicNo: string;
  dateOfBirth: string;
  licenseNo: string;
};
