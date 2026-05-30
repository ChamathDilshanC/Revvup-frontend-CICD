export type UserRole = 'client' | 'showroom_owner' | 'admin';
export type UserStatus = 'active' | 'pending' | 'rejected';

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  status: UserStatus;
  showroom_name: string | null;
  showroom_address: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type AuthResponse = {
  access_token: string | null;
  refresh_token?: string | null;
  profile: Profile;
  message?: string;
};
