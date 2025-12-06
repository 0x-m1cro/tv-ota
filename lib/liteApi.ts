import "server-only";

/**
 * LiteAPI Client for server-side API interactions
 * This file uses 'server-only' to ensure API keys never leak to the client
 */

const LITEAPI_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.liteapi.travel/v3.0";
const LITEAPI_KEY = process.env.LITEAPI_SANDBOX_KEY || process.env.LITEAPI_API_KEY;

if (!LITEAPI_KEY) {
  console.warn("Warning: LITEAPI_API_KEY or LITEAPI_SANDBOX_KEY not configured");
}

/**
 * Base fetch wrapper for LiteAPI requests
 */
async function liteApiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${LITEAPI_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": LITEAPI_KEY || "",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LiteAPI Error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Search hotels by city
 */
export async function searchHotels(params: {
  cityName?: string;
  countryCode?: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  currency?: string;
}) {
  const queryParams = new URLSearchParams({
    cityName: params.cityName || "",
    countryCode: params.countryCode || "MV",
    checkin: params.checkIn,
    checkout: params.checkOut,
    adults: params.adults.toString(),
    ...(params.children && { children: params.children.toString() }),
    currency: params.currency || "USD",
  });

  return liteApiFetch(`/hotels?${queryParams.toString()}`);
}

/**
 * Get hotel details by ID
 */
export async function getHotelDetails(hotelId: string, currency: string = "USD") {
  return liteApiFetch(`/hotels/${hotelId}?currency=${currency}`);
}

/**
 * Get available rooms for a hotel
 */
export async function getAvailableRooms(params: {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  currency?: string;
}) {
  const queryParams = new URLSearchParams({
    hotelId: params.hotelId,
    checkin: params.checkIn,
    checkout: params.checkOut,
    adults: params.adults.toString(),
    ...(params.children && { children: params.children.toString() }),
    currency: params.currency || "USD",
  });

  return liteApiFetch(`/hotels/rates?${queryParams.toString()}`);
}

/**
 * Prebook a room (before final booking)
 */
export async function prebookRoom(prebookId: string) {
  return liteApiFetch(`/rates/prebook`, {
    method: "POST",
    body: JSON.stringify({ prebookId }),
  });
}

/**
 * Create a booking
 */
export async function createBooking(bookingData: {
  prebookId: string;
  guestInfo: {
    guestFirstName: string;
    guestLastName: string;
    guestEmail: string;
  };
}) {
  return liteApiFetch(`/bookings`, {
    method: "POST",
    body: JSON.stringify(bookingData),
  });
}

/**
 * Get booking details
 */
export async function getBooking(bookingId: string) {
  return liteApiFetch(`/bookings/${bookingId}`);
}

/**
 * Cancel a booking
 */
export async function cancelBooking(bookingId: string) {
  return liteApiFetch(`/bookings/${bookingId}/cancel`, {
    method: "PUT",
  });
}
