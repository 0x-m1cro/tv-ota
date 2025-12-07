"use client";

import Link from "next/link";
import { Heart, MapPin, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useWishlistStore } from "@/lib/store";
import { useState } from "react";

interface HotelCardProps {
  hotelId: string;
  name: string;
  image?: string;
  rating?: number;
  starRating?: number;
  location?: string;
  price?: {
    amount: number;
    currency: string;
  };
  amenities?: string[];
  isRefundable?: boolean;
  boardType?: string;
  offerId?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export default function HotelCard({
  hotelId,
  name,
  image,
  rating,
  starRating,
  location,
  price,
  amenities,
  isRefundable,
  boardType,
  offerId,
  checkIn,
  checkOut,
  guests,
}: HotelCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const [isHovered, setIsHovered] = useState(false);
  const inWishlist = isInWishlist(hotelId);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(hotelId);
    } else {
      addToWishlist({
        hotelId,
        hotelName: name,
        hotelImage: image,
        rating,
        price,
        addedAt: new Date().toISOString(),
      });
    }
  };

  const buildHotelLink = () => {
    const params = new URLSearchParams();
    if (offerId) params.append("offerId", offerId);
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (guests) params.append("guests", guests.toString());
    return `/hotels/${hotelId}${params.toString() ? `?${params.toString()}` : ""}`;
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 9) return "Exceptional";
    if (rating >= 8) return "Excellent";
    if (rating >= 7) return "Very Good";
    if (rating >= 6) return "Good";
    return "Pleasant";
  };

  return (
    <Link href={buildHotelLink()}>
      <Card
        className="group overflow-hidden transition-all hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-200">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-400 to-cyan-300 text-white">
              <MapPin className="h-16 w-16 opacity-50" />
            </div>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 backdrop-blur transition-all hover:bg-white hover:scale-110"
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                inWishlist ? "fill-red-500 text-red-500" : "text-gray-700"
              }`}
            />
          </button>

          {/* Price Badge */}
          {price && (
            <div className="absolute bottom-3 right-3 rounded-lg bg-blue-600 px-3 py-1.5 text-white shadow-lg">
              <div className="text-xs font-medium">From</div>
              <div className="text-lg font-bold">
                {price.currency} {price.amount.toFixed(0)}
              </div>
              <div className="text-xs">/ night</div>
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Star Rating */}
          {starRating && (
            <div className="mb-2 flex items-center gap-1">
              {Array.from({ length: starRating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          )}

          {/* Hotel Name */}
          <h3 className="mb-2 text-xl font-semibold text-gray-900 line-clamp-2">
            {name}
          </h3>

          {/* Location */}
          {location && (
            <div className="mb-3 flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          )}

          {/* Rating */}
          {rating && (
            <div className="mb-3 flex items-center gap-2">
              <div className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-sm font-bold text-white">
                {rating.toFixed(1)}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {getRatingLabel(rating)}
              </span>
            </div>
          )}

          {/* Tags/Badges */}
          <div className="mb-3 flex flex-wrap gap-2">
            {isRefundable && (
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                Free Cancellation
              </span>
            )}
            {boardType && boardType !== "RO" && (
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                {boardType === "BB"
                  ? "Breakfast"
                  : boardType === "HB"
                  ? "Half Board"
                  : boardType === "FB"
                  ? "Full Board"
                  : boardType === "AI"
                  ? "All Inclusive"
                  : boardType}
              </span>
            )}
          </div>

          {/* View Hotel Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            View Details →
          </Button>
        </div>
      </Card>
    </Link>
  );
}
