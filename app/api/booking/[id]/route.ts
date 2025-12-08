import { NextRequest, NextResponse } from "next/server";
import { getBooking } from "@/lib/liteApi";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingData = await getBooking(id);
    return NextResponse.json(bookingData);
  } catch (error) {
    console.error("Booking retrieval API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to retrieve booking" },
      { status: 500 }
    );
  }
}
