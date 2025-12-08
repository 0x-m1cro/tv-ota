import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/liteApi";
import type { BookingParams } from "@/types/liteapi";

export async function POST(request: NextRequest) {
  try {
    const body: BookingParams = await request.json();
    
    if (!body.prebookId || !body.holder) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bookingData = await createBooking(body);
    
    return NextResponse.json(bookingData);
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Booking failed" },
      { status: 500 }
    );
  }
}
