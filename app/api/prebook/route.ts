import { NextRequest, NextResponse } from "next/server";
import { prebookRoom } from "@/lib/liteApi";
import type { PrebookParams } from "@/types/liteapi";

export async function POST(request: NextRequest) {
  try {
    const body: PrebookParams = await request.json();
    
    if (!body.offerId) {
      return NextResponse.json(
        { error: "Missing required field: offerId" },
        { status: 400 }
      );
    }

    const prebookData = await prebookRoom(body);
    
    return NextResponse.json(prebookData);
  } catch (error) {
    console.error("Prebook API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Prebook failed" },
      { status: 500 }
    );
  }
}
