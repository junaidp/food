// ===== User Roles =====
export type UserRole = 'donor' | 'receiver' | 'admin';

// ===== User =====
export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  is_verified: boolean;
  is_blocked: boolean;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface UserRegistration {
  phone: string;
  name: string;
  role: UserRole;
  password: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ===== Food Listing =====
export type ListingStatus = 'active' | 'inactive' | 'expired' | 'completed';

export interface FoodListing {
  id: string;
  donor_id: string;
  donor_name?: string;
  donor_phone?: string;
  title: string;
  description?: string;
  food_type?: string;
  quantity: number;
  remaining_quantity: number;
  latitude: number;
  longitude: number;
  address?: string;
  status: ListingStatus;
  expires_at: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateListingRequest {
  title: string;
  description?: string;
  food_type?: string;
  quantity: number;
  latitude: number;
  longitude: number;
  address?: string;
  expires_at: string;
}

// ===== Claims =====
export type ClaimStatus = 'pending' | 'accepted' | 'rejected' | 'picked_up' | 'expired' | 'cancelled';

export interface Claim {
  id: string;
  listing_id: string;
  receiver_id: string;
  receiver_name?: string;
  receiver_phone?: string;
  donor_id: string;
  donor_name?: string;
  status: ClaimStatus;
  pickup_code: string;
  accepted_at?: string;
  picked_up_at?: string;
  expires_at?: string;
  listing_title?: string;
  listing_latitude?: number;
  listing_longitude?: number;
  created_at: string;
}

// ===== Ratings =====
export interface Rating {
  id: string;
  claim_id: string;
  from_user_id: string;
  to_user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface CreateRatingRequest {
  claim_id: string;
  rating: number;
  comment?: string;
}

// ===== Reports =====
export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
  reporter_name?: string;
  reported_name?: string;
}

export interface CreateReportRequest {
  reported_user_id: string;
  reason: string;
  description?: string;
}

// ===== Notifications =====
export type NotificationType =
  | 'claim_request'
  | 'claim_accepted'
  | 'claim_rejected'
  | 'receiver_arrived'
  | 'pickup_confirmed'
  | 'listing_expired'
  | 'new_rating';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

// ===== Location Update =====
export interface LocationUpdate {
  user_id: string;
  latitude: number;
  longitude: number;
  claim_id?: string;
}

// ===== Admin Stats =====
export interface AdminStats {
  total_users: number;
  total_donors: number;
  total_receivers: number;
  total_listings: number;
  active_listings: number;
  total_claims: number;
  completed_claims: number;
  pending_reports: number;
}

// ===== API Response =====
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
