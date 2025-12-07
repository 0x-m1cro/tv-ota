/**
 * LiteAPI Type Definitions
 * Based on official LiteAPI documentation and SDK
 */

// Search and Rates Types
export interface HotelSearchParams {
  cityName?: string;
  countryCode?: string;
  checkin: string;
  checkout: string;
  currency?: string;
  guestNationality?: string;
  occupancies: Occupancy[];
  hotelIds?: string[];
  timeout?: number;
  cityId?: string;
  iataCode?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  minRating?: number;
  starRating?: number[];
}

export interface Occupancy {
  rooms: number;
  adults: number;
  children?: number[];
}

export interface HotelSearchResponse {
  data: HotelOffer[];
}

export interface HotelOffer {
  hotelId: string;
  roomTypes: RoomType[];
}

export interface RoomType {
  offerId: string;
  supplier: string;
  supplierId: number;
  rates: Rate[];
}

export interface Rate {
  rateId: string;
  occupancyNumber: number;
  name: string;
  maxOccupancy: number;
  adultCount: number;
  childCount: number;
  boardType: BoardType;
  boardName: string;
  priceType: string;
  retailRate: RetailRate;
  cancellationPolicies: CancellationPolicy;
  amenities?: string[];
}

export type BoardType = "RO" | "BB" | "HB" | "FB" | "AI" | "BD" | "BL" | "DI";

export interface RetailRate {
  total: Array<{ amount: number; currency: string }>;
  fees?: Array<{ type: string; amount: number; currency: string }>;
  taxes?: Array<{ included: boolean; amount: number; currency: string }>;
}

export interface CancellationPolicy {
  cancelPolicyInfos: Array<{
    fromDate: string;
    toDate: string;
    penaltyType: string;
    currency: string;
    amount: number;
  }>;
  hotelRemarks?: Array<{ code: string; description: string }>;
  refundableTag: string;
}

// Hotel Details Types
export interface HotelDetailsParams {
  hotelId: string;
  currency?: string;
}

export interface HotelDetailsResponse {
  data: HotelDetails;
}

export interface HotelDetails {
  id: string;
  name: string;
  hotelDescription: string;
  checkinCheckoutTimes: {
    checkout: string;
    checkin: string;
  };
  images: Array<{ url: string; thumbnailUrl?: string }>;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
    latitude: number;
    longitude: number;
  };
  rating: number;
  star: number;
  facilities: Array<{ id: string; name: string; category: string }>;
  hotelPolicy?: string;
}

// Prebook Types
export interface PrebookParams {
  offerId: string;
  usePaymentSdk?: boolean;
  voucherCode?: string;
}

export interface PrebookResponse {
  data: PrebookData;
}

export interface PrebookData {
  prebookId: string;
  hotelId: string;
  hotel: string;
  offerId: string;
  roomTypeId: string;
  rooms: Array<{
    roomId: string;
    roomName: string;
    adults: number;
    children: number;
  }>;
  price: {
    currency: string;
    total: number;
    baseFare: number;
    tax: number;
  };
  boardType: BoardType;
  boardName: string;
  cancellationPolicies: CancellationPolicy;
  paymentTypes: string[];
  transactionId?: string; // Returned when usePaymentSdk is true
  secretKey?: string; // Returned when usePaymentSdk is true
}

// Booking Types
export interface BookingParams {
  prebookId: string;
  holder: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  payment: {
    method: string;
    transactionId?: string; // Used when payment SDK is used
  };
  guests?: Array<{
    firstName: string;
    lastName: string;
    email?: string;
  }>;
  specialRequests?: string;
}

export interface BookingResponse {
  data: BookingData;
}

export interface BookingData {
  bookingId: string;
  status: "confirmed" | "pending" | "cancelled";
  hotelConfirmationCode: string;
  checkin: string;
  checkout: string;
  hotel: {
    hotelId: string;
    name: string;
    address: string;
  };
  rooms: Array<{
    roomId: string;
    roomName: string;
    adults: number;
    children: number;
  }>;
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  price: {
    currency: string;
    total: number;
  };
  cancellationPolicies: CancellationPolicy;
}

// Retrieve Booking
export interface RetrieveBookingResponse {
  data: BookingData;
}

// City and Country Search
export interface PlacesSearchParams {
  countryCode?: string;
  cityName?: string;
}

export interface CitiesResponse {
  data: Array<{
    city: string;
    cityId: string;
    country: string;
    countryCode: string;
  }>;
}

export interface CountriesResponse {
  data: Array<{
    code: string;
    name: string;
  }>;
}

// Static Data
export interface FacilitiesResponse {
  data: Array<{
    id: string;
    name: string;
    category: string;
  }>;
}

export interface CurrenciesResponse {
  data: Array<{
    code: string;
    name: string;
    symbol: string;
  }>;
}
