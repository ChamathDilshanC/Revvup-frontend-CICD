export type BikeSummary = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string | null;
  top_speed_mph: number | null;
  weight_lbs: number | null;
  engine_cc: number | null;
  owner_id: string | null;
  showroom_name: string | null;
  showroom_address: string | null;
  showroom_phone: string | null;
  showroom_latitude: number | null;
  showroom_longitude: number | null;
  showroom_province?: string | null;
  is_available: boolean;
  is_rentable?: boolean;
  rent_per_day?: number | null;
  rent_per_hour?: number | null;
  security_deposit?: number | null;
  is_rented_out?: boolean;
  rental_status?: string | null;
  rental_return_at?: string | null;
};

export type BikeDetail = BikeSummary & {
  horsepower: number | null;
  year: number | null;
};

export type BikeCreatePayload = {
  name: string;
  brand: string;
  price: number;
  image_url?: string;
  top_speed_mph?: number;
  weight_lbs?: number;
  engine_cc?: number;
  horsepower?: number;
  year?: number;
  is_available?: boolean;
  is_rentable?: boolean;
  rent_per_day?: number;
  rent_per_hour?: number;
  security_deposit?: number;
};

export type BikeUpdatePayload = Partial<BikeCreatePayload>;

export type ShowroomGroup = {
  key: string;
  showroomName: string;
  showroomAddress: string | null;
  showroomProvince?: string | null;
  bikes: BikeSummary[];
};
