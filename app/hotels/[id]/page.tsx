"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Star, MapPin, Loader2, Info, Clock } from "lucide-react";
import ImageGallery from "@/components/hotel/ImageGallery";
import RoomAccordion from "@/components/hotel/RoomAccordion";
import Button from "@/components/ui/Button";
import { useBookingStore } from "@/lib/store";
import type { HotelDetails, Rate, HotelOffer } from "@/types/liteapi";

function HotelDetailsContent({ params }: { params: Promise<{ id: string }> }) {
  const [hotelId, setHotelId] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setPrebookData } = useBookingStore();
  
  const [hotelDetails, setHotelDetails] = useState<HotelDetails | null>(null);
  const [hotelRates, setHotelRates] = useState<HotelOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"rooms" | "about" | "amenities" | "policies">("rooms");

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = parseInt(searchParams.get("guests") || "2");

  useEffect(() => {
    params.then(p => setHotelId(p.id));
  }, [params]);

  useEffect(() => {
    if (!hotelId) return;
    async function fetchHotelData() {
      try {
        setLoading(true);

        // Fetch hotel details
        const detailsRes = await fetch(`/api/hotels/${hotelId}?currency=USD`);
        if (!detailsRes.ok) throw new Error("Failed to fetch hotel details");
        const detailsData = await detailsRes.json();
        setHotelDetails(detailsData.data);

        // Fetch hotel rates if dates are provided
        if (checkIn && checkOut) {
          const ratesRes = await fetch("/api/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              hotelIds: [hotelId],
              checkin: checkIn,
              checkout: checkOut,
              currency: "USD",
              guestNationality: "US",
              occupancies: [{ rooms: 1, adults: guests, children: [] }],
            }),
          });

          if (ratesRes.ok) {
            const ratesData = await ratesRes.json();
            if (ratesData.data && ratesData.data.length > 0) {
              setHotelRates(ratesData.data[0]);
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchHotelData();
  }, [hotelId, checkIn, checkOut, guests]);

  const handleSelectRoom = async (offerId: string) => {
    try {
      // Call prebook API
      const response = await fetch("/api/prebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId,
          usePaymentSdk: true,
        }),
      });

      if (!response.ok) throw new Error("Failed to prebook room");
      
      const prebookData = await response.json();
      
      // Store prebook data in state
      setPrebookData({
        prebookId: prebookData.data.prebookId,
        offerId: offerId,
        hotelId: hotelId,
        checkIn: checkIn || "",
        checkOut: checkOut || "",
        guests,
        transactionId: prebookData.data.transactionId,
        secretKey: prebookData.data.secretKey,
      });

      // Navigate to checkout
      router.push("/checkout");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to proceed to checkout");
    }
  };

  const groupRoomsByType = () => {
    if (!hotelRates) return [];

    const roomMap = new Map<string, { roomId: string; roomName: string; offerId: string; rates: Rate[] }>();

    hotelRates.roomTypes.forEach((roomType) => {
      roomType.rates.forEach((rate) => {
        const roomName = rate.name.split("–")[0].trim() || rate.name;
        
        if (!roomMap.has(roomName)) {
          roomMap.set(roomName, {
            roomId: roomName,
            roomName,
            offerId: roomType.offerId,
            rates: [],
          });
        }
        
        roomMap.get(roomName)!.rates.push(rate);
      });
    });

    return Array.from(roomMap.values());
  };

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-lg text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (error || !hotelDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <p className="text-lg text-red-800">{error || "Hotel not found"}</p>
          <Button className="mt-4" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const rooms = groupRoomsByType();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Results</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Image Gallery */}
        <ImageGallery images={hotelDetails.images} hotelName={hotelDetails.name} />

        {/* Hotel Summary */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Star Rating */}
              <div className="mb-2 flex items-center gap-1">
                {Array.from({ length: hotelDetails.star }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Hotel Name */}
              <h1 className="mb-2 text-3xl font-bold text-gray-900">{hotelDetails.name}</h1>

              {/* Location */}
              <div className="mb-4 flex items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>
                  {hotelDetails.address.line1}, {hotelDetails.address.city},{" "}
                  {hotelDetails.address.country}
                </span>
              </div>

              {/* Rating */}
              {hotelDetails.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-lg font-bold text-white">
                    {hotelDetails.rating.toFixed(1)}
                  </div>
                  <span className="text-lg font-medium text-gray-700">
                    {hotelDetails.rating >= 9
                      ? "Exceptional"
                      : hotelDetails.rating >= 8
                      ? "Excellent"
                      : "Very Good"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Check-in/Check-out Times */}
          {hotelDetails.checkinCheckoutTimes && (
            <div className="mt-6 flex items-center gap-6 border-t pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Check-in: {hotelDetails.checkinCheckoutTimes.checkin}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Check-out: {hotelDetails.checkinCheckoutTimes.checkout}</span>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="border-b">
            <div className="flex gap-8">
              {[
                { id: "rooms", label: "Rooms & Rates" },
                { id: "about", label: "About" },
                { id: "amenities", label: "Amenities" },
                { id: "policies", label: "Policies" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "rooms" | "about" | "amenities" | "policies")}
                  className={`border-b-2 px-4 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {/* Rooms Tab */}
            {activeTab === "rooms" && (
              <div>
                {!checkIn || !checkOut ? (
                  <div className="rounded-lg bg-yellow-50 p-6 text-center">
                    <Info className="mx-auto h-12 w-12 text-yellow-600" />
                    <p className="mt-4 text-lg text-gray-900">
                      Please select dates to see available rooms and rates
                    </p>
                    <Button className="mt-4" onClick={() => router.push("/")}>
                      Search with Dates
                    </Button>
                  </div>
                ) : rooms.length > 0 ? (
                  <RoomAccordion rooms={rooms} onSelectRoom={handleSelectRoom} />
                ) : (
                  <div className="rounded-lg bg-gray-50 p-8 text-center">
                    <p className="text-gray-600">No rooms available for the selected dates</p>
                  </div>
                )}
              </div>
            )}

            {/* About Tab */}
            {activeTab === "about" && (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">About This Hotel</h2>
                <p className="whitespace-pre-line text-gray-700">
                  {hotelDetails.hotelDescription}
                </p>
              </div>
            )}

            {/* Amenities Tab */}
            {activeTab === "amenities" && (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Facilities</h2>
                {hotelDetails.facilities && hotelDetails.facilities.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {hotelDetails.facilities.map((facility) => (
                      <div key={facility.id} className="flex items-center gap-3 rounded-lg border p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <Info className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{facility.name}</p>
                          {facility.category && (
                            <p className="text-sm text-gray-600">{facility.category}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No facilities information available</p>
                )}
              </div>
            )}

            {/* Policies Tab */}
            {activeTab === "policies" && (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Hotel Policies</h2>
                <div className="space-y-4">
                  {hotelDetails.hotelPolicy ? (
                    <div className="rounded-lg border p-4">
                      <p className="whitespace-pre-line text-gray-700">
                        {hotelDetails.hotelPolicy}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-600">No policy information available</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-lg text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <HotelDetailsContent params={params} />
    </Suspense>
  );
}
