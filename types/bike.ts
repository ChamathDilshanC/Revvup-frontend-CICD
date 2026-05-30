export type BikeSummary = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string | null;
  top_speed_mph: number | null;
  owner_id: string | null;
  showroom_name: string | null;
  showroom_address: string | null;
  showroom_latitude: number | null;
  showroom_longitude: number | null;
};

export type BikeDetail = BikeSummary & {
  weight_lbs: number | null;
  engine_cc: number | null;
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
};

export type BikeUpdatePayload = Partial<BikeCreatePayload>;

export type ShowroomGroup = {
  key: string;
  showroomName: string;
  showroomAddress: string | null;
  bikes: BikeSummary[];
};
