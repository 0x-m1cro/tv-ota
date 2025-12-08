"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SearchMode } from "@/types";

export default function Home() {
  const [searchMode, setSearchMode] = useState<SearchMode>("destination");
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    const params = new URLSearchParams({
      destination: searchMode === "destination" ? destination : "Maldives",
      checkIn,
      checkOut,
      adults: guests,
      children: "0",
      rooms: "1",
    });

    if (searchMode === "vibe" && destination) {
      params.append("vibe", destination);
    }

    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl lg:text-7xl">
            Discover Paradise in the Maldives
          </h1>
          <p className="mb-12 max-w-2xl text-xl text-white/90 md:text-2xl">
            Find your perfect island escape at the world&apos;s most luxurious resorts
          </p>

          {/* Search Card */}
          <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl md:p-8">
            {/* Search Mode Toggle */}
            <div className="mb-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setSearchMode("destination")}
                className={`flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all ${
                  searchMode === "destination"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Search className="h-5 w-5" />
                Search by Destination
              </button>
              <button
                onClick={() => setSearchMode("vibe")}
                className={`flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all ${
                  searchMode === "vibe"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Sparkles className="h-5 w-5" />
                Search by Vibe
              </button>
            </div>

            {/* Search Form */}
            {searchMode === "destination" ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Input
                  label="Destination"
                  placeholder="City or Hotel Name"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
                <Input
                  label="Check-in"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
                <Input
                  label="Check-out"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
                <div>
                  <Input
                    label="Guests"
                    type="number"
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="mb-4 text-lg text-gray-600">
                    Choose your vibe and we&apos;ll find the perfect match
                  </p>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                      { vibe: "Romantic Water Villas", icon: "💑" },
                      { vibe: "Budget Beachfront", icon: "🏖️" },
                      { vibe: "Luxury All-Inclusive", icon: "✨" },
                      { vibe: "Family Paradise", icon: "👨‍👩‍👧‍👦" },
                    ].map(({ vibe, icon }) => (
                      <button
                        key={vibe}
                        onClick={() => setDestination(vibe)}
                        className={`rounded-lg border-2 px-6 py-4 font-medium transition-all ${
                          destination === vibe
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-gray-200 bg-white text-gray-700 hover:border-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <div className="text-2xl">{icon}</div>
                        <div className="mt-2 text-sm">{vibe}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Input
                    label="Check-in"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                  <Input
                    label="Check-out"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                  <Input
                    label="Guests"
                    type="number"
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <Button size="lg" onClick={handleSearch} className="px-12">
                Search Hotels
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
          Why Choose Maldives Only?
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Easy Search
            </h3>
            <p className="text-gray-600">
              Find your perfect hotel with our intuitive search and filtering
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Best Selection
            </h3>
            <p className="text-gray-600">
              Access to the finest resorts and hotels across the Maldives
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Secure Booking
            </h3>
            <p className="text-gray-600">
              Book with confidence using our secure payment system
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
