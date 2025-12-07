"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, Loader2, SlidersHorizontal } from "lucide-react";
import HotelCard from "@/components/hotel/HotelCard";
import FiltersPanel, { FilterOptions } from "@/components/search/FiltersPanel";
import Button from "@/components/ui/Button";
import type { HotelOffer, HotelDetails } from "@/types/liteapi";

interface HotelWithDetails extends HotelOffer {
  hotelDetails?: HotelDetails;
  minPrice?: number;
  maxRating?: number;
  hasRefundable?: boolean;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const [hotels, setHotels] = useState<HotelWithDetails[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<HotelWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"price" | "rating" | "name">("price");
  
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000],
    starRating: [],
    boardTypes: [],
    amenities: [],
    isRefundable: false,
  });

  // Get search parameters
  const destination = searchParams.get("destination") || "Maldives";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const adults = parseInt(searchParams.get("adults") || "2");
  const children = parseInt(searchParams.get("children") || "0");
  const rooms = parseInt(searchParams.get("rooms") || "1");

  useEffect(() => {
    async function fetchHotels() {
      if (!checkIn || !checkOut) {
        setError("Please select check-in and check-out dates");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cityName: destination,
            countryCode: "MV",
            checkin: checkIn,
            checkout: checkOut,
            currency: "USD",
            guestNationality: "US",
            occupancies: Array(rooms).fill({
              rooms: 1,
              adults: Math.floor(adults / rooms),
              children: children > 0 ? [children] : [],
            }),
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch hotels");
        
        const data = await response.json();
        
        // Enrich hotel data with computed fields
        const enrichedHotels = data.data.map((hotel: HotelOffer) => {
          const allRates = hotel.roomTypes.flatMap((rt) => rt.rates);
          const prices = allRates.map((r) => r.retailRate.total[0]?.amount || 0);
          const ratings = allRates.map((r) => parseFloat(r.name) || 0);
          const hasRefundable = allRates.some(
            (r) => r.cancellationPolicies.refundableTag === "refundable"
          );

          return {
            ...hotel,
            minPrice: Math.min(...prices),
            maxRating: Math.max(...ratings),
            hasRefundable,
          };
        });

        setHotels(enrichedHotels);
        setFilteredHotels(enrichedHotels);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchHotels();
  }, [destination, checkIn, checkOut, adults, children, rooms]);

  // Apply filters
  useEffect(() => {
    let filtered = [...hotels];

    // Price filter
    filtered = filtered.filter(
      (h) =>
        h.minPrice &&
        h.minPrice >= filters.priceRange[0] &&
        h.minPrice <= filters.priceRange[1]
    );

    // Refundable filter
    if (filters.isRefundable) {
      filtered = filtered.filter((h) => h.hasRefundable);
    }

    // Board type filter
    if (filters.boardTypes.length > 0) {
      filtered = filtered.filter((h) =>
        h.roomTypes.some((rt) =>
          rt.rates.some((r) => filters.boardTypes.includes(r.boardType))
        )
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "price") {
        return (a.minPrice || 0) - (b.minPrice || 0);
      }
      if (sortBy === "rating") {
        return (b.maxRating || 0) - (a.maxRating || 0);
      }
      return 0;
    });

    setFilteredHotels(filtered);
  }, [hotels, filters, sortBy]);

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-lg text-gray-600">Searching for hotels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <p className="text-lg text-red-800">{error}</p>
          <Button className="mt-4" onClick={() => window.location.href = "/"}>
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Summary */}
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Hotels in {destination}
        </h1>
        <p className="text-gray-600">
          {checkIn} - {checkOut} • {adults} adults • {rooms} room{rooms > 1 ? "s" : ""}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {filteredHotels.length} {filteredHotels.length === 1 ? "hotel" : "hotels"} found
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="rounded-lg border border-gray-300 px-4 py-2"
        >
          <option value="price">Price: Low to High</option>
          <option value="rating">Rating: High to Low</option>
          <option value="name">Name</option>
        </select>
      </div>

      <div className="flex gap-6">
        {/* Desktop Filters */}
        {showFilters && (
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-20">
              <FiltersPanel filters={filters} onFilterChange={setFilters} />
            </div>
          </aside>
        )}

        {/* Mobile Filters */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto bg-white">
              <FiltersPanel
                filters={filters}
                onFilterChange={setFilters}
                onClose={() => setShowFilters(false)}
                isMobile
              />
            </div>
          </div>
        )}

        {/* Hotel Grid */}
        <div className="flex-1">
          {filteredHotels.length === 0 ? (
            <div className="rounded-lg bg-gray-50 p-12 text-center">
              <Filter className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                No hotels found
              </h3>
              <p className="mt-2 text-gray-600">
                Try adjusting your filters or search criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredHotels.map((hotel) => {
                const bestRate = hotel.roomTypes[0]?.rates[0];
                return (
                  <HotelCard
                    key={hotel.hotelId}
                    hotelId={hotel.hotelId}
                    name={hotel.hotelDetails?.name || hotel.hotelId}
                    image={hotel.hotelDetails?.images[0]?.url}
                    rating={hotel.maxRating}
                    starRating={hotel.hotelDetails?.star}
                    location="Maldives"
                    price={
                      bestRate
                        ? {
                            amount: bestRate.retailRate.total[0].amount,
                            currency: bestRate.retailRate.total[0].currency,
                          }
                        : undefined
                    }
                    isRefundable={hotel.hasRefundable}
                    boardType={bestRate?.boardName}
                    offerId={hotel.roomTypes[0]?.offerId}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    guests={adults}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
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
      <SearchResults />
    </Suspense>
  );
}
