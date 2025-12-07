"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Download, Mail, MapPin, Calendar, Users, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { BookingData } from "@/types/liteapi";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    if (!bookingId) {
      setError("No booking ID provided");
      setLoading(false);
      return;
    }

    async function fetchBooking() {
      try {
        const response = await fetch(`/api/booking/${bookingId}`);
        if (!response.ok) throw new Error("Failed to fetch booking details");
        
        const data = await response.json();
        setBookingData(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load booking");
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [bookingId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-lg text-gray-600">Loading confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <p className="text-lg text-red-800">{error || "Booking not found"}</p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Your reservation has been successfully confirmed
          </p>
        </div>

        {/* Booking Details Card */}
        <Card className="mx-auto mb-6 max-w-3xl p-8">
          {/* Booking IDs */}
          <div className="mb-8 grid grid-cols-1 gap-4 border-b pb-6 md:grid-cols-2">
            <div>
              <p className="mb-1 text-sm font-medium text-gray-600">Booking ID</p>
              <p className="text-lg font-bold text-gray-900">{bookingData.bookingId}</p>
            </div>
            {bookingData.hotelConfirmationCode && (
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600">
                  Hotel Confirmation Code
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {bookingData.hotelConfirmationCode}
                </p>
              </div>
            )}
          </div>

          {/* Hotel Details */}
          <div className="mb-8 border-b pb-6">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              {bookingData.hotel?.name || "Hotel"}
            </h2>
            {bookingData.hotel?.address && (
              <div className="mb-4 flex items-start gap-2 text-gray-600">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{bookingData.hotel.address}</span>
              </div>
            )}
          </div>

          {/* Stay Details */}
          <div className="mb-8 space-y-4 border-b pb-6">
            <h3 className="text-xl font-semibold text-gray-900">Stay Details</h3>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Check-in</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(bookingData.checkin)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Check-out</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(bookingData.checkout)}
                  </p>
                </div>
              </div>
            </div>

            {bookingData.rooms && bookingData.rooms.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-gray-600">Room Details</p>
                {bookingData.rooms.map((room, index: number) => (
                  <div key={index} className="rounded-lg bg-gray-50 p-3">
                    <p className="font-semibold text-gray-900">{room.roomName}</p>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>
                        {room.adults} {room.adults === 1 ? "Adult" : "Adults"}
                        {room.children > 0 && `, ${room.children} ${room.children === 1 ? "Child" : "Children"}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Guest Information */}
          <div className="mb-8 border-b pb-6">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">Guest Information</h3>
            <div className="space-y-2">
              <p className="text-gray-900">
                <span className="font-medium">Name:</span>{" "}
                {bookingData.guestInfo?.firstName} {bookingData.guestInfo?.lastName}
              </p>
              <p className="text-gray-900">
                <span className="font-medium">Email:</span> {bookingData.guestInfo?.email}
              </p>
            </div>
          </div>

          {/* Price Summary */}
          {bookingData.price && (
            <div className="mb-6">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">Payment Summary</h3>
              <div className="flex items-center justify-between text-2xl font-bold">
                <span className="text-gray-900">Total Paid</span>
                <span className="text-blue-600">
                  {bookingData.price.currency} {bookingData.price.total.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.print()}
            >
              <Download className="mr-2 h-5 w-5" />
              Download Confirmation
            </Button>
            <Button variant="outline" className="w-full">
              <Mail className="mr-2 h-5 w-5" />
              Email Confirmation
            </Button>
          </div>
        </Card>

        {/* Important Information */}
        <Card className="mx-auto max-w-3xl p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Important Information</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <p>
                A confirmation email has been sent to {bookingData.guestInfo?.email}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <p>
                Please present your booking confirmation at check-in
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <p>
                For any changes or questions, please contact the hotel directly or our support team
              </p>
            </div>
            {bookingData.cancellationPolicies && (
              <div className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                <p>
                  {bookingData.cancellationPolicies.refundableTag === "refundable"
                    ? "Free cancellation available until specified date"
                    : "Non-refundable booking"}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Return Home Button */}
        <div className="mt-8 text-center">
          <Button onClick={() => router.push("/")}>
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
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
      <ConfirmationContent />
    </Suspense>
  );
}
