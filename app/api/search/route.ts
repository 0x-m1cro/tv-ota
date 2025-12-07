import { NextRequest, NextResponse } from "next/server";
import { searchHotels } from "@/lib/liteApi";
import type { HotelSearchParams } from "@/types/liteapi";

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

    const results = await searchHotels(body);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Search failed" },
      { status: 500 }
    );
  }
}
