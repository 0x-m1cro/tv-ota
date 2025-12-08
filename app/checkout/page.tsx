"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Loader2 } from "lucide-react";
import CheckoutForm, { GuestFormData } from "@/components/booking/CheckoutForm";
import OrderSummary from "@/components/booking/OrderSummary";
import PaymentSDK from "@/components/booking/PaymentSDK";
import Button from "@/components/ui/Button";
import { useBookingStore } from "@/lib/store";
import type { HotelDetails, PrebookData } from "@/types/liteapi";

type CheckoutStep = "guest-info" | "payment" | "processing";

export default function CheckoutPage() {
  const router = useRouter();
  const { prebookId, hotelId, checkIn, checkOut, guests, transactionId, secretKey, clearBookingData } = useBookingStore();
  
  const [step, setStep] = useState<CheckoutStep>("guest-info");
  const [guestData, setGuestData] = useState<GuestFormData | null>(null);
  const [prebookDetails, setPrebookDetails] = useState<Partial<PrebookData> | null>(null);
  const [hotelDetails, setHotelDetails] = useState<HotelDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have prebook data
    if (!prebookId || !hotelId) {
      router.push("/");
      return;
    }

    // Fetch prebook details to show pricing
    async function fetchDetails() {
      try {
        setLoading(true);

        // Get hotel details
        const hotelRes = await fetch(`/api/hotels/${hotelId}`);
        if (hotelRes.ok) {
          const hotelData = await hotelRes.json();
          setHotelDetails(hotelData.data);
        }

        // In a real implementation, you would fetch prebook details here
        // For now, we'll use mock data based on what we have
        setPrebookDetails({
          hotel: "Loading...",
        } as Partial<PrebookData>);

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load booking details");
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [prebookId, hotelId, checkIn, checkOut, guests, router]);

  const handleGuestInfoSubmit = (data: GuestFormData) => {
    setGuestData(data);
    
    // If payment SDK is enabled, show payment step
    if (secretKey && transactionId) {
      setStep("payment");
    } else {
      // Otherwise, complete booking directly
      handleCompleteBooking(data);
    }
  };

  const handleCompleteBooking = async (guestInfo: GuestFormData) => {
    try {
      setStep("processing");

      const bookingResponse = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prebookId,
          holder: {
            firstName: guestInfo.firstName,
            lastName: guestInfo.lastName,
            email: guestInfo.email,
            phone: guestInfo.phone || "",
          },
          payment: {
            method: transactionId ? "sdk" : "card",
            transactionId: transactionId,
          },
          specialRequests: guestInfo.specialRequests,
        }),
      });

      if (!bookingResponse.ok) {
        throw new Error("Failed to complete booking");
      }

      const bookingData = await bookingResponse.json();

      // Clear booking store
      clearBookingData();

      // Redirect to confirmation page
      router.push(`/booking/confirmation?bookingId=${bookingData.data.bookingId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete booking");
      setStep("guest-info");
    }
  };

  const handlePaymentComplete = () => {
    if (guestData) {
      handleCompleteBooking(guestData);
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setStep("guest-info");
  };

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-lg text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!prebookId || !hotelId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <p className="text-lg text-red-800">No booking data found</p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            Start New Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2 text-green-600">
              <Lock className="h-5 w-5" />
              <span className="text-sm font-medium">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              {/* Progress Indicator */}
              <div className="mb-8 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      step === "guest-info" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-sm font-medium">Guest Info</span>
                </div>
                <div className="h-0.5 w-12 bg-gray-200" />
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      step === "payment" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-sm font-medium">Payment</span>
                </div>
                <div className="h-0.5 w-12 bg-gray-200" />
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      step === "processing" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-sm font-medium">Confirm</span>
                </div>
              </div>

              {/* Step Content */}
              {step === "guest-info" && (
                <CheckoutForm onSubmit={handleGuestInfoSubmit} />
              )}

              {step === "payment" && secretKey && (
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">Payment</h2>
                  <PaymentSDK
                    secretKey={secretKey}
                    returnUrl={`${window.location.origin}/booking/confirmation`}
                    onPaymentComplete={handlePaymentComplete}
                    onPaymentError={handlePaymentError}
                  />
                </div>
              )}

              {step === "processing" && (
                <div className="py-12 text-center">
                  <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-600" />
                  <h2 className="mt-4 text-2xl font-bold text-gray-900">
                    Processing your booking...
                  </h2>
                  <p className="mt-2 text-gray-600">Please wait while we confirm your reservation</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <OrderSummary
              hotelName={hotelDetails?.name || prebookDetails?.hotel || "Loading..."}
              hotelImage={hotelDetails?.images?.[0]?.url}
              roomName={prebookDetails?.rooms?.[0]?.roomName}
              checkIn={checkIn || undefined}
              checkOut={checkOut || undefined}
              guests={guests}
              boardType={prebookDetails?.boardName}
              price={
                prebookDetails?.price
                  ? {
                      subtotal: prebookDetails.price.baseFare || 0,
                      taxes: prebookDetails.price.tax || 0,
                      fees: 0,
                      total: prebookDetails.price.total || 0,
                      currency: prebookDetails.price.currency || "USD",
                    }
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
