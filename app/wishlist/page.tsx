"use client";

import { Heart, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/lib/store";
import HotelCard from "@/components/hotel/HotelCard";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const router = useRouter();
  const { items, clearWishlist } = useWishlistStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600">
                {items.length} {items.length === 1 ? "resort" : "resorts"} saved
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("Are you sure you want to clear your wishlist?")) {
                  clearWishlist();
                }
              }}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {/* Wishlist Content */}
        {items.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Heart className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Your wishlist is empty</h2>
            <p className="mb-6 text-gray-600">
              Save your favourite Maldives resorts to compare and book later
            </p>
            <Button onClick={() => router.push("/")}>
              Start Exploring
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <HotelCard
                key={item.hotelId}
                hotelId={item.hotelId}
                name={item.hotelName}
                image={item.hotelImage}
                rating={item.rating}
                location="Maldives"
                price={item.price}
              />
            ))}
          </div>
        )}

        {/* Call to Action */}
        {items.length > 0 && (
          <div className="mt-12 rounded-lg bg-blue-50 p-8 text-center">
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              Ready to book your dream vacation?
            </h3>
            <p className="mb-6 text-gray-600">
              Compare prices and availability for your saved resorts
            </p>
            <Button onClick={() => router.push("/")}>
              Search with Dates
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
