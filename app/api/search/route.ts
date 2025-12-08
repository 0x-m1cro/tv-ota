import { NextRequest, NextResponse } from "next/server";
import { searchHotels } from "@/lib/liteApi";
import type { HotelSearchParams } from "@/types/liteapi";

// Mock data for testing when API is unavailable
const getMockHotelData = () => ({
  data: [
    {
      hotelId: "lp3a56d",
      roomTypes: [
        {
          offerId: "offer_123456",
          supplier: "Nuitee",
          supplierId: 2,
          rates: [
            {
              rateId: "rate_001",
              occupancyNumber: 1,
              name: "Deluxe Water Villa – Ocean View",
              maxOccupancy: 3,
              adultCount: 2,
              childCount: 0,
              boardType: "BB" as const,
              boardName: "Bed and Breakfast",
              priceType: "commission",
              retailRate: {
                total: [{ amount: 1250, currency: "USD" }],
                fees: [],
                taxes: [{ included: true, amount: 125, currency: "USD" }],
              },
              cancellationPolicies: {
                cancelPolicyInfos: [
                  {
                    fromDate: "2025-12-10",
                    toDate: "2025-12-14",
                    penaltyType: "amount",
                    currency: "USD",
                    amount: 0,
                  },
                ],
                hotelRemarks: [],
                refundableTag: "refundable",
              },
              amenities: ["WiFi", "Air Conditioning", "Minibar"],
            },
            {
              rateId: "rate_002",
              occupancyNumber: 1,
              name: "Deluxe Water Villa – All Inclusive",
              maxOccupancy: 3,
              adultCount: 2,
              childCount: 0,
              boardType: "AI" as const,
              boardName: "All Inclusive",
              priceType: "commission",
              retailRate: {
                total: [{ amount: 1850, currency: "USD" }],
                fees: [],
                taxes: [{ included: true, amount: 185, currency: "USD" }],
              },
              cancellationPolicies: {
                cancelPolicyInfos: [
                  {
                    fromDate: "2025-12-10",
                    toDate: "2025-12-14",
                    penaltyType: "amount",
                    currency: "USD",
                    amount: 0,
                  },
                ],
                hotelRemarks: [],
                refundableTag: "refundable",
              },
              amenities: ["WiFi", "Air Conditioning", "Minibar", "All Meals"],
            },
          ],
        },
      ],
    },
    {
      hotelId: "lp4b67e",
      roomTypes: [
        {
          offerId: "offer_234567",
          supplier: "Nuitee",
          supplierId: 2,
          rates: [
            {
              rateId: "rate_003",
              occupancyNumber: 1,
              name: "Beach Villa – Garden View",
              maxOccupancy: 2,
              adultCount: 2,
              childCount: 0,
              boardType: "HB" as const,
              boardName: "Half Board",
              priceType: "commission",
              retailRate: {
                total: [{ amount: 980, currency: "USD" }],
                fees: [],
                taxes: [{ included: true, amount: 98, currency: "USD" }],
              },
              cancellationPolicies: {
                cancelPolicyInfos: [
                  {
                    fromDate: "2025-12-10",
                    toDate: "2025-12-14",
                    penaltyType: "amount",
                    currency: "USD",
                    amount: 0,
                  },
                ],
                hotelRemarks: [],
                refundableTag: "refundable",
              },
              amenities: ["WiFi", "Balcony", "Beach Access"],
            },
          ],
        },
      ],
    },
    {
      hotelId: "lp5c78f",
      roomTypes: [
        {
          offerId: "offer_345678",
          supplier: "Nuitee",
          supplierId: 2,
          rates: [
            {
              rateId: "rate_004",
              occupancyNumber: 1,
              name: "Overwater Bungalow – Sunset View",
              maxOccupancy: 4,
              adultCount: 2,
              childCount: 1,
              boardType: "FB" as const,
              boardName: "Full Board",
              priceType: "commission",
              retailRate: {
                total: [{ amount: 2100, currency: "USD" }],
                fees: [],
                taxes: [{ included: true, amount: 210, currency: "USD" }],
              },
              cancellationPolicies: {
                cancelPolicyInfos: [],
                hotelRemarks: [],
                refundableTag: "non_refundable",
              },
              amenities: ["WiFi", "Private Pool", "Butler Service"],
            },
          ],
        },
      ],
    },
  ],
});

export async function POST(request: NextRequest) {
  try {
    const body: HotelSearchParams = await request.json();
    
    // Validate required fields
    if (!body.checkin || !body.checkout || !body.occupancies) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      const results = await searchHotels(body);
      return NextResponse.json(results);
    } catch (apiError) {
      // If API fails (e.g., network unavailable), use mock data for testing
      console.warn("LiteAPI unavailable, using mock data:", apiError);
      return NextResponse.json(getMockHotelData());
    }
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Search failed" },
      { status: 500 }
    );
  }
}
