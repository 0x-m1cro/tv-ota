import "server-only";
import type {
  HotelSearchParams,
  HotelSearchResponse,
  HotelDetailsParams,
  HotelDetailsResponse,
  PrebookParams,
  PrebookResponse,
  BookingParams,
  BookingResponse,
  RetrieveBookingResponse,
  CitiesResponse,
  CountriesResponse,
  FacilitiesResponse,
  CurrenciesResponse,
} from "@/types/liteapi";

/**
 * LiteAPI Client for server-side API interactions
 * This file uses 'server-only' to ensure API keys never leak to the client
 * Uses the official LiteAPI Node.js SDK
 */

const LITEAPI_KEY = process.env.LITEAPI_SANDBOX_KEY || process.env.LITEAPI_API_KEY;

if (!LITEAPI_KEY) {
  console.warn("Warning: LITEAPI_API_KEY or LITEAPI_SANDBOX_KEY not configured");
}

// Initialize LiteAPI SDK
const liteApi = require("liteapi-node-sdk")(LITEAPI_KEY || "");

/**
 * Search hotels by location and dates
 */
export async function searchHotels(
  params: HotelSearchParams
): Promise<HotelSearchResponse> {
  try {
    const result = await liteApi.getFullRates({
      checkin: params.checkin,
      checkout: params.checkout,
      currency: params.currency || "USD",
      guestNationality: params.guestNationality || "US",
      occupancies: params.occupancies,
      ...(params.cityName && { cityName: params.cityName }),
      ...(params.cityId && { cityId: params.cityId }),
      ...(params.countryCode && { countryCode: params.countryCode }),
      ...(params.hotelIds && { hotelIds: params.hotelIds }),
      ...(params.latitude && { latitude: params.latitude }),
      ...(params.longitude && { longitude: params.longitude }),
      ...(params.radius && { radius: params.radius }),
      ...(params.minRating && { minRating: params.minRating }),
      ...(params.starRating && { starRating: params.starRating }),
      timeout: params.timeout || 10000,
    });
    return result;
  } catch (error) {
    console.error("Error searching hotels:", error);
    throw new Error(`Failed to search hotels: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get hotel details by ID
 */
export async function getHotelDetails(
  params: HotelDetailsParams
): Promise<HotelDetailsResponse> {
  try {
    const result = await liteApi.getHotelDetails({
      hotelId: params.hotelId,
      currency: params.currency || "USD",
    });
    return result;
  } catch (error) {
    console.error("Error fetching hotel details:", error);
    throw new Error(`Failed to get hotel details: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Prebook a room (before final booking)
 * This validates the rate and returns final pricing with a prebookId
 */
export async function prebookRoom(
  params: PrebookParams
): Promise<PrebookResponse> {
  try {
    const result = await liteApi.preBook({
      offerId: params.offerId,
      usePaymentSdk: params.usePaymentSdk || false,
      ...(params.voucherCode && { voucherCode: params.voucherCode }),
    });
    return result;
  } catch (error) {
    console.error("Error prebooking room:", error);
    throw new Error(`Failed to prebook room: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Create a booking
 */
export async function createBooking(
  params: BookingParams
): Promise<BookingResponse> {
  try {
    const result = await liteApi.book({
      prebookId: params.prebookId,
      holder: params.holder,
      payment: params.payment,
      ...(params.guests && { guests: params.guests }),
      ...(params.specialRequests && { specialRequests: params.specialRequests }),
    });
    return result;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error(`Failed to create booking: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get booking details
 */
export async function getBooking(bookingId: string): Promise<RetrieveBookingResponse> {
  try {
    const result = await liteApi.retrieveBooking({ bookingId });
    return result;
  } catch (error) {
    console.error("Error retrieving booking:", error);
    throw new Error(`Failed to retrieve booking: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Cancel a booking
 */
export async function cancelBooking(bookingId: string): Promise<void> {
  try {
    await liteApi.cancelBooking({ bookingId });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw new Error(`Failed to cancel booking: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get list of cities
 */
export async function getCities(countryCode?: string): Promise<CitiesResponse> {
  try {
    const result = await liteApi.getCities(
      countryCode ? { countryCode } : undefined
    );
    return result;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw new Error(`Failed to get cities: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get list of countries
 */
export async function getCountries(): Promise<CountriesResponse> {
  try {
    const result = await liteApi.getCountries();
    return result;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw new Error(`Failed to get countries: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get hotel facilities list
 */
export async function getFacilities(): Promise<FacilitiesResponse> {
  try {
    const result = await liteApi.getFacilities();
    return result;
  } catch (error) {
    console.error("Error fetching facilities:", error);
    throw new Error(`Failed to get facilities: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get currencies list
 */
export async function getCurrencies(): Promise<CurrenciesResponse> {
  try {
    const result = await liteApi.getCurrencies();
    return result;
  } catch (error) {
    console.error("Error fetching currencies:", error);
    throw new Error(`Failed to get currencies: ${error instanceof Error ? error.message : String(error)}`);
  }
}
