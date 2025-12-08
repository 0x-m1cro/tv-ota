import { NextRequest, NextResponse } from "next/server";
import { getHotelDetails } from "@/lib/liteApi";

// Mock hotel details for testing
const getMockHotelDetails = (hotelId: string) => ({
  data: {
    id: hotelId,
    name: hotelId === "lp3a56d" 
      ? "Paradise Island Resort & Spa"
      : hotelId === "lp4b67e"
      ? "Coral Beach Hotel Maldives"
      : "Sunset Overwater Villas",
    hotelDescription:
      "Experience luxury in the heart of the Maldives. Our resort offers stunning overwater villas, pristine beaches, and world-class amenities. Indulge in spa treatments, water sports, and exquisite dining while surrounded by crystal-clear turquoise waters.",
    checkinCheckoutTimes: {
      checkout: "12:00",
      checkin: "14:00",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1582880421648-a7154a8c99c7?w=800",
        thumbnailUrl: "https://images.unsplash.com/photo-1582880421648-a7154a8c99c7?w=200",
      },
      {
        url: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800",
        thumbnailUrl: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=200",
      },
      {
        url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        thumbnailUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200",
      },
    ],
    address: {
      line1: "North Male Atoll",
      city: "Male",
      state: "Male Atoll",
      country: "Maldives",
      postalCode: "20026",
      latitude: 4.1755,
      longitude: 73.5093,
    },
    rating: 9.2,
    star: 5,
    facilities: [
      { id: "pool", name: "Outdoor Pool", category: "Recreation" },
      { id: "spa", name: "Spa & Wellness Center", category: "Wellness" },
      { id: "wifi", name: "Free WiFi", category: "Internet" },
      { id: "restaurant", name: "On-site Restaurant", category: "Dining" },
      { id: "bar", name: "Pool Bar", category: "Dining" },
      { id: "beach", name: "Private Beach", category: "Recreation" },
      { id: "diving", name: "Diving Center", category: "Water Sports" },
      { id: "gym", name: "Fitness Center", category: "Recreation" },
    ],
    hotelPolicy:
      "Check-in time is from 2:00 PM. Check-out time is until 12:00 PM. Children of all ages are welcome. Free cancellation up to 48 hours before arrival. Valid credit card required for booking.",
  },
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get("currency") || "USD";

    try {
      const hotelDetails = await getHotelDetails({
        hotelId: id,
        currency,
      });
      return NextResponse.json(hotelDetails);
    } catch (apiError) {
      // If API fails, use mock data for testing
      console.warn("LiteAPI unavailable, using mock data for hotel:", id);
      return NextResponse.json(getMockHotelDetails(id));
    }
  } catch (error) {
    console.error("Hotel details API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch hotel details" },
      { status: 500 }
    );
  }
}
