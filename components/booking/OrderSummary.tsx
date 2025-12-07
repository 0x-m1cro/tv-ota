"use client";

import { Calendar, Users, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface OrderSummaryProps {
  hotelName?: string;
  hotelImage?: string;
  roomName?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  boardType?: string;
  price?: {
    subtotal: number;
    taxes: number;
    fees: number;
    total: number;
    currency: string;
  };
}

export default function OrderSummary({
  hotelName = "Loading...",
  hotelImage,
  roomName = "Loading...",
  checkIn,
  checkOut,
  guests = 2,
  boardType,
  price,
}: OrderSummaryProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  return (
    <Card className="sticky top-20 p-6">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Booking Summary</h2>

      {/* Hotel Image & Name */}
      <div className="mb-6">
        {hotelImage && (
          <div className="mb-3 aspect-video overflow-hidden rounded-lg">
            <img src={hotelImage} alt={hotelName} className="h-full w-full object-cover" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900">{hotelName}</h3>
        <p className="mt-1 text-sm text-gray-600">{roomName}</p>
        {boardType && (
          <span className="mt-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
            {boardType}
          </span>
        )}
      </div>

      {/* Stay Details */}
      <div className="mb-6 space-y-3 border-t pt-4">
        <div className="flex items-start gap-3">
          <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Check-in</p>
            <p className="text-sm text-gray-600">{formatDate(checkIn)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Check-out</p>
            <p className="text-sm text-gray-600">{formatDate(checkOut)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Users className="mt-0.5 h-5 w-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Guests</p>
            <p className="text-sm text-gray-600">
              {guests} {guests === 1 ? "Guest" : "Guests"}
            </p>
          </div>
        </div>

        {nights > 0 && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Duration</p>
              <p className="text-sm text-gray-600">
                {nights} {nights === 1 ? "Night" : "Nights"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      {price && (
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Subtotal ({nights} {nights === 1 ? "night" : "nights"})
            </span>
            <span className="font-medium text-gray-900">
              {price.currency} {price.subtotal.toFixed(2)}
            </span>
          </div>

          {price.taxes > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Taxes & Fees</span>
              <span className="font-medium text-gray-900">
                {price.currency} {price.taxes.toFixed(2)}
              </span>
            </div>
          )}

          {price.fees > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Service Fees</span>
              <span className="font-medium text-gray-900">
                {price.currency} {price.fees.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-blue-600">
              {price.currency} {price.total.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="mt-6 space-y-2 border-t pt-4">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Secure checkout</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Instant confirmation</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Best price guarantee</span>
        </div>
      </div>
    </Card>
  );
}
