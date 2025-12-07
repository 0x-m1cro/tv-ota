import { NextRequest, NextResponse } from "next/server";
import { getHotelDetails } from "@/lib/liteApi";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get("currency") || "USD";

    const hotelDetails = await getHotelDetails({
      hotelId: id,
      currency,
    });

    return NextResponse.json(hotelDetails);
  } catch (error) {
    console.error("Hotel details API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch hotel details" },
      { status: 500 }
    );
  }
}
