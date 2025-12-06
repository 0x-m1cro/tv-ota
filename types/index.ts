/**
 * Type definitions for the TV-OTA application
 */

// Search Parameters
export interface SearchParams {
  destination?: string;
  cityName?: string;
  countryCode?: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  rooms?: number;
  currency?: string;
}

// Hotel Types
export interface Hotel {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  starRating?: number;
  images?: string[];
  amenities?: string[];
  price?: {
    amount: number;
    currency: string;
  };
}

export interface HotelDetails extends Hotel {
  rooms?: Room[];
  facilities?: Facility[];
  policies?: HotelPolicies;
}

// Room Types
export interface Room {
  id: string;
  name: string;
  description?: string;
  capacity?: {
    adults: number;
    children?: number;
  };
  bedType?: string;
  size?: number;
  images?: string[];
  amenities?: string[];
  price: {
    amount: number;
    currency: string;
    totalAmount?: number;
  };
  cancellationPolicy?: CancellationPolicy;
  prebookId?: string;
}

// Facility & Amenity Types
export interface Facility {
  name: string;
  category?: string;
  icon?: string;
}

// Policy Types
export interface HotelPolicies {
  checkIn?: string;
  checkOut?: string;
  cancellation?: string;
  childPolicy?: string;
  petPolicy?: string;
}

export interface CancellationPolicy {
  freeCancellationUntil?: string;
  cancellationFee?: number;
  isRefundable: boolean;
}

// Booking Types
export interface GuestInfo {
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
}

export interface Booking {
  bookingId: string;
  status: "confirmed" | "pending" | "cancelled";
  hotel: Hotel;
  room: Room;
  searchParams: SearchParams;
  guestInfo: GuestInfo;
  totalPrice: {
    amount: number;
    currency: string;
  };
  createdAt: string;
  confirmationNumber?: string;
}

// Wishlist Types
export interface WishlistItem {
  hotel: Hotel;
  addedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: "success" | "error";
  message?: string;
}

// Search Mode
export type SearchMode = "destination" | "vibe";

// Vibe Types for "Search by Vibe" feature
export interface Vibe {
  id: string;
  name: string;
  description: string;
  icon?: string;
  tags?: string[];
}
